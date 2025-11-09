# Migration Plan - ADR-003: Frontend REST API Refactor

**Status:** In Progress
**Start Date:** 2025-11-09
**Estimated Duration:** 3 hours
**Methodology:** SOLARIA (Spec-Driven Development + Agent Specialization)

---

## Executive Summary

Refactoring `apps/web-next` (Frontend) to consume Payload CMS via REST API instead of direct database access. This fixes critical architectural flaw discovered during Montserrat typography deployment.

**Problem:** Frontend has direct PostgreSQL access via Payload SDK, causing schema conflicts and tight coupling.
**Solution:** Implement HTTP REST API client layer for loose coupling.

---

## Agent-Based Parallel Execution Plan

### Agent Assignments

| Agent ID | Agent Type | Task | Duration | Dependencies |
|----------|-----------|------|----------|--------------|
| **A1** | react-frontend-dev | Implement payloadClient.ts API wrapper | 30 min | None |
| **A2** | react-frontend-dev | Refactor page.tsx (homepage) | 20 min | A1 |
| **A3** | react-frontend-dev | Refactor cursos/[slug]/page.tsx | 20 min | A1 |
| **A4** | react-frontend-dev | Update CourseCard.tsx types | 15 min | A1 |
| **A5** | payload-cms-architect | Verify CMS API endpoints working | 15 min | None |
| **A6** | testing-automation-specialist | Create API client tests | 30 min | A1 |
| **A7** | react-frontend-dev | Clean up: remove payload.config.ts | 10 min | A2, A3 |
| **A8** | react-frontend-dev | Update package.json dependencies | 10 min | A7 |
| **COORDINATOR** | project-coordinator | Orchestrate, rebuild, deploy | 30 min | All |

**Total Parallel Time:** ~90 minutes (vs 3 hours sequential)

---

## Detailed Task Specifications

### Task A1: Implement Payload API Client
**Assignee:** react-frontend-dev agent
**File:** `apps/web-next/lib/payloadClient.ts`
**Priority:** P0 (Blocker for A2, A3, A4)

**Requirements:**
```typescript
// Create HTTP client for Payload CMS REST API
// Location: apps/web-next/lib/payloadClient.ts

export interface PayloadFindOptions {
  where?: Record<string, any>;
  limit?: number;
  depth?: number;
  sort?: string;
}

export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
}

export class PayloadClient {
  // Base URL from env: NEXT_PUBLIC_CMS_URL (default: http://cms:3000)
  // Methods:
  // - find<T>(collection: string, options: PayloadFindOptions): Promise<PayloadResponse<T>>
  // - findByID<T>(collection: string, id: string, depth: number): Promise<T>
  // - Error handling with descriptive messages
  // - Force no-cache for SSR
}
```

**Acceptance Criteria:**
- [ ] Class exports PayloadClient and singleton payloadClient
- [ ] find() method constructs correct query params
- [ ] findByID() method works with string/number IDs
- [ ] Error handling throws descriptive errors
- [ ] Uses fetch() with cache: 'no-store'
- [ ] TypeScript types fully defined

---

### Task A2: Refactor Homepage Data Fetching
**Assignee:** react-frontend-dev agent
**File:** `apps/web-next/app/(frontend)/page.tsx`
**Priority:** P0
**Depends On:** A1

**Current Code (REMOVE):**
```typescript
import { getPayload } from 'payload';
import configPromise from '@payload-config';

const payload = await getPayload({ config: configPromise });
const coursesData = await payload.find({
  collection: 'courses',
  where: { featured: { equals: true }, active: { equals: true } },
  limit: 3,
  depth: 2,
});
```

**New Code (IMPLEMENT):**
```typescript
import { payloadClient } from '@/lib/payloadClient';

const coursesData = await payloadClient.find('courses', {
  where: { featured: { equals: true }, active: { equals: true } },
  limit: 3,
  depth: 2,
});
```

