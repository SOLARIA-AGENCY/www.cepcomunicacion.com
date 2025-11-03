import type { CollectionConfig } from 'payload';
import {
  canReadEnrollments,
  canCreateEnrollments,
  canUpdateEnrollments,
  canDeleteEnrollments,
  financialFieldUpdateAccess,
  financialFieldReadAccess,
  readOnlyFieldAccess,
} from './access';
import {
  validateUniqueEnrollment,
  validateFinancialAmounts,
  validateStatusTransitions,
  validateAcademicRequirements,
  calculatePaymentStatus,
  generateEnrollmentID,
  trackCreator,
  setEnrollmentTimestamps,
  setCertificateIssueDate,
  updateCourseRunCapacity,
} from './hooks';

/**
 * Enrollments Collection (Inscripciones)
 *
 * Manages student registrations in course runs with financial tracking and academic records.
 * This is a CRITICAL collection requiring maximum financial data protection.
 *
 * Features:
 * - 30 fields covering all enrollment data (6 financial fields)
 * - 6-tier RBAC with field-level permissions for financial data
 * - Comprehensive validation (financial, status workflow, academic requirements)
 * - Relationships with Students, CourseRuns, and Users
 * - Auto-generated unique enrollment IDs (ENR-YYYYMMDD-XXXX)
 * - System-managed capacity tracking
 * - Status workflow enforcement
 * - Academic tracking (grades, attendance, certificates)
 * - Soft delete via active flag
 *
 * Security Patterns:
 * - SP-001: 3-layer immutability for 7 fields (timestamps + certificate)
 * - SP-004: Zero PII/financial data in error messages
 * - Field-level access control for 6 financial fields (Admin/Gestor only)
 * - Capacity enforcement with real-time checks
 * - Status workflow validation
 *
 * Financial Fields (6 - Protected):
 * - total_amount, amount_paid, financial_aid_amount
 * - financial_aid_approved, payment_method, payment_reference
 *
 * Immutable Fields (7 - SP-001):
 * - created_by, enrolled_at, confirmed_at, completed_at, cancelled_at
 * - certificate_issued (once true), certificate_url (once set)
 *
 * Access Control:
 * - Create: admin, gestor, asesor, marketing
 * - Read:
 *   - Public: DENIED
 *   - Lectura: All active enrollments (read-only)
 *   - Asesor/Marketing: All enrollments
 *   - Gestor/Admin: All enrollments
 * - Update:
 *   - Asesor: Status and notes only
 *   - Marketing: Notes only
 *   - Gestor: All except some financial fields
 *   - Admin: All fields
 * - Delete: admin only
 *
 * Status Workflow:
 * - pending → confirmed, waitlisted, cancelled
 * - confirmed → completed, cancelled, withdrawn
 * - waitlisted → confirmed, cancelled
 * - completed → TERMINAL (no transitions)
 * - cancelled → pending (revert allowed)
 * - withdrawn → confirmed (revert allowed)
 */
