# Implementation Plan - Phase 2: Remaining Collections

**Created:** 2025-10-30 12:15 CET
**Estimated Duration:** 24-30 hours
**Methodology:** Parallel agent execution + TDD
**Target:** Complete 8/8 remaining collections

---

## Executive Summary

**Current Status:** 5/13 collections complete (38.5%)
**Remaining:** 8 collections (61.5%)
**Strategy:** Use specialized agents in parallel batches

---

## Agent Assignment Matrix

| Collection | Agent | MCP Tools | Priority | Est. Time |
|-----------|-------|-----------|----------|-----------|
| **Students** | payload-cms-architect | sequential-thinking | 🔴 P0 CRITICAL | 6-8h |
| **Enrollments** | payload-cms-architect | sequential-thinking | 🔴 P0 CRITICAL | 5-7h |
| **Leads** | payload-cms-architect + security-gdpr-compliance | sequential-thinking, spec-kit | 🔴 P0 CRITICAL | 5-7h |
| **BlogPosts** | payload-cms-architect | - | 🟡 P1 HIGH | 3-4h |
| **FAQs** | payload-cms-architect | - | 🟡 P1 HIGH | 2-3h |
| **Media** | payload-cms-architect | - | 🟡 P1 HIGH | 3-4h |
| **Campaigns** | payload-cms-architect | - | 🟢 P2 NORMAL | 4-5h |
| **AdsTemplates** | payload-cms-architect | - | 🟢 P2 NORMAL | 4-5h |

---

## Implementation Batches

### Batch 1: PII Collections (GDPR Critical) - 16-22h
**Priority:** P0 - BLOCKING for production
**Security:** Maximum (GDPR compliance required)
**Agent:** payload-cms-architect + security-gdpr-compliance

#### 1.1 Students Collection
- **Agent:** `payload-cms-architect`
- **MCP Tool:** `sequential-thinking` (GDPR complexity analysis)
- **Fields:** 31 (15+ PII fields)
- **Security Patterns:** SP-001, SP-002 (GDPR), SP-004 (no PII logging)
- **Validations:** DNI checksum, Spanish phone, age >= 16
- **Tests:** 120+ tests
- **Est. Time:** 6-8h

**Key Challenges:**
- Field-level access control (15+ PII fields)
- GDPR consent immutability
- Spanish-specific validation (DNI, phone)
- Emergency contact validation

#### 1.2 Enrollments Collection
- **Agent:** `payload-cms-architect`
- **Fields:** 30 (financial + academic tracking)
- **Security Patterns:** SP-001 (7 immutable fields)
- **Validations:** Financial amounts, payment status, capacity
- **Tests:** 107+ tests
- **Est. Time:** 5-7h

**Key Challenges:**
- Financial data protection (Admin/Gestor only)
- Real-time capacity management
- Payment workflow validation
- Certificate issuance immutability

#### 1.3 Leads Collection
- **Agent:** `payload-cms-architect` + `security-gdpr-compliance`
- **MCP Tools:** `sequential-thinking`, `spec-kit`
- **Fields:** 26 (GDPR critical)
- **Security Patterns:** SP-001 (5 fields), SP-002, SP-004
- **Validations:** Public form endpoint, consent tracking
- **Tests:** 65+ tests
- **Est. Time:** 5-7h

**Key Challenges:**
- Public endpoint security
- GDPR consent capture
- Duplicate prevention (24h window)
- UTM parameter tracking

---

### Batch 2: Content Collections - 8-11h
**Priority:** P1 - Required for public site
**Security:** Standard
**Agent:** payload-cms-architect

#### 2.1 BlogPosts Collection
- **Fields:** 15 (rich text, SEO, media)
- **Tests:** 50+ tests
- **Est. Time:** 3-4h

#### 2.2 FAQs Collection
- **Fields:** 8 (simple Q&A pairs)
- **Tests:** 30+ tests
- **Est. Time:** 2-3h

#### 2.3 Media Collection
- **Fields:** 12 (file uploads, S3/local)
- **Tests:** 40+ tests
- **Est. Time:** 3-4h

---

### Batch 3: Marketing Collections - 8-10h
**Priority:** P2 - Marketing automation
**Security:** Standard + business intelligence protection
**Agent:** payload-cms-architect

#### 3.1 Campaigns Collection
- **Fields:** 20 (UTM, ROI, analytics)
- **Tests:** 60+ tests
- **Est. Time:** 4-5h

#### 3.2 AdsTemplates Collection
- **Fields:** 25 (multi-language, versioning)
- **Tests:** 55+ tests
- **Est. Time:** 4-5h

---

## Parallel Execution Strategy

### Session 1: Students Collection (NOW)
```bash
Agent: payload-cms-architect
Tool: sequential-thinking (GDPR analysis)
Duration: 6-8h
Output: 120+ tests, SP-001/SP-002/SP-004 applied
```

