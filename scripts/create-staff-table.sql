-- Create Staff Table
-- Staff members (professors and administrativos) for all campuses

CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  staff_type VARCHAR(50) NOT NULL CHECK (staff_type IN ('profesor', 'administrativo')),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  bio TEXT,
  photo INTEGER REFERENCES media(id) ON DELETE SET NULL,
  specialties TEXT[], -- Array of specialty slugs for professors
  campus INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  notes TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_type ON staff(staff_type);
CREATE INDEX IF NOT EXISTS idx_staff_campus ON staff(campus);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_is_active ON staff(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_created_by ON staff(created_by);

-- Add instructor relationship to course_runs
ALTER TABLE course_runs
ADD COLUMN IF NOT EXISTS instructor INTEGER REFERENCES staff(id) ON DELETE SET NULL;

-- Add staff_members relationship to campuses (junction table)
CREATE TABLE IF NOT EXISTS campuses_staff (
  id SERIAL PRIMARY KEY,
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(campus_id, staff_id)
);

CREATE INDEX IF NOT EXISTS idx_campuses_staff_campus ON campuses_staff(campus_id);
CREATE INDEX IF NOT EXISTS idx_campuses_staff_staff ON campuses_staff(staff_id);

-- Remove old instructor_name and instructor_bio columns from course_runs if they exist
-- (Commented out for safety - run manually if needed)
-- ALTER TABLE course_runs DROP COLUMN IF EXISTS instructor_name;
-- ALTER TABLE course_runs DROP COLUMN IF EXISTS instructor_bio;

COMMENT ON TABLE staff IS 'Staff members (professors and administrativos)';
COMMENT ON COLUMN staff.staff_type IS 'Type of staff member: profesor or administrativo';
COMMENT ON COLUMN staff.specialties IS 'Array of specialty slugs (for professors only)';
COMMENT ON COLUMN staff.campus IS 'Primary campus assignment';
COMMENT ON COLUMN staff.is_active IS 'Active status for filtering';
COMMENT ON TABLE campuses_staff IS 'Junction table for campuses <-> staff many-to-many relationship';
