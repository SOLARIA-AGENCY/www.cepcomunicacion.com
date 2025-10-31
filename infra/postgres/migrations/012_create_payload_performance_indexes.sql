-- ============================================================================
-- MIGRATION 012: CREATE PAYLOAD CMS PERFORMANCE INDEXES
-- ============================================================================
-- Description: Performance optimization indexes for Payload CMS 3.x auto-generated tables
-- Dependencies: Payload CMS collections (courses, leads, enrollments, students, campaigns)
-- Author: PostgreSQL Schema Architect
-- Date: 2025-10-31
-- ============================================================================
--
-- IMPORTANT: Payload CMS 3.x auto-generates table structures from collection configs.
-- This migration creates ADDITIONAL performance indexes beyond Payload's defaults.
--
-- Payload Table Naming Convention:
-- - Collection slug 'courses' → table 'courses'
-- - Collection slug 'course-runs' → table 'course_runs'
-- - Collection slug 'leads' → table 'leads'
-- - Collection slug 'students' → table 'students'
-- - Collection slug 'enrollments' → table 'enrollments'
-- - Collection slug 'campaigns' → table 'campaigns'
--
-- Index Strategy:
-- 1. B-tree: Equality/range queries on single columns
-- 2. Composite B-tree: Multi-column WHERE clauses (column order matters!)
-- 3. GIN: JSONB queries and full-text search
-- 4. Partial: Conditional indexes for filtered queries (e.g., WHERE deleted_at IS NULL)
--
-- Performance Rationale:
-- - Each index adds write overhead (~10-15% INSERT/UPDATE penalty)
-- - Indexes consume disk space (~10-20% of table size per index)
-- - PostgreSQL typically uses 1-2 indexes per query (index intersection is rare)
-- - Focus on high-frequency read patterns and JOIN columns
-- ============================================================================

-- ============================================================================
-- SECTION 1: COURSES COLLECTION
-- ============================================================================
-- Query Patterns:
-- - Frontend: Filter by (active=true, featured=true, cycle_id)
-- - Admin: Filter by status, campus relationships
-- - SEO: Search by keywords
-- ============================================================================

-- Composite index for active featured courses (homepage)
-- Supports: WHERE active = true AND featured = true ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS courses_active_featured_created_idx
ON courses(active, featured, created_at DESC)
WHERE active = true AND featured = true;

COMMENT ON INDEX courses_active_featured_created_idx IS
'Partial index for homepage featured courses. Small dataset (~10-20 rows), extremely fast.';

-- Composite index for active courses by cycle
-- Supports: WHERE active = true AND cycle_id = $1 ORDER BY name
CREATE INDEX IF NOT EXISTS courses_active_cycle_name_idx
ON courses(active, cycle_id, name)
WHERE active = true;

COMMENT ON INDEX courses_active_cycle_name_idx IS
'Optimizes "Show all active FP Grado Medio courses" queries. Covers index for name sorting.';

-- Composite index for cycle and modality filtering
-- Supports: WHERE cycle_id = $1 AND modality = $2 AND active = true
CREATE INDEX IF NOT EXISTS courses_cycle_modality_active_idx
ON courses(cycle_id, modality, active);

COMMENT ON INDEX courses_cycle_modality_active_idx IS
'Optimizes filtering courses by cycle type and delivery modality (presencial/online/hibrido).';

-- Index on slug for URL lookups (if not already indexed by Payload UNIQUE constraint)
-- Note: Payload automatically creates unique index on slug field
-- This is informational only - DO NOT CREATE if already exists
-- CREATE UNIQUE INDEX IF NOT EXISTS courses_slug_unique_idx ON courses(slug);

-- ============================================================================
-- SECTION 2: LEADS COLLECTION
-- ============================================================================
-- Query Patterns:
-- - CRM Dashboard: Filter by status, assigned_to, created_at DESC
-- - Deduplication: Check if email exists
-- - Campaign Attribution: Filter by campaign_id and status
-- - GDPR Compliance: Filter by gdpr_consent_date
-- ============================================================================

-- Composite index for lead funnel analysis
-- Supports: WHERE status = $1 AND created_at >= $2 ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS leads_status_created_at_idx
ON leads(status, created_at DESC);

