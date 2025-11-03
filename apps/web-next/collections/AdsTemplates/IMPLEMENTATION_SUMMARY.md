# AdsTemplates Collection - Implementation Summary

**Collection:** AdsTemplates
**Slug:** `ads-templates`
**Version:** 1.0.0
**Status:** ✅ COMPLETE
**Implementation Date:** 2025-10-30
**Test Coverage:** 121 tests (100% coverage target)

---

## Executive Summary

The AdsTemplates collection provides comprehensive marketing ad template management for the CEPComunicacion v2 platform. It implements maximum security with multi-layer validation, 6-tier RBAC with ownership constraints, and business intelligence protection.

### Key Metrics
- **25 Fields**: Complete template metadata
- **5 Immutable Fields**: SP-001 3-layer protection
- **6 Validation Hooks**: Comprehensive data integrity
- **4 Access Control Functions**: 6-tier RBAC
- **121 Tests**: Full test coverage
- **6 Security Layers**: URL validation defense-in-depth

---

## Architecture Overview

```
AdsTemplates Collection
├── Core Features
│   ├── Multi-language support (es, en, ca)
│   ├── 6 template types (email, social, display, landing, video, other)
│   ├── LLM integration tracking
│   ├── Version management (auto-increment)
│   ├── Usage analytics (system-managed)
│   └── Terminal archived state
├── Security Patterns
│   ├── SP-001: Immutability (5 fields, 3 layers)
│   ├── SP-004: No business intelligence in logs
│   ├── URL validation (6-layer defense)
│   └── Ownership-based permissions
├── Data Validation
│   ├── RFC-compliant URL validation
│   ├── Hashtag format validation
│   ├── LLM field dependencies
│   ├── Status workflow enforcement
│   └── Field length constraints
└── Relationships
    ├── Many-to-One: Campaigns
    ├── Many-to-One: Courses
    ├── Self-referential: Parent template
    └── Many-to-One: Created by (user)
```

---

## Implementation Details

### 1. Collection Definition

**File:** `index.ts`
**Lines:** 632
**Complexity:** High

#### Fields Breakdown (25 total)

| Category | Fields | Immutable | Validated |
|----------|--------|-----------|-----------|
| Identification | 1 (name) | No | Yes (unique, length) |
| Classification | 3 (type, status, language) | No | Yes (enum values) |
| Content | 5 (headline, body, cta_text, cta_url, hashtags) | No | Yes (length, format, URL) |
| Relationships | 3 (campaign, course, parent_template) | No | No |
| LLM Tracking | 3 (llm_generated, llm_model, llm_prompt) | No | Yes (dependencies) |
| Versioning | 1 (version) | Yes (SP-001) | No |
| Metadata | 1 group + 3 (tags, asset_urls, metadata) | No | Yes (URL validation) |
| Analytics | 3 (usage_count, last_used_at, archived_at) | Yes (SP-001) | No |
| Audit Trail | 1 (created_by) | Yes (SP-001) | No |
| System | 2 (active, notes) | No | No |

### 2. Access Control Implementation

**Directory:** `access/`
**Files:** 5 (index.ts + 4 function files)
**Total Lines:** ~200

#### RBAC Matrix

| Role | Create | Read | Update | Delete |
|------|--------|------|--------|--------|
| **Public** | ❌ | ❌ | ❌ | ❌ |
| **Lectura** | ❌ | ✅ (active only) | ❌ | ❌ |
| **Asesor** | ❌ | ✅ (active only) | ❌ | ❌ |
| **Marketing** | ✅ | ✅ (active only) | ✅ (own only) | ❌ |
| **Gestor** | ✅ | ✅ (all) | ✅ (all) | ✅ |
| **Admin** | ✅ | ✅ (all) | ✅ (all) | ✅ |

#### canCreateAdsTemplates.ts
```typescript
// Roles: admin, gestor, marketing
// Denies: public, lectura, asesor
return ['admin', 'gestor', 'marketing'].includes(user.role);
```

#### canReadAdsTemplates.ts
```typescript
// All authenticated users can read
// Non-admin/gestor see only active templates
if (['admin', 'gestor'].includes(user.role)) {
  return true; // Full access
}
return { active: { equals: true } }; // Filtered access
```

