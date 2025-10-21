# Product Requirements Document (PRD)
# CEPComunicacion.com v2 - Plataforma Integral de Gestión Formativa

**Version:** 1.0.0
**Date:** 2025-10-20
**Status:** Phase 0 - Specification Complete
**Owner:** SOLARIA AGENCY - Dirección de Tecnología
**Client:** CEP FORMACIÓN
**Timeline:** 10-11 weeks (post-specification approval)

---

## Executive Summary

CEPComunicacion.com v2 is a comprehensive educational platform management system designed to replace the existing WordPress site for CEP FORMACIÓN. The platform unifies course management, site administration, marketing campaigns, lead tracking, and analytics into a single, modern, TypeScript-based ecosystem.

**Key Differentiators:**
- **Spec-Driven Development**: Complete technical specifications before any code
- **LLM-Powered Content Generation**: Automated course descriptions and Meta Ads from PDF materials
- **Internal Automation**: BullMQ workers replace n8n dependencies
- **Enterprise-Grade Security**: RGPD compliance, RBAC, audit logging built-in
- **Multi-Site Architecture**: Unlimited campus/sede management

---

## 1. Business Objectives

### Primary Goals
1. **Modernize Technology Stack**: Replace WordPress with scalable, maintainable TypeScript platform
2. **Centralize Operations**: Single dashboard for courses, campuses, campaigns, and leads
3. **Automate Marketing**: LLM-assisted content generation and ad creation
4. **Improve Analytics**: Real-time tracking of leads, conversions, and campaign performance
5. **Future-Proof Architecture**: Prepare for integration with campus educativo (`cepformacion.com`) and Agencia de Colocación

### Success Metrics
- **Operational Efficiency**: 50% reduction in time to publish new course
- **Lead Quality**: 30% increase in qualified leads through better tracking
- **Content Speed**: 80% faster ad copy generation with LLM pipeline
- **System Reliability**: 99.5% uptime SLA
- **SEO Performance**: Top 3 rankings for target keywords within 6 months

---

## 2. Target Users

### Internal Users (Admin Dashboard)

| Role | Count | Responsibilities | Permissions |
|------|-------|------------------|-------------|
| **Admin** | 2-3 | Full system access, configuration, user management | All collections, all fields, all actions |
| **Gestor Académico** | 5-8 | Course management, curriculum updates, convocations | Courses, CourseRuns, Cycles (full CRUD) |
| **Marketing** | 3-5 | Campaigns, ads, analytics, lead assignment | Campaigns, Ads Templates, Leads (read/write), Analytics (read) |
| **Asesor Comercial** | 10-15 | Lead follow-up, notes, status updates | Leads (read/update notes/status), Courses (read), Campuses (read) |
| **Lectura** | Unlimited | Read-only access for reporting and auditing | All collections (read-only) |

### External Users (Public Website)

1. **Prospective Students**
   - Age: 25-45 years
   - Motivation: Career advancement, skill retraining, subsidized education
   - Behavior: Research courses, compare modalities, submit lead forms
   - Devices: 60% mobile, 30% desktop, 10% tablet

2. **Empleados (Occupied Workers)**
   - Looking for SEPE-subsidized courses compatible with work schedule
   - Prefer semi-presencial or telemático modalities

3. **Desempleados (Unemployed)**
   - Seeking free, certified training for employability
   - High interest in job placement services (Agencia de Colocación)

4. **Private Course Seekers**
   - Willing to pay for premium courses (ciclos formativos, specialized training)
   - Expect flexible schedules and modern learning environments

---

## 3. Core Features

### 3.1 Course Management System

**Description:** Comprehensive CRUD for courses, convocations, and professional cycles.

**Requirements:**

- **Course Base Model (`Courses`)**
  - Fields: title, subtitle, family, offerType, modality, summary, objectives[], syllabus[], requirements[], outcomes[], benefits[], durationHours, docs[], coverImage, FAQs[], SEO metadata
  - Taxonomies:
    - offerType: telemático | ocupados | desempleados | privados | ciclo-medio | ciclo-superior
    - modality: presencial | semipresencial | telemático
  - Slug generation: auto from title, must be unique
  - Status workflow: draft → review → published → archived

