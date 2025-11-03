import type { CollectionConfig } from 'payload';
import {
  canReadStudents,
  canCreateStudents,
  canUpdateStudents,
  canDeleteStudents,
  nonPIIFieldAccess,
  basicPIIFieldAccess,
  sensitivePIIFieldAccess,
  emergencyContactFieldAccess,
  gdprMetadataFieldAccess,
  demographicsFieldAccess,
  addressFieldAccess,
} from './access';
import {
  validateDNIHook,
  validatePhoneHook,
  validateEmergencyPhoneHook,
  validateAgeHook,
  validateEmergencyContactHook,
  captureConsentMetadataHook,
  generateStudentIDHook,
  trackCreator,
} from './hooks';

/**
 * Students Collection (Estudiantes)
 *
 * Manages learner profiles with MAXIMUM GDPR compliance and PII protection.
 * This is the MOST CRITICAL collection requiring highest security standards.
 *
 * Features:
 * - 31 fields covering all student data (15+ PII fields)
 * - 6-tier RBAC with field-level PII access control
 * - Spanish-specific validation (DNI checksum, phone format, age >= 16)
 * - GDPR consent metadata capture (timestamp + IP address)
 * - Emergency contact validation (all or nothing rule)
 * - Auto-generated unique student IDs (STU-YYYYMMDD-XXXX)
 * - Soft delete via active flag
 *
 * Security Patterns:
 * - SP-001: 3-layer immutability for created_by, enrollment_count, student_id
 * - SP-002: MAXIMUM immutability for GDPR consent fields (4 fields)
 * - SP-004: Zero PII in error messages (all hooks compliant)
 * - Field-level access control for 15+ PII fields
 * - Right to be forgotten (admin-only delete)
 * - Consent audit trail (immutable timestamp + IP)
 *
 * Access Control:
 * - Create: admin, gestor, asesor, marketing
 * - Read:
 *   - Public: DENIED (no PII exposure)
 *   - Lectura: Active students (NO PII fields, only student_id/status/enrollment_count)
 *   - Asesor: Active students (ALL fields)
 *   - Marketing: Active students (NO DNI, NO emergency contact)
 *   - Gestor: All students including inactive (ALL fields)
 *   - Admin: All students including inactive (ALL fields)
 * - Update:
 *   - Asesor/Marketing: Only students they created
 *   - Gestor/Admin: All students
 *   - GDPR consent fields: IMMUTABLE (cannot be updated via API)
 * - Delete: admin only (right to be forgotten)
 *
 * PII Fields (15+):
 * - Personal: first_name, last_name, email, phone, dni
 * - Demographics: date_of_birth, gender, nationality
 * - Address: address, city, postal_code, province, country
 * - Emergency: emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
 * - GDPR Metadata: consent_timestamp, consent_ip_address
 */
