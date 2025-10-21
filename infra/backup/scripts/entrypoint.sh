#!/bin/bash
# Backup Service Entrypoint
# Starts cron daemon and runs scheduled backups

set -euo pipefail

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

# ==========================================
# Validate environment
# ==========================================
if [ -z "${POSTGRES_PASSWORD:-}" ]; then
    log "ERROR: POSTGRES_PASSWORD is not set"
    exit 1
fi

if [ -z "${MINIO_ROOT_PASSWORD:-}" ]; then
    log "ERROR: MINIO_ROOT_PASSWORD (S3_SECRET_ACCESS_KEY) is not set"
    exit 1
fi

# ==========================================
# Create cron schedule
# ==========================================
SCHEDULE="${BACKUP_SCHEDULE:-0 3 * * *}"
log "Backup schedule: $SCHEDULE"

# Write crontab
cat > /tmp/crontab <<EOF
# PostgreSQL Backup Schedule
# Format: minute hour day month weekday command

# Daily backup
$SCHEDULE /scripts/backup.sh >> /var/log/backup/backup.log 2>&1

# Empty line required at end of crontab
EOF

# Install crontab
crontab /tmp/crontab
rm /tmp/crontab

log "Crontab installed"

# ==========================================
# Run initial backup
# ==========================================
if [ "${RUN_INITIAL_BACKUP:-true}" = "true" ]; then
    log "Running initial backup..."
    /scripts/backup.sh
else
    log "Skipping initial backup"
fi

# ==========================================
# Start cron daemon
# ==========================================
log "Starting cron daemon..."
log "Logs will be written to /var/log/backup/backup.log"

# Start cron in foreground
exec crond -f -l 2
