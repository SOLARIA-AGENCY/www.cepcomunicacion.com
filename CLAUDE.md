# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Name:** CEPComunicacion v2
**Status:** ✅ Phase F1-F2 Complete - Production CMS Deployed (2025-11-23)
**Methodology:** **SOLARIA Methodology** (Spec-Driven Development + Zero Technical Debt)
**Client:** CEP FORMACIÓN (educational organization)
**Agency:** SOLARIA AGENCY
**Purpose:** Complete redesign and rebuild of educational platform to replace existing WordPress site

**Current Progress:**
- ✅ Next.js 15.2.3 + Payload CMS 3.62.1 deployed and operational
- ✅ PostgreSQL 16.10 with 27+ collections and full schema
- ✅ Custom dashboard with Cursos, Ciclos, Convocatorias, Sedes management
- ✅ Authentication system with role-based access control
- ✅ Redis + BullMQ infrastructure ready
- 🔄 Frontend (React + Vite) pending integration
- 🔄 Background workers implementation in progress

### SOLARIA Methodology Applied

This project follows the **Metodología SOLARIA** (validated in BRIK-64 project):

#### Core Principles
- ✅ **Zero Technical Debt** - No "lo arreglo después"
- ✅ **PAT-006 Mandatory** - API verification for all integrations
- ✅ **Spec-Driven Development** - Think first, code with confidence
- ✅ **Quality Gates** - 100% tests passing, ≥75% coverage
- ✅ **Agent Specialization** - Delegate tasks to specialized agents

#### Measurable Results (Target)
- Tests: 100% passing
- Coverage: ≥75%
- Build warnings: 0
- Technical debt: 0
- Documentation: Complete

#### Documentation Structure
```
.memory/                    # Project memory and learning
├── server-info.md          # Hetzner server configuration
├── ssh-config.md           # SSH access details
└── learning_log.jsonl      # Lessons learned

docs/
├── specs/                  # Specifications per phase
├── ADR/                    # Architecture Decision Records
└── audits/                 # Audit reports

METODOLOGIA SOLARIA/        # Complete methodology docs
├── README_METODOLOGIA.md
├── DESARROLLO_METODOLOGIA_SOLARIA.md
└── RESUMEN_EJECUTIVO_METODOLOGIA.md
```

#### Agent System (10 Specialized Agents)
1. **Project Coordinator** - Task delegation and management
2. **PostgreSQL Schema Architect** - Database design
3. **Payload CMS Architect** - CMS implementation
4. **React Frontend Dev** - Frontend development
5. **Security GDPR Compliance** - Security audits
6. **BullMQ Worker Automation** - Background jobs
7. **Infrastructure DevOps** - Deployment and infrastructure
8. **Testing Automation** - Test suites and CI/CD
9. **LLM Ingestion** - AI content generation
10. **Analytics Metrics** - GA4, Meta Pixel, Plausible

**Key Rule**: Always delegate to specialized agents for complex tasks.

#### Automation Philosophy
**CRITICAL**: This project is designed for **complete automation without user intervention**.

- ✅ **Auto-execution**: Execute all tasks autonomously
- ✅ **SSH Access**: Use `~/.ssh/solaria-hetzner/id_solaria_hetzner_prod` for Hetzner server
- ✅ **Database Operations**: Execute directly on PostgreSQL via SSH
- ✅ **Service Management**: Restart/reload services as needed (PM2, Nginx, PostgreSQL)
- ✅ **Error Handling**: Auto-fix or document errors, never wait for user input
- ✅ **Verification**: Auto-verify all operations (tests, builds, deployments)

**Connection Details**:
- Server: `root@46.62.222.138`
- SSH Key: `~/.ssh/solaria-hetzner/id_solaria_hetzner_prod`
- Database: `cepcomunicacion` (PostgreSQL 16.10)
- Redis: localhost:6379
- PM2 App: `cepcomunicacion-cms`

