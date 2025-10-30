# AdsTemplates Collection

Marketing ad template management with multi-language support, version tracking, and LLM-generated content storage for the CEPComunicacion v2 platform.

## Overview

The AdsTemplates collection manages marketing ad templates across multiple platforms (social media, email, display ads, landing pages, video scripts) with comprehensive support for multi-language content, LLM generation tracking, and usage analytics.

## Features

- **25 Fields**: Complete template metadata coverage
- **6-Tier RBAC**: Role-based access control with ownership constraints
- **Multi-Language Support**: Spanish (es), English (en), Catalan (ca)
- **Version Tracking**: Auto-incremented version numbers with immutability
- **LLM Integration**: Track AI-generated content (model, prompt, generation flag)
- **Usage Analytics**: System-managed usage counts and last-used timestamps
- **Status Workflow**: Terminal archived state prevents reactivation
- **Security-Hardened URL Validation**: Multi-layer validation with XSS/open redirect prevention
- **Hashtag Management**: Social media hashtag validation and storage
- **Asset Management**: Up to 10 asset URLs per template
- **Metadata Groups**: Organized additional context (audience, tone, platform)

## Architecture

```
AdsTemplates/
├── index.ts                    # Main collection definition
├── access/                     # 6-tier RBAC
│   ├── canCreateAdsTemplates.ts
│   ├── canReadAdsTemplates.ts
│   ├── canUpdateAdsTemplates.ts
│   └── canDeleteAdsTemplates.ts
├── hooks/                      # Validation & business logic
│   ├── validateURLFields.ts
│   ├── validateStatusWorkflow.ts
│   ├── validateLLMFields.ts
│   ├── validateHashtags.ts
│   ├── trackTemplateCreator.ts
│   ├── autoIncrementVersion.ts
│   ├── trackUsage.ts
│   └── setArchivedTimestamp.ts
├── validators/
│   └── urlValidator.ts         # RFC-compliant URL validation
└── __tests__/
    └── AdsTemplates.test.ts    # 121 comprehensive tests
```

## Fields (25)

### Identification
- **name** (text, required, unique): Template display name (3-100 chars)

### Classification
- **template_type** (select, required): email, social_post, display_ad, landing_page, video_script, other
- **status** (select, required): draft, active, archived (terminal)
- **language** (select, required): es, en, ca (ISO 639-1)

