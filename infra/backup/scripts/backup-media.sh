#!/bin/bash
################################################################################
# Media Backup Script - CEPComunicacion v2
################################################################################
# Purpose: Creates incremental media backups using rsync with hard links
# Schedule: Daily at 3:00 AM UTC via cron
# Retention: 30 days
# Method: rsync with --link-dest (space-efficient incremental backups)
################################################################################

set -euo pipefail

################################################################################
# CONFIGURATION
################################################################################

# Source directories (adjust based on deployment)
SOURCE_DIR="${SOURCE_DIR:-/var/www/cepcomunicacion/uploads}"
DOCKER_VOLUME="${DOCKER_VOLUME:-}"  # Optional: Docker volume name

# Backup configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/cepcomunicacion/media}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DEST="${BACKUP_DIR}/${TIMESTAMP}"
LATEST_LINK="${BACKUP_DIR}/latest"
LOG_FILE="${LOG_FILE:-/var/log/cepcomunicacion/backup-media.log}"

# S3 Configuration (optional)
ENABLE_S3_UPLOAD="${ENABLE_S3_UPLOAD:-false}"
S3_BUCKET="${S3_BUCKET:-s3://cepcomunicacion-backups/media}"

# Notification configuration
ENABLE_NOTIFICATIONS="${ENABLE_NOTIFICATIONS:-false}"
NOTIFICATION_EMAIL="${NOTIFICATION_EMAIL:-admin@cepcomunicacion.com}"

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

    if [ "${ENABLE_NOTIFICATIONS}" = "true" ] && command -v mail >/dev/null 2>&1; then
        echo "${message}" | mail -s "Backup ${status}: Media Files" "${NOTIFICATION_EMAIL}"
    fi
}

check_dependencies() {
    log "INFO" "Checking dependencies..."

    if ! command -v rsync >/dev/null 2>&1; then
        error_exit "rsync not found. Install with: apt-get install rsync"
    fi

    log "INFO" "All dependencies satisfied"
}

determine_source_directory() {
    log "INFO" "Determining source directory..."

    # If Docker volume specified, extract from container
    if [ -n "${DOCKER_VOLUME}" ]; then
        if command -v docker >/dev/null 2>&1; then
            log "INFO" "Using Docker volume: ${DOCKER_VOLUME}"
            # Create temporary directory for volume extraction
            local temp_dir="/tmp/cepcomunicacion_media_temp"
            rm -rf "${temp_dir}"
            mkdir -p "${temp_dir}"

            # Copy from Docker volume to temp directory
            docker run --rm \
                -v "${DOCKER_VOLUME}:/source:ro" \
                -v "${temp_dir}:/dest" \
                alpine \
                sh -c "cp -a /source/. /dest/"

            SOURCE_DIR="${temp_dir}"
        else
            log "WARN" "Docker not available, falling back to filesystem path"
        fi
    fi

    # Verify source directory exists
    if [ ! -d "${SOURCE_DIR}" ]; then
        error_exit "Source directory does not exist: ${SOURCE_DIR}"
    fi

    log "INFO" "Source directory: ${SOURCE_DIR}"
}

create_backup_directory() {
    log "INFO" "Creating backup directory: ${BACKUP_DIR}"

    if ! mkdir -p "${BACKUP_DIR}"; then
        error_exit "Failed to create backup directory: ${BACKUP_DIR}"
    fi

    # Set restrictive permissions
    chmod 700 "${BACKUP_DIR}"

    log "INFO" "Backup directory ready"
}