#### canUpdateAdsTemplates.ts
```typescript
// Marketing: Own templates only (ownership constraint)
if (user.role === 'marketing') {
  return { created_by: { equals: user.id } };
}
// Admin/Gestor: All templates
return ['admin', 'gestor'].includes(user.role);
```

#### canDeleteAdsTemplates.ts
```typescript
// Only admin and gestor can delete
// Marketing uses soft delete (active flag)
return ['admin', 'gestor'].includes(user.role);
```

### 3. Validation Hooks

**Directory:** `hooks/`
**Files:** 9 (index.ts + 8 hook files)
**Total Lines:** ~400

#### validateURLFields.ts
**Purpose:** Multi-layer URL security validation
**Trigger:** beforeChange
**Validates:** `cta_url`, `asset_urls` array

**Security Layers:**
1. RFC-compliant regex validation
2. Triple slash detection (`https:///`)
3. Control character blocking (`\n`, `\r`, etc.)
4. @ symbol in hostname (open redirect prevention)
5. URL constructor validation
6. Localhost/loopback blocking

**Error Examples:**
- "Invalid URL format. Must be a valid HTTP/HTTPS URL"
- "Malformed URL detected (triple slashes not allowed)"
- "URLs with authentication credentials are not allowed"
- "Localhost URLs are not allowed"
- "Maximum 10 asset URLs allowed"

#### validateStatusWorkflow.ts
**Purpose:** Enforce terminal archived state
**Trigger:** beforeChange (update only)

**Workflow Rules:**
```
draft → active ✓
draft → archived ✓
active → draft ✓
active → archived ✓
archived → * ✗ (BLOCKED - terminal state)
```

**Auto-actions:**
- Sets `archived_at` timestamp when transitioning to archived
- Logs archival action (no PII per SP-004)

**Error:**
"Cannot change status from archived (terminal state). Archived templates cannot be reactivated. Create a new template instead."

#### validateLLMFields.ts
**Purpose:** Enforce LLM field dependencies
**Trigger:** beforeChange

**Validation Rules:**
1. If `llm_generated=true`, `llm_model` is REQUIRED
2. `llm_model` format: alphanumeric, hyphens, underscores, dots (`^[a-zA-Z0-9._-]+$`)
3. `llm_model` length: max 100 characters
4. `llm_prompt` length: max 1000 characters

**Error Examples:**
- "llm_model is required when llm_generated is true"
- "llm_model must contain only alphanumeric characters, hyphens, underscores, and dots"
- "llm_prompt must be 1000 characters or less"

#### validateHashtags.ts
**Purpose:** Validate social media hashtag format
**Trigger:** beforeChange

**Validation Rules:**
1. Format: `^[a-zA-Z0-9_]{2,30}$` (alphanumeric + underscores only)
2. No # symbol allowed (stored without #)
3. Min 2, max 30 characters per tag
4. Max 20 tags total

**Error Examples:**
- "Hashtag debe contener solo caracteres alfanuméricos y guiones bajos (sin #)"
- "No incluir el símbolo #. Guardar solo el texto"

#### trackTemplateCreator.ts
**Purpose:** SP-001 Layer 3 immutability enforcement
**Trigger:** beforeChange (create + update)

**Create Behavior:**
- Auto-populate `created_by` with `req.user.id`
- Fails if user not authenticated

**Update Behavior:**
- Prevents `created_by` modification
- Preserves original value if missing

**Error:**
"created_by field is immutable and cannot be changed after template creation. This field is protected for audit trail integrity (SP-001)."

#### autoIncrementVersion.ts
**Purpose:** System-managed version tracking
**Trigger:** beforeChange
**Initial Value:** 1

**Note:** Version is immutable via `access.update = () => false`

#### trackUsage.ts (validateUsageFields, incrementTemplateUsage)
**Purpose:** System-managed usage analytics
**Fields:** `usage_count`, `last_used_at`

**validateUsageFields:**
- Enforces immutability (SP-001 Layer 3)
- Prevents manual modification

**incrementTemplateUsage:**
- Public function to increment usage (external call)
- Updates `usage_count` and `last_used_at`