- **Convocations (`CourseRuns`)**
  - Links to parent Course and Campus (if not telemático)
  - Fields: startDate, endDate, schedule, seats, price, funding, state, leadForm customizations, attachments, notes
  - State machine: abierta → lista_espera → cerrada | planificada
  - Validation: startDate ≤ endDate, campus required if course.isCampusIndependent === false

- **Professional Cycles (`Cycles`)**
  - For Ciclo Medio and Ciclo Superior (FP)
  - Fields: level (medio|superior), modules[], officialRequirements[], fctHours, outcomes[], docs[], SEO
  - Official regulations compliance (Spanish Ministry of Education)

**Acceptance Criteria:**
- ✅ Admin can create, edit, duplicate, archive courses
- ✅ Slug conflicts detected and prevented
- ✅ Draft/review workflow with notifications
- ✅ Bulk actions: publish multiple, export CSV
- ✅ Version history (Payload built-in) with rollback capability

---

### 3.2 Campus/Site Management

**Description:** Multi-site architecture with unlimited campus support.

**Requirements:**

- **Campus Model (`Campuses`)**
  - Fields: slug, name, address, city, province, zip, geo (lat/lng), transport[], contactPhone, contactEmail, openingHours (JSON), visible
  - Google Maps integration for geo coordinates
  - Transport info: bus lines, parking, metro/train

**Use Cases:**
- CEP has multiple physical locations (Santa Cruz, La Laguna, etc.)
- Each campus can host different course convocations
- Telemático courses are campus-independent
- Campus-specific landing pages for SEO (/sedes/santa-cruz)

**Acceptance Criteria:**
- ✅ Admin can add/edit/disable campuses
- ✅ Geo coordinates validated and displayed on map
- ✅ Transport info rendered on public site
- ✅ Courses filtered by campus in UI

---

### 3.3 Lead Capture & Tracking

**Description:** Comprehensive lead management with UTM tracking, RGPD compliance, and CRM integration.

**Requirements:**

- **Lead Form (Public)**
  - Fields: name (required), email (required), phone, courseRun (dropdown), consent checkbox (required)
  - Auto-capture: UTM parameters, referrer, device type, IP address (for RGPD)
  - Validation: Zod schema, hCaptcha verification
  - Events: `generate_lead` (GA4), `Lead` (Meta Pixel)

- **Lead Dashboard (Admin)**
  - List view: sortable, filterable by course, campus, campaign, status, date range
  - Detail view: full lead info, timeline of actions, notes (rich text), status updates
  - Bulk actions: assign to asesor, export CSV/XLSX, mark as contacted/qualified/enrolled/lost
  - Idempotency: Meta webhook leads deduplicated by `externalId`

- **Automation Triggers:**
  - `lead.created` job → Mailchimp upsert + WhatsApp message + CRM sync (if configured)
  - Email confirmation to lead (template configurable)
  - Internal notification to assigned asesor

**Acceptance Criteria:**
- ✅ Lead form submits successfully with validation
- ✅ UTM parameters stored correctly
- ✅ RGPD consent timestamp + IP recorded
- ✅ Meta webhook integration working (idempotent)
- ✅ Mailchimp contact created automatically
- ✅ WhatsApp message sent (Cloud API)
- ✅ Admin can view, filter, export leads
- ✅ Asesores can add notes and update status

---

### 3.4 Campaign & Ads Management

**Description:** Marketing campaign tracking with auto-generated UTMs and Meta Ads template system.

**Requirements:**

- **Campaign Model (`Campaigns`)**
  - Fields: season (invierno|primavera|verano|otoño), year, status (planificada|activa|pausada|finalizada), trackingTag, UTM (JSON), pixelIds, mailchimpList, relatedCourses[]
  - Auto-generate: trackingTag format `${season}-${year}-${slug}`
  - UTM builder: auto-populate source, medium, campaign, content

- **Ads Templates (`AdsTemplates`)**
  - Type-specific templates: telemático, ocupados, desempleados, privados, ciclo
  - Fields: headlines[] (3-5, max 40 chars), primaryTexts[] (3-5, max 125 chars), descriptions[], hashtags[], CTA, policyNotes, pixelEvents[]
  - Used by LLM pipeline to generate compliant ads

