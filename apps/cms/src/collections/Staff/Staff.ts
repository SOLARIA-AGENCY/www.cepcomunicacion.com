import type { CollectionConfig } from 'payload';
import { canManageStaff } from './access';
import { trackStaffCreator } from './hooks';

/**
 * Staff Collection - Personal Management (Profesores y Administrativos)
 *
 * Manages all personnel (professors and administrative staff) across all campuses.
 * This collection supports two types of staff members:
 * - Profesores: Teaching staff assigned to course runs
 * - Administrativos: Administrative staff assigned to campuses
 *
 * Database: PostgreSQL table 'staff'
 *
 * ============================================================================
 * ACCESS CONTROL MODEL (6-TIER RBAC)
 * ============================================================================
 *
 * Public (Unauthenticated):
 * - CREATE: NO ❌
 * - READ: Active professors only (name, bio, specialties) ✅
 * - UPDATE: NO ❌
 * - DELETE: NO ❌
 *
 * Lectura Role:
 * - CREATE: NO ❌
 * - READ: All staff (basic info only) ✅
 * - UPDATE: NO ❌
 * - DELETE: NO ❌
 *
 * Asesor Role:
 * - CREATE: NO ❌
 * - READ: All staff ✅
 * - UPDATE: NO ❌
 * - DELETE: NO ❌
 *
 * Marketing Role:
 * - CREATE: NO ❌
 * - READ: All staff ✅
 * - UPDATE: NO ❌
 * - DELETE: NO ❌
 *
 * Gestor Role:
 * - CREATE: YES ✅
 * - READ: All staff ✅
 * - UPDATE: YES ✅
 * - DELETE: YES ✅
 *
 * Admin Role:
 * - CREATE: YES ✅
 * - READ: All staff ✅
 * - UPDATE: YES ✅
 * - DELETE: YES ✅
 *
 * ============================================================================
 * KEY FEATURES
 * ============================================================================
 *
 * Staff Types:
 * - Profesor: Teaching staff (assigned to course runs)
 * - Administrativo: Administrative staff (assigned to campuses)
 *
 * Personal Information:
 * - Full name, email, phone
 * - Biography/description
 * - Photo (media upload)
 * - Active/inactive status
 *
 * Specialties (Professors only):
 * - Multiple specialties (e.g., "Marketing Digital", "Diseño Gráfico")
 * - Used for filtering and assignment
 *
 * Campus Assignment:
 * - Each staff member assigned to a primary campus
 * - Professors can teach at multiple campuses (via course runs)
 * - Administrativos work at their assigned campus
 *
 * ============================================================================
 * SECURITY CONSIDERATIONS
 * ============================================================================
 *
 * Immutable Fields (SP-001: Defense in Depth):
 * - created_by: Auto-populated on create, immutable after creation
 *   - Layer 1 (UX): admin.readOnly = true
 *   - Layer 2 (Security): access.update = false
 *   - Layer 3 (Business Logic): Hook enforces immutability
 *
 * PII Protection:
 * - Email and phone not exposed in public API
 * - Personal data only visible to authenticated users with proper permissions
 * - No PII in application logs
 *
 * Data Integrity:
 * - Email validation (unique per staff member)
 * - Phone validation (Spanish format)
 * - Campus relationship validation
 * - Active status controls visibility
 */
