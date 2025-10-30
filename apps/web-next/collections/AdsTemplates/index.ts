import type { CollectionConfig } from 'payload';
import {
  canCreateAdsTemplates,
  canReadAdsTemplates,
  canUpdateAdsTemplates,
  canDeleteAdsTemplates,
} from './access';
import {
  validateURLFields,
  validateStatusWorkflow,
  validateLLMFields,
  validateHashtags,
  trackTemplateCreator,
  autoIncrementVersion,
  validateUsageFields,
  setArchivedTimestamp,
} from './hooks';
import { payloadURLValidator } from './validators/urlValidator';

/**
 * AdsTemplates Collection
 *
 * Marketing ad template management with multi-language support, version tracking,
 * and LLM-generated content storage.
 *
 * Features:
 * - 25 fields covering all template metadata
 * - 6-tier RBAC with ownership-based permissions (Marketing role)
 * - Multi-language support (Spanish, English, Catalan)
 * - Version tracking and template cloning
 * - LLM integration tracking (model, prompt, generated flag)
 * - Usage analytics (count, last_used_at)
 * - Status workflow with terminal archived state
 * - Security-hardened URL validation (multi-layer)
 * - Hashtag management for social media
 *
 * Security:
 * - SP-001: 5-layer immutability for created_by, version, usage_count, last_used_at, archived_at
 * - SP-004: No PII in logs (template IDs only)
 * - URL validation: RFC-compliant, triple slash detection, control character blocking,
 *   @ symbol prevention, URL constructor validation
 * - Field-level access control
 * - Ownership constraint for Marketing role
 *
 * Access Control:
 * - Create: admin, gestor, marketing
 * - Read:
 *   - Public: DENIED (business intelligence protection)
 *   - Lectura: Active templates only
 *   - Asesor: Active templates only
 *   - Marketing: Active templates only
 *   - Admin/Gestor: All templates (including inactive)
 * - Update:
 *   - Admin/Gestor: All templates
 *   - Marketing: Only templates they created (created_by = user.id)
 * - Delete: admin, gestor only (Marketing uses soft delete)
 *
 * Template Types:
 * - email: Email marketing campaigns
 * - social_post: Social media posts (Facebook, Instagram, LinkedIn)
 * - display_ad: Display advertising (Meta Ads, Google Ads)
 * - landing_page: Landing page copy
 * - video_script: Video marketing scripts
 * - other: Custom template types
 *
 * Status Workflow:
 * - draft: Template in progress
 * - active: Template ready for use
 * - archived: Template archived (TERMINAL STATE - cannot reactivate)
 */
