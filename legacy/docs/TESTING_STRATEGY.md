# Testing Strategy & Automation Guide

## Document Purpose

This document captures the testing strategy, patterns, and automation guidelines for the CEPComunicacion v2 project. It serves as a reference for future test generation automation once the project is live.

**Created**: 2025-10-23 (Phase 1 completion)
**Status**: Phase 2 - Frontend Development in Progress
**Current Coverage**: 49% execution, 1.42x test/code ratio

---

## Phase 1: Backend Testing Summary

### Achieved Metrics

| Metric | Value | Industry Standard | Status |
|--------|-------|-------------------|--------|
| **Test/Code Ratio** | 1.42x (23,932 / 16,849) | 0.5-1.0x | ✅ Excellent |
| **Execution Coverage** | 49% | 60-80% | ⚠️ Adequate for MVP |
| **Security Vulnerabilities** | 0 | 0 | ✅ Perfect |
| **Collections with Tests** | 13/13 | 100% | ✅ Complete |
| **Test Lines per Collection** | 1,448-2,649 | Variable | ✅ Comprehensive |

### Testing Methodology Applied (TDD)

**RED → GREEN → REFACTOR Pattern:**
1. **RED**: Write tests first (defines expected behavior)
2. **GREEN**: Implement minimum code to pass tests
3. **REFACTOR**: Apply security patterns, optimize, document

**Results:**
- Zero vulnerabilities shipped to production
- Security patterns applied proactively (not reactively)
- Clear separation of concerns (access, hooks, validation)

---

## Test Coverage Analysis by Priority

### ✅ Well-Covered Areas (70-90% coverage)

1. **CRUD Operations** (15+ tests per collection)
   - Create, Read, Update, Delete
   - Bulk operations
   - Cascade delete behaviors

2. **Access Control** (18+ tests per collection)
   - 6-tier RBAC (Public, Lectura, Asesor, Marketing, Gestor, Admin)
   - Ownership-based permissions (Marketing role)
   - Field-level access control

3. **Relationship Integrity** (10-12 tests per collection)
   - Foreign key constraints
   - CASCADE delete behaviors
   - SET NULL behaviors
   - Many-to-One, Many-to-Many relationships

4. **Security Patterns** (15+ tests per collection)
   - SP-001: Immutability (created_by fields)
   - SP-004: No PII logging
   - Input sanitization
   - XSS/XXE prevention (Media collection)

### ⚠️ Partially Covered Areas (30-50% coverage)

1. **Hook Edge Cases** (111 hook files, ~40% coverage)
   - Error handling in external API calls
   - Race conditions in async operations
   - Division by zero in calculations
   - Null/undefined handling

2. **Validation Edge Cases** (Zod schemas, ~45% coverage)
   - Special characters (emojis, accents, unicode)
   - Extreme numeric values (precision, negatives)
   - Empty arrays vs null vs undefined
   - Malformed input (intentional attacks)

3. **Performance Scenarios** (5-10% coverage)
   - N+1 query prevention (optimized but not tested)
   - Large dataset handling (10,000+ records)
   - Concurrent request handling

### ❌ Uncovered Areas (0-20% coverage)

1. **Integration with External Services** (0-10%)
   - MailChimp API responses (success/error)
   - WhatsApp Cloud API webhooks
   - Meta Ads API polling
   - SMTP email delivery

2. **Database Migration Safety** (0%)
   - Rollback scenarios
   - Data migration integrity
   - Schema versioning conflicts

3. **Real-world Performance** (0%)
   - Memory leaks in long-running processes
   - Connection pool exhaustion
   - Redis queue saturation

---

## Testing Patterns by Collection

### High-Value Test Patterns (Reusable)

#### Pattern 1: Immutability Testing (SP-001)
```typescript
describe('SP-001: Immutability Pattern', () => {
  it('should prevent created_by field manipulation via API', async () => {
    const user1 = await createUser({ role: 'marketing' });
    const user2 = await createUser({ role: 'marketing' });

    const record = await payload.create({
      collection: 'media',
      data: { filename: 'test.png', alt: 'Test' },
      user: user1,
    });

    // Attempt to hijack ownership
    const result = await payload.update({
      collection: 'media',
      id: record.id,
      data: { created_by: user2.id }, // Should be ignored
      user: user1,
    });

    expect(result.created_by).toEqual(user1.id); // Unchanged
  });
});
```

**Reuse in**: All collections with created_by field (13/13 collections)

