import type { CollectionConfig } from 'payload';
import {
  canCreateBlogPosts,
  canReadBlogPosts,
  canUpdateBlogPosts,
  canDeleteBlogPosts,
} from './access';
import {
  validateSlug,
  validateSEO,
  calculateReadTime,
  setPublishedTimestamp,
  trackBlogPostCreator,
} from './hooks';
import { slugValidator } from './validators/slugValidator';

/**
 * BlogPosts Collection
 *
 * SEO-optimized blog/news content management with multi-language support.
 *
 * Features:
 * - 22 fields covering blog post lifecycle and SEO
 * - Multi-language support (es, en, ca)
 * - Auto-generated SEO-friendly slugs with Spanish character normalization
 * - Auto-calculated read time (200 words/minute)
 * - Rich text content with Slate editor
 * - Category and tag taxonomy
 * - Featured posts for homepage highlighting
 * - Comment system toggle
 * - Course and cycle relationships
 * - 6-tier RBAC with ownership-based permissions
 * - View tracking (immutable)
 * - Publication timestamp management
 *
 * Security Patterns:
 * - SP-001: 3 immutable fields (created_by, view_count, read_time)
 * - SP-004: No content in error logs
 * - Ownership-based permissions (Marketing role)
 *
 * Access Control:
 * - Create: marketing, gestor, admin
 * - Read:
 *   - Public: Published and active posts only
 *   - Authenticated: All posts
 * - Update:
 *   - Marketing: Own posts only (created_by = user.id)
 *   - Gestor/Admin: All posts
 * - Delete: gestor, admin only
 *
 * SEO Features:
 * - Auto-generated slugs from title
 * - Spanish character normalization (á → a, ñ → n)
 * - Auto-populated seo_title (max 60 chars)
 * - seo_description (max 160 chars)
 * - seo_keywords array
 * - Published timestamp tracking
 */
