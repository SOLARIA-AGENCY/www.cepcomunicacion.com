-- ============================================================================
-- MIGRATION 001: CREATE BASE TABLES
-- ============================================================================
-- Description: Creates foundational tables for the CEPComunicacion platform
-- Tables: cycles, campuses, users
-- Dependencies: None (initial migration)
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================

-- =========================
-- TABLE: cycles
-- =========================
-- Educational cycles (FP Básica, Grado Medio, Grado Superior, Certificados)
-- Used to categorize courses by educational level

CREATE TABLE IF NOT EXISTS cycles (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('fp_basica', 'grado_medio', 'grado_superior', 'certificado_profesionalidad')),
    order_display INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE cycles IS 'Educational cycles for vocational training programs';
COMMENT ON COLUMN cycles.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN cycles.level IS 'Educational level: fp_basica, grado_medio, grado_superior, certificado_profesionalidad';
COMMENT ON COLUMN cycles.order_display IS 'Display order in UI (lower numbers first)';

-- =========================
-- TABLE: campuses
-- =========================
-- Physical training locations across Spain

CREATE TABLE IF NOT EXISTS campuses (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    postal_code TEXT,
    phone TEXT,
    email TEXT,
    maps_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE campuses IS 'Physical training centers and locations';
COMMENT ON COLUMN campuses.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN campuses.maps_url IS 'Google Maps URL for location';

-- =========================
-- TABLE: users
-- =========================
-- CMS users with role-based access control
-- Roles: admin, gestor, marketing, asesor, lectura

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'gestor', 'marketing', 'asesor', 'lectura')),
    avatar_url TEXT,
    phone TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    reset_password_token TEXT,
    reset_password_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE users IS 'CMS users with role-based access control';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password (never store plaintext)';
COMMENT ON COLUMN users.role IS 'Access level: admin (full), gestor (management), marketing (campaigns), asesor (sales), lectura (read-only)';
COMMENT ON COLUMN users.login_count IS 'Total number of successful logins';
COMMENT ON COLUMN users.reset_password_token IS 'Temporary token for password reset flow';

-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS campuses CASCADE;
-- DROP TABLE IF EXISTS cycles CASCADE;
-- ============================================================================
