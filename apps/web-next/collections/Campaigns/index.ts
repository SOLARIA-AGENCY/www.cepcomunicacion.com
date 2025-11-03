import type { CollectionConfig } from 'payload';
import {
  canCreateCampaigns,
  canReadCampaigns,
  canUpdateCampaigns,
  canDeleteCampaigns,
} from './access';
import {
  validateDates,
  validateUTMParameters,
  validateTargets,
  validateStatusWorkflow,
  trackCampaignCreator,
  calculateCampaignMetrics,
} from './hooks';
import { utmFieldValidator } from './validators/utmFormatValidator';

/**
 * Campaigns Collection
 *
 * Marketing campaign management with UTM tracking, budget allocation, and ROI analytics.
 *
 * Features:
 * - 20 fields covering campaign lifecycle and analytics
 * - UTM parameter tracking for attribution
 * - Budget and target metrics management
 * - Auto-calculated ROI metrics (leads, conversions, rates, costs)
 * - 6-tier RBAC with ownership-based permissions
 * - Status workflow enforcement (draft -> active -> completed -> archived)
 * - Performance-optimized analytics (<100ms for 10,000 leads)
 *
 * Security Patterns:
 * - SP-001: 5 immutable fields (created_by, total_leads, total_conversions, conversion_rate, cost_per_lead)
 * - SP-004: No business intelligence in error logs
 * - Business intelligence protection (no public access)
 *
 * Access Control:
 * - Create: marketing, gestor, admin
 * - Read: All authenticated users (lectura, asesor, marketing, gestor, admin)
 * - Update:
 *   - Marketing: Own campaigns only (created_by = user.id)
 *   - Gestor/Admin: All campaigns
 * - Delete: gestor, admin only
 *
 * Calculated Metrics (System-Managed):
 * - total_leads: COUNT(leads WHERE campaign = this)
 * - total_conversions: COUNT(DISTINCT students with enrollments WHERE lead.campaign = this)
 * - conversion_rate: (conversions / leads) * 100
 * - cost_per_lead: budget / leads
 */
