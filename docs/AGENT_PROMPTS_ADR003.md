# Agent Prompts - ADR-003 Migration Execution

**Project:** CEPComunicacion v2
**Migration:** Frontend REST API Refactor
**Execution Mode:** Parallel (Claude Code Web)
**Coordinator:** Claude CLI

---

## Execution Order

**Phase 1 (Parallel):**
- Agent A1 + Agent A5 (Independent, no dependencies)

**Phase 2 (Parallel after A1 completes):**
- Agent A2 + Agent A3 + Agent A4 (All depend on A1)

**Phase 3 (Parallel after A2, A3, A4 complete):**
- Agent A6 + Agent A7

**Phase 4 (Sequential after A7):**
- Agent A8

**Phase 5 (Coordinator):**
- Rebuild, deploy, verify

---

## 🤖 AGENT A1: Implement Payload API Client

**Agent Type:** react-frontend-dev
**Priority:** P0 (Blocker)
**Estimated Time:** 30 minutes

### Prompt:

```
You are implementing a critical architectural change for the CEPComunicacion project.

CONTEXT:
- Project: CEPComunicacion v2 (educational platform)
- Location: apps/web-next (Next.js 16.0.1 frontend)
- Migration: ADR-003 - Refactoring frontend to consume Payload CMS via REST API
- Current Problem: Frontend has direct PostgreSQL access, causing schema conflicts
- Solution: HTTP REST API client layer

YOUR TASK:
Create a production-ready Payload CMS REST API client.

FILE TO CREATE:
apps/web-next/lib/payloadClient.ts

REQUIREMENTS:

1. **Class Structure:**
   - Export class PayloadClient
   - Export singleton instance: payloadClient
   - Constructor accepts baseUrl (default: process.env.NEXT_PUBLIC_CMS_URL || 'http://cms:3000')

2. **Methods:**

   a) find<T>(collection: string, options: PayloadFindOptions): Promise<PayloadResponse<T>>
      - Constructs query params from options object
      - Supports where, limit, depth, sort parameters
      - Uses fetch() with cache: 'no-store' for SSR
      - Returns full Payload response with docs, totalDocs, etc.

   b) findByID<T>(collection: string, id: string | number, depth: number = 0): Promise<T>
      - Fetches single document by ID
      - Supports depth for relationship population
      - Returns document directly (not wrapped in response)

3. **TypeScript Interfaces:**
   ```typescript
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
     hasNextPage: boolean;
     hasPrevPage: boolean;
   }
   ```

4. **Error Handling:**
   - Throw descriptive errors with status code and collection name
   - Example: "Failed to fetch courses: 404 Not Found"
   - Include URL in error for debugging

5. **Query Parameter Construction:**
   - where: JSON.stringify(options.where)
   - limit: options.limit.toString()
   - depth: options.depth.toString()
   - Use URLSearchParams for clean query building

6. **Example Usage (for reference):**
   ```typescript
   // Fetch featured courses
   const data = await payloadClient.find('courses', {
     where: { featured: { equals: true }, active: { equals: true } },
     limit: 3,
     depth: 2
   });
   console.log(data.docs); // Course[]

   // Fetch course by slug
   const courses = await payloadClient.find('courses', {
     where: { slug: { equals: 'desarrollo-web' } },
     limit: 1,
     depth: 3
   });
   ```

QUALITY STANDARDS (SOLARIA Methodology):
- ✅ TypeScript strict mode compliant
- ✅ No any types (use generics)
- ✅ JSDoc comments on all public methods
- ✅ Error messages include actionable information
- ✅ Code follows Next.js 16 best practices
- ✅ Cache strategy: 'no-store' for dynamic data

ACCEPTANCE CRITERIA:
- [ ] File created: apps/web-next/lib/payloadClient.ts
- [ ] Class PayloadClient exported
- [ ] Singleton payloadClient exported
- [ ] find() method implemented with all options
- [ ] findByID() method implemented
- [ ] All TypeScript interfaces defined
- [ ] Error handling comprehensive
- [ ] No TypeScript errors
- [ ] Code is production-ready

DO NOT:
- Don't use axios or other HTTP libraries (use native fetch)
- Don't add caching logic yet (will be added later)
- Don't implement authentication (public endpoints only)
- Don't add retry logic (keep it simple for now)

DELIVERABLE:
Complete, production-ready payloadClient.ts file ready to be used in pages.
```