**Acceptance Criteria:**
- [ ] Remove all Payload imports (getPayload, configPromise)
- [ ] Import payloadClient from @/lib/payloadClient
- [ ] Replace payload.find() with payloadClient.find()
- [ ] Keep error handling (try/catch)
- [ ] Preserve featuredCourses array structure
- [ ] No TypeScript errors
- [ ] Page still renders correctly

---

### Task A3: Refactor Course Detail Page
**Assignee:** react-frontend-dev agent
**File:** `apps/web-next/app/(frontend)/cursos/[slug]/page.tsx`
**Priority:** P0
**Depends On:** A1

**Current Code (REMOVE):**
```typescript
const payload = await getPayload({ config: configPromise });
const coursesResult = await payload.find({
  collection: 'courses',
  where: { slug: { equals: slug } },
  limit: 1,
  depth: 3,
});
```

**New Code (IMPLEMENT):**
```typescript
import { payloadClient } from '@/lib/payloadClient';

const coursesResult = await payloadClient.find('courses', {
  where: { slug: { equals: slug } },
  limit: 1,
  depth: 3,
});
```

**Acceptance Criteria:**
- [ ] Remove Payload imports
- [ ] Import payloadClient
- [ ] Replace payload.find() with payloadClient.find()
- [ ] Handle notFound() correctly if no course
- [ ] Preserve cycle and campuses type guards
- [ ] No TypeScript errors

---

### Task A4: Update CourseCard Types
**Assignee:** react-frontend-dev agent
**File:** `apps/web-next/components/ui/CourseCard.tsx`
**Priority:** P1
**Depends On:** A1

**Requirements:**
- Create minimal Course interface based on CMS API response
- Remove dependency on Payload-generated types
- Use simple TypeScript interfaces

**New Types:**
```typescript
// apps/web-next/lib/types.ts
export interface Course {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  modality: 'presencial' | 'online' | 'hibrido';
  duration_hours?: number;
  base_price?: number;
  financial_aid_available?: boolean;
  featured?: boolean;
  active?: boolean;
  cycle?: number | Cycle;
  campuses?: (number | Campus)[];
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: number;
  name: string;
  slug: string;
}

export interface Campus {
  id: number;
  name: string;
  city?: string;
}
```

**Acceptance Criteria:**
- [ ] Create types.ts with Course, Cycle, Campus interfaces
- [ ] Update CourseCard.tsx imports
- [ ] Remove import from '@/payload-types'
- [ ] No TypeScript errors

---

### Task A5: Verify CMS API Endpoints
**Assignee:** payload-cms-architect agent
**Priority:** P0 (Parallel with A1)

**Requirements:**
Test that CMS API endpoints are working correctly:

```bash
# From server
curl http://cms:3000/api/courses?limit=3
curl http://cms:3000/api/courses?where[featured][equals]=true
curl http://cms:3000/api/cycles
curl http://cms:3000/api/campuses
```

**Acceptance Criteria:**
- [ ] GET /api/courses returns 200
- [ ] Response has docs array
- [ ] where filter works correctly
- [ ] depth parameter populates relationships
- [ ] No authentication required for public endpoints

---

### Task A6: Create API Client Tests
**Assignee:** testing-automation-specialist agent
**File:** `apps/web-next/lib/__tests__/payloadClient.test.ts`
**Priority:** P2
**Depends On:** A1

**Requirements:**
```typescript
// Test coverage:
// - PayloadClient.find() success case
// - PayloadClient.find() with filters
// - PayloadClient.findByID() success
// - Error handling for 404
// - Error handling for network failure
// - Query parameter construction
```

**Acceptance Criteria:**
- [ ] Test file created with vitest
- [ ] Mock fetch() responses
- [ ] Tests pass locally
- [ ] Coverage >= 80%

---

### Task A7: Clean Up Payload Dependencies
**Assignee:** react-frontend-dev agent
**Priority:** P1
**Depends On:** A2, A3

**Files to DELETE:**
```
apps/web-next/payload.config.ts
apps/web-next/collections/ (entire directory)
apps/web-next/access/
apps/web-next/utils/slugify.ts
apps/web-next/utils/testHelpers.ts
apps/web-next/payload-types.ts
```