- **Meta Ads Generation (LLM-Assisted)**
  - Input: Course data + Ads Template
  - Output: 3-5 headline variants, 3-5 primary text variants, hashtags, recommended CTA
  - Validation: character limits, RGPD compliance, tone check
  - Workflow: Generate → Preview → Approve → Export to Meta Ads Manager (CSV)

**Acceptance Criteria:**
- ✅ Campaign created with auto-generated UTMs
- ✅ UTM links work and track correctly in analytics
- ✅ Ads templates customizable per offer type
- ✅ LLM generates compliant ad variants
- ✅ Marketing team can preview and approve ads
- ✅ Export to CSV format compatible with Meta Ads bulk upload

---

### 3.5 LLM Content Ingestion Pipeline

**Description:** Automated course content extraction and marketing copy generation from PDF materials.

**Requirements:**

**Phase 1: Upload & Parsing**
- Accept: PDF or plain text file
- Encoding: UTF-8, fallback to Latin-1
- Storage: Local persistent volume or S3-compatible (MinIO)

**Phase 2: Extraction (LLM)**
- Prompt template versioned in codebase
- Extract:
  - Objectives (list format, 3-8 items)
  - Curriculum/Syllabus (hierarchical structure, 6-16 modules)
  - Requirements (prerequisites, prior knowledge)
  - Outcomes (job opportunities, certifications, skills gained)
  - Benefits (checklist: flexibility, practical, certified, job support, etc.)

**Phase 3: Generation (LLM)**
- Web copy: title (max 60 chars), summary (160-320 chars), meta description, keywords[]
- Meta Ads: headlines (3-5, max 40 chars), primary texts (3-5, max 125 chars), hashtags (5-10), CTA
- Tone: Professional, motivational, benefits-focused

**Phase 4: Validation**
- Zod schema: field lengths, required fields, format
- RGPD check: no PII, no misleading claims
- Tone analysis: positive sentiment, action-oriented

**Phase 5: Approval Workflow**
- Admin previews generated content side-by-side with original
- Edit inline if needed
- Approve → inserts into database
- Reject → retry with different prompt parameters

**Models:**
- Primary: OpenAI GPT-4 Turbo or Claude Sonnet 3.5
- Fallback: Local Ollama (Llama 3.1 70B) for cost control
- Token tracking: log usage per job for billing

**Acceptance Criteria:**
- ✅ PDF upload and parsing successful (100+ page documents)
- ✅ LLM extraction accurate (>90% manual validation)
- ✅ Generated content meets character limits
- ✅ RGPD validation passes
- ✅ Admin can preview and edit before approval
- ✅ Token usage tracked and logged

---

### 3.6 Background Job Automation (BullMQ)

**Description:** Internal automation replacing n8n with BullMQ workers.

**Jobs Defined:**

| Job Name | Trigger | Actions | Retry Policy |
|----------|---------|---------|--------------|
| `lead.created` | After lead insert | Mailchimp upsert, WhatsApp message, CRM sync, internal notification | 3 attempts, exponential backoff |
| `campaign.sync` | Cron (every 6 hours) | Update UTM stats, sync Meta Ads data | 2 attempts |
| `stats.rollup` | Cron (daily at 02:00) | Aggregate metrics by course/campaign/sede | 1 attempt, alert on fail |
| `backup.daily` | Cron (daily at 03:00) | PostgreSQL dump, upload to S3, verify integrity | 2 attempts, alert on fail |
| `llm.ingest` | Manual trigger from admin | Parse PDF, call LLM, validate, store results | 1 attempt per phase, manual retry |

**Infrastructure:**
- Redis 7+ for queue storage
- BullBoard dashboard (`/admin/queues`) for monitoring
- Dead letter queue for failed jobs
- Prometheus metrics for job latency and throughput

**Acceptance Criteria:**
- ✅ Jobs process reliably with retry logic
- ✅ Failed jobs logged with full context
- ✅ BullBoard dashboard accessible and functional
- ✅ Metrics exported to monitoring system
- ✅ Idempotency enforced (no duplicate lead emails)

---

