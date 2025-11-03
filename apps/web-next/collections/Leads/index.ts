import type { CollectionConfig } from 'payload';
import {
  canCreateLeads,
  canReadLeads,
  canUpdateLeads,
  canDeleteLeads,
} from './access';
import {
  validateGDPRConsentHook,
  captureConsentMetadataHook,
  validatePhoneHook,
  validateDNIHook,
  preventDuplicateLeadHook,
  sanitizeInputHook,
  generateLeadIDHook,
  calculateLeadScoreHook,
  trackConversionHook,
  triggerLeadCreatedJobHook,
} from './hooks';

/**
 * Leads Collection (Prospective Students)
 *
 * CRITICAL P0 collection with PUBLIC endpoint for form submissions.
 * Requires MAXIMUM GDPR compliance and security measures.
 *
 * Features:
 * - 26 fields covering lead capture and management
 * - PUBLIC form submission (no auth required)
 * - MANDATORY GDPR consent (cannot create without)
 * - Automatic IP address capture for audit trail
 * - Duplicate prevention (24-hour window)
 * - Lead scoring system (0-100 points)
 * - 6-tier RBAC + public access
 * - XSS prevention (input sanitization)
 * - Rate limiting ready (5 per IP per 15 minutes)
 *
 * Security Patterns:
 * - SP-001: 3-layer immutability for created_by, lead_score, conversion_date
 * - SP-002: MAXIMUM immutability for GDPR consent fields (5 fields)
 * - SP-004: Zero PII in error messages (all hooks compliant)
 * - Public endpoint with strict validation
 * - Field-level access control for PII
 *
 * Access Control:
 * - Create: PUBLIC (form submission) + authenticated roles
 * - Read:
 *   - Public: DENIED (no PII exposure)
 *   - Lectura: DENIED (privacy protection)
 *   - Asesor: Assigned leads only + unassigned
 *   - Marketing: All active leads
 *   - Gestor: All leads including inactive
 *   - Admin: All leads including inactive
 * - Update:
 *   - Asesor: Assigned leads only
 *   - Marketing/Gestor/Admin: All leads
 *   - GDPR consent fields: IMMUTABLE
 * - Delete: Admin and gestor only (right to be forgotten)
 *
 * PII Fields (7+):
 * - Personal: first_name, last_name, email, phone, dni, date_of_birth, city
 * - GDPR Metadata: consent_timestamp, consent_ip_address
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'lead_id',
    defaultColumns: [
      'lead_id',
      'last_name',
      'first_name',
      'email',
      'phone',
      'status',
      'source',
      'lead_score',
      'active',
    ],
    group: 'Gestión de Leads',
    description:
      'Gestión de leads con formulario público y protección máxima de datos (GDPR)',
  },
  access: {
    create: canCreateLeads, // PUBLIC + authenticated
    read: canReadLeads,
    update: canUpdateLeads,
    delete: canDeleteLeads,
  },
  hooks: {
    beforeChange: [
      generateLeadIDHook, // Generate unique ID first
      sanitizeInputHook, // Sanitize input to prevent XSS
      preventDuplicateLeadHook, // Check for duplicates (24h window)
      validateGDPRConsentHook, // Validate consent + enforce immutability
      validatePhoneHook, // Validate Spanish phone format
      validateDNIHook, // Validate Spanish DNI with checksum
      trackConversionHook, // Track conversion to student
    ],
    beforeCreate: [
      captureConsentMetadataHook, // Auto-capture timestamp + IP
    ],
    afterChange: [
      calculateLeadScoreHook, // Calculate lead quality score
    ],
    afterCreate: [
      triggerLeadCreatedJobHook, // Queue BullMQ job
    ],
  },
  fields: [
    // ========================================
    // IDENTIFICATION (System-Generated)
    // ========================================
    {
      name: 'lead_id',
      type: 'text',
      required: true,
      unique: true,
      label: 'ID de Lead',
      index: true,
      admin: {
        description: 'Identificador único (LEAD-YYYYMMDD-XXXX, generado automáticamente)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
      },
      access: {
        // Visible to all authenticated users
        read: ({ req: { user } }) => !!user,
        // Immutable after creation (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in generateLeadIDHook
    },

    // ========================================
    // PERSONAL INFORMATION (PII)
    // ========================================
    {
      name: 'first_name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 50,
      label: 'Nombre',
      admin: {
        description: 'Nombre del lead (requerido para formulario público)',
      },
    },
    {
      name: 'last_name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 100,
      label: 'Apellidos',
      admin: {
        description: 'Apellidos del lead (requerido para formulario público)',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Correo Electrónico',
      index: true,
      admin: {
        description: 'Correo electrónico (requerido, usado para detección de duplicados)',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Teléfono',
      admin: {
        description: 'Teléfono móvil (formato español: +34 XXX XXX XXX, requerido)',
        placeholder: '+34 612 345 678',
      },
      // Validation in validatePhoneHook
    },
    {
      name: 'dni',
      type: 'text',
      label: 'DNI',
      admin: {
        description: 'DNI español (opcional, validación de checksum si proporcionado)',
        placeholder: '12345678Z',
      },
      // Validation in validateDNIHook
    },
    {
      name: 'date_of_birth',
      type: 'date',
      label: 'Fecha de Nacimiento',
      admin: {
        description: 'Fecha de nacimiento (opcional)',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'city',
      type: 'text',
      label: 'Ciudad',
      admin: {
        description: 'Ciudad de residencia (opcional)',
      },
    },

    // ========================================
    // INTEREST INFORMATION
    // ========================================
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      label: 'Curso de Interés',
      admin: {
        description: 'Curso en el que está interesado el lead (opcional)',
      },
    },
    {
      name: 'campus',
      type: 'relationship',
      relationTo: 'campuses',
      label: 'Campus de Preferencia',
      admin: {
        description: 'Campus preferido para estudiar (opcional)',
      },
    },
    {
      name: 'campaign',
      type: 'relationship',
      relationTo: 'campaigns',
      label: 'Campaña',
      admin: {
        description: 'Campaña de marketing asociada (capturado de UTM parameters)',
        position: 'sidebar',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      maxLength: 1000,
      label: 'Mensaje',
      admin: {
        description: 'Mensaje o consulta del lead (opcional, máx. 1000 caracteres)',
        placeholder: 'Cuéntanos sobre tu interés...',
      },
    },

    // ========================================
    // GDPR COMPLIANCE (CRITICAL - IMMUTABLE)
    // ========================================
    {
      name: 'gdpr_consent',
      type: 'checkbox',
      required: true,
      label: 'Consentimiento GDPR',
      defaultValue: false,
      admin: {
        description:
          'El lead ha dado consentimiento explícito para el tratamiento de datos (INMUTABLE)',
        readOnly: true, // UI-level protection (SP-002 Layer 1)
        position: 'sidebar',
      },
      validate: (value) => {
        if (value !== true) {
          return 'GDPR consent is required and must be explicitly accepted';
        }
        return true;
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // IMMUTABLE after creation (SP-002 Layer 2 - MAXIMUM protection)
        update: () => false,
      },
      // Layer 3 protection in validateGDPRConsentHook
    },
    {
      name: 'privacy_policy_accepted',
      type: 'checkbox',
      required: true,
      label: 'Política de Privacidad Aceptada',
      defaultValue: false,
      admin: {
        description: 'El lead ha aceptado la política de privacidad (INMUTABLE)',
        readOnly: true, // UI-level protection (SP-002 Layer 1)
        position: 'sidebar',
      },
      validate: (value) => {
        if (value !== true) {
          return 'Privacy policy acceptance is required';
        }
        return true;
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // IMMUTABLE after creation (SP-002 Layer 2 - MAXIMUM protection)
        update: () => false,
      },
      // Layer 3 protection in validateGDPRConsentHook
    },
    {
      name: 'consent_timestamp',
      type: 'date',
      label: 'Fecha/Hora de Consentimiento',
      admin: {
        description: 'Timestamp ISO 8601 de cuando se dio el consentimiento (INMUTABLE)',
        readOnly: true, // UI-level protection (SP-002 Layer 1)
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm:ss',
        },
      },
      access: {
        // Only admin, gestor can read
        read: ({ req: { user } }) => {
          if (!user) return false;
          return ['admin', 'gestor'].includes(user.role);
        },
        // IMMUTABLE after creation (SP-002 Layer 2 - MAXIMUM protection)
        update: () => false,
      },
      // Auto-set and Layer 3 protection in captureConsentMetadataHook + validateGDPRConsentHook
    },
    {
      name: 'consent_ip_address',
      type: 'text',
      label: 'Dirección IP de Consentimiento',
      admin: {
        description: 'Dirección IP desde donde se dio el consentimiento (INMUTABLE)',
        readOnly: true, // UI-level protection (SP-002 Layer 1)
        position: 'sidebar',
      },
      access: {
        // Only admin, gestor can read
        read: ({ req: { user } }) => {
          if (!user) return false;
          return ['admin', 'gestor'].includes(user.role);
        },
        // IMMUTABLE after creation (SP-002 Layer 2 - MAXIMUM protection)
        update: () => false,
      },
      // Auto-set and Layer 3 protection in captureConsentMetadataHook + validateGDPRConsentHook
    },
    {
      name: 'marketing_consent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Consentimiento de Marketing',
      admin: {
        description: 'El lead acepta recibir comunicaciones de marketing (puede cambiar)',
        position: 'sidebar',
      },
    },

    // ========================================
    // LEAD MANAGEMENT
    // ========================================
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      label: 'Estado',
      options: [
        { label: 'Nuevo', value: 'new' },
        { label: 'Contactado', value: 'contacted' },
        { label: 'Cualificado', value: 'qualified' },
        { label: 'Convertido', value: 'converted' },
        { label: 'No Cualificado', value: 'unqualified' },
        { label: 'Perdido', value: 'lost' },
      ],
      admin: {
        description: 'Estado actual del lead en el proceso de conversión',
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'web_form',
      required: true,
      label: 'Fuente',
      options: [
        { label: 'Formulario Web', value: 'web_form' },
        { label: 'Teléfono', value: 'phone' },
        { label: 'Email', value: 'email' },
        { label: 'Evento', value: 'event' },
        { label: 'Referido', value: 'referral' },
        { label: 'Redes Sociales', value: 'social_media' },
        { label: 'Publicidad Pagada', value: 'paid_ads' },
        { label: 'Orgánico', value: 'organic' },
        { label: 'Otro', value: 'other' },
      ],
      admin: {
        description: 'Canal de origen del lead',
        position: 'sidebar',
      },
    },
    {
      name: 'assigned_to',
      type: 'relationship',
      relationTo: 'users',
      label: 'Asignado A',
      admin: {
        description: 'Asesor responsable del seguimiento del lead',
        position: 'sidebar',
      },
    },
    {
      name: 'lead_score',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 100,
      label: 'Puntuación de Lead',
      admin: {
        description:
          'Puntuación de calidad del lead 0-100 (calculado automáticamente, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
        step: 1,
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // System-managed only (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection: Updated only by calculateLeadScoreHook
    },
    {
      name: 'contacted_at',
      type: 'date',
      label: 'Fecha de Primer Contacto',
      admin: {
        description: 'Fecha y hora del primer contacto con el lead',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
    {
      name: 'converted_to_student',
      type: 'relationship',
      relationTo: 'students',
      label: 'Convertido a Estudiante',
      admin: {
        description: 'Estudiante creado cuando el lead se convirtió',
        position: 'sidebar',
      },
    },
    {
      name: 'conversion_date',
      type: 'date',
      label: 'Fecha de Conversión',
      admin: {
        description: 'Fecha y hora de conversión a estudiante (auto-set, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // System-managed only (SP-001 Layer 2)
        update: () => false,
      },
      // Auto-set and Layer 3 protection in trackConversionHook
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas Administrativas',
      admin: {
        description: 'Notas internas sobre el lead (solo visible para admin, gestor, asesor)',
      },
      access: {
        read: ({ req: { user } }) => {
          if (!user) return false;
          return ['admin', 'gestor', 'asesor'].includes(user.role);
        },
      },
    },

    // ========================================
    // ACTIVE STATUS (Soft Delete)
    // ========================================
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Activo',
      admin: {
        description: 'Lead activo y visible (desmarcar para desactivar - soft delete)',
        position: 'sidebar',
      },
    },
  ],

  // Timestamps (createdAt, updatedAt)
  timestamps: true,
};

export default Leads;
