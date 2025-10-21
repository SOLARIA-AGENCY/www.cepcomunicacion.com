# Agent Assignments - CEPComunicacion v2

## Specialized Agent Roster

This document defines the 6 specialized agents and their responsibilities for the CEPComunicacion v2 project.

## Agent Selection Rules

1. **Always identify** the most adequate agent for each task
2. **One agent per task** - Don't mix concerns
3. **Sequential execution** - Complete one agent's work before moving to the next
4. **Test before handoff** - Each agent must pass all tests before next agent starts
5. **Use Task tool** - Invoke agents with `subagent_type` parameter

---

## 1. postgresql-schema-architect

**When to use:**
- Designing or modifying database schema
- Creating database migrations
- Adding indexes for query optimization
- Implementing referential integrity constraints
- Designing audit trails and versioning
- Optimizing slow queries
- Planning database migrations

**Responsibilities:**
- Design PostgreSQL tables with proper data types
- Create foreign key relationships
- Add indexes (B-tree, GIN, partial)
- Implement check constraints
- Design composite primary keys
- Create database migrations (up/down)
- Optimize query performance
- Implement audit logging (created_at, updated_at)

**Example tasks:**
- "Design the Courses, Cycles, and Campuses tables with relationships"
- "Create indexes for the Leads search query (filter by campaign + date range)"
- "Optimize the course listing query - it's slow with 1000+ courses"
- "Add audit trails to all tables (created_at, updated_at, created_by)"

**Handoff to:**
- `payload-cms-architect` - After schema is designed, implement Payload collections
- `security-gdpr-compliance` - For security review of database access patterns

**Example invocation:**
```typescript
Task({
  subagent_type: "postgresql-schema-architect",
  description: "Design Courses schema with indexes",
  prompt: `Design the PostgreSQL schema for the Courses collection with:
  - Fields: slug, title, duration, modality, cycle_id (FK), campus_id (FK)
  - Indexes for: slug (unique), cycle_id, campus_id, (cycle_id + campus_id) composite
  - Audit fields: created_at, updated_at
  - Referential integrity with Cycles and Campuses tables
  Follow TDD methodology: write migration tests first.`
});
```

---

## 2. payload-cms-architect

**When to use:**
- Creating or modifying Payload CMS collections
- Configuring role-based access control (Admin, Gestor, Marketing, Asesor, Lectura)
- Implementing hooks (afterChange, beforeValidate, etc.)
- Designing REST or GraphQL APIs
- Setting up versioning and drafts
- Configuring collection relationships

**Responsibilities:**
- Implement Payload CollectionConfig
- Configure fields with validation
- Set up access control functions
- Implement collection hooks
- Configure admin UI customization
- Set up relationships (hasMany, hasOne)
- Configure uploads and media
- Implement custom endpoints

**Example tasks:**
- "Create the Courses collection with slug, title, duration, modality fields"
- "Add access control so Marketing role can only read/create but not delete"
- "Implement afterChange hook to trigger lead.created worker when Lead is created"
- "Configure Courses to have hasMany relationship with CourseRuns"

**Handoff to:**
- `bullmq-worker-automation` - When hooks need to trigger background jobs
- `security-gdpr-compliance` - For security review of access control
- `react-frontend-dev` - For frontend integration with CMS APIs

**Example invocation:**
```typescript
Task({
  subagent_type: "payload-cms-architect",
  description: "Create Courses collection",
  prompt: `Implement the Courses collection in Payload CMS:
  - Fields: slug (unique, indexed), title (required), duration (number), modality (select)
  - Relationships: belongsTo Cycles, belongsTo Campuses
  - Access control: Admin (all), Gestor (all), Marketing (read/create), Asesor (read)
  - Hook: beforeValidate to auto-generate slug from title if not provided
  - Admin UI: useAsTitle: 'title', defaultColumns: ['title', 'modality', 'duration']
  Follow TDD: write API integration tests first (supertest).`
});
```

---

## 3. react-frontend-dev

**When to use:**
- Creating or modifying React components
- Building new pages (Home, Cursos, Ciclos, Sedes, Blog, FAQ, Contacto)
- Implementing routing and navigation
- Integrating with Payload CMS REST API
- Improving SEO, accessibility, and performance
- Implementing tracking (GA4, Meta Pixel, Plausible)
- Creating reusable UI components