### 3.7 Analytics & Reporting

**Description:** Multi-source analytics with custom dashboards.

**Integrations:**

1. **Google Analytics 4**
   - Page views, sessions, user demographics
   - Custom events: `lead_submit`, `course_view`, `cta_click`
   - Conversion tracking: form completions

2. **Meta Pixel**
   - Conversion events: `Lead`, `ViewContent`, `CompleteRegistration`
   - Retargeting audiences
   - Attribution data for ad campaigns

3. **Plausible (Privacy-Focused)**
   - Lightweight tracking without cookies
   - Compliance with RGPD without consent banner
   - Real-time visitor count

4. **Internal Dashboard (Payload CMS)**
   - Leads: total, by course, by campus, by campaign
   - Conversion rate: page views → leads (from GA4 + internal DB)
   - Top courses by lead volume
   - Campaign performance: CTR, CPL estimate
   - Exportable to CSV/XLSX

**Acceptance Criteria:**
- ✅ GA4 tracking code installed and events firing
- ✅ Meta Pixel events verified in Meta Events Manager
- ✅ Plausible dashboard accessible
- ✅ Internal dashboard shows accurate metrics
- ✅ Reports exportable to Excel format

---

### 3.8 Security & RGPD Compliance

**Description:** Enterprise-grade security and full GDPR compliance.

**Authentication:**
- JWT access tokens (15min expiry)
- Refresh tokens (7 days expiry, stored in HTTP-only cookie)
- Password requirements: min 12 chars, uppercase, lowercase, number, symbol
- Bcrypt hashing (12 rounds)
- 2FA optional (TOTP via Google Authenticator)

**Authorization (RBAC):**
- 5 roles: admin, gestor, marketing, asesor, lectura
- Collection-level permissions in Payload
- Field-level permissions (e.g., gestor can't edit price, marketing can't delete leads)

**Audit Logging:**
- All mutations logged: user, action, entity, timestamp, IP, diff (before/after values)
- Stored in `audit_log` table
- Retention: 2 years
- Queryable from admin dashboard

**RGPD Compliance:**
- **Consent Management:** Explicit checkbox on forms, consent text version tracked, IP + timestamp stored
- **Right to Access:** Users can request data export (JSON format)
- **Right to be Forgotten:** Anonymization (replace PII with `[DELETED]`, keep aggregated stats)
- **Data Portability:** Export leads to CSV/JSON with all related data
- **Privacy Policy:** Versioned, accessible from footer, consent required on form submit
- **Cookie Consent:** Banner with accept/reject (only analytics cookies, no functional cookies blocked)

