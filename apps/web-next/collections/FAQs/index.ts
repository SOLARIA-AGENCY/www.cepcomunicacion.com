import type { CollectionConfig } from 'payload';
import {
  canCreateFAQs,
  canReadFAQs,
  canUpdateFAQs,
  canDeleteFAQs,
} from './access';
import {
  validateOrder,
  trackFAQCreator,
} from './hooks';

/**
 * FAQs Collection
 *
 * Frequently Asked Questions with categorization and search optimization.
 *
 * Features:
 * - 12 fields covering FAQ lifecycle and engagement
 * - Multi-language support (es, en, ca)
 * - Category-based organization (general, enrollment, courses, payment, technical, other)
 * - Customizable display order within categories
 * - Search keyword optimization
 * - Course and cycle relationships
 * - "Was this helpful?" tracking (immutable)
 * - View counter (immutable)
 * - 6-tier RBAC with ownership-based permissions
 * - Rich text answers with Slate editor
 *
 * Security Patterns:
 * - SP-001: 3 immutable fields (created_by, helpful_count, view_count)
 * - SP-004: No question/answer content in error logs
 * - Ownership-based permissions (Marketing role)
 *
 * Access Control:
 * - Create: marketing, gestor, admin
 * - Read:
 *   - Public: Active FAQs only
 *   - Authenticated: All FAQs
 * - Update:
 *   - Marketing: Own FAQs only (created_by = user.id)
 *   - Gestor/Admin: All FAQs
 * - Delete: gestor, admin only
 *
 * Use Cases:
 * - Help center/knowledge base
 * - Course-specific FAQs
 * - Enrollment assistance
 * - Payment information
 * - Technical support
 */
export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: [
      'question',
      'category',
      'language',
      'order',
      'view_count',
      'helpful_count',
      'active',
    ],
    group: 'Content',
    description: 'Frequently Asked Questions with categorization and search optimization',
  },
  access: {
    create: canCreateFAQs,
    read: canReadFAQs,
    update: canUpdateFAQs,
    delete: canDeleteFAQs,
  },
  hooks: {
    beforeChange: [
      validateOrder, // Ensure order >= 0
    ],
    beforeCreate: [
      trackFAQCreator, // Auto-populate created_by
    ],
    beforeUpdate: [
      trackFAQCreator, // Enforce created_by immutability
    ],
  },
  fields: [
    // ========================================
    // BASIC INFORMATION (4 fields)
    // ========================================
    {
      name: 'question',
      type: 'text',
      required: true,
      minLength: 10,
      maxLength: 300,
      label: 'Question',
      index: true,
      admin: {
        description: 'The FAQ question (10-300 characters)',
        placeholder: 'How do I enroll in a course?',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: 'Answer',
      admin: {
        description: 'The detailed answer (rich text with formatting)',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      label: 'Category',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Enrollment', value: 'enrollment' },
        { label: 'Courses', value: 'courses' },
        { label: 'Payment', value: 'payment' },
        { label: 'Technical', value: 'technical' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'FAQ category for organization',
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
        description: 'FAQ language',
        position: 'sidebar',
      },
    },

    // ========================================
    // ORGANIZATION (1 field)
    // ========================================
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Display order within category (lower numbers appear first, must be >= 0)',
        position: 'sidebar',
        step: 1,
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
    // SEARCH OPTIMIZATION (1 field)
    // ========================================
    {
      name: 'keywords',
      type: 'array',
      label: 'Keywords',
      maxRows: 10,
      admin: {
        description: 'Search keywords for finding this FAQ (max 10)',
      },
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'enrollment',
          },
        },
      ],
    },

    // ========================================
    // ENGAGEMENT TRACKING (2 fields) - SP-001 IMMUTABLE
    // ========================================
    {
      name: 'helpful_count',
      type: 'number',
      defaultValue: 0,
      label: 'Helpful Count',
      admin: {
        description: '"Was this helpful?" positive votes (system-managed, IMMUTABLE)',
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
        description: 'User who created the FAQ (auto-assigned, IMMUTABLE)',
        readOnly: true, // SP-001 Layer 1: UI protection
        position: 'sidebar',
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // SP-001 Layer 2: Access control protection
        update: () => false,
      },
      // SP-001 Layer 3: Hook protection in trackFAQCreator
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'FAQ is active and visible (uncheck for soft delete)',
        position: 'sidebar',
      },
    },
  ],

  // Timestamps (createdAt, updatedAt)
  timestamps: true,
};

export default FAQs;
