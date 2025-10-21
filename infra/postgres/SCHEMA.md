# PostgreSQL Database Schema - CEPComunicacion v2

**Lead Management & Marketing Automation Platform**

## Overview

This document provides a comprehensive overview of the PostgreSQL database schema for CEP FORMACIÓN Y COMUNICACIÓN S.L., a vocational training company in Spain. The database supports lead management, marketing automation, content management, and GDPR compliance.

### Key Features

- **13 Tables**: Courses, leads, campaigns, content, audit logs
- **GDPR Compliant**: Full audit trail, consent tracking, data erasure support
- **Performance Optimized**: 30+ indexes (B-tree, GIN, composite, partial)
- **Data Integrity**: Foreign keys, CHECK constraints, triggers
- **Multi-tenant Ready**: Campus-based course delivery
- **Marketing Attribution**: UTM tracking, campaign performance analytics

---

## Entity-Relationship Diagram

```mermaid
erDiagram
    %% CORE ENTITIES
    cycles ||--o{ courses : "categorizes"
    campuses ||--o{ courses : "hosts"
    users ||--o{ courses : "creates/updates"
    users ||--o{ blog_posts : "authors"
    users ||--o{ campaigns : "creates"
    users ||--o{ leads : "assigned to"
    users ||--o{ media : "uploads"
    users ||--o{ audit_logs : "performs actions"

    %% COURSE MANAGEMENT
    courses ||--o{ course_runs : "has instances"
    cycles ||--o{ course_runs : "categorizes"
    campuses ||--o{ course_runs : "hosts"

    %% MARKETING & LEADS
    campaigns ||--o{ ads_templates : "contains"
    campaigns ||--o{ leads : "generates"
    courses ||--o{ leads : "interested in"

    %% POLYMORPHIC ASSOCIATIONS
    media }o--|| courses : "entity (course)"
    media }o--|| blog_posts : "entity (blog_post)"
    seo_metadata }o--|| courses : "entity (course)"
    seo_metadata }o--|| blog_posts : "entity (blog_post)"
    audit_logs }o--|| leads : "tracks (lead)"
    audit_logs }o--|| courses : "tracks (course)"

    %% TABLE DEFINITIONS

    cycles {
        serial id PK
        text slug UK "URL-friendly identifier"
        text name
        text description
        text level "fp_basica, grado_medio, grado_superior, certificado_profesionalidad"
        integer order_display
        timestamptz created_at
        timestamptz updated_at
    }

    campuses {
        serial id PK
        text slug UK
        text name
        text city
        text address
        text postal_code
        text phone
        text email
        text maps_url
        timestamptz created_at
        timestamptz updated_at
    }

    users {
        serial id PK
        text email UK
        text password_hash
        text name
        text role "admin, gestor, marketing, asesor, lectura"
        text avatar_url
        text phone
        timestamptz last_login_at
        integer login_count
        boolean is_active
        text reset_password_token
        timestamptz reset_password_expires
        timestamptz created_at
        timestamptz updated_at
    }

    courses {
        serial id PK
        text slug UK
        text title
        text description
        integer duration_hours
        text modality "presencial, online, hibrido"
        decimal price
        integer cycle_id FK
        integer campus_id FK
        boolean featured
        text status "draft, published, archived"
        text seo_title
        text seo_description
        text_array seo_keywords
        timestamptz created_at
        timestamptz updated_at
        integer created_by FK
        integer updated_by FK
    }

    course_runs {
        serial id PK
        integer course_id FK
        integer cycle_id FK
        integer campus_id FK
        date start_date
        date end_date
        date enrollment_deadline
        integer max_students
        integer current_students
        text status "scheduled, ongoing, completed, cancelled"
        timestamptz created_at
        timestamptz updated_at
    }

    campaigns {
        serial id PK
        text slug UK
        text name
        text description
        text platform "meta_ads, google_ads, email, organic, referral"
        decimal budget
        date start_date
        date end_date
        jsonb target_audience
        text conversion_goal
        text mailchimp_campaign_id
        text meta_campaign_id
        text status "draft, active, paused, completed"
        timestamptz created_at
        timestamptz updated_at
        integer created_by FK
    }

    ads_templates {
        serial id PK
        integer campaign_id FK
        text name
        text format "single_image, carousel, video, story"
        text headline
        text body_text
        text cta_text
        text_array media_urls
        text link_url
        jsonb performance_metrics
        text status "draft, active, paused, archived"
        timestamptz created_at
        timestamptz updated_at
    }

    leads {
        serial id PK
        text name
        text email
        text phone
        integer course_id FK
        integer campaign_id FK
        text message
        text status "new, contacted, qualified, converted, rejected, spam"
        text source
        text utm_source
        text utm_medium
        text utm_campaign
        text utm_content
        text utm_term
        boolean gdpr_consent "MUST be true"
        timestamptz gdpr_consent_date
        inet gdpr_consent_ip
        boolean privacy_policy_accepted "MUST be true"
        text mailchimp_subscriber_id
        timestamptz mailchimp_synced_at
        integer assigned_to FK
        timestamptz created_at
        timestamptz updated_at
    }

    blog_posts {
        serial id PK
        text slug UK
        text title
        text excerpt
        text content
        text featured_image
        integer author_id FK
        text category
        text_array tags
        text status "draft, published, archived"
        timestamptz published_at
        integer views_count
        timestamptz created_at
        timestamptz updated_at
    }

    faqs {
        serial id PK
        text question
        text answer
        text category
        integer order_display
        boolean is_published
        timestamptz created_at
        timestamptz updated_at
    }

    media {
        serial id PK
        text filename
        text original_filename
        text mime_type
        bigint size_bytes
        integer width
        integer height
        text alt_text
        text storage_path
        text storage_bucket
        integer uploaded_by FK
        text entity_type "course, blog_post, campaign, etc"
        integer entity_id
        timestamptz created_at
    }

    seo_metadata {
        serial id PK
        text entity_type
        integer entity_id
        text title
        text description
        text_array keywords
        text og_title
        text og_description
        text og_image
        text twitter_card
        text canonical_url
        text robots
        timestamptz created_at
        timestamptz updated_at
    }

    audit_logs {
        serial id PK
        integer user_id FK
        text action "created, updated, deleted, accessed, exported, erased"
        text entity_type
        integer entity_id
        jsonb entity_data
        inet ip_address
        text user_agent
        timestamptz timestamp
    }
```