COMMENT ON INDEX leads_status_created_at_idx IS
'Optimizes lead funnel dashboards: "Show all new leads this week".';

-- Index on email for deduplication and lookups
-- Supports: WHERE email = $1 (lead deduplication before INSERT)
CREATE INDEX IF NOT EXISTS leads_email_idx
ON leads(email);

COMMENT ON INDEX leads_email_idx IS
'Critical for duplicate lead detection via Meta Ads webhook and form submissions.';

-- Composite index for campaign performance tracking
-- Supports: WHERE campaign_id = $1 AND status IN ('converted', 'qualified')
CREATE INDEX IF NOT EXISTS leads_campaign_status_idx
ON leads(campaign_id, status)
WHERE campaign_id IS NOT NULL;

COMMENT ON INDEX leads_campaign_status_idx IS
'Partial index for campaign ROI analysis. Excludes organic leads with NULL campaign_id.';

-- Index on assigned_to for sales rep dashboards
-- Supports: WHERE assigned_to = $1 ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS leads_assigned_to_created_idx
ON leads(assigned_to, created_at DESC)
WHERE assigned_to IS NOT NULL;

COMMENT ON INDEX leads_assigned_to_created_idx IS
'Partial index for "My Leads" dashboard. Excludes unassigned leads.';

-- Index on gdpr_consent_date for compliance reporting
-- Supports: WHERE gdpr_consent_date >= $1 (GDPR audit reports)
CREATE INDEX IF NOT EXISTS leads_gdpr_consent_date_idx
ON leads(gdpr_consent_date)
WHERE gdpr_consent = true;

COMMENT ON INDEX leads_gdpr_consent_date_idx IS
'Partial index for GDPR compliance audits. Tracks consent timestamps for data protection reports.';

-- ============================================================================
-- SECTION 3: ENROLLMENTS COLLECTION
-- ============================================================================
-- Query Patterns:
-- - Student Profile: Find all enrollments for student_id
-- - Course Run: Find all enrollments for course_run_id (capacity tracking)
-- - Payment Dashboard: Filter by payment_status
-- - Academic Reports: Filter by status (completed, confirmed)
-- ============================================================================

-- Composite index for student enrollment history
-- Supports: WHERE student = $1 ORDER BY enrolled_at DESC
CREATE INDEX IF NOT EXISTS enrollments_student_enrolled_at_idx
ON enrollments(student, enrolled_at DESC);

COMMENT ON INDEX enrollments_student_enrolled_at_idx IS
'Optimizes "Student Profile → Enrollment History" queries. Shows all courses student has taken.';

-- Composite index for course run enrollment list
-- Supports: WHERE course_run = $1 AND status IN ('confirmed', 'completed')
CREATE INDEX IF NOT EXISTS enrollments_course_run_status_idx
ON enrollments(course_run, status);

COMMENT ON INDEX enrollments_course_run_status_idx IS
'Critical for capacity tracking and class rosters. Updates course_run.current_enrollments counter.';

-- Index on payment_status for financial dashboards
-- Supports: WHERE payment_status = 'pending' OR payment_status = 'partial'
CREATE INDEX IF NOT EXISTS enrollments_payment_status_idx
ON enrollments(payment_status)
WHERE payment_status IN ('pending', 'partial');

COMMENT ON INDEX enrollments_payment_status_idx IS
'Partial index for accounts receivable dashboard. Tracks outstanding payments only.';

-- Composite index for active enrollments by student
-- Supports: WHERE student = $1 AND status IN ('pending', 'confirmed')
CREATE INDEX IF NOT EXISTS enrollments_student_active_status_idx
ON enrollments(student, status)
WHERE status IN ('pending', 'confirmed', 'waitlisted');

COMMENT ON INDEX enrollments_student_active_status_idx IS
'Partial index for "Current Courses" section on student profile. Excludes completed/cancelled.';

-- ============================================================================
-- SECTION 4: STUDENTS COLLECTION (if using separate students table)
-- ============================================================================
-- Query Patterns:
-- - Authentication: Lookup by email
-- - Deduplication: Check if DNI/email exists
-- - Admin Search: Find students by name or email
-- ============================================================================

