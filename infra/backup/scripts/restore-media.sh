#!/bin/bash
################################################################################
# Media Restore Script - CEPComunicacion v2
################################################################################
# Purpose: Restores media files from backup with safety checks
# Usage: ./restore-media.sh <backup-directory> [--force]
################################################################################

set -euo pipefail

################################################################################
# CONFIGURATION
################################################################################

# Restore configuration
BACKUP_DIR="$1"
TARGET_DIR="${TARGET_DIR:-/var/www/cepcomunicacion/uploads}"
FORCE_RESTORE="${2:-}"
LOG_FILE="${LOG_FILE:-/var/log/cepcomunicacion/restore-media.log}"
PRE_RESTORE_BACKUP_DIR="/var/backups/cepcomunicacion/media/pre-restore"

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

show_usage() {
    cat <<EOF
Usage: $0 <backup-directory> [--force]

Restores media files from backup directory.

Arguments:
  backup-directory    Path to backup directory (required)
  --force            Skip confirmation prompts (optional)

Examples:
  $0 /var/backups/cepcomunicacion/media/2025-10-31_03-00-00
  $0 /var/backups/cepcomunicacion/media/latest
  $0 /var/backups/cepcomunicacion/media/latest --force

Environment Variables:
  TARGET_DIR         Target directory for restore (default: /var/www/cepcomunicacion/uploads)

EOF
    exit 1
}

validate_arguments() {
    if [ -z "${BACKUP_DIR}" ]; then
        log "ERROR" "No backup directory specified"
        show_usage
    fi

    # Resolve symlink if pointing to 'latest'
    if [ -L "${BACKUP_DIR}" ]; then
        local resolved=$(readlink -f "${BACKUP_DIR}")
        log "INFO" "Resolving symlink: ${BACKUP_DIR} -> ${resolved}"
        BACKUP_DIR="${resolved}"
    fi

    if [ ! -d "${BACKUP_DIR}" ]; then
        error_exit "Backup directory not found: ${BACKUP_DIR}"
    fi

    log "INFO" "Backup directory: ${BACKUP_DIR}"
    log "INFO" "Backup size: $(du -sh "${BACKUP_DIR}" | cut -f1)"
}

create_target_directory() {
    log "INFO" "Ensuring target directory exists: ${TARGET_DIR}"

    if ! mkdir -p "${TARGET_DIR}"; then
        error_exit "Failed to create target directory: ${TARGET_DIR}"
    fi

    log "INFO" "Target directory ready"
}

confirm_restore() {
    if [ "${FORCE_RESTORE}" = "--force" ]; then
        log "WARN" "Force mode enabled, skipping confirmation"
        return 0
    fi

    local file_count=$(find "${BACKUP_DIR}" -type f | wc -l)
    local backup_size=$(du -sh "${BACKUP_DIR}" | cut -f1)

    cat <<EOF

========================================
WARNING: MEDIA RESTORE OPERATION
========================================

This will perform the following actions:

1. Create a pre-restore backup of current media files
2. Restore files from backup: $(basename "${BACKUP_DIR}")
3. Overwrite existing files in: ${TARGET_DIR}

Current media files will be REPLACED!

Backup Details:
- Source: ${BACKUP_DIR}
- Files: ${file_count}
- Size: ${backup_size}

Pre-restore backup location:
${PRE_RESTORE_BACKUP_DIR}/

========================================

EOF

    read -p "Are you SURE you want to continue? (type 'yes' to confirm): " CONFIRM

    if [ "${CONFIRM}" != "yes" ]; then
        log "INFO" "Restore cancelled by user"
        exit 0
    fi

    log "INFO" "User confirmed restore operation"
}

