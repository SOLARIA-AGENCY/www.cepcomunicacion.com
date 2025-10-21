#!/bin/bash

################################################################################
# PostgreSQL Migration Script - CEPComunicacion v2
################################################################################
# Description: Automated migration application script
# Usage: ./apply_migrations.sh [database_name] [environment]
# Example: ./apply_migrations.sh cepcomunicacion production
#          ./apply_migrations.sh cepcomunicacion_test development
################################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DATABASE_NAME=${1:-cepcomunicacion}
ENVIRONMENT=${2:-development}
POSTGRES_USER=${POSTGRES_USER:-postgres}
MIGRATIONS_DIR="$(dirname "$0")/migrations"
SEEDS_DIR="$(dirname "$0")/seeds"

################################################################################
# Helper Functions
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_postgres() {
    log_info "Checking PostgreSQL connection..."
    if ! psql -U "$POSTGRES_USER" -c '\q' 2>/dev/null; then
        log_error "Cannot connect to PostgreSQL. Is it running?"
        exit 1
    fi
    log_success "PostgreSQL is running"
}

check_database_exists() {
    log_info "Checking if database '$DATABASE_NAME' exists..."
    if psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "$DATABASE_NAME"; then
        log_warning "Database '$DATABASE_NAME' already exists"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Migration cancelled"
            exit 0
        fi
    else
        log_info "Database '$DATABASE_NAME' does not exist. Creating..."
        createdb -U "$POSTGRES_USER" "$DATABASE_NAME"
        log_success "Database '$DATABASE_NAME' created"
    fi
}

apply_migration() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file")

    log_info "Applying migration: $migration_name"

    if psql -U "$POSTGRES_USER" -d "$DATABASE_NAME" -f "$migration_file" > /dev/null 2>&1; then
        log_success "✓ $migration_name applied successfully"
        return 0
    else
        log_error "✗ $migration_name failed"
        return 1
    fi
}

apply_all_migrations() {
    log_info "Applying all migrations..."

    local migration_files=(
        "001_create_base_tables.sql"
        "002_create_courses.sql"
        "003_create_course_runs.sql"
        "004_create_campaigns.sql"
        "005_create_leads.sql"
        "006_create_content.sql"
        "007_create_media.sql"
        "008_create_metadata.sql"
        "009_create_audit.sql"
        "010_create_indexes.sql"
        "011_add_constraints.sql"
    )

    local failed=0

    for migration_file in "${migration_files[@]}"; do
        if ! apply_migration "$MIGRATIONS_DIR/$migration_file"; then
            failed=$((failed + 1))
        fi
    done

    if [ $failed -eq 0 ]; then
        log_success "All migrations applied successfully!"
        return 0
    else
        log_error "$failed migration(s) failed"
        return 1
    fi
}

load_seed_data() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log_warning "Skipping seed data in production environment"
        return 0
    fi

    log_info "Loading seed data..."

    if psql -U "$POSTGRES_USER" -d "$DATABASE_NAME" -f "$SEEDS_DIR/001_initial_data.sql" > /dev/null 2>&1; then
        log_success "Seed data loaded successfully"
        return 0
    else
        log_error "Failed to load seed data"
        return 1
    fi
}

verify_installation() {
    log_info "Verifying installation..."

    # Check table count
    local table_count=$(psql -U "$POSTGRES_USER" -d "$DATABASE_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)

    if [ "$table_count" -eq 13 ]; then
        log_success "✓ All 13 tables created"
    else
        log_error "✗ Expected 13 tables, found $table_count"
        return 1
    fi

    # Check index count
    local index_count=$(psql -U "$POSTGRES_USER" -d "$DATABASE_NAME" -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';" | xargs)

    if [ "$index_count" -ge 30 ]; then
        log_success "✓ Indexes created ($index_count total)"
    else
        log_warning "⚠ Expected 30+ indexes, found $index_count"
    fi

    # Check trigger count
    local trigger_count=$(psql -U "$POSTGRES_USER" -d "$DATABASE_NAME" -t -c "SELECT COUNT(*) FROM pg_trigger WHERE tgname LIKE 'update_%_updated_at';" | xargs)

    if [ "$trigger_count" -eq 11 ]; then
        log_success "✓ All 11 triggers created"
    else
        log_warning "⚠ Expected 11 triggers, found $trigger_count"
    fi

    # Check seed data (if development)
    if [ "$ENVIRONMENT" != "production" ]; then
        local course_count=$(psql -U "$POSTGRES_USER" -d "$DATABASE_NAME" -t -c "SELECT COUNT(*) FROM courses WHERE status = 'published';" | xargs)

        if [ "$course_count" -eq 5 ]; then
            log_success "✓ Seed data loaded (5 courses)"
        else
            log_warning "⚠ Expected 5 seed courses, found $course_count"
        fi
    fi

    log_success "Installation verified!"
}

print_summary() {
    echo ""
    echo "============================================"
    echo "  Migration Summary"
    echo "============================================"
    echo "  Database: $DATABASE_NAME"
    echo "  Environment: $ENVIRONMENT"
    echo "  Tables: 13"
    echo "  Indexes: 30+"
    echo "  Triggers: 11"
    echo "============================================"
    echo ""

    if [ "$ENVIRONMENT" != "production" ]; then
        log_warning "IMPORTANT: Change admin password!"
        echo "  Email: admin@cepcomunicacion.com"
        echo "  Default Password: admin123"
        echo ""
        echo "  Change password:"
        echo "  psql -U $POSTGRES_USER -d $DATABASE_NAME -c \\"
        echo "    \"UPDATE users SET password_hash = '<new_bcrypt_hash>' WHERE email = 'admin@cepcomunicacion.com';\""
        echo ""
    fi
}

print_next_steps() {
    echo "============================================"
    echo "  Next Steps"
    echo "============================================"
    echo "  1. Change admin password (if development)"
    echo "  2. Run tests: npm test infra/postgres/tests/migrations.test.ts"
    echo "  3. Configure backups: pg_dump daily"
    echo "  4. Set up monitoring: pg_stat_statements"
    echo "  5. Configure connection pooling: PgBouncer"
    echo "  6. Enable SSL/TLS (production only)"
    echo "============================================"
    echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
    echo ""
    echo "============================================"
    echo "  PostgreSQL Migration Script"
    echo "  CEPComunicacion v2"
    echo "============================================"
    echo ""

    # Pre-flight checks
    check_postgres
    check_database_exists

    # Apply migrations
    if ! apply_all_migrations; then
        log_error "Migration failed. Please check errors above."
        exit 1
    fi

    # Load seed data (development only)
    if [ "$ENVIRONMENT" != "production" ]; then
        load_seed_data
    fi

    # Verify installation
    verify_installation

    # Print summary
    print_summary
    print_next_steps

    log_success "Migration completed successfully!"
}

# Run main function
main
