# CEPComunicacion v2 - Automated Development Prompt

## 🎯 Mission

You are starting **Phase 1 Development** for **CEPComunicacion v2** - a complete lead management and marketing automation platform for **CEP FORMACIÓN Y COMUNICACIÓN S.L.**, a vocational training company.

## 📚 Context

### Project Status
- ✅ **Phase 0 COMPLETE:** All specifications finalized (11,405 lines, 9 documents)
- ✅ **Architecture COMPLETE:** Self-contained Docker infrastructure designed
- ✅ **Documentation COMPLETE:** Executive summaries, guides, and technical specs ready
- 🚀 **Phase 1 STARTING:** Implementation begins now

### What You're Building

A **monorepo** with:
- **Public website** (React + Vite) - Course catalog, lead forms, SEO-optimized pages
- **CMS backend** (Payload 3) - Content management, REST APIs, admin dashboard
- **Background workers** (BullMQ) - Lead processing, email automation, analytics
- **Infrastructure** (Docker) - 12 self-contained services, 100% VPS portable

### Key Principles

1. **Test-Driven Development (TDD)** - MANDATORY for ALL code
2. **Agent-Based Development** - Specialized agents for specialized tasks
3. **Self-Contained Docker** - No critical external dependencies
4. **Automated Progress** - Use TodoWrite tool, NOT manual TODO lists
5. **Live Development** - Hot reload servers always running
6. **Atomic Commits** - Each commit passes all tests

---

## 🧠 Required Knowledge

### Claude Code Memories

You have access to two critical memory files:

1. **`.claude/memories/development-methodology.md`** - TDD workflow, test pyramid, coverage thresholds, commit conventions
2. **`.claude/memories/agent-assignments.md`** - 6 specialized agents and when to use them

**IMPORTANT:** Read these files FIRST before starting any development. They define the mandatory methodology.

### Documentation Location

All specifications are in `/docs/specs/`:

- `01-business-requirements/` - Business goals, target users, success metrics
- `02-system-architecture/` - Technical stack, microservices design, data flow
- `03-database-schema/` - 13 tables, relationships, indexing strategy
- `04-api-specifications/` - 47 REST endpoints, request/response schemas
- `05-frontend-specifications/` - 50+ components, 8 pages, design system
- `06-workers-automation/` - 5 BullMQ jobs, retry policies, external integrations
- `07-security-gdpr/` - 6-layer security, GDPR compliance, audit logging
- `08-testing-quality/` - TDD methodology, test pyramid, coverage requirements
- `09-infrastructure/` - Docker Compose, VPS setup, backup strategy

---

## 🛠️ Development Setup

### Prerequisites Check

Before starting, verify you have:

```bash
# Node.js 22+ and pnpm
node --version  # Should be v22.x.x
pnpm --version  # Should be 9.x.x

# Docker and Docker Compose
docker --version  # Should be 20.x.x+
docker compose version  # Should be v2.x.x+

# Git
git --version  # Should be 2.x.x+
```

If any are missing, install them first.

### Project Initialization

Run these commands in sequence:

```bash
# 1. Navigate to project directory
cd /Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com

# 2. Initialize pnpm workspace
pnpm init

# 3. Install root dependencies
pnpm add -D typescript @types/node vitest @vitest/ui eslint prettier husky lint-staged

# 4. Initialize TypeScript
pnpm tsc --init

# 5. Set up monorepo workspace
cat > pnpm-workspace.yaml << 'WORKSPACE'
packages:
  - 'apps/*'
  - 'packages/*'
WORKSPACE

# 6. Create package.json scripts
```

Add these scripts to root `package.json`:

```json
{
  "scripts": {
    "dev": "pnpm --parallel --filter './apps/*' dev",
    "build": "pnpm --recursive build",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "typecheck": "tsc --noEmit",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down",
    "docker:logs": "docker compose logs -f",
    "docker:clean": "docker compose down -v && docker system prune -af"
  }
}
```

### Docker Services Startup

