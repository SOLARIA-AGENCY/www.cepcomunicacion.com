-- ============================================================================
-- MIGRATION 007: CREATE MEDIA TABLE
-- ============================================================================
-- Description: Creates media table for file uploads (images, PDFs, videos)
-- Dependencies: 001_create_base_tables.sql (users)
-- Tables: media
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================

-- =========================
-- TABLE: media
-- =========================
-- File uploads with metadata and polymorphic associations

CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    storage_path TEXT NOT NULL,
    storage_bucket TEXT DEFAULT 'cepcomunicacion',
    uploaded_by INTEGER REFERENCES users(id),
    entity_type TEXT,
    entity_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE media IS 'File upload manager with metadata and storage tracking';
COMMENT ON COLUMN media.filename IS 'Generated unique filename (e.g., "a3b5c7d9-image.jpg")';
COMMENT ON COLUMN media.original_filename IS 'Original filename from upload (e.g., "photo.jpg")';
COMMENT ON COLUMN media.mime_type IS 'MIME type (e.g., "image/jpeg", "application/pdf", "video/mp4")';
COMMENT ON COLUMN media.size_bytes IS 'File size in bytes (BIGINT supports files up to ~9 exabytes)';
COMMENT ON COLUMN media.width IS 'Image/video width in pixels (NULL for non-visual files)';
COMMENT ON COLUMN media.height IS 'Image/video height in pixels (NULL for non-visual files)';
COMMENT ON COLUMN media.alt_text IS 'Alternative text for accessibility (WCAG compliance)';
COMMENT ON COLUMN media.storage_path IS 'Full path in storage system (e.g., "/media/2025/10/a3b5c7d9-image.jpg")';
COMMENT ON COLUMN media.storage_bucket IS 'MinIO/S3 bucket name (default: "cepcomunicacion")';
COMMENT ON COLUMN media.uploaded_by IS 'User who uploaded the file (FK to users table)';
COMMENT ON COLUMN media.entity_type IS 'Polymorphic association type (e.g., "course", "blog_post", "campaign")';
COMMENT ON COLUMN media.entity_id IS 'Polymorphic association ID (e.g., course.id, blog_post.id)';

-- Polymorphic Association Explanation:
-- The (entity_type, entity_id) pair creates a flexible many-to-one relationship.
-- Examples:
--   - Course featured image: entity_type='course', entity_id=123
--   - Blog post images: entity_type='blog_post', entity_id=456
--   - Campaign ad creatives: entity_type='campaign', entity_id=789

-- Use Cases:
-- 1. Course images/PDFs (syllabus, brochures)
-- 2. Blog post featured images and inline images
-- 3. User avatars
-- 4. Campaign ad creatives
-- 5. General media library

-- Storage Strategy:
-- - Local development: /var/www/cepcomunicacion/storage/media
-- - Production: MinIO (S3-compatible) on storage_bucket='cepcomunicacion'

-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS media CASCADE;
-- ============================================================================
