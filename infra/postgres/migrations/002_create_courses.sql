-- ============================================================================
-- MIGRATION 002: CREATE COURSES TABLE
-- ============================================================================
-- Description: Creates the courses table for course catalog management
-- Dependencies: 001_create_base_tables.sql (cycles, campuses, users)
-- Tables: courses
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================

-- =========================
-- TABLE: courses
-- =========================
-- Course catalog with SEO optimization and multi-campus support

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_hours INTEGER NOT NULL,
    modality TEXT NOT NULL CHECK (modality IN ('presencial', 'online', 'hibrido')),
    price DECIMAL(10,2),
    cycle_id INTEGER REFERENCES cycles(id) ON DELETE RESTRICT,
    campus_id INTEGER REFERENCES campuses(id) ON DELETE RESTRICT,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Comments for documentation
COMMENT ON TABLE courses IS 'Course catalog with pricing, modality, and SEO metadata';
COMMENT ON COLUMN courses.slug IS 'URL-friendly unique identifier (e.g., "fp-grado-medio-administracion")';
COMMENT ON COLUMN courses.duration_hours IS 'Total course duration in hours';
COMMENT ON COLUMN courses.modality IS 'Delivery method: presencial (in-person), online, hibrido (blended)';
COMMENT ON COLUMN courses.price IS 'Course price in EUR (null if price varies or free)';
COMMENT ON COLUMN courses.cycle_id IS 'Educational cycle (FK to cycles table)';
COMMENT ON COLUMN courses.campus_id IS 'Primary campus location (FK to campuses table)';
COMMENT ON COLUMN courses.featured IS 'Flag for homepage/featured course listings';
COMMENT ON COLUMN courses.status IS 'Publication status: draft (unpublished), published (live), archived (no longer offered)';
COMMENT ON COLUMN courses.seo_keywords IS 'Array of keywords for SEO optimization';
COMMENT ON COLUMN courses.created_by IS 'User who created the course (FK to users table)';
COMMENT ON COLUMN courses.updated_by IS 'User who last updated the course (FK to users table)';

-- Foreign Key Constraints Explanation:
-- - ON DELETE RESTRICT for cycles: Prevents deletion of cycle if courses exist
-- - ON DELETE RESTRICT for campuses: Prevents deletion of campus if courses exist
-- - Default behavior for users (created_by/updated_by): Allows tracking even if user is deleted

-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS courses CASCADE;
-- ============================================================================
