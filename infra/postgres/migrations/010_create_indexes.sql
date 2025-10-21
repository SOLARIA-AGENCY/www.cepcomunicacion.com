-- ============================================================================
-- MIGRATION 010: CREATE PERFORMANCE INDEXES
-- ============================================================================
-- Description: Creates optimized indexes for query performance
-- Dependencies: All previous migrations (001-009)
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================
--
-- Index Strategy:
-- 1. B-tree: Default for equality/range queries on single columns
-- 2. Composite B-tree: Multi-column WHERE clauses (order matters!)
-- 3. GIN: Full-text search, JSONB queries, array containment
-- 4. Partial: Conditional indexes for common filtered queries
--
-- Performance Considerations:
-- - Each index adds write overhead (INSERT/UPDATE slower)
-- - Indexes consume disk space
-- - PostgreSQL can use max ~1-2 indexes per query
-- - Analyze query patterns before adding indexes
-- ============================================================================

-- ============================================================================
-- CYCLES TABLE INDEXES
-- ============================================================================

-- B-tree on slug (already UNIQUE constraint creates index automatically)
-- B-tree on order_display for sorting
CREATE INDEX IF NOT EXISTS cycles_order_display_idx ON cycles(order_display);

COMMENT ON INDEX cycles_order_display_idx IS 'Optimize ORDER BY order_display queries';

-- ============================================================================
-- CAMPUSES TABLE INDEXES
-- ============================================================================

-- B-tree on slug (already UNIQUE constraint creates index automatically)
-- B-tree on city for filtering by location
CREATE INDEX IF NOT EXISTS campuses_city_idx ON campuses(city);

COMMENT ON INDEX campuses_city_idx IS 'Optimize filtering courses by city/location';

-- ============================================================================
-- USERS TABLE INDEXES
-- ============================================================================

-- B-tree on email (already UNIQUE constraint creates index automatically)
-- B-tree on role for filtering users by access level
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- B-tree on reset_password_token for password reset lookups
CREATE INDEX IF NOT EXISTS users_reset_password_token_idx ON users(reset_password_token) WHERE reset_password_token IS NOT NULL;

COMMENT ON INDEX users_role_idx IS 'Optimize user management dashboard filtering by role';
COMMENT ON INDEX users_reset_password_token_idx IS 'Partial index for active password reset tokens only';

-- ============================================================================
-- COURSES TABLE INDEXES
-- ============================================================================

-- B-tree on slug (already UNIQUE constraint creates index automatically)

-- Composite B-tree on (cycle_id, campus_id) - Common filter combination
CREATE INDEX IF NOT EXISTS courses_cycle_id_campus_id_idx ON courses(cycle_id, campus_id);

-- B-tree on status for filtering published/draft courses
CREATE INDEX IF NOT EXISTS courses_status_idx ON courses(status);

-- Partial index on featured courses only
CREATE INDEX IF NOT EXISTS courses_featured_idx ON courses(featured) WHERE featured = true;

-- GIN index on seo_keywords array for keyword search
CREATE INDEX IF NOT EXISTS courses_seo_keywords_gin_idx ON courses USING GIN(seo_keywords);

COMMENT ON INDEX courses_cycle_id_campus_id_idx IS 'Optimize "Show all courses for Grado Medio in Madrid" queries';
COMMENT ON INDEX courses_status_idx IS 'Optimize filtering by publication status';
COMMENT ON INDEX courses_featured_idx IS 'Partial index for homepage featured courses (small subset)';
COMMENT ON INDEX courses_seo_keywords_gin_idx IS 'Enable fast keyword search with @> operator';

-- ============================================================================
-- COURSE_RUNS TABLE INDEXES
-- ============================================================================

-- Composite B-tree on (course_id, start_date) for course schedule queries
CREATE INDEX IF NOT EXISTS course_runs_course_id_start_date_idx ON course_runs(course_id, start_date DESC);

-- Composite B-tree on (campus_id, status) for location-based filtering
CREATE INDEX IF NOT EXISTS course_runs_campus_id_status_idx ON course_runs(campus_id, status);

-- B-tree on start_date for filtering upcoming courses
CREATE INDEX IF NOT EXISTS course_runs_start_date_idx ON course_runs(start_date) WHERE status IN ('scheduled', 'ongoing');

COMMENT ON INDEX course_runs_course_id_start_date_idx IS 'Optimize "Show all upcoming runs for this course" queries';
COMMENT ON INDEX course_runs_campus_id_status_idx IS 'Optimize "Show active courses at Madrid campus" queries';
COMMENT ON INDEX course_runs_start_date_idx IS 'Partial index for active/upcoming course runs only';

-- ============================================================================
-- CAMPAIGNS TABLE INDEXES
-- ============================================================================

-- B-tree on slug (already UNIQUE constraint creates index automatically)

-- Composite B-tree on (status, start_date) for active campaign queries
CREATE INDEX IF NOT EXISTS campaigns_status_start_date_idx ON campaigns(status, start_date DESC);

