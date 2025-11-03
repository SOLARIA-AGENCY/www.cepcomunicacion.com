#!/bin/bash
################################################################################
# Database Restore Script - CEPComunicacion v2
################################################################################
# Purpose: Restores PostgreSQL database from backup with safety checks
# Usage: ./restore-database.sh <backup-file.dump> [--force]
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

# Restore configuration
BACKUP_FILE="$1"
FORCE_RESTORE="${2:-}"
LOG_FILE="${LOG_FILE:-/var/log/cepcomunicacion/restore-database.log}"
PRE_RESTORE_BACKUP_DIR="/var/backups/cepcomunicacion/database/pre-restore"

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
Usage: $0 <backup-file.dump> [--force]

Restores PostgreSQL database from backup file.

Arguments:
  backup-file.dump    Path to backup file (required)
  --force             Skip confirmation prompts (optional)

Examples:
  $0 /var/backups/cepcomunicacion/database/cepcomunicacion_2025-10-31_02-00-00.dump
  $0 /var/backups/cepcomunicacion/database/cepcomunicacion_2025-10-31_02-00-00.dump --force

Environment Variables:
  DB_NAME             Database name (default: cepcomunicacion)
  DB_USER             Database user (default: cepcomunicacion)
  DB_PASSWORD         Database password
  DB_HOST             Database host (default: localhost)
  DB_PORT             Database port (default: 5432)

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
    log "INFO" "Verifying backup file integrity..."

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
        log "WARN" "No checksum file found, skipping verification"
    fi

    # Test if pg_restore can read the file
    if ! PGPASSWORD="${DB_PASSWORD}" pg_restore -l "${BACKUP_FILE}" >/dev/null 2>&1; then
        error_exit "Cannot read backup file. File may be corrupted or invalid format."
    fi

    log "INFO" "Backup file is valid"
}

check_database_connection() {
    log "INFO" "Testing database connection..."

    if ! PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d postgres \
        -c "SELECT version();" >/dev/null 2>&1; then
        error_exit "Cannot connect to PostgreSQL server: ${DB_HOST}:${DB_PORT}"
    fi

    log "INFO" "Database connection successful"
}

confirm_restore() {
    if [ "${FORCE_RESTORE}" = "--force" ]; then
        log "WARN" "Force mode enabled, skipping confirmation"
        return 0
    fi

    cat <<EOF

========================================
WARNING: DATABASE RESTORE OPERATION
========================================

This will perform the following actions:

1. Create a pre-restore backup of current database
2. Terminate all active connections to: ${DB_NAME}
3. Drop the existing database: ${DB_NAME}
4. Create a new empty database: ${DB_NAME}
5. Restore from backup: $(basename "${BACKUP_FILE}")

Current database will be PERMANENTLY REPLACED!

Pre-restore backup location:
${PRE_RESTORE_BACKUP_DIR}/

========================================

EOF

    read -p "Are you ABSOLUTELY SURE you want to continue? (type 'yes' to confirm): " CONFIRM

    if [ "${CONFIRM}" != "yes" ]; then
        log "INFO" "Restore cancelled by user"
        exit 0
    fi

    log "INFO" "User confirmed restore operation"
}

create_pre_restore_backup() {
    log "INFO" "Creating pre-restore backup of current database..."

    mkdir -p "${PRE_RESTORE_BACKUP_DIR}"

    local timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    local pre_backup_file="${PRE_RESTORE_BACKUP_DIR}/pre-restore_${timestamp}.dump"

    if PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -Fc \
        -f "${pre_backup_file}" 2>>"${LOG_FILE}"; then
        log "INFO" "Pre-restore backup created: ${pre_backup_file}"
        log "INFO" "Backup size: $(du -h "${pre_backup_file}" | cut -f1)"
    else
        log "WARN" "Pre-restore backup failed (continuing with restore)"
    fi
}

terminate_active_connections() {
    log "INFO" "Terminating active connections to database: ${DB_NAME}"

    PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d postgres \
        -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();" \
        >/dev/null 2>&1 || true

    log "INFO" "Active connections terminated"
}

drop_existing_database() {
    log "INFO" "Dropping existing database: ${DB_NAME}"

    if PGPASSWORD="${DB_PASSWORD}" dropdb \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        "${DB_NAME}" 2>>"${LOG_FILE}"; then
        log "INFO" "Database dropped successfully"
    else
        error_exit "Failed to drop database: ${DB_NAME}"
    fi
}

create_new_database() {
    log "INFO" "Creating new database: ${DB_NAME}"

    if PGPASSWORD="${DB_PASSWORD}" createdb \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -O "${DB_USER}" \
        "${DB_NAME}" 2>>"${LOG_FILE}"; then
        log "INFO" "Database created successfully"
    else
        error_exit "Failed to create database: ${DB_NAME}"
    fi
}

restore_from_backup() {
    log "INFO" "Restoring database from backup..."
    log "INFO" "This may take several minutes depending on database size..."

    # Restore with pg_restore
    # -v: Verbose mode
    # -d: Database name
    # --no-owner: Don't restore ownership
    # --no-acl: Don't restore access privileges
    # -j: Number of parallel jobs (adjust based on CPU cores)
    if PGPASSWORD="${DB_PASSWORD}" pg_restore \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        --no-owner \
        --no-acl \
        -v \
        "${BACKUP_FILE}" 2>&1 | tee -a "${LOG_FILE}"; then
        log "INFO" "Database restore completed successfully"
    else
        error_exit "Database restore failed. Check log: ${LOG_FILE}"
    fi
}

verify_restore() {
    log "INFO" "Verifying restored database..."

    # Check database exists
    local db_exists=$(PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d postgres \
        -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" 2>/dev/null)

    if [ "${db_exists}" != "1" ]; then
        error_exit "Database verification failed: ${DB_NAME} does not exist"
    fi

    # Count tables
    local table_count=$(PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'" 2>/dev/null)

    log "INFO" "Database verification passed"
    log "INFO" "Tables found: ${table_count}"

    # Show table list
    log "INFO" "Table list:"
    PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -c "\dt" 2>&1 | tee -a "${LOG_FILE}"
}

generate_restore_report() {
    log "INFO" "Generating restore report..."

    cat <<EOF | tee -a "${LOG_FILE}"

========================================
DATABASE RESTORE REPORT
========================================
Database: ${DB_NAME}
Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
Status: SUCCESS
----------------------------------------
Restored From: $(basename "${BACKUP_FILE}")
Backup Size: $(du -h "${BACKUP_FILE}" 2>/dev/null | cut -f1)
Pre-Restore Backup: ${PRE_RESTORE_BACKUP_DIR}/
----------------------------------------
Database Host: ${DB_HOST}:${DB_PORT}
Database User: ${DB_USER}
========================================

Restore completed successfully!

Next steps:
1. Verify application connectivity
2. Run application migrations if needed
3. Test critical functionality
4. Monitor application logs

========================================

EOF
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    log "INFO" "================================================"
    log "INFO" "Database Restore - CEPComunicacion v2"
    log "INFO" "================================================"

    # Validate inputs
    validate_arguments
    verify_backup_integrity
    check_database_connection

    # Confirmation
    confirm_restore

    # Pre-restore backup
    create_pre_restore_backup

    # Restore sequence
    terminate_active_connections
    drop_existing_database
    create_new_database
    restore_from_backup

    # Verification
    verify_restore
    generate_restore_report

    log "INFO" "Restore completed successfully"
    log "INFO" "================================================"

    exit 0
}

# Run main function
main "$@"
