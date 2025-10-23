# Stack Evaluation & Architecture Redesign
## CEPComunicacion v2 - Critical Decision Point

**Date:** 2025-10-23
**Status:** 🔴 BLOCKING ISSUE - Stack Incompatibility Detected
**Decision Required:** Complete backend stack replacement

---

## 🚨 PROBLEM IDENTIFIED

### Root Cause Analysis

**Incompatibility discovered:**
```
Current Stack:
- Payload CMS: 3.60.0 (requires Next.js architecture)
- Code written for: Payload 2.x (Express standalone)
- Result: 256 TypeScript errors (architectural mismatch)
```

**Why this happened:**
1. Project specs written assuming Payload 2.x (Express)
2. Dependencies installed with latest Payload 3.x (Next.js-based)
3. Payload 3.0 released with **breaking architectural changes** (Express → Next.js)

**Why we can't proceed:**
- ❌ Payload 3.x requires Next.js (client doesn't want Next.js)
- ❌ Payload 2.x will enter EOL soon (not sustainable)
- ❌ Downgrading would be technical debt accumulation

---

## 📋 PROJECT REQUIREMENTS (Non-Negotiable)

### Functional Requirements

1. **Headless CMS** with REST/GraphQL API
2. **13 Collections:**
   - Users (RBAC: 5 roles)
   - Cycles, Campuses, Courses, CourseRuns, Students
   - Enrollments, Leads, Campaigns, AdsTemplates
   - BlogPosts, FAQs, Media
3. **Role-Based Access Control (RBAC):**
   - Admin, Gestor, Marketing, Asesor, Lectura
   - Field-level permissions
4. **Audit Trail:** All mutations logged (user, timestamp, IP, action)
5. **GDPR Compliance:**
   - Consent tracking
   - Right to be forgotten
   - Data export
6. **Relationships:**
   - Many-to-one: Course → Cycle
   - Many-to-many: Course ↔ Campuses
   - Cascade deletes, referential integrity
7. **File uploads:** Images, PDFs (S3 or local storage)
8. **Background Jobs (BullMQ):**
   - Lead processing
   - Campaign sync
   - Stats aggregation
   - LLM content generation

### Technical Requirements

1. **TypeScript strict mode** everywhere
2. **PostgreSQL 16+** (relational DB required)
3. **Node.js 22+** runtime
4. **Docker deployment** (Docker Compose)
5. **Monorepo structure** (already established)
6. **React 19 frontend** (already built, working perfectly)
7. **No Next.js** (client preference)
8. **Express-based or similar** (REST API)

### Non-Functional Requirements

1. **Zero technical debt** philosophy
2. **Long-term maintainability** (5+ years)
3. **Active community support**
4. **Production-ready** within 8-10 weeks
5. **Spanish documentation** preferred (team is Spanish-speaking)

---

## 🔍 BACKEND/CMS ALTERNATIVES EVALUATION

### Option 1: Strapi (Headless CMS)

**Website:** https://strapi.io
**Version:** 4.x (stable), 5.x (beta)
**License:** MIT

#### Pros ✅
- ✅ **Express-based** (similar to Payload 2.x)
- ✅ **Mature ecosystem** (100k+ weekly downloads)
- ✅ **PostgreSQL native support**
- ✅ **Role-based permissions** out-of-the-box
- ✅ **GraphQL + REST API**
- ✅ **File uploads** (local, S3, Cloudinary)
- ✅ **Plugin ecosystem** (Auth, SEO, i18n, etc.)
- ✅ **TypeScript support**
- ✅ **Active development** (backed by company)
- ✅ **Excellent documentation** (English + translations)
- ✅ **Admin UI included** (customizable)
- ✅ **Audit logs** via plugins
- ✅ **Docker-friendly**

#### Cons ❌
- ❌ Admin UI is React-based but **separate from main app**
- ⚠️ RBAC is collection-level, **field-level requires custom code**
- ⚠️ No built-in audit trail (requires plugin)
- ⚠️ Relationships less flexible than Payload
- ⚠️ Learning curve for content types vs collections

#### Migration Effort
- **Time:** 2-3 weeks
- **Complexity:** Medium
- **Risk:** Low (well-documented migration paths)

#### Code Example
```typescript
// Strapi Collection (Content Type)
export default {
  kind: 'collectionType',
  collectionName: 'courses',
  info: { singularName: 'course', pluralName: 'courses' },
  options: { draftAndPublish: true },
  attributes: {
    title: { type: 'string', required: true },
    slug: { type: 'uid', targetField: 'title' },
    cycle: { type: 'relation', relation: 'manyToOne', target: 'api::cycle.cycle' },
    campuses: { type: 'relation', relation: 'manyToMany', target: 'api::campus.campus' },
  },
};
```

---

### Option 2: Directus (Data-First CMS)

**Website:** https://directus.io
**Version:** 10.x (stable)
**License:** GPL v3 (self-hosted), Commercial (cloud)

#### Pros ✅
- ✅ **Database-first approach** (works with existing PostgreSQL schemas)
- ✅ **Granular permissions** (field-level, role-based)
- ✅ **REST + GraphQL APIs**
- ✅ **Built-in audit logs** (activity tracking)
- ✅ **File management** (local, S3, Azure, etc.)
- ✅ **TypeScript SDK**
- ✅ **No vendor lock-in** (direct DB access)
- ✅ **Excellent UI** (modern, intuitive)
- ✅ **Webhooks** for background jobs
- ✅ **Docker official images**
- ✅ **Active development**

#### Cons ❌
- ❌ **Steeper learning curve** (data-first paradigm)
- ⚠️ Less "code-first" than Strapi/Payload
- ⚠️ Migrations require manual SQL or UI changes
- ⚠️ Custom logic requires extensions (separate apps)
- ⚠️ Community smaller than Strapi

#### Migration Effort
- **Time:** 3-4 weeks
- **Complexity:** Medium-High
- **Risk:** Medium (requires schema redesign)

#### Code Example
```typescript
// Directus Collection (auto-generated from DB)
// Define schema in PostgreSQL, Directus auto-discovers:
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  cycle_id UUID REFERENCES cycles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

// Access via SDK:
import { createDirectus, rest } from '@directus/sdk';
const client = createDirectus('http://localhost:8055').with(rest());
const courses = await client.request(readItems('courses'));
```

---

### Option 3: KeystoneJS (GraphQL-First CMS)

**Website:** https://keystonejs.com
**Version:** 6.x (stable)
**License:** MIT

#### Pros ✅
- ✅ **GraphQL-first** (REST available)
- ✅ **TypeScript-native**
- ✅ **Express-based**
- ✅ **PostgreSQL support** (Prisma ORM)
- ✅ **Code-first schema** (like Payload)
- ✅ **Field-level access control**
- ✅ **Hooks system** (like Payload)
- ✅ **Admin UI** (React-based, customizable)
- ✅ **Active community**

#### Cons ❌
- ❌ **Smaller ecosystem** than Strapi/Directus
- ⚠️ **Prisma dependency** (ORM adds complexity)
- ⚠️ No built-in audit logs
- ⚠️ File uploads require setup
- ⚠️ Less "batteries-included" than Strapi

#### Migration Effort
- **Time:** 3-4 weeks
- **Complexity:** Medium
- **Risk:** Medium (schema redesign with Prisma)

#### Code Example
```typescript
// KeystoneJS List (Collection)
import { list } from '@keystone-6/core';
import { text, relationship } from '@keystone-6/core/fields';

export const Course = list({
  fields: {
    title: text({ validation: { isRequired: true } }),
    slug: text({ isIndexed: 'unique' }),
    cycle: relationship({ ref: 'Cycle.courses', many: false }),
    campuses: relationship({ ref: 'Campus.courses', many: true }),
  },
  access: {
    operation: {
      query: ({ session }) => !!session,
      create: ({ session }) => session?.role === 'admin',
    },
  },
});
```

---

### Option 4: Custom Express + TypeORM/Prisma

**Build our own backend from scratch**

#### Pros ✅
- ✅ **Complete control** over architecture
- ✅ **No CMS lock-in**
- ✅ **Exact requirements** met
- ✅ **PostgreSQL native** (no ORM overhead)
- ✅ **TypeScript strict mode**
- ✅ **Express ecosystem** (full access)

#### Cons ❌
- ❌ **No admin UI** (must build from scratch)
- ❌ **No file management** (must build)
- ❌ **No RBAC library** (must implement)
- ❌ **Audit logs** (must implement)
- ❌ **Time-consuming** (8-12 weeks just for backend)
- ❌ **Maintenance burden** (no community support)

#### Migration Effort
- **Time:** 8-12 weeks
- **Complexity:** Very High
- **Risk:** High (reinventing the wheel)

---

### Option 5: NestJS (Enterprise Framework)

**Website:** https://nestjs.com
**Version:** 10.x (stable)
**License:** MIT

#### Pros ✅
- ✅ **Enterprise-grade** architecture
- ✅ **TypeScript-first**
- ✅ **Modular** (microservices-ready)
- ✅ **TypeORM/Prisma integration**
- ✅ **GraphQL + REST**
- ✅ **Dependency injection** (testable)
- ✅ **Swagger auto-documentation**
- ✅ **BullMQ integration** (official)
- ✅ **Huge ecosystem**

#### Cons ❌
- ❌ **No admin UI** (must build or integrate)
- ❌ **Steeper learning curve** (Angular-inspired)
- ⚠️ Requires **building CMS layer** on top
- ⚠️ More boilerplate than CMSs

#### Migration Effort
- **Time:** 6-8 weeks
- **Complexity:** High
- **Risk:** Medium-High (custom CMS layer)

---

## 🎯 RECOMMENDED STACK COMBINATIONS

### 🥇 Option A: Strapi + React (RECOMMENDED)

**Stack:**
```
Frontend:  React 19 + Vite + TailwindCSS (keep as-is)
Backend:   Strapi 4.x + Express + TypeScript
Database:  PostgreSQL 16
Queue:     BullMQ + Redis
Storage:   S3 (via Strapi plugin)
```

**Why this is best:**
- ✅ Fastest migration (2-3 weeks)
- ✅ Mature, stable ecosystem
- ✅ Express-based (familiar)
- ✅ Admin UI out-of-the-box
- ✅ Plugin for most needs (audit, auth, i18n)
- ✅ PostgreSQL native
- ✅ Active development + community
- ✅ Production-ready

**What we need to build:**
- ⚠️ Field-level permissions (custom middleware)
- ⚠️ Audit trail (via plugin or custom)
- ⚠️ Some custom hooks for business logic

**Risk:** LOW
**Timeline:** 2-3 weeks migration + 1 week testing
**Long-term:** Sustainable (5+ years)

---

### 🥈 Option B: Directus + React

**Stack:**
```
Frontend:  React 19 + Vite + TailwindCSS (keep as-is)
Backend:   Directus 10.x
Database:  PostgreSQL 16 (schema-first)
Queue:     BullMQ + Redis (via webhooks)
Storage:   S3 (built-in)
```

**Why this works:**
- ✅ Database-first (leverages PostgreSQL fully)
- ✅ Built-in audit logs
- ✅ Granular permissions (field-level)
- ✅ Modern UI
- ✅ No vendor lock-in

**What we need to adapt:**
- ⚠️ Redesign schema for Directus paradigm
- ⚠️ Custom logic via extensions
- ⚠️ Learn data-first approach

**Risk:** MEDIUM
**Timeline:** 3-4 weeks migration + 1 week testing
**Long-term:** Sustainable (5+ years)

---

### 🥉 Option C: KeystoneJS + React

**Stack:**
```
Frontend:  React 19 + Vite + TailwindCSS (keep as-is)
Backend:   KeystoneJS 6 + Prisma + Express
Database:  PostgreSQL 16 (via Prisma)
Queue:     BullMQ + Redis
Storage:   S3 (custom setup)
```

**Why this works:**
- ✅ TypeScript-native
- ✅ Code-first schema (like Payload)
- ✅ GraphQL-first
- ✅ Field-level access control

**What we need to build:**
- ⚠️ Audit logs (custom)
- ⚠️ File uploads (setup)
- ⚠️ Prisma migrations learning curve

**Risk:** MEDIUM
**Timeline:** 3-4 weeks migration + 1-2 weeks testing
**Long-term:** Sustainable (5+ years)

---

## 📊 COMPARISON MATRIX

| Feature | Strapi | Directus | KeystoneJS | Custom | NestJS |
|---------|--------|----------|------------|--------|--------|
| **Admin UI** | ✅ Included | ✅ Excellent | ✅ Included | ❌ Must build | ❌ Must build |
| **PostgreSQL** | ✅ Native | ✅ Native | ✅ Via Prisma | ✅ Native | ✅ Native |
| **Field-level RBAC** | ⚠️ Custom | ✅ Built-in | ✅ Built-in | ✅ Custom | ✅ Custom |
| **Audit Logs** | ⚠️ Plugin | ✅ Built-in | ❌ Custom | ✅ Custom | ✅ Custom |
| **File Uploads** | ✅ Plugins | ✅ Built-in | ⚠️ Setup | ❌ Must build | ⚠️ Setup |
| **TypeScript** | ✅ Supported | ✅ Supported | ✅ Native | ✅ Full control | ✅ Native |
| **Learning Curve** | 🟢 Low | 🟡 Medium | 🟡 Medium | 🔴 High | 🔴 High |
| **Migration Time** | 🟢 2-3 weeks | 🟡 3-4 weeks | 🟡 3-4 weeks | 🔴 8-12 weeks | 🔴 6-8 weeks |
| **Community** | 🟢 Large | 🟡 Medium | 🟡 Medium | ❌ None | 🟢 Large |
| **Long-term** | 🟢 Stable | 🟢 Stable | 🟢 Stable | ⚠️ Maintenance | 🟢 Stable |
| **Express-based** | ✅ Yes | ❌ No (custom) | ✅ Yes | ✅ Yes | ⚠️ Compatible |

---

## 🎖️ FINAL RECOMMENDATION

### Primary Choice: **Strapi 4.x**

**Rationale:**
1. ✅ **Fastest time-to-production** (2-3 weeks)
2. ✅ **Lowest risk** (mature, stable, large community)
3. ✅ **Express-based** (familiar paradigm)
4. ✅ **Admin UI included** (saves 4-6 weeks development)
5. ✅ **PostgreSQL native support**
6. ✅ **Plugin ecosystem** (audit, auth, file upload, etc.)
7. ✅ **Active development** (company-backed)
8. ✅ **Production-ready** out of the box
9. ✅ **Long-term sustainable** (not going EOL)

**Trade-offs accepted:**
- ⚠️ Field-level permissions require custom middleware (~2-3 days work)
- ⚠️ Audit trail via plugin or custom implementation (~1-2 days work)

**Migration Path:**
1. Install Strapi 4.x
2. Define content types (13 collections)
3. Configure relationships
4. Set up RBAC (5 roles)
5. Implement field-level permissions middleware
6. Add audit trail plugin/custom
7. Configure file upload (S3)
8. Migrate data from old system
9. Test thoroughly
10. Deploy

**Timeline:**
- Week 1: Setup + Collections (5 days)
- Week 2: RBAC + Permissions (5 days)
- Week 3: Custom logic + Testing (5 days)
- **Total: 15 working days (~3 weeks)**

---

## 🚀 NEXT STEPS

### Immediate Actions Required:

1. **Decision:** Approve Strapi as replacement for Payload ✅ ⬅️ **USER DECISION NEEDED**
2. **Planning:** Create detailed migration checklist
3. **Setup:** Initialize Strapi in monorepo
4. **Migration:** Port collections one by one
5. **Testing:** Verify all functionality
6. **Deployment:** Update Docker configs

### Questions for Client:

1. ✅ Approve Strapi 4.x as backend framework?
2. Do you need GraphQL or is REST API sufficient?
3. Any specific audit log requirements beyond standard?
4. File storage preference: S3, local, or Cloudinary?

---

**Created:** 2025-10-23
**Status:** 🟡 AWAITING DECISION
**Priority:** 🔴 CRITICAL - BLOCKING DEVELOPMENT

---

_This document will be updated after client decision._
