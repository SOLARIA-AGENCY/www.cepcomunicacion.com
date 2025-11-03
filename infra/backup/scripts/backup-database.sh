#!/bin/bash
################################################################################
# Database Backup Script - CEPComunicacion v2
################################################################################
# Purpose: Creates daily compressed PostgreSQL backups with automatic cleanup
# Schedule: Daily at 2:00 AM UTC via cron
# Retention: 30 days
# Format: pg_dump custom format (compressed, faster restore)
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
BACKUP_DIR="${BACKUP_DIR:-/var/backups/cepcomunicacion/database}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/cepcomunicacion_${TIMESTAMP}.dump"
LOG_FILE="${LOG_FILE:-/var/log/cepcomunicacion/backup-database.log}"

# S3 Configuration (optional)
ENABLE_S3_UPLOAD="${ENABLE_S3_UPLOAD:-false}"
S3_BUCKET="${S3_BUCKET:-s3://cepcomunicacion-backups/database}"

# Notification configuration
ENABLE_NOTIFICATIONS="${ENABLE_NOTIFICATIONS:-false}"
NOTIFICATION_EMAIL="${NOTIFICATION_EMAIL:-admin@cepcomunicacion.com}"
NOTIFICATION_WEBHOOK="${NOTIFICATION_WEBHOOK:-}"

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
    send_notification "ERROR" "$1"
    exit 1
}

send_notification() {
    local status="$1"
    local message="$2"

    if [ "${ENABLE_NOTIFICATIONS}" = "true" ]; then
        # Email notification
        if command -v mail >/dev/null 2>&1; then
            echo "${message}" | mail -s "Backup ${status}: Database - ${DB_NAME}" "${NOTIFICATION_EMAIL}"
        fi

        # Webhook notification (Slack, Discord, etc.)
        if [ -n "${NOTIFICATION_WEBHOOK}" ]; then
            curl -X POST "${NOTIFICATION_WEBHOOK}" \
                -H "Content-Type: application/json" \
                -d "{\"text\":\"Backup ${status}: ${message}\"}" \
                >/dev/null 2>&1 || true
        fi
    fi
}

check_dependencies() {
    log "INFO" "Checking dependencies..."

    if ! command -v pg_dump >/dev/null 2>&1; then
        error_exit "pg_dump not found. Install PostgreSQL client tools."
    fi

    if ! command -v psql >/dev/null 2>&1; then
        error_exit "psql not found. Install PostgreSQL client tools."
    fi

    log "INFO" "All dependencies satisfied"
}

check_database_connection() {
    log "INFO" "Testing database connection..."

    if ! PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -c "SELECT version();" >/dev/null 2>&1; then
        error_exit "Cannot connect to database: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
    fi

    log "INFO" "Database connection successful"
}

create_backup_directory() {
    log "INFO" "Creating backup directory: ${BACKUP_DIR}"

    if ! mkdir -p "${BACKUP_DIR}"; then
        error_exit "Failed to create backup directory: ${BACKUP_DIR}"
    fi

    # Set restrictive permissions (only root can read backups)
    chmod 700 "${BACKUP_DIR}"

    log "INFO" "Backup directory ready"
}

perform_backup() {
    log "INFO" "Starting database backup: ${DB_NAME}"
    log "INFO" "Backup file: ${BACKUP_FILE}"

    # Create backup with pg_dump
    # -Fc: Custom format (compressed)
    # --no-owner: Don't output ownership commands
    # --no-acl: Don't output ACL commands
    # -v: Verbose mode
    if ! PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -Fc \
        --no-owner \
        --no-acl \
        -v \
        -f "${BACKUP_FILE}" 2>>"${LOG_FILE}"; then
        error_exit "pg_dump failed. Check log: ${LOG_FILE}"
    fi

    # Verify backup file exists and is not empty
    if [ ! -f "${BACKUP_FILE}" ]; then
        error_exit "Backup file not created: ${BACKUP_FILE}"
    fi

    local file_size=$(du -h "${BACKUP_FILE}" | cut -f1)
    local file_size_bytes=$(stat -c%s "${BACKUP_FILE}" 2>/dev/null || stat -f%z "${BACKUP_FILE}" 2>/dev/null)

    if [ "${file_size_bytes}" -lt 1024 ]; then
        error_exit "Backup file too small (${file_size}). Possible corruption."
    fi

    log "INFO" "Backup created successfully: ${file_size}"

    # Create checksum for integrity verification
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "${BACKUP_FILE}" > "${BACKUP_FILE}.sha256"
        log "INFO" "Checksum created: ${BACKUP_FILE}.sha256"
    fi
}