-- GIN index on target_audience JSONB for filtering by audience criteria
CREATE INDEX IF NOT EXISTS campaigns_target_audience_gin_idx ON campaigns USING GIN(target_audience);

COMMENT ON INDEX campaigns_status_start_date_idx IS 'Optimize "Show active campaigns ordered by start date" queries';
COMMENT ON INDEX campaigns_target_audience_gin_idx IS 'Enable JSONB queries on audience targeting (e.g., age_range, interests)';

-- ============================================================================
-- ADS_TEMPLATES TABLE INDEXES
-- ============================================================================

-- B-tree on campaign_id for filtering ads by campaign
CREATE INDEX IF NOT EXISTS ads_templates_campaign_id_idx ON ads_templates(campaign_id);

-- GIN index on performance_metrics JSONB for analytics queries
CREATE INDEX IF NOT EXISTS ads_templates_performance_metrics_gin_idx ON ads_templates USING GIN(performance_metrics);

COMMENT ON INDEX ads_templates_campaign_id_idx IS 'Optimize "Show all ads for this campaign" queries';
COMMENT ON INDEX ads_templates_performance_metrics_gin_idx IS 'Enable fast queries on CTR, CPC, conversions, etc.';

-- ============================================================================
-- LEADS TABLE INDEXES
-- ============================================================================

-- B-tree on email for lead deduplication and lookup
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

-- Composite B-tree on (campaign_id, status) for campaign performance analysis
CREATE INDEX IF NOT EXISTS leads_campaign_id_status_idx ON leads(campaign_id, status);

-- B-tree on created_at DESC for "Recent leads" dashboard
CREATE INDEX IF NOT EXISTS leads_created_at_desc_idx ON leads(created_at DESC);

-- B-tree on status for filtering by lead lifecycle stage
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);

-- B-tree on assigned_to for sales rep dashboard
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON leads(assigned_to) WHERE assigned_to IS NOT NULL;

COMMENT ON INDEX leads_email_idx IS 'Optimize duplicate lead detection and email lookups';
COMMENT ON INDEX leads_campaign_id_status_idx IS 'Optimize "Show conversion rate for this campaign" queries';
COMMENT ON INDEX leads_created_at_desc_idx IS 'Optimize "Show latest leads" dashboard query';
COMMENT ON INDEX leads_status_idx IS 'Optimize lead funnel stage filtering';
COMMENT ON INDEX leads_assigned_to_idx IS 'Partial index for assigned leads only (sales rep dashboard)';

-- ============================================================================
-- BLOG_POSTS TABLE INDEXES
-- ============================================================================

-- B-tree on slug (already UNIQUE constraint creates index automatically)

-- Composite B-tree on (status, published_at DESC) for published posts
CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx ON blog_posts(status, published_at DESC);

-- B-tree on author_id for "Posts by author" queries
CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON blog_posts(author_id);

-- GIN index on tags array for tag-based filtering
CREATE INDEX IF NOT EXISTS blog_posts_tags_gin_idx ON blog_posts USING GIN(tags);

COMMENT ON INDEX blog_posts_status_published_at_idx IS 'Optimize "Show published posts ordered by date" queries';
COMMENT ON INDEX blog_posts_author_id_idx IS 'Optimize author profile pages';
COMMENT ON INDEX blog_posts_tags_gin_idx IS 'Enable fast tag filtering (e.g., "Show all posts tagged FP")';

-- ============================================================================
-- FAQS TABLE INDEXES
-- ============================================================================

-- Composite B-tree on (category, order_display) for ordered FAQ display
CREATE INDEX IF NOT EXISTS faqs_category_order_display_idx ON faqs(category, order_display);

-- Partial index on published FAQs only
CREATE INDEX IF NOT EXISTS faqs_is_published_idx ON faqs(is_published) WHERE is_published = true;

COMMENT ON INDEX faqs_category_order_display_idx IS 'Optimize FAQ page rendering (grouped and sorted)';
COMMENT ON INDEX faqs_is_published_idx IS 'Partial index for public FAQ queries only';

-- ============================================================================
-- MEDIA TABLE INDEXES
-- ============================================================================

-- B-tree on storage_path for file retrieval
CREATE INDEX IF NOT EXISTS media_storage_path_idx ON media(storage_path);

-- Composite B-tree on (entity_type, entity_id) for polymorphic associations
CREATE INDEX IF NOT EXISTS media_entity_type_entity_id_idx ON media(entity_type, entity_id);

COMMENT ON INDEX media_storage_path_idx IS 'Optimize file serving by path lookup';
COMMENT ON INDEX media_entity_type_entity_id_idx IS 'Optimize "Show all media for this course/blog post" queries';

-- ============================================================================
-- SEO_METADATA TABLE INDEXES
-- ============================================================================

-- Composite UNIQUE constraint already creates index on (entity_type, entity_id)