export const Students: CollectionConfig = {
  slug: 'students',
  admin: {
    useAsTitle: 'last_name',
    defaultColumns: [
      'student_id',
      'last_name',
      'first_name',
      'email',
      'phone',
      'status',
      'enrollment_count',
      'active',
    ],
    group: 'Gestión de Estudiantes',
    description:
      'Gestión de perfiles de estudiantes con protección máxima de datos personales (GDPR)',
  },
  access: {
    create: canCreateStudents,
    read: canReadStudents,
    update: canUpdateStudents,
    delete: canDeleteStudents,
  },
  hooks: {
    beforeChange: [
      generateStudentIDHook,
      captureConsentMetadataHook,
      validateEmergencyContactHook,
    ],
  },
  fields: [
    // ========================================
    // IDENTIFICATION (System-Generated)
    // ========================================
    {
      name: 'student_id',
      type: 'text',
      required: true,
      unique: true,
      label: 'ID de Estudiante',
      index: true,
      admin: {
        description: 'Identificador único (STU-YYYYMMDD-XXXX, generado automáticamente)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
      },
      access: {
        read: nonPIIFieldAccess, // Visible to all authenticated users
        // Immutable after creation (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in generateStudentIDHook
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
        description: 'Nombre del estudiante',
      },
      access: {
        read: basicPIIFieldAccess, // Blocked from lectura
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
        description: 'Apellidos del estudiante',
      },
      access: {
        read: basicPIIFieldAccess, // Blocked from lectura
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
        description: 'Correo electrónico del estudiante (único)',
      },
      access: {
        read: basicPIIFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Teléfono',
      admin: {
        description: 'Teléfono móvil (formato español: +34 XXX XXX XXX)',
        placeholder: '+34 612 345 678',
      },
      hooks: {
        beforeChange: [validatePhoneHook],
      },
      access: {
        read: basicPIIFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'dni',
      type: 'text',
      required: true,
      unique: true,
      label: 'DNI',
      index: true,
      admin: {
        description: 'DNI español (8 dígitos + letra, validación de checksum)',
        placeholder: '12345678Z',
      },
      hooks: {
        beforeChange: [validateDNIHook],
      },
      access: {
        read: sensitivePIIFieldAccess, // Only admin, gestor, asesor
      },
    },

    // ========================================
    // DEMOGRAPHICS (PII)
    // ========================================
    {
      name: 'date_of_birth',
      type: 'date',
      required: true,
      label: 'Fecha de Nacimiento',
      admin: {
        description: 'Fecha de nacimiento (debe tener al menos 16 años)',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
      hooks: {
        beforeChange: [validateAgeHook],
      },
      access: {
        read: demographicsFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Género',
      options: [
        {
          label: 'Masculino',
          value: 'male',
        },
        {
          label: 'Femenino',
          value: 'female',
        },
        {
          label: 'Otro',
          value: 'other',
        },
        {
          label: 'Prefiero no decirlo',
          value: 'prefer_not_to_say',
        },
      ],
      admin: {
        description: 'Género (opcional)',
      },
      access: {
        read: demographicsFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'nationality',
      type: 'text',
      defaultValue: 'España',
      label: 'Nacionalidad',
      admin: {
        description: 'Nacionalidad del estudiante',
      },
      access: {
        read: demographicsFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'language',
      type: 'select',
      defaultValue: 'es',
      label: 'Idioma',
      options: [
        {
          label: 'Español',
          value: 'es',
        },
        {
          label: 'English',
          value: 'en',
        },
        {
          label: 'Català',
          value: 'ca',
        },
      ],
      admin: {
        description: 'Idioma preferido',
        position: 'sidebar',
      },
      access: {
        read: demographicsFieldAccess, // Blocked from lectura
      },
    },

    // ========================================
    // ADDRESS INFORMATION (PII)
    // ========================================
    {
      name: 'address',
      type: 'text',
      label: 'Dirección',
      admin: {
        description: 'Dirección completa (calle, número, piso)',
      },
      access: {
        read: addressFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'city',
      type: 'text',
      label: 'Ciudad',
      admin: {
        description: 'Ciudad de residencia',
      },
      access: {
        read: addressFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'postal_code',
      type: 'text',
      label: 'Código Postal',
      admin: {
        description: 'Código postal (5 dígitos)',
        placeholder: '28001',
      },
      access: {
        read: addressFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'province',
      type: 'text',
      label: 'Provincia',
      admin: {
        description: 'Provincia de residencia',
      },
      access: {
        read: addressFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'country',
      type: 'text',
      defaultValue: 'España',
      label: 'País',
      admin: {
        description: 'País de residencia',
      },
      access: {
        read: addressFieldAccess, // Blocked from lectura
      },
    },
    {
      name: 'address_complete',
      type: 'checkbox',
      defaultValue: false,
      label: 'Dirección Completa',
      admin: {
        description: 'Marca si la dirección está completa y verificada',
        position: 'sidebar',
      },
      access: {
        read: addressFieldAccess, // Blocked from lectura
      },
    },

    // ========================================
    // EMERGENCY CONTACT (PII)
    // ========================================
    {
      name: 'emergency_contact_name',
      type: 'text',
      label: 'Nombre del Contacto de Emergencia',
      admin: {
        description: 'Nombre completo del contacto de emergencia (si se proporciona uno, todos son obligatorios)',
      },
      access: {
        read: emergencyContactFieldAccess, // Only admin, gestor, asesor
      },
    },
    {
      name: 'emergency_contact_phone',
      type: 'text',
      label: 'Teléfono del Contacto de Emergencia',
      admin: {
        description: 'Teléfono del contacto de emergencia (formato español: +34 XXX XXX XXX)',
        placeholder: '+34 687 654 321',
      },
      hooks: {
        beforeChange: [validateEmergencyPhoneHook],
      },
      access: {
        read: emergencyContactFieldAccess, // Only admin, gestor, asesor
      },
    },
    {
      name: 'emergency_contact_relationship',
      type: 'text',
      label: 'Relación del Contacto de Emergencia',
      admin: {
        description: 'Relación con el contacto de emergencia (ejemplo: madre, padre, tutor)',
        placeholder: 'madre',
      },
      access: {
        read: emergencyContactFieldAccess, // Only admin, gestor, asesor
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
      admin: {
        description: 'El estudiante ha dado consentimiento para el tratamiento de datos personales (INMUTABLE)',
        readOnly: true, // UI-level protection (SP-002 Layer 1)
        position: 'sidebar',
      },
      validate: (value) => {
        if (value !== true) {
          return 'GDPR consent is required';
        }
        return true;
      },
      access: {
        read: nonPIIFieldAccess, // Visible to all authenticated users
        // IMMUTABLE after creation (SP-002 Layer 2 - MAXIMUM protection)
        update: () => false,
      },
      // Layer 3 protection in captureConsentMetadataHook
    },
    {
      name: 'privacy_policy_accepted',
      type: 'checkbox',
      required: true,
      label: 'Política de Privacidad Aceptada',
      admin: {
        description: 'El estudiante ha aceptado la política de privacidad (INMUTABLE)',
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
        read: nonPIIFieldAccess, // Visible to all authenticated users
        // IMMUTABLE after creation (SP-002 Layer 2 - MAXIMUM protection)
        update: () => false,
      },
      // Layer 3 protection in captureConsentMetadataHook
    },
    {
      name: 'consent_timestamp',
      type: 'date',
      label: 'Fecha/Hora de Consentimiento',
      admin: {
        description: 'Timestamp de cuando se dio el consentimiento (auto-capturado, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-002 Layer 1)
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm:ss',
        },
      },
      access: {
        read: gdprMetadataFieldAccess, // Only admin, gestor, asesor
        // IMMUTABLE after creation (SP-002 Layer 2 - MAXIMUM protection)
        update: () => false,
      },
      // Auto-set and Layer 3 protection in captureConsentMetadataHook
    },
    {
      name: 'consent_ip_address',
      type: 'text',
      label: 'Dirección IP de Consentimiento',
      admin: {
        description: 'Dirección IP desde donde se dio el consentimiento (auto-capturada, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-002 Layer 1)
        position: 'sidebar',
      },
      access: {
        read: gdprMetadataFieldAccess, // Only admin, gestor, asesor
        // IMMUTABLE after creation (SP-002 Layer 2 - MAXIMUM protection)
        update: () => false,
      },
      // Auto-set and Layer 3 protection in captureConsentMetadataHook
    },
    {
      name: 'marketing_consent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Consentimiento de Marketing',
      admin: {
        description: 'El estudiante acepta recibir comunicaciones de marketing (puede cambiar)',
        position: 'sidebar',
      },
      access: {
        read: nonPIIFieldAccess, // Visible to all authenticated users
        // This field CAN be updated by user (unlike gdpr_consent)
      },
    },

    // ========================================
    // AUDIT TRAIL & SYSTEM FIELDS
    // ========================================
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      label: 'Estado',
      options: [
        {
          label: 'Activo',
          value: 'active',
        },
        {
          label: 'Inactivo',
          value: 'inactive',
        },
        {
          label: 'Suspendido',
          value: 'suspended',
        },
        {
          label: 'Graduado',
          value: 'graduated',
        },
      ],
      admin: {
        description: 'Estado actual del estudiante',
        position: 'sidebar',
      },
      access: {
        read: nonPIIFieldAccess, // Visible to all authenticated users
      },
    },
    {
      name: 'enrollment_count',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Número de Inscripciones',
      admin: {
        description: 'Número total de inscripciones del estudiante (gestionado por el sistema, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
        step: 1,
      },
      access: {
        read: nonPIIFieldAccess, // Visible to all authenticated users
        // System-managed only (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection: Updated only by enrollment hooks, never directly
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas Administrativas',
      admin: {
        description: 'Notas internas sobre el estudiante (solo visible para admin y gestor)',
      },
      access: {
        read: ({ req: { user } }) => {
          if (!user) return false;
          // Only admin and gestor can read notes
          return ['admin', 'gestor'].includes(user.role);
        },
      },
    },
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Creado Por',
      admin: {
        description: 'Usuario que creó este perfil (INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [trackCreator],
      },
      access: {
        read: nonPIIFieldAccess, // Visible to all authenticated users
        // Immutable after creation (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in trackCreator hook
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
        description: 'Estudiante activo y visible (desmarcar para desactivar - soft delete)',
        position: 'sidebar',
      },
      access: {
        read: nonPIIFieldAccess, // Visible to all authenticated users
      },
    },
  ],

  // Timestamps (createdAt, updatedAt)
  timestamps: true,
};

export default Students;
