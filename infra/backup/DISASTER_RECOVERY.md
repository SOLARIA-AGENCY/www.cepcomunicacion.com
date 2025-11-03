# Disaster Recovery Plan - CEPComunicacion v2

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Scope & Objectives](#scope--objectives)
3. [Recovery Metrics](#recovery-metrics)
4. [Disaster Scenarios](#disaster-scenarios)
5. [Emergency Contacts](#emergency-contacts)
6. [Recovery Procedures](#recovery-procedures)
7. [Post-Recovery Verification](#post-recovery-verification)
8. [Communication Plan](#communication-plan)
9. [Testing Schedule](#testing-schedule)
10. [Plan Maintenance](#plan-maintenance)

---

## Executive Summary

This Disaster Recovery Plan (DRP) provides comprehensive procedures to restore the CEPComunicacion v2 platform following catastrophic system failures, data loss, security breaches, or infrastructure disasters. The plan is designed to minimize downtime and data loss while ensuring business continuity for CEP Formación's educational operations.

### Quick Reference

| Metric | Target | Maximum |
|--------|--------|---------|
| **RTO** (Recovery Time Objective) | 4 hours | 8 hours |
| **RPO** (Recovery Point Objective) | 24 hours | 48 hours |
| **Data Loss** | Minimal (last backup) | 24 hours |
| **Service Availability** | 99.5% annually | 99.0% minimum |

### Disaster Severity Levels

| Level | Description | Response Time | Team Size |
|-------|-------------|---------------|-----------|
| **P0 - Critical** | Complete system failure, data breach | Immediate | Full team |
| **P1 - Major** | Database corruption, server failure | 1 hour | 2-3 people |
| **P2 - Moderate** | Partial data loss, service degradation | 4 hours | 1-2 people |
| **P3 - Minor** | Individual file corruption, minor issues | Next business day | 1 person |

---

## Scope & Objectives

### In Scope

**Systems Covered:**
- PostgreSQL database (14 Payload collections)
- Next.js frontend application
- Payload CMS backend
- Nginx reverse proxy
- Redis cache and job queue
- Docker containerized services
- Media storage (uploads directory)
- Application configuration files

**Data Covered:**
- Course and convocation data
- Student leads and campaigns
- Media files (images, PDFs, documents)
- User accounts and permissions
- System configurations

### Out of Scope

**Not Covered by This Plan:**
- Third-party service failures (Meta Ads, Mailchimp, WhatsApp API)
- Internet service provider outages
- DNS registrar issues
- SSL certificate authority failures
- Client-side issues (user devices, browsers)

### Objectives

1. **Minimize Downtime:** Restore services within 4 hours
2. **Preserve Data:** Limit data loss to last 24 hours (last backup)
3. **Maintain Integrity:** Ensure restored data is complete and uncorrupted
4. **Document Process:** Record all recovery actions for post-mortem
5. **Communicate Status:** Keep stakeholders informed throughout recovery

---

## Recovery Metrics

### RTO (Recovery Time Objective)

**Definition:** Maximum acceptable time to restore services after disaster.

**Target RTO: 4 hours**

| Service | Target RTO | Critical? |
|---------|-----------|-----------|
| Database (PostgreSQL) | 1 hour | Yes |
| CMS Backend (Payload) | 2 hours | Yes |
| Frontend (Next.js) | 2 hours | Yes |
| Media Files | 3 hours | No |
| Nginx Proxy | 30 minutes | Yes |
| Redis Cache | 30 minutes | No |

**RTO Breakdown:**
1. Assessment and decision (30 minutes)
2. Infrastructure provisioning (1 hour)
3. Database restore (1 hour)
4. Application deployment (1 hour)
5. Testing and verification (30 minutes)

### RPO (Recovery Point Objective)

**Definition:** Maximum acceptable data loss measured in time.

**Target RPO: 24 hours**

**Data Recovery Points:**
- **Daily backups:** 24-hour RPO (acceptable for most scenarios)
- **Weekly backups:** 7-day RPO (long-term recovery)
- **Real-time replication:** 0-minute RPO (future enhancement)

**Critical Data Priorities:**
1. **Priority 1:** Student leads, active campaigns (cannot lose)
2. **Priority 2:** Course catalog, convocations (must restore)
3. **Priority 3:** Media files, marketing content (can recreate)
4. **Priority 4:** Analytics, logs (nice to have)

### Service Level Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Annual Uptime** | 99.5% | 43.8 hours downtime/year |
| **Monthly Uptime** | 99.9% | 43 minutes downtime/month |
| **Maximum Consecutive Downtime** | 8 hours | Per incident |
| **MTTR** (Mean Time To Recovery) | 4 hours | Average |
| **MTBF** (Mean Time Between Failures) | 90 days | Average |

---

## Disaster Scenarios

### Scenario 1: Complete Server Failure

**Description:** Physical server hardware failure, data center outage, or catastrophic OS corruption.

**Impact:**
- All services unavailable
- No access to production server
- Data intact on disk (if not physical failure)

**Recovery Strategy:** Rebuild on new server from backups

**Estimated RTO:** 6-8 hours
**Estimated RPO:** 24 hours

**Procedure:** See [Section 6.1](#61-complete-server-failure-recovery)

---

### Scenario 2: Database Corruption

**Description:** PostgreSQL database corruption due to disk failure, software bug, or manual error.

**Impact:**
- CMS and frontend unable to read/write data
- Application errors
- Data integrity compromised

**Recovery Strategy:** Restore database from latest backup

**Estimated RTO:** 1-2 hours
**Estimated RPO:** 24 hours

**Procedure:** See [Section 6.2](#62-database-corruption-recovery)

---

### Scenario 3: Ransomware Attack

**Description:** Malicious encryption of files, database, or entire system by ransomware.

**Impact:**
- All or partial data encrypted
- System potentially compromised
- Backup integrity may be affected

**Recovery Strategy:** Isolate, clean, and restore from verified clean backups

**Estimated RTO:** 8-12 hours
**Estimated RPO:** 24-48 hours

**Procedure:** See [Section 6.3](#63-ransomware-attack-recovery)

---

### Scenario 4: Accidental Data Deletion

**Description:** Administrator error, script malfunction, or user action deletes critical data.

**Impact:**
- Specific data lost (tables, files, or records)
- System operational but data incomplete

**Recovery Strategy:** Selective restore from backup

**Estimated RTO:** 2-4 hours
**Estimated RPO:** 24 hours

**Procedure:** See [Section 6.4](#64-accidental-data-deletion-recovery)

---

### Scenario 5: Media Storage Loss

**Description:** Uploaded files deleted, corrupted, or storage volume fails.

**Impact:**
- Images, PDFs, documents unavailable
- Frontend displays broken media links
- CMS operational

**Recovery Strategy:** Restore media files from incremental backups

**Estimated RTO:** 3-4 hours
**Estimated RPO:** 24 hours

**Procedure:** See [Section 6.5](#65-media-storage-loss-recovery)

---

### Scenario 6: Docker Container Corruption

**Description:** Docker images corrupted, container configuration lost, or Docker daemon failure.

**Impact:**
- Services fail to start
- Configuration inconsistencies
- Infrastructure code intact

**Recovery Strategy:** Rebuild containers from configuration files

**Estimated RTO:** 2-3 hours
**Estimated RPO:** 0 hours (no data loss)

**Procedure:** See [Section 6.6](#66-docker-container-corruption-recovery)

---

## Emergency Contacts

### Primary Response Team

| Role | Name | Phone | Email | Availability |
|------|------|-------|-------|--------------|
| **Incident Commander** | [Name] | +XX XXX XXX XXX | admin@cepcomunicacion.com | 24/7 |
| **Technical Lead** | [Name] | +XX XXX XXX XXX | tech@cepcomunicacion.com | 24/7 |
| **Database Administrator** | [Name] | +XX XXX XXX XXX | dba@cepcomunicacion.com | Business hours + on-call |
| **DevOps Engineer** | [Name] | +XX XXX XXX XXX | devops@cepcomunicacion.com | 24/7 |

### Escalation Chain

1. **Level 1:** On-call DevOps Engineer (0-30 minutes)
2. **Level 2:** Technical Lead (30-60 minutes)
3. **Level 3:** Incident Commander (1-2 hours)
4. **Level 4:** Executive Management (2+ hours or P0 incidents)

### Vendor Support

| Service | Contact | SLA | Support Hours |
|---------|---------|-----|---------------|
| **Hostinger VPS** | support@hostinger.com | 24 hours | 24/7 |
| **PostgreSQL** | Community forums | N/A | Community |
| **Docker** | Community support | N/A | Community |

### Stakeholder Notification List

**Internal:**
- CEO / Director General
- IT Manager
- Marketing Manager
- Customer Support Manager

**External:**
- Key clients (if service disruption exceeds 4 hours)
- Partner institutions

---

## Recovery Procedures

### 6.1 Complete Server Failure Recovery

**Scenario:** Server is completely inaccessible due to hardware failure, data center disaster, or catastrophic OS failure.

**Prerequisites:**
- Access to backups (local or S3)
- New server or VPS provisioned
- Root/sudo access to new server
- DNS control (to update records)

#### Step 1: Provision New Server

**Time Estimate:** 30-60 minutes

```bash
# Server Requirements
# - Ubuntu 22.04 LTS or higher
# - 4+ CPU cores
# - 8+ GB RAM
# - 100+ GB SSD storage
# - Public IP address
```

**Hostinger VPS Setup:**
1. Log into Hostinger control panel
2. Provision new VPS with Ubuntu 22.04
3. Note IP address: `148.230.118.XXX`
4. Configure SSH access
5. Update DNS records (if IP changed)

#### Step 2: Install Base Dependencies

**Time Estimate:** 20 minutes

```bash
# Connect to new server
ssh root@148.230.118.XXX

# Update system
apt-get update && apt-get upgrade -y

# Install essential packages
apt-get install -y \
  curl \
  wget \
  git \
  vim \
  ufw \
  postgresql-client \
  rsync

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get install -y docker-compose-plugin

# Verify installations
docker --version
docker compose version
psql --version
```

#### Step 3: Clone Application Repository

**Time Estimate:** 10 minutes

```bash
# Create application directory
mkdir -p /var/www/cepcomunicacion
cd /var/www/cepcomunicacion

# Clone repository
git clone https://github.com/your-org/cepcomunicacion.git .

# Checkout production branch
git checkout production

# Verify files
ls -la
```

#### Step 4: Restore Configuration Files

**Time Estimate:** 15 minutes

```bash
# Option A: Restore from local backup
scp backup-server:/var/backups/cepcomunicacion/config/config_latest.tar.gz /tmp/
tar -xzf /tmp/config_latest.tar.gz -C /var/www/cepcomunicacion/

# Option B: Restore from S3
aws s3 cp s3://cepcomunicacion-backups/config/config_latest.tar.gz /tmp/
tar -xzf /tmp/config_latest.tar.gz -C /var/www/cepcomunicacion/

# Option C: Download from backup server
rsync -avz backup-server:/var/backups/cepcomunicacion/config/ /tmp/config-backup/
tar -xzf /tmp/config-backup/config_latest.tar.gz -C /var/www/cepcomunicacion/

# Set correct permissions
chmod 600 /var/www/cepcomunicacion/.env
chmod 644 /var/www/cepcomunicacion/docker-compose.yml
```

**Verify critical files:**
```bash
# Check files exist
ls -l /var/www/cepcomunicacion/.env
ls -l /var/www/cepcomunicacion/docker-compose.yml
ls -l /var/www/cepcomunicacion/infra/nginx/nginx.conf

# Review .env for correct values
cat /var/www/cepcomunicacion/.env
```

#### Step 5: Restore Database

**Time Estimate:** 30-60 minutes

```bash
# Create database directory
mkdir -p /var/lib/postgresql/data

# Start PostgreSQL container (temporary for restore)
docker run -d \
  --name postgres-restore \
  -e POSTGRES_USER=cepcomunicacion \
  -e POSTGRES_PASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI= \
  -v /var/lib/postgresql/data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16

# Wait for PostgreSQL to start
sleep 10

# Download latest database backup
# Option A: From local backup server
scp backup-server:/var/backups/cepcomunicacion/database/cepcomunicacion_latest.dump /tmp/

# Option B: From S3
aws s3 cp s3://cepcomunicacion-backups/database/cepcomunicacion_latest.dump /tmp/

# Restore database
PGPASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI= pg_restore \
  -h localhost \
  -U cepcomunicacion \
  -d cepcomunicacion \
  -v \
  /tmp/cepcomunicacion_latest.dump

# Verify restore
PGPASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI= psql \
  -h localhost \
  -U cepcomunicacion \
  -d cepcomunicacion \
  -c "\dt"

# Stop temporary container
docker stop postgres-restore
docker rm postgres-restore
```

#### Step 6: Restore Media Files

**Time Estimate:** 30-90 minutes (depends on file count)

```bash
# Create uploads directory
mkdir -p /var/www/cepcomunicacion/uploads

# Restore media files
# Option A: From local backup server
rsync -avz backup-server:/var/backups/cepcomunicacion/media/latest/ /var/www/cepcomunicacion/uploads/

# Option B: From S3
aws s3 sync s3://cepcomunicacion-backups/media/latest/ /var/www/cepcomunicacion/uploads/

# Set correct permissions
chown -R www-data:www-data /var/www/cepcomunicacion/uploads
chmod 755 /var/www/cepcomunicacion/uploads
find /var/www/cepcomunicacion/uploads -type f -exec chmod 644 {} \;
find /var/www/cepcomunicacion/uploads -type d -exec chmod 755 {} \;

# Verify restore
ls -lh /var/www/cepcomunicacion/uploads/
du -sh /var/www/cepcomunicacion/uploads/
```

#### Step 7: Deploy Docker Stack

**Time Estimate:** 15-30 minutes

```bash
cd /var/www/cepcomunicacion

# Build and start containers
docker compose -f docker-compose.prod.yml up -d --build

# Wait for services to start
sleep 30

# Check container status
docker compose ps

# Check logs
docker compose logs -f --tail=100
```

#### Step 8: Configure Nginx

**Time Estimate:** 15 minutes

```bash
# Install Nginx (if not using Docker)
apt-get install -y nginx

# Copy Nginx configuration
cp /var/www/cepcomunicacion/infra/nginx/nginx.conf /etc/nginx/sites-available/cepcomunicacion
ln -s /etc/nginx/sites-available/cepcomunicacion /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Enable Nginx on boot
systemctl enable nginx
```

#### Step 9: Configure SSL/TLS

**Time Estimate:** 10 minutes

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d cepcomunicacion.com -d www.cepcomunicacion.com

# Verify auto-renewal
certbot renew --dry-run
```

#### Step 10: Configure Firewall

**Time Estimate:** 10 minutes

```bash
# Enable UFW
ufw --force enable

# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Verify rules
ufw status
```

#### Step 11: Verify Services

**Time Estimate:** 30 minutes

```bash
# Check all services running
docker compose ps

# Test database connectivity
docker compose exec cms pnpm payload status

# Test frontend
curl -I http://localhost:3000

# Test CMS
curl -I http://localhost:3001/admin

# Test via public URL
curl -I https://cepcomunicacion.com
curl -I https://cepcomunicacion.com/admin
```

#### Step 12: Post-Recovery Tasks

**Time Estimate:** 30 minutes

1. **Update DNS records** (if IP changed)
2. **Test critical functionality:**
   - User login
   - Course catalog
   - Lead form submission
   - Media file access
   - Admin dashboard

3. **Enable monitoring:**
   ```bash
   # Install monitoring scripts
   crontab /infra/backup/crontab

   # Test backup script
   /infra/backup/scripts/backup-database.sh
   ```

4. **Document recovery:**
   - Record actions taken
   - Note issues encountered
   - Calculate actual RTO/RPO
   - Update contact list if needed

5. **Notify stakeholders:**
   - Send "services restored" email
   - Update status page
   - Post-mortem meeting scheduled

**Total Estimated Time:** 4-6 hours

---

### 6.2 Database Corruption Recovery

**Scenario:** PostgreSQL database corrupted but server is accessible.

**Time Estimate:** 1-2 hours
**Data Loss:** Up to 24 hours (last backup)

#### Step 1: Assess Damage

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U cepcomunicacion

# Check database status
\l

# Check table integrity
SELECT * FROM pg_stat_database WHERE datname = 'cepcomunicacion';

# Check for corruption
SELECT * FROM pg_stat_activity WHERE datname = 'cepcomunicacion';

# Exit psql
\q
```

#### Step 2: Stop Application Services

```bash
# Stop frontend and CMS (keep database running)
docker compose stop web cms

# Verify no active connections
docker compose exec postgres psql -U cepcomunicacion -c "SELECT * FROM pg_stat_activity WHERE datname = 'cepcomunicacion';"
```

#### Step 3: Create Emergency Backup

```bash
# Attempt to backup current state (may fail if corrupted)
docker compose exec postgres pg_dump -U cepcomunicacion cepcomunicacion > /tmp/emergency_backup_$(date +%Y%m%d_%H%M%S).sql

# If successful, store safely
cp /tmp/emergency_backup_*.sql /var/backups/cepcomunicacion/emergency/
```

#### Step 4: Restore from Backup

```bash
# Use restore script
/infra/backup/scripts/restore-database.sh \
  /var/backups/cepcomunicacion/database/cepcomunicacion_latest.dump \
  --force

# Verify restore
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion -c "\dt"
```

#### Step 5: Restart Services

```bash
# Start all services
docker compose up -d

# Check logs
docker compose logs -f --tail=100

# Test application
curl -I http://localhost:3000
```

#### Step 6: Verify Data Integrity

```bash
# Run integrity checks
docker compose exec cms pnpm payload verify

# Check sample data
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion -c "SELECT COUNT(*) FROM courses;"
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion -c "SELECT COUNT(*) FROM leads;"
```

---

### 6.3 Ransomware Attack Recovery

**Scenario:** System infected with ransomware, files encrypted.

**Time Estimate:** 8-12 hours
**Data Loss:** 24-48 hours

**WARNING:** Do NOT pay ransom. Follow security protocols.

#### Step 1: Immediate Actions (0-15 minutes)

```bash
# ISOLATE SYSTEM IMMEDIATELY
# 1. Disconnect from network
ifconfig eth0 down

# 2. Stop all services
docker compose down

# 3. Stop backups (prevent infection spread)
crontab -r

# 4. Document everything
# Take screenshots
# Record file checksums
# Note ransom message details
```

#### Step 2: Forensic Analysis (1-2 hours)

```bash
# DO NOT start system normally
# Boot from rescue mode or live USB

# Identify encrypted files
find /var/www/cepcomunicacion -name "*.encrypted" -o -name "*.locked"

# Check ransom notes
find / -name "DECRYPT_INSTRUCTIONS.txt" -o -name "README_RANSOM.txt"

# Identify malware
# Use ClamAV or similar
apt-get install clamav
freshclam
clamscan -r /var/www/cepcomunicacion
```

#### Step 3: Verify Backup Integrity

```bash
# Check if backups are clean (not encrypted)
# Test backup files
tar -tzf /var/backups/cepcomunicacion/config/config_latest.tar.gz

# Test database backup
pg_restore -l /var/backups/cepcomunicacion/database/cepcomunicacion_latest.dump

# If local backups compromised, use off-site backups
aws s3 ls s3://cepcomunicacion-backups/
```

#### Step 4: Clean System

```bash
# Option A: Full rebuild (recommended)
# Follow Section 6.1 (Complete Server Failure Recovery)

# Option B: Clean infection
# Remove malware
# Reinstall affected packages
# This is NOT recommended - full rebuild is safer
```

#### Step 5: Restore from Clean Backup

```bash
# Use backups from BEFORE infection date
# Check backup dates
ls -lh /var/backups/cepcomunicacion/database/

# Restore oldest clean backup
/infra/backup/scripts/restore-database.sh \
  /var/backups/cepcomunicacion/database/cepcomunicacion_2025-10-25_02-00-00.dump

# Restore media files
/infra/backup/scripts/restore-media.sh \
  /var/backups/cepcomunicacion/media/2025-10-25_03-00-00
```

#### Step 6: Security Hardening

```bash
# Update all passwords
ALTER USER cepcomunicacion PASSWORD 'new_secure_password_here';

# Update .env files
nano /var/www/cepcomunicacion/.env

# Update SSH keys
ssh-keygen -t ed25519 -C "new-key@cepcomunicacion.com"

# Update firewall rules
ufw reset
ufw default deny incoming
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Install fail2ban
apt-get install -y fail2ban
systemctl enable fail2ban
```

#### Step 7: Post-Incident Report

1. Document timeline of events
2. Identify entry point
3. Implement additional security measures
4. Report to authorities (if required)
5. Notify affected users (if applicable)

---

### 6.4 Accidental Data Deletion Recovery

**Scenario:** Administrator accidentally deletes tables, records, or files.

**Time Estimate:** 2-4 hours
**Data Loss:** Up to 24 hours

#### Step 1: Stop Further Damage

```bash
# Immediately stop services to prevent overwrites
docker compose stop web cms

# Take snapshot of current state
docker compose exec postgres pg_dump -U cepcomunicacion cepcomunicacion > /tmp/current_state_$(date +%Y%m%d_%H%M%S).sql
```

#### Step 2: Identify What Was Deleted

```bash
# Check PostgreSQL logs
docker compose logs postgres | grep -E "DROP|DELETE|TRUNCATE"

# Check application logs
docker compose logs cms | tail -100

# Identify affected tables/records
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion -c "\dt"
```

#### Step 3: Selective Restore

**Option A: Restore Single Table**

```bash
# Extract specific table from backup
pg_restore -t courses /var/backups/cepcomunicacion/database/cepcomunicacion_latest.dump > /tmp/courses_restore.sql

# Import to production
docker compose exec -T postgres psql -U cepcomunicacion -d cepcomunicacion < /tmp/courses_restore.sql
```

**Option B: Restore Specific Records**

```bash
# Create temporary database
docker compose exec postgres createdb -U cepcomunicacion cepcomunicacion_temp

# Restore full backup to temp database
docker compose exec postgres pg_restore \
  -U cepcomunicacion \
  -d cepcomunicacion_temp \
  /var/backups/cepcomunicacion/database/cepcomunicacion_latest.dump

# Extract specific data
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion_temp -c "COPY (SELECT * FROM courses WHERE id IN (1,2,3)) TO STDOUT WITH CSV HEADER" > /tmp/courses.csv

# Import to production
docker compose exec -T postgres psql -U cepcomunicacion -d cepcomunicacion -c "\COPY courses FROM STDIN WITH CSV HEADER" < /tmp/courses.csv

# Drop temp database
docker compose exec postgres dropdb -U cepcomunicacion cepcomunicacion_temp
```

#### Step 4: Verify Restore

```bash
# Check record counts
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion -c "SELECT COUNT(*) FROM courses;"

# Restart services
docker compose up -d

# Test application
curl -I http://localhost:3000
```

---

### 6.5 Media Storage Loss Recovery

**Scenario:** Uploaded files deleted, corrupted, or storage volume failed.

**Time Estimate:** 3-4 hours

```bash
# Stop services
docker compose stop web cms

# Restore media files
/infra/backup/scripts/restore-media.sh \
  /var/backups/cepcomunicacion/media/latest \
  --force

# Set permissions
chown -R www-data:www-data /var/www/cepcomunicacion/uploads

# Restart services
docker compose up -d

# Verify
ls -lh /var/www/cepcomunicacion/uploads/
```

---

### 6.6 Docker Container Corruption Recovery

**Scenario:** Docker containers fail to start, images corrupted.

**Time Estimate:** 2-3 hours

```bash
# Stop all containers
docker compose down

# Remove all containers
docker compose rm -f

# Remove corrupted images
docker image prune -a -f

# Rebuild from source
docker compose build --no-cache

# Start services
docker compose up -d

# Verify
docker compose ps
```

---

## Post-Recovery Verification

### Critical Functionality Checklist

After completing recovery procedures, verify all critical functionality:

#### Database Verification

```bash
# Check all tables exist
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion -c "\dt"

# Check record counts
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion -c "
SELECT
  'courses' AS table_name, COUNT(*) AS record_count FROM courses
UNION ALL
SELECT 'convocations', COUNT(*) FROM convocations
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'campaigns', COUNT(*) FROM campaigns;
"

# Check database size
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion -c "
SELECT pg_size_pretty(pg_database_size('cepcomunicacion'));
"
```

#### Application Verification

**Frontend (Next.js):**
- [ ] Homepage loads
- [ ] Course catalog displays
- [ ] Course detail pages load
- [ ] Contact form submits
- [ ] Lead tracking works
- [ ] Navigation functional

**CMS (Payload):**
- [ ] Admin login works
- [ ] Course CRUD operations
- [ ] Lead management
- [ ] Media upload functional
- [ ] User permissions enforced
- [ ] API endpoints respond

**Media Files:**
- [ ] Images display correctly
- [ ] PDF documents download
- [ ] No broken links
- [ ] File counts match expected

#### Integration Verification

- [ ] Meta Ads webhook receiving
- [ ] Mailchimp sync working
- [ ] WhatsApp API connected
- [ ] Analytics tracking
- [ ] Email notifications sending

#### Performance Verification

```bash
# Test response times
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://cepcomunicacion.com

# Check container resource usage
docker stats --no-stream

# Check disk space
df -h

# Check database performance
docker compose exec postgres psql -U cepcomunicacion -d cepcomunicacion -c "
SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
"
```

---

## Communication Plan

### Internal Communication

**During Recovery (every 30-60 minutes):**
- Update internal Slack channel
- Email status to management
- Update incident tracking document

**Status Update Template:**

```
INCIDENT UPDATE #X
Time: [HH:MM UTC]
Status: [IN PROGRESS / RESOLVED / BLOCKED]
Progress: [X%]
Current Action: [What we're doing now]
Next Action: [What comes next]
ETA: [Estimated completion time]
Blockers: [Any issues preventing progress]
Data Loss: [Estimated data loss if any]
Contact: [Incident commander name/phone]
```

### External Communication

**Stakeholder Notification (if downtime exceeds 4 hours):**

**Email Template:**

```
Subject: CEPComunicacion - Service Interruption Notice

Dear [Client/Partner],

We are currently experiencing a service interruption affecting cepcomunicacion.com.

Status: We are actively working to restore service
Impact: [Describe what's affected]
Expected Resolution: [ETA]
Data Safety: All data is backed up and secure

We will provide updates every 2 hours until resolved.

For urgent inquiries, contact: emergency@cepcomunicacion.com

We apologize for the inconvenience.

CEP Formación Technical Team
```

### Status Page Updates

**If using status page (e.g., status.cepcomunicacion.com):**

1. Post incident notice immediately
2. Update every 30-60 minutes during recovery
3. Post "resolved" notice when services restored
4. Publish post-mortem within 48 hours

---

## Testing Schedule

### Quarterly Disaster Recovery Drills

**Schedule:** First week of each quarter (January, April, July, October)

**Drill Scenarios:**
- Q1: Database corruption recovery
- Q2: Complete server failure
- Q3: Accidental data deletion
- Q4: Full disaster recovery simulation

**Test Procedure:**
1. Schedule drill with team (2-hour window)
2. Select test environment (staging or isolated)
3. Execute recovery procedure
4. Document time taken (measure RTO)
5. Verify data integrity (measure RPO)
6. Identify improvements
7. Update DRP if needed

**Success Criteria:**
- Recovery completed within target RTO
- No data loss beyond RPO
- All critical functionality verified
- Team comfortable with procedures

---

## Plan Maintenance

### Review Schedule

**Monthly:**
- Verify contact information current
- Test backup integrity
- Review recent incidents

**Quarterly:**
- Update recovery procedures
- Test disaster recovery drill
- Review and update RPO/RTO targets

**Annually:**
- Full plan review and update
- Update vendor contacts
- Review insurance coverage
- Conduct tabletop exercise with full team

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-31 | SOLARIA AGENCY | Initial disaster recovery plan |

### Plan Approval

**Approved By:**
- [ ] Technical Lead: _________________ Date: _______
- [ ] IT Manager: ___________________ Date: _______
- [ ] CEO/Director: _________________ Date: _______

---

**Last Updated:** 2025-10-31
**Next Review:** 2026-01-31
**Maintained By:** SOLARIA AGENCY
**Project:** CEPComunicacion v2
