# Patterns & Optimization Memory
**Project:** CEPComunicacion v2
**Methodology:** SOLARIA Multi-Agent Architecture
**Purpose:** Living document to capture patterns, antipatterns, and optimizations
**Last Updated:** 2025-10-29 18:00 CET

---

## Pattern Analysis Framework

### Identification Criteria
A pattern is documented when it appears in **3+ instances** across the codebase.

### Optimization Criteria
An optimization is applied when:
1. Pattern reduces code duplication by 30%+
2. Pattern improves test coverage by 10%+
3. Pattern reduces cognitive load for developers
4. Pattern prevents security vulnerabilities

---

## Tier 1 Implementation: Pattern Analysis

### ✅ PATTERN #1: Slug Auto-Generation (Spanish-Aware)

**Frequency:** 3/3 collections (Cycles, Campuses, Courses)
**Code Duplication:** 100% (would be duplicated without shared hook)
**Solution Implemented:** Shared hook `collections/shared/hooks/generateSlug.ts`

**Pattern Definition:**
```typescript
// Every collection with a user-facing URL needs a slug field
// Slug must handle Spanish characters (ñ, á, é, í, ó, ú)
// Slug must be unique and URL-safe

export const generateSlug = ({ data }: any) => {
  if (data.title || data.name) {
    const text = data.title || data.name;
    data.slug = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  return data;
};
```

**Impact:**
- ✅ Eliminates 30+ lines of duplicate code
- ✅ Ensures consistent slug format across all collections
- ✅ Spanish character support centralized

**Future Optimization:**
- Add slug uniqueness validation (check existing slugs in DB)
- Add slug history tracking for SEO redirects
- Add custom slug override capability

**Reusability:** HIGH (will be used in BlogPosts, FAQs, CourseRuns)

---

### ✅ PATTERN #2: RBAC Access Control Helpers

**Frequency:** 3/3 collections
**Code Duplication:** 80% (similar access patterns)
**Solution Implemented:** Shared helpers `collections/shared/access/index.ts`

**Pattern Definition:**
```typescript
// Standard RBAC checks reused across collections
export const isAdmin = ({ req: { user } }: any) => user?.role === 'admin';
export const isAdminOrGestor = ({ req: { user } }: any) =>
  ['admin', 'gestor'].includes(user?.role);
export const canCreateContent = ({ req: { user } }: any) =>
  ['admin', 'gestor', 'marketing'].includes(user?.role);

// Public read with active filter
export const publicRead = () => ({
  and: [{ active: { equals: true } }]
});

// Ownership-based update
export const canUpdateOwn = ({ req: { user, id } }: any) => ({
  or: [
    { role: { in: ['admin', 'gestor'] } },
    { created_by: { equals: user?.id } }
  ]
});
```

**Impact:**
- ✅ Reduces RBAC code by 60%
- ✅ Centralizes security logic (single source of truth)
- ✅ Makes permissions auditable

**Future Optimization:**
- Add permission matrix validation tests
- Add field-level permission helpers
- Add audit logging for permission checks

**Reusability:** HIGH (will be used in all 9 remaining collections)

---

### ✅ PATTERN #3: Test Suite Structure (TDD Template)

**Frequency:** 3/3 collections
**Code Duplication:** 70% (similar test organization)
**Solution Opportunity:** Test generator or template

**Pattern Definition:**
```typescript
describe('CollectionName', () => {
  describe('CRUD Operations', () => {
    it('creates a document');
    it('reads documents');
    it('updates a document');
    it('deletes a document');
  });

  describe('Access Control', () => {
    // 5 roles × 4 operations = 20 tests
    it('allows admin to [operation]');
    it('allows gestor to [operation]');
    // ... etc
  });

  describe('Validation', () => {
    it('requires mandatory fields');
    it('validates field formats');
    it('enforces unique constraints');
  });

  describe('Hooks', () => {
    it('executes beforeChange hooks');
    it('executes afterChange hooks');
  });

  // Collection-specific tests
  describe('Relationships', () => { /* ... */ });
  describe('Field-Level Access', () => { /* ... */ });
});
```

**Impact:**
- ⚠️ Current: Manual test writing (repetitive)
- ✅ Potential: 50% faster test creation with generator

**Future Optimization:**
Create test generator script:
```bash
pnpm generate:tests --collection Enrollments --fields "student:relationship,course_run:relationship,status:select"
```

**Reusability:** HIGH (template applies to all collections)

---

### ✅ PATTERN #4: Relationship Validation Hooks

