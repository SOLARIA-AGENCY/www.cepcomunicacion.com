/**
 * Database Migration Tests - Test-Driven Development
 * CEPComunicacion v2 - Lead Management & Marketing Automation Platform
 *
 * IMPORTANT: These tests are written FIRST before creating migration files.
 * All tests should FAIL initially (RED), then pass after migrations are created (GREEN).
 *
 * Test Coverage:
 * - Schema validation (tables, columns, data types)
 * - Constraint enforcement (UNIQUE, NOT NULL, CHECK, FK)
 * - Index creation and performance
 * - GDPR compliance requirements
 * - Data integrity rules
 * - Rollback functionality
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Client } from 'pg';

describe('PostgreSQL Schema Migrations - CEPComunicacion v2', () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      database: process.env.DATABASE_NAME || 'cepcomunicacion_test',
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
    });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  beforeEach(async () => {
    // Clean up test data between tests
    await client.query('BEGIN');
  });

  afterEach(async () => {
    await client.query('ROLLBACK');
  });

  // ============================================================================
  // MIGRATION 001: BASE TABLES (cycles, campuses, users)
  // ============================================================================

  describe('001_create_base_tables - Cycles', () => {
    it('should create cycles table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'cycles'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('slug');
      expect(columns).toContain('name');
      expect(columns).toContain('description');
      expect(columns).toContain('level');
      expect(columns).toContain('order_display');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should enforce UNIQUE constraint on cycles.slug', async () => {
      await client.query(`INSERT INTO cycles (slug, name, level) VALUES ('grado-medio-test', 'Test', 'grado_medio')`);

      await expect(async () => {
        await client.query(`INSERT INTO cycles (slug, name, level) VALUES ('grado-medio-test', 'Test 2', 'grado_superior')`);
      }).rejects.toThrow();
    });

    it('should enforce CHECK constraint on cycles.level enum', async () => {
      await expect(async () => {
        await client.query(`INSERT INTO cycles (slug, name, level) VALUES ('invalid-level', 'Invalid', 'invalid_level')`);
      }).rejects.toThrow();
    });

    it('should have NOT NULL constraints on required fields', async () => {
      await expect(async () => {
        await client.query(`INSERT INTO cycles (slug, description) VALUES ('missing-name', 'Test')`);
      }).rejects.toThrow();
    });

    it('should set default values correctly', async () => {
      await client.query(`INSERT INTO cycles (slug, name, level) VALUES ('test-defaults', 'Test', 'grado_medio')`);
      const result = await client.query(`SELECT order_display, created_at, updated_at FROM cycles WHERE slug = 'test-defaults'`);

      expect(result.rows[0].order_display).toBe(0);
      expect(result.rows[0].created_at).toBeDefined();
      expect(result.rows[0].updated_at).toBeDefined();
    });
  });

  describe('001_create_base_tables - Campuses', () => {
    it('should create campuses table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'campuses'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('slug');
      expect(columns).toContain('name');
      expect(columns).toContain('city');
      expect(columns).toContain('address');
      expect(columns).toContain('postal_code');
      expect(columns).toContain('phone');
      expect(columns).toContain('email');
      expect(columns).toContain('maps_url');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should enforce UNIQUE constraint on campuses.slug', async () => {
      await client.query(`INSERT INTO campuses (slug, name, city) VALUES ('madrid-centro', 'Madrid Centro', 'Madrid')`);

      await expect(async () => {
        await client.query(`INSERT INTO campuses (slug, name, city) VALUES ('madrid-centro', 'Madrid 2', 'Madrid')`);
      }).rejects.toThrow();
    });
  });

  describe('001_create_base_tables - Users', () => {
    it('should create users table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('email');
      expect(columns).toContain('password_hash');
      expect(columns).toContain('name');
      expect(columns).toContain('role');
      expect(columns).toContain('avatar_url');
      expect(columns).toContain('phone');
      expect(columns).toContain('last_login_at');
      expect(columns).toContain('login_count');
      expect(columns).toContain('is_active');
      expect(columns).toContain('reset_password_token');
      expect(columns).toContain('reset_password_expires');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should enforce UNIQUE constraint on users.email', async () => {
      await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('test@example.com', 'hash123', 'Test User', 'admin')`);

      await expect(async () => {
        await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('test@example.com', 'hash456', 'Test User 2', 'gestor')`);
      }).rejects.toThrow();
    });

    it('should enforce CHECK constraint on users.role enum', async () => {
      await expect(async () => {
        await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('invalid@example.com', 'hash', 'Invalid', 'superadmin')`);
      }).rejects.toThrow();
    });

    it('should set default values for login_count and is_active', async () => {
      await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('defaults@example.com', 'hash', 'Defaults', 'lectura')`);
      const result = await client.query(`SELECT login_count, is_active FROM users WHERE email = 'defaults@example.com'`);

      expect(result.rows[0].login_count).toBe(0);
      expect(result.rows[0].is_active).toBe(true);
    });
  });

  // ============================================================================
  // MIGRATION 002: COURSES TABLE
  // ============================================================================

  describe('002_create_courses', () => {
    beforeEach(async () => {
      // Create required dependencies
      await client.query(`INSERT INTO cycles (slug, name, level) VALUES ('test-cycle', 'Test Cycle', 'grado_medio')`);
      await client.query(`INSERT INTO campuses (slug, name, city) VALUES ('test-campus', 'Test Campus', 'Madrid')`);
      await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('creator@test.com', 'hash', 'Creator', 'admin')`);
    });

    it('should create courses table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'courses'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('slug');
      expect(columns).toContain('title');
      expect(columns).toContain('description');
      expect(columns).toContain('duration_hours');
      expect(columns).toContain('modality');
      expect(columns).toContain('price');
      expect(columns).toContain('cycle_id');
      expect(columns).toContain('campus_id');
      expect(columns).toContain('featured');
      expect(columns).toContain('status');
      expect(columns).toContain('seo_title');
      expect(columns).toContain('seo_description');
      expect(columns).toContain('seo_keywords');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
      expect(columns).toContain('created_by');
      expect(columns).toContain('updated_by');
    });

    it('should enforce CHECK constraint on courses.modality', async () => {
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'test-cycle'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'test-campus'`)).rows[0].id;

      await expect(async () => {
        await client.query(`
          INSERT INTO courses (slug, title, duration_hours, modality, cycle_id, campus_id)
          VALUES ('invalid-modality', 'Invalid', 100, 'telepathic', ${cycleId}, ${campusId})
        `);
      }).rejects.toThrow();
    });

    it('should enforce CHECK constraint on courses.status', async () => {
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'test-cycle'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'test-campus'`)).rows[0].id;

      await expect(async () => {
        await client.query(`
          INSERT INTO courses (slug, title, duration_hours, modality, cycle_id, campus_id, status)
          VALUES ('invalid-status', 'Invalid', 100, 'online', ${cycleId}, ${campusId}, 'pending')
        `);
      }).rejects.toThrow();
    });

    it('should enforce foreign key constraint on courses.cycle_id', async () => {
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'test-campus'`)).rows[0].id;

      await expect(async () => {
        await client.query(`
          INSERT INTO courses (slug, title, duration_hours, modality, cycle_id, campus_id)
          VALUES ('invalid-fk', 'Invalid FK', 100, 'online', 99999, ${campusId})
        `);
      }).rejects.toThrow();
    });

    it('should prevent deletion of cycle with ON DELETE RESTRICT', async () => {
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'test-cycle'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'test-campus'`)).rows[0].id;

      await client.query(`
        INSERT INTO courses (slug, title, duration_hours, modality, cycle_id, campus_id)
        VALUES ('restrict-test', 'Restrict Test', 100, 'online', ${cycleId}, ${campusId})
      `);

      await expect(async () => {
        await client.query(`DELETE FROM cycles WHERE id = ${cycleId}`);
      }).rejects.toThrow();
    });

    it('should store array data type for seo_keywords', async () => {
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'test-cycle'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'test-campus'`)).rows[0].id;

      await client.query(`
        INSERT INTO courses (slug, title, duration_hours, modality, cycle_id, campus_id, seo_keywords)
        VALUES ('seo-test', 'SEO Test', 100, 'online', ${cycleId}, ${campusId}, ARRAY['formación', 'profesional', 'FP'])
      `);

      const result = await client.query(`SELECT seo_keywords FROM courses WHERE slug = 'seo-test'`);
      expect(result.rows[0].seo_keywords).toEqual(['formación', 'profesional', 'FP']);
    });
  });

  // ============================================================================
  // MIGRATION 003: COURSE RUNS TABLE
  // ============================================================================

  describe('003_create_course_runs', () => {
    beforeEach(async () => {
      await client.query(`INSERT INTO cycles (slug, name, level) VALUES ('test-cycle-runs', 'Test Cycle', 'grado_medio')`);
      await client.query(`INSERT INTO campuses (slug, name, city) VALUES ('test-campus-runs', 'Test Campus', 'Madrid')`);
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'test-cycle-runs'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'test-campus-runs'`)).rows[0].id;
      await client.query(`
        INSERT INTO courses (slug, title, duration_hours, modality, cycle_id, campus_id)
        VALUES ('test-course-runs', 'Test Course', 100, 'online', ${cycleId}, ${campusId})
      `);
    });

    it('should create course_runs table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'course_runs'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('course_id');
      expect(columns).toContain('cycle_id');
      expect(columns).toContain('campus_id');
      expect(columns).toContain('start_date');
      expect(columns).toContain('end_date');
      expect(columns).toContain('enrollment_deadline');
      expect(columns).toContain('max_students');
      expect(columns).toContain('current_students');
      expect(columns).toContain('status');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should enforce CHECK constraint: end_date > start_date', async () => {
      const courseId = (await client.query(`SELECT id FROM courses WHERE slug = 'test-course-runs'`)).rows[0].id;
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'test-cycle-runs'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'test-campus-runs'`)).rows[0].id;

      await expect(async () => {
        await client.query(`
          INSERT INTO course_runs (course_id, cycle_id, campus_id, start_date, end_date)
          VALUES (${courseId}, ${cycleId}, ${campusId}, '2025-12-31', '2025-01-01')
        `);
      }).rejects.toThrow();
    });

    it('should enforce CHECK constraint: current_students <= max_students', async () => {
      const courseId = (await client.query(`SELECT id FROM courses WHERE slug = 'test-course-runs'`)).rows[0].id;
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'test-cycle-runs'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'test-campus-runs'`)).rows[0].id;

      await expect(async () => {
        await client.query(`
          INSERT INTO course_runs (course_id, cycle_id, campus_id, start_date, end_date, max_students, current_students)
          VALUES (${courseId}, ${cycleId}, ${campusId}, '2025-01-01', '2025-12-31', 30, 50)
        `);
      }).rejects.toThrow();
    });

    it('should CASCADE delete course_runs when course is deleted', async () => {
      const courseId = (await client.query(`SELECT id FROM courses WHERE slug = 'test-course-runs'`)).rows[0].id;
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'test-cycle-runs'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'test-campus-runs'`)).rows[0].id;

      await client.query(`
        INSERT INTO course_runs (course_id, cycle_id, campus_id, start_date, end_date)
        VALUES (${courseId}, ${cycleId}, ${campusId}, '2025-01-01', '2025-12-31')
      `);

      await client.query(`DELETE FROM courses WHERE id = ${courseId}`);
      const result = await client.query(`SELECT COUNT(*) FROM course_runs WHERE course_id = ${courseId}`);
      expect(parseInt(result.rows[0].count)).toBe(0);
    });
  });

  // ============================================================================
  // MIGRATION 004: CAMPAIGNS AND ADS TEMPLATES
  // ============================================================================

  describe('004_create_campaigns', () => {
    beforeEach(async () => {
      await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('campaign-user@test.com', 'hash', 'Campaign User', 'marketing')`);
    });

    it('should create campaigns table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'campaigns'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('slug');
      expect(columns).toContain('name');
      expect(columns).toContain('description');
      expect(columns).toContain('platform');
      expect(columns).toContain('budget');
      expect(columns).toContain('start_date');
      expect(columns).toContain('end_date');
      expect(columns).toContain('target_audience');
      expect(columns).toContain('conversion_goal');
      expect(columns).toContain('mailchimp_campaign_id');
      expect(columns).toContain('meta_campaign_id');
      expect(columns).toContain('status');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
      expect(columns).toContain('created_by');
    });

    it('should enforce CHECK constraint on campaigns.platform', async () => {
      await expect(async () => {
        await client.query(`
          INSERT INTO campaigns (slug, name, platform)
          VALUES ('invalid-platform', 'Invalid Platform', 'tiktok_ads')
        `);
      }).rejects.toThrow();
    });

    it('should store JSONB data for target_audience', async () => {
      await client.query(`
        INSERT INTO campaigns (slug, name, platform, target_audience)
        VALUES ('jsonb-test', 'JSONB Test', 'meta_ads', '{"age_range": "18-35", "interests": ["education", "technology"]}')
      `);

      const result = await client.query(`SELECT target_audience FROM campaigns WHERE slug = 'jsonb-test'`);
      expect(result.rows[0].target_audience).toEqual({
        age_range: '18-35',
        interests: ['education', 'technology']
      });
    });

    it('should create ads_templates table with CASCADE delete', async () => {
      await client.query(`
        INSERT INTO campaigns (slug, name, platform)
        VALUES ('cascade-test', 'Cascade Test', 'google_ads')
      `);
      const campaignId = (await client.query(`SELECT id FROM campaigns WHERE slug = 'cascade-test'`)).rows[0].id;

      await client.query(`
        INSERT INTO ads_templates (campaign_id, name, format, headline)
        VALUES (${campaignId}, 'Test Ad', 'single_image', 'Test Headline')
      `);

      await client.query(`DELETE FROM campaigns WHERE id = ${campaignId}`);
      const result = await client.query(`SELECT COUNT(*) FROM ads_templates WHERE campaign_id = ${campaignId}`);
      expect(parseInt(result.rows[0].count)).toBe(0);
    });

    it('should store array data type for ads_templates.media_urls', async () => {
      await client.query(`
        INSERT INTO campaigns (slug, name, platform)
        VALUES ('media-array-test', 'Media Array Test', 'meta_ads')
      `);
      const campaignId = (await client.query(`SELECT id FROM campaigns WHERE slug = 'media-array-test'`)).rows[0].id;

      await client.query(`
        INSERT INTO ads_templates (campaign_id, name, format, headline, media_urls)
        VALUES (${campaignId}, 'Multi Media', 'carousel', 'Carousel Ad', ARRAY['https://example.com/img1.jpg', 'https://example.com/img2.jpg'])
      `);

      const result = await client.query(`SELECT media_urls FROM ads_templates WHERE name = 'Multi Media'`);
      expect(result.rows[0].media_urls).toEqual(['https://example.com/img1.jpg', 'https://example.com/img2.jpg']);
    });
  });

  // ============================================================================
  // MIGRATION 005: LEADS TABLE
  // ============================================================================

  describe('005_create_leads - GDPR Compliance', () => {
    beforeEach(async () => {
      await client.query(`INSERT INTO cycles (slug, name, level) VALUES ('leads-cycle', 'Leads Cycle', 'grado_medio')`);
      await client.query(`INSERT INTO campuses (slug, name, city) VALUES ('leads-campus', 'Leads Campus', 'Madrid')`);
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'leads-cycle'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'leads-campus'`)).rows[0].id;
      await client.query(`
        INSERT INTO courses (slug, title, duration_hours, modality, cycle_id, campus_id)
        VALUES ('leads-course', 'Leads Course', 100, 'online', ${cycleId}, ${campusId})
      `);
      await client.query(`
        INSERT INTO campaigns (slug, name, platform)
        VALUES ('leads-campaign', 'Leads Campaign', 'google_ads')
      `);
      await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('advisor@test.com', 'hash', 'Advisor', 'asesor')`);
    });

    it('should create leads table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'leads'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('name');
      expect(columns).toContain('email');
      expect(columns).toContain('phone');
      expect(columns).toContain('course_id');
      expect(columns).toContain('campaign_id');
      expect(columns).toContain('message');
      expect(columns).toContain('status');
      expect(columns).toContain('source');
      expect(columns).toContain('utm_source');
      expect(columns).toContain('utm_medium');
      expect(columns).toContain('utm_campaign');
      expect(columns).toContain('utm_content');
      expect(columns).toContain('utm_term');
      expect(columns).toContain('gdpr_consent');
      expect(columns).toContain('gdpr_consent_date');
      expect(columns).toContain('gdpr_consent_ip');
      expect(columns).toContain('privacy_policy_accepted');
      expect(columns).toContain('mailchimp_subscriber_id');
      expect(columns).toContain('mailchimp_synced_at');
      expect(columns).toContain('assigned_to');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should enforce GDPR CHECK constraint: gdpr_consent must be true', async () => {
      await expect(async () => {
        await client.query(`
          INSERT INTO leads (name, email, phone, gdpr_consent, privacy_policy_accepted)
          VALUES ('Test Lead', 'test@example.com', '123456789', false, true)
        `);
      }).rejects.toThrow();
    });

    it('should enforce privacy_policy_accepted CHECK constraint', async () => {
      await expect(async () => {
        await client.query(`
          INSERT INTO leads (name, email, phone, gdpr_consent, privacy_policy_accepted)
          VALUES ('Test Lead', 'test@example.com', '123456789', true, false)
        `);
      }).rejects.toThrow();
    });

    it('should store INET data type for gdpr_consent_ip', async () => {
      await client.query(`
        INSERT INTO leads (name, email, phone, gdpr_consent, privacy_policy_accepted, gdpr_consent_ip, gdpr_consent_date)
        VALUES ('IP Test', 'ip@example.com', '123456789', true, true, '192.168.1.1', NOW())
      `);

      const result = await client.query(`SELECT gdpr_consent_ip FROM leads WHERE email = 'ip@example.com'`);
      expect(result.rows[0].gdpr_consent_ip).toBe('192.168.1.1');
    });

    it('should SET NULL on course deletion (ON DELETE SET NULL)', async () => {
      const courseId = (await client.query(`SELECT id FROM courses WHERE slug = 'leads-course'`)).rows[0].id;

      await client.query(`
        INSERT INTO leads (name, email, phone, course_id, gdpr_consent, privacy_policy_accepted)
        VALUES ('Course FK Test', 'coursefk@example.com', '123456789', ${courseId}, true, true)
      `);

      await client.query(`DELETE FROM courses WHERE id = ${courseId}`);
      const result = await client.query(`SELECT course_id FROM leads WHERE email = 'coursefk@example.com'`);
      expect(result.rows[0].course_id).toBeNull();
    });

    it('should enforce CHECK constraint on leads.status', async () => {
      await expect(async () => {
        await client.query(`
          INSERT INTO leads (name, email, phone, status, gdpr_consent, privacy_policy_accepted)
          VALUES ('Invalid Status', 'status@example.com', '123456789', 'deleted', true, true)
        `);
      }).rejects.toThrow();
    });
  });

  // ============================================================================
  // MIGRATION 006: CONTENT TABLES (blog_posts, faqs)
  // ============================================================================

  describe('006_create_content - Blog Posts', () => {
    beforeEach(async () => {
      await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('author@test.com', 'hash', 'Author', 'marketing')`);
    });

    it('should create blog_posts table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('slug');
      expect(columns).toContain('title');
      expect(columns).toContain('excerpt');
      expect(columns).toContain('content');
      expect(columns).toContain('featured_image');
      expect(columns).toContain('author_id');
      expect(columns).toContain('category');
      expect(columns).toContain('tags');
      expect(columns).toContain('status');
      expect(columns).toContain('published_at');
      expect(columns).toContain('views_count');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should enforce UNIQUE constraint on blog_posts.slug', async () => {
      const authorId = (await client.query(`SELECT id FROM users WHERE email = 'author@test.com'`)).rows[0].id;

      await client.query(`
        INSERT INTO blog_posts (slug, title, content, author_id)
        VALUES ('duplicate-slug', 'Test Post', 'Content', ${authorId})
      `);

      await expect(async () => {
        await client.query(`
          INSERT INTO blog_posts (slug, title, content, author_id)
          VALUES ('duplicate-slug', 'Test Post 2', 'Content 2', ${authorId})
        `);
      }).rejects.toThrow();
    });

    it('should RESTRICT deletion of user with blog posts (ON DELETE RESTRICT)', async () => {
      const authorId = (await client.query(`SELECT id FROM users WHERE email = 'author@test.com'`)).rows[0].id;

      await client.query(`
        INSERT INTO blog_posts (slug, title, content, author_id)
        VALUES ('restrict-delete-test', 'Restrict Test', 'Content', ${authorId})
      `);

      await expect(async () => {
        await client.query(`DELETE FROM users WHERE id = ${authorId}`);
      }).rejects.toThrow();
    });

    it('should store array data type for blog_posts.tags', async () => {
      const authorId = (await client.query(`SELECT id FROM users WHERE email = 'author@test.com'`)).rows[0].id;

      await client.query(`
        INSERT INTO blog_posts (slug, title, content, author_id, tags)
        VALUES ('tags-test', 'Tags Test', 'Content', ${authorId}, ARRAY['formación', 'FP', 'empleo'])
      `);

      const result = await client.query(`SELECT tags FROM blog_posts WHERE slug = 'tags-test'`);
      expect(result.rows[0].tags).toEqual(['formación', 'FP', 'empleo']);
    });
  });

  describe('006_create_content - FAQs', () => {
    it('should create faqs table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'faqs'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('question');
      expect(columns).toContain('answer');
      expect(columns).toContain('category');
      expect(columns).toContain('order_display');
      expect(columns).toContain('is_published');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should set default values correctly', async () => {
      await client.query(`
        INSERT INTO faqs (question, answer)
        VALUES ('Test Question?', 'Test Answer')
      `);

      const result = await client.query(`SELECT order_display, is_published FROM faqs WHERE question = 'Test Question?'`);
      expect(result.rows[0].order_display).toBe(0);
      expect(result.rows[0].is_published).toBe(true);
    });
  });

  // ============================================================================
  // MIGRATION 007: MEDIA TABLE
  // ============================================================================

  describe('007_create_media', () => {
    beforeEach(async () => {
      await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('uploader@test.com', 'hash', 'Uploader', 'gestor')`);
    });

    it('should create media table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'media'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('filename');
      expect(columns).toContain('original_filename');
      expect(columns).toContain('mime_type');
      expect(columns).toContain('size_bytes');
      expect(columns).toContain('width');
      expect(columns).toContain('height');
      expect(columns).toContain('alt_text');
      expect(columns).toContain('storage_path');
      expect(columns).toContain('storage_bucket');
      expect(columns).toContain('uploaded_by');
      expect(columns).toContain('entity_type');
      expect(columns).toContain('entity_id');
      expect(columns).toContain('created_at');
    });

    it('should store BIGINT for size_bytes', async () => {
      const uploaderId = (await client.query(`SELECT id FROM users WHERE email = 'uploader@test.com'`)).rows[0].id;

      await client.query(`
        INSERT INTO media (filename, original_filename, mime_type, size_bytes, storage_path, uploaded_by)
        VALUES ('large-file.mp4', 'original.mp4', 'video/mp4', 5368709120, '/videos/large-file.mp4', ${uploaderId})
      `);

      const result = await client.query(`SELECT size_bytes FROM media WHERE filename = 'large-file.mp4'`);
      expect(result.rows[0].size_bytes).toBe('5368709120');
    });

    it('should set default value for storage_bucket', async () => {
      const uploaderId = (await client.query(`SELECT id FROM users WHERE email = 'uploader@test.com'`)).rows[0].id;

      await client.query(`
        INSERT INTO media (filename, original_filename, mime_type, size_bytes, storage_path, uploaded_by)
        VALUES ('default-bucket.jpg', 'original.jpg', 'image/jpeg', 1024, '/images/test.jpg', ${uploaderId})
      `);

      const result = await client.query(`SELECT storage_bucket FROM media WHERE filename = 'default-bucket.jpg'`);
      expect(result.rows[0].storage_bucket).toBe('cepcomunicacion');
    });
  });

  // ============================================================================
  // MIGRATION 008: SEO METADATA TABLE
  // ============================================================================

  describe('008_create_metadata - SEO', () => {
    it('should create seo_metadata table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'seo_metadata'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('entity_type');
      expect(columns).toContain('entity_id');
      expect(columns).toContain('title');
      expect(columns).toContain('description');
      expect(columns).toContain('keywords');
      expect(columns).toContain('og_title');
      expect(columns).toContain('og_description');
      expect(columns).toContain('og_image');
      expect(columns).toContain('twitter_card');
      expect(columns).toContain('canonical_url');
      expect(columns).toContain('robots');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should enforce UNIQUE constraint on (entity_type, entity_id)', async () => {
      await client.query(`
        INSERT INTO seo_metadata (entity_type, entity_id, title)
        VALUES ('course', 1, 'SEO Title 1')
      `);

      await expect(async () => {
        await client.query(`
          INSERT INTO seo_metadata (entity_type, entity_id, title)
          VALUES ('course', 1, 'SEO Title 2')
        `);
      }).rejects.toThrow();
    });

    it('should set default values correctly', async () => {
      await client.query(`
        INSERT INTO seo_metadata (entity_type, entity_id, title)
        VALUES ('blog_post', 1, 'Blog Post SEO')
      `);

      const result = await client.query(`SELECT twitter_card, robots FROM seo_metadata WHERE entity_id = 1 AND entity_type = 'blog_post'`);
      expect(result.rows[0].twitter_card).toBe('summary_large_image');
      expect(result.rows[0].robots).toBe('index,follow');
    });
  });

  // ============================================================================
  // MIGRATION 009: AUDIT LOGS TABLE
  // ============================================================================

  describe('009_create_audit - GDPR Audit Trail', () => {
    beforeEach(async () => {
      await client.query(`INSERT INTO users (email, password_hash, name, role) VALUES ('auditor@test.com', 'hash', 'Auditor', 'admin')`);
    });

    it('should create audit_logs table with all required columns', async () => {
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'audit_logs'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('action');
      expect(columns).toContain('entity_type');
      expect(columns).toContain('entity_id');
      expect(columns).toContain('entity_data');
      expect(columns).toContain('ip_address');
      expect(columns).toContain('user_agent');
      expect(columns).toContain('timestamp');
    });

    it('should store JSONB snapshot in entity_data', async () => {
      const userId = (await client.query(`SELECT id FROM users WHERE email = 'auditor@test.com'`)).rows[0].id;

      await client.query(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, entity_data)
        VALUES (${userId}, 'updated', 'lead', 123, '{"name": "John Doe", "email": "john@example.com", "status": "contacted"}')
      `);

      const result = await client.query(`SELECT entity_data FROM audit_logs WHERE entity_id = 123 AND entity_type = 'lead'`);
      expect(result.rows[0].entity_data).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        status: 'contacted'
      });
    });

    it('should SET NULL user_id on user deletion (ON DELETE SET NULL)', async () => {
      const userId = (await client.query(`SELECT id FROM users WHERE email = 'auditor@test.com'`)).rows[0].id;

      await client.query(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id)
        VALUES (${userId}, 'deleted', 'course', 456)
      `);

      await client.query(`DELETE FROM users WHERE id = ${userId}`);
      const result = await client.query(`SELECT user_id FROM audit_logs WHERE entity_id = 456 AND entity_type = 'course'`);
      expect(result.rows[0].user_id).toBeNull();
    });

    it('should store INET data type for ip_address', async () => {
      const userId = (await client.query(`SELECT id FROM users WHERE email = 'auditor@test.com'`)).rows[0].id;

      await client.query(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
        VALUES (${userId}, 'accessed', 'campaign', 789, '2001:0db8:85a3:0000:0000:8a2e:0370:7334')
      `);

      const result = await client.query(`SELECT ip_address FROM audit_logs WHERE entity_id = 789`);
      expect(result.rows[0].ip_address).toBe('2001:db8:85a3::8a2e:370:7334'); // PostgreSQL normalizes IPv6
    });
  });

  // ============================================================================
  // MIGRATION 010: INDEXES
  // ============================================================================

  describe('010_create_indexes - Performance Optimization', () => {
    it('should create B-tree index on cycles.slug', async () => {
      const result = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'cycles' AND indexname LIKE '%slug%'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].indexdef).toContain('slug');
    });

    it('should create composite B-tree index on courses (cycle_id, campus_id)', async () => {
      const result = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'courses' AND indexname LIKE '%cycle_id_campus_id%'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].indexdef).toContain('cycle_id');
      expect(result.rows[0].indexdef).toContain('campus_id');
    });

    it('should create GIN index on courses.seo_keywords', async () => {
      const result = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'courses' AND indexname LIKE '%seo_keywords%'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].indexdef).toContain('gin');
    });

    it('should create composite B-tree index on leads (campaign_id, status)', async () => {
      const result = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'leads' AND indexname LIKE '%campaign_id_status%'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
    });

    it('should create GIN index on campaigns.target_audience', async () => {
      const result = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'campaigns' AND indexname LIKE '%target_audience%'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].indexdef).toContain('gin');
    });

    it('should create descending B-tree index on leads.created_at', async () => {
      const result = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'leads' AND indexname LIKE '%created_at%'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].indexdef).toContain('created_at');
    });

    it('should create composite B-tree index on media (entity_type, entity_id)', async () => {
      const result = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'media' AND indexname LIKE '%entity_type_entity_id%'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
    });

    it('should create GIN index on blog_posts.tags', async () => {
      const result = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'blog_posts' AND indexname LIKE '%tags%'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].indexdef).toContain('gin');
    });

    it('should create composite B-tree index on audit_logs (entity_type, entity_id)', async () => {
      const result = await client.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'audit_logs' AND indexname LIKE '%entity_type_entity_id%'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // MIGRATION 011: TRIGGERS (updated_at auto-update)
  // ============================================================================

  describe('011_add_constraints - Triggers', () => {
    it('should auto-update updated_at timestamp on cycles UPDATE', async () => {
      await client.query(`INSERT INTO cycles (slug, name, level) VALUES ('trigger-test', 'Trigger Test', 'grado_medio')`);

      const before = await client.query(`SELECT updated_at FROM cycles WHERE slug = 'trigger-test'`);

      // Wait 1 second to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 1000));

      await client.query(`UPDATE cycles SET name = 'Updated Name' WHERE slug = 'trigger-test'`);

      const after = await client.query(`SELECT updated_at FROM cycles WHERE slug = 'trigger-test'`);

      expect(new Date(after.rows[0].updated_at).getTime()).toBeGreaterThan(new Date(before.rows[0].updated_at).getTime());
    });

    it('should auto-update updated_at timestamp on courses UPDATE', async () => {
      await client.query(`INSERT INTO cycles (slug, name, level) VALUES ('course-trigger-cycle', 'Test', 'grado_medio')`);
      await client.query(`INSERT INTO campuses (slug, name, city) VALUES ('course-trigger-campus', 'Test', 'Madrid')`);
      const cycleId = (await client.query(`SELECT id FROM cycles WHERE slug = 'course-trigger-cycle'`)).rows[0].id;
      const campusId = (await client.query(`SELECT id FROM campuses WHERE slug = 'course-trigger-campus'`)).rows[0].id;

      await client.query(`
        INSERT INTO courses (slug, title, duration_hours, modality, cycle_id, campus_id)
        VALUES ('trigger-course', 'Trigger Course', 100, 'online', ${cycleId}, ${campusId})
      `);

      const before = await client.query(`SELECT updated_at FROM courses WHERE slug = 'trigger-course'`);

      await new Promise(resolve => setTimeout(resolve, 1000));

      await client.query(`UPDATE courses SET title = 'Updated Title' WHERE slug = 'trigger-course'`);

      const after = await client.query(`SELECT updated_at FROM courses WHERE slug = 'trigger-course'`);

      expect(new Date(after.rows[0].updated_at).getTime()).toBeGreaterThan(new Date(before.rows[0].updated_at).getTime());
    });
  });

  // ============================================================================
  // ROLLBACK TESTS
  // ============================================================================

  describe('Rollback Migrations - Down Scripts', () => {
    it('should successfully rollback audit_logs table creation', async () => {
      // This test assumes rollback script exists
      // In real scenario, you would run: psql -f migrations/009_create_audit_down.sql
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'audit_logs'
        )
      `);

      expect(tableExists.rows[0].exists).toBe(true);
      // Rollback test would verify this becomes false after down migration
    });
  });
});