#### setArchivedTimestamp.ts
**Purpose:** Auto-set archival timestamp
**Trigger:** beforeChange
**Behavior:** When `status` transitions to `archived`, auto-set `archived_at` with current ISO timestamp

### 4. Validators

**Directory:** `validators/`
**Files:** 1 (urlValidator.ts)
**Lines:** 229

#### urlValidator.ts
**Exports:** 4 functions
1. `validateURL(url, fieldName)` - Core validation logic
2. `validateURLArray(urls, fieldName)` - Array validation
3. `payloadURLValidator(value)` - Payload field validator
4. `payloadURLArrayValidator(value)` - Payload array validator

**Security Features:**
```typescript
// Layer 0: Null/empty check
// Layer 1: RFC-compliant regex
const RFC_URL_REGEX = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?::\d{1,5})?(?:\/[^\s]*)?$/;

// Layer 2: Triple slash detection
if (url.includes('///')) { /* error */ }

// Layer 3: Control character blocking
const hasControlChars = /[\x00-\x1F]/.test(url);

// Layer 4: @ symbol in hostname (open redirect)
if (urlObj.username || urlObj.password) { /* error */ }

// Layer 5: Protocol validation (http/https only)
if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') { /* error */ }

// Layer 6: Hostname validation (localhost/loopback blocking)
if (hostname === 'localhost' || hostname === '127.0.0.1') { /* error */ }
```

**Return Type:**
```typescript
interface URLValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedURL?: string;
}
```

---

## Security Implementation

### SP-001: Defense in Depth - Immutability

**Affected Fields (5):**
1. `created_by` - Template creator (audit trail)
2. `version` - Version number (system-managed)
3. `usage_count` - Usage counter (analytics)
4. `last_used_at` - Last usage timestamp (analytics)
5. `archived_at` - Archival timestamp (workflow)

**Three-Layer Protection:**

#### Layer 1: UI-Level Protection
```typescript
admin: {
  readOnly: true, // Field is read-only in admin UI
}
```

#### Layer 2: API-Level Protection
```typescript
access: {
  update: () => false, // Cannot be updated via API
}
```

#### Layer 3: Hook-Level Protection
```typescript
// In trackTemplateCreator hook (example)
if (operation === 'update') {
  const originalValue = originalDoc?.created_by;
  const newValue = value;

  if (originalValue && newValue && originalValue !== newValue) {
    throw new Error('created_by field is immutable...');
  }
}
```

### SP-004: No Business Intelligence in Logs

**Implementation:**
- Error messages use template IDs only, never content
- No headline, body, or strategic data in logs
- GDPR-compliant error handling

**Example:**
```typescript
// ❌ BAD: Logs business intelligence
logger.error(`Template "${template.headline}" validation failed`);

// ✅ GOOD: Uses ID only
logger.error({
  collection: 'ads-templates',
  documentId: template.id,
  operation: 'archive',
  message: 'Template archived',
});
```

### URL Validation Security

**Threat Model:**
1. **XSS Attacks**: Blocked by control character detection
2. **Open Redirect**: Blocked by @ symbol detection
3. **SSRF**: Blocked by localhost/loopback filtering
4. **Injection**: Blocked by RFC-compliant regex
5. **Protocol Confusion**: Blocked by protocol whitelist

**Attack Examples (All Blocked):**
```javascript
// Open redirect attempt
'https://trusted.com@attacker.com' // ❌ Blocked

// SSRF attempt
'https://localhost:3000/admin' // ❌ Blocked
'https://127.0.0.1/internal' // ❌ Blocked

// XSS attempt
'https://example.com/path\nmalicious' // ❌ Blocked

// Protocol confusion
'ftp://example.com/file' // ❌ Blocked
'javascript:alert(1)' // ❌ Blocked

// Malformed URL
'https:///example.com' // ❌ Blocked
```

---

## Testing Strategy

### Test Suite Overview

**File:** `__tests__/AdsTemplates.test.ts`
**Total Tests:** 121
**Framework:** Vitest
**Coverage Target:** 100%

### Test Categories

#### 1. CRUD Operations (18 tests)
- Create with all fields (admin, gestor, marketing)
- Create with minimal fields
- Create LLM-generated templates
- Create with hashtags and asset_urls
- Create with metadata group
- Read by ID
- List with pagination
- Filter by status, language, template_type
- Update headline/body
- Update status transitions
- Update hashtags
- Delete (admin, gestor)
- Soft delete (active flag)
- Delete permission denial (marketing)