### Content
- **headline** (text, required): Main headline/title (5-100 chars)
- **body** (textarea, required): Main ad copy (10-2000 chars)
- **cta_text** (text, optional): Call-to-action button text (max 30 chars)
- **cta_url** (text, optional): CTA target URL (validated)
- **hashtags** (array, optional): Social media hashtags (max 20, no # symbol)

### Relationships
- **campaign** (relationship, optional): Many-to-One with Campaigns
- **course** (relationship, optional): Many-to-One with Courses
- **parent_template** (relationship, optional): Self-referential for cloning

### LLM Generation Tracking
- **llm_generated** (checkbox, optional): Flag for LLM-generated content
- **llm_model** (text, optional): Model used (required if llm_generated=true)
- **llm_prompt** (textarea, optional): Prompt used (max 1000 chars)

### Versioning (SP-001 Immutable)
- **version** (number, required): Auto-incremented, starts at 1

### Organizational Metadata
- **tags** (array, optional): Internal organizational tags (max 20)
- **asset_urls** (array, optional): URLs to images/videos/documents (max 10)
- **metadata** (group, optional):
  - **target_audience** (text): Audience description
  - **tone** (select): professional, casual, urgent, educational
  - **platform** (select): facebook, instagram, linkedin, google_ads, email, other

### Usage Analytics (SP-001 Immutable)
- **usage_count** (number, auto): Number of times used (system-managed)
- **last_used_at** (date, auto): Last usage timestamp (system-managed)
- **archived_at** (date, auto): Archival timestamp (system-managed)

### Audit Trail (CRITICAL - Immutable)
- **created_by** (relationship, required): User who created template (SP-001)

### Soft Delete
- **active** (checkbox, required): Active status (default: true)

### Internal Notes
- **notes** (textarea, optional): Internal team notes (max 500 chars)

## Access Control (6-Tier RBAC)

### Create
- **Allowed**: admin, gestor, marketing
- **Denied**: asesor, lectura, public

### Read
- **Public**: DENIED (business intelligence protection)
- **Lectura**: Active templates only (read-only reporting)
- **Asesor**: Active templates only (contextual access)
- **Marketing**: Active templates only
- **Gestor**: All templates (including inactive)
- **Admin**: All templates (including inactive)

### Update
- **Admin**: All templates
- **Gestor**: All templates
- **Marketing**: Own templates only (created_by = user.id)
- **Asesor**: DENIED
- **Lectura**: DENIED (read-only)
- **Public**: DENIED

### Delete
- **Allowed**: admin, gestor
- **Denied**: marketing (use soft delete via active flag), asesor, lectura, public

## Validation Hooks (5)

### 1. validateURLFields (beforeChange)
Validates `cta_url` and `asset_urls` with RFC-compliant regex and security checks:
- RFC-compliant URL format
- Triple slash detection
- Control character blocking
- @ symbol in hostname prevention (open redirect)
- URL constructor validation
- Localhost blocking
- Max 10 asset URLs

**Security**: Multi-layer defense against XSS and open redirect vulnerabilities.

### 2. validateStatusWorkflow (beforeChange)
Enforces status workflow rules:
- Once `status=archived`, cannot transition to any other status (terminal)
- Auto-sets `archived_at` timestamp when transitioning to archived

**Status Flow**:
- draft → active ✓
- draft → archived ✓
- active → draft ✓
- active → archived ✓
- archived → * ✗ (BLOCKED)

### 3. validateLLMFields (beforeChange)
Validates LLM-related fields:
- If `llm_generated=true`, `llm_model` is REQUIRED
- Validates `llm_model` format (alphanumeric, hyphens, underscores, dots)
- Validates `llm_prompt` length (max 1000 characters)

**Error**: "llm_model is required when llm_generated is true"

### 4. validateHashtags (beforeChange)
Validates hashtag format in `hashtags` array:
- Each hashtag: alphanumeric and underscores only (no # symbol)
- Format regex: `^[a-zA-Z0-9_]{2,30}$`
- Min 2, max 30 characters per tag
- Max 20 tags total

**Error**: "Hashtag format invalid (alphanumeric and underscores only)"

### 5. trackTemplateCreator (beforeCreate, beforeUpdate)
Auto-populates and enforces immutability of `created_by`:
- **On create**: Auto-populate with `req.user.id`
- **On update**: Enforce immutability (SP-001 Layer 3)

**SP-001 Defense in Depth**:
- Layer 1: `admin.readOnly = true` (UI protection)
- Layer 2: `access.update = () => false` (API protection)
- Layer 3: Hook validation (this layer)

## Security Patterns

### SP-001: Defense in Depth - Immutability (5 fields)
Three-layer protection for:
- **created_by**: Template creator (audit trail)
- **version**: Version number (system-managed)
- **usage_count**: Usage counter (analytics)
- **last_used_at**: Last usage timestamp (analytics)
- **archived_at**: Archival timestamp (workflow)

**Layers**:
1. UI-level: `admin.readOnly = true`
2. API-level: `access.update = () => false`
3. Hook-level: Validation in hooks

### SP-004: No PII/Business Intelligence in Logs
- Error messages use template IDs only
- No marketing content logged (headlines, body, strategy)
- GDPR-compliant error handling

### URL Validation Security
Six-layer validation for `cta_url` and `asset_urls`:
1. RFC-compliant regex validation
2. Triple slash detection (malformed URLs)
3. Newline/control character blocking (XSS prevention)
4. @ symbol in hostname prevention (open redirect protection)
5. URL constructor validation (catches edge cases)
6. Localhost/loopback blocking (SSRF prevention)

## Usage Examples

### Create a Basic Social Post Template

```typescript
const template = await payload.create({
  collection: 'ads-templates',
  data: {
    name: 'Summer 2025 Facebook Post',
    template_type: 'social_post',
    status: 'draft',
    language: 'es',
    headline: 'Aprende Marketing Digital',
    body: 'Descubre nuestros cursos certificados de marketing digital...',
    cta_text: 'Inscríbete',
    cta_url: 'https://cepcomunicacion.com/cursos/marketing',
    hashtags: [
      { tag: 'marketing' },
      { tag: 'cursos' },
      { tag: 'formacion' }
    ],
    active: true,
  },
  user: marketingUser,
});
```

### Create an LLM-Generated Meta Ad

```typescript
const adTemplate = await payload.create({
  collection: 'ads-templates',
  data: {
    name: 'AI Generated Meta Ad - Q3 2025',
    template_type: 'display_ad',
    status: 'active',
    language: 'en',
    headline: 'Transform Your Career with Digital Marketing',
    body: 'Join our certified courses with expert instructors...',
    cta_text: 'Enroll Now',
    cta_url: 'https://cepcomunicacion.com/en/courses',
    llm_generated: true,
    llm_model: 'gpt-4-turbo',
    llm_prompt: 'Create a compelling Meta Ads headline for digital marketing courses targeting professionals aged 25-45.',
    metadata: {
      target_audience: 'Professionals 25-45',
      tone: 'professional',
      platform: 'facebook',
    },
    asset_urls: [
      { url: 'https://cdn.example.com/hero-image.jpg' }
    ],
  },
  user: adminUser,
});
```

### Link Template to Campaign

```typescript
const template = await payload.create({
  collection: 'ads-templates',
  data: {
    name: 'Summer Campaign Template',
    template_type: 'email',
    status: 'active',
    language: 'es',
    headline: 'Email Subject Line',
    body: 'Email body content...',
    campaign: campaignId, // Link to existing campaign
    course: courseId,     // Link to specific course
  },
  user: marketingUser,
});
```

### Clone an Existing Template

```typescript
const clonedTemplate = await payload.create({
  collection: 'ads-templates',
  data: {
    ...originalTemplate,
    name: 'Cloned Template - Variant B',
    parent_template: originalTemplate.id, // Track cloning relationship
    headline: 'Modified Headline for A/B Testing',
  },
  user: marketingUser,
});
```

### Query Templates by Language and Status

```typescript
const activeSpanishTemplates = await payload.find({
  collection: 'ads-templates',
  where: {
    and: [
      { language: { equals: 'es' } },
      { status: { equals: 'active' } },
      { active: { equals: true } },
    ],
  },
  user: marketingUser,
});
```

### Archive a Template (Terminal State)

```typescript
const archivedTemplate = await payload.update({
  collection: 'ads-templates',
  id: templateId,
  data: {
    status: 'archived', // Auto-sets archived_at timestamp
  },
  user: adminUser,
});

// Attempting to reactivate will fail
await payload.update({
  collection: 'ads-templates',
  id: templateId,
  data: { status: 'active' }, // ❌ ERROR: Cannot change from archived
  user: adminUser,
});
```

## Testing

Comprehensive test suite with 121 tests covering:
- CRUD Operations: 18 tests
- Field Validation: 30 tests
- Access Control: 18 tests
- Relationship Management: 10 tests
- Hook Functionality: 20 tests
- Security Patterns: 15 tests
- Business Logic: 10 tests

Run tests:
```bash
npm test collections/AdsTemplates/__tests__/AdsTemplates.test.ts
```

## Relationships

### Many-to-One: Campaign
Multiple templates can belong to one campaign.
```typescript
campaign.id → template.campaign
```

### Many-to-One: Course
Multiple templates can target one course.
```typescript
course.id → template.course
```

### Self-Referential: Parent Template
Templates can clone other templates.
```typescript
template.id → childTemplate.parent_template
```

### Many-to-One: Created By
User who created the template (immutable).
```typescript
user.id → template.created_by
```

## Status Workflow

```
┌───────┐     ┌────────┐     ┌──────────┐
│ draft │────▶│ active │────▶│ archived │
└───────┘     └────────┘     └──────────┘
   ▲              │                ║
   └──────────────┘                ║
                                   ║
                            (terminal state)
```

## LLM Integration

When creating LLM-generated templates:
1. Set `llm_generated: true`
2. Provide `llm_model` (required)
3. Optionally provide `llm_prompt` for audit trail
4. Use conditional UI display for LLM fields

Supported models:
- OpenAI: `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo`
- Anthropic: `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`
- Open Source: `ollama-llama3`, `mixtral-8x7b`

## Performance Considerations

- **Indexes**: `name` (unique), `created_by`, `language`, `status`, `active`
- **Pagination**: Use `limit` and `page` for large result sets
- **Filtering**: Leverage indexed fields for optimal query performance
- **Soft Delete**: Use `active` flag instead of hard deletes for performance

## Best Practices

1. **Always validate URLs**: Never bypass URL validation for cta_url or asset_urls
2. **Use meaningful names**: Template names should clearly describe content and purpose
3. **Track LLM usage**: Always fill in llm_model when using AI-generated content
4. **Leverage metadata**: Use metadata group for better organization and filtering
5. **Archive don't delete**: Use archived status for obsolete templates (audit trail)
6. **Clone with parent_template**: Maintain template lineage for A/B testing
7. **Respect ownership**: Marketing users should only modify their own templates
8. **Use hashtags wisely**: No # symbol, keep tags relevant and alphanumeric

## API Endpoints

### REST API
- `POST /api/ads-templates` - Create template
- `GET /api/ads-templates` - List templates (with filtering)
- `GET /api/ads-templates/:id` - Get template by ID
- `PATCH /api/ads-templates/:id` - Update template
- `DELETE /api/ads-templates/:id` - Delete template (admin/gestor only)

### GraphQL API
```graphql
mutation CreateAdsTemplate {
  createAdsTemplate(data: {
    name: "Template Name"
    template_type: "social_post"
    status: "draft"
    language: "es"
    headline: "Headline"
    body: "Body content"
  }) {
    id
    name
    created_by {
      email
    }
  }
}

query AllAdsTemplates {
  AdsTemplates(where: { status: { equals: "active" } }) {
    docs {
      id
      name
      template_type
      language
      usage_count
    }
  }
}
```

## Troubleshooting

### Error: "llm_model is required when llm_generated is true"
**Solution**: Provide `llm_model` field when setting `llm_generated: true`.

### Error: "Cannot change status from archived (terminal state)"
**Solution**: Archived templates cannot be reactivated. Create a new template or clone the archived one.

### Error: "Invalid URL format"
**Solution**: Ensure URLs start with `https://` or `http://` and follow RFC standards. Avoid localhost, loopback IPs, and authentication credentials.

### Error: "Hashtag format invalid"
**Solution**: Hashtags must be alphanumeric with underscores only, 2-30 characters. Don't include the # symbol.

### Error: "created_by field is immutable"
**Solution**: The creator cannot be changed after template creation. This is enforced for audit trail integrity.

### Permission Denied (Marketing User)
**Solution**: Marketing users can only update templates they created. Admin/Gestor can update all templates.

## Migration Guide

When migrating from legacy systems:
1. Map existing template types to new `template_type` values
2. Extract hashtags and remove # symbols
3. Validate all URLs before import
4. Set `llm_generated: false` for manually created templates
5. Populate `created_by` with appropriate user IDs
6. Set initial `version: 1` for all templates
7. Mark old templates as `status: archived` if obsolete

## Support

For issues or questions:
- Check test suite: `__tests__/AdsTemplates.test.ts`
- Review hook implementations in `hooks/` directory
- Consult IMPLEMENTATION_SUMMARY.md for technical details
- Contact development team: dev@cepcomunicacion.com

## License

Copyright © 2025 SOLARIA AGENCY. All rights reserved.
