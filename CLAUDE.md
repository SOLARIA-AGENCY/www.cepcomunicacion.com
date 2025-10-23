# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Name:** CEPComunicacion v2
**Status:** Phase 0 - Specification & Planning (Pre-development)
**Methodology:** Spec-Driven Development (SDD)
**Client:** CEP FORMACIÓN (educational organization)
**Agency:** SOLARIA AGENCY
**Purpose:** Complete redesign and rebuild of educational platform to replace existing WordPress site

This is a **specification-first repository**. The extensive technical documentation exists before any implementation code. All architectural decisions, technology choices, and system designs are documented in detail before development begins.

## Technology Stack (UPDATED 2025-10-23)

### Frontend ✅ IMPLEMENTED
- **Framework:** React 19.1.0 with TypeScript 5.9.3
- **Build Tool:** Vite 7.1.12
- **Styling:** TailwindCSS 4.0 with Montserrat typography
- **State Management:** React Context + Hooks
- **Routing:** React Router 7.9.4
- **Status:** Week 4 Complete - Production Ready

### Backend 🔄 IN MIGRATION
- **CMS/API:** **Strapi 4.x** (Node.js + Express + TypeScript) - **CHANGED FROM PAYLOAD**
- **Database:** PostgreSQL 16+
- **Job Queue:** BullMQ + Redis
- **Authentication:** Strapi built-in with RBAC (5 roles)
- **Migration:** In Progress (ADR-001 approved 2025-10-23)
- **Reason:** Payload 3.x requires Next.js (not wanted), Payload 2.x EOL soon

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Server:** Ubuntu 22.04 on Hostinger VPS (srv943151 - 148.230.118.124)
- **Web Server:** Nginx with SSL (Let's Encrypt)
- **Storage:** Local persistent volumes or S3-compatible (MinIO)

### Integrations
- **Marketing:** Meta Ads API, Mailchimp
- **Communication:** WhatsApp Cloud API, SMTP (Brevo/Mailgun)
- **Analytics:** GA4, Meta Pixel, Plausible
- **AI/LLM:** OpenAI/Claude/Ollama for content generation

## Architecture Pattern

**Monorepo Structure (Planned):**
```
cepcomunicacion/
├── apps/
│   ├── web/          # React frontend (public site)
│   └── cms/          # Payload CMS backend
├── packages/
│   ├── ui/           # Shared component library
│   ├── sdk/          # API client for Payload
│   └── config/       # Shared configs (tsconfig, eslint, tailwind)
├── infra/            # Docker, Nginx, deployment scripts
└── workers/          # BullMQ background job processors
```

**Key Services:**
1. Frontend (React) - Public web application with 12+ routes
2. CMS/API (Payload) - Admin dashboard + REST/GraphQL API
3. Workers (BullMQ) - Background automation (leads, campaigns, stats, backups, LLM processing)
4. Database (PostgreSQL) - Relational data with full referential integrity
5. Cache/Queue (Redis) - Job management and pub/sub

## Core Documentation

### Primary Specification Files

1. **cepcomunicacion_v_2_desarrollo.md** (1,240 lines)
   - Complete technical specification
   - Frontend routes and component specifications
   - Admin dashboard module definitions
   - BullMQ automation workflows
   - LLM content generation pipeline
   - Security and RGPD requirements
   - Analytics strategy
   - 8-phase development roadmap (10-11 weeks)

2. **PROMPT_SPEC_DRIVEN_CEPCOMUNICACION_V2.md** (620 lines)
   - Spec-Driven Development methodology
   - MCP tool usage patterns (Sequential Thinking, Task Master, Spec-Kit)
   - Database design specifications
   - API contract templates
   - UI component specifications
   - Security and compliance framework

### Reference Implementation

**Location:** `.conductor/manado/`
- Static HTML5/CSS3/Vanilla JS prototype (unrelated to main project)
- Reference patterns for responsive design and smooth interactions
- Serves as style guide exploration only

## Development Phases

**Current Status:** Phase 0 (Analysis & Planning) - ✓ Complete

### Planned Implementation Phases

| Phase | Deliverable | Duration |
|-------|-------------|----------|
| **F1** | Docker + Payload CMS + PostgreSQL + Redis infrastructure | 1 week |
| **F2** | React frontend scaffold + routing + static pages | 2 weeks |
| **F3** | CRUD operations + role-based access control | 2 weeks |
| **F4** | Lead forms + tracking + RGPD compliance | 1 week |
| **F5** | BullMQ automation + external integrations | 2 weeks |
| **F6** | LLM ingestion pipeline + ad generation | 2 weeks |
| **F7** | Analytics dashboards + data exports | 1 week |
| **F8** | QA + security hardening + production deployment | 1 week |

## Key Domain Concepts

### Taxonomies

**Course Types:**
- Telemático (online courses)
- Ocupados (courses for employed individuals)
- Desempleados (courses for unemployed)
- Privados (private courses)
- Ciclo-medio (medium-level professional training)
- Ciclo-superior (advanced professional training)

**Modalities:**
- Presencial (in-person)
- Semipresencial (hybrid/blended)
- Telemático (fully online)

**Convocation States:**
- Abierta (open for registration)
- Lista espera (waitlist)
- Cerrada (closed)
- Planificada (scheduled/planned)

### Data Entities

Core entities with complex relationships:
- **Courses** - Educational programs
- **Convocations** - Scheduled course offerings
- **Sites/Campuses** - Physical locations (unlimited multi-site)
- **Cycles** - Professional training programs (FP)
- **Leads** - Prospective students with tracking
- **Campaigns** - Marketing campaigns with UTM tracking
- **Ads** - Generated marketing content

## Admin Roles & Permissions

**5-Level RBAC System:**
1. **Admin** - Full system access
2. **Gestor** - Content and data management
3. **Marketing** - Campaigns and analytics
4. **Asesor** - Lead management only
5. **Lectura** - Read-only access

Field-level permissions enforced in Payload CMS collections.

## LLM Content Pipeline

**Automation Flow:**
1. Upload PDF or text course materials
2. Extract: objectives, curriculum, requirements, benefits, job outcomes
3. Generate: web copy, Meta Ads (headlines/body/CTAs), hashtags
4. Validate: RGPD compliance, brand tone, length constraints
5. Preview and approve before publishing to CMS

**Models:** OpenAI GPT-4, Claude, or local Ollama

## External Integrations

### Meta Ads
- Webhook receiver for lead capture
- Backup API polling every 15 minutes
- Automatic lead deduplication

### Mailchimp
- List segmentation by course type
- Automated email campaigns
- Subscriber management

### WhatsApp Cloud API
- Programmed messaging sequences
- Lead follow-up automation
- Template message support

### Analytics
- **GA4** - Full behavioral tracking
- **Meta Pixel** - Conversion tracking
- **Plausible** - Privacy-focused analytics

## Security & Compliance

### RGPD Requirements
- Explicit consent forms with checkboxes
- IP address + timestamp logging
- Data export/deletion capabilities
- Privacy policy and cookie consent
- Retention period compliance

### Security Measures
- HTTPS enforced (Let's Encrypt)
- Rate limiting on public endpoints
- CAPTCHA on lead forms
- Complete audit trail (user, action, timestamp, IP)
- Role-based access control with field-level permissions
- Daily automated backups (database + media)

## Git Workflow

**Main Branch:** `inicio`
**Naming Convention:** `{username}/{feature-description}`
**Example:** `carlosjperez/init-cep-website`

## Development Server Information

**VPS Details (from root CLAUDE.md):**
- Hostname: srv943151
- IP: 148.230.118.124
- Provider: Hostinger
- OS: Ubuntu 25.04 (Plucky Puffin)
- CPU: 1 vCore AMD EPYC 9354P
- RAM: 3.8 GB
- Storage: 48 GB SSD

**Installed Services:**
- Apache2 (active on port 80)
- Nginx (installed, inactive)
- PHP 8.4.5
- Node.js v22.20.0
- MariaDB 11.4.7
- PM2 (process manager)
- Git 2.48.1

**Target Deployment:**
- Docker containers managed by Docker Compose
- Nginx reverse proxy in front of services
- SSL/TLS via Let's Encrypt
- PostgreSQL in dedicated container
- Redis for job queue

## MCP Tools Configuration

**Available MCP Servers:**
- `task-master-ai` - Project task breakdown
- `sequential-thinking` - Step-by-step analysis
- `spec-kit` - Formal specification generation
- `coderabbit` - Code review automation
- `github` - GitHub integration
- `playwright` - E2E testing
- `context7` - Code context analysis

**Specialized Agents:**
- `postgresql-schema-architect` - Database design
- `payload-cms-architect` - CMS implementation
- `react-frontend-dev` - Frontend development
- `bullmq-worker-automation` - Background jobs
- `security-gdpr-compliance` - Security auditing

## Important Notes

### Current Limitations
- **No package.json exists yet** - No npm/yarn commands available
- **No Docker configuration** - Infrastructure code not yet written
- **No database migrations** - Schema exists only in specifications
- **No API endpoints** - Backend not yet implemented
- **No React components** - Frontend not yet scaffolded
- **No tests** - Testing framework not yet configured

### What to Build First (Phase 1)
1. Initialize monorepo structure with package.json files
2. Configure Docker Compose with PostgreSQL, Redis, Nginx
3. Set up Payload CMS with basic configuration
4. Create initial database schema and migrations
5. Configure TypeScript and linting across workspace
6. Set up Git hooks for pre-commit checks

### When Implementing Features
- Always reference the specification documents first
- Follow the 8-phase roadmap sequence
- Implement RGPD compliance from the start
- Add audit logging to all mutations
- Test role-based permissions thoroughly
- Document all API endpoints in OpenAPI format
- Generate TypeScript types from Payload collections

## Useful Patterns from Conductor Prototype

The `.conductor/manado/` static site demonstrates:
- Modern CSS Grid and Flexbox layouts
- CSS custom properties for theming
- Smooth scroll behavior patterns
- Mobile-first responsive design
- Form validation patterns
- Intersection Observer for animations

These patterns can inform the React/TailwindCSS implementation but are not part of the main codebase.

---

**Last Updated:** 2025-10-20
**Phase Status:** Specification Complete, Ready for Implementation