---

## 🤖 AGENT A5: Verify CMS API Endpoints

**Agent Type:** payload-cms-architect
**Priority:** P0 (Parallel with A1)
**Estimated Time:** 15 minutes

### Prompt:

```
You are verifying that the Payload CMS REST API is ready for frontend consumption.

CONTEXT:
- Project: CEPComunicacion v2
- Server: root@46.62.222.138 (Hetzner VPS)
- CMS Service: cep-cms (Docker container)
- CMS URL: http://cms:3000 (internal network)
- Public URL: http://46.62.222.138/api/* (via Nginx proxy)

YOUR TASK:
Verify that all required CMS API endpoints are working correctly.

SSH ACCESS:
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138

ENDPOINTS TO TEST:

1. **Courses Endpoint:**
   ```bash
   # List all courses
   docker exec cep-cms wget -qO- http://localhost:3000/api/courses?limit=5

   # Featured courses only
   docker exec cep-cms wget -qO- 'http://localhost:3000/api/courses?where[featured][equals]=true&limit=3'

   # With depth (populate cycle)
   docker exec cep-cms wget -qO- 'http://localhost:3000/api/courses?depth=2&limit=3'

   # Single course by ID
   docker exec cep-cms wget -qO- http://localhost:3000/api/courses/1?depth=3
   ```

2. **Cycles Endpoint:**
   ```bash
   docker exec cep-cms wget -qO- http://localhost:3000/api/cycles
   ```

3. **Campuses Endpoint:**
   ```bash
   docker exec cep-cms wget -qO- http://localhost:3000/api/campuses
   ```

VERIFICATION CHECKLIST:
- [ ] GET /api/courses returns 200 OK
- [ ] Response has "docs" array
- [ ] Response has "totalDocs" number
- [ ] where[featured][equals]=true filter works
- [ ] depth=2 populates cycle relationship
- [ ] depth=3 populates nested relationships
- [ ] GET /api/cycles returns 200 OK
- [ ] GET /api/campuses returns 200 OK
- [ ] No authentication required for GET requests
- [ ] Response format matches PayloadResponse interface

RESPONSE FORMAT (Expected):
```json
{
  "docs": [...],
  "totalDocs": 10,
  "limit": 3,
  "totalPages": 4,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

TROUBLESHOOTING:
If endpoints fail:
1. Check CMS container logs: `docker logs cep-cms --tail 50`
2. Verify CMS is healthy: `docker compose ps cms`
3. Check database connection: `docker exec cep-cms env | grep DATABASE`
4. Test internal network: `docker exec cep-cms ping postgres`

DELIVERABLE:
Report with:
- Status of each endpoint (✅ Working / ❌ Failed)
- Sample response from /api/courses?depth=2&limit=1
- Any errors encountered
- Confirmation that frontend can consume these APIs
```

---

## 🤖 AGENT A2: Refactor Homepage Data Fetching

**Agent Type:** react-frontend-dev
**Priority:** P0
**Dependencies:** A1 (payloadClient.ts must exist)
**Estimated Time:** 20 minutes

### Prompt:

```
You are refactoring the homepage to use REST API instead of direct database access.

CONTEXT:
- File: apps/web-next/app/(frontend)/page.tsx
- Migration: ADR-003 - Frontend REST API refactor
- Dependency: payloadClient.ts (created by Agent A1)

YOUR TASK:
Replace direct Payload SDK calls with REST API client.

CURRENT CODE (REMOVE):
```typescript
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { Course } from '@/payload-types';

const payload = await getPayload({ config: configPromise });
let featuredCourses: Course[] = [];
try {
  const coursesData = await payload.find({
    collection: 'courses',
    where: {
      featured: { equals: true },
      active: { equals: true },
    },
    limit: 3,
    depth: 2,
  });
  featuredCourses = coursesData.docs || [];
} catch (error) {
  console.error('Error fetching featured courses:', error);
}
```

NEW CODE (IMPLEMENT):
```typescript
import { payloadClient } from '@/lib/payloadClient';

let featuredCourses: any[] = []; // Temporary: use any until types are created
try {
  const coursesData = await payloadClient.find('courses', {
    where: {
      featured: { equals: true },
      active: { equals: true },
    },
    limit: 3,
    depth: 2,
  });
  featuredCourses = coursesData.docs || [];
} catch (error) {
  console.error('Error fetching featured courses:', error);
}
```

CHANGES TO MAKE:

1. **Remove these imports:**
   ```typescript
   import { getPayload } from 'payload';
   import configPromise from '@payload-config';
   import type { Course } from '@/payload-types';
   ```

2. **Add this import:**
   ```typescript
   import { payloadClient } from '@/lib/payloadClient';
   ```

3. **Replace payload.find() with payloadClient.find()**

4. **Temporary type fix:**
   - Change `Course[]` to `any[]` for now
   - Agent A4 will create proper types later

5. **Keep everything else the same:**
   - Keep try/catch error handling
   - Keep export const dynamic = 'force-dynamic'
   - Keep all JSX/UI code unchanged
   - Keep Montserrat typography classes (title-hero, section-title-uppercase, etc.)

ACCEPTANCE CRITERIA:
- [ ] No imports from 'payload'
- [ ] No imports from '@payload-config'
- [ ] No imports from '@/payload-types'
- [ ] payloadClient imported from '@/lib/payloadClient'
- [ ] payloadClient.find() used instead of payload.find()
- [ ] Error handling preserved
- [ ] No TypeScript errors
- [ ] Page logic unchanged (only data fetching changed)

DO NOT:
- Don't change any JSX/UI code
- Don't remove Montserrat typography classes
- Don't change error handling logic
- Don't modify component structure

DELIVERABLE:
Updated page.tsx with REST API client integration.
```

---

## 🤖 AGENT A3: Refactor Course Detail Page

**Agent Type:** react-frontend-dev
**Priority:** P0
**Dependencies:** A1
**Estimated Time:** 20 minutes

### Prompt:

```
You are refactoring the course detail page to use REST API.

CONTEXT:
- File: apps/web-next/app/(frontend)/cursos/[slug]/page.tsx
- Migration: ADR-003
- Dependency: payloadClient.ts (created by Agent A1)

YOUR TASK:
Replace Payload SDK with REST API client.

CURRENT CODE (REMOVE):
```typescript
import { getPayload } from 'payload';
import configPromise from '@payload-config';

const payload = await getPayload({ config: configPromise });
const coursesResult = await payload.find({
  collection: 'courses',
  where: {
    slug: { equals: slug },
  },
  limit: 1,
  depth: 3,
});

const course = coursesResult.docs[0];
if (!course) {
  notFound();
}
```

NEW CODE (IMPLEMENT):
```typescript
import { payloadClient } from '@/lib/payloadClient';

const coursesResult = await payloadClient.find('courses', {
  where: {
    slug: { equals: slug },
  },
  limit: 1,
  depth: 3,
});

const course = coursesResult.docs[0];
if (!course) {
  notFound();
}
```

CHANGES TO MAKE:

1. **Remove Payload imports**
2. **Add payloadClient import**
3. **Replace payload.find() call**
4. **Keep all type guards:**
   ```typescript
   const cycleName = course.cycle && typeof course.cycle === 'object' && 'name' in course.cycle
     ? course.cycle.name
     : null;

   const campuses = course.campuses && Array.isArray(course.campuses)
     ? course.campuses.filter(c => typeof c !== 'string')
     : [];
   ```

5. **Preserve all UI code:**
   - Keep Montserrat classes (title-uppercase, section-title-uppercase, card-title-uppercase)
   - Keep all SVG icons
   - Keep MODALITY_LABELS object
   - Keep notFound() handling

ACCEPTANCE CRITERIA:
- [ ] Payload imports removed
- [ ] payloadClient imported
- [ ] payloadClient.find() used
- [ ] Type guards preserved
- [ ] notFound() logic unchanged
- [ ] UI code unchanged
- [ ] No TypeScript errors

DELIVERABLE:
Updated cursos/[slug]/page.tsx with REST API integration.
```

---

## 🤖 AGENT A4: Create Minimal Type Definitions

**Agent Type:** react-frontend-dev
**Priority:** P1
**Dependencies:** A1
**Estimated Time:** 15 minutes

### Prompt:

```
You are creating minimal TypeScript types for CMS API responses.

CONTEXT:
- Migration: ADR-003
- Problem: Frontend no longer has access to Payload-generated types
- Solution: Create minimal interfaces based on actual CMS API responses

YOUR TASK:
Create type definitions for Course, Cycle, and Campus.

FILE TO CREATE:
apps/web-next/lib/types.ts

TYPE DEFINITIONS (based on CMS schema):

```typescript
/**
 * Minimal TypeScript types for Payload CMS API responses
 * Based on actual CMS schema (apps/cms/src/collections)
 */

export interface Course {
  id: number;
  slug: string;
  name: string;

  // Description
  short_description?: string;
  long_description?: any; // Rich text (Slate JSON)

  // Relationships
  cycle: number | Cycle;
  campuses?: (number | Campus)[];
  featured_image?: number | Media;

  // Course details
  modality: 'presencial' | 'online' | 'hibrido';
  duration_hours?: number;
  base_price?: number;
  financial_aid_available?: boolean;

  // Flags
  active?: boolean;
  featured?: boolean;

  // SEO
  meta_title?: string;
  meta_description?: string;

  // Metadata
  created_by?: number | User;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: number;
  slug: string;
  name: string;
  code: string;
  level: 'fp_basica' | 'grado_medio' | 'grado_superior' | 'certificado_profesionalidad';
  description?: string;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campus {
  id: number;
  slug: string;
  name: string;
  code?: string;

  // Location
  address?: string;
  city?: string;
  postal_code?: string;
  province?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Contact
  phone?: string;
  email?: string;

  // Flags
  active?: boolean;
  is_main?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: number;
  alt?: string;
  url: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

// Type guards (utility functions)
export function isCyclePopulated(cycle: number | Cycle | undefined): cycle is Cycle {
  return typeof cycle === 'object' && cycle !== null && 'name' in cycle;
}

export function isCampusPopulated(campus: number | Campus | undefined): campus is Campus {
  return typeof campus === 'object' && campus !== null && 'name' in campus;
}
```

ACCEPTANCE CRITERIA:
- [ ] File created: apps/web-next/lib/types.ts
- [ ] All interfaces exported
- [ ] Type guards provided
- [ ] Matches CMS schema exactly
- [ ] No TypeScript errors
- [ ] Can be imported in components

DELIVERABLE:
Complete types.ts file with Course, Cycle, Campus interfaces.
```

---

## 🤖 AGENT A6: Create API Client Tests

**Agent Type:** testing-automation-specialist
**Priority:** P2
**Dependencies:** A1
**Estimated Time:** 30 minutes

### Prompt:

```
You are creating comprehensive tests for the Payload API client.

CONTEXT:
- File to test: apps/web-next/lib/payloadClient.ts
- Testing framework: Vitest (already configured)
- Coverage target: >= 80%

YOUR TASK:
Create a complete test suite for PayloadClient.

FILE TO CREATE:
apps/web-next/lib/__tests__/payloadClient.test.ts

TEST CASES TO COVER:

1. **find() method - Success:**
   - Returns docs array
   - Constructs correct query params
   - Handles where filter
   - Handles limit parameter
   - Handles depth parameter
   - Handles sort parameter

2. **find() method - Error handling:**
   - Throws on 404
   - Throws on 500
   - Includes collection name in error
   - Includes status code in error

3. **findByID() method - Success:**
   - Returns single document
   - Handles numeric ID
   - Handles string ID
   - Handles depth parameter

4. **findByID() method - Error handling:**
   - Throws on 404
   - Includes ID in error message

5. **Query parameter construction:**
   - where is JSON stringified correctly
   - Multiple params concatenated with &
   - Empty options object works

TEST IMPLEMENTATION:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PayloadClient, payloadClient } from '../payloadClient';