## Technology Stack (UPDATED 2025-11-23)

### Backend ✅ IMPLEMENTED & DEPLOYED
- **CMS/API:** Payload CMS 3.62.1 (Next.js 15.2.3 + TypeScript)
- **Database:** PostgreSQL 16.10 (27+ collections with full schema)
- **Job Queue:** BullMQ + Redis 7.0.15
- **Authentication:** Payload built-in with RBAC (5 roles: Admin, Gestor, Marketing, Asesor, Lectura)
- **Status:** Production deployed at http://46.62.222.138
- **Process Manager:** PM2 6.0.13 (app: cepcomunicacion-cms)

### Frontend 🔄 PENDING INTEGRATION
- **Framework:** React 19.1.0 with TypeScript 5.9.3
- **Build Tool:** Vite 7.1.12
- **Styling:** TailwindCSS 4.0 with Montserrat typography
- **State Management:** React Context + Hooks
- **Routing:** React Router 7.9.4
- **Status:** Static build ready, pending CMS integration

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Server:** Ubuntu 24.04.3 LTS on Hetzner VPS (srv943151 - 46.62.222.138)
- **Web Server:** Nginx 1.26.3 with reverse proxy + security headers
- **Storage:** Local persistent volumes or S3-compatible (MinIO)

### Integrations
- **Marketing:** Meta Ads API, Mailchimp
- **Communication:** WhatsApp Cloud API, SMTP (Brevo/Mailgun)
- **Analytics:** GA4, Meta Pixel, Plausible
- **AI/LLM:** OpenAI/Claude/Ollama for content generation

## ⚠️ CRITICAL CONFIGURATION: TailwindCSS v4 Setup

**MEMORIZAR:** Esta configuración se ha perdido 2 veces. **NO OLVIDAR.**

### Problema Recurrente
Después de recuperar archivos del stash o perder trabajo, el CSS deja de funcionar porque Tailwind v4 no genera las clases de utilidad (`bg-background`, `text-foreground`, etc.).

### Root Cause
Tailwind CSS v4 cambió la forma de definir colores personalizados con variables CSS. **Los colores DEBEN estar en `theme.colors` directamente, NO en `theme.extend.colors`.**

### ✅ Configuración Correcta (apps/cms/tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './@payload-config/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    // ✅ COLORES EN theme.colors (NO en extend)
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      sidebar: {
        DEFAULT: "hsl(var(--sidebar))",
        foreground: "hsl(var(--sidebar-foreground))",
        primary: "hsl(var(--sidebar-primary))",
        "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
        accent: "hsl(var(--sidebar-accent))",
        "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        border: "hsl(var(--sidebar-border))",
        ring: "hsl(var(--sidebar-ring))",
      },
    },
    extend: {
      // ❌ NO mover los colores aquí
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // ... otras extensiones
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### ✅ PostCSS Config (apps/cms/postcss.config.cjs)

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ TailwindCSS v4
    autoprefixer: {},
  },
}
```

### ✅ globals.css (apps/cms/app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 97%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    /* ... todas las variables CSS */
  }
}
```

### Verificación Rápida

```bash
# 1. Verificar que el CSS se compila correctamente
curl http://localhost:3000/_next/static/css/app/layout.css | grep "\.bg-background"

# Debe retornar clases como:
# .bg-background { background-color: hsl(var(--background)); }

# 2. Si NO aparece nada, el problema está en tailwind.config.js
# Verificar que colors esté en theme.colors (NO en extend)

# 3. Reiniciar servidor después de cambios
pkill -f "next dev"
pnpm --filter cms run dev
```

### Síntomas del Problema
- ✅ HTML renderiza correctamente con clases Tailwind
- ✅ CSS file se sirve (200 OK)
- ✅ Variables CSS están definidas en :root
- ❌ **Clases de utilidad NO existen en el CSS** (`.bg-background`, `.text-foreground` no encontradas)
- ❌ Dashboard se ve sin estilos (texto blanco sobre blanco)