**Frequency:** 1/3 collections (Courses only, but will repeat)
**Code Duplication:** Will increase to 6/12 collections (Students, Enrollments, CourseRuns, Campaigns, Leads, BlogPosts)
**Solution Implemented:** Specific hook `validateRelationships.ts`

**Pattern Definition:**
```typescript
// Validate that referenced entities exist before saving
export const validateRelationships = async ({ data, req }: any) => {
  // Check cycle exists
  if (data.cycle) {
    const cycle = await req.payload.findByID({
      collection: 'cycles',
      id: data.cycle,
    });
    if (!cycle) {
      throw new Error(`Cycle with ID ${data.cycle} not found`);
    }
  }

  // Check campuses exist
  if (data.campuses?.length) {
    for (const campusId of data.campuses) {
      const campus = await req.payload.findByID({
        collection: 'campuses',
        id: campusId,
      });
      if (!campus) {
        throw new Error(`Campus with ID ${campusId} not found`);
      }
    }
  }

  return data;
};
```

**Impact:**
- ✅ Prevents orphaned relationships
- ✅ Provides clear error messages
- ⚠️ Performance concern: N+1 queries for multiple relationships

**Future Optimization:**
- Batch validate relationships in single query
- Cache relationship checks
- Use database-level foreign key constraints instead

**Reusability:** MEDIUM (needs customization per collection)

---

### ✅ PATTERN #5: Creator Tracking (Immutable Field)

**Frequency:** 1/3 collections (Courses), will be 6/12 collections
**Code Duplication:** Will increase significantly
**Solution Implemented:** Hook `trackCreator.ts`

**Pattern Definition:**
```typescript
// Auto-set created_by on creation, make immutable
export const trackCreator = ({ data, req, operation }: any) => {
  if (operation === 'create') {
    data.created_by = req.user.id;
  }

  // Prevent modification on update
  if (operation === 'update' && data.created_by) {
    delete data.created_by; // Ignore any update attempts
  }

  return data;
};
```

**Impact:**
- ✅ Audit trail for content creation
- ✅ Ownership-based permissions
- ✅ Security: Prevents ownership hijacking

**Future Optimization:**
- Make this a Payload plugin (configurable field name)
- Add `updated_by` tracking as well
- Add IP address logging

**Reusability:** HIGH (applies to all content collections)

---

## Antipatterns Detected

### ❌ ANTIPATTERN #1: Database Not Connected During Development

**Severity:** HIGH
**Impact:** Tests written but not executed (deferred validation risk)

**Problem:**
- 137 tests written across 3 collections
- Zero tests actually executed
- Potential for bugs to accumulate undetected

**Root Cause:**
- TDD methodology applied but GREEN phase incomplete
- Database connection deferred to "later"

**Solution:**
1. **Immediate:** Connect PostgreSQL database
2. **Run migrations:** `pnpm payload migrate`
3. **Execute tests:** `pnpm test`
4. **Fix failures:** Iterate until all pass

**Prevention (Process Update):**
- ✅ NEW RULE: Database must be connected before writing tests
- ✅ NEW RULE: Tests must pass before marking collection complete
- ✅ NEW RULE: CI/CD pipeline runs tests on every commit

**Time Cost:**
- Without fix: 2-4 hours of debugging when tests finally run
- With fix now: 30 minutes setup + immediate feedback

---

### ❌ ANTIPATTERN #2: Missing Architecture Decision Records (ADRs)

**Severity:** MEDIUM
**Impact:** Future developers lack context for design decisions

**Problem:**
- Collections implemented with specific design choices
- No documentation of WHY those choices were made
- Risk of breaking changes or rework

**Examples of Undocumented Decisions:**
1. Why `created_by` is immutable vs. allowing ownership transfer?
2. Why Courses allow Marketing to update own but not others?
3. Why Campuses have postal_code validation but not full address validation?
4. Why slug generation uses NFD normalization vs. other approaches?

**Solution:**
Create ADR-004-PAYLOAD-COLLECTIONS-DESIGN.md documenting:
- RBAC rationale (why these 5 roles, why these permissions)
- Relationship cascade rules (why RESTRICT vs CASCADE vs SET NULL)
- Validation choices (why certain formats enforced)
- Hook implementation decisions

**Prevention:**
- ✅ NEW RULE: Every major design decision requires an ADR
- ✅ NEW RULE: ADRs written BEFORE implementation (not after)

---

### ❌ ANTIPATTERN #3: TypeScript Type Errors Ignored

**Severity:** MEDIUM
**Impact:** Reduced type safety, potential runtime errors