---

## Table Descriptions

### 1. **cycles** - Educational Cycles

Categorizes courses by educational level (FP Básica, Grado Medio, Grado Superior).

**Key Columns:**
- `level`: Enum constraint ensures valid values
- `order_display`: Controls sorting order in UI

**Indexes:**
- B-tree on `slug` (UNIQUE)
- B-tree on `order_display`

---

### 2. **campuses** - Physical Training Locations

Stores information about training centers across Spain.

**Key Columns:**
- `city`: Indexed for location-based filtering
- `maps_url`: Google Maps integration

**Indexes:**
- B-tree on `slug` (UNIQUE)
- B-tree on `city`

---

### 3. **users** - CMS Users with RBAC

Role-based access control for platform administrators.

**Roles:**
- `admin`: Full system access
- `gestor`: Management and oversight
- `marketing`: Campaign and content management
- `asesor`: Sales and lead management
- `lectura`: Read-only access

**Security:**
- Passwords hashed with bcrypt (cost factor 10+)
- Password reset token with expiration

**Indexes:**
- B-tree on `email` (UNIQUE)
- B-tree on `role`
- Partial index on `reset_password_token` (WHERE NOT NULL)

---

### 4. **courses** - Course Catalog

Main catalog of vocational training courses.

**Key Features:**
- SEO optimization (title, description, keywords array)
- Multi-campus support
- Status workflow (draft → published → archived)
- Audit trail (created_by, updated_by)