perform_incremental_backup() {
    log "INFO" "Starting incremental media backup..."
    log "INFO" "Source: ${SOURCE_DIR}"
    log "INFO" "Destination: ${BACKUP_DEST}"

    # Create destination directory
    mkdir -p "${BACKUP_DEST}"

    # Build rsync command
    local rsync_opts=(
        -av                          # Archive mode, verbose
        --delete                     # Delete files that no longer exist in source
        --delete-excluded            # Also delete excluded files
        --exclude='.DS_Store'        # Exclude macOS metadata
        --exclude='Thumbs.db'        # Exclude Windows thumbnails
        --exclude='.tmp'             # Exclude temporary files
        --exclude='*.part'           # Exclude partial downloads
        --stats                      # Show transfer statistics
        --human-readable             # Human-readable numbers
    )

    # If previous backup exists, use hard links for unchanged files
    if [ -L "${LATEST_LINK}" ] && [ -d "${LATEST_LINK}" ]; then
        rsync_opts+=(--link-dest="${LATEST_LINK}")
        log "INFO" "Using incremental backup with link-dest: ${LATEST_LINK}"
    else
        log "INFO" "Performing full backup (no previous backup found)"
    fi

    # Perform backup
    if ! rsync "${rsync_opts[@]}" "${SOURCE_DIR}/" "${BACKUP_DEST}/" 2>&1 | tee -a "${LOG_FILE}"; then
        error_exit "rsync backup failed"
    fi

    # Update latest symlink
    rm -f "${LATEST_LINK}"
    ln -s "${BACKUP_DEST}" "${LATEST_LINK}"

    log "INFO" "Latest backup symlink updated: ${LATEST_LINK}"
}

calculate_backup_statistics() {
    log "INFO" "Calculating backup statistics..."

    local backup_size=$(du -sh "${BACKUP_DEST}" 2>/dev/null | cut -f1)
    local file_count=$(find "${BACKUP_DEST}" -type f | wc -l)
    local total_backups=$(find "${BACKUP_DIR}" -maxdepth 1 -type d ! -name "$(basename "${BACKUP_DIR}")" | wc -l)
    local total_size=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)

    cat <<EOF | tee -a "${LOG_FILE}"

========================================
MEDIA BACKUP STATISTICS
========================================
Backup Size: ${backup_size}
File Count: ${file_count}
Total Backups: ${total_backups}
Total Space Used: ${total_size}
Retention Period: ${RETENTION_DAYS} days
========================================

EOF
}

cleanup_old_backups() {
    log "INFO" "Cleaning up backups older than ${RETENTION_DAYS} days..."

    local deleted_count=0

    # Find and delete old backup directories
    while IFS= read -r dir; do
        rm -rf "${dir}"
        log "INFO" "Deleted old backup: $(basename "${dir}")"
        ((deleted_count++))
    done < <(find "${BACKUP_DIR}" -maxdepth 1 -type d -mtime "+${RETENTION_DAYS}" ! -name "$(basename "${BACKUP_DIR}")")

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

    # Sync to S3 (only upload new/changed files)
    if aws s3 sync "${BACKUP_DEST}" "${S3_BUCKET}/${TIMESTAMP}/" --storage-class GLACIER; then
        log "INFO" "S3 upload successful"
    else
        log "WARN" "S3 upload failed (non-critical)"
    fi
}

cleanup_temp_files() {
    # Clean up temporary Docker volume extraction if used
    if [ -n "${DOCKER_VOLUME}" ] && [ -d "/tmp/cepcomunicacion_media_temp" ]; then
        log "INFO" "Cleaning up temporary files..."
        rm -rf "/tmp/cepcomunicacion_media_temp"
    fi
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    log "INFO" "================================================"
    log "INFO" "Media Backup Script - CEPComunicacion v2"
    log "INFO" "================================================"

    # Pre-flight checks
    check_dependencies
    determine_source_directory
    create_backup_directory

    # Perform backup
    perform_incremental_backup

    # Post-backup tasks
    calculate_backup_statistics
    cleanup_old_backups
    upload_to_s3
    cleanup_temp_files

    # Success notification
    local backup_size=$(du -sh "${BACKUP_DEST}" 2>/dev/null | cut -f1)
    send_notification "SUCCESS" "Media backup completed: ${backup_size}"

    log "INFO" "Backup completed successfully"
    log "INFO" "================================================"

    exit 0
}

# Trap to ensure cleanup on exit
trap cleanup_temp_files EXIT

# Run main function
main "$@"
