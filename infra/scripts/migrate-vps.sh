#!/bin/bash
# VPS Migration Script
# Migrates entire CEPComunicacion deployment to new VPS

set -euo pipefail

# ==========================================
# Configuration
# ==========================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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
    exit 1
}

usage() {
    cat <<EOF
Usage: $0 COMMAND [OPTIONS]

Migrate CEPComunicacion deployment to new VPS.

COMMANDS:
    export      Export all data from current VPS
    import      Import data to new VPS
    verify      Verify migration success

OPTIONS:
    -h, --help      Show this help message
    -o, --output    Output directory for export (default: ./migration-backup)
    -i, --input     Input directory for import

EXAMPLES:
    # On old VPS: Export all data
    $0 export -o /tmp/migration-backup

    # Transfer files to new VPS
    scp -r /tmp/migration-backup root@NEW_VPS_IP:/tmp/

    # On new VPS: Import all data
    $0 import -i /tmp/migration-backup

    # Verify migration
    $0 verify

MIGRATION STEPS:
    1. Run export on old VPS
    2. Transfer backup to new VPS
    3. Setup new VPS with Docker
    4. Run import on new VPS
    5. Update DNS to point to new VPS
    6. Verify with verify command
EOF
    exit 1
}

# ==========================================
# Export Function
# ==========================================
export_data() {
    local output_dir="${1:-./migration-backup}"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="${output_dir}/cep_migration_${timestamp}"

    log "Starting data export..."
    log "Output directory: $backup_dir"

    # Create backup directory
    mkdir -p "$backup_dir"/{database,volumes,config,ssl}

    # Export database
    log "Exporting PostgreSQL database..."
    docker compose exec -T postgres pg_dump \
        -U "${POSTGRES_USER:-cepadmin}" \
        -d "${POSTGRES_DB:-cepcomunicacion}" \
        | gzip -9 > "$backup_dir/database/dump.sql.gz"

    # Export Docker volumes
    log "Exporting Docker volumes..."

    # PostgreSQL data
    docker run --rm \
        -v cep_postgres-data:/data \
        -v "$backup_dir/volumes":/backup \
        alpine tar czf /backup/postgres-data.tar.gz -C /data .

    # Redis data
    docker run --rm \
        -v cep_redis-data:/data \
        -v "$backup_dir/volumes":/backup \
        alpine tar czf /backup/redis-data.tar.gz -C /data .

    # MinIO data
    docker run --rm \
        -v cep_minio-data:/data \
        -v "$backup_dir/volumes":/backup \
        alpine tar czf /backup/minio-data.tar.gz -C /data .

    # CMS uploads
    docker run --rm \
        -v cep_cms-uploads:/data \
        -v "$backup_dir/volumes":/backup \
        alpine tar czf /backup/cms-uploads.tar.gz -C /data .

    # Export configuration
    log "Exporting configuration files..."
    cp "$PROJECT_ROOT/.env" "$backup_dir/config/env.backup"
    cp "$PROJECT_ROOT/infra/docker/docker-compose.yml" "$backup_dir/config/"
    cp -r "$PROJECT_ROOT/infra/nginx" "$backup_dir/config/"

    # Export SSL certificates
    log "Exporting SSL certificates..."
    if [ -d "/etc/letsencrypt" ]; then
        sudo tar czf "$backup_dir/ssl/letsencrypt.tar.gz" -C /etc letsencrypt
    else
        warn "No Let's Encrypt certificates found"
    fi

    # Create manifest
    cat > "$backup_dir/MANIFEST.txt" <<EOF
CEPComunicacion Migration Backup
Created: $(date)
Hostname: $(hostname)
IP: $(hostname -I | awk '{print $1}')

Contents:
- database/dump.sql.gz          PostgreSQL database dump
- volumes/postgres-data.tar.gz  PostgreSQL data directory
- volumes/redis-data.tar.gz     Redis persistence
- volumes/minio-data.tar.gz     MinIO S3 storage
- volumes/cms-uploads.tar.gz    CMS uploaded files
- config/env.backup             Environment variables
- config/docker-compose.yml     Docker Compose configuration
- config/nginx/                 Nginx configuration
- ssl/letsencrypt.tar.gz        SSL certificates (if exists)

Migration Instructions:
1. Transfer this directory to new VPS
2. Run: migrate-vps.sh import -i $(basename $backup_dir)
3. Update DNS to point to new VPS IP
4. Verify: migrate-vps.sh verify
EOF

    # Calculate checksums
    log "Calculating checksums..."
    find "$backup_dir" -type f -exec sha256sum {} \; > "$backup_dir/checksums.txt"

    # Display summary
    log "Export completed successfully!"
    log "Backup location: $backup_dir"
    log "Backup size: $(du -sh "$backup_dir" | cut -f1)"
    echo ""
    log "Next steps:"
    echo "  1. Transfer backup to new VPS:"
    echo "     scp -r $backup_dir root@NEW_VPS_IP:/tmp/"
    echo ""
    echo "  2. On new VPS, run:"
    echo "     ./migrate-vps.sh import -i /tmp/$(basename $backup_dir)"
}

