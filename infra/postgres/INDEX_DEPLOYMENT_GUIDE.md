# Index Deployment Guide - Migration 012

**Target:** PostgreSQL 16+ with Payload CMS 3.61.1
**Migration File:** `012_create_payload_performance_indexes.sql`
**Estimated Duration:** 5-30 minutes (depends on table sizes)

---

## Pre-Deployment Checklist

### 1. Verify Database Connection

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d cepcomunicacion -c "SELECT version();"

# Expected Output:
# PostgreSQL 16.x on x86_64-pc-linux-gnu
```

### 2. Check Current Index Status

```sql
-- List existing indexes on target tables
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE tablename IN (
    'courses', 'leads', 'enrollments', 'students',
    'campaigns', 'ads_templates', 'blog_posts', 'faqs',
    'course_runs', 'media', 'users', 'cycles', 'campuses'
)
ORDER BY tablename, indexname;
```

**Action:** Document existing indexes to avoid duplicates.

### 3. Check Disk Space

```sql
-- Check database size and available space
SELECT
    pg_database.datname AS database_name,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS database_size
FROM pg_database
WHERE datname = 'cepcomunicacion';

-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;
```

**Requirement:** Ensure **20% free disk space** for index creation.

### 4. Create Database Backup

```bash
# Full database backup (recommended)
pg_dump -h localhost -U postgres -d cepcomunicacion -F c -b -v -f "/backup/cepcomunicacion_$(date +%Y%m%d_%H%M%S).dump"

# Schema-only backup (faster, for quick rollback)
pg_dump -h localhost -U postgres -d cepcomunicacion --schema-only -f "/backup/cepcomunicacion_schema_$(date +%Y%m%d_%H%M%S).sql"
```

**Verify Backup:**
```bash
# Check backup file exists and has reasonable size
ls -lh /backup/cepcomunicacion_*.dump
```

---

## Deployment Options

### Option A: Standard Deployment (Requires Downtime)

**Use Case:** Development/staging environments, or production during maintenance window.

**Pros:**
- Faster index creation (no locks)
- Simpler rollback

**Cons:**
- Requires application downtime (5-30 minutes)
- Locks tables during index creation

**Command:**
```bash
# Apply migration
psql -h localhost -U postgres -d cepcomunicacion -f /path/to/012_create_payload_performance_indexes.sql

# Update table statistics
psql -h localhost -U postgres -d cepcomunicacion -c "ANALYZE;"
```

### Option B: Zero-Downtime Deployment (Production)

**Use Case:** Production environments with 24/7 uptime requirements.

**Pros:**
- No application downtime
- Concurrent index creation

**Cons:**
- Slower index creation (2-3x longer)
- Higher CPU/memory usage during creation

**Modified Migration:**
Replace all `CREATE INDEX IF NOT EXISTS` with `CREATE INDEX CONCURRENTLY IF NOT EXISTS`.

**Example:**
```sql
-- Original (locks table):
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

-- Zero-downtime version:
CREATE INDEX CONCURRENTLY IF NOT EXISTS leads_email_idx ON leads(email);
```

**Note:** `CONCURRENTLY` cannot be used inside a transaction block. Apply indexes one at a time:

```bash
# Create modified migration file
cat > 012_create_payload_performance_indexes_concurrent.sql <<'EOF'
-- Section 1: Courses
CREATE INDEX CONCURRENTLY IF NOT EXISTS courses_active_featured_created_idx
ON courses(active, featured, created_at DESC)
WHERE active = true AND featured = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS courses_active_cycle_name_idx
ON courses(active, cycle_id, name)
WHERE active = true;

-- ... (repeat for all indexes)
EOF

# Apply with monitoring
psql -h localhost -U postgres -d cepcomunicacion -f 012_create_payload_performance_indexes_concurrent.sql
```

---

## Deployment Execution

### Step 1: Set Maintenance Mode (Optional)

If using Option A (with downtime):

```bash
# Stop Payload CMS application
pm2 stop payload-cms

