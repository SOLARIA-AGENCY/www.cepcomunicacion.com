-- ============================================================================
-- MIGRATION 006: CREATE CONTENT TABLES
-- ============================================================================
-- Description: Creates content management tables for blog and FAQs
-- Dependencies: 001_create_base_tables.sql (users)
-- Tables: blog_posts, faqs
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================

-- =========================
-- TABLE: blog_posts
-- =========================
-- Blog articles for content marketing and SEO

CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE blog_posts IS 'Blog articles for content marketing, SEO, and thought leadership';
COMMENT ON COLUMN blog_posts.slug IS 'URL-friendly unique identifier (e.g., "mejores-cursos-fp-2025")';
COMMENT ON COLUMN blog_posts.title IS 'Article title (H1)';
COMMENT ON COLUMN blog_posts.excerpt IS 'Short summary for meta description and listing pages';
COMMENT ON COLUMN blog_posts.content IS 'Full article content (supports Markdown or HTML)';
COMMENT ON COLUMN blog_posts.featured_image IS 'Hero image URL';
COMMENT ON COLUMN blog_posts.author_id IS 'Content author (FK to users table) - RESTRICT deletion if posts exist';
COMMENT ON COLUMN blog_posts.category IS 'Article category (e.g., "Noticias", "Guías", "Consejos de Carrera")';
COMMENT ON COLUMN blog_posts.tags IS 'Array of tags for filtering and SEO (e.g., ["FP", "Grado Superior", "Empleo"])';
COMMENT ON COLUMN blog_posts.status IS 'draft (unpublished), published (live), archived (hidden)';
COMMENT ON COLUMN blog_posts.published_at IS 'Publication timestamp (NULL if draft)';
COMMENT ON COLUMN blog_posts.views_count IS 'Page view counter (incremented by application)';

-- Foreign Key Behavior:
-- - ON DELETE RESTRICT for author: Prevents deletion of user with published articles

-- =========================
-- TABLE: faqs
-- =========================
-- Frequently Asked Questions for support and information

CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    order_display INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE faqs IS 'Frequently Asked Questions for student support and information';
COMMENT ON COLUMN faqs.question IS 'FAQ question (e.g., "¿Cuáles son los requisitos de admisión?")';
COMMENT ON COLUMN faqs.answer IS 'FAQ answer (supports Markdown or HTML)';
COMMENT ON COLUMN faqs.category IS 'FAQ category: general, enrollment, technical, financial, etc.';
COMMENT ON COLUMN faqs.order_display IS 'Display order within category (lower numbers first)';
COMMENT ON COLUMN faqs.is_published IS 'Visibility flag (false = hidden from public)';

-- Use Cases:
-- - Blog Posts: Content marketing, SEO organic traffic, thought leadership
-- - FAQs: Reduce support inquiries, improve user experience, SEO long-tail keywords

-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS faqs CASCADE;
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- ============================================================================
