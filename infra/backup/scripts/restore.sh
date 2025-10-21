#!/bin/bash
# PostgreSQL Restore Script
# Restores database from backup file

set -euo pipefail

# ==========================================
# Configuration
# ==========================================
PGHOST="${POSTGRES_HOST:-postgres}"
PGDATABASE="${POSTGRES_DB:-cepcomunicacion}"
PGUSER="${POSTGRES_USER:-cepadmin}"
export PGPASSWORD="${POSTGRES_PASSWORD}"

# S3 config
S3_ENDPOINT="${S3_ENDPOINT:-http://minio:9000}"
S3_BUCKET="${S3_BACKUP_BUCKET:-cep-backups}"
AWS_ACCESS_KEY_ID="${S3_ACCESS_KEY_ID}"
AWS_SECRET_ACCESS_KEY="${S3_SECRET_ACCESS_KEY}"
export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY

# ==========================================
# Functions
# ==========================================
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

error() {
    log "ERROR: $*" >&2
    exit 1
}

usage() {
    cat <<EOF
Usage: $0 [OPTIONS]

Restore PostgreSQL database from backup.

OPTIONS:
    -f FILE     Restore from local file
    -s S3_KEY   Restore from S3 (e.g., database/20251021/backup.sql.gz)
    -l          List available backups
    -h          Show this help

EXAMPLES:
    # List available backups
    $0 -l

    # Restore from local file
    $0 -f /backups/cepcomunicacion_20251021_030000.sql.gz

    # Restore from S3
    $0 -s database/20251021/cepcomunicacion_20251021_030000.sql.gz
EOF
    exit 1
}

list_backups() {
    log "Available local backups:"
    find /backups -name "cepcomunicacion_*.sql.gz" -type f -printf "%T@ %Tc %p\n" \
        | sort -nr \
        | head -20 \
        | awk '{print $7, $8, $9, "-", $10}'

    log "\nAvailable S3 backups (last 20):"
    aws s3 ls "s3://${S3_BUCKET}/database/" \
        --endpoint-url "$S3_ENDPOINT" \
        --no-verify-ssl \
        --recursive \
        | sort -r \
        | head -20

    exit 0
}

# ==========================================
# Parse arguments
# ==========================================
BACKUP_FILE=""
S3_KEY=""

while getopts "f:s:lh" opt; do
    case $opt in
        f) BACKUP_FILE="$OPTARG" ;;
        s) S3_KEY="$OPTARG" ;;
        l) list_backups ;;
        h) usage ;;
        *) usage ;;
    esac
done

if [ -z "$BACKUP_FILE" ] && [ -z "$S3_KEY" ]; then
    error "Must specify either -f (local file) or -s (S3 key)"
fi

# ==========================================
# Download from S3 if needed
# ==========================================
if [ -n "$S3_KEY" ]; then
    log "Downloading backup from S3..."
    BACKUP_FILE="/backups/restore_$(date +%s).sql.gz"

    aws s3 cp "s3://${S3_BUCKET}/${S3_KEY}" "$BACKUP_FILE" \
        --endpoint-url "$S3_ENDPOINT" \
        --no-verify-ssl

    if [ $? -ne 0 ]; then
        error "Failed to download backup from S3"
    fi

    log "Downloaded to: $BACKUP_FILE"
fi

# ==========================================
# Verify backup file
# ==========================================
if [ ! -f "$BACKUP_FILE" ]; then
    error "Backup file not found: $BACKUP_FILE"
fi

log "Verifying backup integrity..."
if ! gzip -t "$BACKUP_FILE"; then
    error "Backup file is corrupted: $BACKUP_FILE"
fi

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log "Backup file verified: $BACKUP_FILE (${BACKUP_SIZE})"

# ==========================================
# Confirmation prompt
# ==========================================
log "WARNING: This will DROP and recreate the database: $PGDATABASE"
log "Backup file: $BACKUP_FILE"
log "Database host: $PGHOST"
read -p "Are you sure you want to continue? (yes/no): " -r
if [ "$REPLY" != "yes" ]; then
    log "Restore cancelled"
    exit 0
fi

# ==========================================
# Stop applications (prevent connections)
# ==========================================
log "Terminating existing database connections..."
psql -h "$PGHOST" -U "$PGUSER" -d postgres -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$PGDATABASE' AND pid <> pg_backend_pid();"

# ==========================================
# Restore database
# ==========================================
log "Starting database restore..."
log "This may take several minutes..."

# Decompress and restore
gunzip -c "$BACKUP_FILE" | psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1

if [ $? -eq 0 ]; then
    log "Database restored successfully"
else
    error "Database restore failed"
fi

# ==========================================
# Verify restore
# ==========================================
log "Verifying restore..."

# Check if key tables exist
TABLES=$(psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -tAc \
    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

log "Tables found: $TABLES"

if [ "$TABLES" -eq 0 ]; then
    error "No tables found after restore"
fi

# ==========================================
# Cleanup
# ==========================================
if [ -n "$S3_KEY" ]; then
    log "Cleaning up downloaded backup file..."
    rm -f "$BACKUP_FILE"
fi

# ==========================================
# Summary
# ==========================================
log "Restore completed successfully"
log "Database: $PGDATABASE"
log "Tables: $TABLES"
log "You may now restart your application services"

exit 0
