-- ============================================================================
-- MIGRATION 005: CREATE LEADS TABLE
-- ============================================================================
-- Description: Creates leads table with GDPR compliance and UTM tracking
-- Dependencies: 001_create_base_tables.sql, 002_create_courses.sql, 004_create_campaigns.sql
-- Tables: leads
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================

-- =========================
-- TABLE: leads
-- =========================
-- Lead submissions with GDPR compliance, campaign attribution, and CRM integration

CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'rejected', 'spam')),
    source TEXT,

    -- UTM tracking parameters for attribution
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,

    -- GDPR compliance fields (MANDATORY)
    gdpr_consent BOOLEAN NOT NULL DEFAULT false,
    gdpr_consent_date TIMESTAMP WITH TIME ZONE,
    gdpr_consent_ip INET,
    privacy_policy_accepted BOOLEAN NOT NULL DEFAULT false,

    -- Mailchimp integration
    mailchimp_subscriber_id TEXT,
    mailchimp_synced_at TIMESTAMP WITH TIME ZONE,

    -- CRM assignment
    assigned_to INTEGER REFERENCES users(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- GDPR COMPLIANCE CONSTRAINTS (CRITICAL)
    CONSTRAINT leads_gdpr_consent_required CHECK (gdpr_consent = true),
    CONSTRAINT leads_privacy_policy_required CHECK (privacy_policy_accepted = true)
);

-- Comments for documentation
COMMENT ON TABLE leads IS 'Lead submissions with GDPR compliance and marketing attribution';
COMMENT ON COLUMN leads.name IS 'Full name of the prospective student';
COMMENT ON COLUMN leads.email IS 'Contact email address';
COMMENT ON COLUMN leads.phone IS 'Contact phone number';
COMMENT ON COLUMN leads.course_id IS 'Course of interest (FK to courses table) - SET NULL on delete';
COMMENT ON COLUMN leads.campaign_id IS 'Originating campaign (FK to campaigns table) - SET NULL on delete';
COMMENT ON COLUMN leads.status IS 'new (unprocessed), contacted (first contact made), qualified (sales qualified lead), converted (enrolled), rejected (not interested), spam (invalid)';
COMMENT ON COLUMN leads.source IS 'Traffic source: organic (SEO), paid_ads (PPC), referral (partner/affiliate), direct, social';
COMMENT ON COLUMN leads.utm_source IS 'UTM source parameter (e.g., "google", "facebook")';
COMMENT ON COLUMN leads.utm_medium IS 'UTM medium parameter (e.g., "cpc", "social", "email")';
COMMENT ON COLUMN leads.utm_campaign IS 'UTM campaign parameter (e.g., "spring_2025_enrollment")';
COMMENT ON COLUMN leads.utm_content IS 'UTM content parameter (e.g., "ad_variant_a")';
COMMENT ON COLUMN leads.utm_term IS 'UTM term parameter (e.g., "fp grado medio")';
COMMENT ON COLUMN leads.gdpr_consent IS 'MUST be true - user consent for data processing (GDPR Art. 6)';
COMMENT ON COLUMN leads.gdpr_consent_date IS 'Timestamp when consent was given';
COMMENT ON COLUMN leads.gdpr_consent_ip IS 'IP address when consent was given (for audit trail)';
COMMENT ON COLUMN leads.privacy_policy_accepted IS 'MUST be true - user accepted privacy policy';
COMMENT ON COLUMN leads.mailchimp_subscriber_id IS 'Mailchimp subscriber ID for email automation';
COMMENT ON COLUMN leads.mailchimp_synced_at IS 'Last sync timestamp with Mailchimp';
COMMENT ON COLUMN leads.assigned_to IS 'Sales advisor assigned to this lead (FK to users table)';

-- Foreign Key Behavior:
-- - ON DELETE SET NULL for courses/campaigns: Preserve lead data even if source is deleted
-- - Default behavior for assigned_to: Allows reassignment even if user is deleted

-- GDPR Compliance Notes:
-- 1. Both CHECK constraints MUST pass for INSERT to succeed
-- 2. This ensures legal compliance with GDPR Article 6 (lawful basis for processing)
-- 3. gdpr_consent_ip provides audit trail for data protection authorities
-- 4. All lead data can be exported/erased on request (GDPR Article 15, 17)

-- Example UTM Attribution:
-- Source: https://cepcomunicacion.com/courses/fp-grado-medio?utm_source=facebook&utm_medium=cpc&utm_campaign=spring_2025&utm_content=carousel_ad&utm_term=formacion_profesional
-- Will populate: utm_source=facebook, utm_medium=cpc, utm_campaign=spring_2025, utm_content=carousel_ad, utm_term=formacion_profesional

-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS leads CASCADE;
-- ============================================================================