create_pre_restore_backup() {
    log "INFO" "Creating pre-restore backup of current media files..."

    # Skip if target directory is empty or doesn't exist
    if [ ! -d "${TARGET_DIR}" ] || [ -z "$(ls -A "${TARGET_DIR}")" ]; then
        log "INFO" "Target directory empty, skipping pre-restore backup"
        return 0
    fi

    mkdir -p "${PRE_RESTORE_BACKUP_DIR}"

    local timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    local pre_backup_dir="${PRE_RESTORE_BACKUP_DIR}/${timestamp}"

    if rsync -a "${TARGET_DIR}/" "${pre_backup_dir}/"; then
        log "INFO" "Pre-restore backup created: ${pre_backup_dir}"
        log "INFO" "Backup size: $(du -sh "${pre_backup_dir}" | cut -f1)"
    else
        log "WARN" "Pre-restore backup failed (continuing with restore)"
    fi
}

restore_from_backup() {
    log "INFO" "Restoring media files from backup..."
    log "INFO" "This may take several minutes depending on file count and size..."

    # Restore with rsync
    # -a: Archive mode (preserve permissions, timestamps, etc.)
    # -v: Verbose
    # --delete: Delete files in target that don't exist in backup
    # --stats: Show transfer statistics
    # --human-readable: Human-readable numbers
    if rsync -av \
        --delete \
        --stats \
        --human-readable \
        "${BACKUP_DIR}/" \
        "${TARGET_DIR}/" 2>&1 | tee -a "${LOG_FILE}"; then
        log "INFO" "Media restore completed successfully"
    else
        error_exit "Media restore failed. Check log: ${LOG_FILE}"
    fi
}

set_correct_permissions() {
    log "INFO" "Setting correct file permissions..."

    # Set directory permissions: 755 (rwxr-xr-x)
    find "${TARGET_DIR}" -type d -exec chmod 755 {} \; 2>/dev/null || true

    # Set file permissions: 644 (rw-r--r--)
    find "${TARGET_DIR}" -type f -exec chmod 644 {} \; 2>/dev/null || true

    # Set ownership to web server user (adjust as needed)
    if command -v chown >/dev/null 2>&1; then
        local web_user="www-data"
        if id "${web_user}" >/dev/null 2>&1; then
            chown -R "${web_user}:${web_user}" "${TARGET_DIR}" 2>/dev/null || true
            log "INFO" "Ownership set to: ${web_user}"
        fi
    fi

    log "INFO" "Permissions updated"
}

verify_restore() {
    log "INFO" "Verifying restored media files..."

    if [ ! -d "${TARGET_DIR}" ]; then
        error_exit "Target directory does not exist after restore: ${TARGET_DIR}"
    fi

    local file_count=$(find "${TARGET_DIR}" -type f | wc -l)
    local total_size=$(du -sh "${TARGET_DIR}" | cut -f1)

    log "INFO" "Restore verification passed"
    log "INFO" "Files restored: ${file_count}"
    log "INFO" "Total size: ${total_size}"
}

generate_restore_report() {
    log "INFO" "Generating restore report..."

    local file_count=$(find "${TARGET_DIR}" -type f | wc -l)
    local dir_count=$(find "${TARGET_DIR}" -type d | wc -l)
    local total_size=$(du -sh "${TARGET_DIR}" | cut -f1)

    cat <<EOF | tee -a "${LOG_FILE}"

========================================
MEDIA RESTORE REPORT
========================================
Target Directory: ${TARGET_DIR}
Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
Status: SUCCESS
----------------------------------------
Restored From: $(basename "${BACKUP_DIR}")
Backup Size: $(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)
Pre-Restore Backup: ${PRE_RESTORE_BACKUP_DIR}/
----------------------------------------
Files Restored: ${file_count}
Directories: ${dir_count}
Total Size: ${total_size}
========================================

Restore completed successfully!

Next steps:
1. Verify files are accessible via web browser
2. Test file uploads in application
3. Check file permissions if issues occur
4. Monitor application logs

========================================

EOF
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    log "INFO" "================================================"
    log "INFO" "Media Restore - CEPComunicacion v2"
    log "INFO" "================================================"

    # Validate inputs
    validate_arguments
    create_target_directory

    # Confirmation
    confirm_restore

    # Pre-restore backup
    create_pre_restore_backup

    # Restore
    restore_from_backup

    # Post-restore
    set_correct_permissions
    verify_restore
    generate_restore_report

    log "INFO" "Restore completed successfully"
    log "INFO" "================================================"

    exit 0
}

# Run main function
main "$@"