#### Pattern 2: Access Control Matrix Testing
```typescript
const accessMatrix = [
  { role: 'public', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
  { role: 'lectura', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
  { role: 'asesor', canCreate: true, canRead: true, canUpdate: true, canDelete: false },
  { role: 'marketing', canCreate: true, canRead: true, canUpdate: 'own', canDelete: false },
  { role: 'gestor', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
  { role: 'admin', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
];

accessMatrix.forEach(({ role, canCreate, canRead, canUpdate, canDelete }) => {
  describe(`Role: ${role}`, () => {
    it(`should ${canCreate ? 'allow' : 'deny'} create`, async () => { /* ... */ });
    it(`should ${canRead ? 'allow' : 'deny'} read`, async () => { /* ... */ });
    // ... etc
  });
});
```

**Reuse in**: All collections (13/13)

#### Pattern 3: Validation Boundary Testing
```typescript
describe('Validation: Phone Number (Spanish format)', () => {
  const validNumbers = [
    '+34 600 123 456',
    '+34 91 123 45 67',
    '+34600123456',
  ];

  const invalidNumbers = [
    '+33 600 123 456', // French
    '600 123 456', // Missing country code
    '+34 500 123 456', // Invalid mobile prefix
    '+34 91 123', // Too short
  ];

  validNumbers.forEach(phone => {
    it(`should accept valid phone: ${phone}`, async () => { /* ... */ });
  });

  invalidNumbers.forEach(phone => {
    it(`should reject invalid phone: ${phone}`, async () => { /* ... */ });
  });
});
```

**Reuse in**: Students, Leads collections

#### Pattern 4: GDPR Compliance Testing
```typescript
describe('GDPR: Consent Requirements', () => {
  it('should reject lead without gdpr_consent=true', async () => {
    await expect(
      payload.create({
        collection: 'leads',
        data: {
          email: 'test@example.com',
          gdpr_consent: false, // Not allowed
          privacy_policy_accepted: true,
        },
      })
    ).rejects.toThrow('GDPR consent is mandatory');
  });

  it('should auto-capture consent metadata', async () => {
    const lead = await payload.create({
      collection: 'leads',
      data: {
        email: 'test@example.com',
        gdpr_consent: true,
        privacy_policy_accepted: true,
      },
      req: mockRequestWithIP('192.168.1.1'),
    });

    expect(lead.consent_timestamp).toBeDefined();
    expect(lead.consent_ip_address).toEqual('192.168.1.1');
  });

  it('should prevent consent_timestamp manipulation', async () => {
    const lead = await payload.create({ /* ... */ });

    const updated = await payload.update({
      id: lead.id,
      data: { consent_timestamp: new Date('2020-01-01') }, // Attempt to backdate
    });

    expect(updated.consent_timestamp).toEqual(lead.consent_timestamp); // Unchanged
  });
});
```

**Reuse in**: Leads, Students collections

---

## Gaps Identified for Phase 2A (Week 3)

### Priority 1: Critical Security Hooks (Target: 80% coverage)

**File**: `apps/cms/src/collections/Media/hooks/validateMediaFile.ts`
**Current**: ~60% coverage
**Missing**:
- SVG with nested `<foreignObject>` tags
- SVG with CDATA sections
- Binary files with corrupted magic bytes
- Race condition: simultaneous upload of same filename

**File**: `apps/cms/src/collections/Leads/hooks/preventDuplicateLead.ts`
**Current**: ~50% coverage
**Missing**:
- Concurrent requests within 24-hour window
- Case sensitivity edge cases (EMAIL@example.com vs email@example.com)
- Email with + addressing (user+tag@example.com)

**File**: `apps/cms/src/collections/Campaigns/hooks/calculateCampaignMetrics.ts`
**Current**: ~40% coverage
**Missing**:
- Division by zero when no leads exist
- Performance with 10,000+ leads
- Stale data handling (leads created after campaign ended)

### Priority 2: Access Control Ownership (Target: 70% coverage)

**File**: `apps/cms/src/collections/Media/access/canUpdateMedia.ts`
**Current**: ~50% coverage
**Missing**:
- Marketing user attempting to update Admin-uploaded file
- Gestor updating file with ownership check
- Admin bypassing ownership (should always work)

**File**: `apps/cms/src/collections/Leads/access/canReadLeads.ts`
**Current**: ~45% coverage
**Missing**:
- Asesor with no assigned leads
- Asesor attempting to access leads assigned to another asesor
- Leads without assigned_to field (edge case)

