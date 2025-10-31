# Backup System Documentation - CEPComunicacion v2

## Table of Contents

1. [Overview](#overview)
2. [Backup Strategy](#backup-strategy)
3. [System Components](#system-components)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Backup Scripts](#backup-scripts)
7. [Restore Procedures](#restore-procedures)
8. [Monitoring & Alerting](#monitoring--alerting)
9. [Maintenance](#maintenance)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

---

## Overview

This backup system provides automated, reliable, and tested backup and recovery capabilities for the CEPComunicacion v2 platform. It implements the **3-2-1 backup rule**:

- **3** copies of your data (production + 2 backups)
- **2** different storage media (local disk + optional S3)
- **1** copy off-site (S3/MinIO)

### Key Features

- **Automated daily backups** for database, media files, and configuration
- **Weekly long-term backups** with extended retention
- **Incremental media backups** using rsync with hard links (space-efficient)
- **Automatic cleanup** based on retention policies
- **Integrity verification** with SHA-256 checksums
- **Health monitoring** with email/Slack/Discord alerts
- **Production-ready restore scripts** with safety checks
- **Pre-restore backups** to prevent data loss during recovery
- **Optional S3 integration** for off-site storage

### Backup Scope

| Component | What's Backed Up | Frequency | Retention |
|-----------|------------------|-----------|-----------|
| **Database** | PostgreSQL (all 14 Payload collections) | Daily + Weekly | 30 days (daily)<br>12 weeks (weekly) |
| **Media** | Uploaded files in `/uploads` directory | Daily (incremental) | 30 days |
| **Configuration** | .env files, docker-compose.yml, configs | Daily | 30 days |

---

## Backup Strategy

### Database Backups

**Daily Backups:**
- **Schedule:** Every day at 2:00 AM UTC
- **Format:** pg_dump custom format (compressed, -Fc)
- **Retention:** 30 days
- **File naming:** `cepcomunicacion_YYYY-MM-DD_HH-MM-SS.dump`
- **Location:** `/var/backups/cepcomunicacion/database/`
- **Average size:** 10-50 MB (compressed)

**Weekly Backups:**
- **Schedule:** Every Sunday at 3:30 AM UTC
- **Format:** pg_dump custom format (compressed)
- **Retention:** 12 weeks (3 months)
- **File naming:** `cepcomunicacion_weekly_YYYY-WWW_YYYY-MM-DD_HH-MM-SS.dump`
- **Location:** `/var/backups/cepcomunicacion/database/weekly/`
- **Purpose:** Long-term recovery for compliance and disaster recovery

**Why pg_dump custom format?**
- Compressed by default (smaller size)
- Faster restore than SQL dumps
- Supports parallel restore with `-j` flag
- Built-in integrity checking

### Media Backups

**Incremental Backups with Hard Links:**
- **Schedule:** Every day at 3:00 AM UTC
- **Method:** rsync with `--link-dest` (hard links for unchanged files)
- **Retention:** 30 days
- **Location:** `/var/backups/cepcomunicacion/media/YYYY-MM-DD_HH-MM-SS/`
- **Symlink:** `/var/backups/cepcomunicacion/media/latest` → most recent backup
- **Space efficiency:** Only changed files consume additional space

**How incremental backups work:**
1. First backup creates full copy of all media files
2. Subsequent backups use hard links to reference unchanged files
3. Only new/modified files are physically copied
4. Each backup appears as a full snapshot (no need to chain restores)
5. Disk space = full backup + sum of all changes

**Example disk usage:**
```
Day 1: 1 GB (full backup)
Day 2: 1.05 GB (+50 MB changes)
Day 3: 1.1 GB (+50 MB changes)
Day 30: ~2.5 GB total (vs 30 GB if full backups)
```

### Configuration Backups

**What's included:**
- `.env` and `.env.production` (database credentials, API keys)
- `docker-compose.yml` and `docker-compose.prod.yml`
- Payload CMS configuration (`payload.config.ts`)
- Next.js configuration (`next.config.ts`)
- Nginx configuration files
- Docker build files
- Database migration scripts
- GitHub Actions workflows

**Schedule:** Every day at 2:30 AM UTC
**Format:** Compressed tar archive (`.tar.gz`)
**Retention:** 30 days
**Location:** `/var/backups/cepcomunicacion/config/`

**Security:** Config backups contain secrets! Stored with `chmod 600` (owner read/write only).

---

## System Components

### Directory Structure

```
/var/backups/cepcomunicacion/
├── database/
│   ├── cepcomunicacion_2025-10-31_02-00-00.dump
│   ├── cepcomunicacion_2025-10-31_02-00-00.dump.sha256
│   ├── cepcomunicacion_2025-11-01_02-00-00.dump
│   ├── cepcomunicacion_2025-11-01_02-00-00.dump.sha256
│   ├── weekly/
│   │   ├── cepcomunicacion_weekly_2025-W44_2025-10-27_03-30-00.dump
│   │   └── cepcomunicacion_weekly_2025-W45_2025-11-03_03-30-00.dump
│   └── pre-restore/          # Created before restore operations
├── media/
│   ├── 2025-10-31_03-00-00/  # Full directory snapshot
│   ├── 2025-11-01_03-00-00/  # Incremental with hard links
│   ├── latest -> 2025-11-01_03-00-00/  # Symlink to latest
│   └── pre-restore/
├── config/
│   ├── config_2025-10-31_02-30-00.tar.gz
│   ├── config_2025-10-31_02-30-00.tar.gz.sha256
│   └── pre-restore/
└── docker-volumes/           # Optional: Docker volume backups
    ├── postgres_2025-10-31_04-00-00.tar.gz
    └── uploads_2025-10-31_04-00-00.tar.gz
```

### Log Files

```
/var/log/cepcomunicacion/
├── backup-database.log       # Database backup logs
├── backup-database-weekly.log
├── backup-media.log          # Media backup logs
├── backup-config.log         # Config backup logs
├── restore-database.log      # Restore operation logs
├── restore-media.log
├── restore-config.log
├── backup-check.log          # Monitoring logs
├── cron-backup.log           # Cron execution logs
└── cron-backup-check.log
```

### Scripts

Located in `/infra/backup/scripts/`:

| Script | Purpose | Schedule |
|--------|---------|----------|
| `backup-database.sh` | Daily PostgreSQL backup | Daily 2:00 AM |
| `backup-database-weekly.sh` | Weekly PostgreSQL backup | Sunday 3:30 AM |
| `backup-media.sh` | Incremental media backup | Daily 3:00 AM |
| `backup-config.sh` | Configuration backup | Daily 2:30 AM |
| `restore-database.sh` | Restore database from backup | Manual |
| `restore-media.sh` | Restore media files | Manual |
| `restore-config.sh` | Restore configuration | Manual |
| `check-backups.sh` | Monitor backup health | Every 6 hours |

---

## Installation

### Prerequisites

**System Requirements:**
- Ubuntu 22.04+ or similar Linux distribution
- PostgreSQL client tools (`pg_dump`, `pg_restore`)
- rsync 3.0+
- tar, gzip
- 50+ GB free disk space for backups
- Root or sudo access

**Optional:**
- AWS CLI (for S3 integration)
- `mail` command (for email alerts)
- curl (for webhook notifications)

### Step 1: Install Dependencies

```bash
# Update package list
apt-get update

# Install PostgreSQL client tools
apt-get install -y postgresql-client

# Install rsync (usually pre-installed)
apt-get install -y rsync

# Optional: Install mail utilities for email alerts
apt-get install -y mailutils

# Optional: Install AWS CLI for S3 sync
apt-get install -y awscli
```

### Step 2: Create Directory Structure

```bash
# Create backup directories
mkdir -p /var/backups/cepcomunicacion/{database/weekly,media,config}

# Create log directory
mkdir -p /var/log/cepcomunicacion

# Set secure permissions
chmod 700 /var/backups/cepcomunicacion
chmod 755 /var/log/cepcomunicacion
```

### Step 3: Copy Scripts

```bash
# Copy scripts to /infra/backup/scripts/
cp -r infra/backup/scripts /infra/backup/

# Make scripts executable
chmod +x /infra/backup/scripts/*.sh
```

### Step 4: Configure Environment Variables

Create `/etc/cepcomunicacion/backup.conf`:

```bash
# Database Configuration
DB_NAME=cepcomunicacion
DB_USER=cepcomunicacion
DB_PASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI=
DB_HOST=localhost
DB_PORT=5432

# Backup Directories
BACKUP_DIR=/var/backups/cepcomunicacion
LOG_FILE=/var/log/cepcomunicacion/backup.log

# Retention Policies
RETENTION_DAYS=30
RETENTION_WEEKS=12

# Notification Configuration
ENABLE_EMAIL_ALERTS=true
ALERT_EMAIL=admin@cepcomunicacion.com

ENABLE_SLACK_ALERTS=false
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# S3 Configuration (optional)
ENABLE_S3_UPLOAD=false
S3_BUCKET=s3://cepcomunicacion-backups
```

**Security:** Protect this file:
```bash
chmod 600 /etc/cepcomunicacion/backup.conf
```

### Step 5: Install Cron Jobs

```bash
# Install crontab
crontab /infra/backup/crontab

# Verify installation
crontab -l
```

### Step 6: Test Backups

```bash
# Test database backup
/infra/backup/scripts/backup-database.sh

# Test media backup
/infra/backup/scripts/backup-media.sh

# Test config backup
/infra/backup/scripts/backup-config.sh

# Check logs
tail -f /var/log/cepcomunicacion/backup-database.log
```

### Step 7: Verify Monitoring

```bash
# Run backup health check
/infra/backup/scripts/check-backups.sh

# Check status
cat /var/run/cepcomunicacion-backup-status.json
```

---

## Configuration

### Database Credentials

Edit `/etc/cepcomunicacion/backup.conf` or export environment variables:

```bash
export DB_NAME=cepcomunicacion
export DB_USER=cepcomunicacion
export DB_PASSWORD=your_secure_password
export DB_HOST=localhost
export DB_PORT=5432
```

### Retention Policies

**Adjust retention in backup scripts:**

```bash
# In backup-database.sh
RETENTION_DAYS=30  # Keep daily backups for 30 days

# In backup-database-weekly.sh
RETENTION_WEEKS=12  # Keep weekly backups for 12 weeks

# In backup-media.sh
RETENTION_DAYS=30  # Keep media backups for 30 days
```

**Storage capacity planning:**

| Retention | Daily DB | Weekly DB | Media | Total |
|-----------|----------|-----------|-------|-------|
| 30 days | 30 × 20 MB = 600 MB | 12 × 20 MB = 240 MB | 30 × 100 MB = 3 GB | ~4 GB |
| 60 days | 60 × 20 MB = 1.2 GB | 12 × 20 MB = 240 MB | 60 × 100 MB = 6 GB | ~7.5 GB |

*Adjust based on your actual data sizes*

### Email Alerts

**Install and configure mail:**

```bash
# Install postfix or sendmail
apt-get install -y postfix

# Configure mail relay (e.g., Gmail, SendGrid)
nano /etc/postfix/main.cf
```

**Test email:**

```bash
echo "Test email" | mail -s "Test" admin@cepcomunicacion.com
```

### Slack Integration

**Get webhook URL:**
1. Go to https://api.slack.com/apps
2. Create new app or select existing
3. Enable "Incoming Webhooks"
4. Create webhook for your channel
5. Copy webhook URL

**Configure:**

```bash
export ENABLE_SLACK_ALERTS=true
export SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Discord Integration

**Get webhook URL:**
1. Open Discord server settings
2. Go to Integrations → Webhooks
3. Create new webhook
4. Copy webhook URL

**Configure:**

```bash
export ENABLE_DISCORD_ALERTS=true
export DISCORD_WEBHOOK=https://discord.com/api/webhooks/YOUR/WEBHOOK/ID
```

### S3 Integration

**Configure AWS CLI:**

```bash
# Install AWS CLI
apt-get install -y awscli

# Configure credentials
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: eu-west-1
# Default output format: json
```

**Enable S3 upload:**

```bash
export ENABLE_S3_UPLOAD=true
export S3_BUCKET=s3://cepcomunicacion-backups
```

**S3 bucket structure:**

```
s3://cepcomunicacion-backups/
├── database/
│   ├── cepcomunicacion_2025-10-31_02-00-00.dump
│   └── cepcomunicacion_2025-11-01_02-00-00.dump
├── media/
│   └── 2025-10-31_03-00-00/
└── config/
    └── config_2025-10-31_02-30-00.tar.gz
```

---

## Backup Scripts

### backup-database.sh

**Purpose:** Creates daily PostgreSQL backups with automatic cleanup.

**Usage:**

```bash
# Manual execution
/infra/backup/scripts/backup-database.sh

# With custom configuration
DB_NAME=mydb DB_PASSWORD=secret /infra/backup/scripts/backup-database.sh

# Check log
tail -f /var/log/cepcomunicacion/backup-database.log
```

**Features:**
- Compressed pg_dump custom format
- SHA-256 checksum generation
- Automatic retention cleanup (30 days)
- Pre-flight database connectivity check
- Optional S3 upload
- Email/Slack/Discord notifications on failure
- Detailed backup report

**Output:**

```
/var/backups/cepcomunicacion/database/
├── cepcomunicacion_2025-10-31_02-00-00.dump       # 18 MB
└── cepcomunicacion_2025-10-31_02-00-00.dump.sha256
```

### backup-database-weekly.sh

**Purpose:** Creates weekly long-term backups with extended retention.

**Usage:**

```bash
# Manual execution
/infra/backup/scripts/backup-database-weekly.sh

# Check weekly backups
ls -lh /var/backups/cepcomunicacion/database/weekly/
```

**Features:**
- Same as daily backups
- 12-week retention (3 months)
- Week number in filename for easy identification

### backup-media.sh

**Purpose:** Creates space-efficient incremental backups of media files.

**Usage:**

```bash
# Manual execution
/infra/backup/scripts/backup-media.sh

# With custom source directory
SOURCE_DIR=/custom/path /infra/backup/scripts/backup-media.sh

# With Docker volume
DOCKER_VOLUME=cepcomunicacion_uploads /infra/backup/scripts/backup-media.sh
```

**Features:**
- rsync with hard links (space-efficient)
- Automatic "latest" symlink
- File exclusions (.DS_Store, Thumbs.db, *.tmp)
- Transfer statistics
- Docker volume support

**How to check space savings:**

```bash
# Total backup directory size
du -sh /var/backups/cepcomunicacion/media/

# Individual backup sizes (apparent size)
du -sh /var/backups/cepcomunicacion/media/*/

# Actual disk usage (accounts for hard links)
du -sh --apparent-size /var/backups/cepcomunicacion/media/*/
```

### backup-config.sh

**Purpose:** Backs up critical configuration files.

**Usage:**

```bash
# Manual execution
/infra/backup/scripts/backup-config.sh

# List backup contents
tar -tzf /var/backups/cepcomunicacion/config/config_2025-10-31_02-30-00.tar.gz
```

**Features:**
- Selective file backup
- Skips missing files gracefully
- Integrity verification (tar test)
- SHA-256 checksum
- Restrictive permissions (chmod 600)

---

## Restore Procedures

### Restore Database

**Script:** `/infra/backup/scripts/restore-database.sh`

**Usage:**

```bash
# Interactive restore (with confirmation)
/infra/backup/scripts/restore-database.sh /var/backups/cepcomunicacion/database/cepcomunicacion_2025-10-31_02-00-00.dump

# Force restore (skip confirmation)
/infra/backup/scripts/restore-database.sh /path/to/backup.dump --force
```

**What happens:**
1. Verifies backup file integrity (checksum if available)
2. Tests database connection
3. Asks for confirmation (unless `--force`)
4. Creates pre-restore backup of current database
5. Terminates active database connections
6. Drops existing database
7. Creates new empty database
8. Restores from backup
9. Verifies table count and structure
10. Generates restore report

**Safety features:**
- Pre-restore backup (rollback option)
- Confirmation prompt
- Connection termination
- Integrity checks

**Example output:**

```
========================================
DATABASE RESTORE REPORT
========================================
Database: cepcomunicacion
Timestamp: 2025-10-31 10:30:00
Status: SUCCESS
----------------------------------------
Restored From: cepcomunicacion_2025-10-31_02-00-00.dump
Backup Size: 18M
Pre-Restore Backup: /var/backups/cepcomunicacion/database/pre-restore/
----------------------------------------
Database Host: localhost:5432
Database User: cepcomunicacion
========================================
```

**Rollback procedure:**

If restore fails or you need to rollback:

```bash
# List pre-restore backups
ls -lh /var/backups/cepcomunicacion/database/pre-restore/

# Restore from pre-restore backup
/infra/backup/scripts/restore-database.sh /var/backups/cepcomunicacion/database/pre-restore/pre-restore_2025-10-31_10-30-00.dump --force
```

### Restore Media Files

**Script:** `/infra/backup/scripts/restore-media.sh`

**Usage:**

```bash
# Restore from specific backup
/infra/backup/scripts/restore-media.sh /var/backups/cepcomunicacion/media/2025-10-31_03-00-00

# Restore from latest backup
/infra/backup/scripts/restore-media.sh /var/backups/cepcomunicacion/media/latest

# Force restore
/infra/backup/scripts/restore-media.sh /var/backups/cepcomunicacion/media/latest --force
```

**What happens:**
1. Resolves symlinks (if using "latest")
2. Verifies backup directory exists
3. Asks for confirmation
4. Creates pre-restore backup of current media
5. Syncs files from backup to target directory
6. Sets correct file permissions
7. Verifies restore
8. Generates restore report

**Safety features:**
- Pre-restore backup
- Confirmation prompt
- Permission correction
- Web server user ownership

**Example output:**

```
========================================
MEDIA RESTORE REPORT
========================================
Target Directory: /var/www/cepcomunicacion/uploads
Timestamp: 2025-10-31 10:45:00
Status: SUCCESS
----------------------------------------
Restored From: 2025-10-31_03-00-00
Backup Size: 1.2G
Pre-Restore Backup: /var/backups/cepcomunicacion/media/pre-restore/
----------------------------------------
Files Restored: 1,234
Directories: 56
Total Size: 1.2G
========================================
```

### Restore Configuration

**Script:** `/infra/backup/scripts/restore-config.sh`

**Usage:**

```bash
# Restore config files
/infra/backup/scripts/restore-config.sh /var/backups/cepcomunicacion/config/config_2025-10-31_02-30-00.tar.gz

# Force restore
/infra/backup/scripts/restore-config.sh /path/to/config.tar.gz --force
```

**What happens:**
1. Verifies backup archive integrity
2. Lists files to be restored
3. Asks for confirmation
4. Creates pre-restore backup
5. Extracts files to application directory
6. Sets secure permissions
7. Verifies restoration
8. Generates restore report

**IMPORTANT:** After restoring configuration:

```bash
# Review .env files
nano /var/www/cepcomunicacion/.env

# Restart services
docker-compose down
docker-compose up -d

# Or restart system services
systemctl restart cepcomunicacion
```

---

## Monitoring & Alerting

### Backup Health Check

**Script:** `/infra/backup/scripts/check-backups.sh`

**What it monitors:**
- Database backup freshness (max age: 24 hours)
- Media backup freshness
- Config backup freshness
- Backup file sizes (minimum thresholds)
- Checksum integrity
- Disk space usage

**Usage:**

```bash
# Run health check
/infra/backup/scripts/check-backups.sh

# Check status JSON
cat /var/run/cepcomunicacion-backup-status.json
```

**Status JSON format:**

```json
{
  "timestamp": "2025-10-31T10:00:00.000Z",
  "overall_status": "OK",
  "critical_issues": 0,
  "warnings": 0,
  "checks": {
    "database": "OK",
    "media": "OK",
    "config": "OK",
    "disk_space": "OK"
  }
}
```

**Exit codes:**
- `0` - All checks passed (OK)
- `1` - Warnings detected
- `2` - Critical errors detected

### Alert Types

**Email Alerts:**
- Sent to `ALERT_EMAIL` address
- Subject: `[CEPComunicacion] BACKUP ALERT: Critical Issues`
- Body includes detailed error messages

**Slack Alerts:**
- Posted to configured webhook channel
- Color-coded: Green (OK), Orange (Warning), Red (Error)
- Includes timestamp and issue summary

**Discord Alerts:**
- Posted as embeds with color coding
- Similar format to Slack alerts

### External Monitoring Integration

**Healthcheck.io / Uptime Kuma:**

Set `HEALTHCHECK_URL` environment variable:

```bash
export HEALTHCHECK_URL=https://hc-ping.com/your-uuid-here
```

The monitoring script will ping this URL on successful checks. If ping fails (backup issues), the external service will alert you.

**Recommended services:**
- [Healthcheck.io](https://healthchecks.io/) - Free tier available
- [Uptime Kuma](https://github.com/louislam/uptime-kuma) - Self-hosted
- [Cronitor](https://cronitor.io/) - Cron job monitoring

---

## Maintenance

### Manual Backup Execution

**Run backups manually:**

```bash
# Database backup
/infra/backup/scripts/backup-database.sh

# Media backup
/infra/backup/scripts/backup-media.sh

# Config backup
/infra/backup/scripts/backup-config.sh

# All backups sequentially
/infra/backup/scripts/backup-database.sh && \
/infra/backup/scripts/backup-config.sh && \
/infra/backup/scripts/backup-media.sh
```

### Verify Backup Integrity

**Check database backup:**

```bash
# List backup contents (table list)
PGPASSWORD=your_password pg_restore -l /var/backups/cepcomunicacion/database/cepcomunicacion_2025-10-31_02-00-00.dump

# Verify checksum
cd /var/backups/cepcomunicacion/database/
sha256sum -c cepcomunicacion_2025-10-31_02-00-00.dump.sha256
```

**Check media backup:**

```bash
# Verify backup directory
ls -lh /var/backups/cepcomunicacion/media/2025-10-31_03-00-00/

# Compare file counts
echo "Production: $(find /var/www/cepcomunicacion/uploads -type f | wc -l) files"
echo "Backup: $(find /var/backups/cepcomunicacion/media/latest -type f | wc -l) files"
```

**Check config backup:**

```bash
# List archive contents
tar -tzf /var/backups/cepcomunicacion/config/config_2025-10-31_02-30-00.tar.gz

# Verify checksum
cd /var/backups/cepcomunicacion/config/
sha256sum -c config_2025-10-31_02-30-00.tar.gz.sha256
```

### Test Restore Process

**Create test environment:**

```bash
# Create test database
sudo -u postgres createdb cepcomunicacion_test

# Restore to test database
DB_NAME=cepcomunicacion_test /infra/backup/scripts/restore-database.sh /var/backups/cepcomunicacion/database/cepcomunicacion_2025-10-31_02-00-00.dump --force

# Verify data
PGPASSWORD=your_password psql -h localhost -U cepcomunicacion -d cepcomunicacion_test -c "\dt"

# Cleanup
sudo -u postgres dropdb cepcomunicacion_test
```

**Test media restore:**

```bash
# Create test directory
mkdir -p /tmp/media-restore-test

# Restore to test directory
TARGET_DIR=/tmp/media-restore-test /infra/backup/scripts/restore-media.sh /var/backups/cepcomunicacion/media/latest --force

# Verify
ls -lh /tmp/media-restore-test/

# Cleanup
rm -rf /tmp/media-restore-test
```

### Cleanup Old Backups Manually

**Database backups:**

```bash
# List old backups
find /var/backups/cepcomunicacion/database -name "cepcomunicacion_*.dump" -mtime +30

# Delete old backups (30+ days)
find /var/backups/cepcomunicacion/database -name "cepcomunicacion_*.dump" -mtime +30 -delete
find /var/backups/cepcomunicacion/database -name "cepcomunicacion_*.dump.sha256" -mtime +30 -delete
```

**Media backups:**

```bash
# List old backups
find /var/backups/cepcomunicacion/media -maxdepth 1 -type d -mtime +30

# Delete old backups (30+ days)
find /var/backups/cepcomunicacion/media -maxdepth 1 -type d -mtime +30 ! -name "latest" -exec rm -rf {} \;
```

### Update Cron Schedule

**Edit crontab:**

```bash
crontab -e
```

**Change backup times:**

```bash
# Change database backup to 3:00 AM
0 3 * * * /infra/backup/scripts/backup-database.sh >> /var/log/cepcomunicacion/cron-backup.log 2>&1
```

**Reload crontab:**

```bash
# After editing, cron automatically reloads
# Verify changes
crontab -l
```

---

## Troubleshooting

### Backup Script Fails

**Check logs:**

```bash
tail -50 /var/log/cepcomunicacion/backup-database.log
tail -50 /var/log/cepcomunicacion/backup-media.log
tail -50 /var/log/cepcomunicacion/backup-config.log
```

**Common issues:**

| Issue | Solution |
|-------|----------|
| `pg_dump: command not found` | Install PostgreSQL client: `apt-get install postgresql-client` |
| `rsync: command not found` | Install rsync: `apt-get install rsync` |
| Permission denied | Run with sudo or check directory permissions |
| Database connection failed | Verify DB credentials in `/etc/cepcomunicacion/backup.conf` |
| Disk full | Clean up old backups or increase disk space |

### Database Connection Issues

**Test connection:**

```bash
PGPASSWORD=your_password psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "SELECT version();"
```

**Check PostgreSQL is running:**

```bash
systemctl status postgresql
# or
docker ps | grep postgres
```

**Verify credentials:**

```bash
# Check .env file
grep DB_ /var/www/cepcomunicacion/.env
```

### Restore Fails

**Database restore errors:**

| Error | Solution |
|-------|----------|
| Database already exists | Use `--force` flag or manually drop database |
| Permission denied | Ensure user has createdb privileges |
| Out of disk space | Clean up /var/lib/postgresql/data |
| Corrupted backup | Restore from earlier backup |

**Media restore errors:**

| Error | Solution |
|-------|----------|
| No space left on device | Clean up target directory or expand disk |
| Permission denied | Run with sudo or fix ownership |
| Symlink loop | Delete and recreate symlink |

### Disk Space Issues

**Check disk usage:**

```bash
# Overall disk usage
df -h

# Backup directory usage
du -sh /var/backups/cepcomunicacion/*

# Find largest backups
du -sh /var/backups/cepcomunicacion/*/* | sort -h | tail -20
```

**Free up space:**

```bash
# Reduce retention period (edit scripts)
nano /infra/backup/scripts/backup-database.sh
# Change RETENTION_DAYS=30 to RETENTION_DAYS=7

# Manually clean old backups
find /var/backups/cepcomunicacion -type f -mtime +60 -delete

# Compress old backups
find /var/backups/cepcomunicacion/database -name "*.dump" -mtime +30 -exec gzip {} \;
```

### Cron Jobs Not Running

**Check cron service:**

```bash
systemctl status cron
# or
systemctl status crond
```

**Check crontab:**

```bash
crontab -l
```

**Check cron logs:**

```bash
grep CRON /var/log/syslog | tail -50
# or
tail -f /var/log/cepcomunicacion/cron-backup.log
```

**Verify script permissions:**

```bash
ls -l /infra/backup/scripts/*.sh
# All scripts should be executable (x)
chmod +x /infra/backup/scripts/*.sh
```

### Email Alerts Not Working

**Test mail command:**

```bash
echo "Test" | mail -s "Test Subject" your@email.com
```

**Check mail logs:**

```bash
tail -f /var/log/mail.log
```

**Install mail utilities:**

```bash
apt-get install -y mailutils postfix
```

**Configure postfix:**

```bash
dpkg-reconfigure postfix
# Select "Internet Site" and enter your domain
```

---

## Best Practices

### Security

1. **Protect backup files:**
   ```bash
   chmod 700 /var/backups/cepcomunicacion
   chmod 600 /var/backups/cepcomunicacion/config/*
   ```

2. **Encrypt sensitive backups:**
   ```bash
   # Encrypt config backup
   gpg --encrypt --recipient your@email.com config_2025-10-31_02-30-00.tar.gz
   ```

3. **Use dedicated backup user:**
   ```bash
   # Create backup user
   useradd -r -s /bin/bash backup
   chown -R backup:backup /var/backups/cepcomunicacion
   ```

4. **Rotate database credentials:**
   ```bash
   # Change DB password periodically
   ALTER USER cepcomunicacion PASSWORD 'new_secure_password';
   # Update /etc/cepcomunicacion/backup.conf
   ```

### Reliability

1. **Test restores quarterly:**
   - Schedule in calendar: 1st week of every quarter
   - Perform full restore to test environment
   - Document restore time (RTO)
   - Verify data integrity

2. **Monitor backup success:**
   - Check `/var/run/cepcomunicacion-backup-status.json` daily
   - Configure external monitoring (Healthchecks.io)
   - Set up alerts for 2+ consecutive failures

3. **Verify backup completeness:**
   ```bash
   # Weekly backup verification script
   /infra/backup/scripts/verify-backup-integrity.sh
   ```

4. **Maintain backup documentation:**
   - Keep this README.md updated
   - Document any custom modifications
   - Record restore test results

### Performance

1. **Schedule backups during low traffic:**
   - Default: 2:00-4:00 AM UTC
   - Adjust based on analytics data
   - Avoid business hours

2. **Use compression:**
   - Database: pg_dump custom format (built-in compression)
   - Media: Consider pre-compressing large files
   - Config: tar with gzip (`-z` flag)

3. **Optimize database backups:**
   ```bash
   # Use parallel dump for large databases
   pg_dump -j 4 -Fd -f /backup/dir ...
   ```

4. **Monitor backup duration:**
   ```bash
   # Check backup script logs
   grep "Backup completed" /var/log/cepcomunicacion/backup-*.log
   ```

### Compliance

1. **Data retention policy:**
   - Daily: 30 days (operational recovery)
   - Weekly: 12 weeks (regulatory compliance)
   - Monthly: 12 months (long-term archive)

2. **GDPR compliance:**
   - Encrypt backups containing personal data
   - Document data location (local + S3)
   - Implement data deletion procedures
   - Log all restore operations

3. **Audit trail:**
   ```bash
   # All backups and restores are logged
   grep -E "(backup|restore)" /var/log/cepcomunicacion/*.log
   ```

4. **Off-site backup:**
   - Enable S3 sync for disaster recovery
   - Use different geographic region
   - Test off-site restore procedures

---

## Additional Resources

### Related Documentation

- [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md) - Complete disaster recovery plan
- [INSTALLATION.md](./INSTALLATION.md) - Detailed installation and testing guide
- [SECURITY.md](./SECURITY.md) - Security best practices for backups

### External Links

- [PostgreSQL pg_dump Documentation](https://www.postgresql.org/docs/current/app-pgdump.html)
- [rsync Man Page](https://linux.die.net/man/1/rsync)
- [3-2-1 Backup Rule](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/)
- [AWS S3 Backup Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/backup-and-restore.html)

### Support

For questions or issues with the backup system:

1. Check this documentation
2. Review logs in `/var/log/cepcomunicacion/`
3. Test individual components manually
4. Contact: admin@cepcomunicacion.com

---

**Last Updated:** 2025-10-31
**Version:** 1.0
**Maintained by:** SOLARIA AGENCY
**Project:** CEPComunicacion v2
