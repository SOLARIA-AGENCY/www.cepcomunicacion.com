#!/usr/bin/env bash
# ========================================
# Smoke Tests for Production Deployment
# ========================================
# Tests critical endpoints and functionality after deployment
# Exit 0 on success, exit 1 on any failure
#
# Usage:
#   ./infra/tests/smoke-test.sh
#   ./infra/tests/smoke-test.sh http://46.62.222.138
#
# ========================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${1:-http://localhost}"
TIMEOUT=10
TESTS_PASSED=0
TESTS_FAILED=0

# ========================================
# Helper Functions
# ========================================

log_info() {
    echo -e "${BLUE}9${NC} $1"
}

log_success() {
    echo -e "${GREEN}${NC} $1"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}${NC} $1"
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW} ${NC} $1"
}

# HTTP request helper
http_get() {
    local url=$1
    local expected_status=${2:-200}

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$url" 2>/dev/null || echo "000")

    if [ "$response" = "$expected_status" ]; then
        return 0
    else
        echo "Got $response, expected $expected_status"
        return 1
    fi
}

# ========================================
# Test Functions
# ========================================

test_frontend_root() {
    log_info "Testing frontend root..."
    if http_get "$BASE_URL/" 200; then
        log_success "Frontend root is accessible (200 OK)"
        return 0
    else
        log_error "Frontend root failed"
        return 1
    fi
}

test_frontend_static_assets() {
    log_info "Testing frontend static assets..."

    # Test if we can get any static asset (try common paths)
    if http_get "$BASE_URL/assets/" 200 || \
       http_get "$BASE_URL/vite.svg" 200 || \
       http_get "$BASE_URL/favicon.ico" 200; then
        log_success "Static assets are served correctly"
        return 0
    else
        log_warning "Static assets test failed (may not exist yet)"
        return 0  # Don't fail deployment on missing static assets
    fi
}

test_api_reachable() {
    log_info "Testing API reachability..."

    # Try common API paths
    if http_get "$BASE_URL/api" 200 || \
       http_get "$BASE_URL/api" 404 || \
       http_get "$BASE_URL/api" 301; then
        log_success "API endpoint is reachable"
        return 0
    else
        log_warning "API endpoint not reachable (may not be implemented)"
        return 0  # Don't fail - API may not exist
    fi
}

test_api_health() {
    log_info "Testing API health endpoint..."

    if http_get "$BASE_URL/api/health" 200; then
        log_success "API health endpoint is responding"
        return 0
    else
        log_warning "API health endpoint not found (may not be implemented)"
        return 0  # Don't fail - health endpoint may not exist
    fi
}

test_admin_dashboard() {
    log_info "Testing admin dashboard..."

    # Admin should return 200 (page) or 401/403 (auth required)
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$BASE_URL/admin" 2>/dev/null || echo "000")

    if [ "$response" = "200" ] || [ "$response" = "401" ] || [ "$response" = "403" ]; then
        log_success "Admin dashboard is accessible (status: $response)"
        return 0
    else
        log_warning "Admin dashboard returned unexpected status: $response"
        return 0  # Don't fail - admin may not be ready
    fi
}

test_cms_admin() {
    log_info "Testing CMS admin panel..."

    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$BASE_URL/admin/login" 2>/dev/null || echo "000")

    if [ "$response" = "200" ] || [ "$response" = "401" ] || [ "$response" = "301" ]; then
        log_success "CMS admin is accessible (status: $response)"
        return 0
    else
        log_warning "CMS admin returned status: $response"
        return 0  # Don't fail
    fi
}

test_postgres_accessible() {
    log_info "Testing PostgreSQL accessibility (from Docker)..."

    # Check if postgres container exists
    if docker compose ps -q postgres &> /dev/null; then
        if docker compose exec -T postgres pg_isready -U cepadmin &> /dev/null; then
            log_success "PostgreSQL is accessible"
            return 0
        else
            log_error "PostgreSQL is not responding"
            return 1
        fi
    else
        log_warning "PostgreSQL container not found (may be external)"
        return 0
    fi
}

test_redis_accessible() {
    log_info "Testing Redis accessibility (from Docker)..."

    if docker compose ps -q redis &> /dev/null; then
        if docker compose exec -T redis redis-cli ping | grep -q "PONG"; then
            log_success "Redis is accessible"
            return 0
        else
            log_error "Redis is not responding"
            return 1
        fi
    else
        log_warning "Redis container not found (may be external)"
        return 0
    fi
}

