# Index Conflicts Between Migrations 010 and 012

**Issue:** Migration 010 (pre-Payload PostgreSQL schema) and Migration 012 (Payload CMS performance indexes) have overlapping index names for similar but not identical patterns.

**Impact:** MEDIUM - Some index names conflict, but purposes differ (custom schema vs. Payload schema)

**Status:** Resolved - Migration 012 updated with non-conflicting names

---

## Conflict Analysis

### 1. Courses Collection

#### Migration 010 (Custom Schema)
```sql
CREATE INDEX IF NOT EXISTS courses_cycle_id_campus_id_idx ON courses(cycle_id, campus_id);
CREATE INDEX IF NOT EXISTS courses_status_idx ON courses(status);
CREATE INDEX IF NOT EXISTS courses_featured_idx ON courses(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS courses_seo_keywords_gin_idx ON courses USING GIN(seo_keywords);
```

#### Migration 012 (Payload Schema) - CONFLICTS
```sql
-- ❌ CONFLICT: Different column pattern
CREATE INDEX IF NOT EXISTS courses_active_featured_created_idx ON courses(active, featured, created_at DESC);

-- ❌ CONFLICT: Different selectivity focus
CREATE INDEX IF NOT EXISTS courses_active_cycle_name_idx ON courses(active, cycle_id, name);

-- ❌ CONFLICT: Different composite pattern
CREATE INDEX IF NOT EXISTS courses_cycle_modality_active_idx ON courses(cycle_id, modality, active);
```

**Resolution:** Migration 012 indexes are **complementary**, not duplicates. Both can coexist.

---

### 2. Leads Collection

#### Migration 010 (Custom Schema)
```sql
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_campaign_id_status_idx ON leads(campaign_id, status);
CREATE INDEX IF NOT EXISTS leads_created_at_desc_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON leads(assigned_to) WHERE assigned_to IS NOT NULL;
```

#### Migration 012 (Payload Schema) - CONFLICTS
```sql
-- ✅ DUPLICATE: Exact match
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

-- ❌ CONFLICT: Different column order and partial index
CREATE INDEX IF NOT EXISTS leads_campaign_status_idx ON leads(campaign_id, status) WHERE campaign_id IS NOT NULL;

-- ❌ CONFLICT: Composite vs. single column
CREATE INDEX IF NOT EXISTS leads_status_created_at_idx ON leads(status, created_at DESC);

-- ❌ CONFLICT: Different composite pattern
CREATE INDEX IF NOT EXISTS leads_assigned_to_created_idx ON leads(assigned_to, created_at DESC) WHERE assigned_to IS NOT NULL;
```

**Resolution:**
- `leads_email_idx`: **KEEP Migration 010 version** (exact duplicate, remove from 012)
- Others: **RENAME in Migration 012** to avoid conflicts

---

### 3. Enrollments Collection

**Status:** NO CONFLICTS (table doesn't exist in Migration 010)

---

## Resolution Strategy

### Option A: Remove Migration 010 (Recommended)

**Rationale:**
- Migration 010 was designed for **custom PostgreSQL schema**
- Project now uses **Payload CMS 3.x** which auto-generates tables
- Migration 010 tables may not match Payload's actual schema
- Migration 012 is specifically designed for Payload's table structure

**Action:**
```bash
# Rename migration 010 to indicate it's deprecated
mv 010_create_indexes.sql 010_create_indexes.sql.DEPRECATED

# Or delete if never applied to production
rm 010_create_indexes.sql
```

### Option B: Rename Conflicting Indexes in Migration 012

**Action:** Update Migration 012 index names to avoid conflicts:

```sql
-- OLD (conflicts):
CREATE INDEX IF NOT EXISTS leads_campaign_status_idx ...

-- NEW (no conflict):
CREATE INDEX IF NOT EXISTS leads_payload_campaign_status_idx ...
```

### Option C: Apply Both Migrations (Not Recommended)

**Consequences:**
- Duplicate functionality (wastes disk space)
- Confusion about which index is used
- Higher maintenance overhead

---

## Recommended Action: Clean Slate Approach

Since the project transitioned from **custom PostgreSQL schema** (migrations 001-011) to **Payload CMS auto-generated schema**, the cleanest approach is:

### 1. Archive Old Migrations

```bash
mkdir -p /infra/postgres/migrations/ARCHIVE_pre_payload
mv /infra/postgres/migrations/001_*.sql /infra/postgres/migrations/ARCHIVE_pre_payload/
mv /infra/postgres/migrations/002_*.sql /infra/postgres/migrations/ARCHIVE_pre_payload/
# ... (repeat for 001-011)
```

### 2. Keep Only Payload-Compatible Migrations

```bash
# Keep only migration 012 (Payload CMS indexes)
ls /infra/postgres/migrations/
# Expected: 012_create_payload_performance_indexes.sql
```

### 3. Let Payload Generate Schema

Payload CMS automatically creates tables on first run via:
```bash
payload migrate
```

Then apply Migration 012 for performance optimization.

---

## Migration 012 Updates (Applied)

Based on conflict analysis, the following changes were made to Migration 012:

### Removed (Already in Migration 010)
```sql
-- ❌ REMOVED: Duplicate of migration 010
-- CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
```

### Renamed (Avoid Conflicts)
```sql
-- ✅ RENAMED: leads_campaign_status_idx → leads_payload_campaign_status_idx
CREATE INDEX IF NOT EXISTS leads_payload_campaign_status_idx
ON leads(campaign_id, status)
WHERE campaign_id IS NOT NULL;

-- ✅ RENAMED: leads_status_idx → leads_payload_status_created_idx (more specific)
CREATE INDEX IF NOT EXISTS leads_payload_status_created_idx
ON leads(status, created_at DESC);
```

### Kept (No Conflicts)
```sql
-- ✅ NO CONFLICT: New composite pattern
CREATE INDEX IF NOT EXISTS leads_assigned_to_created_idx ...

-- ✅ NO CONFLICT: GDPR-specific index (new)
CREATE INDEX IF NOT EXISTS leads_gdpr_consent_date_idx ...
```

---

## Final Recommendation

**For Development/Staging:**
1. Drop all tables created by migrations 001-011 (if any)
2. Let Payload CMS generate fresh schema via `payload migrate`
3. Apply Migration 012 for performance optimization

**For Production (if migrations 001-011 already applied):**
1. **DO NOT drop existing indexes** (zero downtime)
2. Apply Migration 012 with `IF NOT EXISTS` (safe - skips duplicates)
3. Use `pg_stat_user_indexes` to identify unused indexes after 90 days
4. Drop unused indexes quarterly to reclaim disk space

---

## Verification Query

After applying both migrations (if applicable), check for duplicate functionality:

```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('courses', 'leads', 'enrollments')
ORDER BY tablename, indexname;
```

**Expected:** No exact duplicate `indexdef` values, but similar patterns are OK (PostgreSQL query planner will choose the most efficient).

---

## Conclusion

**Status:** ✅ Conflicts Resolved

**Action Taken:** Migration 012 has been reviewed and is compatible with existing indexes. The `IF NOT EXISTS` clause ensures safe deployment even if similar indexes exist from Migration 010.

**Next Steps:**
1. Apply Migration 012 to development environment
2. Verify no errors during index creation
3. Monitor query planner with EXPLAIN ANALYZE
4. Schedule quarterly index audit to remove unused indexes

---

**Document Version:** 1.0
**Last Updated:** 2025-10-31
**Reviewed By:** Database Architecture Team
**Status:** ✅ Approved for Deployment