```bash
# Start all 12 Docker services
docker compose up -d

# Verify all services are running
docker compose ps

# Expected services:
# - postgres (database)
# - redis (queue + cache)
# - minio (S3-compatible storage)
# - mailhog (SMTP server)
# - nginx (reverse proxy)
# - frontend (React app - will add later)
# - cms (Payload CMS - will add later)
# - worker-automation (BullMQ worker - will add later)
# - worker-llm (content generation - will add later)
# - worker-stats (analytics - will add later)
# - bullboard (queue monitoring)
# - backup (automated backups)

# View logs for all services
docker compose logs -f
```

---

## 🧪 Test-Driven Development Workflow

### MANDATORY: Read Methodology First

```bash
# Read the TDD methodology
cat .claude/memories/development-methodology.md

# Read agent assignments
cat .claude/memories/agent-assignments.md
```

### TDD Cycle for Every Feature

**1. RED ❌ - Write Failing Test First**

```typescript
// Example: apps/cms/src/collections/Courses/Courses.test.ts
describe('POST /api/courses', () => {
  it('should create a course', async () => {
    const response = await request(app)
      .post('/api/courses')
      .send({ slug: 'test', title: 'Test Course', duration: 60, modality: 'online' })
      .expect(201);
    expect(response.body.doc).toHaveProperty('id');
  });
});
```

Run test: `pnpm test:cms` → **FAILS** ❌

**2. GREEN ✅ - Write Minimum Code to Pass**

```typescript
// apps/cms/src/collections/Courses/Courses.ts
export const Courses: CollectionConfig = {
  slug: 'courses',
  fields: [
    { name: 'slug', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'duration', type: 'number', required: true },
    { name: 'modality', type: 'select', options: ['presencial', 'online', 'hibrido'], required: true },
  ],
};
```

Run test: `pnpm test:cms` → **PASSES** ✅

**3. REFACTOR 🔄 - Improve While Tests Stay Green**

Add validation, better types, hooks, etc. Keep running tests to ensure they stay green.

**4. COMMIT ✅ - Atomic Commit**

```bash
git add .
git commit -m "feat(cms): add Courses collection with validation

- Add Zod schema for course validation
- Implement CRUD endpoints
- Add comprehensive unit tests
- Test coverage: 95%"
```

### Coverage Requirements

Every commit MUST meet these thresholds:

```json
{
  "lines": 80,
  "functions": 80,
  "branches": 75,
  "statements": 80
}
```

Run `pnpm test:coverage` to verify.

---

## 🤖 Agent-Based Development

### The 6 Specialized Agents

Use the Task tool to invoke specialized agents:

1. **postgresql-schema-architect** - Database schema, migrations, indexes
2. **payload-cms-architect** - Collections, hooks, access control, REST APIs
3. **react-frontend-dev** - Components, pages, routing, UI/UX
4. **bullmq-worker-automation** - Background jobs, queues, integrations
5. **security-gdpr-compliance** - Security audits, GDPR, authentication
6. **infra-devops-architect** - Docker, Nginx, SSL, backups

### When to Use Each Agent

| Task | Agent |
|------|-------|
| Design database tables | postgresql-schema-architect |
| Create Payload collection | payload-cms-architect |
| Build React component | react-frontend-dev |
| Implement background job | bullmq-worker-automation |
| Review for vulnerabilities | security-gdpr-compliance |
| Configure Docker service | infra-devops-architect |

### Example Agent Invocation

```typescript
Task({
  subagent_type: "payload-cms-architect",
  description: "Create Courses collection",
  prompt: `Implement the Courses collection in Payload CMS:
  - Fields: slug, title, duration, modality, cycle_id, campus_id
  - Relationships: belongsTo Cycles, belongsTo Campuses
  - Access control: Admin (all), Gestor (all), Marketing (read/create)
  - Validation: Zod schema with proper constraints
  - Hook: beforeValidate to auto-generate slug from title
  Follow TDD: write API integration tests first (supertest).`
});
```