// Mock fetch globally
global.fetch = vi.fn();

describe('PayloadClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('find()', () => {
    it('should fetch collection with basic query', async () => {
      const mockResponse = {
        docs: [{ id: 1, name: 'Test Course' }],
        totalDocs: 1,
        limit: 10,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await payloadClient.find('courses', { limit: 10 });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/courses'),
        expect.objectContaining({
          method: 'GET',
          cache: 'no-store',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should construct where filter correctly', async () => {
      // ... test where filter
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        payloadClient.find('courses', {})
      ).rejects.toThrow('Failed to fetch courses: 404 Not Found');
    });
  });

  describe('findByID()', () => {
    it('should fetch single document by ID', async () => {
      const mockCourse = { id: 1, name: 'Test Course' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse,
      });

      const result = await payloadClient.findByID('courses', 1, 2);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/courses/1?depth=2'),
        expect.any(Object)
      );
      expect(result).toEqual(mockCourse);
    });
  });
});
```

QUALITY STANDARDS:
- ✅ Mock fetch() properly
- ✅ Test both success and error cases
- ✅ Verify query parameter construction
- ✅ Check error messages are descriptive
- ✅ Coverage >= 80%
- ✅ All tests pass

ACCEPTANCE CRITERIA:
- [ ] Test file created
- [ ] All methods tested
- [ ] Success and error cases covered
- [ ] Query param construction verified
- [ ] Tests pass: `pnpm test payloadClient`
- [ ] Coverage >= 80%

DELIVERABLE:
Complete test suite for payloadClient.
```

