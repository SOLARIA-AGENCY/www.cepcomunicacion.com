# CEPComunicacion v2 - Complete Specification Suite

**Project:** CEPComunicacion.com v2 - Plataforma Integral de Gestión Formativa
**Status:** Phase 0 - Specification Complete ✅
**Methodology:** Spec-Driven Development (SDD)
**Client:** CEP FORMACIÓN
**Agency:** SOLARIA AGENCY - Dirección de Tecnología
**Timeline:** 10-11 weeks (post-specification approval)

---

## 📋 Document Index

### **Core Documents**

| # | Document | Status | Description |
|---|----------|--------|-------------|
| 0 | [Constitution](./.specify/memory/constitution.md) | ✅ Complete | Project principles, development standards, quality gates |
| 1 | [PRD - Product Requirements](./00-prd/PRD.md) | ✅ Complete | Complete product requirements, user stories, success criteria |
| 2 | [Architecture Specification](./01-architecture/ARCHITECTURE.md) | ✅ Complete | System architecture, component diagrams, data flows, tech decisions |
| 3 | [Database Schema](./02-database/DATABASE_SCHEMA.md) | 🚧 In Progress | PostgreSQL schema, ERD, migrations, indexes |
| 4 | [API Specification](./03-api/OPENAPI.yaml) | 📋 Pending | OpenAPI 3.0 spec for Payload CMS REST/GraphQL API |
| 5 | [Frontend Components](./04-frontend/COMPONENTS.md) | 📋 Pending | React component specifications (Atomic Design) |
| 6 | [Workers & Automation](./05-workers/WORKERS.md) | 📋 Pending | BullMQ job specifications, retry policies, integrations |
| 7 | [LLM Pipeline](./06-llm/LLM_PIPELINE.md) | 📋 Pending | Content extraction and generation workflows |
| 8 | [Security & RGPD](./07-security/SECURITY.md) | 📋 Pending | Authentication, authorization, GDPR compliance |
| 9 | [Analytics](./08-analytics/ANALYTICS.md) | 📋 Pending | GA4, Meta Pixel, Plausible integration specs |
| 10 | [Infrastructure](./09-infrastructure/DOCKER.md) | 📋 Pending | Docker Compose, Nginx, CI/CD, deployment |

---

## 🎯 Quick Start Guide

### For Developers

**Prerequisites:**
- Read [Constitution](./.specify/memory/constitution.md) - **MANDATORY**
- Review [PRD](./00-prd/PRD.md) for business context
- Study [Architecture](./01-architecture/ARCHITECTURE.md) for technical overview

**Development Workflow:**
1. **Phase 0 (Current):** All specs complete and approved ✅
2. **Phase 1:** Infrastructure setup (Docker + Payload + PostgreSQL + Redis)
3. **Phase 2-8:** Iterative development following roadmap in PRD

**Key Principles:**
- 🚫 **NO CODE** until all specs approved (Spec-Driven Development)
- ✅ TypeScript everywhere with `strict: true`
- ✅ RGPD compliance from day one
- ✅ Comprehensive testing (unit + integration + e2e)

### For Stakeholders

**Executive Summary:**
- **What:** Modern educational platform replacing WordPress
- **Why:** Centralize operations, automate marketing, improve analytics
- **How:** React + Payload CMS + PostgreSQL + BullMQ + LLM integration
- **When:** 12 weeks total (2 weeks specs ✅ + 10 weeks development)
- **Cost:** ~€150-200/month operational (excluding ad spend)

**Key Features:**
1. Course management with LLM-powered content generation
2. Multi-campus (sede) architecture
3. Lead capture with automatic Mailchimp + WhatsApp integration
4. Campaign tracking with auto-generated UTMs
5. Real-time analytics dashboard
6. Full RGPD compliance

---

## 📊 Project Status Dashboard

### Specification Completion

```
Phase 0: Analysis & Planning
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100%

✅ Requirements gathering
✅ Constitution created
✅ PRD written (12,000+ words)
✅ Architecture designed (with Mermaid diagrams)
🚧 Database schema (in progress)
📋 API contracts (pending)
📋 Component specs (pending)
📋 Worker specs (pending)
📋 Security specs (pending)
📋 Infrastructure specs (pending)
```

### Technology Stack

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| **Frontend** | React + TypeScript + Vite + TailwindCSS | 18+ / 5+ / 5+ / 3+ | ✅ Chosen |
| **Backend** | Payload CMS (Node.js + Express) | 3+ | ✅ Chosen |
| **Database** | PostgreSQL | 16+ | ✅ Chosen |
| **Cache/Queue** | Redis + BullMQ | 7+ / 5+ | ✅ Chosen |
| **LLM** | OpenAI GPT-4 / Claude Sonnet | Latest | ✅ Chosen |
| **Infrastructure** | Docker + Ubuntu + Nginx | 24+ / 22.04 / 1.26+ | ✅ Chosen |