### Session 2: Enrollments Collection
```bash
Agent: payload-cms-architect
Duration: 5-7h
Output: 107+ tests, financial data protection
```

### Session 3: Leads Collection
```bash
Agent: payload-cms-architect + security-gdpr-compliance
Tools: sequential-thinking, spec-kit
Duration: 5-7h
Output: 65+ tests, public endpoint secure
```

### Session 4: Content Batch (Parallel)
```bash
Agents: 3x payload-cms-architect (parallel)
Collections: BlogPosts, FAQs, Media
Duration: 3-4h (if parallel)
Output: 120+ tests combined
```

### Session 5: Marketing Batch (Parallel)
```bash
Agents: 2x payload-cms-architect (parallel)
Collections: Campaigns, AdsTemplates
Duration: 4-5h (if parallel)
Output: 115+ tests combined
```

---

## MCP Tools Usage

### sequential-thinking
**Use Cases:**
- Complex GDPR compliance analysis (Students, Leads)
- Multi-step validation logic
- Security pattern application

**Collections:** Students, Leads

### spec-kit
**Use Cases:**
- Generate formal specifications for public endpoints
- Document API contracts

**Collections:** Leads (public form endpoint)

### task-master-ai
**Use Cases:**
- Break down complex collections into subtasks
- Coordinate parallel agent execution

**Collections:** All (optional)

### coderabbit (via GitHub PAT)
**Use Cases:**
- Automated code review after implementation
- Security vulnerability scanning

**Collections:** All (post-implementation)

---

## Security Checklist (Per Collection)

### SP-001: Defense in Depth
- [ ] Identify immutable fields (created_by, timestamps, etc.)
- [ ] Layer 1: admin.readOnly = true
- [ ] Layer 2: access.update = () => false
- [ ] Layer 3: Hook validation

### SP-002: GDPR Critical Fields
- [ ] Identify consent fields (gdpr_consent, privacy_policy_accepted)
- [ ] Ensure immutability
- [ ] Capture consent metadata (timestamp, IP)

### SP-004: No PII Logging
- [ ] Review all hook error messages
- [ ] Use IDs only, never names/emails
- [ ] Sanitize validation errors

### Field-Level Access Control
- [ ] Define role-based field visibility
- [ ] Implement access.read for sensitive fields
- [ ] Test with all 6 roles

---

## Test Coverage Targets

| Collection | Target Tests | Min Coverage | Est. Lines |
|-----------|--------------|--------------|------------|
| Students | 120+ | 80% | 650 lines |
| Enrollments | 107+ | 80% | 600 lines |
| Leads | 65+ | 80% | 605 lines |
| BlogPosts | 50+ | 75% | 400 lines |
| FAQs | 30+ | 75% | 250 lines |
| Media | 40+ | 75% | 350 lines |
| Campaigns | 60+ | 80% | 545 lines |
| AdsTemplates | 55+ | 80% | 618 lines |

**Total Target:** 527+ tests, 4,018 lines implementation

---

## Success Criteria

### Phase 2 Complete When:
- [ ] 13/13 collections implemented
- [ ] 785+ total tests passing
- [ ] 80%+ test coverage overall
- [ ] Zero security vulnerabilities
- [ ] All SP-001/SP-002/SP-004 patterns applied
- [ ] TypeScript types generated
- [ ] Documentation complete

### Performance Targets:
- [ ] API response time <200ms (p95)
- [ ] Database queries optimized (no N+1)
- [ ] Admin UI load time <2s

---

## Timeline

**Optimistic (parallel execution):** 18-24 hours
**Realistic (sequential):** 24-30 hours
**Conservative (with reviews):** 30-35 hours

**Target Completion:** 2025-11-05 (6 days @ 4-5h/day)

---

## Risk Mitigation

### Risk 1: GDPR Complexity (Students, Leads)
**Mitigation:** Use security-gdpr-compliance agent for review

### Risk 2: Test Coverage Below 80%
**Mitigation:** Write tests FIRST (TDD), verify before commit

### Risk 3: Field-Level Access Bugs
**Mitigation:** Test all 6 roles systematically

### Risk 4: Performance Issues (N+1 queries)
**Mitigation:** Review hooks for database calls, use batching

---

## Next Immediate Action

**START NOW:** Implement Students collection with payload-cms-architect agent

```bash
Agent: payload-cms-architect
Collection: Students
Duration: 6-8h
Priority: P0 CRITICAL
Security: SP-001 + SP-002 + SP-004
Tests: 120+
```

---

**Plan Status:** ✅ APPROVED FOR EXECUTION
**Author:** project-coordinator (SOLARIA methodology)
**Approved By:** CTO (auto-approved for agent execution)