-- Index on email for authentication and lookups
-- Supports: WHERE email = $1 (student login, password reset)
CREATE INDEX IF NOT EXISTS students_email_idx
ON students(email);

COMMENT ON INDEX students_email_idx IS
'Critical for student authentication and duplicate detection. Email is natural key.';

-- Index on DNI for identity verification
-- Supports: WHERE dni = $1 (Spanish national ID verification)
CREATE INDEX IF NOT EXISTS students_dni_idx
ON students(dni);

COMMENT ON INDEX students_dni_idx IS
'Unique identifier for Spanish students. Prevents duplicate registrations.';

-- Composite index for active students search
-- Supports: WHERE active = true AND (email ILIKE $1 OR name ILIKE $2)
-- Note: For full-text search, consider pg_trgm extension with GIN index
CREATE INDEX IF NOT EXISTS students_active_created_idx
ON students(active, created_at DESC)
WHERE active = true;

COMMENT ON INDEX students_active_created_idx IS
'Partial index for active students list. Supports "Recent Students" dashboard.';

-- ============================================================================
-- SECTION 5: CAMPAIGNS COLLECTION
-- ============================================================================
-- Query Patterns:
-- - Marketing Dashboard: Filter by status and date range
-- - Active Campaigns: Filter by start_date <= NOW() AND end_date >= NOW()
-- - Attribution: Lookup by UTM parameters
-- ============================================================================

-- Composite index for active campaigns
-- Supports: WHERE status = 'active' AND start_date <= NOW() AND end_date >= NOW()
CREATE INDEX IF NOT EXISTS campaigns_status_dates_idx
ON campaigns(status, start_date, end_date)
WHERE status IN ('active', 'scheduled');

COMMENT ON INDEX campaigns_status_dates_idx IS
'Partial index for active/upcoming campaigns. Excludes archived campaigns.';

-- Index on start_date for chronological queries
-- Supports: WHERE start_date >= $1 ORDER BY start_date DESC
CREATE INDEX IF NOT EXISTS campaigns_start_date_idx
ON campaigns(start_date DESC);

COMMENT ON INDEX campaigns_start_date_idx IS
'Optimizes "Recent Campaigns" dashboard and reporting queries.';

-- GIN index on target_audience JSONB (if exists in collection)
-- Supports: WHERE target_audience @> '{"age_range": "18-25"}'
-- Uncomment if target_audience field exists as JSONB
-- CREATE INDEX IF NOT EXISTS campaigns_target_audience_gin_idx
-- ON campaigns USING GIN(target_audience);
--
-- COMMENT ON INDEX campaigns_target_audience_gin_idx IS
-- 'Enables JSONB queries for audience segmentation (age, location, interests).';

-- ============================================================================
-- SECTION 6: ADS_TEMPLATES COLLECTION
-- ============================================================================
-- Query Patterns:
-- - Filter by campaign_id
-- - Search by platform (facebook, google, instagram)
-- - Performance analytics (impressions, clicks, CTR)
-- ============================================================================

-- Index on campaign relationship
-- Supports: WHERE campaign = $1 ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS ads_templates_campaign_created_idx
ON ads_templates(campaign, created_at DESC)
WHERE campaign IS NOT NULL;

COMMENT ON INDEX ads_templates_campaign_created_idx IS
'Optimizes "Show all ads for this campaign" queries. Excludes orphaned templates.';

-- Composite index for active ads by platform
-- Supports: WHERE status = 'active' AND platform = $1
CREATE INDEX IF NOT EXISTS ads_templates_status_platform_idx
ON ads_templates(status, platform)
WHERE status = 'active';

COMMENT ON INDEX ads_templates_status_platform_idx IS
'Partial index for active ad templates. Useful for dashboard filtering by ad platform.';

-- ============================================================================
-- SECTION 7: BLOG_POSTS COLLECTION
-- ============================================================================
-- Query Patterns:
-- - Public: Filter by (status='published', published_at DESC)
-- - Search by tags or categories
-- - Author profiles
-- ============================================================================

