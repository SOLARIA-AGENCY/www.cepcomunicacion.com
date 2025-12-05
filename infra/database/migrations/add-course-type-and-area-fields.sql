-- =====================================================
-- Migration: Add course_type and area fields to courses table
-- =====================================================
-- This migration adds two new fields to the courses table:
-- 1. course_type: Type of course offering (privado, ocupados, etc.)
-- 2. area: Thematic area for filtering (sanitaria, tecnologia, etc.)
--
-- Date: 2025-11-10
-- =====================================================

-- Add course_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'courses'
    AND column_name = 'course_type'
  ) THEN
    ALTER TABLE courses
    ADD COLUMN course_type VARCHAR(50);

    -- Add check constraint for valid course types
    ALTER TABLE courses
    ADD CONSTRAINT courses_course_type_check
    CHECK (course_type IS NULL OR course_type IN (
      'privado',
      'ocupados',
      'desempleados',
      'teleformacion',
      'ciclo_medio',
      'ciclo_superior'
    ));

    RAISE NOTICE 'Added course_type column to courses table';
  ELSE
    RAISE NOTICE 'course_type column already exists';
  END IF;
END $$;

-- Add area column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'courses'
    AND column_name = 'area'
  ) THEN
    ALTER TABLE courses
    ADD COLUMN area VARCHAR(50);

    -- Add check constraint for valid areas
    ALTER TABLE courses
    ADD CONSTRAINT courses_area_check
    CHECK (area IS NULL OR area IN (
      'sanitaria',
      'horeca',
      'salud',
      'tecnologia',
      'audiovisual',
      'administracion',
      'marketing',
      'educacion'
    ));

    RAISE NOTICE 'Added area column to courses table';
  ELSE
    RAISE NOTICE 'area column already exists';
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_course_type ON courses(course_type);
CREATE INDEX IF NOT EXISTS idx_courses_area ON courses(area);

-- Verification
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'courses'
AND column_name IN ('course_type', 'area')
ORDER BY column_name;