### Solución Inmediata
1. Mover `colors` de `theme.extend` a `theme` directamente
2. Reiniciar servidor (`pkill -f "next dev" && pnpm --filter cms run dev`)
3. Verificar clases generadas con curl
4. Hard refresh en navegador (Cmd+Shift+R)

**IMPORTANTE:** Esta configuración es específica de TailwindCSS v4.x. Si vuelve a fallar el CSS después de recuperar archivos, **verificar primero tailwind.config.js**.

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

**Current Status:** ✅ Phase F1-F2 Complete | 🔄 Phase F3-F4 In Progress

### Implementation Status

| Phase | Deliverable | Status | Notes |
|-------|-------------|--------|-------|
| **F1** | Payload CMS + PostgreSQL + Redis infrastructure | ✅ Complete | Deployed to production |
| **F2** | Custom CMS dashboard + CRUD operations | ✅ Complete | Cursos, Ciclos, Convocatorias, Sedes |
| **F3** | Role-based access control + permissions | 🔄 In Progress | Basic RBAC implemented |
| **F4** | Lead forms + tracking + RGPD compliance | 🔄 In Progress | Schema ready, forms pending |
| **F5** | BullMQ automation + external integrations | 📋 Planned | Infrastructure ready |
| **F6** | LLM ingestion pipeline + ad generation | 📋 Planned | - |
| **F7** | Analytics dashboards + data exports | 📋 Planned | - |
| **F8** | QA + security hardening + SSL deployment | 📋 Planned | - |

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

**VPS Details (Hetzner Production Server):**
- Hostname: srv943151
- IP: 46.62.222.138
- Provider: Hetzner VPS
- OS: Ubuntu 24.04.3 LTS
- CPU: 1 vCore AMD EPYC 9354P
- RAM: 3.8 GB
- Storage: 48 GB SSD
- Swap: 4GB (optimized for production)

**Production Stack:**
- Nginx 1.26.3 (reverse proxy + static server)
- Node.js v22.20.0
- PostgreSQL 16.10 (native installation)
- Redis 7.0.15 (native installation)
- PM2 6.0.13 (process manager)
- Git 2.48.1
- UFW firewall (active: SSH, HTTP, HTTPS)

**Current Deployment:**
- Next.js 15.2.3 + Payload CMS 3.62.1 (PM2 managed)
- React 19.0.0 frontend (Vite static build)
- Nginx serving frontend + proxying CMS/API
- PostgreSQL database with 27 tables
- Redis for BullMQ job queue
- SSL/TLS ready (Let's Encrypt - pending configuration)

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

### ✅ Completed Infrastructure
- ✅ Next.js + Payload CMS monorepo configured
- ✅ PostgreSQL 16.10 with complete schema (27+ tables)
- ✅ Redis 7.0.15 + BullMQ job queue infrastructure
- ✅ Nginx reverse proxy + static file serving
- ✅ PM2 process management
- ✅ TypeScript + ESLint configured across workspace
- ✅ Custom dashboard with CRUD operations

### 🔄 Current Work (Phase F3-F4)
1. **Role-based permissions** - Field-level access control refinement
2. **Lead capture forms** - Frontend + backend integration
3. **RGPD compliance** - Consent management + audit trails
4. **Frontend integration** - Connect React frontend with Payload API
5. **Testing framework** - Unit + integration test setup
6. **Background workers** - BullMQ job processors for automation

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

**Last Updated:** 2025-11-23
**Phase Status:** ✅ F1-F2 Complete - CMS Deployed | 🔄 F3-F4 In Progress
**Production URL:** http://46.62.222.138
**CMS Dashboard:** http://46.62.222.138/admin (Payload CMS)
**API Endpoint:** http://46.62.222.138/api (REST + GraphQL)