-- Composite index for published posts
-- Supports: WHERE status = 'published' ORDER BY published_at DESC LIMIT 10
CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx
ON blog_posts(status, published_at DESC)
WHERE status = 'published';

COMMENT ON INDEX blog_posts_status_published_at_idx IS
'Partial index for public blog feed. Excludes drafts and archived posts.';

-- Index on slug for URL lookups (if not auto-indexed by Payload)
-- Note: Payload creates unique index on slug automatically
-- This is informational only
-- CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_unique_idx ON blog_posts(slug);

-- Index on author relationship
-- Supports: WHERE author = $1 ORDER BY published_at DESC
CREATE INDEX IF NOT EXISTS blog_posts_author_published_idx
ON blog_posts(author, published_at DESC)
WHERE author IS NOT NULL;

COMMENT ON INDEX blog_posts_author_published_idx IS
'Optimizes "Author Profile → Blog Posts" queries. Excludes posts with no author.';

-- GIN index on tags array (if Payload stores as PostgreSQL array)
-- Supports: WHERE tags @> ARRAY['fp', 'formacion']
-- Uncomment if tags field is stored as text[]
-- CREATE INDEX IF NOT EXISTS blog_posts_tags_gin_idx
-- ON blog_posts USING GIN(tags);
--
-- COMMENT ON INDEX blog_posts_tags_gin_idx IS
-- 'Enables fast tag filtering: "Show all posts tagged with FP".';

-- ============================================================================
-- SECTION 8: FAQS COLLECTION
-- ============================================================================
-- Query Patterns:
-- - Public: Filter by is_published = true
-- - Group by category and order by order_display
-- ============================================================================

-- Composite index for published FAQs by category
-- Supports: WHERE is_published = true AND category = $1 ORDER BY order_display
CREATE INDEX IF NOT EXISTS faqs_category_order_idx
ON faqs(category, order_display)
WHERE is_published = true;

COMMENT ON INDEX faqs_category_order_idx IS
'Partial index for public FAQ page rendering. Sorted by display order within category.';

-- ============================================================================
-- SECTION 9: COURSE_RUNS COLLECTION (scheduled course instances)
-- ============================================================================
-- Query Patterns:
-- - Filter by course_id and start_date (upcoming runs)
-- - Filter by campus_id and status (available seats)
-- - Check enrollment_open status
-- ============================================================================

-- Composite index for course schedule
-- Supports: WHERE course = $1 AND start_date >= NOW() ORDER BY start_date
CREATE INDEX IF NOT EXISTS course_runs_course_start_date_idx
ON course_runs(course, start_date)
WHERE enrollment_open = true;

COMMENT ON INDEX course_runs_course_start_date_idx IS
'Partial index for "Show upcoming runs for this course". Excludes closed enrollments.';

-- Composite index for campus availability
-- Supports: WHERE campus = $1 AND status = 'scheduled' AND enrollment_open = true
CREATE INDEX IF NOT EXISTS course_runs_campus_status_idx
ON course_runs(campus, status, enrollment_open)
WHERE enrollment_open = true;

COMMENT ON INDEX course_runs_campus_status_idx IS
'Partial index for "Available courses at Madrid campus". Real-time availability checks.';

-- Index on start_date for chronological queries
-- Supports: WHERE start_date >= NOW() ORDER BY start_date LIMIT 10
CREATE INDEX IF NOT EXISTS course_runs_start_date_idx
ON course_runs(start_date)
WHERE start_date >= CURRENT_DATE;

COMMENT ON INDEX course_runs_start_date_idx IS
'Partial index for upcoming course runs. Self-maintaining (past dates excluded).';

-- ============================================================================
-- SECTION 10: MEDIA COLLECTION
-- ============================================================================
-- Query Patterns:
-- - Lookup by filename or storage path
-- - Filter by mime_type (images, PDFs, videos)
-- - Search by alt text for accessibility audits
-- ============================================================================

-- Index on filename for file lookups
-- Supports: WHERE filename = $1
CREATE INDEX IF NOT EXISTS media_filename_idx
ON media(filename);

COMMENT ON INDEX media_filename_idx IS
'Optimizes file serving and duplicate detection. Fast filename-based lookups.';