export const AdsTemplates: CollectionConfig = {
  slug: 'ads-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'template_type',
      'status',
      'language',
      'campaign',
      'usage_count',
      'active',
    ],
    group: 'Marketing',
    description:
      'Gestión de plantillas de marketing con soporte multiidioma, versionado y seguimiento de contenido generado por LLM',
  },
  access: {
    create: canCreateAdsTemplates,
    read: canReadAdsTemplates,
    update: canUpdateAdsTemplates,
    delete: canDeleteAdsTemplates,
  },
  hooks: {
    beforeChange: [
      validateURLFields,
      validateStatusWorkflow,
      validateLLMFields,
      validateHashtags,
    ],
  },
  fields: [
    // ========================================
    // IDENTIFICATION
    // ========================================
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 100,
      label: 'Nombre de la Plantilla',
      admin: {
        description: 'Nombre descriptivo único para esta plantilla (3-100 caracteres)',
      },
    },

    // ========================================
    // TEMPLATE CLASSIFICATION
    // ========================================
    {
      name: 'template_type',
      type: 'select',
      required: true,
      defaultValue: 'social_post',
      label: 'Tipo de Plantilla',
      options: [
        {
          label: 'Email Marketing',
          value: 'email',
        },
        {
          label: 'Publicación en Redes Sociales',
          value: 'social_post',
        },
        {
          label: 'Anuncio Display',
          value: 'display_ad',
        },
        {
          label: 'Landing Page',
          value: 'landing_page',
        },
        {
          label: 'Guión de Video',
          value: 'video_script',
        },
        {
          label: 'Otro',
          value: 'other',
        },
      ],
      admin: {
        description: 'Tipo de plantilla de marketing',
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
        {
          label: 'Borrador',
          value: 'draft',
        },
        {
          label: 'Activo',
          value: 'active',
        },
        {
          label: 'Archivado (Terminal)',
          value: 'archived',
        },
      ],
      admin: {
        description:
          'Estado de la plantilla. NOTA: "Archivado" es un estado terminal (no se puede reactivar)',
        position: 'sidebar',
      },
    },
    {
      name: 'language',
      type: 'select',
      required: true,
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
        description: 'Idioma del contenido de la plantilla (ISO 639-1)',
        position: 'sidebar',
      },
    },

    // ========================================
    // CONTENT
    // ========================================
    {
      name: 'headline',
      type: 'text',
      required: true,
      minLength: 5,
      maxLength: 100,
      label: 'Título/Headline',
      admin: {
        description: 'Título principal del anuncio (5-100 caracteres, usado para headlines de Meta Ads)',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      minLength: 10,
      maxLength: 2000,
      label: 'Cuerpo del Anuncio',
      admin: {
        description: 'Contenido principal del anuncio (10-2000 caracteres)',
      },
    },
    {
      name: 'cta_text',
      type: 'text',
      maxLength: 30,
      label: 'Texto del CTA',
      admin: {
        description: 'Texto del botón de llamada a la acción (máx. 30 caracteres, ej: "Inscríbete", "Más Info")',
      },
    },
    {
      name: 'cta_url',
      type: 'text',
      label: 'URL del CTA',
      validate: payloadURLValidator,
      admin: {
        description: 'URL de destino del CTA (debe ser una URL válida con https:// o http://)',
        placeholder: 'https://example.com/landing-page',
      },
    },
    {
      name: 'hashtags',
      type: 'array',
      label: 'Hashtags',
      maxRows: 20,
      admin: {
        description: 'Hashtags para redes sociales (máx. 20, sin el símbolo #)',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          minLength: 2,
          maxLength: 30,
          label: 'Hashtag',
          admin: {
            description: 'Hashtag sin # (solo alfanuméricos y guiones bajos, 2-30 caracteres)',
            placeholder: 'marketing',
          },
          validate: (value) => {
            if (!value || typeof value !== 'string') {
              return true; // Required validation handles this
            }

            const trimmed = value.trim();
            const pattern = /^[a-zA-Z0-9_]{2,30}$/;

            if (!pattern.test(trimmed)) {
              return 'Hashtag debe contener solo caracteres alfanuméricos y guiones bajos (sin #)';
            }

            if (trimmed.includes('#')) {
              return 'No incluir el símbolo #. Guardar solo el texto (ej: "marketing" en lugar de "#marketing")';
            }

            return true;
          },
        },
      ],
    },

    // ========================================
    // RELATIONSHIPS
    // ========================================
    {
      name: 'campaign',
      type: 'relationship',
      relationTo: 'campaigns',
      label: 'Campaña',
      admin: {
        description: 'Campaña de marketing asociada (opcional)',
        position: 'sidebar',
      },
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      label: 'Curso',
      admin: {
        description: 'Curso al que se dirige esta plantilla (opcional)',
        position: 'sidebar',
      },
    },
    {
      name: 'parent_template',
      type: 'relationship',
      relationTo: 'ads-templates',
      label: 'Plantilla Padre',
      admin: {
        description: 'Plantilla original si esta es una copia o variante',
        position: 'sidebar',
      },
    },

    // ========================================
    // LLM GENERATION TRACKING
    // ========================================
    {
      name: 'llm_generated',
      type: 'checkbox',
      defaultValue: false,
      label: 'Generado por LLM',
      admin: {
        description: 'Indica si el contenido fue generado por un modelo de lenguaje (LLM)',
        position: 'sidebar',
      },
    },
    {
      name: 'llm_model',
      type: 'text',
      maxLength: 100,
      label: 'Modelo LLM',
      admin: {
        description: 'Modelo usado para generación (ej: "gpt-4", "claude-3-opus", "ollama-llama3")',
        condition: (data) => data.llm_generated === true,
      },
    },
    {
      name: 'llm_prompt',
      type: 'textarea',
      maxLength: 1000,
      label: 'Prompt LLM',
      admin: {
        description: 'Prompt usado para generar el contenido (máx. 1000 caracteres)',
        condition: (data) => data.llm_generated === true,
      },
    },

    // ========================================
    // VERSIONING (SP-001 Immutable)
    // ========================================
    {
      name: 'version',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      label: 'Versión',
      admin: {
        description: 'Número de versión (auto-incrementado por el sistema)',
        readOnly: true, // SP-001 Layer 1: UI-level protection
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [autoIncrementVersion],
      },
      access: {
        // SP-001 Layer 2: API-level protection - system-managed only
        update: () => false,
      },
    },

    // ========================================
    // ORGANIZATIONAL METADATA
    // ========================================
    {
      name: 'tags',
      type: 'array',
      label: 'Etiquetas de Organización',
      maxRows: 20,
      admin: {
        description: 'Etiquetas internas para organización (máx. 20, NO son hashtags sociales)',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          minLength: 2,
          maxLength: 30,
          label: 'Etiqueta',
        },
      ],
    },
    {
      name: 'asset_urls',
      type: 'array',
      label: 'URLs de Assets',
      maxRows: 10,
      admin: {
        description: 'URLs de imágenes, videos o documentos asociados (máx. 10)',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL del Asset',
          validate: payloadURLValidator,
          admin: {
            placeholder: 'https://example.com/image.jpg',
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'group',
      label: 'Metadatos Adicionales',
      admin: {
        description: 'Metadatos adicionales para segmentación y análisis',
      },
      fields: [
        {
          name: 'target_audience',
          type: 'text',
          label: 'Audiencia Objetivo',
          admin: {
            description: 'Descripción de la audiencia objetivo (ej: "Estudiantes de FP", "Desempleados")',
          },
        },
        {
          name: 'tone',
          type: 'select',
          label: 'Tono',
          options: [
            {
              label: 'Profesional',
              value: 'professional',
            },
            {
              label: 'Casual',
              value: 'casual',
            },
            {
              label: 'Urgente',
              value: 'urgent',
            },
            {
              label: 'Educativo',
              value: 'educational',
            },
          ],
          admin: {
            description: 'Tono del contenido',
          },
        },
        {
          name: 'platform',
          type: 'select',
          label: 'Plataforma',
          options: [
            {
              label: 'Facebook',
              value: 'facebook',
            },
            {
              label: 'Instagram',
              value: 'instagram',
            },
            {
              label: 'LinkedIn',
              value: 'linkedin',
            },
            {
              label: 'Google Ads',
              value: 'google_ads',
            },
            {
              label: 'Email',
              value: 'email',
            },
            {
              label: 'Otra',
              value: 'other',
            },
          ],
          admin: {
            description: 'Plataforma de publicación prevista',
          },
        },
      ],
    },

    // ========================================
    // USAGE ANALYTICS (SP-001 Immutable)
    // ========================================
    {
      name: 'usage_count',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Usos',
      admin: {
        description: 'Número de veces que se ha usado esta plantilla (gestionado por el sistema)',
        readOnly: true, // SP-001 Layer 1: UI-level protection
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [validateUsageFields],
      },
      access: {
        // SP-001 Layer 2: API-level protection - system-managed only
        update: () => false,
      },
    },
    {
      name: 'last_used_at',
      type: 'date',
      label: 'Último Uso',
      admin: {
        description: 'Fecha del último uso (gestionado por el sistema)',
        readOnly: true, // SP-001 Layer 1: UI-level protection
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
      hooks: {
        beforeChange: [validateUsageFields],
      },
      access: {
        // SP-001 Layer 2: API-level protection - system-managed only
        update: () => false,
      },
    },
    {
      name: 'archived_at',
      type: 'date',
      label: 'Fecha de Archivado',
      admin: {
        description: 'Fecha cuando se archivó la plantilla (gestionado por el sistema)',
        readOnly: true, // SP-001 Layer 1: UI-level protection
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
      hooks: {
        beforeChange: [setArchivedTimestamp],
      },
      access: {
        // SP-001 Layer 2: API-level protection - system-managed only
        update: () => false,
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
        description: 'Usuario que creó esta plantilla (inmutable)',
        readOnly: true, // SP-001 Layer 1: UI-level protection
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [trackTemplateCreator],
      },
      access: {
        // SP-001 Layer 2: API-level protection - immutable field
        update: () => false,
      },
    },

    // ========================================
    // SOFT DELETE
    // ========================================
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Activa',
      admin: {
        description: 'Plantilla activa y visible (desmarcar para desactivar sin eliminar)',
        position: 'sidebar',
      },
    },

    // ========================================
    // INTERNAL NOTES
    // ========================================
    {
      name: 'notes',
      type: 'textarea',
      maxLength: 500,
      label: 'Notas Internas',
      admin: {
        description: 'Notas internas para el equipo (máx. 500 caracteres)',
      },
    },
  ],

  // Timestamps (createdAt, updatedAt)
  timestamps: true,
};

export default AdsTemplates;