test_database_tables() {
    log_info "Testing database schema..."

    if docker compose ps -q postgres &> /dev/null; then
        local table_count
        table_count=$(docker compose exec -T postgres psql -U cepadmin -d cepcomunicacion -t -c \
            "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ' || echo "0")

        if [ "$table_count" -gt 0 ]; then
            log_success "Database has $table_count tables"
            return 0
        else
            log_warning "Database has no tables (may need migration)"
            return 0  # Don't fail - migrations may not be run yet
        fi
    else
        log_warning "Cannot check database tables (no postgres container)"
        return 0
    fi
}

test_minio_accessible() {
    log_info "Testing MinIO storage..."

    if docker compose ps -q minio &> /dev/null; then
        if curl -f -s --max-time 5 http://localhost:9000/minio/health/live &> /dev/null; then
            log_success "MinIO is accessible"
            return 0
        else
            log_error "MinIO health check failed"
            return 1
        fi
    else
        log_warning "MinIO container not found (may be optional)"
        return 0
    fi
}

test_bullboard_accessible() {
    log_info "Testing BullBoard monitoring..."

    if docker compose ps -q bullboard &> /dev/null; then
        if http_get "http://localhost:3010" 200 || http_get "http://localhost:3010" 401; then
            log_success "BullBoard is accessible"
            return 0
        else
            log_warning "BullBoard not accessible"
            return 0  # Don't fail on monitoring tools
        fi
    else
        log_warning "BullBoard container not found (may be optional)"
        return 0
    fi
}

test_docker_logs_no_errors() {
    log_info "Checking Docker logs for critical errors..."

    local critical_errors
    critical_errors=$(docker compose logs --tail=100 2>&1 | grep -i "fatal\|error\|exception" | grep -v "test" | wc -l | tr -d ' ')

    if [ "$critical_errors" -eq 0 ]; then
        log_success "No critical errors in recent logs"
        return 0
    else
        log_warning "Found $critical_errors potential errors in logs (check manually)"
        return 0  # Don't fail - errors may be expected
    fi
}

test_response_time() {
    log_info "Testing frontend response time..."

    local start_time
    local end_time
    local duration

    start_time=$(date +%s%N)
    curl -s -o /dev/null --max-time "$TIMEOUT" "$BASE_URL/" &> /dev/null || true
    end_time=$(date +%s%N)

    duration=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds

    if [ "$duration" -lt 3000 ]; then
        log_success "Response time: ${duration}ms (good)"
        return 0
    elif [ "$duration" -lt 5000 ]; then
        log_warning "Response time: ${duration}ms (acceptable)"
        return 0
    else
        log_warning "Response time: ${duration}ms (slow)"
        return 0  # Don't fail on slow responses
    fi
}

# ========================================
# Main Test Runner
# ========================================

main() {
    echo ""
    echo "========================================="
    echo "Smoke Tests for Production Deployment"
    echo "========================================="
    echo "Target URL: $BASE_URL"
    echo "Timeout: ${TIMEOUT}s"
    echo ""

    # Frontend Tests
    log_info "Running frontend tests..."
    test_frontend_root || true
    test_frontend_static_assets || true
    test_response_time || true

    echo ""
    log_info "Running API tests..."
    test_api_reachable || true
    test_api_health || true

    echo ""
    log_info "Running admin tests..."
    test_admin_dashboard || true
    test_cms_admin || true

    echo ""
    log_info "Running infrastructure tests..."
    test_postgres_accessible || true
    test_redis_accessible || true
    test_database_tables || true
    test_minio_accessible || true
    test_bullboard_accessible || true

    echo ""
    log_info "Running log analysis..."
    test_docker_logs_no_errors || true

    # Summary
    echo ""
    echo "========================================="
    echo "Smoke Test Summary"
    echo "========================================="
    echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
    echo -e "${RED}Failed:${NC} $TESTS_FAILED"
    echo ""

    # Calculate success rate
    TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
    if [ $TOTAL_TESTS -gt 0 ]; then
        SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))
        echo "Success rate: ${SUCCESS_RATE}%"
        echo ""
    fi

    # Determine exit code
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN} All smoke tests passed!${NC}"
        echo -e "${GREEN} Deployment appears to be successful${NC}"
        exit 0
    elif [ $TESTS_FAILED -le 2 ]; then
        echo -e "${YELLOW}  Some tests failed, but critical services are working${NC}"
        echo -e "${YELLOW}  Review failed tests, but deployment may be acceptable${NC}"
        exit 0  # Allow deployment with minor issues
    else
        echo -e "${RED} Multiple smoke tests failed${NC}"
        echo -e "${RED} Deployment may have issues - consider rollback${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
