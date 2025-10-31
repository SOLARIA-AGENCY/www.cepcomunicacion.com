#!/bin/bash
################################################################################
# Configuration Backup Script - CEPComunicacion v2
################################################################################
# Purpose: Backs up critical configuration files and environment settings
# Schedule: Daily at 2:30 AM UTC via cron
# Retention: 30 days
# Format: Compressed tar archive
################################################################################

set -euo pipefail

################################################################################
# CONFIGURATION
################################################################################

# Application directory
APP_DIR="${APP_DIR:-/var/www/cepcomunicacion}"

# Backup configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/cepcomunicacion/config}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/config_${TIMESTAMP}.tar.gz"
LOG_FILE="${LOG_FILE:-/var/log/cepcomunicacion/backup-config.log}"

# Files and directories to backup (relative to APP_DIR)
CONFIG_FILES=(
    ".env"
    ".env.production"
    "docker-compose.yml"
    "docker-compose.prod.yml"
    "package.json"
    "pnpm-lock.yaml"
    "apps/cms/src/payload.config.ts"
    "apps/web-next/next.config.ts"
    "apps/web-next/tailwind.config.ts"
    "infra/nginx/nginx.conf"
    "infra/nginx/sites-available/"
    "infra/docker/Dockerfile"
    "infra/postgres/migrations/"
    ".github/workflows/"
)

# S3 Configuration (optional)
ENABLE_S3_UPLOAD="${ENABLE_S3_UPLOAD:-false}"
S3_BUCKET="${S3_BUCKET:-s3://cepcomunicacion-backups/config}"

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

check_dependencies() {
    log "INFO" "Checking dependencies..."

    if ! command -v tar >/dev/null 2>&1; then
        error_exit "tar not found"
    fi

    log "INFO" "All dependencies satisfied"
}

verify_app_directory() {
    log "INFO" "Verifying application directory: ${APP_DIR}"

    if [ ! -d "${APP_DIR}" ]; then
        error_exit "Application directory does not exist: ${APP_DIR}"
    fi

    log "INFO" "Application directory verified"
}

create_backup_directory() {
    log "INFO" "Creating backup directory: ${BACKUP_DIR}"

    if ! mkdir -p "${BACKUP_DIR}"; then
        error_exit "Failed to create backup directory: ${BACKUP_DIR}"
    fi

    # Set restrictive permissions (config contains secrets)
    chmod 700 "${BACKUP_DIR}"

    log "INFO" "Backup directory ready"
}

create_file_list() {
    log "INFO" "Creating list of files to backup..."

    local temp_list="/tmp/cepcomunicacion_config_files_${TIMESTAMP}.txt"
    > "${temp_list}"

    local found_count=0
    local missing_count=0

    for item in "${CONFIG_FILES[@]}"; do
        local full_path="${APP_DIR}/${item}"

        if [ -e "${full_path}" ]; then
            echo "${item}" >> "${temp_list}"
            ((found_count++))
            log "DEBUG" "Found: ${item}"
        else
            log "WARN" "Not found (skipping): ${item}"
            ((missing_count++))
        fi
    done

    log "INFO" "Files to backup: ${found_count}"
    log "INFO" "Missing files (skipped): ${missing_count}"

    if [ "${found_count}" -eq 0 ]; then
        error_exit "No configuration files found to backup"
    fi

    echo "${temp_list}"
}

perform_backup() {
    log "INFO" "Starting configuration backup..."
    log "INFO" "Backup file: ${BACKUP_FILE}"

    # Create temporary file list
    local file_list=$(create_file_list)

    # Create tar archive
    # -c: Create archive
    # -z: Compress with gzip
    # -f: Output file
    # -C: Change to directory
    # -T: Read files from list
    # --no-recursion: Don't recurse (handle directories explicitly)
    if ! tar -czf "${BACKUP_FILE}" \
        -C "${APP_DIR}" \
        -T "${file_list}" \
        2>>"${LOG_FILE}"; then
        rm -f "${file_list}"
        error_exit "tar archive creation failed"
    fi

    # Cleanup temporary file list
    rm -f "${file_list}"

    # Verify backup file
    if [ ! -f "${BACKUP_FILE}" ]; then
        error_exit "Backup file not created: ${BACKUP_FILE}"
    fi

    local file_size=$(du -h "${BACKUP_FILE}" | cut -f1)
    log "INFO" "Backup created successfully: ${file_size}"

    # Create checksum
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "${BACKUP_FILE}" > "${BACKUP_FILE}.sha256"
        log "INFO" "Checksum created: ${BACKUP_FILE}.sha256"
    fi

    # Set restrictive permissions on backup
    chmod 600 "${BACKUP_FILE}"
}

verify_backup_integrity() {
    log "INFO" "Verifying backup integrity..."

    # Test tar archive
    if tar -tzf "${BACKUP_FILE}" >/dev/null 2>&1; then
        log "INFO" "Backup archive integrity verified"
    else
        error_exit "Backup archive is corrupted"
    fi

    # List contents for logging
    log "INFO" "Backup contents:"
    tar -tzf "${BACKUP_FILE}" | tee -a "${LOG_FILE}"
}

cleanup_old_backups() {
    log "INFO" "Cleaning up backups older than ${RETENTION_DAYS} days..."

    local deleted_count=0

    # Delete old backup files
    while IFS= read -r file; do
        rm -f "${file}" "${file}.sha256"
        log "INFO" "Deleted old backup: $(basename "${file}")"
        ((deleted_count++))
    done < <(find "${BACKUP_DIR}" -name "config_*.tar.gz" -mtime "+${RETENTION_DAYS}" -type f)

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

    local total_backups=$(find "${BACKUP_DIR}" -name "config_*.tar.gz" -type f | wc -l)
    local total_size=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)

    cat <<EOF | tee -a "${LOG_FILE}"

========================================
CONFIGURATION BACKUP REPORT
========================================
Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
Status: SUCCESS
----------------------------------------
Current Backup: $(basename "${BACKUP_FILE}")
Backup Size: $(du -h "${BACKUP_FILE}" 2>/dev/null | cut -f1)
Backup Location: ${BACKUP_DIR}
----------------------------------------
Total Backups: ${total_backups}
Total Size: ${total_size}
Retention Policy: ${RETENTION_DAYS} days
========================================

EOF
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    log "INFO" "================================================"
    log "INFO" "Configuration Backup - CEPComunicacion v2"
    log "INFO" "================================================"

    # Pre-flight checks
    check_dependencies
    verify_app_directory
    create_backup_directory

    # Perform backup
    perform_backup
    verify_backup_integrity

    # Post-backup tasks
    cleanup_old_backups
    upload_to_s3
    generate_backup_report

    log "INFO" "Backup completed successfully"
    log "INFO" "================================================"

    exit 0
}

# Run main function
main "$@"
