import type { CollectionConfig } from 'payload';
import {
  canReadCourseRuns,
  canCreateCourseRuns,
  canUpdateCourseRuns,
  canDeleteCourseRuns,
} from './access';
import {
  generateSlug,
  validateDates,
  validateCapacity,
  validateSchedule,
  trackCreator,
} from './hooks';

/**
 * CourseRuns Collection (Convocatorias)
 *
 * Manages scheduled instances of courses with enrollment tracking.
 * Each course run represents a specific offering of a course at a particular
 * time, location, and modality.
 *
 * Features:
 * - 18 fields covering all course run metadata
 * - 6-tier RBAC with field-level permissions
 * - Comprehensive validation (dates, capacity, schedule)
 * - Relationships with Courses, Campuses, and Users
 * - Auto-generated slugs from title
 * - System-managed enrollment tracking
 * - Soft delete via active flag
 *
 * Security:
 * - SP-001: 3-layer immutability for created_by
 * - SP-001: System-only current_enrollments
 * - No PII in error messages
 * - Role-based access control
 * - Ownership validation for marketing updates
 *
 * Access Control:
 * - Create: admin, gestor, marketing
 * - Read:
 *   - Public: published + enrollment_open + active only
 *   - Lectura: All active runs
 *   - Asesor/Marketing: All runs
 *   - Admin/Gestor: All runs including inactive
 * - Update:
 *   - Admin/Gestor: All runs
 *   - Marketing: Only runs they created
 * - Delete: admin, gestor only (prefer soft delete)
 */
export const CourseRuns: CollectionConfig = {
  slug: 'course-runs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'course',
      'campus',
      'start_date',
      'status',
      'modality',
      'current_enrollments',
      'active',
    ],
    group: 'Gestión Académica',
    description:
      'Gestión de convocatorias de cursos con seguimiento de inscripciones y control de estado',
  },
  access: {
    create: canCreateCourseRuns,
    read: canReadCourseRuns,
    update: canUpdateCourseRuns,
    delete: canDeleteCourseRuns,
  },
  hooks: {
    beforeChange: [validateDates, validateCapacity, validateSchedule],
  },
  fields: [
    // ========================================
    // IDENTIFICATION
    // ========================================
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título de la Convocatoria',
      admin: {
        description: 'Título descriptivo de esta convocatoria (ejemplo: "Desarrollo Web - Enero 2025")',
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
        description: 'URL amigable (se genera automáticamente del título)',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [generateSlug('title')],
      },
    },

    // ========================================
    // RELATIONSHIPS
    // ========================================
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Curso',
      admin: {
        description: 'Curso del que es esta convocatoria',
      },
    },
    {
      name: 'campus',
      type: 'relationship',
      relationTo: 'campuses',
      label: 'Sede',
      admin: {
        description: 'Sede donde se imparte (opcional para cursos online)',
      },
    },

    // ========================================
    // DATE MANAGEMENT
    // ========================================
    {
      name: 'start_date',
      type: 'date',
      required: true,
      label: 'Fecha de Inicio',
      admin: {
        description: 'Fecha de inicio del curso',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'end_date',
      type: 'date',
      required: true,
      label: 'Fecha de Fin',
      admin: {
        description: 'Fecha de finalización del curso (debe ser posterior a la fecha de inicio)',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'enrollment_deadline',
      type: 'date',
      label: 'Fecha Límite de Inscripción',
      admin: {
        description: 'Fecha límite para inscribirse (debe ser anterior a la fecha de inicio)',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },

    // ========================================
    // CAPACITY MANAGEMENT
    // ========================================
    {
      name: 'min_students',
      type: 'number',
      required: true,
      min: 1,
      label: 'Mínimo de Estudiantes',
      admin: {
        description: 'Número mínimo de estudiantes para que se realice el curso',
        step: 1,
      },
    },
    {
      name: 'max_students',
      type: 'number',
      required: true,
      label: 'Máximo de Estudiantes',
      admin: {
        description: 'Capacidad máxima de estudiantes (debe ser mayor que el mínimo)',
        step: 1,
      },
    },
    {
      name: 'current_enrollments',
      type: 'number',
      defaultValue: 0,
      label: 'Inscripciones Actuales',
      admin: {
        description: 'Número actual de estudiantes inscritos (gestionado por el sistema)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
      },
      access: {
        // API-level protection - system-managed only (SP-001 Layer 2)
        update: () => false,
      },
    },

    // ========================================
    // STATUS AND MODALITY
    // ========================================
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Estado',
      options: [
        {
          label: 'Borrador',
          value: 'draft',
        },
        {
          label: 'Publicada',
          value: 'published',
        },
        {
          label: 'Inscripciones Abiertas',
          value: 'enrollment_open',
        },
        {
          label: 'En Progreso',
          value: 'in_progress',
        },
        {
          label: 'Completada',
          value: 'completed',
        },
        {
          label: 'Cancelada',
          value: 'cancelled',
        },
      ],
      admin: {
        description: 'Estado actual de la convocatoria',
        position: 'sidebar',
      },
    },
    {
      name: 'modality',
      type: 'select',
      required: true,
      label: 'Modalidad',
      options: [
        {
          label: 'Presencial',
          value: 'presencial',
        },
        {
          label: 'Online',
          value: 'online',
        },
        {
          label: 'Híbrido',
          value: 'hibrido',
        },
      ],
      admin: {
        description: 'Modalidad de impartición del curso',
        position: 'sidebar',
      },
    },

    // ========================================
    // SCHEDULE INFORMATION
    // ========================================
    {
      name: 'schedule_days',
      type: 'select',
      hasMany: true,
      label: 'Días de la Semana',
      options: [
        { label: 'Lunes', value: 'monday' },
        { label: 'Martes', value: 'tuesday' },
        { label: 'Miércoles', value: 'wednesday' },
        { label: 'Jueves', value: 'thursday' },
        { label: 'Viernes', value: 'friday' },
        { label: 'Sábado', value: 'saturday' },
        { label: 'Domingo', value: 'sunday' },
      ],
      admin: {
        description: 'Días de la semana en que se imparte el curso',
      },
    },
    {
      name: 'schedule_time_start',
      type: 'text',
      label: 'Hora de Inicio',
      admin: {
        description: 'Hora de inicio de las clases (formato HH:MM, ejemplo: 09:00)',
        placeholder: '09:00',
      },
    },
    {
      name: 'schedule_time_end',
      type: 'text',
      label: 'Hora de Fin',
      admin: {
        description: 'Hora de fin de las clases (formato HH:MM, ejemplo: 13:00)',
        placeholder: '13:00',
      },
    },

    // ========================================
    // PRICING
    // ========================================
    {
      name: 'price',
      type: 'number',
      min: 0,
      label: 'Precio (€)',
      admin: {
        description: 'Precio específico para esta convocatoria (opcional, anula el precio del curso)',
        step: 0.01,
      },
    },

    // ========================================
    // AUDIT TRAIL (CRITICAL - Immutable)
    // ========================================
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Creado Por',
      admin: {
        description: 'Usuario que creó esta convocatoria (inmutable)',
        readOnly: true, // UI-level protection (SP-001 Layer 1)
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [trackCreator],
      },
      access: {
        // API-level protection - immutable field (SP-001 Layer 2)
        update: () => false,
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
        description: 'Convocatoria activa y visible (desmarcar para desactivar)',
        position: 'sidebar',
      },
    },
  ],

  // Timestamps (createdAt, updatedAt)
  timestamps: true,
};

export default CourseRuns;