# Verify no active connections
psql -h localhost -U postgres -d cepcomunicacion -c "
SELECT pid, usename, application_name, state, query_start
FROM pg_stat_activity
WHERE datname = 'cepcomunicacion' AND pid <> pg_backend_pid();
"
```

### Step 2: Apply Migration

```bash
# Apply migration
psql -h localhost -U postgres -d cepcomunicacion -f /Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/infra/postgres/migrations/012_create_payload_performance_indexes.sql

# Check for errors
echo $?
# Expected: 0 (success)
```

**Monitor Progress (in separate terminal):**
```sql
-- Watch index creation progress
SELECT
    a.query,
    now() - a.query_start AS duration,
    a.state
FROM pg_stat_activity a
WHERE a.datname = 'cepcomunicacion'
  AND a.query LIKE '%CREATE INDEX%'
ORDER BY a.query_start;
```

### Step 3: Update Statistics

```bash
# Update table statistics for query planner
psql -h localhost -U postgres -d cepcomunicacion -c "ANALYZE;"
```

### Step 4: Verify Index Creation

```sql
-- Check all indexes were created
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'courses_active_featured_created_idx',
    'courses_active_cycle_name_idx',
    'courses_cycle_modality_active_idx',
    'leads_status_created_at_idx',
    'leads_email_idx',
    'leads_campaign_status_idx',
    'leads_assigned_to_created_idx',
    'leads_gdpr_consent_date_idx',
    'enrollments_student_enrolled_at_idx',
    'enrollments_course_run_status_idx',
    'enrollments_payment_status_idx',
    'enrollments_student_active_status_idx',
    'students_email_idx',
    'students_dni_idx',
    'students_active_created_idx',
    'campaigns_status_dates_idx',
    'campaigns_start_date_idx',
    'ads_templates_campaign_created_idx',
    'ads_templates_status_platform_idx',
    'blog_posts_status_published_at_idx',
    'blog_posts_author_published_idx',
    'faqs_category_order_idx',
    'course_runs_course_start_date_idx',
    'course_runs_campus_status_idx',
    'course_runs_start_date_idx',
    'media_filename_idx',
    'media_mime_type_idx',
    'users_role_idx',
    'users_reset_password_token_idx',
    'cycles_order_display_idx',
    'campuses_city_idx'
)
ORDER BY tablename, indexname;

-- Expected: 31 rows (all indexes present)
```

### Step 5: Test Critical Queries

```sql
-- Test 1: Featured courses (homepage)
EXPLAIN ANALYZE
SELECT id, slug, name, price, modality
FROM courses
WHERE active = true AND featured = true
ORDER BY created_at DESC
LIMIT 10;
-- Expected: Index Scan using courses_active_featured_created_idx

-- Test 2: Lead deduplication
EXPLAIN ANALYZE
SELECT id, email FROM leads WHERE email = 'test@example.com';
-- Expected: Index Scan using leads_email_idx

-- Test 3: Enrollment capacity check
EXPLAIN ANALYZE
SELECT COUNT(*) FROM enrollments
WHERE course_run_id = 1 AND status IN ('confirmed', 'pending');
-- Expected: Index Scan using enrollments_course_run_status_idx
```

### Step 6: Restart Application

```bash
# Restart Payload CMS
pm2 restart payload-cms

# Check logs for errors
pm2 logs payload-cms --lines 50
```

---

## Post-Deployment Validation

### 1. Monitor Query Performance

```sql
-- Check slow queries log
SELECT
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
WHERE query LIKE '%leads%' OR query LIKE '%enrollments%' OR query LIKE '%courses%'
ORDER BY mean_exec_time DESC
LIMIT 20;
```

**Note:** Requires `pg_stat_statements` extension. Enable with:
```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### 2. Verify Index Usage

```sql
-- Check indexes are being used (wait 24 hours for stats)
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS scans,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
WHERE indexname LIKE '%_idx' OR indexname LIKE '%created_idx'
ORDER BY idx_scan DESC;
```

**Expected:** Indexes with `idx_scan > 0` after 24 hours.

### 3. Monitor API Response Times

Use application monitoring tools:

```bash
# Example: Check Payload CMS API logs
pm2 logs payload-cms | grep "GET /api/courses"

# Example response time improvements:
# Before: GET /api/courses?filter[active]=true - 458ms
# After:  GET /api/courses?filter[active]=true - 52ms
```

