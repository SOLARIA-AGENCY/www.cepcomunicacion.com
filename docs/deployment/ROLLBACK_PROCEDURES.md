# CEPComunicacion v2 - Rollback Procedures

**Version:** 1.0.0
**Target Environment:** Hostinger VPS srv943151 (148.230.118.124)
**Last Updated:** 2025-10-31
**Critical Severity:** HIGH - Use for production failures only

---

## Table of Contents

1. [Overview](#overview)
2. [When to Roll Back](#when-to-roll-back)
3. [Rollback Decision Matrix](#rollback-decision-matrix)
4. [Immediate Rollback (< 5 minutes)](#immediate-rollback-5-minutes)
5. [Full Rollback (< 15 minutes)](#full-rollback-15-minutes)
6. [Database Rollback](#database-rollback)
7. [Partial Rollback Scenarios](#partial-rollback-scenarios)
8. [Post-Rollback Verification](#post-rollback-verification)
9. [Incident Report Template](#incident-report-template)
10. [Prevention Strategies](#prevention-strategies)

---

## Overview

This document provides step-by-step procedures for rolling back a failed deployment of CEPComunicacion v2. Rollback procedures are designed to restore service as quickly as possible while preserving data integrity.

### Rollback Strategy

CEPComunicacion v2 uses a **blue-green deployment** strategy:
- **Blue Environment:** Previous stable production deployment
- **Green Environment:** New deployment being tested
- **Cutover:** Traffic switches from blue to green after validation
- **Rollback:** Traffic switches back from green to blue if issues arise

### Rollback Objectives

1. **Speed:** Restore service in < 5 minutes for critical issues
2. **Data Integrity:** No data loss during rollback
3. **User Impact:** Minimize disruption to active users
4. **Investigation:** Preserve logs and state for post-mortem analysis

### Critical Contacts

**Emergency Response Team:**
- CTO: [PHONE/EMAIL]
- DevOps Lead: [PHONE/EMAIL]
- Database Admin: [PHONE/EMAIL]
- On-Call Engineer: [PHONE/EMAIL]

**Escalation Path:**
1. On-Call Engineer (immediate response)
2. DevOps Lead (if unresolved after 10 minutes)
3. CTO (if downtime exceeds 30 minutes)

---

## When to Roll Back

### Critical Issues (Roll Back Immediately)

Roll back **immediately** without investigation if:

- ✅ Application completely down (5xx errors on all pages)
- ✅ Database corruption detected
- ✅ Authentication system failure (no one can log in)
- ✅ Data loss or leakage detected
- ✅ GDPR compliance violation
- ✅ Security breach detected
- ✅ Payment system failure (if applicable)
- ✅ Error rate > 25% for more than 2 minutes
- ✅ Response time > 5 seconds for more than 5 minutes

### Major Issues (Roll Back After Quick Investigation)

Investigate for 5 minutes, then roll back if unresolved:

- ⚠️ Specific features not working (e.g., lead forms)
- ⚠️ Admin dashboard partially broken
- ⚠️ Slow performance (response time > 2 seconds)
- ⚠️ Background jobs failing
- ⚠️ Email sending failures
- ⚠️ Error rate 5-25%
- ⚠️ Memory usage > 90%
- ⚠️ Disk usage > 95%

### Minor Issues (Do NOT Roll Back)

Monitor and fix forward for:

- ℹ️ Visual glitches (CSS issues)
- ℹ️ Non-critical console warnings
- ℹ️ Individual user reports (not widespread)
- ℹ️ Analytics tracking issues
- ℹ️ Non-critical integrations down (Meta Ads, Mailchimp if not essential)

---

## Rollback Decision Matrix

| Severity | Error Rate | Response Time | User Impact | Action | Timeframe |
|----------|-----------|---------------|-------------|--------|-----------|
| **Critical** | > 25% | > 5s | Complete outage | Rollback immediately | < 5 min |
| **High** | 10-25% | 2-5s | Major features broken | Investigate 5min → Rollback | < 15 min |
| **Medium** | 5-10% | 1-2s | Minor features broken | Investigate 15min → Decision | < 30 min |
| **Low** | < 5% | < 1s | Edge cases affected | Fix forward | - |

### Decision Tree

```
Is service completely down?
├─ YES → ROLLBACK IMMEDIATELY
└─ NO
   ├─ Error rate > 25%?
   │  ├─ YES → ROLLBACK IMMEDIATELY
   │  └─ NO
   │     ├─ Critical feature broken?
   │     │  ├─ YES → Investigate 5min → ROLLBACK if not fixed
   │     │  └─ NO
   │     │     ├─ Performance degraded?
   │     │     │  ├─ YES → Investigate 15min → ROLLBACK if not fixed
   │     │     │  └─ NO → Monitor and fix forward
```

---

## Immediate Rollback (< 5 minutes)

Use this procedure for **critical production failures** requiring immediate restoration of service.

### Prerequisites

- SSH access to server
- Access to previous deployment directory
- Database backup available (taken before deployment)

### Procedure

#### Step 1: Alert Team (30 seconds)

```bash
# Send alert to team
# Use Slack, email, or SMS automation
# Example Slack webhook:
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "🚨 PRODUCTION ROLLBACK INITIATED - CEPComunicacion v2",
    "attachments": [{
      "color": "danger",
      "fields": [
        {"title": "Time", "value": "'"$(date -u +"%Y-%m-%d %H:%M:%S UTC")"'", "short": true},
        {"title": "Initiator", "value": "'"$USER"'", "short": true},
        {"title": "Reason", "value": "Critical production failure", "short": false}
      ]
    }]
  }'
```

#### Step 2: Stop Current Deployment (30 seconds)

```bash
# SSH to server
ssh root@148.230.118.124

# Stop PM2 process for green deployment
pm2 stop cepcomunicacion-prod

# Verify process stopped
pm2 status
# Expected: cepcomunicacion-prod | stopped
```

#### Step 3: Switch to Blue Environment (1 minute)

```bash
# Navigate to blue environment (previous stable deployment)
cd /var/www/cepcomunicacion-blue

# Verify blue environment exists
ls -la
# Expected: .next/ node_modules/ package.json etc.

# Check blue environment .env
ls -la .env.production
# Expected: -rw------- 1 root root ... .env.production

# Start blue environment
pm2 start ecosystem.config.js --env production

# Wait for app to initialize
sleep 15

# Verify blue environment is running
pm2 status
# Expected: cepcomunicacion-prod | online
```

#### Step 4: Update Nginx (Optional - Only if Port Changed)

If blue and green use different ports:

```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/cepcomunicacion-prod

# Change proxy_pass to blue port (if different)
# Before: proxy_pass http://127.0.0.1:3001;
# After:  proxy_pass http://127.0.0.1:3000;  # Blue port

# Test Nginx configuration
sudo nginx -t
# Expected: syntax is ok

# Reload Nginx (zero downtime)
sudo systemctl reload nginx
```

#### Step 5: Verify Rollback (1 minute)

```bash
# Test homepage
curl -I https://cepcomunicacion.com
# Expected: HTTP/2 200

# Test API health endpoint
curl https://cepcomunicacion.com/api/health
# Expected: {"status":"ok",...}

# Check PM2 logs for errors
pm2 logs cepcomunicacion-prod --lines 20 --err
# Expected: No critical errors

# Check application metrics
pm2 monit
# Expected: CPU < 80%, Memory < 1GB
```

#### Step 6: Notify Team (30 seconds)

```bash
# Send success notification
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "✅ PRODUCTION ROLLBACK COMPLETED - Service Restored",
    "attachments": [{
      "color": "good",
      "fields": [
        {"title": "Time", "value": "'"$(date -u +"%Y-%m-%d %H:%M:%S UTC")"'", "short": true},
        {"title": "Duration", "value": "<5 minutes", "short": true},
        {"title": "Status", "value": "Service restored to blue environment", "short": false}
      ]
    }]
  }'
```

### Verification Checklist

- [ ] PM2 process running (blue environment)
- [ ] Homepage loads (https://cepcomunicacion.com)
- [ ] Admin dashboard accessible
- [ ] API health check returns 200
- [ ] No errors in PM2 logs
- [ ] No errors in Nginx logs
- [ ] Error rate < 1%
- [ ] Response time < 1 second

**Total Time:** < 5 minutes

---

## Full Rollback (< 15 minutes)

Use this procedure for **major issues** that require database restoration and complete environment reset.

### Prerequisites

- SSH access to server
- Database backup (from pre-deployment)
- Full backup of green environment (for forensics)

### Procedure

#### Step 1: Create Backup of Failed Deployment (2 minutes)

**Important:** Preserve failed state for post-mortem analysis.

```bash
# SSH to server
ssh root@148.230.118.124

# Create forensics directory
sudo mkdir -p /var/forensics/$(date +%Y%m%d_%H%M%S)
FORENSICS_DIR=/var/forensics/$(date +%Y%m%d_%H%M%S)

# Backup PM2 logs
pm2 logs cepcomunicacion-prod --lines 1000 --err > $FORENSICS_DIR/pm2_error.log
pm2 logs cepcomunicacion-prod --lines 1000 --out > $FORENSICS_DIR/pm2_out.log

# Backup Nginx logs
sudo cp /var/log/nginx/cepcomunicacion_error.log $FORENSICS_DIR/
sudo cp /var/log/nginx/cepcomunicacion_access.log $FORENSICS_DIR/

# Backup database (current state)
sudo -u postgres pg_dump cepcomunicacion > $FORENSICS_DIR/database_failed_state.sql

# Backup green environment code
sudo tar -czf $FORENSICS_DIR/green_code.tar.gz /var/www/cepcomunicacion/

# Set permissions
sudo chmod 600 $FORENSICS_DIR/*

echo "Forensics saved to: $FORENSICS_DIR"
```

#### Step 2: Stop Failed Deployment (30 seconds)

```bash
# Stop PM2 process
pm2 stop cepcomunicacion-prod
pm2 delete cepcomunicacion-prod

# Verify stopped
pm2 status
# Expected: No processes running
```

#### Step 3: Restore Database (3 minutes)

**Warning:** This will restore database to pre-deployment state. Any data created after deployment will be lost.

```bash
# Identify backup file
ls -lth /var/backups/postgresql/ | head -5
# Look for backup taken just before deployment

# Set backup file path
BACKUP_FILE=/var/backups/postgresql/cepcomunicacion_20251031_020000.sql.gz

# Verify backup file exists
ls -lh $BACKUP_FILE
# Expected: File found with size > 1MB

# Terminate all connections to database
sudo -u postgres psql -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'cepcomunicacion' AND pid <> pg_backend_pid();"

# Drop and recreate database
sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS cepcomunicacion;
CREATE DATABASE cepcomunicacion
  WITH
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_ES.UTF-8'
  LC_CTYPE = 'es_ES.UTF-8'
  TEMPLATE = template0;
GRANT ALL PRIVILEGES ON DATABASE cepcomunicacion TO cepcomunicacion_user;
EOF

# Restore database from backup
gunzip -c $BACKUP_FILE | sudo -u postgres psql cepcomunicacion

# Verify restoration
sudo -u postgres psql cepcomunicacion -c "\dt"
# Expected: All tables listed

# Check record counts
sudo -u postgres psql cepcomunicacion -c "
SELECT 'users' AS table_name, COUNT(*) FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'courses', COUNT(*) FROM courses;
"
# Verify counts match expected pre-deployment numbers
```

#### Step 4: Restore Blue Environment Code (2 minutes)

```bash
# Navigate to blue environment
cd /var/www/cepcomunicacion-blue

# Verify blue environment integrity
ls -la .next/ package.json .env.production
# Expected: All files present

# Verify blue environment database connection
cat .env.production | grep DATABASE_URL
# Expected: DATABASE_URL=postgresql://...

# Test database connection
psql -U cepcomunicacion_user -d cepcomunicacion -h localhost -c "SELECT 1"
# Expected: Successfully connected
```

#### Step 5: Clear Redis Cache (30 seconds)

**Important:** Clear cache to prevent stale data issues.

```bash
# Connect to Redis
redis-cli -a $REDIS_PASSWORD

# Flush all cache
FLUSHALL

# Verify
INFO keyspace
# Expected: No databases with keys

# Exit
EXIT
```

#### Step 6: Start Blue Environment (2 minutes)

```bash
# Navigate to blue environment
cd /var/www/cepcomunicacion-blue

# Start application with PM2
pm2 start ecosystem.config.js --env production

# Wait for initialization
sleep 30

# Check status
pm2 status
# Expected: cepcomunicacion-prod | online

# Check logs for errors
pm2 logs cepcomunicacion-prod --lines 50 --err
# Expected: No critical errors

# Monitor resource usage
pm2 monit
# Press Ctrl+C after verification
```

#### Step 7: Update Nginx (if needed)

```bash
# If blue uses different port than green
sudo nano /etc/nginx/sites-available/cepcomunicacion-prod

# Update proxy_pass to blue port
# Example: proxy_pass http://127.0.0.1:3000;  # Blue port

# Test configuration
sudo nginx -t
# Expected: syntax is ok

# Reload Nginx
sudo systemctl reload nginx
```

#### Step 8: Verify Full Rollback (3 minutes)

```bash
# Run comprehensive health checks
sudo /usr/local/bin/healthcheck-cep.sh

# Expected: All checks passed

# Manual verification
curl -I https://cepcomunicacion.com
# Expected: HTTP/2 200

curl https://cepcomunicacion.com/api/health
# Expected: {"status":"ok","database":"connected","redis":"connected"}

# Test admin login
# Open browser: https://cepcomunicacion.com/admin
# Log in with admin credentials
# Expected: Successful login

# Test data integrity
# In admin dashboard, verify:
# - Student records present
# - Lead records present
# - Course records present
# - No duplicate records

# Check error rates in logs
sudo tail -100 /var/log/nginx/cepcomunicacion_error.log
# Expected: No 5xx errors

pm2 logs cepcomunicacion-prod --lines 100 --err
# Expected: No application errors
```

#### Step 9: Document Rollback (2 minutes)

```bash
# Create rollback report
cat > /tmp/rollback_report.txt <<EOF
CEPComunicacion v2 - Rollback Report
====================================

Rollback Time: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Initiator: $USER
Environment: Production (Hostinger VPS srv943151)

Reason:
[DESCRIBE FAILURE REASON]

Actions Taken:
1. Stopped failed deployment (green environment)
2. Backed up failed state to: $FORENSICS_DIR
3. Restored database from backup: $BACKUP_FILE
4. Cleared Redis cache
5. Started blue environment
6. Verified service restoration

Current Status:
- Application: Running (blue environment)
- Database: Restored to pre-deployment state
- Redis: Cache cleared
- Nginx: Serving blue environment
- Error rate: <1%
- Response time: <1s

Data Loss:
[DESCRIBE ANY DATA LOSS - e.g., "Leads created between 12:00-12:15 UTC lost"]

Next Steps:
1. Investigate root cause
2. Fix issues in green environment
3. Test thoroughly in staging
4. Schedule new deployment

Forensics Location: $FORENSICS_DIR
EOF

# Send report to team
cat /tmp/rollback_report.txt
# Copy and send via email/Slack
```

#### Step 10: Notify Stakeholders

```bash
# Send notification to team
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "✅ FULL ROLLBACK COMPLETED - Service Restored with Database Restoration",
    "attachments": [{
      "color": "warning",
      "fields": [
        {"title": "Time", "value": "'"$(date -u +"%Y-%m-%d %H:%M:%S UTC")"'", "short": true},
        {"title": "Duration", "value": "15 minutes", "short": true},
        {"title": "Status", "value": "Service fully restored to pre-deployment state", "short": false},
        {"title": "Data Loss", "value": "Minimal - see rollback report", "short": false},
        {"title": "Forensics", "value": "'"$FORENSICS_DIR"'", "short": false}
      ]
    }]
  }'
```

### Full Rollback Checklist

- [ ] Forensics backup created
- [ ] Failed deployment stopped
- [ ] Database restored from backup
- [ ] Redis cache cleared
- [ ] Blue environment started
- [ ] Nginx updated (if needed)
- [ ] Health checks passed
- [ ] Admin dashboard accessible
- [ ] Data integrity verified
- [ ] Error rate < 1%
- [ ] Response time < 1 second
- [ ] Rollback report created
- [ ] Team notified

**Total Time:** < 15 minutes

---

## Database Rollback

Use this procedure for **database-only rollback** when application code is fine but database changes caused issues.

### When to Use

- Migration failed mid-execution
- Data corruption detected
- Schema changes broke application
- Performance degraded after database changes

### Procedure

#### Step 1: Identify Database Issue

```bash
# Check database logs
sudo -u postgres tail -100 /var/log/postgresql/postgresql-16-main.log

# Check active connections
sudo -u postgres psql -c "
SELECT pid, usename, application_name, state, query
FROM pg_stat_activity
WHERE datname = 'cepcomunicacion'
ORDER BY state, query_start DESC;"

# Check database size
sudo -u postgres psql -d cepcomunicacion -c "
SELECT
  pg_size_pretty(pg_database_size('cepcomunicacion')) AS database_size,
  pg_size_pretty(pg_total_relation_size('users')) AS users_table_size,
  pg_size_pretty(pg_total_relation_size('students')) AS students_table_size,
  pg_size_pretty(pg_total_relation_size('leads')) AS leads_table_size;"
```

#### Step 2: Create Emergency Backup

```bash
# Create backup of current state (even if corrupted)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
sudo -u postgres pg_dump cepcomunicacion > /tmp/emergency_backup_$TIMESTAMP.sql

# Compress backup
gzip /tmp/emergency_backup_$TIMESTAMP.sql

# Verify backup created
ls -lh /tmp/emergency_backup_$TIMESTAMP.sql.gz
```

#### Step 3: Stop Application

```bash
# Stop PM2 to prevent database writes
pm2 stop cepcomunicacion-prod

# Verify no active connections (except postgres)
sudo -u postgres psql -c "
SELECT COUNT(*)
FROM pg_stat_activity
WHERE datname = 'cepcomunicacion' AND usename <> 'postgres';"
# Expected: 0
```

#### Step 4: Restore Database

```bash
# Identify correct backup
ls -lth /var/backups/postgresql/ | head -10

# Set backup file
BACKUP_FILE=/var/backups/postgresql/cepcomunicacion_20251031_020000.sql.gz

# Terminate remaining connections
sudo -u postgres psql -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'cepcomunicacion' AND pid <> pg_backend_pid();"

# Drop database
sudo -u postgres psql -c "DROP DATABASE cepcomunicacion;"

# Recreate database
sudo -u postgres psql << EOF
CREATE DATABASE cepcomunicacion
  WITH
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_ES.UTF-8'
  LC_CTYPE = 'es_ES.UTF-8'
  TEMPLATE = template0;
GRANT ALL PRIVILEGES ON DATABASE cepcomunicacion TO cepcomunicacion_user;
EOF

# Restore from backup
gunzip -c $BACKUP_FILE | sudo -u postgres psql cepcomunicacion

# Verify restoration
sudo -u postgres psql cepcomunicacion -c "
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;"

# Verify record counts
sudo -u postgres psql cepcomunicacion -c "
SELECT
  'users' AS table_name,
  COUNT(*) AS record_count
FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'campaigns', COUNT(*) FROM campaigns
ORDER BY table_name;"
```

#### Step 5: Vacuum and Analyze

```bash
# Optimize database after restoration
sudo -u postgres psql cepcomunicacion -c "VACUUM ANALYZE;"

# Update statistics
sudo -u postgres psql cepcomunicacion -c "ANALYZE;"

# Verify indexes
sudo -u postgres psql cepcomunicacion -c "
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;"
```

#### Step 6: Restart Application

```bash
# Clear Redis cache (to prevent stale data)
redis-cli -a $REDIS_PASSWORD FLUSHALL

# Start application
pm2 restart cepcomunicacion-prod

# Wait for initialization
sleep 20

# Check logs
pm2 logs cepcomunicacion-prod --lines 50
```

#### Step 7: Verify Database Rollback

```bash
# Test database connection
psql -U cepcomunicacion_user -d cepcomunicacion -h localhost -c "SELECT version();"

# Test application database queries
curl https://cepcomunicacion.com/api/health
# Expected: {"status":"ok","database":"connected"}

# Test data retrieval
curl https://cepcomunicacion.com/api/students?limit=1
# Expected: JSON response with student data

# Check admin dashboard
# Open: https://cepcomunicacion.com/admin
# Verify: All collections accessible
```

### Database Rollback Checklist

- [ ] Database issue identified
- [ ] Emergency backup created
- [ ] Application stopped
- [ ] Database connections terminated
- [ ] Database dropped and recreated
- [ ] Backup restored successfully
- [ ] Database vacuumed and analyzed
- [ ] Redis cache cleared
- [ ] Application restarted
- [ ] Database connectivity verified
- [ ] Data integrity checked

---

## Partial Rollback Scenarios

### Scenario 1: Rollback Only Nginx Configuration

If only Nginx configuration is causing issues:

```bash
# Restore previous Nginx configuration
sudo cp /etc/nginx/sites-available/cepcomunicacion-prod.backup /etc/nginx/sites-available/cepcomunicacion-prod

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Verify
curl -I https://cepcomunicacion.com
```

### Scenario 2: Rollback Only Environment Variables

If wrong environment variables were deployed:

```bash
# Navigate to app directory
cd /var/www/cepcomunicacion/apps/web-next

# Restore previous .env
sudo cp .env.production.backup .env.production

# Restart application
pm2 restart cepcomunicacion-prod

# Verify
pm2 logs cepcomunicacion-prod --lines 20
```

### Scenario 3: Rollback Only Static Assets

If only static assets are broken:

```bash
# Navigate to app directory
cd /var/www/cepcomunicacion/apps/web-next

# Restore previous build
rm -rf .next/
cp -r .next.backup/ .next/

# Restart application (PM2 will reload)
pm2 restart cepcomunicacion-prod

# Clear CDN cache if applicable
# curl -X POST https://cdn.example.com/purge-all
```

### Scenario 4: Rollback Only Dependencies

If new dependencies are causing issues:

```bash
# Navigate to app directory
cd /var/www/cepcomunicacion

# Restore previous package-lock.json
git checkout HEAD~1 -- pnpm-lock.yaml

# Reinstall dependencies
pnpm install --frozen-lockfile

# Rebuild
cd apps/web-next
pnpm build

# Restart
pm2 restart cepcomunicacion-prod
```

---

## Post-Rollback Verification

### Automated Verification

```bash
# Run comprehensive health check
sudo /usr/local/bin/healthcheck-cep.sh

# Expected: All checks passed (100%)

# Check error rates
sudo tail -1000 /var/log/nginx/cepcomunicacion_access.log | \
  awk '{print $9}' | sort | uniq -c | sort -rn

# Expected: Mostly 200 responses, < 1% errors

# Check response times
sudo tail -1000 /var/log/nginx/cepcomunicacion_access.log | \
  awk '{print $(NF-1)}' | \
  awk -F'=' '{sum+=$2; count++} END {print "Avg response time:", sum/count "s"}'

# Expected: < 1 second average
```

### Manual Verification

1. **Homepage Test**
   - Open: https://cepcomunicacion.com
   - Verify: Page loads without errors
   - Check: All images and assets load

2. **Admin Dashboard Test**
   - Open: https://cepcomunicacion.com/admin
   - Log in with credentials
   - Verify: All collections accessible
   - Test: Create a test record
   - Test: Edit a test record
   - Test: Delete test record

3. **API Endpoints Test**
   ```bash
   # Health check
   curl https://cepcomunicacion.com/api/health
   # Expected: 200 OK

   # Students API
   curl https://cepcomunicacion.com/api/students?limit=5
   # Expected: JSON array with students

   # Courses API
   curl https://cepcomunicacion.com/api/courses?limit=5
   # Expected: JSON array with courses
   ```

4. **Form Submission Test**
   - Open: https://cepcomunicacion.com/contacto
   - Fill in lead form
   - Submit
   - Verify: Success message
   - Check: Lead appears in admin dashboard

5. **GDPR Export Test**
   ```bash
   curl -X POST https://cepcomunicacion.com/api/gdpr/export \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   # Expected: 200 OK with export data or "no data found"
   ```

### Performance Verification

```bash
# Load test with Apache Bench
ab -n 100 -c 10 https://cepcomunicacion.com/

# Expected:
# - Time per request: < 500ms (mean)
# - Failed requests: 0
# - Requests per second: > 20

# Monitor resource usage
htop
# Expected: CPU < 80%, Memory < 3GB

# Monitor PM2
pm2 monit
# Expected: App stable, no restarts
```

### Data Integrity Verification

```bash
# Check database record counts
sudo -u postgres psql cepcomunicacion -c "
SELECT
  'users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs
ORDER BY table_name;"

# Compare with expected counts (from pre-deployment)
# Verify no unexpected changes
```

---

## Incident Report Template

After successful rollback, complete this incident report:

```markdown
# Production Incident Report - Rollback

## Incident Details

**Date:** YYYY-MM-DD
**Time:** HH:MM:SS UTC
**Duration:** XX minutes
**Severity:** Critical / High / Medium
**Impact:** Complete outage / Partial outage / Degraded performance

## Timeline

| Time (UTC) | Event |
|------------|-------|
| HH:MM | Deployment started |
| HH:MM | Issue detected: [DESCRIBE] |
| HH:MM | Rollback decision made |
| HH:MM | Rollback initiated |
| HH:MM | Service restored |
| HH:MM | Verification completed |

## Root Cause

[Detailed explanation of what caused the failure]

**Technical details:**
- Component: [e.g., Database migration, Nginx config, Application code]
- Error messages: [Paste relevant error logs]
- Reproduction steps: [How to reproduce the issue]

## Impact Assessment

**Users affected:** XXX users / All users / Specific feature users
**Requests failed:** XXX requests (error rate: XX%)
**Data loss:** Yes/No - [Describe any data loss]
**Financial impact:** $XXX (if applicable)

## Actions Taken

1. [First action]
2. [Second action]
3. [etc.]

## Rollback Details

**Rollback type:** Immediate / Full / Partial (Database only)
**Rollback duration:** XX minutes
**Database restored:** Yes/No
**Data loss:** [Describe any data lost during rollback]

## Verification Results

- [ ] All health checks passing
- [ ] Error rate < 1%
- [ ] Response time < 1s
- [ ] Admin dashboard functional
- [ ] API endpoints responding
- [ ] Database queries successful
- [ ] No data corruption detected

## Forensics

**Logs location:** /var/forensics/YYYYMMDD_HHMMSS/
**Database backup:** /var/backups/postgresql/cepcomunicacion_YYYYMMDD_HHMMSS.sql.gz
**Code snapshot:** /var/forensics/YYYYMMDD_HHMMSS/green_code.tar.gz

## Lessons Learned

**What went well:**
- [Things that worked as expected]

**What went wrong:**
- [Things that didn't work as expected]

**What could be improved:**
- [Process improvements]
- [Technical improvements]
- [Monitoring improvements]

## Action Items

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Fix root cause in green environment | [NAME] | YYYY-MM-DD | Pending |
| Add integration test for [FEATURE] | [NAME] | YYYY-MM-DD | Pending |
| Improve monitoring for [METRIC] | [NAME] | YYYY-MM-DD | Pending |
| Update deployment checklist | [NAME] | YYYY-MM-DD | Pending |
| Schedule post-mortem meeting | [NAME] | YYYY-MM-DD | Pending |

## Next Deployment

**Scheduled:** YYYY-MM-DD HH:MM UTC
**Prerequisites:**
- [ ] Root cause fixed and tested
- [ ] Integration tests added
- [ ] Staging deployment successful
- [ ] All action items completed
- [ ] Team briefed on previous failure

## Sign-off

**Report created by:** [NAME]
**Reviewed by:** [NAME]
**Approved by:** [NAME]
**Date:** YYYY-MM-DD
```

---

## Prevention Strategies

### Pre-Deployment

1. **Staging Environment Testing**
   - Always deploy to staging first
   - Run full test suite
   - Load test with production-like data
   - Keep staging environment identical to production

2. **Automated Testing**
   ```bash
   # Run comprehensive tests before deployment
   pnpm test                  # Unit tests
   pnpm test:integration     # Integration tests
   pnpm test:e2e            # End-to-end tests
   pnpm test:load           # Load tests
   ```

3. **Database Migration Testing**
   ```bash
   # Test migrations on staging database
   # 1. Restore production backup to staging
   # 2. Run migrations
   # 3. Verify data integrity
   # 4. Test rollback migrations
   ```

4. **Deployment Checklist**
   - Review PRODUCTION_CHECKLIST.md
   - Verify all prerequisites
   - Schedule deployment during low-traffic period
   - Have rollback plan ready

### During Deployment

1. **Incremental Rollout**
   - Deploy to canary server first (if available)
   - Monitor for 15 minutes
   - Gradually increase traffic
   - Full rollout only if canary succeeds

2. **Real-time Monitoring**
   ```bash
   # Monitor error rates
   watch -n 5 'curl -s https://cepcomunicacion.com/api/health | jq'

   # Monitor PM2
   pm2 monit

   # Monitor Nginx access logs
   sudo tail -f /var/log/nginx/cepcomunicacion_access.log
   ```

3. **Smoke Testing**
   - Test critical paths immediately after deployment
   - Automated smoke test suite
   - Manual verification of key features

### Post-Deployment

1. **Extended Monitoring**
   - Monitor for 1 hour after deployment
   - Check error rates every 5 minutes
   - Review logs for warnings

2. **Performance Baseline**
   ```bash
   # Establish new performance baseline
   ab -n 1000 -c 10 https://cepcomunicacion.com/

   # Compare with previous baseline
   # Alert if degradation > 20%
   ```

3. **Keep Blue Environment**
   - Don't delete blue environment for 24 hours
   - Keep blue database backup for 7 days
   - Document what changed between blue and green

---

## Summary

### Rollback Types

| Type | Duration | Use Case | Data Loss |
|------|----------|----------|-----------|
| **Immediate** | < 5 min | Critical outage | None (blue state) |
| **Full** | < 15 min | Major issues + DB problems | Minimal (since last backup) |
| **Database Only** | < 10 min | DB corruption | Data since last backup |
| **Partial** | < 5 min | Specific component failure | None |

### Key Principles

1. **Speed over perfection:** Restore service first, investigate later
2. **Preserve forensics:** Always backup failed state before rollback
3. **Verify thoroughly:** Don't assume rollback succeeded - test everything
4. **Document everything:** Incident reports help prevent future failures
5. **Learn and improve:** Every rollback is a learning opportunity

### Emergency Commands Quick Reference

```bash
# Immediate rollback (one-liner)
pm2 stop cepcomunicacion-prod && cd /var/www/cepcomunicacion-blue && pm2 start ecosystem.config.js

# Check service status
curl https://cepcomunicacion.com/api/health && pm2 status

# View recent errors
pm2 logs cepcomunicacion-prod --err --lines 50

# Database backup
sudo -u postgres pg_dump cepcomunicacion > /tmp/backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
gunzip -c /var/backups/postgresql/latest.sql.gz | sudo -u postgres psql cepcomunicacion
```

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-31
**Maintained by:** SOLARIA AGENCY
**Review Frequency:** After each rollback or quarterly