-- GIN index on keywords array for keyword analysis
CREATE INDEX IF NOT EXISTS seo_metadata_keywords_gin_idx ON seo_metadata USING GIN(keywords);

COMMENT ON INDEX seo_metadata_keywords_gin_idx IS 'Enable keyword analysis across all content types';

-- ============================================================================
-- AUDIT_LOGS TABLE INDEXES
-- ============================================================================

-- Composite B-tree on (entity_type, entity_id) for entity audit history
CREATE INDEX IF NOT EXISTS audit_logs_entity_type_entity_id_idx ON audit_logs(entity_type, entity_id);

-- B-tree on user_id for user activity reports
CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON audit_logs(user_id) WHERE user_id IS NOT NULL;

-- B-tree on timestamp DESC for recent activity queries
CREATE INDEX IF NOT EXISTS audit_logs_timestamp_desc_idx ON audit_logs(timestamp DESC);

-- B-tree on action for filtering by action type
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs(action);

COMMENT ON INDEX audit_logs_entity_type_entity_id_idx IS 'Optimize "Show all changes to this lead" queries';
COMMENT ON INDEX audit_logs_user_id_idx IS 'Partial index for logged-in user activity (excludes anonymous actions)';
COMMENT ON INDEX audit_logs_timestamp_desc_idx IS 'Optimize "Recent activity" dashboard';
COMMENT ON INDEX audit_logs_action_idx IS 'Optimize GDPR compliance reports (e.g., "Show all erasure requests")';

-- ============================================================================
-- INDEX MAINTENANCE NOTES
-- ============================================================================
--
-- 1. ANALYZE: Update table statistics after bulk data loads
--    Command: ANALYZE table_name;
--    Frequency: After importing seed data or large imports
--
-- 2. REINDEX: Rebuild indexes if performance degrades
--    Command: REINDEX TABLE table_name;
--    Frequency: Quarterly or when index bloat detected
--
-- 3. Vacuum: Reclaim space from deleted rows
--    Command: VACUUM ANALYZE table_name;
--    Frequency: Automatic via autovacuum (monitor pg_stat_user_tables)
--
-- 4. Monitor index usage:
--    SELECT schemaname, tablename, indexname, idx_scan
--    FROM pg_stat_user_indexes
--    ORDER BY idx_scan ASC;
--
-- 5. Unused indexes (candidates for deletion):
--    SELECT schemaname, tablename, indexname
--    FROM pg_stat_user_indexes
--    WHERE idx_scan = 0 AND indexname NOT LIKE '%pkey%';
--
-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP INDEX IF EXISTS cycles_order_display_idx;
-- DROP INDEX IF EXISTS campuses_city_idx;
-- DROP INDEX IF EXISTS users_role_idx;
-- DROP INDEX IF EXISTS users_reset_password_token_idx;
-- DROP INDEX IF EXISTS courses_cycle_id_campus_id_idx;
-- DROP INDEX IF EXISTS courses_status_idx;
-- DROP INDEX IF EXISTS courses_featured_idx;
-- DROP INDEX IF EXISTS courses_seo_keywords_gin_idx;
-- DROP INDEX IF EXISTS course_runs_course_id_start_date_idx;
-- DROP INDEX IF EXISTS course_runs_campus_id_status_idx;
-- DROP INDEX IF EXISTS course_runs_start_date_idx;
-- DROP INDEX IF EXISTS campaigns_status_start_date_idx;
-- DROP INDEX IF EXISTS campaigns_target_audience_gin_idx;
-- DROP INDEX IF EXISTS ads_templates_campaign_id_idx;
-- DROP INDEX IF EXISTS ads_templates_performance_metrics_gin_idx;
-- DROP INDEX IF EXISTS leads_email_idx;
-- DROP INDEX IF EXISTS leads_campaign_id_status_idx;
-- DROP INDEX IF EXISTS leads_created_at_desc_idx;
-- DROP INDEX IF EXISTS leads_status_idx;
-- DROP INDEX IF EXISTS leads_assigned_to_idx;
-- DROP INDEX IF EXISTS blog_posts_status_published_at_idx;
-- DROP INDEX IF EXISTS blog_posts_author_id_idx;
-- DROP INDEX IF EXISTS blog_posts_tags_gin_idx;
-- DROP INDEX IF EXISTS faqs_category_order_display_idx;
-- DROP INDEX IF EXISTS faqs_is_published_idx;
-- DROP INDEX IF EXISTS media_storage_path_idx;
-- DROP INDEX IF EXISTS media_entity_type_entity_id_idx;
-- DROP INDEX IF EXISTS seo_metadata_keywords_gin_idx;
-- DROP INDEX IF EXISTS audit_logs_entity_type_entity_id_idx;
-- DROP INDEX IF EXISTS audit_logs_user_id_idx;
-- DROP INDEX IF EXISTS audit_logs_timestamp_desc_idx;
-- DROP INDEX IF EXISTS audit_logs_action_idx;
-- ============================================================================