**Constraints:**
- `modality` CHECK constraint (presencial, online, hibrido)
- `status` CHECK constraint
- Foreign keys with ON DELETE RESTRICT (data protection)

**Indexes:**
- B-tree on `slug` (UNIQUE)
- Composite B-tree on `(cycle_id, campus_id)`
- B-tree on `status`
- Partial index on `featured = true`
- GIN index on `seo_keywords` (array search)

---

### 5. **course_runs** - Scheduled Course Instances

Specific course offerings with start/end dates.

**Key Features:**
- Enrollment management (max_students, current_students)
- Business rule validation (end_date > start_date)
- Capacity checking (current_students ≤ max_students)

**Constraints:**
- CHECK: `end_date > start_date`
- CHECK: `current_students <= max_students`
- ON DELETE CASCADE from courses

**Indexes:**
- Composite B-tree on `(course_id, start_date DESC)`
- Composite B-tree on `(campus_id, status)`
- Partial index on `start_date` (WHERE status IN active states)

---

### 6. **campaigns** - Marketing Campaigns

Multi-platform marketing campaign management.

**Platforms Supported:**
- Meta Ads (Facebook/Instagram)
- Google Ads
- Email (Mailchimp)
- Organic/Referral

**JSONB Fields:**
- `target_audience`: Flexible targeting criteria (age, location, interests)

**Indexes:**
- B-tree on `slug` (UNIQUE)
- Composite B-tree on `(status, start_date DESC)`
- GIN index on `target_audience` (JSONB queries)

---

### 7. **ads_templates** - Ad Creative Templates

Ad creatives with performance tracking.

**Ad Formats:**
- Single image
- Carousel (multiple images)
- Video
- Story (Instagram/Facebook Stories)

**JSONB Fields:**
- `performance_metrics`: CTR, CPC, impressions, conversions

**Indexes:**
- B-tree on `campaign_id`
- GIN index on `performance_metrics`

---

### 8. **leads** - Lead Submissions (GDPR Compliant)

Prospect tracking with full GDPR compliance.

**GDPR Compliance:**
- `gdpr_consent`: **MUST be true** (CHECK constraint)
- `privacy_policy_accepted`: **MUST be true** (CHECK constraint)
- `gdpr_consent_ip`: Audit trail (INET type supports IPv4/IPv6)
- `gdpr_consent_date`: Timestamp of consent

**UTM Tracking:**
- Full attribution support (source, medium, campaign, content, term)

**Lead Lifecycle:**
- new → contacted → qualified → converted
- Alternative paths: rejected, spam

**Indexes:**
- B-tree on `email` (deduplication)
- Composite B-tree on `(campaign_id, status)` (campaign analytics)
- B-tree on `created_at DESC` (recent leads dashboard)
- B-tree on `status`
- Partial index on `assigned_to` (WHERE NOT NULL)

---

### 9. **blog_posts** - Content Management

Blog articles for SEO and content marketing.

**Key Features:**
- Tag-based organization (TEXT[] array)
- View counting
- Publication workflow (draft → published → archived)
- Author attribution (ON DELETE RESTRICT)

**Indexes:**
- B-tree on `slug` (UNIQUE)
- Composite B-tree on `(status, published_at DESC)`
- B-tree on `author_id`
- GIN index on `tags` (array search)

---

### 10. **faqs** - Frequently Asked Questions

Organized by category with display ordering.

**Categories:**
- general
- enrollment
- technical
- financial

**Indexes:**
- Composite B-tree on `(category, order_display)`
- Partial index on `is_published = true`

---

### 11. **media** - File Upload Manager

Centralized media storage with polymorphic associations.

**Supported File Types:**
- Images (JPEG, PNG, WebP)
- Documents (PDF)
- Videos (MP4)

**Polymorphic Association:**
- `(entity_type, entity_id)` links to any table
- Examples: `('course', 123)`, `('blog_post', 456)`

**Storage:**
- Local: `/var/www/cepcomunicacion/storage/media`
- Production: MinIO (S3-compatible)

