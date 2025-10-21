-- ============================================================================
-- MIGRATION 008: CREATE SEO METADATA TABLE
-- ============================================================================
-- Description: Creates seo_metadata table for SEO optimization across entities
-- Dependencies: None (polymorphic associations to multiple tables)
-- Tables: seo_metadata
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================

-- =========================
-- TABLE: seo_metadata
-- =========================
-- Centralized SEO metadata for courses, blog posts, pages, etc.

CREATE TABLE IF NOT EXISTS seo_metadata (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id INTEGER NOT NULL,
    title TEXT,
    description TEXT,
    keywords TEXT[],
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_card TEXT DEFAULT 'summary_large_image',
    canonical_url TEXT,
    robots TEXT DEFAULT 'index,follow',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one SEO metadata record per entity
    CONSTRAINT seo_metadata_entity_unique UNIQUE (entity_type, entity_id)
);

COMMENT ON TABLE seo_metadata IS 'Centralized SEO metadata with Open Graph and Twitter Card support';
COMMENT ON COLUMN seo_metadata.entity_type IS 'Entity type: course, blog_post, page, campaign, etc.';
COMMENT ON COLUMN seo_metadata.entity_id IS 'Entity ID (e.g., course.id, blog_post.id)';
COMMENT ON COLUMN seo_metadata.title IS 'SEO title tag (<title>) - Max 60 chars recommended';
COMMENT ON COLUMN seo_metadata.description IS 'Meta description - Max 160 chars recommended';
COMMENT ON COLUMN seo_metadata.keywords IS 'Array of SEO keywords (less important for modern SEO but useful for internal search)';
COMMENT ON COLUMN seo_metadata.og_title IS 'Open Graph title (for Facebook, LinkedIn shares) - Max 95 chars';
COMMENT ON COLUMN seo_metadata.og_description IS 'Open Graph description - Max 200 chars';
COMMENT ON COLUMN seo_metadata.og_image IS 'Open Graph image URL (1200x630px recommended)';
COMMENT ON COLUMN seo_metadata.twitter_card IS 'Twitter Card type: summary, summary_large_image, app, player';
COMMENT ON COLUMN seo_metadata.canonical_url IS 'Canonical URL to prevent duplicate content issues';
COMMENT ON COLUMN seo_metadata.robots IS 'Robots meta tag: "index,follow", "noindex,nofollow", etc.';

-- Polymorphic Association Examples:
-- Course SEO: entity_type='course', entity_id=123
-- Blog Post SEO: entity_type='blog_post', entity_id=456
-- Landing Page SEO: entity_type='page', entity_id=789

-- SEO Best Practices:
-- 1. Title: 50-60 characters, include primary keyword
-- 2. Description: 150-160 characters, compelling call-to-action
-- 3. OG Image: 1200x630px for optimal social media sharing
-- 4. Keywords: Focus on long-tail keywords for vocational training
-- 5. Canonical URL: Prevent duplicate content penalties

-- Example Usage:
-- INSERT INTO seo_metadata (entity_type, entity_id, title, description, og_image)
-- VALUES (
--   'course',
--   123,
--   'FP Grado Medio en Gestión Administrativa | CEP Comunicación',
--   'Aprende administración y gestión empresarial con nuestro curso de FP Grado Medio. 2000 horas. Modalidad presencial y online.',
--   'https://cepcomunicacion.com/media/og-gestion-administrativa.jpg'
-- );

-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS seo_metadata CASCADE;
-- ============================================================================