export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'campaign_type',
      'status',
      'start_date',
      'end_date',
      'total_leads',
      'conversion_rate',
      'active',
    ],
    group: 'Marketing',
    description:
      'Gestión de campañas de marketing con seguimiento UTM y análisis de ROI',
  },
  access: {
    create: canCreateCampaigns,
    read: canReadCampaigns,
    update: canUpdateCampaigns,
    delete: canDeleteCampaigns,
  },
  hooks: {
    beforeChange: [
      // Validation hooks
      validateDates, // Validate date logic
      validateUTMParameters, // Validate UTM requirements
      validateTargets, // Validate target metrics
      validateStatusWorkflow, // Enforce status workflow
    ],
    beforeCreate: [
      trackCampaignCreator, // Auto-populate created_by
    ],
    beforeUpdate: [
      trackCampaignCreator, // Enforce created_by immutability
    ],
    afterChange: [
      calculateCampaignMetrics, // Calculate analytics (performance optimized)
    ],
  },
  fields: [
    // ========================================
    // BASIC INFORMATION (5 fields)
    // ========================================
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 100,
      label: 'Nombre de Campaña',
      index: true,
      admin: {
        description: 'Nombre descriptivo de la campaña (único, 3-100 caracteres)',
        placeholder: 'Ej: Summer 2025 Facebook Ads',
      },
    },
    {
      name: 'campaign_type',
      type: 'select',
      required: true,
      defaultValue: 'organic',
      label: 'Tipo de Campaña',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Redes Sociales', value: 'social' },
        { label: 'Publicidad Pagada', value: 'paid_ads' },
        { label: 'Orgánico', value: 'organic' },
        { label: 'Evento', value: 'event' },
        { label: 'Referidos', value: 'referral' },
        { label: 'Otro', value: 'other' },
      ],
      admin: {
        description: 'Tipo de campaña de marketing',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Estado',
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Activa', value: 'active' },
        { label: 'Pausada', value: 'paused' },
        { label: 'Completada', value: 'completed' },
        { label: 'Archivada', value: 'archived' },
      ],
      admin: {
        description:
          'Estado de la campaña (archivada es terminal - no se puede cambiar)',
        position: 'sidebar',
      },
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
      label: 'Fecha de Inicio',
      admin: {
        description: 'Fecha de inicio de la campaña',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'end_date',
      type: 'date',
      label: 'Fecha de Fin',
      admin: {
        description: 'Fecha de fin de la campaña (opcional, debe ser >= fecha de inicio)',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },

    // ========================================
    // BUDGET & TARGETS (3 fields)
    // ========================================
    {
      name: 'budget',
      type: 'number',
      label: 'Presupuesto (€)',
      min: 0,
      admin: {
        description: 'Presupuesto total de la campaña en euros',
        placeholder: '5000.00',
        step: 0.01,
      },
    },
    {
      name: 'target_leads',
      type: 'number',
      label: 'Objetivo de Leads',
      min: 0,
      admin: {
        description: 'Número objetivo de leads a capturar',
        placeholder: '100',
        step: 1,
      },
      validate: (value) => {
        if (value !== null && value !== undefined && !Number.isInteger(value)) {
          return 'Target leads must be an integer';
        }
        return true;
      },
    },
    {
      name: 'target_enrollments',
      type: 'number',
      label: 'Objetivo de Matrículas',
      min: 0,
      admin: {
        description: 'Número objetivo de matrículas (debe ser <= objetivo de leads)',
        placeholder: '20',
        step: 1,
      },
      validate: (value) => {
        if (value !== null && value !== undefined && !Number.isInteger(value)) {
          return 'Target enrollments must be an integer';
        }
        return true;
      },
    },

    // ========================================
    // UTM TRACKING (5 fields)
    // ========================================
    {
      name: 'utm_source',
      type: 'text',
      label: 'UTM Source',
      admin: {
        description: 'Fuente de tráfico (ej: facebook, google, email)',
        placeholder: 'facebook',
      },
      validate: utmFieldValidator,
    },
    {
      name: 'utm_medium',
      type: 'text',
      label: 'UTM Medium',
      admin: {
        description: 'Medio de marketing (ej: cpc, email, social)',
        placeholder: 'cpc',
      },
      validate: utmFieldValidator,
    },
    {
      name: 'utm_campaign',
      type: 'text',
      label: 'UTM Campaign',
      admin: {
        description: 'Nombre de campaña UTM (REQUERIDO si se usa cualquier parámetro UTM)',
        placeholder: 'summer-2025',
      },
      validate: utmFieldValidator,
    },
    {
      name: 'utm_term',
      type: 'text',
      label: 'UTM Term',
      admin: {
        description: 'Término de búsqueda pagada (opcional)',
        placeholder: 'curso-online',
      },
      validate: utmFieldValidator,
    },
    {
      name: 'utm_content',
      type: 'text',
      label: 'UTM Content',
      admin: {
        description: 'Identificador de contenido para test A/B (opcional)',
        placeholder: 'variant-a',
      },
      validate: utmFieldValidator,
    },

    // ========================================
    // RELATIONSHIPS (2 fields)
    // ========================================
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      label: 'Curso',
      admin: {
        description: 'Curso asociado a la campaña (opcional)',
      },
    },
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Creado Por',
      index: true,
      admin: {
        description: 'Usuario que creó la campaña (auto-asignado, INMUTABLE)',
        readOnly: true, // SP-001 Layer 1: UI protection
        position: 'sidebar',
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // SP-001 Layer 2: Access control protection
        update: () => false,
      },
      // SP-001 Layer 3: Hook protection in trackCampaignCreator
    },

    // ========================================
    // CALCULATED METRICS (4 fields) - SP-001 IMMUTABLE
    // ========================================
    {
      name: 'total_leads',
      type: 'number',
      defaultValue: 0,
      label: 'Total de Leads',
      admin: {
        description: 'Número total de leads capturados (calculado automáticamente, INMUTABLE)',
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
      name: 'total_conversions',
      type: 'number',
      defaultValue: 0,
      label: 'Total de Conversiones',
      admin: {
        description: 'Número de conversiones a estudiantes (calculado automáticamente, INMUTABLE)',
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
      name: 'conversion_rate',
      type: 'number',
      label: 'Tasa de Conversión (%)',
      admin: {
        description: 'Porcentaje de conversión (calculado automáticamente, INMUTABLE)',
        readOnly: true, // SP-001 Layer 1
        position: 'sidebar',
        step: 0.01,
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // SP-001 Layer 2: System-managed only
        update: () => false,
      },
    },
    {
      name: 'cost_per_lead',
      type: 'number',
      label: 'Coste por Lead (€)',
      admin: {
        description: 'Coste por lead capturado (calculado automáticamente, INMUTABLE)',
        readOnly: true, // SP-001 Layer 1
        position: 'sidebar',
        step: 0.01,
      },
      access: {
        read: ({ req: { user } }) => !!user,
        // SP-001 Layer 2: System-managed only
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
      label: 'Activo',
      admin: {
        description: 'Campaña activa y visible (desmarcar para soft delete)',
        position: 'sidebar',
      },
    },
  ],

  // Timestamps (createdAt, updatedAt)
  timestamps: true,
};

export default Campaigns;