**Responsibilities:**
- Build React components with TypeScript
- Implement React Router pages
- Integrate with Payload CMS REST API
- Style with TailwindCSS (Glassmorphism design system)
- Implement forms with validation
- Add accessibility (ARIA, keyboard navigation)
- Optimize Core Web Vitals
- Implement tracking scripts (GDPR-compliant)

**Example tasks:**
- "Create the Cursos listing page with filter by cycle and campus"
- "Build the LeadForm component with Zod validation and GDPR consent"
- "Implement the Hero component with glassmorphism effects"
- "Optimize the homepage - Core Web Vitals scores are low"

**Handoff to:**
- `security-gdpr-compliance` - For GDPR compliance review of forms/tracking
- `bullmq-worker-automation` - If forms trigger background jobs (lead processing)

**Example invocation:**
```typescript
Task({
  subagent_type: "react-frontend-dev",
  description: "Create Cursos listing page",
  prompt: `Build the Cursos (courses) listing page:
  - Fetch courses from Payload REST API (/api/courses)
  - Implement FilterPanel component (filter by cycle, campus, modality)
  - Display CourseCard components in responsive grid
  - Add pagination (12 courses per page)
  - Implement URL params for filters (?cycle=grado-superior&campus=madrid)
  - Style with TailwindCSS glassmorphism
  - Add loading skeletons
  - Ensure accessibility (ARIA labels, keyboard navigation)
  Follow TDD: write component tests first (@testing-library/react).`
});
```

---

## 4. bullmq-worker-automation

**When to use:**
- Implementing background job processing
- Setting up BullMQ queues and workers
- Integrating external services (Mailchimp, WhatsApp, OpenAI)
- Configuring retry policies and idempotency
- Troubleshooting failed jobs or queue bottlenecks
- Implementing job monitoring and alerting
- Designing job workflows with dependencies

**Responsibilities:**
- Implement BullMQ workers (lead.created, campaign.sync, stats.rollup, etc.)
- Configure Redis queues
- Set up retry strategies (exponential backoff)
- Implement idempotency (job deduplication)
- Integrate external APIs with graceful degradation
- Add job monitoring with BullBoard
- Implement error handling and alerting
- Design job priorities and rate limiting

**Example tasks:**
- "Implement lead.created worker to send welcome email via MailHog"
- "Create campaign.sync worker to sync leads with Mailchimp (if enabled)"
- "Add retry logic to OpenAI content generation worker (3 retries, exponential backoff)"
- "Debug failed backup.daily jobs - they're timing out"

**Handoff to:**
- `security-gdpr-compliance` - For security review of external API integrations
- `infra-devops-architect` - For Redis/BullMQ infrastructure scaling

**Example invocation:**
```typescript
Task({
  subagent_type: "bullmq-worker-automation",
  description: "Implement lead.created worker",
  prompt: `Implement the lead.created BullMQ worker:
  - Triggered by Leads collection afterChange hook
  - Sends welcome email via MailHog SMTP
  - Syncs with Mailchimp if ENABLE_MAILCHIMP_INTEGRATION=true (graceful degradation)
  - Retry: 3 attempts, exponential backoff (1s, 10s, 60s)
  - Idempotency: check if lead already processed (Redis cache)
  - Logging: structured logs with lead_id, job_id, timestamp
  - Error handling: catch and log errors, don't crash worker
  Follow TDD: write worker integration tests first (spawn worker, send job, verify).`
});
```

---

## 5. security-gdpr-compliance

**When to use:**
- Implementing authentication and authorization
- Reviewing security vulnerabilities
- Ensuring GDPR compliance (consent, data retention, right to erasure)
- Configuring rate limiting and DDoS protection
- Implementing audit logging
- Reviewing access control policies
- Setting up backup strategies
- Configuring HTTPS and SSL certificates

**Responsibilities:**
- Implement JWT authentication
- Configure role-based access control (RBAC)
- Add rate limiting (Express rate limit)
- Implement GDPR consent management
- Configure audit logging (who, what, when)
- Review code for SQL injection, XSS, CSRF vulnerabilities
- Set up HTTPS with Let's Encrypt
- Implement backup and disaster recovery
- Configure security headers (HSTS, CSP, etc.)