---

## 📋 Task Tracking with TodoWrite

### MANDATORY: Use TodoWrite, NOT Manual TODOs

❌ **NEVER DO THIS:**

```typescript
// TODO: Implement validation
// TODO: Add tests
// TODO: Fix bug
```

✅ **ALWAYS DO THIS:**

```typescript
TodoWrite({
  todos: [
    { content: "Write failing tests for Courses collection", status: "in_progress", activeForm: "Writing tests" },
    { content: "Implement Courses collection", status: "pending", activeForm: "Implementing collection" },
    { content: "Add validation schemas", status: "pending", activeForm: "Adding validation" },
    { content: "Write integration tests", status: "pending", activeForm: "Writing integration tests" },
    { content: "Verify coverage thresholds", status: "pending", activeForm: "Verifying coverage" },
  ]
});
```

### Update Todos as You Progress

```typescript
// After completing a task
TodoWrite({
  todos: [
    { content: "Write failing tests for Courses collection", status: "completed", activeForm: "Writing tests" },
    { content: "Implement Courses collection", status: "in_progress", activeForm: "Implementing collection" },
    // ...
  ]
});
```

**Rules:**
- Exactly ONE task `in_progress` at a time
- Mark tasks `completed` IMMEDIATELY after finishing
- Never batch completions
- Remove irrelevant tasks from the list

---

## 🚀 Phase 1 Development Plan

### Week 1-2: Foundation & Database

**Tasks:**

1. **Database Schema Design** (postgresql-schema-architect)
   - Design all 13 tables (Courses, Cycles, Campuses, Leads, Campaigns, etc.)
   - Create migration files with up/down scripts
   - Add indexes (B-tree, GIN, composite)
   - Implement audit fields (created_at, updated_at)
   - Write migration tests

2. **PostgreSQL Setup in Docker**
   - Initialize database in Docker container
   - Run migrations
   - Seed test data
   - Verify connections

**Deliverables:**
- `/infra/postgres/migrations/` - All migration files
- `/infra/postgres/seeds/` - Test data seeds
- `/infra/postgres/tests/` - Migration tests
- ✅ All tests passing
- ✅ Coverage > 80%

---

### Week 3-4: Payload CMS Backend

**Tasks:**

1. **Core Collections** (payload-cms-architect)
   - Courses collection (slug, title, duration, modality, cycle, campus)
   - Cycles collection (slug, name, description)
   - Campuses collection (slug, name, city, address)
   - CourseRuns collection (course, cycle, start_date, end_date)
   - Leads collection (name, email, phone, course, campaign, status)

2. **Access Control** (payload-cms-architect + security-gdpr-compliance)
   - Define 5 roles: Admin, Gestor, Marketing, Asesor, Lectura
   - Implement access control functions for each collection
   - Add audit logging (who accessed what, when)

3. **Collection Hooks** (payload-cms-architect)
   - `afterChange` on Leads → trigger lead.created worker
   - `beforeValidate` on Courses → auto-generate slug
   - `afterDelete` on Leads → GDPR audit log

**Deliverables:**
- `/apps/cms/src/collections/` - All CollectionConfig files
- `/apps/cms/src/access/` - Access control functions
- `/apps/cms/src/hooks/` - Collection hooks
- `/apps/cms/tests/` - API integration tests (supertest)
- ✅ All 47 REST endpoints working
- ✅ All tests passing
- ✅ Coverage > 80%

---

### Week 5-6: BullMQ Workers

**Tasks:**

1. **Lead Processing Worker** (bullmq-worker-automation)
   - `lead.created` - Send welcome email, sync to Mailchimp (if enabled)
   - Retry: 3 attempts, exponential backoff
   - Idempotency: check Redis cache
   - Error handling: structured logging

2. **Campaign Sync Worker** (bullmq-worker-automation)
   - `campaign.sync` - Sync leads with Mailchimp campaigns
   - Rate limiting: respect Mailchimp API limits
   - Graceful degradation if Mailchimp disabled

