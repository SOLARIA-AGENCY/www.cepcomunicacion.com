# Backup System Installation & Testing Guide

## Table of Contents

1. [Pre-Installation Checklist](#pre-installation-checklist)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Testing Procedures](#testing-procedures)
5. [Validation](#validation)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## Pre-Installation Checklist

### System Requirements

**Operating System:**
- Ubuntu 22.04 LTS or higher (recommended)
- Debian 11+ (supported)
- CentOS/RHEL 8+ (supported with modifications)

**Hardware Requirements:**
- Minimum 50 GB free disk space for backups
- Recommended 100+ GB for 30-day retention
- 2+ GB RAM (for large database restores)
- Network connectivity for S3 sync (optional)

**Software Requirements:**
- [ ] PostgreSQL client tools (v12+)
- [ ] rsync (v3.0+)
- [ ] tar and gzip
- [ ] bash (v4.0+)
- [ ] curl (for webhook notifications)
- [ ] AWS CLI (optional, for S3 integration)
- [ ] mail utilities (optional, for email alerts)

**Access Requirements:**
- [ ] Root or sudo access to server
- [ ] Database credentials (username, password, host, port)
- [ ] Write access to `/var/backups/`
- [ ] Write access to `/var/log/`
- [ ] SSH access to server (for remote management)

**Network Requirements:**
- [ ] Outbound HTTPS (443) for S3 uploads
- [ ] Outbound SMTP (25/587) for email alerts
- [ ] Outbound HTTPS for webhooks (Slack/Discord)

---

## Installation Steps

### Step 1: Install Dependencies

```bash
# Update package list
sudo apt-get update

# Install PostgreSQL client tools
sudo apt-get install -y postgresql-client

# Verify PostgreSQL client version
psql --version
# Expected: psql (PostgreSQL) 14.x or higher

# Install rsync (usually pre-installed)
sudo apt-get install -y rsync

# Verify rsync version
rsync --version
# Expected: rsync version 3.x

# Install additional utilities
sudo apt-get install -y \
  curl \
  wget \
  tar \
  gzip \
  findutils \
  coreutils

# Optional: Install AWS CLI for S3 integration
sudo apt-get install -y awscli

# Optional: Install mail utilities for email alerts
sudo apt-get install -y mailutils postfix

# Verify all installations
which psql rsync tar gzip curl
```

**Expected Output:**
```
/usr/bin/psql
/usr/bin/rsync
/bin/tar
/bin/gzip
/usr/bin/curl
```

---

### Step 2: Create Directory Structure

```bash
# Create backup directories
sudo mkdir -p /var/backups/cepcomunicacion/database/weekly
sudo mkdir -p /var/backups/cepcomunicacion/media
sudo mkdir -p /var/backups/cepcomunicacion/config
sudo mkdir -p /var/backups/cepcomunicacion/database/pre-restore
sudo mkdir -p /var/backups/cepcomunicacion/media/pre-restore
sudo mkdir -p /var/backups/cepcomunicacion/config/pre-restore

# Create log directory
sudo mkdir -p /var/log/cepcomunicacion

# Set permissions (backup directory should be restricted)
sudo chmod 700 /var/backups/cepcomunicacion
sudo chmod 755 /var/log/cepcomunicacion

# Verify directory structure
tree -L 3 /var/backups/cepcomunicacion
tree -L 1 /var/log/cepcomunicacion
```

**Expected Output:**
```
/var/backups/cepcomunicacion
├── config
│   └── pre-restore
├── database
│   ├── pre-restore
│   └── weekly
└── media
    └── pre-restore

/var/log/cepcomunicacion
```

---

### Step 3: Copy Backup Scripts

**Option A: From Git Repository**

```bash
# Navigate to repository
cd /path/to/cepcomunicacion-repository

# Copy scripts to system location
sudo cp -r infra/backup/scripts /opt/cepcomunicacion-backup/

# Make scripts executable
sudo chmod +x /opt/cepcomunicacion-backup/scripts/*.sh

# Verify permissions
ls -l /opt/cepcomunicacion-backup/scripts/
```

**Option B: Manual Download**

```bash
# Create scripts directory
sudo mkdir -p /opt/cepcomunicacion-backup/scripts

# Download scripts (adjust URLs to your repository)
sudo curl -o /opt/cepcomunicacion-backup/scripts/backup-database.sh \
  https://raw.githubusercontent.com/your-org/cepcomunicacion/main/infra/backup/scripts/backup-database.sh

sudo curl -o /opt/cepcomunicacion-backup/scripts/backup-database-weekly.sh \
  https://raw.githubusercontent.com/your-org/cepcomunicacion/main/infra/backup/scripts/backup-database-weekly.sh

sudo curl -o /opt/cepcomunicacion-backup/scripts/backup-media.sh \
  https://raw.githubusercontent.com/your-org/cepcomunicacion/main/infra/backup/scripts/backup-media.sh

sudo curl -o /opt/cepcomunicacion-backup/scripts/backup-config.sh \
  https://raw.githubusercontent.com/your-org/cepcomunicacion/main/infra/backup/scripts/backup-config.sh

sudo curl -o /opt/cepcomunicacion-backup/scripts/restore-database.sh \
  https://raw.githubusercontent.com/your-org/cepcomunicacion/main/infra/backup/scripts/restore-database.sh

sudo curl -o /opt/cepcomunicacion-backup/scripts/restore-media.sh \
  https://raw.githubusercontent.com/your-org/cepcomunicacion/main/infra/backup/scripts/restore-media.sh

sudo curl -o /opt/cepcomunicacion-backup/scripts/restore-config.sh \
  https://raw.githubusercontent.com/your-org/cepcomunicacion/main/infra/backup/scripts/restore-config.sh

sudo curl -o /opt/cepcomunicacion-backup/scripts/check-backups.sh \
  https://raw.githubusercontent.com/your-org/cepcomunicacion/main/infra/backup/scripts/check-backups.sh

# Make executable
sudo chmod +x /opt/cepcomunicacion-backup/scripts/*.sh
```

**Verify scripts:**

```bash
# List scripts
ls -lh /opt/cepcomunicacion-backup/scripts/

# Expected output:
# -rwxr-xr-x backup-database.sh
# -rwxr-xr-x backup-database-weekly.sh
# -rwxr-xr-x backup-media.sh
# -rwxr-xr-x backup-config.sh
# -rwxr-xr-x restore-database.sh
# -rwxr-xr-x restore-media.sh
# -rwxr-xr-x restore-config.sh
# -rwxr-xr-x check-backups.sh
```

---

### Step 4: Create Configuration File

```bash
# Create configuration directory
sudo mkdir -p /etc/cepcomunicacion

# Create configuration file
sudo nano /etc/cepcomunicacion/backup.conf
```

**Configuration template:**

```bash
################################################################################
# CEPComunicacion Backup Configuration
################################################################################

# Database Configuration
DB_NAME=cepcomunicacion
DB_USER=cepcomunicacion
DB_PASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI=
DB_HOST=localhost
DB_PORT=5432

# Application Directory
APP_DIR=/var/www/cepcomunicacion
SOURCE_DIR=/var/www/cepcomunicacion/uploads

# Backup Directories
BACKUP_DIR=/var/backups/cepcomunicacion
LOG_FILE=/var/log/cepcomunicacion/backup.log

# Retention Policies
RETENTION_DAYS=30
RETENTION_WEEKS=12

# Backup Size Thresholds (for monitoring)
MIN_DB_BACKUP_SIZE_MB=1
MIN_MEDIA_BACKUP_SIZE_MB=10
MAX_BACKUP_AGE_HOURS=24

# Notification Configuration
ENABLE_EMAIL_ALERTS=false
ALERT_EMAIL=admin@cepcomunicacion.com

ENABLE_SLACK_ALERTS=false
SLACK_WEBHOOK=

ENABLE_DISCORD_ALERTS=false
DISCORD_WEBHOOK=

# S3 Configuration (optional)
ENABLE_S3_UPLOAD=false
S3_BUCKET=s3://cepcomunicacion-backups

# External Monitoring (optional)
HEALTHCHECK_URL=

################################################################################
# END OF CONFIGURATION
################################################################################
```

**Secure configuration file:**

```bash
# Set restrictive permissions (config contains passwords!)
sudo chmod 600 /etc/cepcomunicacion/backup.conf

# Verify permissions
ls -l /etc/cepcomunicacion/backup.conf
# Expected: -rw------- (600)
```

---

### Step 5: Test Database Connection

Before running backups, verify database connectivity:

```bash
# Test connection using psql
PGPASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI= psql \
  -h localhost \
  -U cepcomunicacion \
  -d cepcomunicacion \
  -c "SELECT version();"
```

**Expected output:**
```
                                                version
-------------------------------------------------------------------------------------------------------
 PostgreSQL 16.x on x86_64-pc-linux-gnu, compiled by gcc...
(1 row)
```

**If connection fails:**

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql
# or
docker ps | grep postgres

# Check connection parameters
grep DB_ /etc/cepcomunicacion/backup.conf

# Check if user has permissions
PGPASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI= psql \
  -h localhost \
  -U cepcomunicacion \
  -d postgres \
  -c "\du cepcomunicacion"
```

---

### Step 6: Run Test Backups

**Test Database Backup:**

```bash
# Load configuration
source /etc/cepcomunicacion/backup.conf

# Run database backup script
sudo /opt/cepcomunicacion-backup/scripts/backup-database.sh

# Check log for errors
tail -50 /var/log/cepcomunicacion/backup-database.log

# Verify backup file created
ls -lh /var/backups/cepcomunicacion/database/
```

**Expected output:**
```
-rw------- 1 root root 18M Oct 31 14:30 cepcomunicacion_2025-10-31_14-30-00.dump
-rw------- 1 root root  89 Oct 31 14:30 cepcomunicacion_2025-10-31_14-30-00.dump.sha256
```

**Test Media Backup:**

```bash
# Run media backup script
sudo SOURCE_DIR=/var/www/cepcomunicacion/uploads /opt/cepcomunicacion-backup/scripts/backup-media.sh

# Check log
tail -50 /var/log/cepcomunicacion/backup-media.log

# Verify backup directory created
ls -lh /var/backups/cepcomunicacion/media/
```

**Expected output:**
```
drwx------ 2 root root 4.0K Oct 31 14:35 2025-10-31_14-35-00
lrwxrwxrwx 1 root root   19 Oct 31 14:35 latest -> 2025-10-31_14-35-00
```

**Test Configuration Backup:**

```bash
# Run config backup script
sudo APP_DIR=/var/www/cepcomunicacion /opt/cepcomunicacion-backup/scripts/backup-config.sh

# Check log
tail -50 /var/log/cepcomunicacion/backup-config.log

# Verify backup file
ls -lh /var/backups/cepcomunicacion/config/
```

**Expected output:**
```
-rw------- 1 root root 120K Oct 31 14:40 config_2025-10-31_14-40-00.tar.gz
-rw------- 1 root root   89 Oct 31 14:40 config_2025-10-31_14-40-00.tar.gz.sha256
```

---

### Step 7: Install Cron Jobs

**Copy crontab file:**

```bash
# Copy crontab template
sudo cp infra/backup/crontab /opt/cepcomunicacion-backup/crontab

# Edit crontab to adjust script paths
sudo nano /opt/cepcomunicacion-backup/crontab
```

**Update paths in crontab:**

```bash
# Change from:
0 2 * * * /infra/backup/scripts/backup-database.sh

# To:
0 2 * * * /opt/cepcomunicacion-backup/scripts/backup-database.sh
```

**Install crontab:**

```bash
# Install for root user (recommended for system backups)
sudo crontab /opt/cepcomunicacion-backup/crontab

# Verify installation
sudo crontab -l

# Check cron service is running
sudo systemctl status cron
```

**Expected output:**
```
● cron.service - Regular background program processing daemon
   Loaded: loaded (/lib/systemd/system/cron.service; enabled)
   Active: active (running) since...
```

---

## Configuration

### Environment Variables

Scripts support environment variable configuration. You can either:

**Option A: Source configuration file**

```bash
# Add to backup scripts
source /etc/cepcomunicacion/backup.conf
/opt/cepcomunicacion-backup/scripts/backup-database.sh
```

**Option B: Export in shell profile**

```bash
# Add to /root/.bashrc or /root/.profile
export DB_NAME=cepcomunicacion
export DB_USER=cepcomunicacion
export DB_PASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI=
export BACKUP_DIR=/var/backups/cepcomunicacion
```

**Option C: Inline environment variables**

```bash
DB_NAME=cepcomunicacion DB_PASSWORD=secret /opt/cepcomunicacion-backup/scripts/backup-database.sh
```

### Email Alerts Configuration

**Install and configure mail:**

```bash
# Install postfix
sudo apt-get install -y postfix mailutils

# Configure postfix
sudo dpkg-reconfigure postfix
# Select: Internet Site
# System mail name: cepcomunicacion.com
```

**Test email:**

```bash
echo "Test email from backup system" | mail -s "Test" admin@cepcomunicacion.com
```

**Enable in configuration:**

```bash
sudo nano /etc/cepcomunicacion/backup.conf

# Update:
ENABLE_EMAIL_ALERTS=true
ALERT_EMAIL=admin@cepcomunicacion.com
```

### Slack Integration

**Get webhook URL:**
1. Go to https://api.slack.com/apps
2. Create app or select existing
3. Enable Incoming Webhooks
4. Create webhook for channel
5. Copy webhook URL

**Configure:**

```bash
sudo nano /etc/cepcomunicacion/backup.conf

# Update:
ENABLE_SLACK_ALERTS=true
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Test:**

```bash
# Test Slack notification
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test from CEPComunicacion backup system"}' \
  https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### S3 Integration

**Install AWS CLI:**

```bash
sudo apt-get install -y awscli
```

**Configure credentials:**

```bash
aws configure
# AWS Access Key ID: YOUR_KEY
# AWS Secret Access Key: YOUR_SECRET
# Default region name: eu-west-1
# Default output format: json
```

**Test S3 access:**

```bash
# List buckets
aws s3 ls

# Test upload
echo "test" > /tmp/test.txt
aws s3 cp /tmp/test.txt s3://cepcomunicacion-backups/test.txt
aws s3 rm s3://cepcomunicacion-backups/test.txt
```

**Enable in configuration:**

```bash
sudo nano /etc/cepcomunicacion/backup.conf

# Update:
ENABLE_S3_UPLOAD=true
S3_BUCKET=s3://cepcomunicacion-backups
```

---

## Testing Procedures

### Test 1: Database Backup and Restore

**Objective:** Verify database can be backed up and restored successfully.

**Procedure:**

```bash
# Step 1: Create test database with sample data
sudo -u postgres createdb cepcomunicacion_test
PGPASSWORD=secret psql -h localhost -U cepcomunicacion -d cepcomunicacion_test -c "
CREATE TABLE test_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO test_table (name) VALUES ('Test 1'), ('Test 2'), ('Test 3');
"

# Step 2: Backup test database
DB_NAME=cepcomunicacion_test /opt/cepcomunicacion-backup/scripts/backup-database.sh

# Step 3: Verify backup file
BACKUP_FILE=$(ls -t /var/backups/cepcomunicacion/database/cepcomunicacion_test_*.dump | head -1)
echo "Backup file: $BACKUP_FILE"
ls -lh "$BACKUP_FILE"

# Step 4: Drop test database
sudo -u postgres dropdb cepcomunicacion_test

# Step 5: Restore from backup
DB_NAME=cepcomunicacion_test /opt/cepcomunicacion-backup/scripts/restore-database.sh "$BACKUP_FILE" --force

# Step 6: Verify data
PGPASSWORD=secret psql -h localhost -U cepcomunicacion -d cepcomunicacion_test -c "SELECT * FROM test_table;"

# Step 7: Cleanup
sudo -u postgres dropdb cepcomunicacion_test
rm -f "$BACKUP_FILE" "${BACKUP_FILE}.sha256"
```

**Expected result:** All 3 test records restored correctly.

---

### Test 2: Media Backup and Restore

**Objective:** Verify media files can be backed up and restored.

**Procedure:**

```bash
# Step 1: Create test media directory with sample files
mkdir -p /tmp/test-media
echo "Test file 1" > /tmp/test-media/file1.txt
echo "Test file 2" > /tmp/test-media/file2.txt
mkdir -p /tmp/test-media/subfolder
echo "Test file 3" > /tmp/test-media/subfolder/file3.txt

# Step 2: Backup test media
SOURCE_DIR=/tmp/test-media /opt/cepcomunicacion-backup/scripts/backup-media.sh

# Step 3: Verify backup
BACKUP_DIR=$(ls -td /var/backups/cepcomunicacion/media/20* | head -1)
echo "Backup directory: $BACKUP_DIR"
ls -lR "$BACKUP_DIR"

# Step 4: Delete original files
rm -rf /tmp/test-media

# Step 5: Restore from backup
TARGET_DIR=/tmp/test-media-restored /opt/cepcomunicacion-backup/scripts/restore-media.sh "$BACKUP_DIR" --force

# Step 6: Verify restored files
diff -r "$BACKUP_DIR" /tmp/test-media-restored

# Step 7: Cleanup
rm -rf /tmp/test-media-restored "$BACKUP_DIR"
```

**Expected result:** All files restored with correct content and structure.

---

### Test 3: Configuration Backup and Restore

**Objective:** Verify configuration files can be backed up and restored.

**Procedure:**

```bash
# Step 1: Create test configuration files
mkdir -p /tmp/test-app
echo "DB_PASSWORD=secret123" > /tmp/test-app/.env
echo "version: '3.8'" > /tmp/test-app/docker-compose.yml

# Step 2: Backup test config
APP_DIR=/tmp/test-app /opt/cepcomunicacion-backup/scripts/backup-config.sh

# Step 3: Verify backup
BACKUP_FILE=$(ls -t /var/backups/cepcomunicacion/config/config_*.tar.gz | head -1)
echo "Backup file: $BACKUP_FILE"
tar -tzf "$BACKUP_FILE"

# Step 4: Modify original files
echo "DB_PASSWORD=modified" > /tmp/test-app/.env

# Step 5: Restore from backup
TARGET_DIR=/tmp/test-app /opt/cepcomunicacion-backup/scripts/restore-config.sh "$BACKUP_FILE" --force

# Step 6: Verify restoration
cat /tmp/test-app/.env
# Should show: DB_PASSWORD=secret123

# Step 7: Cleanup
rm -rf /tmp/test-app "$BACKUP_FILE" "${BACKUP_FILE}.sha256"
```

**Expected result:** Configuration restored to original state.

---

### Test 4: Backup Monitoring

**Objective:** Verify monitoring script detects issues.

**Procedure:**

```bash
# Step 1: Create valid backup
/opt/cepcomunicacion-backup/scripts/backup-database.sh

# Step 2: Run monitoring check (should pass)
/opt/cepcomunicacion-backup/scripts/check-backups.sh
echo "Exit code: $?"
# Expected: 0 (success)

# Step 3: Delete backup to simulate failure
rm -f /var/backups/cepcomunicacion/database/cepcomunicacion_*.dump

# Step 4: Run monitoring check again (should fail)
/opt/cepcomunicacion-backup/scripts/check-backups.sh
echo "Exit code: $?"
# Expected: 2 (critical error)

# Step 5: Check status JSON
cat /var/run/cepcomunicacion-backup-status.json

# Step 6: Recreate backup
/opt/cepcomunicacion-backup/scripts/backup-database.sh
```

**Expected result:** Monitoring correctly detects backup presence/absence.

---

### Test 5: Cron Job Execution

**Objective:** Verify cron jobs execute successfully.

**Procedure:**

```bash
# Step 1: Check crontab installed
sudo crontab -l | grep backup

# Step 2: Manually trigger cron job (test syntax)
sudo run-parts --test /etc/cron.daily

# Step 3: Wait for scheduled execution or trigger manually
# Edit crontab to run in 2 minutes
sudo crontab -e
# Change: 0 2 * * * /opt/cepcomunicacion-backup/scripts/backup-database.sh
# To: */2 * * * * /opt/cepcomunicacion-backup/scripts/backup-database.sh

# Step 4: Wait 2 minutes and check logs
tail -f /var/log/cepcomunicacion/cron-backup.log

# Step 5: Verify backup created
ls -lt /var/backups/cepcomunicacion/database/ | head -5

# Step 6: Restore original schedule
sudo crontab /opt/cepcomunicacion-backup/crontab
```

**Expected result:** Cron executes backups on schedule.

---

## Validation

### Validation Checklist

After installation and testing, verify the following:

#### File System Validation

```bash
# Check all directories exist
[ -d /var/backups/cepcomunicacion/database ] && echo "✓ Database backup dir exists"
[ -d /var/backups/cepcomunicacion/media ] && echo "✓ Media backup dir exists"
[ -d /var/backups/cepcomunicacion/config ] && echo "✓ Config backup dir exists"
[ -d /var/log/cepcomunicacion ] && echo "✓ Log dir exists"

# Check script permissions
[ -x /opt/cepcomunicacion-backup/scripts/backup-database.sh ] && echo "✓ Database backup script executable"
[ -x /opt/cepcomunicacion-backup/scripts/restore-database.sh ] && echo "✓ Database restore script executable"

# Check configuration file
[ -f /etc/cepcomunicacion/backup.conf ] && echo "✓ Configuration file exists"
[ $(stat -c %a /etc/cepcomunicacion/backup.conf) = "600" ] && echo "✓ Config file has secure permissions"
```

#### Backup Validation

```bash
# Check recent backups exist
find /var/backups/cepcomunicacion/database -name "cepcomunicacion_*.dump" -mtime -1 | wc -l
# Expected: 1 or more

# Verify backup integrity
LATEST_DB_BACKUP=$(ls -t /var/backups/cepcomunicacion/database/cepcomunicacion_*.dump | head -1)
pg_restore -l "$LATEST_DB_BACKUP" | head -10
# Should show table of contents without errors

# Check backup sizes
du -sh /var/backups/cepcomunicacion/database
du -sh /var/backups/cepcomunicacion/media
du -sh /var/backups/cepcomunicacion/config
```

#### Monitoring Validation

```bash
# Run health check
/opt/cepcomunicacion-backup/scripts/check-backups.sh

# Check status JSON
cat /var/run/cepcomunicacion-backup-status.json | jq .
# Expected: overall_status = "OK"
```

#### Cron Validation

```bash
# Verify crontab installed
sudo crontab -l | grep -c backup
# Expected: 4 or more entries

# Check cron logs
grep -i backup /var/log/syslog | tail -10
```

---

## Troubleshooting

### Common Issues

#### Issue 1: "pg_dump: command not found"

**Solution:**
```bash
sudo apt-get install -y postgresql-client
which pg_dump
```

#### Issue 2: "Permission denied" when running backups

**Solution:**
```bash
# Run with sudo
sudo /opt/cepcomunicacion-backup/scripts/backup-database.sh

# Or fix permissions
sudo chown -R root:root /opt/cepcomunicacion-backup/scripts
sudo chmod +x /opt/cepcomunicacion-backup/scripts/*.sh
```

#### Issue 3: Database connection fails

**Solution:**
```bash
# Test connection manually
PGPASSWORD=your_password psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "SELECT 1;"

# Check PostgreSQL is running
sudo systemctl status postgresql
docker ps | grep postgres

# Verify credentials in config
cat /etc/cepcomunicacion/backup.conf | grep DB_
```

#### Issue 4: Backups not running via cron

**Solution:**
```bash
# Check cron service
sudo systemctl status cron

# Check crontab syntax
sudo crontab -l

# Test script manually
sudo /opt/cepcomunicacion-backup/scripts/backup-database.sh

# Check cron logs
sudo tail -f /var/log/syslog | grep CRON
```

#### Issue 5: Disk space full

**Solution:**
```bash
# Check disk usage
df -h

# Find large backups
du -sh /var/backups/cepcomunicacion/*

# Clean old backups manually
find /var/backups/cepcomunicacion/database -name "*.dump" -mtime +60 -delete

# Reduce retention in config
sudo nano /etc/cepcomunicacion/backup.conf
# Change: RETENTION_DAYS=30 to RETENTION_DAYS=7
```

---

## Production Deployment

### Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests pass (sections 5.1-5.5)
- [ ] Database credentials verified
- [ ] Backup retention policy approved
- [ ] Disk space sufficient (100+ GB recommended)
- [ ] Email alerts configured and tested
- [ ] Monitoring enabled
- [ ] Cron schedule reviewed
- [ ] Documentation reviewed with team
- [ ] Disaster recovery plan reviewed
- [ ] Emergency contacts updated

### Deployment Steps

```bash
# 1. Install on production server
ssh root@148.230.118.124

# 2. Follow installation steps (sections 2.1-2.7)

# 3. Run initial backups
/opt/cepcomunicacion-backup/scripts/backup-database.sh
/opt/cepcomunicacion-backup/scripts/backup-media.sh
/opt/cepcomunicacion-backup/scripts/backup-config.sh

# 4. Verify backups created
ls -lh /var/backups/cepcomunicacion/database/
ls -lh /var/backups/cepcomunicacion/media/
ls -lh /var/backups/cepcomunicacion/config/

# 5. Install cron jobs
sudo crontab /opt/cepcomunicacion-backup/crontab

# 6. Enable monitoring
/opt/cepcomunicacion-backup/scripts/check-backups.sh

# 7. Document deployment
# Record installation date, backup sizes, test results
```

### Post-Deployment Monitoring

**Day 1:**
- [ ] Verify first scheduled backup ran
- [ ] Check logs for errors
- [ ] Verify backup files created
- [ ] Test monitoring alerts

**Week 1:**
- [ ] Monitor daily backup success rate
- [ ] Check disk space trends
- [ ] Verify retention policy working
- [ ] Test restore procedure

**Month 1:**
- [ ] Perform quarterly disaster recovery drill
- [ ] Review backup sizes and adjust retention
- [ ] Update documentation with any issues
- [ ] Train team on restore procedures

---

## Maintenance Schedule

### Daily
- Monitor backup success (automated)
- Check disk space (automated)

### Weekly
- Review backup logs manually
- Verify latest backups integrity

### Monthly
- Test restore procedure
- Review retention policy
- Update documentation

### Quarterly
- Full disaster recovery drill
- Review and update configuration
- Audit access and permissions

---

**Installation Guide Version:** 1.0
**Last Updated:** 2025-10-31
**Maintained By:** SOLARIA AGENCY
**Project:** CEPComunicacion v2