# ==========================================
# Import Function
# ==========================================
import_data() {
    local input_dir="${1:-}"

    if [ -z "$input_dir" ]; then
        error "Input directory required. Use: -i /path/to/backup"
    fi

    if [ ! -d "$input_dir" ]; then
        error "Input directory not found: $input_dir"
    fi

    log "Starting data import..."
    log "Source: $input_dir"

    # Verify checksums
    log "Verifying backup integrity..."
    if [ -f "$input_dir/checksums.txt" ]; then
        (cd "$input_dir" && sha256sum -c checksums.txt) || error "Checksum verification failed"
        log "Checksums verified successfully"
    else
        warn "No checksums file found, skipping verification"
    fi

    # Import configuration
    log "Importing configuration..."
    if [ -f "$input_dir/config/env.backup" ]; then
        cp "$input_dir/config/env.backup" "$PROJECT_ROOT/.env"
        log "Environment file restored"
    fi

    if [ -f "$input_dir/config/docker-compose.yml" ]; then
        cp "$input_dir/config/docker-compose.yml" "$PROJECT_ROOT/infra/docker/"
        log "Docker Compose configuration restored"
    fi

    if [ -d "$input_dir/config/nginx" ]; then
        cp -r "$input_dir/config/nginx" "$PROJECT_ROOT/infra/"
        log "Nginx configuration restored"
    fi

    # Start only database and MinIO services
    log "Starting database and storage services..."
    cd "$PROJECT_ROOT/infra/docker"
    docker compose up -d postgres redis minio

    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 10

    # Import database
    log "Importing PostgreSQL database..."
    gunzip -c "$input_dir/database/dump.sql.gz" | \
        docker compose exec -T postgres psql \
        -U "${POSTGRES_USER:-cepadmin}" \
        -d "${POSTGRES_DB:-cepcomunicacion}"

    # Stop services to restore volumes
    log "Stopping services to restore volumes..."
    docker compose down

    # Restore volumes
    log "Restoring Docker volumes..."

    # PostgreSQL data
    docker volume create cep_postgres-data
    docker run --rm \
        -v cep_postgres-data:/data \
        -v "$input_dir/volumes":/backup \
        alpine tar xzf /backup/postgres-data.tar.gz -C /data

    # Redis data
    docker volume create cep_redis-data
    docker run --rm \
        -v cep_redis-data:/data \
        -v "$input_dir/volumes":/backup \
        alpine tar xzf /backup/redis-data.tar.gz -C /data

    # MinIO data
    docker volume create cep_minio-data
    docker run --rm \
        -v cep_minio-data:/data \
        -v "$input_dir/volumes":/backup \
        alpine tar xzf /backup/minio-data.tar.gz -C /data

    # CMS uploads
    docker volume create cep_cms-uploads
    docker run --rm \
        -v cep_cms-uploads:/data \
        -v "$input_dir/volumes":/backup \
        alpine tar xzf /backup/cms-uploads.tar.gz -C /data

    # Restore SSL certificates
    if [ -f "$input_dir/ssl/letsencrypt.tar.gz" ]; then
        log "Restoring SSL certificates..."
        sudo tar xzf "$input_dir/ssl/letsencrypt.tar.gz" -C /etc/
        log "SSL certificates restored"
    else
        warn "No SSL certificates to restore"
    fi

    # Start all services
    log "Starting all services..."
    docker compose up -d

    # Wait for health checks
    log "Waiting for services to be healthy..."
    sleep 30

    log "Import completed successfully!"
    echo ""
    log "Next steps:"
    echo "  1. Verify services: docker compose ps"
    echo "  2. Check logs: docker compose logs"
    echo "  3. Run verification: ./migrate-vps.sh verify"
    echo "  4. Update DNS to point to this VPS"
}

