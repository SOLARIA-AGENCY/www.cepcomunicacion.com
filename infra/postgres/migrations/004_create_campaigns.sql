-- ============================================================================
-- MIGRATION 004: CREATE CAMPAIGNS AND ADS TEMPLATES TABLES
-- ============================================================================
-- Description: Creates marketing campaign management tables
-- Dependencies: 001_create_base_tables.sql (users)
-- Tables: campaigns, ads_templates
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================

-- =========================
-- TABLE: campaigns
-- =========================
-- Marketing campaigns across multiple platforms (Meta Ads, Google Ads, Email)

CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    platform TEXT CHECK (platform IN ('meta_ads', 'google_ads', 'email', 'organic', 'referral')),
    budget DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    target_audience JSONB,
    conversion_goal TEXT,
    mailchimp_campaign_id TEXT,
    meta_campaign_id TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

COMMENT ON TABLE campaigns IS 'Marketing campaigns for lead generation and brand awareness';
COMMENT ON COLUMN campaigns.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN campaigns.platform IS 'Advertising platform: meta_ads (Facebook/Instagram), google_ads, email (Mailchimp), organic, referral';
COMMENT ON COLUMN campaigns.budget IS 'Total campaign budget in EUR';
COMMENT ON COLUMN campaigns.target_audience IS 'JSONB object with targeting criteria (age, location, interests, etc.)';
COMMENT ON COLUMN campaigns.conversion_goal IS 'Primary KPI (e.g., "lead_generation", "brand_awareness", "course_enrollment")';
COMMENT ON COLUMN campaigns.mailchimp_campaign_id IS 'External Mailchimp campaign ID for integration';
COMMENT ON COLUMN campaigns.meta_campaign_id IS 'External Meta Ads campaign ID for integration';
COMMENT ON COLUMN campaigns.status IS 'draft (unpublished), active (running), paused (temporarily stopped), completed (finished)';

-- =========================
-- TABLE: ads_templates
-- =========================
-- Ad creative templates linked to campaigns

CREATE TABLE IF NOT EXISTS ads_templates (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    format TEXT CHECK (format IN ('single_image', 'carousel', 'video', 'story')),
    headline TEXT NOT NULL,
    body_text TEXT,
    cta_text TEXT,
    media_urls TEXT[],
    link_url TEXT,
    performance_metrics JSONB,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE ads_templates IS 'Ad creative templates with performance tracking';
COMMENT ON COLUMN ads_templates.campaign_id IS 'Parent campaign (FK to campaigns table) - CASCADE on delete';
COMMENT ON COLUMN ads_templates.format IS 'Ad format: single_image, carousel (multiple images), video, story (Instagram/Facebook stories)';
COMMENT ON COLUMN ads_templates.headline IS 'Primary ad headline (max 40 chars for Meta Ads)';
COMMENT ON COLUMN ads_templates.body_text IS 'Ad description/body text';
COMMENT ON COLUMN ads_templates.cta_text IS 'Call-to-action button text (e.g., "Solicitar información", "Inscríbete ahora")';
COMMENT ON COLUMN ads_templates.media_urls IS 'Array of image/video URLs (supports carousel ads with multiple media)';
COMMENT ON COLUMN ads_templates.link_url IS 'Destination URL when ad is clicked';
COMMENT ON COLUMN ads_templates.performance_metrics IS 'JSONB object with CTR, CPC, impressions, conversions, etc.';

-- Foreign Key Behavior:
-- - ON DELETE CASCADE: When a campaign is deleted, all its ad templates are deleted

-- Performance Metrics JSONB Structure Example:
-- {
--   "impressions": 12540,
--   "clicks": 423,
--   "ctr": 3.37,
--   "cpc": 0.85,
--   "conversions": 28,
--   "conversion_rate": 6.62,
--   "spend": 359.55
-- }

-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS ads_templates CASCADE;
-- DROP TABLE IF EXISTS campaigns CASCADE;
-- ============================================================================