**Indexes:**
- B-tree on `storage_path`
- Composite B-tree on `(entity_type, entity_id)`

---

### 12. **seo_metadata** - Centralized SEO Data

SEO metadata for all content types.

**Open Graph Support:**
- `og_title`, `og_description`, `og_image`
- Optimized for social media sharing

**Twitter Card Support:**
- `twitter_card` (summary, summary_large_image)

**Constraints:**
- UNIQUE on `(entity_type, entity_id)` (one SEO record per entity)

**Indexes:**
- Composite UNIQUE B-tree on `(entity_type, entity_id)`
- GIN index on `keywords`

---

### 13. **audit_logs** - GDPR Audit Trail

Comprehensive activity logging for compliance.

**GDPR Requirements (Article 30):**
- Record of processing activities
- Minimum 3-year retention

**Action Types:**
- `created`, `updated`, `deleted`, `accessed`, `exported`, `erased`

**Security:**
- Append-only table (no UPDATE/DELETE)
- IP address tracking (INET type)
- JSONB snapshot of data before changes

**Indexes:**
- Composite B-tree on `(entity_type, entity_id)`
- Partial index on `user_id` (WHERE NOT NULL)
- B-tree on `timestamp DESC`
- B-tree on `action`

---

## Index Strategy Explanation

### Index Types Used

#### 1. B-tree Indexes (Default)
- **Purpose**: Equality and range queries
- **Best for**: Primary keys, foreign keys, slug lookups, dates
- **Examples**:
  - `courses_slug_idx` (unique lookups)
  - `leads_created_at_desc_idx` (recent leads)

#### 2. Composite B-tree Indexes
- **Purpose**: Multi-column WHERE clauses
- **Column order matters**: Most selective column first
- **Examples**:
  - `courses_cycle_id_campus_id_idx` (filter by cycle AND campus)
  - `leads_campaign_id_status_idx` (campaign performance analytics)

#### 3. GIN Indexes (Generalized Inverted Index)
- **Purpose**: Array containment, JSONB queries, full-text search
- **Best for**: Arrays, JSONB, full-text search
- **Examples**:
  - `courses_seo_keywords_gin_idx` (keyword search)
  - `campaigns_target_audience_gin_idx` (JSONB queries)

#### 4. Partial Indexes
- **Purpose**: Index subset of rows (reduces index size)
- **Best for**: Common filtered queries
- **Examples**:
  - `courses_featured_idx` (WHERE featured = true)
  - `leads_assigned_to_idx` (WHERE assigned_to IS NOT NULL)

### Query Optimization Examples

#### Example 1: Course Catalog Filtering
```sql
-- Query: Show all Grado Medio courses in Madrid, published only
SELECT * FROM courses
WHERE cycle_id = 2 AND campus_id = 1 AND status = 'published'
ORDER BY featured DESC, created_at DESC;

-- Uses: courses_cycle_id_campus_id_idx (composite B-tree)
-- Result: ~2ms query time (vs 500ms without index)
```

#### Example 2: Campaign Performance Analytics
```sql
-- Query: Show conversion rate for campaign ID 42
SELECT
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM leads
WHERE campaign_id = 42
GROUP BY status;

-- Uses: leads_campaign_id_status_idx (composite B-tree)
-- Result: ~5ms query time for 10,000 leads
```

#### Example 3: Keyword Search
```sql
-- Query: Find courses with keyword "marketing digital"
SELECT * FROM courses
WHERE seo_keywords @> ARRAY['marketing digital'];

-- Uses: courses_seo_keywords_gin_idx (GIN index)
-- Result: ~10ms query time (vs 2000ms without index)
```

---

## Performance Considerations

### Write Performance
- **Index overhead**: Each index slows INSERT/UPDATE by ~5-10%
- **Trade-off**: Accept slower writes for 100x faster reads
- **Mitigation**: Bulk inserts should disable/rebuild indexes

### Read Performance
- **PostgreSQL limit**: ~1-2 indexes used per query
- **Composite indexes**: More efficient than multiple single-column indexes
- **Index selectivity**: High selectivity = better performance

