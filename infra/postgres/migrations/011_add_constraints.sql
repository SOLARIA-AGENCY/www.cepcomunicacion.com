-- ============================================================================
-- MIGRATION 011: ADD TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================================================
-- Description: Creates triggers to automatically update updated_at timestamps
-- Dependencies: All previous migrations (001-010)
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================
--
-- Purpose:
-- Automatically set updated_at = NOW() whenever a row is modified (UPDATE).
-- This ensures accurate audit trails without application-level code.
--
-- Implementation:
-- 1. Create a reusable trigger function (update_updated_at_column)
-- 2. Attach trigger to all tables with updated_at column
-- ============================================================================

-- ============================================================================
-- CREATE REUSABLE TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger function to auto-update updated_at timestamp on row UPDATE';

-- ============================================================================
-- ATTACH TRIGGERS TO TABLES
-- ============================================================================

-- CYCLES TABLE
CREATE TRIGGER update_cycles_updated_at
    BEFORE UPDATE ON cycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- CAMPUSES TABLE
CREATE TRIGGER update_campuses_updated_at
    BEFORE UPDATE ON campuses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- USERS TABLE
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- COURSES TABLE
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- COURSE_RUNS TABLE
CREATE TRIGGER update_course_runs_updated_at
    BEFORE UPDATE ON course_runs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- CAMPAIGNS TABLE
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ADS_TEMPLATES TABLE
CREATE TRIGGER update_ads_templates_updated_at
    BEFORE UPDATE ON ads_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- LEADS TABLE
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- BLOG_POSTS TABLE
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- FAQS TABLE
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- SEO_METADATA TABLE
CREATE TRIGGER update_seo_metadata_updated_at
    BEFORE UPDATE ON seo_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER BEHAVIOR NOTES
-- ============================================================================
--
-- 1. BEFORE UPDATE: Trigger fires before the UPDATE is committed
--    - Modifies NEW.updated_at before writing to disk
--    - More efficient than AFTER UPDATE (no second write)
--
-- 2. FOR EACH ROW: Trigger fires for every row affected by UPDATE
--    - UPDATE courses SET status = 'published' WHERE cycle_id = 1;
--    - If 10 rows match, trigger fires 10 times
--
-- 3. NEW vs OLD:
--    - NEW: Row data after UPDATE (what will be written)
--    - OLD: Row data before UPDATE (previous values)
--
-- 4. Trigger execution order (if multiple triggers exist):
--    - Alphabetical by trigger name
--    - Consider naming convention for predictable execution
--
-- 5. Performance impact:
--    - Minimal overhead (simple timestamp assignment)
--    - No network calls or complex logic
--
-- ============================================================================
-- TESTING TRIGGERS
-- ============================================================================
--
-- Test case example:
--
-- -- Insert a course
-- INSERT INTO courses (slug, title, duration_hours, modality, cycle_id, campus_id)
-- VALUES ('test-course', 'Test Course', 100, 'online', 1, 1);
--
-- -- Verify initial timestamps
-- SELECT created_at, updated_at FROM courses WHERE slug = 'test-course';
-- -- Result: created_at = updated_at (both set to NOW() on INSERT)
--
-- -- Wait 1 second
-- SELECT pg_sleep(1);
--
-- -- Update the course
-- UPDATE courses SET title = 'Updated Title' WHERE slug = 'test-course';
--
-- -- Verify updated_at changed
-- SELECT created_at, updated_at FROM courses WHERE slug = 'test-course';
-- -- Result: updated_at > created_at (trigger fired successfully)
--
-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
--
-- DROP TRIGGER IF EXISTS update_cycles_updated_at ON cycles;
-- DROP TRIGGER IF EXISTS update_campuses_updated_at ON campuses;
-- DROP TRIGGER IF EXISTS update_users_updated_at ON users;
-- DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
-- DROP TRIGGER IF EXISTS update_course_runs_updated_at ON course_runs;
-- DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
-- DROP TRIGGER IF EXISTS update_ads_templates_updated_at ON ads_templates;
-- DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
-- DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
-- DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
-- DROP TRIGGER IF EXISTS update_seo_metadata_updated_at ON seo_metadata;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- ============================================================================
