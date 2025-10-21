-- ============================================================================
-- MIGRATION 003: CREATE COURSE_RUNS TABLE
-- ============================================================================
-- Description: Creates course_runs table for scheduled course instances
-- Dependencies: 001_create_base_tables.sql, 002_create_courses.sql
-- Tables: course_runs
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================

-- =========================
-- TABLE: course_runs
-- =========================
-- Course instances with specific start/end dates and enrollment management

CREATE TABLE IF NOT EXISTS course_runs (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    cycle_id INTEGER NOT NULL REFERENCES cycles(id) ON DELETE RESTRICT,
    campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    enrollment_deadline DATE,
    max_students INTEGER DEFAULT 30,
    current_students INTEGER DEFAULT 0,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Business rule constraints
    CONSTRAINT course_runs_end_after_start CHECK (end_date > start_date),
    CONSTRAINT course_runs_capacity_check CHECK (current_students <= max_students)
);

-- Comments for documentation
COMMENT ON TABLE course_runs IS 'Scheduled instances of courses with specific dates and enrollment limits';
COMMENT ON COLUMN course_runs.course_id IS 'Reference to the course catalog (FK to courses table)';
COMMENT ON COLUMN course_runs.cycle_id IS 'Denormalized reference to cycle for faster filtering';
COMMENT ON COLUMN course_runs.campus_id IS 'Campus where this instance is delivered';
COMMENT ON COLUMN course_runs.start_date IS 'Course start date';
COMMENT ON COLUMN course_runs.end_date IS 'Course completion date';
COMMENT ON COLUMN course_runs.enrollment_deadline IS 'Last date to enroll (null = open enrollment)';
COMMENT ON COLUMN course_runs.max_students IS 'Maximum enrollment capacity';
COMMENT ON COLUMN course_runs.current_students IS 'Current number of enrolled students';
COMMENT ON COLUMN course_runs.status IS 'scheduled (future), ongoing (in progress), completed (finished), cancelled';

-- Foreign Key Behavior Explanation:
-- - ON DELETE CASCADE for courses: When a course is deleted, all its runs are deleted
-- - ON DELETE RESTRICT for cycles/campuses: Prevents deletion if course runs exist

-- CHECK Constraint Explanation:
-- - course_runs_end_after_start: Ensures logical date ordering
-- - course_runs_capacity_check: Prevents overbooking (current_students cannot exceed max_students)

-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS course_runs CASCADE;
-- ============================================================================