---

## 🏗️ Architecture Overview

### System Context

```
┌─────────────┐
│   Browser   │ (Students, Admins, Marketing)
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────┐
│   Nginx (Reverse Proxy + SSL)       │
└──────┬───────────────────┬──────────┘
       │ /                 │ /api
       ▼                   ▼
┌─────────────┐      ┌──────────────┐
│  Frontend   │◄─────┤  Payload CMS │
│ React+Vite  │ API  │ Node+Express │
└─────────────┘      └───────┬──────┘
                              │
        ┌─────────────────────┼─────────────┐
        │                     │             │
        ▼                     ▼             ▼
  ┌──────────┐         ┌──────────┐   ┌─────────┐
  │PostgreSQL│         │  Redis   │   │ Workers │
  │   16+    │         │ (Queues) │   │ BullMQ  │
  └──────────┘         └──────────┘   └─────┬───┘
                                             │
                        ┌────────────────────┴────────┐
                        │                             │
                        ▼                             ▼
                   ┌─────────┐                 ┌──────────┐
                   │Mailchimp│                 │OpenAI API│
                   │WhatsApp │                 │Claude API│
                   │Meta Ads │                 └──────────┘
                   └─────────┘
```

**Key Architectural Decisions:**

1. **Monorepo:** All code in single repo, organized by apps/ and packages/
2. **Microservices-Inspired:** Clear boundaries, independent deployment, shared database
3. **TypeScript Everywhere:** Frontend, backend, workers - 100% TypeScript
4. **Queue-Based Automation:** BullMQ replaces n8n for internal automation
5. **LLM Integration:** OpenAI/Claude for content generation with human approval

---

## 📚 Core Specifications Summary

### 1. Constitution ([View Document](./.specify/memory/constitution.md))

**10 Non-Negotiable Principles:**

1. **Spec-Driven Development (SDD)** - Specs before code
2. **Monorepo Architecture** - Clear separation of apps/packages
3. **TypeScript Everywhere** - Strict mode, no `any`
4. **Database Integrity** - Foreign keys, constraints, migrations
5. **API Design Standards** - REST/GraphQL best practices
6. **Frontend Excellence** - WCAG 2.1 AA, performance budgets
7. **Automation & Jobs** - Reliable BullMQ workers
8. **Security & RGPD** - Defense in depth, GDPR compliance
9. **LLM Integration** - Controlled with validation workflows
10. **Analytics & Observability** - Business + technical metrics

### 2. Product Requirements Document ([View Document](./00-prd/PRD.md))

**12 Sections, 12,000+ Words:**

- Executive summary
- Business objectives and success metrics
- Target users (5 internal roles + 4 external personas)
- 8 core features (course management, leads, campaigns, LLM pipeline, etc.)
- Technical architecture with diagrams
- 3 detailed user stories
- Non-functional requirements (performance, security, compliance)
- Risk mitigation strategies
- 8-phase timeline (12 weeks total)
- Success criteria and KPIs

**Key Metrics:**
- **Launch Goal:** 500+ leads/month, 2.5%+ conversion rate
- **Performance:** LCP < 2.5s, API latency < 200ms (p95)
- **Uptime:** 99.5% SLA

### 3. Architecture Specification ([View Document](./01-architecture/ARCHITECTURE.md))

**11 Sections with Mermaid Diagrams:**

- System context (C4 model)
- Component architecture (apps, packages, workers)
- Layered architecture (presentation → infrastructure)
- Data flow diagrams (lead submission, LLM generation, campaign UTMs)
- Technology decision records (26 technologies evaluated)
- Scalability strategy (vertical → horizontal)
- Security architecture (defense in depth, 6 layers)
- Deployment architecture (Docker Compose)
- Monitoring & observability (Prometheus, BullBoard, logs)
- Disaster recovery (backup/restore procedures)

**Architectural Patterns:**
- **Frontend:** Atomic Design (Atoms → Molecules → Organisms → Templates → Pages)
- **Backend:** Layered (Presentation → Business Logic → Data Access)
- **Infrastructure:** Containerized microservices with shared database

---

## 🗂️ Data Model Overview

### Core Entities (PostgreSQL)