### 4. Check Index Bloat (After 30 Days)

```sql
-- Check index sizes after 30 days
SELECT
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 20;
```

---

## Rollback Procedure

### If Migration Fails Mid-Way

```bash
# Restore from backup
pg_restore -h localhost -U postgres -d cepcomunicacion -c /backup/cepcomunicacion_YYYYMMDD_HHMMSS.dump

# Verify restoration
psql -h localhost -U postgres -d cepcomunicacion -c "SELECT COUNT(*) FROM leads;"
```

### If Indexes Cause Performance Issues

```sql
-- Drop specific index
DROP INDEX IF EXISTS leads_email_idx;

-- Drop all indexes from migration 012 (nuclear option)
-- See rollback section in 012_create_payload_performance_indexes.sql
```

---

## Troubleshooting

### Issue 1: "Index already exists" Error

**Cause:** Index was partially created in previous run.

**Solution:**
```sql
-- Check if index exists
SELECT indexname FROM pg_indexes WHERE indexname = 'leads_email_idx';

-- If exists, skip or drop and recreate
DROP INDEX IF EXISTS leads_email_idx;
CREATE INDEX leads_email_idx ON leads(email);
```

### Issue 2: Out of Disk Space During Index Creation

**Symptoms:**
```
ERROR: could not extend file "base/16384/16389": No space left on device
```

**Solution:**
```bash
# Check disk space
df -h

# Free up space
sudo apt clean
docker system prune -a

# Retry migration with fewer indexes at a time
```

### Issue 3: Slow Index Creation (>30 minutes)

**Cause:** Table has millions of rows or concurrent queries are blocking.

**Solution:**
```sql
-- Check table size
SELECT pg_size_pretty(pg_total_relation_size('leads'));

-- If > 10GB, use CONCURRENTLY (even if slower)
CREATE INDEX CONCURRENTLY leads_email_idx ON leads(email);

-- Increase maintenance_work_mem for faster index builds
SET maintenance_work_mem = '2GB';
```

### Issue 4: Query Still Using Sequential Scan After Index Creation

**Cause:** Query planner statistics are outdated.

**Solution:**
```sql
-- Update table statistics
ANALYZE leads;

-- Force query planner to use index (testing only)
SET enable_seqscan = OFF;
EXPLAIN ANALYZE SELECT * FROM leads WHERE email = 'test@example.com';
SET enable_seqscan = ON;
```

---

## Maintenance Schedule

### Daily (Automated)

- **Autovacuum:** PostgreSQL automatically reclaims dead tuples
- **Monitor slow queries:** Set up alerts for queries > 500ms

### Weekly

```sql
-- Check index usage statistics
SELECT tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;
```

### Monthly

```sql
-- Reindex tables with high bloat (if autovacuum insufficient)
REINDEX TABLE CONCURRENTLY leads;
REINDEX TABLE CONCURRENTLY enrollments;

-- Analyze all tables
ANALYZE;
```

### Quarterly

- **Review unused indexes:** Drop indexes with `idx_scan = 0` after 90 days
- **Audit index sizes:** Identify oversized indexes (> 1GB) for optimization
- **Test query performance:** Re-run EXPLAIN ANALYZE tests from PERFORMANCE_ANALYSIS.md

---

## Success Criteria

Migration is considered successful if:

- [ ] All 31 indexes created without errors
- [ ] Featured courses query < 10ms (was ~68ms)
- [ ] Lead email lookup < 1ms (was ~125ms)
- [ ] Enrollment capacity check < 5ms (was ~185ms)
- [ ] No increase in error rates after deployment
- [ ] API p95 response time reduced by > 50%
- [ ] No database disk space issues after 7 days

---

## Support Contacts

**Database Team:**
- Slack: #database-support
- Email: db-team@cepcomunicacion.com

**On-Call DBA:**
- PagerDuty: 24/7 emergency escalation

**Documentation:**
- Full analysis: `/infra/postgres/PERFORMANCE_ANALYSIS.md`
- Migration file: `/infra/postgres/migrations/012_create_payload_performance_indexes.sql`

---

**Last Updated:** 2025-10-31
**Version:** 1.0
**Owner:** Database Architecture Team
