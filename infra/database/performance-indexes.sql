-- ============================================================================
-- PERFORMANCE INDEXES for CEP Comunicación
--
-- Run this script on production PostgreSQL database AFTER schema is stable.
-- Use CONCURRENTLY to avoid locking tables during creation.
--
-- Author: Claude Code (SOLARIA AGENCY)
-- Date: 2025-12-05
-- Version: 1.0.0
-- ============================================================================

-- ============================================================================
-- COURSES
-- ============================================================================

-- Filter by type and status (most common query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_type_status
ON courses (type, status)
WHERE status = 'active';

-- Featured courses for homepage
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_featured
ON courses (featured, created_at DESC)
WHERE featured = true;

-- Search by slug (URL routing)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_slug
ON courses (slug);

-- ============================================================================
-- COURSE_RUNS (Convocatorias)
-- ============================================================================

-- Filter by course and status (course detail page)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_course_runs_course_status
ON course_runs (course_id, status, start_date);

-- Open registrations by date range
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_course_runs_dates
ON course_runs (start_date, end_date)
WHERE status IN ('open', 'waitlist');

-- Campus-based filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_course_runs_campus
ON course_runs (campus_id, status);

-- ============================================================================
-- ENROLLMENTS (Matrículas)
-- ============================================================================

-- Capacity checks per course run
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enrollments_course_run
ON enrollments (course_run_id, status);

-- Student enrollment history
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enrollments_student
ON enrollments (student_id, created_at DESC);

-- Payment status tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enrollments_payment
ON enrollments (payment_status, created_at DESC)
WHERE payment_status IN ('pending', 'partial');

-- ============================================================================
-- LEADS
-- ============================================================================

-- Campaign attribution
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_campaign
ON leads (campaign_id, created_at DESC);

-- Source/channel analysis
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_source_date
ON leads (source, created_at DESC);

-- Email lookup (deduplication)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_email
ON leads (email);

-- Follow-up queue
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_status_followup
ON leads (status, next_followup_date)
WHERE status IN ('new', 'contacted', 'qualified');

-- ============================================================================
-- CAMPAIGNS
-- ============================================================================

-- Active campaigns by date
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_dates
ON campaigns (start_date, end_date)
WHERE status = 'active';

-- UTM tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_utm
ON campaigns (utm_source, utm_medium);

-- ============================================================================
-- AUDIT_LOGS
-- ============================================================================

-- User activity timeline
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_date
ON audit_logs (user_id, created_at DESC);

-- Entity history
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_entity
ON audit_logs (entity_type, entity_id, created_at DESC);

-- Action filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_action
ON audit_logs (action, created_at DESC);

-- ============================================================================
-- STUDENTS
-- ============================================================================

-- DNI/NIF lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_dni
ON students (dni);

-- Email lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_email
ON students (email);

-- ============================================================================
-- CYCLES (Ciclos Formativos)
-- ============================================================================

-- Level filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cycles_level
ON cycles (level, status)
WHERE status = 'active';

-- ============================================================================
-- FULL-TEXT SEARCH (Optional - Spanish language)
-- ============================================================================

-- Uncomment if full-text search is needed on course titles
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_title_fts
-- ON courses USING GIN (to_tsvector('spanish', title));

-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_description_fts
-- ON courses USING GIN (to_tsvector('spanish', description));

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Check index usage (run periodically)
-- SELECT
--     schemaname,
--     relname AS table_name,
--     indexrelname AS index_name,
--     idx_scan AS times_used,
--     pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
-- FROM pg_stat_user_indexes
-- ORDER BY idx_scan DESC;

-- Find unused indexes (candidates for removal)
-- SELECT
--     schemaname || '.' || relname AS table,
--     indexrelname AS index,
--     pg_size_pretty(pg_relation_size(indexrelid)) AS size
-- FROM pg_stat_user_indexes
-- WHERE idx_scan = 0
-- AND indexrelname NOT LIKE '%_pkey'
-- ORDER BY pg_relation_size(indexrelid) DESC;

-- ============================================================================
-- ANALYZE TABLES (Run after index creation)
-- ============================================================================

ANALYZE courses;
ANALYZE course_runs;
ANALYZE enrollments;
ANALYZE leads;
ANALYZE campaigns;
ANALYZE audit_logs;
ANALYZE students;
ANALYZE cycles;
