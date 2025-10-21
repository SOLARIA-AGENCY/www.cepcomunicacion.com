#!/bin/bash
# PostgreSQL Backup Script
# Backs up database to MinIO S3-compatible storage

set -euo pipefail

# ==========================================
# Configuration
# ==========================================
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE=$(date +%Y%m%d)
BACKUP_FILE="cepcomunicacion_${TIMESTAMP}.sql.gz"
BACKUP_PATH="/backups/${BACKUP_FILE}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# Database config
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

# ==========================================
# Pre-flight checks
# ==========================================
log "Starting backup process..."

# Check database connection
if ! pg_isready -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -q; then
    error "Database is not ready"
fi

# ==========================================
# Create backup
# ==========================================
log "Creating database dump..."
pg_dump -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" \
    --format=plain \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    | gzip -9 > "$BACKUP_PATH"

if [ ! -f "$BACKUP_PATH" ]; then
    error "Backup file was not created"
fi

BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
log "Backup created: $BACKUP_FILE (${BACKUP_SIZE})"

# ==========================================
# Upload to S3
# ==========================================
log "Uploading to S3..."
aws s3 cp "$BACKUP_PATH" \
    "s3://${S3_BUCKET}/database/${DATE}/${BACKUP_FILE}" \
    --endpoint-url "$S3_ENDPOINT" \
    --no-verify-ssl

if [ $? -eq 0 ]; then
    log "Successfully uploaded to S3: s3://${S3_BUCKET}/database/${DATE}/${BACKUP_FILE}"
else
    error "Failed to upload backup to S3"
fi

# ==========================================
# Cleanup old local backups
# ==========================================
log "Cleaning up local backups older than ${RETENTION_DAYS} days..."
find /backups -name "cepcomunicacion_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
log "Local cleanup complete"

# ==========================================
# Cleanup old S3 backups
# ==========================================
log "Cleaning up S3 backups older than ${RETENTION_DAYS} days..."
CUTOFF_DATE=$(date -d "${RETENTION_DAYS} days ago" +%Y%m%d)

aws s3 ls "s3://${S3_BUCKET}/database/" --endpoint-url "$S3_ENDPOINT" --no-verify-ssl --recursive \
    | awk '{print $4}' \
    | while read -r key; do
        file_date=$(echo "$key" | grep -oP '\d{8}' | head -1)
        if [ -n "$file_date" ] && [ "$file_date" -lt "$CUTOFF_DATE" ]; then
            log "Deleting old backup: $key"
            aws s3 rm "s3://${S3_BUCKET}/${key}" --endpoint-url "$S3_ENDPOINT" --no-verify-ssl
        fi
    done

log "S3 cleanup complete"

# ==========================================
# Verify backup
# ==========================================
log "Verifying backup integrity..."
if gzip -t "$BACKUP_PATH"; then
    log "Backup integrity verified"
else
    error "Backup file is corrupted"
fi

# ==========================================
# Summary
# ==========================================
TOTAL_BACKUPS=$(find /backups -name "cepcomunicacion_*.sql.gz" -type f | wc -l)
log "Backup completed successfully"
log "Local backups: ${TOTAL_BACKUPS}"
log "Backup size: ${BACKUP_SIZE}"
log "Location: ${BACKUP_PATH}"

exit 0