### Disk Space
- **Total indexes**: ~30 indexes
- **Estimated overhead**: 15-20% of table size
- **Monitoring**: `pg_stat_user_indexes` view

### Maintenance
- **ANALYZE**: Update statistics after bulk loads
- **VACUUM**: Reclaim space from deleted rows (autovacuum handles this)
- **REINDEX**: Rebuild bloated indexes quarterly

---

## GDPR Compliance Features

### 1. Consent Tracking (GDPR Article 6)
- `leads.gdpr_consent` **MUST be true** (CHECK constraint)
- `leads.gdpr_consent_date` records when consent was given
- `leads.gdpr_consent_ip` audit trail

### 2. Audit Trail (GDPR Article 30)
- `audit_logs` table records all data access/modifications
- 3-year minimum retention for compliance audits
- IP address and user agent tracking

### 3. Data Subject Rights
- **Right to access (Article 15)**: Log all data exports (`action='exported'`)
- **Right to erasure (Article 17)**: Log data deletion (`action='erased'`)
- **Right to rectification (Article 16)**: Log updates with before/after snapshots

### 4. Data Breach Notification (Article 33)
- Audit logs detect unauthorized access
- IP tracking helps identify breach scope

---

## Migration Workflow

### Running Migrations
```bash
# Apply all migrations in order
psql -U postgres -d cepcomunicacion -f migrations/001_create_base_tables.sql
psql -U postgres -d cepcomunicacion -f migrations/002_create_courses.sql
# ... (continue through 011)

# Or use a migration runner (Flyway, Liquibase, etc.)
```

### Rollback Procedure
Each migration includes a rollback script in comments:
```sql
-- Rollback migration 005
DROP TABLE IF EXISTS leads CASCADE;
```

### Testing Migrations
1. Apply migration on test database
2. Run migration tests: `npm test infra/postgres/tests/migrations.test.ts`
3. Verify rollback works
4. Apply to production during maintenance window

---

## Seed Data

### Loading Seed Data
```bash
psql -U postgres -d cepcomunicacion -f seeds/001_initial_data.sql
```

### Included Data
- 3 educational cycles
- 2 campuses (Madrid, Barcelona)
- 1 admin user (password: `admin123` - **CHANGE IMMEDIATELY**)
- 5 sample courses
- 3 FAQs

---

## Common Queries

### 1. Recent Leads Dashboard
```sql
SELECT
    l.id,
    l.name,
    l.email,
    c.title as course_title,
    cam.name as campaign_name,
    l.status,
    l.created_at
FROM leads l
LEFT JOIN courses c ON l.course_id = c.id
LEFT JOIN campaigns cam ON l.campaign_id = cam.id
WHERE l.status IN ('new', 'contacted')
ORDER BY l.created_at DESC
LIMIT 50;
```

### 2. Campaign Performance Report
```sql
SELECT
    cam.name as campaign_name,
    COUNT(l.id) as total_leads,
    COUNT(CASE WHEN l.status = 'converted' THEN 1 END) as conversions,
    ROUND(COUNT(CASE WHEN l.status = 'converted' THEN 1 END) * 100.0 / COUNT(l.id), 2) as conversion_rate
FROM campaigns cam
LEFT JOIN leads l ON l.campaign_id = cam.id
WHERE cam.status = 'active'
GROUP BY cam.id, cam.name
ORDER BY conversion_rate DESC;
```

### 3. Popular Courses by Lead Interest
```sql
SELECT
    c.title,
    COUNT(l.id) as lead_count
FROM courses c
INNER JOIN leads l ON l.course_id = c.id
WHERE c.status = 'published'
GROUP BY c.id, c.title
ORDER BY lead_count DESC
LIMIT 10;
```

