#!/bin/bash
################################################################################
# Backup Monitoring Script - CEPComunicacion v2
################################################################################
# Purpose: Monitors backup health and sends alerts for failures
# Schedule: Hourly via cron (or after each backup)
# Alerts: Email, Slack webhook, Discord webhook
################################################################################

set -euo pipefail

################################################################################
# CONFIGURATION
################################################################################

# Backup directories
BACKUP_BASE_DIR="${BACKUP_BASE_DIR:-/var/backups/cepcomunicacion}"
DB_BACKUP_DIR="${BACKUP_BASE_DIR}/database"
MEDIA_BACKUP_DIR="${BACKUP_BASE_DIR}/media"
CONFIG_BACKUP_DIR="${BACKUP_BASE_DIR}/config"

# Monitoring thresholds
MAX_BACKUP_AGE_HOURS="${MAX_BACKUP_AGE_HOURS:-24}"
MIN_DB_BACKUP_SIZE_MB="${MIN_DB_BACKUP_SIZE_MB:-1}"
MIN_MEDIA_BACKUP_SIZE_MB="${MIN_MEDIA_BACKUP_SIZE_MB:-10}"

# Logging
LOG_FILE="${LOG_FILE:-/var/log/cepcomunicacion/backup-check.log}"
STATUS_FILE="/var/run/cepcomunicacion-backup-status.json"

# Notification configuration
ENABLE_EMAIL_ALERTS="${ENABLE_EMAIL_ALERTS:-false}"
ALERT_EMAIL="${ALERT_EMAIL:-admin@cepcomunicacion.com}"

ENABLE_SLACK_ALERTS="${ENABLE_SLACK_ALERTS:-false}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"

ENABLE_DISCORD_ALERTS="${ENABLE_DISCORD_ALERTS:-false}"
DISCORD_WEBHOOK="${DISCORD_WEBHOOK:-}"

# Health check URL (optional - for external monitoring services)
HEALTHCHECK_URL="${HEALTHCHECK_URL:-}"

################################################################################
# FUNCTIONS
################################################################################

log() {
    local level="$1"
    shift
    local message="$*"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [${level}] ${message}" | tee -a "${LOG_FILE}"
}

send_email_alert() {
    local subject="$1"
    local message="$2"

    if [ "${ENABLE_EMAIL_ALERTS}" != "true" ]; then
        return 0
    fi

    if ! command -v mail >/dev/null 2>&1; then
        log "WARN" "mail command not found, skipping email alert"
        return 0
    fi

    echo "${message}" | mail -s "[CEPComunicacion] ${subject}" "${ALERT_EMAIL}"
    log "INFO" "Email alert sent to: ${ALERT_EMAIL}"
}

send_slack_alert() {
    local status="$1"
    local message="$2"

    if [ "${ENABLE_SLACK_ALERTS}" != "true" ] || [ -z "${SLACK_WEBHOOK}" ]; then
        return 0
    fi

    local color="danger"
    [ "${status}" = "OK" ] && color="good"
    [ "${status}" = "WARNING" ] && color="warning"

    local payload=$(cat <<EOF
{
  "attachments": [
    {
      "color": "${color}",
      "title": "CEPComunicacion Backup Status",
      "text": "${message}",
      "footer": "Backup Monitoring System",
      "ts": $(date +%s)
    }
  ]
}
EOF
)

    if curl -X POST -H "Content-Type: application/json" -d "${payload}" "${SLACK_WEBHOOK}" >/dev/null 2>&1; then
        log "INFO" "Slack alert sent"
    else
        log "WARN" "Failed to send Slack alert"
    fi
}