---

## 🤖 AGENT A7: Clean Up Payload Dependencies

**Agent Type:** react-frontend-dev
**Priority:** P1
**Dependencies:** A2, A3 (pages must be refactored first)
**Estimated Time:** 10 minutes

### Prompt:

```
You are removing obsolete Payload files from the frontend.

CONTEXT:
- Migration: ADR-003
- All pages now use payloadClient (A2, A3 completed)
- These files are no longer needed

YOUR TASK:
Delete all Payload-related files from apps/web-next.

FILES TO DELETE:

1. **Configuration:**
   - apps/web-next/payload.config.ts

2. **Collections:** (entire directory)
   - apps/web-next/collections/

3. **Access Control:**
   - apps/web-next/access/

4. **Utilities:**
   - apps/web-next/utils/slugify.ts
   - apps/web-next/utils/testHelpers.ts

5. **Generated Types:**
   - apps/web-next/payload-types.ts

VERIFICATION STEPS:

1. **Before deleting, verify no imports remain:**
   ```bash
   grep -r "from '@payload-config'" apps/web-next/app/
   grep -r "from 'payload'" apps/web-next/app/
   grep -r "from '@/payload-types'" apps/web-next/app/
   grep -r "getPayload" apps/web-next/app/
   ```
   All should return empty (no matches).

2. **Delete files:**
   ```bash
   rm apps/web-next/payload.config.ts
   rm -rf apps/web-next/collections/
   rm -rf apps/web-next/access/
   rm apps/web-next/utils/slugify.ts
   rm apps/web-next/utils/testHelpers.ts
   rm apps/web-next/payload-types.ts
   ```

3. **Verify TypeScript compilation:**
   ```bash
   cd apps/web-next
   pnpm exec tsc --noEmit
   ```
   Should complete with no errors.

ACCEPTANCE CRITERIA:
- [ ] All listed files deleted
- [ ] No broken imports
- [ ] TypeScript compilation succeeds
- [ ] No references to @payload-config
- [ ] No references to @/payload-types
- [ ] Git status shows deleted files

DELIVERABLE:
Frontend codebase cleaned of Payload internals.
```