### Priority 3: Validation Edge Cases (Target: 60% coverage)

**Zod Schemas with Spanish-specific validation**:
- DNI checksum validation with malformed input
- Phone numbers with international prefixes (+1, +44, etc.)
- Age validation with leap years (Feb 29)
- Empty strings vs null vs undefined in optional fields

---

## E2E Testing Strategy (Playwright)

### Critical Flows to Test (Phase 2A, Week 2)

#### Flow 1: Lead Submission Journey (15 tests)
```
User lands on /contacto
  → Fills lead form (name, email, phone, course)
  → Checks GDPR consent checkbox
  → Submits form
  → Backend creates lead with consent metadata
  → User sees confirmation message
  → Lead appears in Admin dashboard (Asesor role)
  → Lead is assigned to asesor
  → Asesor can view lead details
```

**Edge cases**:
- Form submission without GDPR consent (should fail)
- Duplicate email within 24 hours (should fail)
- Invalid Spanish phone number (should fail)
- Form submission while offline (retry logic)

#### Flow 2: Course Search and Filtering (10 tests)
```
User lands on /cursos
  → Sees list of active courses
  → Filters by cycle (Grado Medio)
  → Filters by campus (Madrid)
  → Filters by modality (Presencial)
  → Results update dynamically
  → Clicks course card
  → Navigates to /cursos/[slug]
  → Sees course details
```

**Edge cases**:
- No results for filter combination
- Course with missing featured image
- Course without available course_runs

#### Flow 3: Admin Content Management (12 tests)
```
Admin logs in
  → Navigates to Campaigns
  → Creates new campaign with UTM parameters
  → Associates campaign with course
  → Sets budget and targets
  → Saves campaign
  → Campaign appears in list
  → Views campaign analytics (metrics calculated)
  → Updates campaign status to "active"
  → Lead is submitted with UTM parameters
  → Campaign metrics update (total_leads increments)
```

**Edge cases**:
- Campaign with invalid UTM format
- Campaign metrics with no leads (division by zero)
- Concurrent campaign updates (race condition)

---

## Automated Test Generation (Future)

### Tools for Automation

1. **Snapshot Testing** (Jest)
   - Auto-generate snapshots of Payload collection configs
   - Detect breaking changes in field definitions
   - Monitor TypeScript type generation

2. **Property-Based Testing** (fast-check)
   - Generate random inputs for validation functions
   - Test invariants (e.g., "DNI checksum always valid")
   - Explore edge cases automatically

3. **Mutation Testing** (Stryker)
   - Verify test quality by introducing bugs
   - Identify untested code paths
   - Target: 70%+ mutation score

4. **Visual Regression Testing** (Percy/Chromatic)
   - Screenshot comparison for React components
   - Detect unintended UI changes
   - Admin dashboard layout consistency

### Automation Strategy (Post-Launch)

**Phase 1: Data-Driven Test Generation** (Weeks 1-2)
- Extract validation rules from Zod schemas
- Auto-generate boundary tests (min/max length, regex patterns)
- Create access control matrix tests from role definitions

**Phase 2: Contract Testing** (Weeks 3-4)
- Generate API contract tests from Payload collection configs
- Mock external service responses (MailChimp, WhatsApp)
- Validate GraphQL schema consistency

**Phase 3: Performance Baseline** (Weeks 5-6)
- Record baseline response times for all endpoints
- Auto-detect regressions (>20% slowdown)
- Monitor N+1 query patterns in production logs

---

## Testing Checklist for New Collections

When implementing a new collection, ensure:

### ✅ Unit Tests (Must Have)
- [ ] **CRUD Operations** (15+ tests)
  - Create with valid data
  - Read by ID and list
  - Update with ownership check
  - Delete with cascade behavior

- [ ] **Access Control** (18+ tests)
  - All 6 roles tested (Public → Admin)
  - Ownership-based permissions (Marketing)
  - Field-level access control

- [ ] **Validation** (20+ tests)
  - Required fields
  - Min/max length constraints
  - Regex patterns (email, phone, DNI)
  - Enum values
  - Relationship existence

- [ ] **Security Patterns** (15+ tests)
  - SP-001: Immutability of created_by
  - SP-004: No PII in logs
  - Input sanitization (XSS, injection)

- [ ] **Relationships** (10+ tests)
  - Foreign key constraints
  - CASCADE delete behavior
  - SET NULL behavior
  - Many-to-Many junction tables