export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'enrollment_id',
    defaultColumns: [
      'enrollment_id',
      'student',
      'course_run',
      'status',
      'payment_status',
      'total_amount',
      'amount_paid',
      'active',
    ],
    group: 'Gestión Académica',
    description:
      'Gestión de inscripciones de estudiantes con seguimiento financiero y académico',
  },
  access: {
    create: canCreateEnrollments,
    read: canReadEnrollments,
    update: canUpdateEnrollments,
    delete: canDeleteEnrollments,
  },
  hooks: {
    beforeChange: [
      generateEnrollmentID,
      trackCreator,
      validateFinancialAmounts,
      validateStatusTransitions,
      validateAcademicRequirements,
      calculatePaymentStatus,
      setEnrollmentTimestamps,
      setCertificateIssueDate,
    ],
    afterChange: [updateCourseRunCapacity],
  },
  fields: [
    // ========================================
    // IDENTIFICATION (System-Generated)
    // ========================================
    {
      name: 'enrollment_id',
      type: 'text',
      required: true,
      unique: true,
      label: 'ID de Inscripción',
      index: true,
      admin: {
        description:
          'Identificador único de inscripción (ENR-YYYYMMDD-XXXX, generado automáticamente)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
      },
      access: {
        read: readOnlyFieldAccess,
        // Immutable after creation (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in generateEnrollmentID hook
    },

    // ========================================
    // RELATIONSHIPS
    // ========================================
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'students',
      required: true,
      label: 'Estudiante',
      admin: {
        description: 'Estudiante inscrito (requerido)',
      },
      hooks: {
        beforeChange: [validateUniqueEnrollment],
      },
    },
    {
      name: 'course_run',
      type: 'relationship',
      relationTo: 'course-runs',
      required: true,
      label: 'Convocatoria',
      admin: {
        description: 'Convocatoria del curso (requerido)',
      },
      hooks: {
        beforeChange: [validateUniqueEnrollment],
      },
    },
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Creado Por',
      admin: {
        description: 'Usuario que creó esta inscripción (INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
      },
      access: {
        read: readOnlyFieldAccess,
        // Immutable after creation (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in trackCreator hook
    },

    // ========================================
    // ENROLLMENT MANAGEMENT
    // ========================================
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Estado',
      options: [
        {
          label: 'Pendiente',
          value: 'pending',
        },
        {
          label: 'Confirmada',
          value: 'confirmed',
        },
        {
          label: 'En Lista de Espera',
          value: 'waitlisted',
        },
        {
          label: 'Completada',
          value: 'completed',
        },
        {
          label: 'Cancelada',
          value: 'cancelled',
        },
        {
          label: 'Retirada',
          value: 'withdrawn',
        },
      ],
      admin: {
        description: 'Estado actual de la inscripción',
        position: 'sidebar',
      },
    },
    {
      name: 'enrolled_at',
      type: 'date',
      label: 'Fecha de Inscripción',
      admin: {
        description: 'Fecha en que se realizó la inscripción (auto-capturada, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
      access: {
        read: readOnlyFieldAccess,
        // Immutable after creation (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in setEnrollmentTimestamps hook
    },
    {
      name: 'confirmed_at',
      type: 'date',
      label: 'Fecha de Confirmación',
      admin: {
        description: 'Fecha en que se confirmó la inscripción (auto-capturada, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
      access: {
        read: readOnlyFieldAccess,
        // Immutable once set (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in setEnrollmentTimestamps hook
    },
    {
      name: 'completed_at',
      type: 'date',
      label: 'Fecha de Finalización',
      admin: {
        description: 'Fecha en que se completó la inscripción (auto-capturada, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
      access: {
        read: readOnlyFieldAccess,
        // Immutable once set (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in setEnrollmentTimestamps hook
    },
    {
      name: 'cancelled_at',
      type: 'date',
      label: 'Fecha de Cancelación',
      admin: {
        description: 'Fecha en que se canceló/retiró la inscripción (auto-capturada, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
      access: {
        read: readOnlyFieldAccess,
        // Immutable once set (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in setEnrollmentTimestamps hook
    },

    // ========================================
    // FINANCIAL INFORMATION (PROTECTED)
    // ========================================
    {
      name: 'total_amount',
      type: 'number',
      required: true,
      min: 0,
      label: 'Importe Total (€)',
      admin: {
        description: 'Importe total de la inscripción en euros (máximo 2 decimales)',
        step: 0.01,
      },
      access: {
        read: financialFieldReadAccess, // Admin, Gestor, Asesor
        update: financialFieldUpdateAccess, // Admin, Gestor only
      },
    },
    {
      name: 'amount_paid',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Importe Pagado (€)',
      admin: {
        description: 'Importe pagado hasta el momento (debe ser <= importe total)',
        step: 0.01,
      },
      access: {
        read: financialFieldReadAccess, // Admin, Gestor, Asesor
        update: financialFieldUpdateAccess, // Admin, Gestor only
      },
    },
    {
      name: 'payment_status',
      type: 'select',
      label: 'Estado de Pago',
      options: [
        {
          label: 'Sin Pagar',
          value: 'unpaid',
        },
        {
          label: 'Pago Parcial',
          value: 'partial',
        },
        {
          label: 'Pagado',
          value: 'paid',
        },
        {
          label: 'Reembolsado',
          value: 'refunded',
        },
      ],
      admin: {
        description: 'Estado de pago (calculado automáticamente, solo lectura)',
        readOnly: true, // UI-level protection
        position: 'sidebar',
      },
      access: {
        read: financialFieldReadAccess,
        // Read-only, auto-calculated
        update: () => false,
      },
      // Auto-calculated in calculatePaymentStatus hook
    },
    {
      name: 'financial_aid_requested',
      type: 'checkbox',
      defaultValue: false,
      label: 'Ayuda Financiera Solicitada',
      admin: {
        description: 'El estudiante ha solicitado ayuda financiera',
        position: 'sidebar',
      },
      access: {
        read: financialFieldReadAccess,
        update: financialFieldUpdateAccess,
      },
    },
    {
      name: 'financial_aid_amount',
      type: 'number',
      min: 0,
      label: 'Importe de Ayuda Financiera (€)',
      admin: {
        description: 'Importe de la ayuda financiera solicitada/aprobada (debe ser <= importe total)',
        step: 0.01,
        condition: (data) => data.financial_aid_requested === true,
      },
      access: {
        read: financialFieldReadAccess,
        update: financialFieldUpdateAccess,
      },
    },
    {
      name: 'financial_aid_approved',
      type: 'checkbox',
      defaultValue: false,
      label: 'Ayuda Financiera Aprobada',
      admin: {
        description: 'La ayuda financiera ha sido aprobada',
        position: 'sidebar',
        condition: (data) => data.financial_aid_requested === true,
      },
      access: {
        read: financialFieldReadAccess,
        update: financialFieldUpdateAccess,
      },
    },

    // ========================================
    // ACADEMIC TRACKING
    // ========================================
    {
      name: 'attendance_percentage',
      type: 'number',
      min: 0,
      max: 100,
      label: 'Porcentaje de Asistencia (%)',
      admin: {
        description: 'Porcentaje de asistencia del estudiante (0-100, requerido si completado)',
        step: 0.1,
      },
    },
    {
      name: 'final_grade',
      type: 'number',
      min: 0,
      max: 100,
      label: 'Calificación Final',
      admin: {
        description: 'Calificación final del estudiante (0-100, requerido si completado)',
        step: 0.1,
      },
    },
    {
      name: 'certificate_issued',
      type: 'checkbox',
      defaultValue: false,
      label: 'Certificado Emitido',
      admin: {
        description: 'Se ha emitido el certificado (INMUTABLE una vez marcado)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
      },
      access: {
        read: readOnlyFieldAccess,
        // Immutable once true (SP-001 Layer 2)
        update: ({ data, siblingData }) => {
          // Allow setting to true, but not back to false
          if (data?.certificate_issued === true) {
            return false;
          }
          return true;
        },
      },
      // Layer 3 protection in setEnrollmentTimestamps hook
    },
    {
      name: 'certificate_url',
      type: 'text',
      label: 'URL del Certificado',
      admin: {
        description: 'URL del certificado emitido (INMUTABLE una vez establecida)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        condition: (data) => data.certificate_issued === true,
      },
      validate: (value) => {
        if (value && !value.match(/^https?:\/\/.+/)) {
          return 'URL must be a valid HTTP/HTTPS URL';
        }
        return true;
      },
      access: {
        read: readOnlyFieldAccess,
        // Immutable once set (SP-001 Layer 2)
        update: ({ siblingData }) => {
          // Allow setting initially, but not changing
          if (siblingData?.certificate_url) {
            return false;
          }
          return true;
        },
      },
      // Layer 3 protection in setEnrollmentTimestamps hook
    },
    {
      name: 'certificate_issued_at',
      type: 'date',
      label: 'Fecha de Emisión del Certificado',
      admin: {
        description: 'Fecha de emisión del certificado (auto-capturada, INMUTABLE)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
        condition: (data) => data.certificate_issued === true,
      },
      access: {
        read: readOnlyFieldAccess,
        // Immutable once set (SP-001 Layer 2)
        update: () => false,
      },
      // Layer 3 protection in setCertificateIssueDate hook
    },

    // ========================================
    // ADMINISTRATIVE
    // ========================================
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas Administrativas',
      admin: {
        description: 'Notas internas sobre la inscripción',
      },
    },
    {
      name: 'internal_notes',
      type: 'textarea',
      label: 'Notas Internas (Admin)',
      admin: {
        description: 'Notas internas visibles solo para administradores',
      },
      access: {
        read: ({ req: { user } }) => {
          if (!user) return false;
          return user.role === 'admin';
        },
        update: ({ req: { user } }) => {
          if (!user) return false;
          return user.role === 'admin';
        },
      },
    },
    {
      name: 'payment_method',
      type: 'select',
      label: 'Método de Pago',
      options: [
        {
          label: 'Transferencia Bancaria',
          value: 'transfer',
        },
        {
          label: 'Tarjeta de Crédito/Débito',
          value: 'card',
        },
        {
          label: 'Efectivo',
          value: 'cash',
        },
        {
          label: 'Ayuda Financiera',
          value: 'financial_aid',
        },
        {
          label: 'Otro',
          value: 'other',
        },
      ],
      admin: {
        description: 'Método de pago utilizado',
      },
      access: {
        read: financialFieldReadAccess,
        update: financialFieldUpdateAccess,
      },
    },
    {
      name: 'payment_reference',
      type: 'text',
      label: 'Referencia de Pago',
      admin: {
        description: 'Referencia o número de transacción del pago',
      },
      access: {
        read: financialFieldReadAccess,
        update: financialFieldUpdateAccess,
      },
    },
    {
      name: 'waitlist_position',
      type: 'number',
      min: 1,
      label: 'Posición en Lista de Espera',
      admin: {
        description: 'Posición en la lista de espera (auto-calculada)',
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data.status === 'waitlisted',
      },
    },
    {
      name: 'notification_sent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Notificación Enviada',
      admin: {
        description: 'Se ha enviado notificación al estudiante',
        position: 'sidebar',
      },
    },
    {
      name: 'notification_sent_at',
      type: 'date',
      label: 'Fecha de Envío de Notificación',
      admin: {
        description: 'Fecha y hora de envío de la notificación',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
        condition: (data) => data.notification_sent === true,
      },
    },

    // ========================================
    // ACTIVE STATUS (Soft Delete)
    // ========================================
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Activa',
      admin: {
        description: 'Inscripción activa y visible (desmarcar para desactivar - soft delete)',
        position: 'sidebar',
      },
    },
  ],

  // Timestamps (createdAt, updatedAt)
  timestamps: true,
};

export default Enrollments;