**Problem:**
- 4+ TypeScript errors in collection files
- Errors dismissed as "Payload 3.0 beta limitations"
- Risk: Errors mask real type issues

**Example:**
```typescript
// Current (error ignored)
export const Courses: CollectionConfig = { ... }
// Type 'CollectionConfig' is not assignable...

// Better approach
export const Courses = {
  slug: 'courses',
  // ... config
} as const satisfies CollectionConfig;
```

**Solution:**
1. Fix type errors using `satisfies` keyword
2. Use `// @ts-expect-error` with explanation for known Payload bugs
3. Document all ignored errors in KNOWN_ISSUES.md

**Prevention:**
- ✅ NEW RULE: TypeScript strict mode, zero errors tolerated
- ✅ NEW RULE: All type errors must have ADR justification

---

### ⚠️ ANTIPATTERN #4: Lack of Performance Testing

**Severity:** MEDIUM
**Impact:** Scalability issues not detected until production

**Problem:**
- No tests for performance under load
- No database query optimization tests
- No index verification

**Missing Tests:**
- Can Courses.findMany() handle 10,000 courses?
- Does Campuses query use indexes efficiently?
- Are relationship queries N+1 or batched?

**Solution (Tier 2 Requirement):**
Add performance tests:
```typescript
describe('Performance', () => {
  it('handles 10,000 courses efficiently', async () => {
    const start = Date.now();
    await payload.find({ collection: 'courses', limit: 100 });
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(200); // <200ms
  });
});
```

**Prevention:**
- ✅ NEW RULE: Every collection includes performance tests
- ✅ NEW RULE: Database indexes documented in migration files

---

## Optimization Opportunities for Tier 2

### 🚀 OPTIMIZATION #1: Test Generator Script

**Current State:** Manual test writing (2 hours per collection)
**Optimized State:** Generated test scaffolds (30 min per collection)

**Implementation:**
```bash
# Create test generator
pnpm generate:tests --collection Students \
  --fields "email:email,dni:text:required,gdpr_consent:checkbox:required" \
  --relationships "enrollments:hasMany,created_by:belongsTo:users" \
  --rbac "admin:all,gestor:all,marketing:read,asesor:read,lectura:none"
```

**Generates:**
- CRUD test stubs
- RBAC test matrix (5 roles × 4 operations)
- Validation test stubs
- Relationship test stubs

**Time Saved:** 1.5 hours per collection × 9 remaining = **13.5 hours**

---

### 🚀 OPTIMIZATION #2: Shared Hook Library Expansion

**Current:** 2 shared hooks (generateSlug, validateRelationships)
**Proposed:** 6 shared hooks

**New Hooks to Add:**
1. `trackTimestamps.ts` - Auto-update `updated_at` field
2. `validateEmail.ts` - Spanish email format validation
3. `validatePhone.ts` - Spanish phone format validation (+34)
4. `validateDNI.ts` - Spanish DNI/NIE checksum validation
5. `auditLog.ts` - Automatic audit trail creation
6. `sanitizeHTML.ts` - XSS prevention for richText fields

**Reusability:** Each hook usable in 3-5 collections

---

### 🚀 OPTIMIZATION #3: RBAC Test Matrix Generator

**Problem:** RBAC tests are 70% boilerplate, manually written

**Solution:** Generate RBAC tests from configuration:
```typescript
// rbac-config.ts
export const rbacMatrix = {
  cycles: {
    create: ['admin', 'gestor'],
    read: ['*'], // all
    update: ['admin', 'gestor'],
    delete: ['admin']
  },
  // ... etc
};

// Auto-generates 24 RBAC tests per collection
generateRBACTests('cycles', rbacMatrix.cycles);
```

**Time Saved:** 30 min per collection × 9 remaining = **4.5 hours**

---

### 🚀 OPTIMIZATION #4: Database Index Auto-Detection

**Problem:** Index requirements discovered during performance testing (late)

**Solution:** Analyze collection schema and auto-suggest indexes:
```typescript
// Analyzes Courses collection
analyzeIndexRequirements('courses')
// Outputs:
// - CREATE INDEX idx_courses_cycle ON courses(cycle_id);
// - CREATE INDEX idx_courses_active ON courses(active);
// - CREATE INDEX idx_courses_featured ON courses(featured);
// - CREATE INDEX idx_courses_slug ON courses(slug) UNIQUE;
```

**Prevents:** Slow queries in production

---

## Process Improvements for Tier 2

### Updated Workflow (Optimized)

**Phase 1: Preparation (15 min)**
1. ✅ Connect database (if not already connected)
2. ✅ Generate test scaffolds using generator
3. ✅ Generate RBAC test matrix
4. ✅ Identify shared hooks needed