---

## 🤖 AGENT A8: Update Dependencies

**Agent Type:** react-frontend-dev
**Priority:** P1
**Dependencies:** A7 (files must be deleted first)
**Estimated Time:** 10 minutes

### Prompt:

```
You are removing Payload dependencies from frontend package.json.

CONTEXT:
- Migration: ADR-003
- Frontend no longer uses Payload SDK
- All Payload files deleted (A7 completed)

YOUR TASK:
Update package.json and tsconfig.json.

FILE: apps/web-next/package.json

DEPENDENCIES TO REMOVE:
```json
"@payloadcms/db-postgres": "^3.61.1",
"@payloadcms/next": "^3.61.1",
"@payloadcms/richtext-slate": "^3.61.1",
"payload": "^3.61.1",
"drizzle-orm": "^0.31.2",
"drizzle-kit": "^0.22.7",
"pg": "^8.11.3"
```

FILE: apps/web-next/tsconfig.json

PATH ALIAS TO REMOVE:
```json
"@payload-config": ["./payload.config.ts"]
```

STEPS:

1. **Update package.json:**
   - Remove all 7 dependencies listed above
   - Keep all other dependencies unchanged

2. **Update tsconfig.json:**
   - Remove "@payload-config" from paths
   - Keep "@/*": ["./*"] alias

3. **Run pnpm install:**
   ```bash
   cd apps/web-next
   pnpm install
   ```
   This will update pnpm-lock.yaml

4. **Verify no errors:**
   ```bash
   pnpm exec tsc --noEmit
   ```

ACCEPTANCE CRITERIA:
- [ ] 7 dependencies removed from package.json
- [ ] @payload-config alias removed from tsconfig.json
- [ ] pnpm install completes successfully
- [ ] No peer dependency warnings
- [ ] TypeScript compilation succeeds
- [ ] pnpm-lock.yaml updated

EXPECTED RESULT:
- Package.json size reduced by ~7 dependencies
- No Payload packages in node_modules
- Cleaner dependency tree

DELIVERABLE:
Updated package.json and tsconfig.json without Payload dependencies.
```