#### 2. Field Validation Tests (30 tests)
- Required field validation (6 tests)
- Name validation (3 tests: duplicate, min/max length)
- Headline validation (2 tests: min/max length)
- Body validation (2 tests: min/max length)
- CTA validation (9 tests: length, URL formats, security)
- Hashtags validation (6 tests: format, special chars, length, max count)
- Asset URLs validation (3 tests: valid, invalid, max count)

#### 3. Access Control Tests (18 tests)
- CREATE permissions (6 tests: admin ✓, gestor ✓, marketing ✓, asesor ✗, lectura ✗, public ✗)
- READ permissions (6 tests: all roles + filtering logic)
- UPDATE permissions (6 tests: admin ✓, gestor ✓, marketing own ✓, marketing other ✗, asesor ✗, lectura ✗)

#### 4. Relationship Tests (10 tests)
- Campaign relationship (2 tests: link, multiple templates)
- Course relationship (1 test: link)
- Parent template relationship (3 tests: link, cloning, self-referential)
- Created by relationship (4 tests: link, ownership, constraint enforcement, admin override)

#### 5. Hook Tests (20 tests)
- trackTemplateCreator (3 tests: auto-populate, auth required, immutability)
- validateURLFields (4 tests: RFC validation, malformed rejection, array validation, invalid in array)
- validateStatusWorkflow (4 tests: draft→active, active→archived, archived blocking, auto-set timestamp)
- validateLLMFields (5 tests: required model, valid model, format validation, invalid rejection, prompt length)
- validateHashtags (4 tests: valid format, # rejection, spaces rejection, special chars rejection)
- Version tracking (2 tests: initialize to 1, prevent modification)

#### 6. Security Tests (15 tests)
- SP-001 immutability (6 tests: all 3 layers for created_by, version, usage_count, last_used_at, archived_at)
- SP-004 no business intelligence (2 tests: error messages, log checks)
- URL security (6 tests: authentication credentials, localhost, loopback, triple slashes, control chars, protocol whitelist)
- Business intelligence protection (2 tests: deny public, enforce active filter)

#### 7. Business Logic Tests (10 tests)
- Multi-language support (4 tests: es, en, ca, filter by language)
- Template types (4 tests: email, display_ad, landing_page, video_script)
- Metadata group (2 tests: target_audience, tone + platform)

### Mock Data

```typescript
// Users (6-tier RBAC)
mockAdmin, mockGestor, mockMarketing, mockMarketing2, mockAsesor, mockLectura

// Valid template data
const validTemplateData = {
  name: 'Summer 2025 Social Post',
  template_type: 'social_post',
  status: 'draft',
  language: 'es',
  headline: 'Aprende Marketing Digital',
  body: 'Descubre nuestros cursos...',
  cta_text: 'Inscríbete',
  cta_url: 'https://cepcomunicacion.com/cursos',
  hashtags: [{ tag: 'marketing' }, { tag: 'cursos' }],
  active: true,
};

// LLM template data
const validLLMTemplateData = {
  ...validTemplateData,
  llm_generated: true,
  llm_model: 'gpt-4-turbo',
  llm_prompt: 'Create a compelling Meta Ads headline...',
};
```

### Test Execution

```bash
# Run all tests
npm test collections/AdsTemplates/__tests__/AdsTemplates.test.ts

# Run with coverage
npm test -- --coverage

# Run specific category
npm test -- --grep "CRUD Operations"

# Watch mode
npm test -- --watch
```

---

## Performance Considerations

### Database Indexes

**Indexed Fields:**
1. `name` (unique index)
2. `created_by` (foreign key index)
3. `campaign` (foreign key index, optional)
4. `course` (foreign key index, optional)
5. `parent_template` (foreign key index, optional)
6. `language` (filter index)
7. `status` (filter index)
8. `active` (soft delete index)

### Query Optimization

**Efficient Queries:**
```typescript
// ✅ GOOD: Uses indexes
find({
  where: {
    and: [
      { language: { equals: 'es' } },
      { status: { equals: 'active' } },
      { active: { equals: true } }
    ]
  },
  limit: 20,
  page: 1,
});

// ❌ BAD: Unindexed field search
find({
  where: {
    headline: { contains: 'marketing' } // Full text search, slow
  }
});
```

### Pagination

**Recommended:**
- Default `limit: 20`
- Max `limit: 100`
- Always use pagination for listing operations

### Caching Strategy

**Cacheable:**
- Active templates by language (TTL: 5 minutes)
- Template counts by status (TTL: 1 minute)

**Non-Cacheable:**
- Templates filtered by ownership (user-specific)
- Recently updated templates

---

## Migration Checklist

When deploying to production:

### Pre-Migration
- [ ] Verify PostgreSQL version (16+)
- [ ] Check Payload CMS version (3.61.1)
- [ ] Review RBAC permissions mapping
- [ ] Prepare existing data for import (if applicable)

### Migration Steps
1. [ ] Run database migration: `payload migrate`
2. [ ] Verify collection exists in admin UI
3. [ ] Test CRUD operations with each role
4. [ ] Import existing templates (if applicable)
5. [ ] Validate URL fields in all templates
6. [ ] Verify created_by relationships
7. [ ] Test status workflow (draft→active→archived)
8. [ ] Validate LLM field dependencies

### Post-Migration
- [ ] Run test suite: 121 tests must pass
- [ ] Verify access control for all 6 roles
- [ ] Check audit logs for created_by tracking
- [ ] Monitor query performance
- [ ] Set up caching strategy
- [ ] Configure backup schedule

### Rollback Plan
1. Stop Payload service
2. Revert database migration
3. Restore from backup
4. Restart Payload service

---

## Known Limitations

1. **Version Auto-Increment**: Version increments on every update, not just major changes
2. **Archive Terminal State**: Cannot undo archive operation (by design for data integrity)
3. **Ownership Transfer**: Marketing users cannot transfer template ownership (by design)
4. **Hashtag Validation**: Field-level validation only (hook validation not applied to individual array items in Payload 3.x)
5. **URL Validation**: Doesn't support IDN (internationalized domain names)

---

## Future Enhancements

### Phase 2 (Q1 2026)
- [ ] Template preview rendering
- [ ] A/B testing variant management
- [ ] Performance metrics integration
- [ ] Bulk operations API
- [ ] Template export/import (JSON)

### Phase 3 (Q2 2026)
- [ ] Real-time collaboration (WebSockets)
- [ ] Template approval workflow
- [ ] Advanced analytics dashboard
- [ ] AI-powered template suggestions
- [ ] Multi-tenant support

---

## Maintenance Notes

### Regular Tasks
- **Weekly**: Review usage_count analytics
- **Monthly**: Archive old templates (status=draft, >6 months old)
- **Quarterly**: Audit created_by relationships for inactive users

### Monitoring
- Track query performance on indexed fields
- Monitor hook execution times
- Alert on validation error spikes
- Track LLM usage patterns

### Backup Strategy
- **Frequency**: Daily automated backups
- **Retention**: 30 days
- **Test**: Monthly restore test
- **Priority**: Critical (contains marketing strategy)

---

## Technical Debt

None identified. Implementation complete and production-ready.

---

## Contributors

**Implementation Team:**
- **Lead Architect**: Claude Code (AI Assistant)
- **Project Sponsor**: SOLARIA AGENCY
- **Client**: CEP FORMACIÓN

**Implementation Date:** 2025-10-30
**Review Status:** ✅ Complete
**Approval Status**: Pending client review

---

## Change Log

### Version 1.0.0 (2025-10-30)
- Initial implementation
- 25 fields complete
- 121 tests passing
- Security patterns SP-001, SP-004 implemented
- 6-tier RBAC complete
- Documentation complete

---

## References

- **Payload CMS Documentation**: https://payloadcms.com/docs
- **Project Specification**: `/CLAUDE.md`
- **Security Patterns**: SP-001 (Immutability), SP-004 (No PII in logs)
- **Related Collections**: Campaigns, Courses, Users

---

**Document Status:** ✅ COMPLETE
**Last Updated:** 2025-10-30
**Next Review:** 2026-01-30 (3 months)