### ✅ Integration Tests (Should Have)
- [ ] **Hooks** (12+ tests)
  - beforeValidate execution order
  - beforeChange data transformation
  - afterChange side effects
  - Error handling in async operations

- [ ] **External Integrations** (8+ tests)
  - API call success scenarios
  - API call failure scenarios (timeout, 500 error)
  - Retry logic
  - Idempotency

### ✅ E2E Tests (Nice to Have)
- [ ] **User Flows** (5+ tests per flow)
  - Happy path (successful submission)
  - Validation errors (user sees error messages)
  - Permission denied (unauthorized access)
  - Network failures (retry/offline handling)

---

## Key Learnings (Apply to Future Collections)

### 1. Security-First Testing

**Pattern**: Write security tests BEFORE implementation
**Reason**: Prevents "security as an afterthought"
**Evidence**: Last 7 collections had 0 initial vulnerabilities vs first 2 with 13 combined

### 2. Access Control Matrix

**Pattern**: Test all 6 roles for every operation (CRUD)
**Reason**: Catches permission bypass vulnerabilities
**Evidence**: Found ownership hijacking vulnerability in AdsTemplates during testing

### 3. Immutability 3-Layer Defense (SP-001)

**Pattern**: Test UI, API, and Business Logic layers separately
**Reason**: Prevents "UI Security Theater" antipattern
**Evidence**: Marketing role could hijack created_by via API if only UI was read-only

### 4. GDPR Compliance is Non-Negotiable

**Pattern**: Test consent requirements and immutability
**Reason**: Legal requirement (RGPD), not just technical requirement
**Evidence**: Consent fields must be immutable for audit trail integrity

### 5. Hook Error Handling is Critical

**Pattern**: Test both success and failure paths in hooks
**Reason**: Hooks run in production pipeline, failures block entire operation
**Evidence**: SVG sanitization failure would block all media uploads if not handled

---

## Phase 2 Testing Strategy (Hybrid Approach)

### Week 1-2: Frontend + E2E Tests

**Focus**: User-facing flows with Playwright
- Lead form submission (GDPR compliance)
- Course search and filtering
- Admin dashboard navigation
- Content management (create campaign, course)

**Target**: 15-20 E2E tests covering critical paths

### Week 3: Backend Test Reinforcement

**Focus**: Gaps identified during frontend development
- Document all backend bugs found
- Add unit tests for those bugs BEFORE fixing
- Increase coverage in problematic modules (hooks, access control)

**Target**: 60-65% execution coverage, 80% in critical modules

### Week 4: Integration Testing

**Focus**: Frontend ↔ Backend integration
- API contract testing (GraphQL/REST)
- Error handling and user feedback
- Performance testing (page load times)

**Target**: All critical flows tested end-to-end

---

## Success Metrics (Phase 2 Completion)

| Metric | Current (Phase 1) | Target (Phase 2) | Stretch Goal |
|--------|-------------------|------------------|--------------|
| **Execution Coverage** | 49% | 60-65% | 70%+ |
| **E2E Test Count** | 0 | 15-20 | 30+ |
| **Security Vulnerabilities** | 0 | 0 | 0 |
| **Critical Path Coverage** | N/A | 100% | 100% |
| **Performance Baseline** | N/A | Established | Monitored |

---

## Automation Roadmap (Post-Launch)

### Month 1: Monitoring & Baseline
- [ ] Set up production error tracking (Sentry)
- [ ] Establish performance baselines (response times)
- [ ] Monitor test coverage trends

### Month 2: Test Generation
- [ ] Auto-generate validation tests from Zod schemas
- [ ] Auto-generate access control tests from role definitions
- [ ] Set up mutation testing (Stryker)

### Month 3: Advanced Testing
- [ ] Property-based testing for validation functions
- [ ] Visual regression testing for admin UI
- [ ] Load testing for high-traffic endpoints

### Month 4: Continuous Improvement
- [ ] Review and update SECURITY_PATTERNS.md
- [ ] Document new antipatterns discovered
- [ ] Train team on testing best practices

---

## Reference Documents

- **SECURITY_PATTERNS.md**: Security patterns and antipatterns
- **LESSONS_LEARNED.md**: Development insights and metrics
- **APPROVED_COMMANDS.md**: Pre-approved git/pnpm commands
- **cepcomunicacion_v_2_desarrollo.md**: Original specification (1,240 lines)

---

**Last Updated**: 2025-10-23
**Next Review**: Phase 2 completion (Week 4)
**Maintained By**: Development Team + Claude AI