**Example tasks:**
- "Review LeadForm for GDPR compliance - ensure consent is tracked"
- "Implement rate limiting on /api/leads endpoint (10 requests/minute)"
- "Audit database access patterns - ensure no SQL injection vulnerabilities"
- "Configure HTTPS with Let's Encrypt for production deployment"

**Handoff to:**
- `infra-devops-architect` - For infrastructure-level security (firewall, SSL)
- `payload-cms-architect` - For access control implementation

**Example invocation:**
```typescript
Task({
  subagent_type: "security-gdpr-compliance",
  description: "GDPR audit of LeadForm",
  prompt: `Perform GDPR compliance audit of the LeadForm component and Leads collection:
  - Verify consent checkbox is required and logged (consent_date, ip_address)
  - Check privacy policy link is present and accessible
  - Ensure data retention policy is implemented (delete after 2 years)
  - Verify right to erasure endpoint (/api/leads/:id/erase)
  - Check rate limiting on form submission (prevent spam)
  - Verify data encryption at rest (PostgreSQL, Redis)
  - Ensure audit logging (who created/accessed lead)
  Provide report with compliance status and recommendations.`
});
```

---

## 6. infra-devops-architect

**When to use:**
- Configuring Docker containers and Docker Compose
- Setting up Nginx reverse proxy
- Configuring SSL certificates (Let's Encrypt)
- Implementing deployment pipelines
- Configuring backup strategies
- Setting up monitoring systems (Prometheus, Grafana)
- Implementing security hardening on VPS
- Troubleshooting infrastructure issues

**Responsibilities:**
- Design Docker Compose orchestration
- Configure Nginx as reverse proxy
- Set up SSL with Let's Encrypt (Certbot)
- Implement automated backups (PostgreSQL, MinIO)
- Configure monitoring and alerting
- Implement VPS migration scripts
- Secure VPS (UFW firewall, fail2ban, SSH hardening)
- Optimize resource allocation (RAM, CPU limits)

**Example tasks:**
- "Configure Nginx reverse proxy for frontend, CMS, and BullBoard services"
- "Set up Let's Encrypt SSL certificates with auto-renewal"
- "Implement automated PostgreSQL backups to MinIO (daily at 3 AM)"
- "Configure Prometheus + Grafana for monitoring all Docker services"

**Handoff to:**
- `security-gdpr-compliance` - For infrastructure security review
- `bullmq-worker-automation` - For backup job implementation

**Example invocation:**
```typescript
Task({
  subagent_type: "infra-devops-architect",
  description: "Configure Nginx SSL reverse proxy",
  prompt: `Configure Nginx as reverse proxy with SSL:
  - Frontend: https://cepcomunicacion.com → http://frontend:3000
  - CMS API: https://api.cepcomunicacion.com → http://cms:3001
  - BullBoard: https://queue.cepcomunicacion.com → http://bullboard:3002
  - SSL: Let's Encrypt certificates with Certbot auto-renewal
  - Security headers: HSTS, CSP, X-Frame-Options
  - Rate limiting: 100 req/min per IP
  - Gzip compression enabled
  - HTTP/2 enabled
  Create nginx.conf and docker-compose.yml configuration.`
});
```

---

## Agent Workflow Example

### Feature: Course Listing Page with Database Optimization

#### Step 1: Database Schema (postgresql-schema-architect)

```typescript
Task({
  subagent_type: "postgresql-schema-architect",
  description: "Design Courses schema with indexes",
  prompt: `Design PostgreSQL schema for Courses with optimized indexes for listing query.
  Expected query: SELECT * FROM courses WHERE cycle_id = ? AND campus_id = ? ORDER BY title LIMIT 12 OFFSET 0;
  Add composite index on (cycle_id, campus_id, title) for optimal performance.`
});
```

**Output:** Migration files, schema documentation, performance analysis

#### Step 2: Payload Collection (payload-cms-architect)

```typescript
Task({
  subagent_type: "payload-cms-architect",
  description: "Implement Courses collection",
  prompt: `Implement Courses collection in Payload CMS based on the schema from postgresql-schema-architect.
  Add REST API endpoints, access control, and validation.`
});
```

**Output:** CollectionConfig, API integration tests, access control tests

#### Step 3: React Frontend (react-frontend-dev)

```typescript
Task({
  subagent_type: "react-frontend-dev",
  description: "Build Cursos listing page",
  prompt: `Build Cursos listing page that consumes the Courses REST API from payload-cms-architect.
  Implement filtering, pagination, and responsive design.`
});
```

**Output:** React components, unit tests, E2E tests

#### Step 4: Security Review (security-gdpr-compliance)

```typescript
Task({
  subagent_type: "security-gdpr-compliance",
  description: "Security audit of Courses feature",
  prompt: `Audit the Courses listing feature for security vulnerabilities:
  - SQL injection in filter params
  - XSS in course titles
  - Rate limiting on API endpoint
  - GDPR compliance (if personal data displayed)`
});
```

**Output:** Security audit report, recommendations, fixes

#### Step 5: Infrastructure Deployment (infra-devops-architect)

```typescript
Task({
  subagent_type: "infra-devops-architect",
  description: "Deploy Courses feature to production",
  prompt: `Deploy the Courses feature to production VPS:
  - Run database migrations
  - Update Nginx configuration if needed
  - Configure monitoring for new API endpoints
  - Verify SSL certificate coverage
  - Test VPS migration with new feature`
});
```

**Output:** Deployment scripts, monitoring dashboards, migration verification

---

## Agent Communication Protocol

### Handoff Format

When one agent completes their work and needs to hand off to another:

```markdown
## Handoff to [agent-name]

**Completed:**
- [List of completed tasks]
- [Test results]
- [Coverage metrics]

**Files created/modified:**
- [List with file paths]

**Next agent tasks:**
- [Specific tasks for next agent]
- [Dependencies or context needed]

**Blockers/Issues:**
- [Any issues next agent should be aware of]
```

### Example Handoff

```markdown
## Handoff to payload-cms-architect

**Completed:**
- PostgreSQL schema for Courses, Cycles, Campuses tables
- Migration files: 001_create_courses.sql, 002_add_indexes.sql
- Test coverage: 100% (migration tests)
- Performance verified: <10ms query time for course listing

**Files created/modified:**
- /infra/postgres/migrations/001_create_courses.sql
- /infra/postgres/migrations/002_add_indexes.sql
- /infra/postgres/tests/courses.schema.test.ts

**Next agent tasks:**
- Implement Courses CollectionConfig with fields matching schema
- Add relationships: Courses belongsTo Cycles, Courses belongsTo Campuses
- Configure access control (Admin, Gestor, Marketing, Asesor)
- Implement REST API endpoints (/api/courses)

**Blockers/Issues:**
- None. Schema is ready for Payload implementation.
```

---

## Decision Matrix: Which Agent to Use?

| Task Type | Agent | Rationale |
|-----------|-------|-----------|
| Create new table in PostgreSQL | postgresql-schema-architect | Database schema design |
| Add index to existing table | postgresql-schema-architect | Query optimization |
| Implement Payload collection | payload-cms-architect | CMS configuration |
| Add hook to collection | payload-cms-architect | CMS business logic |
| Create React component | react-frontend-dev | Frontend UI |
| Fetch data from API | react-frontend-dev | Frontend integration |
| Implement background job | bullmq-worker-automation | Async task processing |
| Send email on event | bullmq-worker-automation | External service integration |
| Review for SQL injection | security-gdpr-compliance | Security audit |
| Configure HTTPS | infra-devops-architect | Infrastructure security |
| Set up Docker service | infra-devops-architect | Infrastructure orchestration |
| Optimize Nginx config | infra-devops-architect | Infrastructure performance |

---

## Summary

**6 Specialized Agents:**

1. **postgresql-schema-architect** - Database design, migrations, indexes, optimization
2. **payload-cms-architect** - Collections, hooks, access control, REST APIs
3. **react-frontend-dev** - Components, pages, routing, UI/UX, accessibility
4. **bullmq-worker-automation** - Background jobs, queues, external integrations
5. **security-gdpr-compliance** - Authentication, authorization, GDPR, security audits
6. **infra-devops-architect** - Docker, Nginx, SSL, backups, monitoring, deployments

**Always:**
- ✅ Identify the most adequate agent for each task
- ✅ Use Task tool with `subagent_type` parameter
- ✅ Follow TDD methodology for all agents
- ✅ Complete tests before handoff to next agent
- ✅ Provide clear handoff documentation
- ✅ One agent per task (don't mix concerns)

**Development is agent-based and test-driven - no exceptions.**
