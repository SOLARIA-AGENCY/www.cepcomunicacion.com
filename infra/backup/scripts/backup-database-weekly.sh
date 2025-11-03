#!/bin/bash
################################################################################
# Weekly Database Backup Script - CEPComunicacion v2
################################################################################
# Purpose: Creates weekly compressed PostgreSQL backups with extended retention
# Schedule: Every Sunday at 3:00 AM UTC via cron
# Retention: 12 weeks (3 months)
# Format: pg_dump custom format (compressed)
################################################################################

set -euo pipefail

################################################################################
# CONFIGURATION
################################################################################

# Database credentials
DB_NAME="${DB_NAME:-cepcomunicacion}"
DB_USER="${DB_USER:-cepcomunicacion}"
DB_PASSWORD="${DB_PASSWORD:-wGWxjMYsUWSBvlqw2Ck9KU2BKUI=}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# Backup configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/cepcomunicacion/database/weekly}"
RETENTION_WEEKS="${RETENTION_WEEKS:-12}"
RETENTION_DAYS=$((RETENTION_WEEKS * 7))
WEEK_NUMBER=$(date +%Y-W%V)
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/cepcomunicacion_weekly_${WEEK_NUMBER}_${TIMESTAMP}.dump"
LOG_FILE="${LOG_FILE:-/var/log/cepcomunicacion/backup-database-weekly.log}"

# S3 Configuration (optional)
ENABLE_S3_UPLOAD="${ENABLE_S3_UPLOAD:-false}"
S3_BUCKET="${S3_BUCKET:-s3://cepcomunicacion-backups/database/weekly}"

################################################################################
# FUNCTIONS
################################################################################

log() {
    local level="$1"
    shift
    local message="$*"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [${level}] ${message}" | tee -a "${LOG_FILE}"
}

error_exit() {
    log "ERROR" "$1"
    exit 1
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    log "INFO" "================================================"
    log "INFO" "Weekly Database Backup - CEPComunicacion v2"
    log "INFO" "================================================"

    # Create backup directory
    mkdir -p "${BACKUP_DIR}"
    chmod 700 "${BACKUP_DIR}"

    log "INFO" "Starting weekly backup for week: ${WEEK_NUMBER}"
    log "INFO" "Backup file: ${BACKUP_FILE}"

    # Perform backup
    if ! PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -Fc \
        --no-owner \
        --no-acl \
        -f "${BACKUP_FILE}" 2>>"${LOG_FILE}"; then
        error_exit "Weekly backup failed"
    fi

    # Verify backup
    if [ ! -f "${BACKUP_FILE}" ]; then
        error_exit "Backup file not created: ${BACKUP_FILE}"
    fi

    local file_size=$(du -h "${BACKUP_FILE}" | cut -f1)
    log "INFO" "Weekly backup created successfully: ${file_size}"

    # Create checksum
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "${BACKUP_FILE}" > "${BACKUP_FILE}.sha256"
    fi

    # Cleanup old weekly backups
    log "INFO" "Cleaning up weekly backups older than ${RETENTION_WEEKS} weeks..."
    find "${BACKUP_DIR}" -name "cepcomunicacion_weekly_*.dump" -mtime "+${RETENTION_DAYS}" -type f -delete

    # Upload to S3 if enabled
    if [ "${ENABLE_S3_UPLOAD}" = "true" ] && command -v aws >/dev/null 2>&1; then
        log "INFO" "Uploading to S3: ${S3_BUCKET}"
        aws s3 cp "${BACKUP_FILE}" "${S3_BUCKET}/$(basename "${BACKUP_FILE}")" --storage-class GLACIER
    fi

    log "INFO" "Weekly backup completed successfully"
    log "INFO" "================================================"

    exit 0
}

main "$@"