### 4. Upcoming Course Runs
```sql
SELECT
    c.title,
    cr.start_date,
    cr.end_date,
    cam.name as campus_name,
    cr.current_students,
    cr.max_students,
    ROUND((cr.current_students::DECIMAL / cr.max_students) * 100, 0) as occupancy_rate
FROM course_runs cr
INNER JOIN courses c ON cr.course_id = c.id
INNER JOIN campuses cam ON cr.campus_id = cam.id
WHERE cr.status = 'scheduled'
    AND cr.start_date >= CURRENT_DATE
ORDER BY cr.start_date ASC;
```

---

## Architecture Decisions

### 1. Why SERIAL vs UUID for Primary Keys?
**Choice**: SERIAL (auto-incrementing integers)

**Rationale**:
- Better performance (4 bytes vs 16 bytes)
- Simpler debugging (IDs are sequential and readable)
- No distributed system requirements
- B-tree indexes on integers are more efficient

**Trade-off**: Not suitable for distributed databases or merge scenarios

### 2. Why JSONB for target_audience and performance_metrics?
**Choice**: JSONB (binary JSON storage)

**Rationale**:
- Flexible schema for evolving business requirements
- GIN indexes enable fast queries
- Reduces table sprawl (no need for separate tables for each metric)

**Trade-off**: Harder to enforce data integrity (no foreign keys on JSONB fields)

### 3. Why TEXT vs VARCHAR(255)?
**Choice**: TEXT for most string columns

**Rationale**:
- No performance difference in PostgreSQL (both are variable-length)
- More flexible (no arbitrary length limits)
- Cleaner schema (no magic numbers)

**Exception**: Use VARCHAR when enforcing business rules (e.g., `VARCHAR(10)` for phone)

### 4. Why Soft Deletes (deleted_at) Not Implemented?
**Choice**: Hard deletes with audit trail

**Rationale**:
- Cleaner queries (no WHERE deleted_at IS NULL on every query)
- GDPR erasure compliance (hard delete required for data erasure requests)
- Audit logs provide historical record

**Trade-off**: Cannot "undelete" records (must restore from backup)

---

## Future Enhancements

### 1. Full-Text Search
```sql
-- Add tsvector column for full-text search
ALTER TABLE courses ADD COLUMN search_vector tsvector;

CREATE INDEX courses_search_vector_idx ON courses USING GIN(search_vector);

-- Update trigger to maintain search_vector
CREATE TRIGGER courses_search_vector_update
BEFORE INSERT OR UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.spanish', title, description);
```

### 2. Table Partitioning (for audit_logs)
```sql
-- Partition audit_logs by month for better performance
CREATE TABLE audit_logs_2025_01 PARTITION OF audit_logs
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

### 3. Row-Level Security (RLS)
```sql
-- Enable RLS for multi-tenant isolation
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY leads_campus_isolation ON leads
USING (campus_id = current_setting('app.current_campus_id')::INTEGER);
```

### 4. Materialized Views for Analytics
```sql
-- Pre-compute expensive analytics queries
CREATE MATERIALIZED VIEW campaign_performance_summary AS
SELECT
    campaign_id,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_time_to_convert
FROM leads
GROUP BY campaign_id;

-- Refresh nightly
REFRESH MATERIALIZED VIEW CONCURRENTLY campaign_performance_summary;
```

---

## Monitoring & Maintenance

### Index Usage Monitoring
```sql
-- Find unused indexes
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0
    AND indexname NOT LIKE '%pkey%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Table Bloat Detection
```sql
-- Detect table bloat (requires pgstattuple extension)
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as external_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Slow Query Analysis
```sql
-- Enable slow query logging in postgresql.conf
-- log_min_duration_statement = 1000  # Log queries slower than 1s

-- Analyze slow queries
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Contact & Support

**Database Architecture Team**
- Email: dev@cepcomunicacion.com
- Slack: #database-support
- Documentation: https://docs.cepcomunicacion.com/database

**Emergency Contacts**
- On-call DBA: +34 XXX XXX XXX
- Escalation: CTO (cto@cepcomunicacion.com)

---

**Last Updated**: 2025-10-21
**Schema Version**: 1.0.0
**PostgreSQL Version**: 16.x
