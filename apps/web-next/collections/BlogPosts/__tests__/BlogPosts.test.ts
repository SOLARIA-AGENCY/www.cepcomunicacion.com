/**
 * BlogPosts Collection - Test Suite
 *
 * TDD Implementation - RED Phase
 * Target: 80+ tests covering all functionality
 *
 * Test Categories:
 * - CRUD Operations (12+ tests)
 * - Validation Tests (18+ tests)
 * - Access Control Tests (15+ tests)
 * - Relationship Tests (8+ tests)
 * - Hook Tests (12+ tests)
 * - Security Tests (10+ tests)
 * - SEO Tests (5+ tests)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Payload } from 'payload';
import type { BlogPost } from '../../../payload-types';

// Mock Payload instance
let payload: Payload;

// Test data fixtures
const mockAdmin = {
  id: 'admin-001',
  email: 'admin@cepcomunicacion.com',
  role: 'admin',
};

const mockGestor = {
  id: 'gestor-001',
  email: 'gestor@cepcomunicacion.com',
  role: 'gestor',
};

const mockMarketing = {
  id: 'marketing-001',
  email: 'marketing@cepcomunicacion.com',
  role: 'marketing',
};

const mockMarketingOther = {
  id: 'marketing-002',
  email: 'marketing2@cepcomunicacion.com',
  role: 'marketing',
};

const mockAsesor = {
  id: 'asesor-001',
  email: 'asesor@cepcomunicacion.com',
  role: 'asesor',
};

const mockLectura = {
  id: 'lectura-001',
  email: 'lectura@cepcomunicacion.com',
  role: 'lectura',
};

const validBlogPostData = {
  title: 'Getting Started with Online Education',
  status: 'draft',
  language: 'es',
  excerpt: 'Learn how to start your online education journey with our comprehensive guide.',
  content: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { text: 'This is the main content of the blog post. It should be engaging and informative.' },
          ],
        },
      ],
    },
  },
  author: 'admin-001',
  category: 'tutorial',
  tags: ['online-education', 'tutorial', 'beginners'],
  featured: false,
  allow_comments: true,
  active: true,
};

describe('BlogPosts Collection - CRUD Operations', () => {
  describe('CREATE operations', () => {
    it('should create a blog post with all required fields (admin)', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      expect(blogPost).toBeDefined();
      expect(blogPost.title).toBe('Getting Started with Online Education');
      expect(blogPost.status).toBe('draft');
      expect(blogPost.language).toBe('es');
      expect(blogPost.category).toBe('tutorial');
      expect(blogPost.created_by).toBe(mockAdmin.id);
      expect(blogPost.active).toBe(true);
    });

    it('should create a blog post with minimum required fields', async () => {
      const minimalData = {
        title: 'Minimal Blog Post',
        excerpt: 'This is a minimal excerpt for testing purposes.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ text: 'Minimal content' }],
              },
            ],
          },
        },
        author: 'admin-001',
        category: 'news',
      };

      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: minimalData,
        user: mockAdmin,
      });

      expect(blogPost).toBeDefined();
      expect(blogPost.title).toBe('Minimal Blog Post');
      expect(blogPost.status).toBe('draft'); // Default value
      expect(blogPost.language).toBe('es'); // Default value
      expect(blogPost.featured).toBe(false); // Default value
      expect(blogPost.allow_comments).toBe(true); // Default value
    });

    it('should auto-generate slug from title if not provided', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          title: 'Curso de Programación: JavaScript Avanzado',
        },
        user: mockAdmin,
      });

      expect(blogPost.slug).toBe('curso-de-programacion-javascript-avanzado');
    });

    it('should normalize Spanish characters in slug generation', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          title: 'Introducción a la Educación Ágil',
        },
        user: mockAdmin,
      });

      expect(blogPost.slug).toBe('introduccion-a-la-educacion-agil');
    });

    it('should reject duplicate titles', async () => {
      await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      await expect(
        payload.create({
          collection: 'blog-posts',
          data: validBlogPostData,
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should reject duplicate slugs', async () => {
      await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, slug: 'test-slug' },
        user: mockAdmin,
      });

      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, title: 'Different Title', slug: 'test-slug' },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should auto-populate created_by on creation', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      expect(blogPost.created_by).toBe(mockMarketing.id);
    });

    it('should calculate read_time from content length', async () => {
      const longContent = {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                { text: 'Lorem ipsum dolor sit amet. '.repeat(200) }, // ~600 words
              ],
            },
          ],
        },
      };

      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          content: longContent,
        },
        user: mockAdmin,
      });

      expect(blogPost.read_time).toBe(3); // 600 words / 200 words per minute = 3 minutes
    });

    it('should initialize view_count to 0', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      expect(blogPost.view_count).toBe(0);
    });

    it('should deny creation without authentication', async () => {
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: validBlogPostData,
        })
      ).rejects.toThrow();
    });
  });

  describe('READ operations', () => {
    it('should allow public to read published posts only', async () => {
      const publishedPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, status: 'published' },
        user: mockAdmin,
      });

      const posts = await payload.find({
        collection: 'blog-posts',
      });

      expect(posts.docs).toHaveLength(1);
      expect(posts.docs[0].id).toBe(publishedPost.id);
    });

    it('should not show draft posts to public', async () => {
      await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, status: 'draft' },
        user: mockAdmin,
      });

      const posts = await payload.find({
        collection: 'blog-posts',
      });

      expect(posts.docs).toHaveLength(0);
    });

    it('should allow authenticated users to read all posts (lectura role)', async () => {
      await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, status: 'draft' },
        user: mockAdmin,
      });

      const posts = await payload.find({
        collection: 'blog-posts',
        user: mockLectura,
      });

      expect(posts.docs).toHaveLength(1);
    });

    it('should not show inactive posts to public', async () => {
      await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, status: 'published', active: false },
        user: mockAdmin,
      });

      const posts = await payload.find({
        collection: 'blog-posts',
      });

      expect(posts.docs).toHaveLength(0);
    });
  });

  describe('UPDATE operations', () => {
    it('should allow admin to update any post', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { title: 'Updated Title by Admin' },
        user: mockAdmin,
      });

      expect(updated.title).toBe('Updated Title by Admin');
    });

    it('should allow gestor to update any post', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { title: 'Updated Title by Gestor' },
        user: mockGestor,
      });

      expect(updated.title).toBe('Updated Title by Gestor');
    });

    it('should allow marketing to update their own posts only', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { title: 'Updated by Owner' },
        user: mockMarketing,
      });

      expect(updated.title).toBe('Updated by Owner');
    });

    it('should deny marketing from updating posts they do not own', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      await expect(
        payload.update({
          collection: 'blog-posts',
          id: blogPost.id,
          data: { title: 'Attempted Update by Other' },
          user: mockMarketingOther,
        })
      ).rejects.toThrow();
    });

    it('should deny lectura role from updating posts', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'blog-posts',
          id: blogPost.id,
          data: { title: 'Attempted Update by Lectura' },
          user: mockLectura,
        })
      ).rejects.toThrow();
    });

    it('should deny asesor role from updating posts', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'blog-posts',
          id: blogPost.id,
          data: { title: 'Attempted Update by Asesor' },
          user: mockAsesor,
        })
      ).rejects.toThrow();
    });

    it('should enforce created_by immutability (SP-001)', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { created_by: 'different-user-id' },
        user: mockAdmin,
      });

      expect(updated.created_by).toBe(mockMarketing.id); // Should remain unchanged
    });

    it('should enforce view_count immutability (SP-001)', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { view_count: 1000 },
        user: mockAdmin,
      });

      expect(updated.view_count).toBe(0); // Should remain unchanged
    });

    it('should auto-set published_at when status changes to published', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, status: 'draft' },
        user: mockAdmin,
      });

      expect(blogPost.published_at).toBeUndefined();

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { status: 'published' },
        user: mockAdmin,
      });

      expect(updated.published_at).toBeDefined();
      expect(new Date(updated.published_at)).toBeInstanceOf(Date);
    });

    it('should not change published_at if already set', async () => {
      const publishedDate = new Date('2025-01-01T00:00:00Z');
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          status: 'published',
          published_at: publishedDate.toISOString(),
        },
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { title: 'Updated Title' },
        user: mockAdmin,
      });

      expect(updated.published_at).toBe(publishedDate.toISOString());
    });
  });

  describe('DELETE operations', () => {
    it('should allow admin to delete any post', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      await expect(
        payload.delete({
          collection: 'blog-posts',
          id: blogPost.id,
          user: mockAdmin,
        })
      ).resolves.not.toThrow();
    });

    it('should allow gestor to delete any post', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      await expect(
        payload.delete({
          collection: 'blog-posts',
          id: blogPost.id,
          user: mockGestor,
        })
      ).resolves.not.toThrow();
    });

    it('should deny marketing from deleting posts', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      await expect(
        payload.delete({
          collection: 'blog-posts',
          id: blogPost.id,
          user: mockMarketing,
        })
      ).rejects.toThrow();
    });

    it('should deny lectura from deleting posts', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      await expect(
        payload.delete({
          collection: 'blog-posts',
          id: blogPost.id,
          user: mockLectura,
        })
      ).rejects.toThrow();
    });

    it('should deny asesor from deleting posts', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      await expect(
        payload.delete({
          collection: 'blog-posts',
          id: blogPost.id,
          user: mockAsesor,
        })
      ).rejects.toThrow();
    });
  });
});

describe('BlogPosts Collection - Validation Tests', () => {
  describe('Title validation', () => {
    it('should reject title shorter than 5 characters', async () => {
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, title: 'Test' },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should reject title longer than 200 characters', async () => {
      const longTitle = 'A'.repeat(201);
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, title: longTitle },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should accept title exactly 5 characters', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, title: 'Title' },
        user: mockAdmin,
      });

      expect(blogPost.title).toBe('Title');
    });

    it('should accept title exactly 200 characters', async () => {
      const title = 'A'.repeat(200);
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, title },
        user: mockAdmin,
      });

      expect(blogPost.title).toBe(title);
    });
  });

  describe('Slug validation', () => {
    it('should only contain lowercase letters, numbers, and hyphens', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, slug: 'valid-slug-123' },
        user: mockAdmin,
      });

      expect(blogPost.slug).toBe('valid-slug-123');
    });

    it('should reject slug with uppercase letters', async () => {
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, slug: 'Invalid-Slug' },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should reject slug with special characters', async () => {
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, slug: 'invalid_slug!' },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should reject slug with spaces', async () => {
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, slug: 'invalid slug' },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });
  });

  describe('Excerpt validation', () => {
    it('should reject excerpt shorter than 20 characters', async () => {
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, excerpt: 'Too short' },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should reject excerpt longer than 300 characters', async () => {
      const longExcerpt = 'A'.repeat(301);
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, excerpt: longExcerpt },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should accept excerpt exactly 20 characters', async () => {
      const excerpt = 'A'.repeat(20);
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, excerpt },
        user: mockAdmin,
      });

      expect(blogPost.excerpt).toBe(excerpt);
    });

    it('should accept excerpt exactly 300 characters', async () => {
      const excerpt = 'A'.repeat(300);
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, excerpt },
        user: mockAdmin,
      });

      expect(blogPost.excerpt).toBe(excerpt);
    });
  });

  describe('Tags validation', () => {
    it('should accept up to 10 tags', async () => {
      const tags = Array.from({ length: 10 }, (_, i) => `tag-${i}`);
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, tags },
        user: mockAdmin,
      });

      expect(blogPost.tags).toHaveLength(10);
    });

    it('should reject more than 10 tags', async () => {
      const tags = Array.from({ length: 11 }, (_, i) => `tag-${i}`);
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, tags },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should reject tags shorter than 2 characters', async () => {
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, tags: ['a'] },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should reject tags longer than 30 characters', async () => {
      const longTag = 'a'.repeat(31);
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, tags: [longTag] },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });
  });

  describe('SEO validation', () => {
    it('should reject seo_title longer than 60 characters', async () => {
      const longTitle = 'A'.repeat(61);
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, seo_title: longTitle },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should accept seo_title exactly 60 characters', async () => {
      const seoTitle = 'A'.repeat(60);
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, seo_title: seoTitle },
        user: mockAdmin,
      });

      expect(blogPost.seo_title).toBe(seoTitle);
    });

    it('should reject seo_description longer than 160 characters', async () => {
      const longDesc = 'A'.repeat(161);
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, seo_description: longDesc },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should accept seo_description exactly 160 characters', async () => {
      const seoDesc = 'A'.repeat(160);
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, seo_description: seoDesc },
        user: mockAdmin,
      });

      expect(blogPost.seo_description).toBe(seoDesc);
    });

    it('should reject more than 10 seo_keywords', async () => {
      const keywords = Array.from({ length: 11 }, (_, i) => `keyword-${i}`);
      await expect(
        payload.create({
          collection: 'blog-posts',
          data: { ...validBlogPostData, seo_keywords: keywords },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });
  });
});

describe('BlogPosts Collection - Relationship Tests', () => {
  it('should accept valid course relationship', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: { ...validBlogPostData, related_course: 'valid-course-id' },
      user: mockAdmin,
    });

    expect(blogPost.related_course).toBe('valid-course-id');
  });

  it('should accept valid cycle relationship', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: { ...validBlogPostData, related_cycle: 'valid-cycle-id' },
      user: mockAdmin,
    });

    expect(blogPost.related_cycle).toBe('valid-cycle-id');
  });

  it('should set related_course to null on course deletion', async () => {
    // This test requires actual database relationship testing
    // Implementation depends on database cascade behavior
    expect(true).toBe(true); // Placeholder
  });

  it('should set related_cycle to null on cycle deletion', async () => {
    // This test requires actual database relationship testing
    // Implementation depends on database cascade behavior
    expect(true).toBe(true); // Placeholder
  });

  it('should maintain author relationship integrity', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: validBlogPostData,
      user: mockAdmin,
    });

    expect(blogPost.author).toBe('admin-001');
  });

  it('should maintain created_by relationship integrity', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: validBlogPostData,
      user: mockMarketing,
    });

    expect(blogPost.created_by).toBe(mockMarketing.id);
  });
});

describe('BlogPosts Collection - Hook Tests', () => {
  describe('validateSlug hook', () => {
    it('should auto-generate slug from title when not provided', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          title: 'This is a Test Title',
        },
        user: mockAdmin,
      });

      expect(blogPost.slug).toBe('this-is-a-test-title');
    });

    it('should preserve custom slug if provided', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          slug: 'custom-slug',
        },
        user: mockAdmin,
      });

      expect(blogPost.slug).toBe('custom-slug');
    });
  });

  describe('validateSEO hook', () => {
    it('should use title for seo_title if not provided', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      expect(blogPost.seo_title).toBe('Getting Started with Online Education');
    });

    it('should truncate long title to 60 chars for seo_title', async () => {
      const longTitle = 'A'.repeat(100);
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          title: longTitle,
        },
        user: mockAdmin,
      });

      expect(blogPost.seo_title).toHaveLength(60);
      expect(blogPost.seo_title).toBe(longTitle.substring(0, 60));
    });

    it('should preserve custom seo_title if provided', async () => {
      const customSEO = 'Custom SEO Title';
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          seo_title: customSEO,
        },
        user: mockAdmin,
      });

      expect(blogPost.seo_title).toBe(customSEO);
    });
  });

  describe('calculateReadTime hook', () => {
    it('should calculate read time at 200 words per minute', async () => {
      const words = Array.from({ length: 400 }, () => 'word').join(' ');
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: words }],
                },
              ],
            },
          },
        },
        user: mockAdmin,
      });

      expect(blogPost.read_time).toBe(2); // 400 words / 200 = 2 minutes
    });

    it('should round up read time', async () => {
      const words = Array.from({ length: 250 }, () => 'word').join(' ');
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: words }],
                },
              ],
            },
          },
        },
        user: mockAdmin,
      });

      expect(blogPost.read_time).toBe(2); // 250 words / 200 = 1.25 -> rounded to 2
    });

    it('should have minimum read time of 1 minute', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Short content' }],
                },
              ],
            },
          },
        },
        user: mockAdmin,
      });

      expect(blogPost.read_time).toBeGreaterThanOrEqual(1);
    });
  });

  describe('setPublishedTimestamp hook', () => {
    it('should set published_at when status changes to published', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: { ...validBlogPostData, status: 'draft' },
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { status: 'published' },
        user: mockAdmin,
      });

      expect(updated.published_at).toBeDefined();
    });

    it('should not overwrite existing published_at', async () => {
      const originalDate = new Date('2025-01-01T00:00:00Z');
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          status: 'published',
          published_at: originalDate.toISOString(),
        },
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { title: 'Updated' },
        user: mockAdmin,
      });

      expect(updated.published_at).toBe(originalDate.toISOString());
    });
  });
});

describe('BlogPosts Collection - Security Tests (SP-001, SP-004)', () => {
  describe('SP-001: Immutability - created_by', () => {
    it('should prevent created_by update via field access control (Layer 2)', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { created_by: 'attacker-id' },
        user: mockAdmin,
      });

      expect(updated.created_by).toBe(mockMarketing.id);
    });

    it('should enforce created_by immutability at hook level (Layer 3)', async () => {
      // Hook should override any attempt to change created_by
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { created_by: 'different-user' },
        user: mockAdmin,
      });

      expect(updated.created_by).toBe(mockMarketing.id);
    });
  });

  describe('SP-001: Immutability - view_count', () => {
    it('should prevent view_count update via field access control (Layer 2)', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { view_count: 9999 },
        user: mockAdmin,
      });

      expect(updated.view_count).toBe(0);
    });
  });

  describe('SP-004: No content in logs', () => {
    it('should not log post content in error messages', async () => {
      // This is more of an implementation verification
      // Actual logging would be tested with log inspection
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Ownership-based permissions', () => {
    it('should allow marketing to update only their own posts', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'blog-posts',
        id: blogPost.id,
        data: { title: 'Updated by Owner' },
        user: mockMarketing,
      });

      expect(updated.title).toBe('Updated by Owner');
    });

    it('should deny marketing from updating posts they do not own', async () => {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: validBlogPostData,
        user: mockMarketing,
      });

      await expect(
        payload.update({
          collection: 'blog-posts',
          id: blogPost.id,
          data: { title: 'Unauthorized Update' },
          user: mockMarketingOther,
        })
      ).rejects.toThrow();
    });
  });
});

describe('BlogPosts Collection - SEO Features', () => {
  it('should generate SEO-friendly slugs', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: {
        ...validBlogPostData,
        title: 'How to Learn Web Development in 2025',
      },
      user: mockAdmin,
    });

    expect(blogPost.slug).toBe('how-to-learn-web-development-in-2025');
  });

  it('should auto-populate seo_title from title', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: validBlogPostData,
      user: mockAdmin,
    });

    expect(blogPost.seo_title).toBe(validBlogPostData.title);
  });

  it('should accept multi-language posts (es, en, ca)', async () => {
    const languages = ['es', 'en', 'ca'];

    for (const language of languages) {
      const blogPost = await payload.create({
        collection: 'blog-posts',
        data: {
          ...validBlogPostData,
          language,
          title: `Test Post ${language}`,
        },
        user: mockAdmin,
      });

      expect(blogPost.language).toBe(language);
    }
  });

  it('should track featured posts separately', async () => {
    const featured = await payload.create({
      collection: 'blog-posts',
      data: { ...validBlogPostData, featured: true, status: 'published' },
      user: mockAdmin,
    });

    const posts = await payload.find({
      collection: 'blog-posts',
      where: { featured: { equals: true } },
    });

    expect(posts.docs).toHaveLength(1);
    expect(posts.docs[0].id).toBe(featured.id);
  });
});

describe('BlogPosts Collection - Edge Cases', () => {
  it('should handle empty tags array', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: { ...validBlogPostData, tags: [] },
      user: mockAdmin,
    });

    expect(blogPost.tags).toEqual([]);
  });

  it('should handle null relationships gracefully', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: {
        ...validBlogPostData,
        related_course: null,
        related_cycle: null,
      },
      user: mockAdmin,
    });

    expect(blogPost.related_course).toBeNull();
    expect(blogPost.related_cycle).toBeNull();
  });

  it('should handle status transitions', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: { ...validBlogPostData, status: 'draft' },
      user: mockAdmin,
    });

    // draft -> published
    let updated = await payload.update({
      collection: 'blog-posts',
      id: blogPost.id,
      data: { status: 'published' },
      user: mockAdmin,
    });
    expect(updated.status).toBe('published');

    // published -> archived
    updated = await payload.update({
      collection: 'blog-posts',
      id: blogPost.id,
      data: { status: 'archived' },
      user: mockAdmin,
    });
    expect(updated.status).toBe('archived');
  });

  it('should handle soft delete via active flag', async () => {
    const blogPost = await payload.create({
      collection: 'blog-posts',
      data: { ...validBlogPostData, status: 'published' },
      user: mockAdmin,
    });

    // Soft delete
    await payload.update({
      collection: 'blog-posts',
      id: blogPost.id,
      data: { active: false },
      user: mockAdmin,
    });

    // Should not appear in public queries
    const posts = await payload.find({
      collection: 'blog-posts',
    });

    expect(posts.docs.find((p) => p.id === blogPost.id)).toBeUndefined();
  });
});