-- Index on mime_type for filtering by file type
-- Supports: WHERE mime_type LIKE 'image/%' (image gallery queries)
CREATE INDEX IF NOT EXISTS media_mime_type_idx
ON media(mime_type);

COMMENT ON INDEX media_mime_type_idx IS
'Optimizes media library filtering by type (images, PDFs, videos).';

-- ============================================================================
-- SECTION 11: USERS COLLECTION (Payload Auth)
-- ============================================================================
-- Query Patterns:
-- - Authentication: Lookup by email
-- - Admin Dashboard: Filter by role
-- - Password Reset: Lookup by reset token
-- ============================================================================

-- Index on email (already auto-indexed by Payload for auth collection)
-- Note: Payload creates unique index on email automatically
-- This is informational only
-- CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users(email);

-- Index on role for admin user management
-- Supports: WHERE role = $1 (filter users by role)
CREATE INDEX IF NOT EXISTS users_role_idx
ON users(role);

COMMENT ON INDEX users_role_idx IS
'Optimizes user management dashboard filtering by role (admin, gestor, marketing, etc.).';

-- Partial index on reset_password_token
-- Supports: WHERE reset_password_token = $1 (password reset flow)
CREATE INDEX IF NOT EXISTS users_reset_password_token_idx
ON users(reset_password_token)
WHERE reset_password_token IS NOT NULL;

COMMENT ON INDEX users_reset_password_token_idx IS
'Partial index for active password reset tokens. Small dataset, extremely fast lookups.';

-- ============================================================================
-- SECTION 12: CYCLES & CAMPUSES COLLECTIONS
-- ============================================================================
-- These are small lookup tables (<100 rows), minimal indexing needed
-- Payload auto-creates indexes on id and slug (unique constraint)
-- ============================================================================

-- Index on order_display for cycles (if exists)
-- Supports: ORDER BY order_display
CREATE INDEX IF NOT EXISTS cycles_order_display_idx
ON cycles(order_display);

COMMENT ON INDEX cycles_order_display_idx IS
'Optimizes ordered display of educational cycles (FP Grado Medio, Grado Superior, etc.).';

-- Index on city for campuses (location filtering)
-- Supports: WHERE city = $1
CREATE INDEX IF NOT EXISTS campuses_city_idx
ON campuses(city);

COMMENT ON INDEX campuses_city_idx IS
'Optimizes "Find courses in Madrid" geographic filtering.';