**Phase 2: Implementation (1 hour)**
1. ✅ Write collection schema (30 min)
2. ✅ Implement custom hooks (15 min)
3. ✅ Customize generated tests (15 min)

**Phase 3: Validation (30 min)**
1. ✅ Run tests (all must pass)
2. ✅ Run TypeScript check (zero errors)
3. ✅ Run performance tests
4. ✅ Document in ADR (10 min)

**Phase 4: Integration (15 min)**
1. ✅ Register in payload.config.ts
2. ✅ Generate TypeScript types
3. ✅ Commit with structured message

**Total Time:** 2 hours per collection (down from 3 hours)
**Time Saved:** 1 hour × 9 collections = **9 hours**

---

## Key Metrics to Track

### Code Quality Metrics
- **Test Coverage:** Target 85%+ (currently unknown, tests not run)
- **TypeScript Errors:** Target 0 (currently 4+)
- **Duplicate Code:** Target <5% (currently ~15% before shared hooks)
- **Security Vulnerabilities:** Target 0 (not yet audited)

### Performance Metrics
- **API Response Time (p95):** Target <200ms
- **Database Query Time (p95):** Target <50ms
- **Test Execution Time:** Target <30s for full suite

### Development Velocity Metrics
- **Time per Collection:** Target 2 hours (down from 3)
- **Test Writing Time:** Target 30 min (down from 2 hours with generator)
- **Bug Fix Time:** Track time spent fixing issues found in testing

---

## Tier 2 Agent Assignment Strategy

### Collection Analysis for Optimal Assignment

**CourseRuns Collection:**
- **Complexity:** MEDIUM (dates, capacity, status workflow)
- **Primary Agent:** payload-cms-architect
- **Secondary Agent:** postgresql-schema-architect (complex date queries)
- **Estimated Time:** 2.5 hours

**Students Collection:**
- **Complexity:** HIGH (PII-sensitive, GDPR compliance)
- **Primary Agent:** security-gdpr-compliance
- **Secondary Agent:** payload-cms-architect
- **Critical Requirements:** Consent tracking, immutable consent fields, audit logging
- **Estimated Time:** 3.5 hours (includes security review)

**Enrollments Collection:**
- **Complexity:** HIGH (financial data, status workflow, relationships)
- **Primary Agent:** payload-cms-architect
- **Secondary Agent:** security-gdpr-compliance (financial data protection)
- **Estimated Time:** 3 hours

**Total Tier 2 Time:** 9 hours (1 full working day with optimizations)

---

## Decision Log

### Decision #1: Database Connection Timing
**Decision:** Connect database BEFORE starting Tier 2
**Rationale:** Prevents test debt accumulation
**Impact:** 30 min upfront, saves 2-4 hours debugging later
**Status:** ⏳ Pending execution

### Decision #2: Test Generator Implementation
**Decision:** Build test generator before Tier 2
**Rationale:** 13.5 hour time savings across remaining collections
**Impact:** 2 hour investment, 13.5 hour return (6.75x ROI)
**Status:** ⏳ Recommended for CTO approval

### Decision #3: Parallel Agent Execution
**Decision:** Run payload-cms-architect and security-gdpr-compliance in parallel for Students
**Rationale:** Security review can happen concurrently with implementation
**Impact:** Reduces Students collection time from 3.5h to 2.5h
**Status:** ✅ Approved for Tier 2

### Decision #4: ADR Documentation Requirement
**Decision:** Require ADR for all Tier 2 collections
**Rationale:** Prevents knowledge loss, supports future maintenance
**Impact:** +10 min per collection, high long-term value
**Status:** ✅ Mandatory for Tier 2

---

## Next Session Preparation

### Pre-Tier 2 Checklist
- [ ] Connect PostgreSQL database
- [ ] Run Tier 1 tests (validate all 137 pass)
- [ ] Generate TypeScript types
- [ ] Fix any TypeScript errors
- [ ] Build test generator script (optional, 2h investment)
- [ ] Create RBAC test matrix generator
- [ ] Document Tier 1 in ADR-004

### Tier 2 Execution Order (Optimized)
1. **Students** (security-critical, sets GDPR patterns)
2. **CourseRuns** (depends on Courses/Campuses)
3. **Enrollments** (depends on Students/CourseRuns)

Rationale: Students first establishes GDPR patterns that Enrollments will reuse.

---

**Document Status:** Living Memory
**Update Frequency:** After each tier completion
**Owner:** Project Coordinator Agent
**Review:** CTO (quarterly)