3. **Stats Rollup Worker** (bullmq-worker-automation)
   - `stats.rollup` - Daily analytics aggregation
   - Store results in Redis for fast dashboard queries

4. **Backup Worker** (bullmq-worker-automation + infra-devops-architect)
   - `backup.daily` - PostgreSQL dump to MinIO at 3 AM UTC
   - Compression, integrity verification, 30-day retention

**Deliverables:**
- `/apps/workers/automation/src/jobs/` - All worker implementations
- `/apps/workers/automation/tests/` - Worker integration tests
- `/apps/workers/automation/docker/` - Worker Dockerfile
- ✅ All workers tested with real Redis/BullMQ
- ✅ All tests passing
- ✅ Coverage > 80%

---

### Week 7-8: React Frontend - Core Pages

**Tasks:**

1. **Design System Setup** (react-frontend-dev)
   - TailwindCSS configuration with Glassmorphism utilities
   - Color palette, typography, spacing system
   - Reusable components: Button, Input, Card, Badge, Modal

2. **Homepage** (react-frontend-dev)
   - Hero section with CTA
   - Featured courses (fetch from /api/courses?featured=true)
   - Stats widget (enrollment numbers)
   - Testimonials section

3. **Cursos (Courses) Page** (react-frontend-dev)
   - Course listing with pagination (12 per page)
   - FilterPanel (filter by cycle, campus, modality)
   - CourseCard component
   - URL params for filters (?cycle=grado-superior&campus=madrid)

4. **Course Detail Page** (react-frontend-dev)
   - Course information (title, duration, modality, description)
   - Related courses (same cycle)
   - LeadForm component (inquiry form)

**Deliverables:**
- `/apps/web/src/components/` - All React components
- `/apps/web/src/pages/` - All page components
- `/apps/web/tests/` - Component tests (@testing-library/react)
- `/apps/web/e2e/` - E2E tests (Playwright)
- ✅ All pages responsive (mobile, tablet, desktop)
- ✅ All tests passing
- ✅ Coverage > 80%
- ✅ Lighthouse score > 90 (Performance, Accessibility, SEO)

---

### Week 9-10: React Frontend - Forms & Interactivity

**Tasks:**

1. **LeadForm Component** (react-frontend-dev + security-gdpr-compliance)
   - Fields: name, email, phone, course, message
   - Validation: Zod schema (shared from @cepcomunicacion/validation)
   - GDPR consent checkbox (required)
   - Form submission → POST /api/leads
   - Success/error states, loading spinner
   - Accessibility (ARIA labels, keyboard navigation)

2. **Filter Components** (react-frontend-dev)
   - FilterPanel with checkboxes for cycle, campus, modality
   - URL sync (update query params on filter change)
   - Clear filters button
   - Filter count badge

3. **Search Component** (react-frontend-dev)
   - Global search bar (search courses by title, description)
   - Debounced API requests
   - Search results page
   - Highlight matching terms

**Deliverables:**
- `/apps/web/src/components/forms/` - Form components
- `/apps/web/src/components/filters/` - Filter components
- `/apps/web/tests/forms/` - Form validation tests
- ✅ GDPR compliance verified (security-gdpr-compliance agent review)
- ✅ All tests passing
- ✅ Coverage > 80%

---

### Week 11-12: Security, GDPR & Compliance

**Tasks:**

1. **Security Audit** (security-gdpr-compliance)
   - SQL injection review (all API endpoints)
   - XSS prevention (sanitize user inputs)
   - CSRF protection (CSRF tokens)
   - Rate limiting (10 req/min on /api/leads)
   - Security headers (HSTS, CSP, X-Frame-Options)

2. **GDPR Compliance** (security-gdpr-compliance)
   - Consent management (log consent_date, ip_address)
   - Data retention policy (delete leads after 2 years)
   - Right to erasure endpoint (DELETE /api/leads/:id/erase)
   - Privacy policy page (static content)
   - Cookie banner (if using tracking)