export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'status',
      'language',
      'category',
      'published_at',
      'view_count',
      'featured',
      'active',
    ],
    group: 'Content',
    description: 'Blog posts and news articles with SEO optimization and multi-language support',
  },
  access: {
    create: canCreateBlogPosts,
    read: canReadBlogPosts,
    update: canUpdateBlogPosts,
    delete: canDeleteBlogPosts,
  },
  hooks: {
    beforeValidate: [
      validateSlug, // Auto-generate slug from title
    ],
    beforeChange: [
      validateSEO, // Auto-populate seo_title from title
      calculateReadTime, // Calculate reading time from content
      setPublishedTimestamp, // Set published_at when status becomes published
    ],
    beforeCreate: [
      trackBlogPostCreator, // Auto-populate created_by
    ],
    beforeUpdate: [
      trackBlogPostCreator, // Enforce created_by immutability
    ],
  },
  fields: [
    // ========================================
    // BASIC INFORMATION (5 fields)
    // ========================================
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 200,
      label: 'Title',
      index: true,
      admin: {
        description: 'Blog post title (unique, 5-200 characters)',
        placeholder: 'Getting Started with Online Education',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      index: true,
      admin: {
        description: 'URL-friendly slug (auto-generated from title, lowercase with hyphens)',
        placeholder: 'getting-started-with-online-education',
      },
      validate: slugValidator,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: 'Publication status',
        position: 'sidebar',
      },
    },
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'es',
      label: 'Language',
      options: [
        { label: 'Español', value: 'es' },
        { label: 'English', value: 'en' },
        { label: 'Català', value: 'ca' },
      ],
      admin: {
        description: 'Content language',
        position: 'sidebar',
      },
    },
    {
      name: 'published_at',
      type: 'date',
      label: 'Published At',
      admin: {
        description: 'Publication timestamp (auto-set when status changes to published)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },

    // ========================================
    // CONTENT (3 fields)
    // ========================================
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      minLength: 20,
      maxLength: 300,
      label: 'Excerpt',
      admin: {
        description: 'Short summary for listings and previews (20-300 characters)',
        placeholder: 'Learn how to start your online education journey...',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
      admin: {
        description: 'Main blog post content',
      },
    },
    {
      name: 'featured_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      admin: {
        description: 'Featured image for the post (optional)',
      },
    },

    // ========================================
    // TAXONOMY & METADATA (4 fields)
    // ========================================
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Author',
      index: true,
      admin: {
        description: 'Post author (content attribution)',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'News', value: 'news' },
        { label: 'Tutorial', value: 'tutorial' },
        { label: 'Announcement', value: 'announcement' },
        { label: 'Case Study', value: 'case_study' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Post category',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      maxRows: 10,
      admin: {
        description: 'Tags for categorization and search (max 10)',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          minLength: 2,
          maxLength: 30,
          admin: {
            placeholder: 'online-education',
          },
        },
      ],
    },
    {
      name: 'read_time',
      type: 'number',
      label: 'Read Time (minutes)',
      admin: {
        description: 'Estimated reading time (auto-calculated from content, IMMUTABLE)',
        readOnly: true, // SP-001 Layer 1
        position: 'sidebar',
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // SP-001 Layer 2: System-managed only
        update: () => false,
      },
    },

    // ========================================
    // RELATIONSHIPS (2 fields)
    // ========================================
    {
      name: 'related_course',
      type: 'relationship',
      relationTo: 'courses',
      label: 'Related Course',
      admin: {
        description: 'Associated course (optional, SET NULL on deletion)',
      },
    },
    {
      name: 'related_cycle',
      type: 'relationship',
      relationTo: 'cycles',
      label: 'Related Cycle',
      admin: {
        description: 'Associated professional cycle (optional, SET NULL on deletion)',
      },
    },

    // ========================================
    // SEO FIELDS (3 fields)
    // ========================================
    {
      name: 'seo_title',
      type: 'text',
      maxLength: 60,
      label: 'SEO Title',
      admin: {
        description: 'Meta title for SEO (max 60 chars, auto-populated from title if empty)',
        placeholder: 'Getting Started with Online Education',
      },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      maxLength: 160,
      label: 'SEO Description',
      admin: {
        description: 'Meta description for SEO (max 160 chars)',
        placeholder: 'Discover how to begin your online education journey...',
      },
    },
    {
      name: 'seo_keywords',
      type: 'array',
      label: 'SEO Keywords',
      maxRows: 10,
      admin: {
        description: 'SEO keywords (max 10)',
      },
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'online education',
          },
        },
      ],
    },

    // ========================================
    // ENGAGEMENT & TRACKING (3 fields)
    // ========================================
    {
      name: 'view_count',
      type: 'number',
      defaultValue: 0,
      label: 'View Count',
      admin: {
        description: 'Total views (system-managed, IMMUTABLE)',
        readOnly: true, // SP-001 Layer 1
        position: 'sidebar',
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // SP-001 Layer 2: System-managed only
        update: () => false,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured',
      admin: {
        description: 'Featured on homepage',
        position: 'sidebar',
      },
    },
    {
      name: 'allow_comments',
      type: 'checkbox',
      defaultValue: true,
      label: 'Allow Comments',
      admin: {
        description: 'Enable comment system for this post',
        position: 'sidebar',
      },
    },

    // ========================================
    // AUDIT & SOFT DELETE (2 fields)
    // ========================================
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Created By',
      index: true,
      admin: {
        description: 'User who created the post (auto-assigned, IMMUTABLE)',
        readOnly: true, // SP-001 Layer 1: UI protection
        position: 'sidebar',
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // SP-001 Layer 2: Access control protection
        update: () => false,
      },
      // SP-001 Layer 3: Hook protection in trackBlogPostCreator
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Post is active and visible (uncheck for soft delete)',
        position: 'sidebar',
      },
    },
  ],

  // Timestamps (createdAt, updatedAt)
  timestamps: true,
};

export default BlogPosts;