send_discord_alert() {
    local status="$1"
    local message="$2"

    if [ "${ENABLE_DISCORD_ALERTS}" != "true" ] || [ -z "${DISCORD_WEBHOOK}" ]; then
        return 0
    fi

    local color="15158332"  # Red
    [ "${status}" = "OK" ] && color="3066993"     # Green
    [ "${status}" = "WARNING" ] && color="15105570"  # Orange

    local payload=$(cat <<EOF
{
  "embeds": [
    {
      "title": "CEPComunicacion Backup Status",
      "description": "${message}",
      "color": ${color},
      "footer": {
        "text": "Backup Monitoring System"
      },
      "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)"
    }
  ]
}
EOF
)

    if curl -X POST -H "Content-Type: application/json" -d "${payload}" "${DISCORD_WEBHOOK}" >/dev/null 2>&1; then
        log "INFO" "Discord alert sent"
    else
        log "WARN" "Failed to send Discord alert"
    fi
}

send_alert() {
    local status="$1"
    local subject="$2"
    local message="$3"

    send_email_alert "${subject}" "${message}"
    send_slack_alert "${status}" "${message}"
    send_discord_alert "${status}" "${message}"
}

ping_healthcheck_url() {
    if [ -z "${HEALTHCHECK_URL}" ]; then
        return 0
    fi

    if curl -fsS -m 10 --retry 3 "${HEALTHCHECK_URL}" >/dev/null 2>&1; then
        log "INFO" "Healthcheck ping successful"
    else
        log "WARN" "Failed to ping healthcheck URL"
    fi
}