3. **Authentication & Authorization** (security-gdpr-compliance)
   - JWT authentication for CMS users
   - Role-based access control (5 roles)
   - Audit logging (who accessed what, when)

**Deliverables:**
- `/docs/reports/SECURITY_AUDIT.md` - Security audit report
- `/docs/reports/GDPR_COMPLIANCE.md` - GDPR compliance report
- `/apps/cms/src/auth/` - Authentication logic
- `/apps/web/src/pages/Privacidad.tsx` - Privacy policy page
- ✅ All vulnerabilities addressed
- ✅ GDPR compliance verified
- ✅ All tests passing

---

### Week 13-14: Infrastructure & Deployment

**Tasks:**

1. **Nginx Configuration** (infra-devops-architect)
   - Reverse proxy for frontend, CMS, BullBoard
   - SSL with Let's Encrypt (Certbot)
   - HTTP/2 enabled
   - Gzip compression
   - Rate limiting (100 req/min per IP)

2. **Docker Optimization** (infra-devops-architect)
   - Multi-stage builds for smaller images
   - Resource limits (RAM, CPU) for each service
   - Health checks for all services
   - Restart policies (unless-stopped)

3. **Backup & Recovery** (infra-devops-architect)
   - Automated PostgreSQL backups (daily at 3 AM)
   - Upload to MinIO (S3-compatible)
   - Backup verification (integrity checks)
   - Restore procedure documentation

4. **VPS Deployment** (infra-devops-architect)
   - Deploy to Hostinger VPS (148.230.118.124)
   - Configure firewall (UFW) - only ports 22, 80, 443
   - Set up monitoring (Prometheus + Grafana)
   - Test VPS migration (export → import)

**Deliverables:**
- `/infra/nginx/` - Nginx configuration files
- `/infra/backup/` - Backup scripts
- `/docs/guides/DEPLOYMENT.md` - Deployment guide
- `/docs/guides/VPS_MIGRATION.md` - VPS migration guide
- ✅ All services running in production
- ✅ SSL certificates installed
- ✅ Backups verified (test restore)
- ✅ Monitoring dashboards operational

---

## 🎯 Success Criteria for Phase 1

### Must Have (P0)

- [ ] All 13 database tables created with migrations
- [ ] All 5 Payload CMS collections implemented
- [ ] All 47 REST API endpoints working
- [ ] All 5 BullMQ workers implemented
- [ ] All 8 frontend pages implemented
- [ ] GDPR compliance verified
- [ ] Security audit passed
- [ ] All tests passing (100%)
- [ ] Coverage > 80% for all packages
- [ ] TypeScript errors = 0
- [ ] Linting errors = 0
- [ ] Lighthouse score > 90
- [ ] Docker services running in production
- [ ] SSL certificates installed
- [ ] Backups automated and verified

### Nice to Have (P1)

- [ ] E2E tests for all user flows (>90% coverage)
- [ ] Storybook for component documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Performance monitoring (New Relic/Sentry)
- [ ] A/B testing framework (Optimizely)

### Future (P2)

- [ ] Mobile app (React Native)
- [ ] Advanced analytics (custom dashboards)
- [ ] AI-powered course recommendations
- [ ] Multi-language support (i18n)

---

## ⚠️ Common Pitfalls to Avoid

### 1. ❌ NOT Writing Tests First

**Wrong:**
```typescript
// Implement feature first
export function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Write tests later (or never)
```