cleanup_old_backups() {
    log "INFO" "Cleaning up backups older than ${RETENTION_DAYS} days..."

    local deleted_count=0

    # Delete old backup files
    while IFS= read -r file; do
        rm -f "${file}" "${file}.sha256"
        log "INFO" "Deleted old backup: $(basename "${file}")"
        ((deleted_count++))
    done < <(find "${BACKUP_DIR}" -name "cepcomunicacion_*.dump" -mtime "+${RETENTION_DAYS}" -type f)

    if [ "${deleted_count}" -gt 0 ]; then
        log "INFO" "Deleted ${deleted_count} old backup(s)"
    else
        log "INFO" "No old backups to delete"
    fi
}

upload_to_s3() {
    if [ "${ENABLE_S3_UPLOAD}" != "true" ]; then
        log "INFO" "S3 upload disabled, skipping..."
        return 0
    fi

    if ! command -v aws >/dev/null 2>&1; then
        log "WARN" "AWS CLI not found. Skipping S3 upload."
        return 0
    fi

    log "INFO" "Uploading backup to S3: ${S3_BUCKET}"

    if aws s3 cp "${BACKUP_FILE}" "${S3_BUCKET}/$(basename "${BACKUP_FILE}")" --storage-class GLACIER; then
        log "INFO" "S3 upload successful"

        # Upload checksum too
        if [ -f "${BACKUP_FILE}.sha256" ]; then
            aws s3 cp "${BACKUP_FILE}.sha256" "${S3_BUCKET}/$(basename "${BACKUP_FILE}.sha256")" --storage-class GLACIER
        fi
    else
        log "WARN" "S3 upload failed (non-critical)"
    fi
}

generate_backup_report() {
    log "INFO" "Generating backup report..."

    local total_backups=$(find "${BACKUP_DIR}" -name "cepcomunicacion_*.dump" -type f | wc -l)
    local total_size=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)
    local oldest_backup=$(find "${BACKUP_DIR}" -name "cepcomunicacion_*.dump" -type f -printf '%T+ %p\n' 2>/dev/null | sort | head -1 | cut -d' ' -f2- || echo "N/A")
    local newest_backup=$(find "${BACKUP_DIR}" -name "cepcomunicacion_*.dump" -type f -printf '%T+ %p\n' 2>/dev/null | sort -r | head -1 | cut -d' ' -f2- || echo "N/A")

    cat <<EOF | tee -a "${LOG_FILE}"

========================================
BACKUP REPORT
========================================
Database: ${DB_NAME}
Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
Status: SUCCESS
----------------------------------------
Current Backup: $(basename "${BACKUP_FILE}")
Backup Size: $(du -h "${BACKUP_FILE}" 2>/dev/null | cut -f1)
Backup Location: ${BACKUP_DIR}
----------------------------------------
Total Backups: ${total_backups}
Total Size: ${total_size}
Oldest Backup: $(basename "${oldest_backup}")
Newest Backup: $(basename "${newest_backup}")
Retention Policy: ${RETENTION_DAYS} days
========================================

EOF
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    log "INFO" "================================================"
    log "INFO" "Database Backup Script - CEPComunicacion v2"
    log "INFO" "================================================"

    # Pre-flight checks
    check_dependencies
    check_database_connection
    create_backup_directory

    # Perform backup
    perform_backup

    # Post-backup tasks
    cleanup_old_backups
    upload_to_s3
    generate_backup_report

    # Success notification
    send_notification "SUCCESS" "Database backup completed: ${DB_NAME} ($(du -h "${BACKUP_FILE}" | cut -f1))"

    log "INFO" "Backup completed successfully"
    log "INFO" "================================================"

    exit 0
}

# Run main function
main "$@"