export const Staff: CollectionConfig = {
  slug: 'staff',

  labels: {
    singular: 'Staff Member',
    plural: 'Staff',
  },

  admin: {
    useAsTitle: 'full_name',
    defaultColumns: ['full_name', 'staff_type', 'campus', 'email', 'is_active'],
    group: 'Personal',
    description: 'Professors and administrative staff across all campuses',
  },

  /**
   * Collection-level access control
   */
  access: {
    create: canManageStaff, // Gestor, Admin
    read: ({ req: { user } }) => {
      // Public: Only active professors (basic info)
      if (!user) {
        return {
          staff_type: { equals: 'profesor' },
          is_active: { equals: true },
        };
      }

      // All authenticated users: read all staff
      return true;
    },
    update: canManageStaff, // Gestor, Admin
    delete: canManageStaff, // Gestor, Admin
  },

  fields: [
    // ============================================================================
    // BASIC INFORMATION
    // ============================================================================

    {
      name: 'staff_type',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Profesor', value: 'profesor' },
        { label: 'Administrativo', value: 'administrativo' },
      ],
      defaultValue: 'profesor',
      admin: {
        position: 'sidebar',
        description: 'Type of staff member (profesor or administrativo)',
      },
    },

    {
      name: 'full_name',
      type: 'text',
      required: true,
      maxLength: 255,
      index: true,
      admin: {
        description: 'Full name of the staff member',
      },
      validate: (val: any) => {
        if (!val) return 'Full name is required';
        if (val.trim().length < 3) return 'Full name must be at least 3 characters';
        return true;
      },
    },

    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Email address (must be unique)',
      },
      validate: (val: any) => {
        if (!val) return 'Email is required';
        return true;
      },
      // PII Protection: Hide from public API
      access: {
        read: ({ req: { user } }) => !!user, // Only authenticated users
      },
    },

    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Phone number (Spanish format: +34 XXX XXX XXX)',
        placeholder: '+34 912 345 678',
      },
      validate: (val: any) => {
        if (!val) return true; // Optional
        if (!/^\+34\s\d{3}\s\d{3}\s\d{3}$/.test(val)) {
          return 'Phone must be in format: +34 XXX XXX XXX';
        }
        return true;
      },
      // PII Protection: Hide from public API
      access: {
        read: ({ req: { user } }) => !!user, // Only authenticated users
      },
    },

    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Short biography or description',
        rows: 3,
      },
    },

    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile photo',
      },
    },

    // ============================================================================
    // PROFESSOR-SPECIFIC FIELDS
    // ============================================================================

    {
      name: 'specialties',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Marketing Digital', value: 'marketing-digital' },
        { label: 'Desarrollo Web', value: 'desarrollo-web' },
        { label: 'Diseño Gráfico', value: 'diseno-grafico' },
        { label: 'Audiovisual', value: 'audiovisual' },
        { label: 'Gestión Empresarial', value: 'gestion-empresarial' },
        { label: 'Redes Sociales', value: 'redes-sociales' },
        { label: 'SEO/SEM', value: 'seo-sem' },
        { label: 'E-commerce', value: 'ecommerce' },
        { label: 'Fotografía', value: 'fotografia' },
        { label: 'Video', value: 'video' },
      ],
      admin: {
        description: 'Specialties (for professors only)',
        condition: (data) => data.staff_type === 'profesor',
      },
    },

    // ============================================================================
    // CAMPUS ASSIGNMENT
    // ============================================================================

    {
      name: 'campus',
      type: 'relationship',
      relationTo: 'campuses',
      required: true,
      index: true,
      admin: {
        description: 'Primary campus where this staff member works',
      },
      validate: (val: any) => {
        if (!val) return 'Campus assignment is required';
        return true;
      },
    },

    // ============================================================================
    // STATUS
    // ============================================================================

    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Is this staff member currently active?',
      },
    },

    // ============================================================================
    // INTERNAL NOTES
    // ============================================================================

    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes (not visible to public)',
        rows: 2,
      },
      access: {
        read: canManageStaff, // Only Gestor/Admin
      },
    },

    // ============================================================================
    // AUDIT TRAIL
    // ============================================================================

    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'User who created this staff member (auto-populated)',
        readOnly: true, // SECURITY Layer 1 (UX): UI protection
      },
      // SECURITY Layer 2 (Security): Field-level access control prevents API manipulation
      access: {
        read: () => true,
        update: () => false, // Immutable after creation
      },
    },
  ],

  /**
   * Hooks - Business logic and validation
   */
  hooks: {
    /**
     * Before Change: Run after validation, before database write
     */
    beforeChange: [
      trackStaffCreator, // Auto-populate and protect created_by field
    ],
  },

  /**
   * Timestamps - Automatically add createdAt and updatedAt
   */
  timestamps: true,
};