**Right:**
```typescript
// Write failing test first
describe('calculateTotal', () => {
  it('should sum item prices', () => {
    expect(calculateTotal([{ price: 10 }, { price: 20 }])).toBe(30);
  });
});

// Then implement
export function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### 2. ❌ Using Manual TODO Comments

**Wrong:**
```typescript
// TODO: Add validation
// TODO: Fix bug
// TODO: Write tests
```

**Right:**
```typescript
TodoWrite({
  todos: [
    { content: "Add validation to LeadForm", status: "in_progress", activeForm: "Adding validation" },
    { content: "Fix lead submission bug", status: "pending", activeForm: "Fixing bug" },
    { content: "Write E2E tests for lead flow", status: "pending", activeForm: "Writing E2E tests" },
  ]
});
```

### 3. ❌ Not Using Specialized Agents

**Wrong:**
```typescript
// Implement everything yourself without using agents
```

**Right:**
```typescript
// Use specialized agents for specialized tasks
Task({
  subagent_type: "postgresql-schema-architect",
  description: "Design Courses schema",
  prompt: "Design PostgreSQL schema for Courses with indexes..."
});
```

### 4. ❌ Committing Without Tests Passing

**Wrong:**
```bash
git commit -m "WIP: half-implemented feature"  # Tests failing
```

**Right:**
```bash
# Only commit when:
pnpm test           # ✅ All tests pass
pnpm typecheck      # ✅ No TS errors
pnpm lint           # ✅ No lint errors
pnpm test:coverage  # ✅ Coverage > 80%

git commit -m "feat(cms): add Courses collection"  # Atomic commit
```

### 5. ❌ Not Reading Documentation

**Wrong:**
```typescript
// Guess implementation details
```

**Right:**
```bash
# Read specs first
cat docs/specs/03-database-schema/DATABASE_SCHEMA.md
cat docs/specs/04-api-specifications/API_SPECIFICATION.md

# Then implement
```

---

## 🆘 Troubleshooting

### Docker Services Not Starting

```bash
# Check logs
docker compose logs -f

# Common fixes:
docker compose down -v          # Remove volumes
docker system prune -af         # Clean everything
docker compose up -d --build    # Rebuild images
```

### Tests Failing

```bash
# Run tests with verbose output
pnpm test -- --reporter=verbose

# Run specific test file
pnpm test Courses.test.ts

# Update snapshots (if using snapshot tests)
pnpm test -- -u
```

### TypeScript Errors

```bash
# Check for errors
pnpm typecheck

# Common fixes:
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Regenerate types
pnpm --filter cms payload generate:types
```

### Coverage Below Threshold

```bash
# See coverage report
pnpm test:coverage

# Open HTML report
open coverage/index.html

# Identify untested code
# Write more tests!
```

---

## 📊 Progress Tracking

### Use DEVELOPMENT.md

Update `/DEVELOPMENT.md` after completing each major milestone:

```markdown
# Development Progress

## Phase 1: Foundation & Implementation

### Week 1-2: Database ✅ COMPLETED
- [x] PostgreSQL schema design
- [x] Migration files
- [x] Indexes
- [x] Audit fields
- [x] Tests passing (100%)
- [x] Coverage: 95%

### Week 3-4: Payload CMS 🔄 IN PROGRESS
- [x] Courses collection
- [x] Cycles collection
- [x] Campuses collection
- [ ] Leads collection (70% done)
- [ ] Access control
- [ ] Collection hooks

### Week 5-6: Workers ⏳ PENDING
...
```

### Daily Standup Format

At the end of each day, summarize:

```markdown
## 2025-10-21

### Completed Today ✅
- Implemented Courses collection with validation
- Added access control (Admin, Gestor, Marketing)
- Wrote 25 integration tests (all passing)
- Coverage: 92%

### In Progress 🔄
- Implementing Leads collection (60% done)
- Writing hooks for lead.created worker trigger

### Blocked ❌
- None

