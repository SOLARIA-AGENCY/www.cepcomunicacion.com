# ADR-003: Frontend REST API Migration

**Status:** Accepted
**Date:** 2025-11-09
**Decision Makers:** Development Team
**Affected Systems:** apps/web-next (Frontend), apps/cms (Payload CMS)

---

## Context and Problem Statement

### Discovered Issue

During typography implementation deployment (2025-11-09), critical architectural flaw discovered:

**Current Implementation (INCORRECT):**
- apps/web-next (Frontend) has own payload.config.ts
- Frontend imports getPayload() from 'payload'
- Direct PostgreSQL access via Drizzle ORM
- Registers 4 collections locally
- Competes with CMS for DB connections

**Symptoms:**
- Frontend build fails: "column courses.course_type does not exist"
- Schema mismatch: DB has `base_price`, frontend expects `price`
- Duplicate collection definitions across apps
- Tight coupling between frontend and CMS internals

### Root Cause Analysis

**Why This Happened:**
1. Initial implementation misunderstood Payload architecture
2. Frontend was configured with direct Payload access (monolith pattern)
3. No API client layer implemented
4. Collections copied/modified separately in each app
5. No architectural review before deployment

**Technical Debt Created:**
- 2 payload.config.ts files maintaining separate state
- Duplicate collection code (Users, Cycles, Campuses, Courses)
- Frontend depends on Payload internals (@payloadcms/db-postgres, drizzle-orm)
- Build complexity (migrations must run before frontend build)

---

## Decision Drivers

1. **Separation of Concerns**: Frontend should not know about database schema
2. **Independent Deployability**: Frontend and CMS should deploy independently
3. **API Contract**: Clear interface between systems via REST/GraphQL
4. **Scalability**: Enable horizontal scaling of frontend instances
5. **Maintainability**: Single source of truth for data models
6. **Security**: Frontend should not have direct DB credentials

---

## Considered Options

### Option A: Keep Current Architecture (Direct Payload Access)
**Pros:**
- No code changes needed
- Type safety with Payload types
- Faster data access (no HTTP overhead)

**Cons:**
- Tight coupling between apps
- Schema must stay in sync manually
- Cannot deploy independently
- Security risk (frontend has DB credentials)
- Violates microservices principles

**Decision:** REJECTED

### Option B: REST API Client Layer (SELECTED)
**Pros:**
- Loose coupling via HTTP interface
- CMS is single source of truth
- Independent deployability
- Standard web architecture
- Frontend can be static/edge deployed
- Clear API contract

**Cons:**
- HTTP latency (negligible for SSR)
- Needs API client implementation
- Types must be generated/shared

**Decision:** ACCEPTED

---

## Decision

**We will refactor the frontend to consume Payload CMS via REST API.**

### Implementation Plan

**Phase 1: Preparation** (30 min)
1. Create ADR-003 documentation
2. Backup current frontend state
3. Create rollback script
4. Document current API endpoints from CMS

**Phase 2: API Client Implementation** (45 min)
1. Create `apps/web-next/lib/payloadClient.ts`
2. Implement fetch wrapper with error handling
3. Add TypeScript types (minimal, from CMS API responses)
4. Test API connectivity from frontend container

**Phase 3: Refactor Data Fetching** (60 min)
1. Update `app/(frontend)/page.tsx` (homepage)
2. Update `app/(frontend)/cursos/[slug]/page.tsx` (course detail)
3. Replace all `getPayload()` calls with `payloadClient` calls

**Phase 4: Cleanup** (30 min)
1. Remove `payload.config.ts` from apps/web-next
2. Remove `collections/` directory from apps/web-next
3. Remove `access/` and `utils/` directories
4. Update package.json: remove Payload dependencies
5. Update tsconfig.json: remove Payload path aliases

**Phase 5: Build & Deploy** (30 min)
1. Rebuild frontend Docker image
2. Test locally (docker compose)
3. Deploy to production
4. Verify all pages load correctly
5. Monitor logs for errors

**Total Estimated Time:** 3 hours

---

## Consequences

### Positive
- Loose coupling: Frontend and CMS can evolve independently
- Clear contract: REST API provides stable interface
- Independent deployment: Frontend can deploy without CMS rebuild
- Security: Frontend no longer has DB credentials
- Scalability: Frontend instances can scale horizontally
- Maintainability: Single source of truth (CMS) for schema

### Negative
- HTTP latency: ~10-50ms overhead per request (acceptable for SSR)
- Type safety: Reduced (can mitigate with codegen tools later)
- Initial work: 3 hours migration effort

---

## Rollback Strategy

If migration fails:

```bash
cd /var/www/cepcomunicacion
git checkout apps/web-next/payload.config.ts
git checkout apps/web-next/collections/
git checkout apps/web-next/app/(frontend)/page.tsx
docker compose build frontend --no-cache
docker compose up -d frontend
```

**Rollback Time:** < 15 minutes

---

## Verification Checklist

- [ ] Homepage loads without errors
- [ ] Featured courses display correctly
- [ ] Course detail pages load
- [ ] All typography changes (Montserrat) visible
- [ ] Admin dashboard still functional
- [ ] CMS API responds to direct requests
- [ ] No errors in browser console
- [ ] No errors in Docker logs

---

**Author:** Claude (AI Assistant)
**Approved By:** CTO (Carlos J. Pérez)
**Implementation Date:** 2025-11-09
