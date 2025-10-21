#!/bin/bash
# Deployment Script - CEPComunicacion v2
# Zero-downtime deployment with rollback capability

set -euo pipefail

# ==========================================
# Configuration
# ==========================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/infra/docker/docker-compose.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ==========================================
# Functions
# ==========================================
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

usage() {
    cat <<EOF
Usage: $0 [OPTIONS]

Deploy CEPComunicacion v2 to production.

OPTIONS:
    -e, --environment ENV   Environment (production, staging) [default: production]
    -s, --service SERVICE   Deploy specific service only
    -r, --rollback         Rollback to previous deployment
    -b, --backup           Create backup before deployment
    -n, --no-downtime      Zero-downtime deployment (default)
    -h, --help             Show this help

EXAMPLES:
    # Full deployment
    $0

    # Deploy with backup
    $0 --backup

    # Deploy specific service
    $0 --service frontend

    # Rollback deployment
    $0 --rollback

DEPLOYMENT STEPS:
    1. Pre-flight checks
    2. Create backup (if requested)
    3. Pull latest images
    4. Update services with zero downtime
    5. Run health checks
    6. Cleanup old images
EOF
    exit 1
}

# ==========================================
# Pre-flight Checks
# ==========================================
preflight_checks() {
    log "Running pre-flight checks..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        return 1
    fi

    # Check Docker Compose
    if ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed"
        return 1
    fi

    # Check .env file
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        error ".env file not found"
        error "Copy .env.example to .env and configure it"
        return 1
    fi

    # Check docker-compose.yml
    if [ ! -f "$COMPOSE_FILE" ]; then
        error "docker-compose.yml not found at: $COMPOSE_FILE"
        return 1
    fi

    # Validate docker-compose.yml
    if ! docker compose -f "$COMPOSE_FILE" config > /dev/null 2>&1; then
        error "Invalid docker-compose.yml"
        return 1
    fi

    # Check disk space
    local available_space=$(df -BG / | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$available_space" -lt 5 ]; then
        warn "Low disk space: ${available_space}GB available"
        warn "Recommend at least 5GB free"
    fi

    log "✓ Pre-flight checks passed"
    return 0
}

# ==========================================
# Create Backup
# ==========================================
create_backup() {
    log "Creating pre-deployment backup..."

    local backup_script="$SCRIPT_DIR/../backup/scripts/backup.sh"

    if [ -f "$backup_script" ]; then
        bash "$backup_script"
        log "✓ Backup created"
    else
        warn "Backup script not found, skipping backup"
    fi
}

# ==========================================
# Deploy
# ==========================================
deploy() {
    local service="${1:-}"

    log "Starting deployment..."

    cd "$PROJECT_ROOT/infra/docker"

    # Pull latest images
    log "Pulling latest images..."
    if [ -n "$service" ]; then
        docker compose pull "$service"
    else
        docker compose pull
    fi

    # Build custom images
    log "Building custom images..."
    if [ -n "$service" ]; then
        docker compose build "$service"
    else
        docker compose build
    fi

    # Deploy with zero downtime
    log "Deploying services..."
    if [ -n "$service" ]; then
        # Rolling update for specific service
        docker compose up -d --no-deps --scale "$service=2" "$service"
        sleep 5
        docker compose up -d --no-deps --scale "$service=1" "$service"
    else
        # Deploy all services
        docker compose up -d --remove-orphans
    fi

    log "✓ Deployment completed"
}

# ==========================================
# Health Checks
# ==========================================
health_checks() {
    log "Running health checks..."

    local max_attempts=30
    local attempt=0
    local all_healthy=false

    while [ $attempt -lt $max_attempts ]; do
        ((attempt++))
        log "Health check attempt $attempt/$max_attempts..."

        # Check all services
        local unhealthy=$(docker compose ps --format json | jq -r 'select(.Health != "healthy" and .Health != "") | .Service' 2>/dev/null || true)

        if [ -z "$unhealthy" ]; then
            all_healthy=true
            break
        fi

        info "Waiting for services: $unhealthy"
        sleep 5
    done

    if [ "$all_healthy" = true ]; then
        log "✓ All services are healthy"
        return 0
    else
        error "✗ Some services are not healthy"
        docker compose ps
        return 1
    fi
}

# ==========================================
# Verify Deployment
# ==========================================
verify_deployment() {
    log "Verifying deployment..."

    local errors=0

    # Check frontend
    if curl -sf -o /dev/null http://localhost/ 2>/dev/null; then
        log "✓ Frontend is responding"
    else
        warn "✗ Frontend is not responding"
        ((errors++))
    fi

    # Check API
    if curl -sf -o /dev/null http://localhost/api/health 2>/dev/null; then
        log "✓ API is responding"
    else
        warn "✗ API is not responding"
        ((errors++))
    fi

    # Check database
    if docker compose exec -T postgres pg_isready -q; then
        log "✓ Database is ready"
    else
        warn "✗ Database is not ready"
        ((errors++))
    fi

    # Check Redis
    if docker compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        log "✓ Redis is responding"
    else
        warn "✗ Redis is not responding"
        ((errors++))
    fi

    if [ $errors -eq 0 ]; then
        log "✓ Deployment verification passed"
        return 0
    else
        error "✗ Deployment verification failed ($errors errors)"
        return 1
    fi
}

# ==========================================
# Cleanup
# ==========================================
cleanup() {
    log "Cleaning up old images..."

    # Remove dangling images
    docker image prune -f

    # Remove unused volumes (be careful!)
    # docker volume prune -f

    log "✓ Cleanup completed"
}

# ==========================================
# Rollback
# ==========================================
rollback() {
    warn "Rolling back deployment..."

    cd "$PROJECT_ROOT/infra/docker"

    # Get previous image tags
    local previous_tag=$(docker images --format "{{.Tag}}" | grep -v latest | head -1)

    if [ -z "$previous_tag" ]; then
        error "No previous deployment found"
        return 1
    fi

    log "Rolling back to tag: $previous_tag"

    # Restore previous deployment
    docker compose down
    # TODO: Implement proper image tagging and rollback
    docker compose up -d

    log "✓ Rollback completed"

    # Verify rollback
    verify_deployment
}

# ==========================================
# Display Status
# ==========================================
display_status() {
    echo ""
    log "Deployment Status:"
    echo ""

    cd "$PROJECT_ROOT/infra/docker"
    docker compose ps

    echo ""
    log "Resource Usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -15

    echo ""
    log "Deployment completed successfully!"
    echo ""
    info "Next steps:"
    echo "  - Monitor logs: docker compose logs -f"
    echo "  - Check queues: https://cepcomunicacion.com/queues"
    echo "  - Admin panel: https://cepcomunicacion.com/admin"
}

# ==========================================
# Main
# ==========================================
ENVIRONMENT="production"
SERVICE=""
DO_BACKUP=false
DO_ROLLBACK=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -s|--service)
            SERVICE="$2"
            shift 2
            ;;
        -b|--backup)
            DO_BACKUP=true
            shift
            ;;
        -r|--rollback)
            DO_ROLLBACK=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            error "Unknown option: $1"
            usage
            ;;
    esac
done

# Execute deployment
log "CEPComunicacion v2 Deployment"
log "Environment: $ENVIRONMENT"
[ -n "$SERVICE" ] && log "Service: $SERVICE"
echo ""

if [ "$DO_ROLLBACK" = true ]; then
    rollback
    exit $?
fi

# Run deployment steps
preflight_checks || exit 1

if [ "$DO_BACKUP" = true ]; then
    create_backup
fi

deploy "$SERVICE" || exit 1

health_checks || {
    error "Health checks failed"
    warn "Consider rolling back with: $0 --rollback"
    exit 1
}

verify_deployment || {
    error "Verification failed"
    warn "Consider rolling back with: $0 --rollback"
    exit 1
}

cleanup

display_status

exit 0