# ==========================================
# Verify Function
# ==========================================
verify_migration() {
    log "Verifying migration..."

    local errors=0

    # Check Docker services
    log "Checking Docker services..."
    if docker compose ps | grep -q "Up"; then
        log "✓ Docker services are running"
    else
        error "✗ Docker services are not running"
        ((errors++))
    fi

    # Check database connection
    log "Checking database connection..."
    if docker compose exec -T postgres pg_isready -U "${POSTGRES_USER:-cepadmin}" > /dev/null 2>&1; then
        log "✓ Database is ready"
    else
        warn "✗ Database is not ready"
        ((errors++))
    fi

    # Check Redis
    log "Checking Redis..."
    if docker compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        log "✓ Redis is responding"
    else
        warn "✗ Redis is not responding"
        ((errors++))
    fi

    # Check MinIO
    log "Checking MinIO..."
    if curl -sf http://localhost:9000/minio/health/live > /dev/null 2>&1; then
        log "✓ MinIO is healthy"
    else
        warn "✗ MinIO is not healthy"
        ((errors++))
    fi

    # Check API endpoint
    log "Checking API endpoint..."
    if curl -sf http://localhost/api/health > /dev/null 2>&1; then
        log "✓ API is responding"
    else
        warn "✗ API is not responding"
        ((errors++))
    fi

    # Check frontend
    log "Checking frontend..."
    if curl -sf http://localhost/ > /dev/null 2>&1; then
        log "✓ Frontend is responding"
    else
        warn "✗ Frontend is not responding"
        ((errors++))
    fi

    # Summary
    echo ""
    if [ $errors -eq 0 ]; then
        log "✓ All checks passed!"
        log "Migration verification successful"
        return 0
    else
        warn "✗ $errors check(s) failed"
        warn "Review logs: docker compose logs"
        return 1
    fi
}

# ==========================================
# Main
# ==========================================
COMMAND="${1:-}"
shift || true

case "$COMMAND" in
    export)
        OUTPUT_DIR="./migration-backup"
        while [[ $# -gt 0 ]]; do
            case $1 in
                -o|--output)
                    OUTPUT_DIR="$2"
                    shift 2
                    ;;
                -h|--help)
                    usage
                    ;;
                *)
                    error "Unknown option: $1"
                    ;;
            esac
        done
        export_data "$OUTPUT_DIR"
        ;;

    import)
        INPUT_DIR=""
        while [[ $# -gt 0 ]]; do
            case $1 in
                -i|--input)
                    INPUT_DIR="$2"
                    shift 2
                    ;;
                -h|--help)
                    usage
                    ;;
                *)
                    error "Unknown option: $1"
                    ;;
            esac
        done
        import_data "$INPUT_DIR"
        ;;

    verify)
        verify_migration
        ;;

    -h|--help)
        usage
        ;;

    *)
        error "Unknown command: $COMMAND"
        usage
        ;;
esac