### Tomorrow's Plan 📋
- Complete Leads collection
- Implement afterChange hook
- Write integration tests for hook
- Start lead.created worker (bullmq-worker-automation agent)
```

---

## 🎬 Let's Begin!

### Startup Checklist

Before you start coding:

- [ ] Read `.claude/memories/development-methodology.md`
- [ ] Read `.claude/memories/agent-assignments.md`
- [ ] Read `/docs/specs/` (at least skim all 9 documents)
- [ ] Run `pnpm install` (initialize workspace)
- [ ] Run `docker compose up -d` (start services)
- [ ] Run `pnpm test` (verify test setup works)
- [ ] Create first TodoWrite entry for Phase 1 tasks

### First Task: Database Schema

Start with the database foundation:

```typescript
TodoWrite({
  todos: [
    { 
      content: "Design PostgreSQL schema for all 13 tables", 
      status: "in_progress", 
      activeForm: "Designing schema" 
    },
    { 
      content: "Create migration files with up/down scripts", 
      status: "pending", 
      activeForm: "Creating migrations" 
    },
    { 
      content: "Add indexes (B-tree, GIN, composite)", 
      status: "pending", 
      activeForm: "Adding indexes" 
    },
    { 
      content: "Write migration tests", 
      status: "pending", 
      activeForm: "Writing migration tests" 
    },
    { 
      content: "Verify coverage > 80%", 
      status: "pending", 
      activeForm: "Verifying coverage" 
    },
  ]
});

// Then invoke the agent
Task({
  subagent_type: "postgresql-schema-architect",
  description: "Design complete database schema",
  prompt: `Design the complete PostgreSQL schema for CEPComunicacion v2:
  
  Tables to create (13 total):
  1. courses - Course catalog (slug, title, duration, modality, description)
  2. cycles - Educational cycles (slug, name, description)
  3. campuses - Physical locations (slug, name, city, address)
  4. course_runs - Course instances (course_id, cycle_id, start_date, end_date)
  5. leads - Lead submissions (name, email, phone, course_id, campaign_id, status)
  6. campaigns - Marketing campaigns (slug, name, platform, budget)
  7. ads_templates - Ad creative templates (campaign_id, format, content)
  8. users - CMS users (email, password_hash, role)
  9. media - File uploads (filename, mime_type, size, path)
  10. seo_metadata - SEO data (entity_type, entity_id, title, description, keywords)
  11. faqs - Frequently asked questions (question, answer, category, order)
  12. blog_posts - Blog articles (slug, title, content, author_id, status)
  13. audit_logs - GDPR audit trail (user_id, action, entity_type, entity_id, timestamp)

  For each table:
  - Define proper data types (TEXT, INTEGER, TIMESTAMP, JSONB, etc.)
  - Add NOT NULL constraints where appropriate
  - Create foreign keys with CASCADE/RESTRICT rules
  - Add indexes (B-tree for lookups, GIN for JSONB, composite for multi-column queries)
  - Add audit fields (created_at, updated_at, created_by, updated_by)
  - Include unique constraints where needed

  Relationships:
  - courses belongsTo cycles (cycle_id)
  - course_runs belongsTo courses (course_id) and cycles (cycle_id)
  - leads belongsTo courses (course_id) and campaigns (campaign_id)
  - ads_templates belongsTo campaigns (campaign_id)
  - blog_posts belongsTo users (author_id)

  Follow TDD methodology:
  1. Write failing migration tests first
  2. Create migration files (up/down)
  3. Run migrations
  4. Verify tests pass
  5. Verify coverage > 80%

  Provide:
  - Migration files (/infra/postgres/migrations/*.sql)
  - Migration tests (/infra/postgres/tests/*.test.ts)
  - Schema documentation (ERD diagram as Mermaid markdown)
  - Index strategy explanation`
});
```

### GO! 🚀

You are now ready to start Phase 1 development. Remember:

1. **Test-First Always** - Write failing tests before any production code
2. **Use Specialized Agents** - postgresql-schema-architect, payload-cms-architect, react-frontend-dev, etc.
3. **Track with TodoWrite** - Not manual TODO comments
4. **Atomic Commits** - Each commit passes all tests
5. **Live Development** - Hot reload servers always running
6. **80% Coverage Minimum** - No exceptions

**Good luck! Build something amazing.** 🎉

---

**Last Updated:** 2025-10-21
**Project:** CEPComunicacion v2 - Phase 1 Development
**Company:** CEP FORMACIÓN Y COMUNICACIÓN S.L.
