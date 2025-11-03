#!/bin/bash
################################################################################
# Configuration Restore Script - CEPComunicacion v2
################################################################################
# Purpose: Restores configuration files from backup archive
# Usage: ./restore-config.sh <backup-file.tar.gz> [--force]
################################################################################

set -euo pipefail

################################################################################
# CONFIGURATION
################################################################################

# Restore configuration
BACKUP_FILE="$1"
TARGET_DIR="${TARGET_DIR:-/var/www/cepcomunicacion}"
FORCE_RESTORE="${2:-}"
LOG_FILE="${LOG_FILE:-/var/log/cepcomunicacion/restore-config.log}"
PRE_RESTORE_BACKUP_DIR="/var/backups/cepcomunicacion/config/pre-restore"

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
Usage: $0 <backup-file.tar.gz> [--force]

Restores configuration files from backup archive.

Arguments:
  backup-file.tar.gz  Path to backup archive (required)
  --force            Skip confirmation prompts (optional)

Examples:
  $0 /var/backups/cepcomunicacion/config/config_2025-10-31_02-30-00.tar.gz
  $0 /var/backups/cepcomunicacion/config/config_2025-10-31_02-30-00.tar.gz --force

Environment Variables:
  TARGET_DIR         Target directory for restore (default: /var/www/cepcomunicacion)

EOF
    exit 1
}

validate_arguments() {
    if [ -z "${BACKUP_FILE}" ]; then
        log "ERROR" "No backup file specified"
        show_usage
    fi

    if [ ! -f "${BACKUP_FILE}" ]; then
        error_exit "Backup file not found: ${BACKUP_FILE}"
    fi

    log "INFO" "Backup file: ${BACKUP_FILE}"
    log "INFO" "Backup size: $(du -h "${BACKUP_FILE}" | cut -f1)"
}

verify_backup_integrity() {
    log "INFO" "Verifying backup archive integrity..."

    # Check if checksum file exists
    if [ -f "${BACKUP_FILE}.sha256" ]; then
        log "INFO" "Checksum file found, verifying..."

        if command -v sha256sum >/dev/null 2>&1; then
            if sha256sum -c "${BACKUP_FILE}.sha256" >/dev/null 2>&1; then
                log "INFO" "Checksum verification passed"
            else
                error_exit "Checksum verification failed! Backup may be corrupted."
            fi
        fi
    else
        log "WARN" "No checksum file found, skipping checksum verification"
    fi

    # Test if tar can read the archive
    if ! tar -tzf "${BACKUP_FILE}" >/dev/null 2>&1; then
        error_exit "Cannot read backup archive. File may be corrupted."
    fi

    log "INFO" "Backup archive is valid"
}