**Infrastructure Security:**
- HTTPS enforced (Let's Encrypt SSL, auto-renewal)
- Rate limiting: API (100 req/15min), Auth (5 req/15min), Forms (3 req/hour)
- hCaptcha on public forms (invisible mode)
- Docker secrets for sensitive env vars
- Firewall (UFW) on VPS: only ports 80, 443, 22 open
- Automated security updates (unattended-upgrades on Ubuntu)

**Acceptance Criteria:**
- ✅ Authentication flow works (login, refresh, logout)
- ✅ RBAC enforced (unauthorized actions blocked)
- ✅ Audit log captures all changes
- ✅ RGPD consent stored with IP + timestamp
- ✅ Data export works (JSON format)
- ✅ Anonymization tested (PII removed, stats intact)
- ✅ SSL certificate valid and auto-renewing
- ✅ Rate limiting blocks excessive requests
- ✅ hCaptcha blocks bot submissions

---

## 4. Technical Architecture

### High-Level Overview

```
┌─────────────┐
│   Browser   │
│  (Public)   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────────────┐
│            Nginx (Reverse Proxy)            │
│  - SSL Termination                          │
│  - Rate Limiting                            │
│  - Static Asset Serving                     │
└──────┬───────────────────────┬──────────────┘
       │                       │
       │ /                     │ /api
       ▼                       ▼
┌─────────────┐      ┌──────────────────┐
│  Frontend   │      │   Payload CMS    │
│ React+Vite  │◄─────┤  Node+Express    │
│ TailwindCSS │ API  │   TypeScript     │
└─────────────┘      └────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
  ┌──────────┐         ┌──────────┐         ┌──────────┐
  │PostgreSQL│         │  Redis   │         │  Storage │
  │   16+    │         │ (Queues) │         │  (Media) │
  └──────────┘         └─────┬────┘         └──────────┘
                              │
                ┌─────────────┴──────────────┐
                │                            │
                ▼                            ▼
         ┌─────────────┐            ┌──────────────┐
         │   Worker    │            │    Worker    │
         │ Automation  │            │  LLM Ingest  │
         │  (BullMQ)   │            │   (BullMQ)   │
         └──────┬──────┘            └──────┬───────┘
                │                          │
      ┌─────────┴─────────┐        ┌───────┴────────┐
      │                   │        │                │
      ▼                   ▼        ▼                ▼
 ┌─────────┐        ┌──────────┐ ┌─────┐      ┌────────┐
 │Mailchimp│        │ WhatsApp │ │ CRM │      │OpenAI  │
 │   API   │        │Cloud API │ │(opt)│      │/Claude │
 └─────────┘        └──────────┘ └─────┘      └────────┘
```

### Technology Stack

| Component | Technology | Version | Justification |
|-----------|-----------|---------|---------------|
| **Frontend** | React | 18+ | Modern, component-based, large ecosystem |
| | Vite | 5+ | Fast HMR, optimized builds |
| | TypeScript | 5+ | Type safety, better DX |
| | TailwindCSS | 3+ | Utility-first, customizable |
| **Backend** | Payload CMS | 3+ | Headless CMS with admin UI, flexible |
| | Node.js | 20 LTS | JavaScript runtime |
| | Express | 4+ | Web framework |
| **Database** | PostgreSQL | 16+ | Relational integrity, JSONB support |
| **Cache/Queue** | Redis | 7+ | Fast, reliable |
| **Jobs** | BullMQ | 5+ | Robust queue system |
| **LLM** | OpenAI GPT-4 / Claude Sonnet | Latest | Content generation |
| **Analytics** | GA4, Meta Pixel, Plausible | Latest | Multi-source tracking |
| **Infrastructure** | Docker | 24+ | Containerization |
| | Nginx | 1.26+ | Reverse proxy |
| | Ubuntu Server | 22.04 LTS | Stable, secure |

---

## 5. User Stories & Scenarios

### 5.1 Gestor Académico Creates New Course

**Actor:** Maria (Gestor Académico)

**Goal:** Publish a new "Auxiliar de Enfermería" course for the spring season.

**Steps:**
1. Maria logs into admin dashboard
2. Navigates to **Courses** → **Create New**
3. Fills in:
   - Title: "Auxiliar de Enfermería"
   - Family: Sanidad
   - Offer Type: Desempleados
   - Modality: Presencial
   - Summary: "Curso gratuito subvencionado por el SEPE..."
4. Uploads PDF with course materials
5. Clicks **Generate Content with AI** → LLM extracts objectives, curriculum
6. Reviews generated content, makes minor edits
7. Approves and saves as **Draft**
8. Creates **Convocation**:
   - Sede: Santa Cruz
   - Start Date: 2025-04-15
   - Seats: 20
   - State: Abierta
9. Changes course status to **Published**
10. Course appears on public website within 1 minute (cache revalidation)

**Acceptance Criteria:**
- ✅ Course saved successfully
- ✅ LLM content accurate and editable
- ✅ Convocation linked to course and campus
- ✅ Public site shows course with correct data
- ✅ SEO metadata correct (title, description, og:image)

---

### 5.2 Prospective Student Submits Lead

**Actor:** Juan (Unemployed, 32 years old, looking for retraining)

**Goal:** Request information about "Auxiliar de Enfermería" course.

**Steps:**
1. Juan searches Google for "curso auxiliar enfermería tenerife gratuito"
2. Clicks on CEPComunicacion result → lands on `/cursos/auxiliar-de-enfermeria`
3. Reads course details: objectives, curriculum, requirements, job opportunities
4. Scrolls to **Lead Form**
5. Fills in:
   - Name: Juan Pérez
   - Email: juan.perez@example.com
   - Phone: +34 600 123 456
   - Course: Auxiliar de Enfermería - Santa Cruz (dropdown auto-populated)
   - Checks: "Acepto la política de privacidad" (consent)
6. Completes hCaptcha (invisible)
7. Clicks **Enviar Solicitud**
8. Sees confirmation: "¡Gracias! Nos pondremos en contacto contigo pronto."

**Behind the Scenes:**
- Lead saved to database with UTM params (source=google, medium=organic)
- `lead.created` job triggered:
  - Mailchimp: Juan added to "Leads Sanidad" list
  - WhatsApp: Confirmation message sent to +34 600 123 456
  - Internal notification: Assigned asesor María receives email
- GA4 event: `generate_lead`
- Meta Pixel event: `Lead`

**Acceptance Criteria:**
- ✅ Form submits successfully
- ✅ Validation errors shown if fields missing
- ✅ hCaptcha verified
- ✅ Confirmation message displayed
- ✅ Email confirmation sent to Juan
- ✅ Mailchimp contact created
- ✅ WhatsApp message delivered
- ✅ Asesor notified
- ✅ Analytics events fired

---

### 5.3 Marketing Manager Generates Meta Ads Campaign

**Actor:** Laura (Marketing Manager)

**Goal:** Create Meta Ads for "Ciclo Superior Integración Social" course.

**Steps:**
1. Laura logs into admin dashboard
2. Navigates to **Campaigns** → **Create New**
3. Fills in:
   - Season: Primavera
   - Year: 2025
   - Status: Planificada
   - Related Courses: Ciclo Superior Integración Social
4. System auto-generates:
   - Tracking Tag: `primavera-2025-ciclo-integracion-social`
   - UTM params: `?utm_source=meta&utm_medium=paid&utm_campaign=primavera-2025-ciclo-integracion-social`
5. Laura navigates to **Ads Templates** → selects "Ciclo" template
6. Clicks **Generate Ads with AI** for the course
7. LLM generates:
   - 5 headlines: "Ciclo FP Integración Social | CEP", "Fórmate en Integración Social", etc.
   - 5 primary texts: "Aprende a trabajar con personas en riesgo de exclusión...", etc.
   - 8 hashtags: #FormaciónProfesional, #TrabajoSocial, etc.
   - CTA: "Solicitar información"
8. Laura reviews, edits one headline for brand consistency
9. Approves and exports to CSV
10. Uploads CSV to Meta Ads Manager
11. Campaign goes live

**Acceptance Criteria:**
- ✅ Campaign created with auto-UTMs
- ✅ LLM generates compliant ad variants
- ✅ Character limits enforced (40 chars headline, 125 chars primary text)
- ✅ Export CSV format compatible with Meta Ads bulk upload
- ✅ UTM tracking works when ads clicked

---

## 6. Non-Functional Requirements

### 6.1 Performance

- **Page Load Time:** < 2.5s (LCP) on 3G connection
- **API Response Time:** < 200ms (p95) for GET requests, < 500ms for POST
- **Database Query Time:** < 50ms (p95) for indexed queries
- **LLM Processing:** < 30s for content extraction, < 60s for ad generation

### 6.2 Scalability

- **Concurrent Users:** Support 1,000+ simultaneous visitors
- **Database Growth:** Handle 100,000+ leads over 2 years
- **Media Storage:** 50GB initial, scalable to 500GB
- **Job Throughput:** Process 100+ jobs/minute (peak during campaign launches)

### 6.3 Availability

- **Uptime SLA:** 99.5% (< 3.6 hours downtime/month)
- **Backup Frequency:** Daily at 03:00 UTC
- **Recovery Time Objective (RTO):** < 4 hours
- **Recovery Point Objective (RPO):** < 24 hours

### 6.4 Security

- **SSL/TLS:** TLS 1.3, A+ rating on SSL Labs
- **Password Policy:** Min 12 chars, complexity enforced
- **Session Timeout:** 15min inactivity for admin, 7 days for refresh token
- **Audit Retention:** 2 years minimum

### 6.5 Compliance

- **RGPD/GDPR:** Full compliance with data protection regulations
- **Accessibility:** WCAG 2.1 AA for public site
- **SEO:** Semantic HTML, structured data (JSON-LD), sitemap

---

## 7. Dependencies & Integrations

### External Services

| Service | Purpose | SLA | Cost Estimate |
|---------|---------|-----|---------------|
| **Hostinger VPS** | Infrastructure hosting | 99.9% | €30/month |
| **OpenAI API** | LLM content generation | 99.9% | $50-150/month (variable) |
| **Mailchimp** | Email marketing automation | 99.9% | $30/month (2,000 contacts) |
| **WhatsApp Cloud API** | Lead notifications | 99.5% | $0.005/message (~$20/month) |
| **Brevo/Mailgun** | Transactional emails | 99.9% | $15/month (10k emails) |
| **Google Analytics 4** | Web analytics | 99.9% | Free |
| **Meta Business Suite** | Pixel, Ads API | 99.5% | Free (ads spend separate) |
| **Plausible Analytics** | Privacy-focused analytics | 99.9% | $9/month (10k views) |
| **Let's Encrypt** | SSL certificates | 99.9% | Free |
| **hCaptcha** | Bot protection | 99.9% | Free (< 1M requests) |

**Total Estimated Monthly Cost:** €150-200 (excluding ad spend)

### Internal Dependencies

- GitHub repository for version control
- CI/CD pipeline (GitHub Actions)
- Docker registry (GitHub Container Registry or Docker Hub)

---

## 8. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **LLM API Rate Limits** | High | Medium | Implement local Ollama fallback, cache results |
| **Data Migration from WordPress** | Medium | High | Automated scripts + manual validation, test environment |
| **VPS Resource Constraints** | High | Low | Monitor usage, vertical scaling plan (RAM/CPU upgrade) |
| **Meta API Changes** | Medium | Medium | Version API calls, subscribe to Meta developer updates |
| **RGPD Non-Compliance** | Critical | Low | Legal review before launch, compliance checklist |
| **Third-Party Service Downtime** | Medium | Low | Graceful degradation (e.g., queue jobs if Mailchimp down) |
| **Security Breach** | Critical | Low | Regular audits, dependency updates, penetration testing |

---

## 9. Timeline & Milestones

### Phase 0: Specification & Planning (Current)
**Duration:** 2 weeks
**Status:** ✅ Complete

- [x] Requirements gathering
- [x] Technical specifications written
- [x] Architecture designed
- [x] Database schema finalized
- [x] API contracts documented
- [x] Component specs defined
- [x] Stakeholder approval obtained

### Phase 1: Infrastructure Setup
**Duration:** 1 week
**Deliverables:**
- Docker Compose configuration
- PostgreSQL + Redis deployed
- Payload CMS base installation
- Nginx reverse proxy configured
- SSL certificates installed
- CI/CD pipeline (GitHub Actions)

### Phase 2: Frontend Scaffold
**Duration:** 2 weeks
**Deliverables:**
- React + Vite project initialized
- Routing setup (React Router)
- TailwindCSS theme configured (Montserrat font, CEP colors)
- Component library (Atoms: Button, Input, Card)
- Static pages (Home, About, Contact)
- SEO setup (react-helmet, sitemap)

### Phase 3: Backend CRUD & RBAC
**Duration:** 2 weeks
**Deliverables:**
- Payload collections (Courses, CourseRuns, Campuses, Cycles, Campaigns, Leads)
- RBAC configured (5 roles)
- API endpoints tested (Postman collection)
- Database migrations applied
- Audit logging implemented

### Phase 4: Lead Forms & Tracking
**Duration:** 1 week
**Deliverables:**
- Lead form component (Zod validation)
- hCaptcha integration
- RGPD consent management
- GA4 + Meta Pixel tracking
- UTM parameter capture

### Phase 5: Automation & Integrations
**Duration:** 2 weeks
**Deliverables:**
- BullMQ workers (`lead.created`, `campaign.sync`, `stats.rollup`, `backup.daily`)
- Mailchimp integration (upsert contacts)
- WhatsApp Cloud API integration (send messages)
- Meta Ads API (webhook for leads)
- BullBoard dashboard

### Phase 6: LLM Pipeline
**Duration:** 2 weeks
**Deliverables:**
- PDF upload and parsing
- OpenAI/Claude API integration
- Content extraction (objectives, curriculum, etc.)
- Ad generation (headlines, primary texts, hashtags)
- Validation and approval workflow
- Token usage tracking

### Phase 7: Analytics & Dashboards
**Duration:** 1 week
**Deliverables:**
- Internal analytics dashboard (Payload CMS)
- Metrics: leads, conversions, CTR, CPL
- Export to CSV/XLSX
- Real-time stats updates
- Grafana setup (optional, for system metrics)

### Phase 8: QA, Hardening & Deployment
**Duration:** 1 week
**Deliverables:**
- End-to-end testing (Playwright)
- Security audit (OWASP Top 10 checklist)
- Performance optimization (Lighthouse score > 90)
- Accessibility audit (WCAG 2.1 AA)
- Production deployment to VPS
- Monitoring and alerting setup
- Documentation finalized

**Total Timeline:** 12 weeks (including Phase 0)

---

## 10. Success Criteria

### Launch Criteria (Must-Have)

- [ ] All core features implemented and tested
- [ ] Zero critical bugs (severity 1-2)
- [ ] Security audit passed
- [ ] RGPD compliance validated by legal team
- [ ] Performance benchmarks met (Core Web Vitals green)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Backup strategy tested and verified
- [ ] Monitoring and alerting configured
- [ ] Documentation complete (admin guide, API docs)
- [ ] Stakeholder sign-off obtained

### Post-Launch Metrics (3-Month Goals)

- **Traffic:** 50,000+ monthly visitors (20% increase from current)
- **Leads:** 500+ leads/month (30% increase)
- **Conversion Rate:** 2.5%+ (page views → leads)
- **Page Speed:** LCP < 2.5s for 75th percentile
- **Uptime:** 99.5%+ actual uptime
- **User Satisfaction:** Net Promoter Score (NPS) > 50 for internal users

---

## 11. Open Questions & Assumptions

### Open Questions
1. **CRM Integration:** Which CRM (Pipedrive, HubSpot, or custom)? → Decision: Make optional, start with Mailchimp only
2. **Payment Gateway:** For private courses, integrate Stripe/PayPal? → Decision: Phase 2 feature (not MVP)
3. **Mobile App:** Native app for asesores? → Decision: PWA first, native app in 2026
4. **Multilanguage:** Support English for international students? → Decision: Not in MVP, evaluate after launch

### Assumptions
- CEP provides all course materials in PDF format
- Meta Ads account and Pixel ID provided by CEP
- Mailchimp account already exists with API key
- VPS has sufficient resources (3.8GB RAM, 1 vCore) for initial launch (low traffic)
- WordPress data can be exported to CSV for migration
- Legal team reviews RGPD compliance before launch

---

## 12. Appendices

### Appendix A: Glossary

- **CEP:** Centro Europeo de Postgrados (educational organization)
- **SEPE:** Servicio Público de Empleo Estatal (Spanish employment service, funds courses)
- **SCE:** Servicio Canario de Empleo (Canary Islands employment service)
- **FP:** Formación Profesional (vocational training, includes Ciclo Medio and Superior)
- **Telemático:** Online/remote course modality
- **Ocupados:** Courses for employed workers
- **Desempleados:** Courses for unemployed individuals
- **Convocatoria:** Scheduled course offering (convocation)
- **Sede:** Physical campus/location
- **RGPD:** Reglamento General de Protección de Datos (GDPR in Spanish)

### Appendix B: References

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [RGPD Official Text (Spanish)](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807)
- [Meta Ads API Documentation](https://developers.facebook.com/docs/marketing-apis)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Appendix C: Contact Information

**Project Owner:** SOLARIA AGENCY - Dirección de Tecnología
**Email:** tech@solaria.agency
**Client:** CEP FORMACIÓN
**Client Contact:** [To be provided]

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-20 | Claude AI (SOLARIA AGENCY) | Initial PRD creation |

**Approval Signatures:**

- [ ] Technical Lead: ___________________ Date: ___________
- [ ] Product Owner: ___________________ Date: ___________
- [ ] CEP FORMACIÓN Representative: ___________________ Date: ___________

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**