check_database_backups() {
    log "INFO" "Checking database backups..."

    local status="OK"
    local issues=()

    # Check if backup directory exists
    if [ ! -d "${DB_BACKUP_DIR}" ]; then
        issues+=("Database backup directory does not exist: ${DB_BACKUP_DIR}")
        status="ERROR"
        echo "${status}"
        printf '%s\n' "${issues[@]}"
        return
    fi

    # Find latest backup
    local latest_backup=$(find "${DB_BACKUP_DIR}" -name "cepcomunicacion_*.dump" -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2-)

    if [ -z "${latest_backup}" ]; then
        issues+=("No database backups found in ${DB_BACKUP_DIR}")
        status="ERROR"
    else
        # Check backup age
        local backup_time=$(stat -c %Y "${latest_backup}" 2>/dev/null || stat -f %m "${latest_backup}" 2>/dev/null)
        local current_time=$(date +%s)
        local age_hours=$(( (current_time - backup_time) / 3600 ))

        if [ "${age_hours}" -gt "${MAX_BACKUP_AGE_HOURS}" ]; then
            issues+=("Database backup is ${age_hours} hours old (max: ${MAX_BACKUP_AGE_HOURS}h)")
            status="WARNING"
        fi

        # Check backup size
        local size_bytes=$(stat -c %s "${latest_backup}" 2>/dev/null || stat -f %z "${latest_backup}" 2>/dev/null)
        local size_mb=$((size_bytes / 1024 / 1024))

        if [ "${size_mb}" -lt "${MIN_DB_BACKUP_SIZE_MB}" ]; then
            issues+=("Database backup too small: ${size_mb}MB (min: ${MIN_DB_BACKUP_SIZE_MB}MB)")
            status="ERROR"
        fi

        # Verify checksum if exists
        if [ -f "${latest_backup}.sha256" ]; then
            if command -v sha256sum >/dev/null 2>&1; then
                if ! sha256sum -c "${latest_backup}.sha256" >/dev/null 2>&1; then
                    issues+=("Database backup checksum verification failed")
                    status="ERROR"
                fi
            fi
        fi

        log "INFO" "Latest database backup: $(basename "${latest_backup}") (${size_mb}MB, ${age_hours}h old)"
    fi

    # Return results
    echo "${status}"
    if [ ${#issues[@]} -gt 0 ]; then
        printf '%s\n' "${issues[@]}"
    fi
}

check_media_backups() {
    log "INFO" "Checking media backups..."

    local status="OK"
    local issues=()

    # Check if backup directory exists
    if [ ! -d "${MEDIA_BACKUP_DIR}" ]; then
        issues+=("Media backup directory does not exist: ${MEDIA_BACKUP_DIR}")
        status="ERROR"
        echo "${status}"
        printf '%s\n' "${issues[@]}"
        return
    fi

    # Find latest backup (excluding 'latest' symlink)
    local latest_backup=$(find "${MEDIA_BACKUP_DIR}" -maxdepth 1 -type d ! -name "$(basename "${MEDIA_BACKUP_DIR}")" -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2-)

    if [ -z "${latest_backup}" ]; then
        issues+=("No media backups found in ${MEDIA_BACKUP_DIR}")
        status="ERROR"
    else
        # Check backup age
        local backup_time=$(stat -c %Y "${latest_backup}" 2>/dev/null || stat -f %m "${latest_backup}" 2>/dev/null)
        local current_time=$(date +%s)
        local age_hours=$(( (current_time - backup_time) / 3600 ))

        if [ "${age_hours}" -gt "${MAX_BACKUP_AGE_HOURS}" ]; then
            issues+=("Media backup is ${age_hours} hours old (max: ${MAX_BACKUP_AGE_HOURS}h)")
            status="WARNING"
        fi

        # Check backup size
        local size_bytes=$(du -sb "${latest_backup}" 2>/dev/null | cut -f1)
        local size_mb=$((size_bytes / 1024 / 1024))

        if [ "${size_mb}" -lt "${MIN_MEDIA_BACKUP_SIZE_MB}" ]; then
            issues+=("Media backup too small: ${size_mb}MB (min: ${MIN_MEDIA_BACKUP_SIZE_MB}MB)")
            status="WARNING"
        fi

        log "INFO" "Latest media backup: $(basename "${latest_backup}") (${size_mb}MB, ${age_hours}h old)"
    fi

    # Return results
    echo "${status}"
    if [ ${#issues[@]} -gt 0 ]; then
        printf '%s\n' "${issues[@]}"
    fi
}

check_config_backups() {
    log "INFO" "Checking configuration backups..."

    local status="OK"
    local issues=()

    # Check if backup directory exists
    if [ ! -d "${CONFIG_BACKUP_DIR}" ]; then
        issues+=("Config backup directory does not exist: ${CONFIG_BACKUP_DIR}")
        status="ERROR"
        echo "${status}"
        printf '%s\n' "${issues[@]}"
        return
    fi

    # Find latest backup
    local latest_backup=$(find "${CONFIG_BACKUP_DIR}" -name "config_*.tar.gz" -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2-)

    if [ -z "${latest_backup}" ]; then
        issues+=("No configuration backups found in ${CONFIG_BACKUP_DIR}")
        status="ERROR"
    else
        # Check backup age
        local backup_time=$(stat -c %Y "${latest_backup}" 2>/dev/null || stat -f %m "${latest_backup}" 2>/dev/null)
        local current_time=$(date +%s)
        local age_hours=$(( (current_time - backup_time) / 3600 ))

        if [ "${age_hours}" -gt "${MAX_BACKUP_AGE_HOURS}" ]; then
            issues+=("Config backup is ${age_hours} hours old (max: ${MAX_BACKUP_AGE_HOURS}h)")
            status="WARNING"
        fi

        # Verify tar archive integrity
        if ! tar -tzf "${latest_backup}" >/dev/null 2>&1; then
            issues+=("Config backup archive is corrupted")
            status="ERROR"
        fi

        local size_kb=$(du -k "${latest_backup}" | cut -f1)
        log "INFO" "Latest config backup: $(basename "${latest_backup}") (${size_kb}KB, ${age_hours}h old)"
    fi

    # Return results
    echo "${status}"
    if [ ${#issues[@]} -gt 0 ]; then
        printf '%s\n' "${issues[@]}"
    fi
}

check_disk_space() {
    log "INFO" "Checking disk space..."

    local status="OK"
    local issues=()

    if [ ! -d "${BACKUP_BASE_DIR}" ]; then
        echo "${status}"
        return
    fi

    # Get disk usage percentage
    local disk_usage=$(df "${BACKUP_BASE_DIR}" | tail -1 | awk '{print $5}' | sed 's/%//')

    if [ "${disk_usage}" -ge 90 ]; then
        issues+=("Disk space critical: ${disk_usage}% used on backup volume")
        status="ERROR"
    elif [ "${disk_usage}" -ge 80 ]; then
        issues+=("Disk space warning: ${disk_usage}% used on backup volume")
        status="WARNING"
    fi

    # Get total backup size
    local total_size=$(du -sh "${BACKUP_BASE_DIR}" 2>/dev/null | cut -f1)
    log "INFO" "Total backup size: ${total_size} (${disk_usage}% disk usage)"

    # Return results
    echo "${status}"
    if [ ${#issues[@]} -gt 0 ]; then
        printf '%s\n' "${issues[@]}"
    fi
}

generate_status_report() {
    local db_check_result=($1)
    local media_check_result=($2)
    local config_check_result=($3)
    local disk_check_result=($4)

    local overall_status="OK"
    local critical_issues=0
    local warnings=0

    # Determine overall status
    for result in "${db_check_result[0]}" "${media_check_result[0]}" "${config_check_result[0]}" "${disk_check_result[0]}"; do
        if [ "${result}" = "ERROR" ]; then
            overall_status="ERROR"
            ((critical_issues++))
        elif [ "${result}" = "WARNING" ]; then
            [ "${overall_status}" != "ERROR" ] && overall_status="WARNING"
            ((warnings++))
        fi
    done

    # Generate JSON status file
    cat > "${STATUS_FILE}" <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
  "overall_status": "${overall_status}",
  "critical_issues": ${critical_issues},
  "warnings": ${warnings},
  "checks": {
    "database": "${db_check_result[0]}",
    "media": "${media_check_result[0]}",
    "config": "${config_check_result[0]}",
    "disk_space": "${disk_check_result[0]}"
  }
}
EOF

    # Generate human-readable report
    cat <<EOF

========================================
BACKUP MONITORING REPORT
========================================
Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
Overall Status: ${overall_status}
Critical Issues: ${critical_issues}
Warnings: ${warnings}
----------------------------------------

DATABASE BACKUPS: ${db_check_result[0]}
$([ ${#db_check_result[@]} -gt 1 ] && printf '  - %s\n' "${db_check_result[@]:1}")

MEDIA BACKUPS: ${media_check_result[0]}
$([ ${#media_check_result[@]} -gt 1 ] && printf '  - %s\n' "${media_check_result[@]:1}")

CONFIGURATION BACKUPS: ${config_check_result[0]}
$([ ${#config_check_result[@]} -gt 1 ] && printf '  - %s\n' "${config_check_result[@]:1}")

DISK SPACE: ${disk_check_result[0]}
$([ ${#disk_check_result[@]} -gt 1 ] && printf '  - %s\n' "${disk_check_result[@]:1}")

========================================

EOF

    echo "${overall_status}"
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    log "INFO" "================================================"
    log "INFO" "Backup Monitoring - CEPComunicacion v2"
    log "INFO" "================================================"

    # Perform checks
    local db_check=($(check_database_backups))
    local media_check=($(check_media_backups))
    local config_check=($(check_config_backups))
    local disk_check=($(check_disk_space))

    # Generate report
    local overall_status=$(generate_status_report "${db_check[*]}" "${media_check[*]}" "${config_check[*]}" "${disk_check[*]}")

    # Send alerts if issues found
    if [ "${overall_status}" = "ERROR" ]; then
        local alert_message="CRITICAL: Backup system has critical issues!\n\n"
        alert_message+="Database: ${db_check[0]}\n"
        alert_message+="Media: ${media_check[0]}\n"
        alert_message+="Config: ${config_check[0]}\n"
        alert_message+="Disk: ${disk_check[0]}\n\n"
        alert_message+="Check logs: ${LOG_FILE}"

        send_alert "ERROR" "BACKUP ALERT: Critical Issues" "${alert_message}"
    elif [ "${overall_status}" = "WARNING" ]; then
        log "WARN" "Backup system has warnings (no alert sent)"
    else
        log "INFO" "All backup checks passed"
        ping_healthcheck_url
    fi

    log "INFO" "Monitoring complete - Status: ${overall_status}"
    log "INFO" "================================================"

    # Exit with appropriate code
    [ "${overall_status}" = "OK" ] && exit 0
    [ "${overall_status}" = "WARNING" ] && exit 1
    exit 2
}

# Run main function
main "$@"