confirm_restore() {
    if [ "${FORCE_RESTORE}" = "--force" ]; then
        log "WARN" "Force mode enabled, skipping confirmation"
        return 0
    fi

    cat <<EOF

========================================
WARNING: CONFIGURATION RESTORE OPERATION
========================================

This will perform the following actions:

1. Create a pre-restore backup of current config files
2. Extract files from backup: $(basename "${BACKUP_FILE}")
3. Overwrite existing configuration files in: ${TARGET_DIR}

IMPORTANT: This includes .env files with sensitive data!

Files to be restored:
EOF

    tar -tzf "${BACKUP_FILE}" | head -20
    echo ""
    echo "(showing first 20 files)"
    echo ""

    cat <<EOF
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
    log "INFO" "Creating pre-restore backup of current configuration..."

    mkdir -p "${PRE_RESTORE_BACKUP_DIR}"

    local timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    local pre_backup_file="${PRE_RESTORE_BACKUP_DIR}/config_${timestamp}.tar.gz"

    # List files that will be backed up
    local files_to_backup=()

    # Extract file list from backup archive
    while IFS= read -r file; do
        local full_path="${TARGET_DIR}/${file}"
        if [ -e "${full_path}" ]; then
            files_to_backup+=("${file}")
        fi
    done < <(tar -tzf "${BACKUP_FILE}")

    if [ ${#files_to_backup[@]} -gt 0 ]; then
        # Create pre-restore backup
        tar -czf "${pre_backup_file}" -C "${TARGET_DIR}" "${files_to_backup[@]}" 2>/dev/null || true
        log "INFO" "Pre-restore backup created: ${pre_backup_file}"
    else
        log "INFO" "No existing files to backup"
    fi
}

restore_from_backup() {
    log "INFO" "Restoring configuration files from backup..."

    # Extract archive to target directory
    if tar -xzf "${BACKUP_FILE}" -C "${TARGET_DIR}" 2>&1 | tee -a "${LOG_FILE}"; then
        log "INFO" "Configuration files extracted successfully"
    else
        error_exit "Failed to extract backup archive"
    fi
}

set_correct_permissions() {
    log "INFO" "Setting secure file permissions..."

    # Secure .env files (600 = rw-------)
    find "${TARGET_DIR}" -name ".env*" -type f -exec chmod 600 {} \; 2>/dev/null || true

    # Secure docker-compose files (644 = rw-r--r--)
    find "${TARGET_DIR}" -name "docker-compose*.yml" -type f -exec chmod 644 {} \; 2>/dev/null || true

    # Secure config files (644 = rw-r--r--)
    find "${TARGET_DIR}" -name "*.config.*" -type f -exec chmod 644 {} \; 2>/dev/null || true

    # Secure nginx configs (644 = rw-r--r--)
    if [ -d "${TARGET_DIR}/infra/nginx" ]; then
        find "${TARGET_DIR}/infra/nginx" -type f -exec chmod 644 {} \; 2>/dev/null || true
    fi

    log "INFO" "Permissions updated"
}

verify_restore() {
    log "INFO" "Verifying restored configuration files..."

    local restored_count=0
    local failed_count=0

    # Verify each file from backup exists
    while IFS= read -r file; do
        local full_path="${TARGET_DIR}/${file}"
        if [ -e "${full_path}" ]; then
            ((restored_count++))
        else
            log "WARN" "File not found after restore: ${file}"
            ((failed_count++))
        fi
    done < <(tar -tzf "${BACKUP_FILE}")

    if [ "${failed_count}" -gt 0 ]; then
        log "WARN" "Some files were not restored: ${failed_count} missing"
    fi

    log "INFO" "Restore verification: ${restored_count} files restored"
}

generate_restore_report() {
    log "INFO" "Generating restore report..."

    local file_count=$(tar -tzf "${BACKUP_FILE}" | wc -l)

    cat <<EOF | tee -a "${LOG_FILE}"

========================================
CONFIGURATION RESTORE REPORT
========================================
Target Directory: ${TARGET_DIR}
Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
Status: SUCCESS
----------------------------------------
Restored From: $(basename "${BACKUP_FILE}")
Backup Size: $(du -h "${BACKUP_FILE}" 2>/dev/null | cut -f1)
Pre-Restore Backup: ${PRE_RESTORE_BACKUP_DIR}/
----------------------------------------
Files Restored: ${file_count}
========================================

Restore completed successfully!

IMPORTANT NEXT STEPS:

1. Review .env files for correct values
   - Check database credentials
   - Verify API keys and secrets
   - Confirm environment-specific settings

2. Restart services to apply changes:
   - docker-compose down && docker-compose up -d
   - OR systemctl restart relevant services

3. Verify application startup
   - Check Docker container logs
   - Test API endpoints
   - Verify database connectivity

4. Security check
   - Ensure .env files have correct permissions (600)
   - Verify no secrets are exposed in logs
   - Check file ownership

========================================

EOF
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    log "INFO" "================================================"
    log "INFO" "Configuration Restore - CEPComunicacion v2"
    log "INFO" "================================================"

    # Validate inputs
    validate_arguments
    verify_backup_integrity

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