---

## 📋 COORDINATOR INSTRUCTIONS

**After all agents complete their tasks, you (Coordinator) will:**

### Step 1: Collect Agent Reports
- Verify all acceptance criteria met
- Review any blockers or issues
- Confirm all files committed to git

### Step 2: Rebuild Frontend
```bash
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138
cd /var/www/cepcomunicacion
docker compose build frontend --no-cache
```

Expected:
- Build time: < 90 seconds
- No TypeScript errors
- Smaller bundle size

### Step 3: Deploy
```bash
docker compose up -d frontend
sleep 10
docker compose ps frontend
docker logs cep-frontend --tail 30
```

### Step 4: Verification
```bash
# Homepage
curl -I http://46.62.222.138/

# Course detail (if course exists)
curl -I http://46.62.222.138/cursos/test-slug

# Admin dashboard
curl -I http://46.62.222.138/admin

# Check logs
docker logs cep-frontend --tail 50
docker logs cep-cms --tail 50
```

### Step 5: Final Checklist
- [ ] Homepage loads (200 OK)
- [ ] Montserrat typography visible
- [ ] Featured courses display correctly
- [ ] Course detail pages load
- [ ] Admin dashboard functional
- [ ] No errors in frontend logs
- [ ] No errors in CMS logs
- [ ] Database connections stable

### Step 6: Documentation
Update DEPENDENCY_VERSIONS_LOCK.md with:
- Removed dependencies
- New architecture notes
- Migration completion date

---

## EXECUTION TIMELINE

```
T+0:00  → Launch A1 + A5 (parallel)
T+0:30  → A1 completes
T+0:30  → Launch A2 + A3 + A4 (parallel)
T+0:50  → A2, A3, A4 complete
T+0:50  → Launch A6 + A7 (parallel)
T+1:20  → A6, A7 complete
T+1:20  → Launch A8
T+1:30  → A8 completes
T+1:30  → Coordinator: Rebuild + Deploy
T+2:00  → Verification complete
T+2:15  → Documentation updated
```

**Total Time:** ~2 hours 15 minutes (vs 3 hours sequential)

---

**Status:** Ready for execution
**Coordinator:** Claude CLI
**Agents:** Claude Code Web (multiple sessions)