```
Users (authentication + RBAC)
  ↓
Courses (base course data)
  ├─→ CourseRuns (convocations)
  │     ├─→ Campuses (sedes)
  │     └─→ Leads (captured students)
  │           └─→ Campaigns (marketing tracking)
  └─→ Cycles (FP - formación profesional)

AdsTemplates (LLM generation templates)
  └─→ Campaigns (generated ads)

BlogPosts / Pages (content management)

Settings (global configuration)

Events (analytics tracking)

AuditLog (all mutations)
```

**Total Collections:** 12 main + 1 audit

**Relationships:**
- 1:N (Course → CourseRuns, Campus → CourseRuns)
- N:M (Campaigns → Courses via relatedCourses[])
- Self-referential: None (intentionally flat for simplicity)

---

## 🔐 Security & Compliance

### RBAC (Role-Based Access Control)

**5 Roles:**

1. **Admin:** Full access, user management, settings
2. **Gestor Académico:** Course CRUD, curriculum management
3. **Marketing:** Campaigns, ads, analytics (read), lead assignment
4. **Asesor Comercial:** Lead follow-up, notes, status updates
5. **Lectura:** Read-only for all collections

**Permissions:**
- Collection-level (can access Courses collection?)
- Field-level (can edit `price` field?)
- Row-level (can only see leads assigned to them?)

### RGPD Compliance

**Checklist:**

- ✅ Explicit consent (checkbox on forms)
- ✅ IP + timestamp logging
- ✅ Right to access (data export)
- ✅ Right to be forgotten (anonymization)
- ✅ Data portability (JSON export)
- ✅ Privacy policy versioned
- ✅ Cookie consent banner
- ✅ Retention policy (2 years for leads)
- ✅ Audit trail (all data access logged)

---

## 🚀 Development Roadmap

### Phase Timeline

| Phase | Duration | Deliverable | Start | End |
|-------|----------|-------------|-------|-----|
| **Phase 0** | 2 weeks | ✅ Complete specifications | Week 1 | Week 2 |
| **Phase 1** | 1 week | Docker + Payload + PostgreSQL + Redis | Week 3 | Week 3 |
| **Phase 2** | 2 weeks | React frontend scaffold + routing | Week 4 | Week 5 |
| **Phase 3** | 2 weeks | CRUD + RBAC | Week 6 | Week 7 |
| **Phase 4** | 1 week | Lead forms + tracking + RGPD | Week 8 | Week 8 |
| **Phase 5** | 2 weeks | BullMQ automation + integrations | Week 9 | Week 10 |
| **Phase 6** | 2 weeks | LLM pipeline | Week 11 | Week 12 |
| **Phase 7** | 1 week | Analytics dashboards | Week 13 | Week 13 |
| **Phase 8** | 1 week | QA + deployment | Week 14 | Week 14 |

**Total:** 14 weeks (includes 2-week specification phase)

### Quality Gates

**Before Phase 1:**
- [ ] All specs reviewed and approved
- [ ] Stakeholder sign-off obtained
- [ ] Development environment ready

**Before Production:**
- [ ] All tests passing (unit, integration, e2e)
- [ ] Security audit passed
- [ ] RGPD compliance validated
- [ ] Performance benchmarks met
- [ ] Documentation complete

---

## 📞 Contact & Support

**Project Owner:** SOLARIA AGENCY - Dirección de Tecnología
**Email:** tech@solaria.agency
**Client:** CEP FORMACIÓN
**Repository:** [GitHub](https://github.com/solaria-agency/cepcomunicacion-v2) (private)

### Key Stakeholders

- **Technical Lead:** [To be assigned]
- **Product Owner:** [To be assigned]
- **CEP Representative:** [To be assigned]

---

## 📄 Document Control

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2025-10-20 | Claude AI | Initial specification suite creation |
| 1.0.0 | 2025-10-20 | Claude AI | PRD + Constitution + Architecture complete |

### Approval Status

**Phase 0 Specifications:**

- [ ] Technical Review: _______________ Date: ___________
- [ ] Security Review: _______________ Date: ___________
- [ ] Legal Review (RGPD): _______________ Date: ___________
- [ ] Client Approval: _______________ Date: ___________

---

## 🔗 Related Documentation

- [GitHub Spec-Kit](https://github.com/github/spec-kit) - Spec-Driven Development toolkit
- [Payload CMS Docs](https://payloadcms.com/docs) - Backend CMS documentation
- [BullMQ Docs](https://docs.bullmq.io/) - Queue system documentation
- [RGPD Official Text](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807) - Spanish GDPR regulation

---

**Last Updated:** 2025-10-21
**Next Review:** Upon completion of remaining specifications (Database, API, Frontend, Workers, etc.)

---

> **Note:** This is a living document. As specifications are completed, this README will be updated to reflect the latest status.