**Acceptance Criteria:**
- [ ] All listed files removed
- [ ] No broken imports remain
- [ ] TypeScript compilation succeeds
- [ ] No references to @payload-config

---

### Task A8: Update package.json
**Assignee:** react-frontend-dev agent
**File:** `apps/web-next/package.json`
**Priority:** P1
**Depends On:** A7

**Remove these dependencies:**
```json
"@payloadcms/db-postgres": "^3.61.1",
"@payloadcms/next": "^3.61.1",
"@payloadcms/richtext-slate": "^3.61.1",
"payload": "^3.61.1",
"drizzle-orm": "^0.31.2",
"drizzle-kit": "^0.22.7",
"pg": "^8.11.3"
```

**Update tsconfig.json:**
```json
// Remove these path aliases:
"@payload-config": ["./payload.config.ts"]
```

**Acceptance Criteria:**
- [ ] Dependencies removed from package.json
- [ ] Path alias removed from tsconfig.json
- [ ] pnpm install succeeds
- [ ] No unused dependency warnings

---

## Coordinator Tasks (Sequential)

### Task C1: Rebuild Frontend Docker Image
**Priority:** P0
**Depends On:** All A tasks

```bash
cd /var/www/cepcomunicacion
docker compose build frontend --no-cache
```

**Acceptance Criteria:**
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] Bundle size reduced (no Payload deps)
- [ ] Build time < 90 seconds

---

### Task C2: Deploy and Verify
**Priority:** P0
**Depends On:** C1

```bash
docker compose up -d frontend
sleep 10
curl -I http://46.62.222.138/
docker logs cep-frontend --tail 50
```

**Verification Checklist:**
- [ ] Homepage loads (200 OK)
- [ ] Montserrat typography visible
- [ ] Featured courses display (if data exists)
- [ ] Course detail pages load
- [ ] Admin dashboard still works
- [ ] No errors in frontend logs
- [ ] No errors in CMS logs

---

## Rollback Plan

If migration fails at any point:

```bash
cd /var/www/cepcomunicacion
git reset --hard HEAD~1  # Undo last commit
docker compose build frontend --no-cache
docker compose up -d frontend
```

**Rollback Time:** < 5 minutes

---

## Environment Variables Required

**Frontend (apps/web-next):**
```env
NEXT_PUBLIC_CMS_URL=http://cms:3000
NEXT_PUBLIC_API_URL=http://cms:3000/api
```

**Already configured in docker-compose.yml:**
```yaml
environment:
  - NEXT_PUBLIC_CMS_URL=http://cms:3000
  - NEXT_PUBLIC_API_URL=http://cms:3000/api
```

---

## Success Criteria

- [ ] Frontend uses REST API exclusively (no direct DB access)
- [ ] All pages load without errors
- [ ] Typography changes (Montserrat) visible
- [ ] Admin dashboard functional
- [ ] No Payload dependencies in frontend package.json
- [ ] Build time reduced
- [ ] Docker image size reduced
- [ ] No TypeScript compilation errors
- [ ] Tests pass
- [ ] Documentation updated

---

## Post-Migration Tasks

1. Monitor production logs for 24 hours
2. Update DEPENDENCY_VERSIONS_LOCK.md
3. Create performance baseline (response times)
4. Plan future optimizations:
   - Add Redis caching layer
   - Implement ISR (Incremental Static Regeneration)
   - Generate TypeScript types from Payload schema
   - Add GraphQL endpoint (optional)

---

**Methodology Applied:** SOLARIA
- ✅ Spec-Driven: All tasks have detailed specifications
- ✅ Zero Technical Debt: Clean architecture, no hacks
- ✅ Agent Specialization: Tasks assigned to appropriate agents
- ✅ Parallel Execution: Independent tasks run concurrently
- ✅ Quality Gates: Acceptance criteria for each task
- ✅ Documentation: Complete ADR and migration plan

---

**Coordinator:** Claude (AI Assistant)
**Review Date:** 2025-11-09 (end of day)