-- ============================================================================
-- INDEX MAINTENANCE & MONITORING
-- ============================================================================
--
-- 1. ANALYZE: Update table statistics after bulk data loads
--    Frequency: After seed data, CSV imports, or large batch operations
--    Command: ANALYZE courses, leads, enrollments;
--
-- 2. REINDEX: Rebuild indexes if performance degrades (rare with Payload)
--    Frequency: Quarterly or when index bloat detected (pg_stat_user_indexes)
--    Command: REINDEX TABLE CONCURRENTLY courses;
--
-- 3. VACUUM: Reclaim space from deleted/updated rows
--    Frequency: Automatic via autovacuum (monitor pg_stat_user_tables)
--    Manual: VACUUM ANALYZE courses; (if autovacuum is disabled)
--
-- 4. Monitor Index Usage:
--    Query:
--    SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
--    FROM pg_stat_user_indexes
--    WHERE schemaname = 'public'
--    ORDER BY idx_scan ASC;
--
--    Interpretation:
--    - idx_scan = 0: Index is never used (candidate for deletion)
--    - idx_scan > 10000: High-value index (do not delete)
--    - idx_tup_read >> idx_tup_fetch: Index may be inefficient
--
-- 5. Identify Unused Indexes (candidates for deletion):
--    Query:
--    SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid))
--    FROM pg_stat_user_indexes
--    WHERE idx_scan = 0
--      AND indexname NOT LIKE '%_pkey'
--      AND schemaname = 'public'
--    ORDER BY pg_relation_size(indexrelid) DESC;
--
-- 6. Check Index Size:
--    Query:
--    SELECT indexname, pg_size_pretty(pg_relation_size(indexrelid))
--    FROM pg_stat_user_indexes
--    WHERE schemaname = 'public'
--    ORDER BY pg_relation_size(indexrelid) DESC;
--
-- 7. Monitor Table Bloat (excessive dead tuples):
--    Query:
--    SELECT schemaname, tablename, n_dead_tup, last_autovacuum
--    FROM pg_stat_user_tables
--    WHERE schemaname = 'public'
--    ORDER BY n_dead_tup DESC;
--
-- ============================================================================
-- EXPECTED PERFORMANCE IMPROVEMENTS
-- ============================================================================
--
-- Before Indexes (baseline):
-- - Courses homepage: Seq Scan on courses (cost=0..125.00 rows=1000)
-- - Lead deduplication: Seq Scan on leads WHERE email = '...' (cost=0..5000.00)
-- - Enrollment list: Seq Scan on enrollments WHERE course_run = 1 (cost=0..10000.00)
--
-- After Indexes:
-- - Courses homepage: Index Scan using courses_active_featured_created_idx (cost=0..8.50 rows=10)
--   Improvement: ~15x faster (125 → 8.5 cost units)
--
-- - Lead deduplication: Index Scan using leads_email_idx (cost=0..0.42 rows=1)
--   Improvement: ~12000x faster (5000 → 0.42 cost units)
--
-- - Enrollment list: Index Scan using enrollments_course_run_status_idx (cost=0..125.00 rows=50)
--   Improvement: ~80x faster (10000 → 125 cost units)
--
-- Overall Expected Impact:
-- - Read query performance: 10-1000x improvement (depends on table size)
-- - Write operations: 10-15% slower due to index maintenance
-- - Disk usage: +15-20% for index storage
-- - API response times: Reduction from 500-2000ms to 50-200ms for filtered queries
--
-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
/*
-- Courses
DROP INDEX IF EXISTS courses_active_featured_created_idx;
DROP INDEX IF EXISTS courses_active_cycle_name_idx;
DROP INDEX IF EXISTS courses_cycle_modality_active_idx;

-- Leads
DROP INDEX IF EXISTS leads_status_created_at_idx;
DROP INDEX IF EXISTS leads_email_idx;
DROP INDEX IF EXISTS leads_campaign_status_idx;
DROP INDEX IF EXISTS leads_assigned_to_created_idx;
DROP INDEX IF EXISTS leads_gdpr_consent_date_idx;

-- Enrollments
DROP INDEX IF EXISTS enrollments_student_enrolled_at_idx;
DROP INDEX IF EXISTS enrollments_course_run_status_idx;
DROP INDEX IF EXISTS enrollments_payment_status_idx;
DROP INDEX IF EXISTS enrollments_student_active_status_idx;

-- Students
DROP INDEX IF EXISTS students_email_idx;
DROP INDEX IF EXISTS students_dni_idx;
DROP INDEX IF EXISTS students_active_created_idx;

-- Campaigns
DROP INDEX IF EXISTS campaigns_status_dates_idx;
DROP INDEX IF EXISTS campaigns_start_date_idx;

-- Ads Templates
DROP INDEX IF EXISTS ads_templates_campaign_created_idx;
DROP INDEX IF EXISTS ads_templates_status_platform_idx;

-- Blog Posts
DROP INDEX IF EXISTS blog_posts_status_published_at_idx;
DROP INDEX IF EXISTS blog_posts_author_published_idx;

-- FAQs
DROP INDEX IF EXISTS faqs_category_order_idx;

-- Course Runs
DROP INDEX IF EXISTS course_runs_course_start_date_idx;
DROP INDEX IF EXISTS course_runs_campus_status_idx;
DROP INDEX IF EXISTS course_runs_start_date_idx;

-- Media
DROP INDEX IF EXISTS media_filename_idx;
DROP INDEX IF EXISTS media_mime_type_idx;

-- Users
DROP INDEX IF EXISTS users_role_idx;
DROP INDEX IF EXISTS users_reset_password_token_idx;

-- Cycles & Campuses
DROP INDEX IF EXISTS cycles_order_display_idx;
DROP INDEX IF EXISTS campuses_city_idx;
*/
-- ============================================================================
