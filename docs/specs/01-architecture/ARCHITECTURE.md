# Architecture Specification
# CEPComunicacion.com v2

**Version:** 1.0.0
**Date:** 2025-10-20
**Status:** Phase 0 - Approved
**Owner:** SOLARIA AGENCY - Dirección de Tecnología

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Patterns](#2-architecture-patterns)
3. [Component Diagrams](#3-component-diagrams)
4. [Data Flow Diagrams](#4-data-flow-diagrams)
5. [Technology Decisions](#5-technology-decisions)
6. [Scalability Strategy](#6-scalability-strategy)
7. [Security Architecture](#7-security-architecture)
8. [Deployment Architecture](#8-deployment-architecture)

---

## 1. System Overview

### 1.1 Architecture Style

**Monorepo with Microservices-Inspired Separation**

CEPComunicacion v2 follows a **monolithic monorepo** architecture where all code lives in a single repository but is organized into clear, independent modules with well-defined boundaries.

**Key Characteristics:**
- Single database (PostgreSQL) - no distributed data
- Single deployment unit per service (frontend, backend, workers)
- Shared code via internal packages
- Clear separation of concerns
- Independent scalability per service

### 1.2 System Context Diagram

```mermaid
C4Context
    title System Context Diagram - CEPComunicacion v2

    Person(student, "Prospective Student", "Searches courses, submits leads")
    Person(admin, "Admin User", "Manages courses, campaigns, leads")
    Person(gestor, "Gestor Académico", "Creates/updates courses")
    Person(marketing, "Marketing Manager", "Manages campaigns, ads")
    Person(asesor, "Asesor Comercial", "Follows up leads")

    System(cep, "CEPComunicacion Platform", "Educational platform management system")

    System_Ext(meta, "Meta Ads API", "Lead capture, conversion tracking")
    System_Ext(mailchimp, "Mailchimp", "Email marketing automation")
    System_Ext(whatsapp, "WhatsApp Cloud API", "Lead notifications")
    System_Ext(openai, "OpenAI/Claude", "LLM content generation")
    System_Ext(ga4, "Google Analytics 4", "Web analytics")
    System_Ext(plausible, "Plausible", "Privacy-focused analytics")

    Rel(student, cep, "Browses courses, submits leads", "HTTPS")
    Rel(admin, cep, "Manages platform", "HTTPS")
    Rel(gestor, cep, "Creates courses", "HTTPS")
    Rel(marketing, cep, "Manages campaigns", "HTTPS")
    Rel(asesor, cep, "Follows up leads", "HTTPS")

    Rel(cep, meta, "Sends conversions, receives leads", "HTTPS/Webhook")
    Rel(cep, mailchimp, "Syncs contacts, sends campaigns", "REST API")
    Rel(cep, whatsapp, "Sends messages", "Cloud API")
    Rel(cep, openai, "Generates content", "REST API")
    Rel(cep, ga4, "Sends events", "Measurement Protocol")
    Rel(cep, plausible, "Sends page views", "JavaScript")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

### 1.3 High-Level Component Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser<br/>Desktop/Mobile]
    end

    subgraph "Edge Layer"
        Nginx[Nginx Reverse Proxy<br/>SSL Termination<br/>Rate Limiting]
    end

    subgraph "Application Layer"
        Frontend[React Frontend<br/>Vite + TailwindCSS]
        Backend[Payload CMS API<br/>Node.js + Express]
    end

    subgraph "Worker Layer"
        WorkerAuto[Worker: Automation<br/>lead.created, campaign.sync]
        WorkerLLM[Worker: LLM Ingest<br/>PDF parsing, content gen]
        WorkerStats[Worker: Stats<br/>stats.rollup, backup.daily]
    end

    subgraph "Data Layer"
        Postgres[(PostgreSQL 16+<br/>Primary Database)]
        Redis[(Redis 7+<br/>Queue Storage)]
        Storage[/Media Storage<br/>Local Volumes/]
    end

    subgraph "External Services"
        Meta[Meta Ads API]
        Mailchimp[Mailchimp]
        WhatsApp[WhatsApp API]
        LLM[OpenAI/Claude]
        Analytics[GA4 + Plausible]
    end

    Browser -->|HTTPS| Nginx
    Nginx -->|/| Frontend
    Nginx -->|/api| Backend

    Frontend -.->|API Calls| Backend
    Backend --> Postgres
    Backend --> Redis
    Backend --> Storage

    Redis --> WorkerAuto
    Redis --> WorkerLLM
    Redis --> WorkerStats

    WorkerAuto --> Postgres
    WorkerAuto --> Mailchimp
    WorkerAuto --> WhatsApp
    WorkerAuto --> Meta

    WorkerLLM --> Postgres
    WorkerLLM --> Storage
    WorkerLLM --> LLM

    WorkerStats --> Postgres
    WorkerStats --> Storage

    Frontend --> Analytics
    Backend --> Analytics

    style Browser fill:#e1f5ff
    style Nginx fill:#ffe1f5
    style Frontend fill:#e1ffe1
    style Backend fill:#fff4e1
    style Postgres fill:#e1e1ff
    style Redis fill:#ffe1e1
```

---

## 2. Architecture Patterns

### 2.1 Monorepo Structure

```
cepcomunicacion/
├── apps/
│   ├── web/                    # Public-facing React application
│   │   ├── src/
│   │   │   ├── components/     # Atomic Design structure
│   │   │   ├── pages/          # Route-based pages
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Utilities, API client
│   │   │   └── styles/         # Global styles, Tailwind config
│   │   ├── public/             # Static assets
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── cms/                    # Payload CMS backend
│       ├── src/
│       │   ├── collections/    # Payload collections (Courses, Leads, etc.)
│       │   ├── hooks/          # Payload hooks (beforeValidate, afterChange)
│       │   ├── access/         # RBAC functions
│       │   ├── endpoints/      # Custom API endpoints
│       │   └── payload.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── ui/                     # Shared UI components
│   │   ├── src/
│   │   │   ├── atoms/          # Button, Input, Label, etc.
│   │   │   ├── molecules/      # Card, Form, Modal
│   │   │   └── organisms/      # Header, Footer, Hero
│   │   ├── tailwind.config.js  # Shared Tailwind theme
│   │   └── package.json
│   │
│   ├── sdk/                    # API client SDK for Payload
│   │   ├── src/
│   │   │   ├── client.ts       # Axios-based API client
│   │   │   ├── types.ts        # Generated TypeScript types
│   │   │   └── endpoints/      # Typed endpoint functions
│   │   └── package.json
│   │
│   ├── types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── models.ts       # Database models
│   │   │   ├── api.ts          # API request/response types
│   │   │   └── common.ts       # Utility types
│   │   └── package.json
│   │
│   └── config/                 # Shared configurations
│       ├── eslint-config/      # ESLint rules
│       ├── tsconfig/           # Base tsconfig.json files
│       └── prettier-config/    # Prettier rules
│
├── workers/
│   ├── automation/             # BullMQ worker for automation
│   │   ├── src/
│   │   │   ├── jobs/           # Job handlers (lead.created, campaign.sync)
│   │   │   ├── integrations/   # Mailchimp, WhatsApp, Meta clients
│   │   │   └── index.ts        # Worker entry point
│   │   └── package.json
│   │
│   └── llm/                    # BullMQ worker for LLM
│       ├── src/
│       │   ├── jobs/           # llm.ingest handler
│       │   ├── parsers/        # PDF parser
│       │   ├── prompts/        # LLM prompt templates
│       │   └── index.ts
│       └── package.json
│
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.cms
│   │   ├── Dockerfile.worker
│   │   └── nginx/
│   │       ├── nginx.conf
│   │       └── ssl/            # SSL certificates
│   │
│   ├── scripts/
│   │   ├── deploy.sh           # Deployment script
│   │   ├── backup.sh           # Backup script
│   │   └── restore.sh          # Restore script
│   │
│   └── terraform/              # (Optional) Infrastructure as Code
│       └── main.tf
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # Continuous Integration
│       └── cd.yml              # Continuous Deployment
│
├── package.json                # Root package.json (workspaces)
├── turbo.json                  # Turborepo configuration (optional)
├── tsconfig.json               # Root TypeScript config
└── README.md
```

**Design Decisions:**

1. **Apps vs Packages:**
   - `apps/`: Deployable applications (have `start` script, entry points)
   - `packages/`: Shared libraries consumed by apps
   - `workers/`: Background job processors (deployable but not web servers)

2. **Monorepo Tooling:**
   - **npm workspaces** or **pnpm workspaces** for dependency management
   - **Turborepo** (optional) for caching and parallel builds
   - **Changesets** for version management (if publishing packages)

3. **No Circular Dependencies:**
   - Apps can import from packages
   - Packages can import from other packages
   - **Never:** packages importing from apps

### 2.2 Layered Architecture

```mermaid
graph TD
    subgraph "Presentation Layer"
        UI[React Components<br/>Pages, Forms, Layouts]
    end

    subgraph "Application Layer"
        API[API Routes<br/>Payload CMS Endpoints]
        Hooks[React Hooks<br/>Custom Business Logic]
    end

    subgraph "Business Logic Layer"
        Services[Services<br/>Course, Lead, Campaign Logic]
        Validators[Validators<br/>Zod Schemas]
    end

    subgraph "Data Access Layer"
        ORM[Payload ORM<br/>Collection Models]
        Cache[Redis Cache<br/>Query Results]
    end

    subgraph "Infrastructure Layer"
        DB[(PostgreSQL<br/>Persistent Storage)]
        Queue[(Redis<br/>Job Queue)]
        Storage[/File Storage<br/>Media Assets/]
    end

    UI --> Hooks
    Hooks --> API
    API --> Services
    Services --> Validators
    Services --> ORM
    ORM --> DB
    Services --> Cache
    Cache --> Queue
    ORM --> Storage

    style UI fill:#e1f5ff
    style API fill:#fff4e1
    style Services fill:#e1ffe1
    style ORM fill:#ffe1e1
    style DB fill:#e1e1ff
```

**Layer Responsibilities:**

| Layer | Responsibility | Technologies |
|-------|----------------|--------------|
| **Presentation** | User interface, routing, state management | React, TailwindCSS, React Router |
| **Application** | API endpoints, request/response handling | Express, Payload REST/GraphQL |
| **Business Logic** | Domain rules, validations, workflows | TypeScript classes/functions, Zod |
| **Data Access** | Database queries, caching, indexing | Payload ORM, Redis |
| **Infrastructure** | Storage, queues, external services | PostgreSQL, Redis, S3 |

---

## 3. Component Diagrams

### 3.1 Frontend Component Architecture

```mermaid
graph TB
    subgraph "Pages (Routes)"
        HomePage[HomePage<br/>/]
        CoursesPage[CoursesPage<br/>/cursos]
        CourseDetailPage[CourseDetailPage<br/>/cursos/:slug]
        CampusesPage[CampusesPage<br/>/sedes]
        BlogPage[BlogPage<br/>/blog]
        ContactPage[ContactPage<br/>/contacto]
    end

    subgraph "Templates"
        MainLayout[MainLayout<br/>Header + Footer + Children]
        AdminLayout[AdminLayout<br/>Sidebar + Content]
    end

    subgraph "Organisms"
        Header[Header<br/>Nav, Logo, Search]
        Footer[Footer<br/>Links, Contact, Social]
        Hero[Hero<br/>CTA, Background Image]
        CourseGrid[CourseGrid<br/>List of CourseCards]
        LeadFormModal[LeadFormModal<br/>Lead Capture Form]
        FilterPanel[FilterPanel<br/>Multi-select Filters]
    end

    subgraph "Molecules"
        CourseCard[CourseCard<br/>Image, Title, CTA]
        CampusCard[CampusCard<br/>Name, Location, Contact]
        StatsWidget[StatsWidget<br/>KPI Display]
        SearchBar[SearchBar<br/>Input + Button]
    end

    subgraph "Atoms"
        Button[Button<br/>Variants: primary, secondary]
        Input[Input<br/>Text, Email, Tel]
        Label[Label]
        Badge[Badge]
        Icon[Icon<br/>Lucide React]
    end

    HomePage --> MainLayout
    CoursesPage --> MainLayout
    CourseDetailPage --> MainLayout

    MainLayout --> Header
    MainLayout --> Footer

    CoursesPage --> FilterPanel
    CoursesPage --> CourseGrid

    CourseDetailPage --> Hero
    CourseDetailPage --> LeadFormModal

    CourseGrid --> CourseCard
    FilterPanel --> Button
    FilterPanel --> Label

    CourseCard --> Badge
    CourseCard --> Button

    SearchBar --> Input
    SearchBar --> Button

    style HomePage fill:#e1f5ff
    style MainLayout fill:#fff4e1
    style Header fill:#e1ffe1
    style CourseCard fill:#ffe1e1
    style Button fill:#e1e1ff
```

**Atomic Design Hierarchy:**

1. **Atoms:** Basic building blocks (Button, Input, Icon, Badge, Label)
2. **Molecules:** Simple combinations (SearchBar, CourseCard, StatsWidget)
3. **Organisms:** Complex sections (Header, Footer, Hero, CourseGrid, FilterPanel)
4. **Templates:** Page layouts (MainLayout, AdminLayout)
5. **Pages:** Route-specific components (HomePage, CoursesPage, etc.)

### 3.2 Backend Service Architecture

```mermaid
graph TB
    subgraph "API Layer"
        REST[REST Endpoints<br/>/api/courses, /api/leads]
        GraphQL[GraphQL<br/>Query, Mutation]
        Webhooks[Webhooks<br/>/webhooks/meta]
    end

    subgraph "Payload Collections"
        Courses[Courses Collection<br/>CRUD + Hooks]
        CourseRuns[CourseRuns Collection]
        Campuses[Campuses Collection]
        Leads[Leads Collection]
        Campaigns[Campaigns Collection]
        Users[Users Collection<br/>Auth]
    end

    subgraph "Hooks Layer"
        BeforeValidate[beforeValidate<br/>Normalize Data]
        AfterChange[afterChange<br/>Trigger Jobs]
        BeforeRead[beforeRead<br/>Apply Filters]
        Access[Access Control<br/>RBAC]
    end

    subgraph "Services"
        LeadService[Lead Service<br/>Create, Update, Export]
        CampaignService[Campaign Service<br/>UTM Generation]
        AnalyticsService[Analytics Service<br/>Stats Aggregation]
    end

    subgraph "External Integrations"
        MetaClient[Meta Ads Client]
        MailchimpClient[Mailchimp Client]
        WhatsAppClient[WhatsApp Client]
        LLMClient[OpenAI/Claude Client]
    end

    REST --> Courses
    REST --> Leads
    GraphQL --> Courses
    Webhooks --> Leads

    Courses --> BeforeValidate
    Courses --> AfterChange
    Leads --> AfterChange
    Leads --> Access

    AfterChange --> LeadService
    LeadService --> MetaClient
    LeadService --> MailchimpClient

    CampaignService --> AnalyticsService

    style REST fill:#e1f5ff
    style Courses fill:#fff4e1
    style AfterChange fill:#e1ffe1
    style LeadService fill:#ffe1e1
```

---

## 4. Data Flow Diagrams

### 4.1 Lead Submission Flow

```mermaid
sequenceDiagram
    actor User as Prospective Student
    participant Frontend as React Frontend
    participant Nginx as Nginx Proxy
    participant API as Payload API
    participant DB as PostgreSQL
    participant Queue as Redis Queue
    participant Worker as Worker: Automation
    participant Mailchimp as Mailchimp API
    participant WhatsApp as WhatsApp API
    participant Analytics as GA4 + Meta Pixel

    User->>Frontend: Fill lead form
    Frontend->>Frontend: Validate with Zod
    Frontend->>Frontend: Verify hCaptcha
    Frontend->>Nginx: POST /api/leads {name, email, ...}
    Nginx->>API: Forward request

    API->>API: Run beforeValidate hook
    API->>DB: INSERT INTO leads
    DB-->>API: lead_id returned

    API->>API: Run afterChange hook
    API->>Queue: Enqueue lead.created job
    Queue-->>API: Job queued

    API-->>Nginx: 201 Created {lead_id}
    Nginx-->>Frontend: Response
    Frontend-->>User: Show "Gracias" message

    Frontend->>Analytics: Send lead_submit event

    Queue->>Worker: Process lead.created job
    Worker->>DB: Fetch lead details
    Worker->>Mailchimp: POST /lists/{id}/members
    Mailchimp-->>Worker: Contact created

    Worker->>WhatsApp: POST /messages {to, template}
    WhatsApp-->>Worker: Message sent

    Worker->>DB: Log actions in audit_log
    Worker-->>Queue: Mark job as completed

    Note over User,Analytics: Total time: ~500ms (API)<br/>Background jobs: ~2-5s
```

### 4.2 LLM Content Generation Flow

```mermaid
sequenceDiagram
    actor Admin as Gestor Académico
    participant Dashboard as Payload Admin
    participant API as Payload API
    participant Storage as File Storage
    participant Queue as Redis Queue
    participant Worker as Worker: LLM
    participant LLM as OpenAI/Claude API
    participant DB as PostgreSQL

    Admin->>Dashboard: Upload PDF (course materials)
    Dashboard->>API: POST /api/upload
    API->>Storage: Store PDF file
    Storage-->>API: file_path
    API->>DB: INSERT INTO uploads {file_path, status: pending}

    Admin->>Dashboard: Click "Generate Content"
    Dashboard->>API: POST /api/llm/ingest {upload_id}
    API->>Queue: Enqueue llm.ingest job
    Queue-->>API: Job queued
    API-->>Dashboard: 202 Accepted {job_id}

    Queue->>Worker: Process llm.ingest job
    Worker->>Storage: Read PDF file
    Worker->>Worker: Parse PDF text (pdf-parse lib)

    Worker->>LLM: POST /chat/completions<br/>{prompt: extract_objectives}
    LLM-->>Worker: objectives: [...]

    Worker->>LLM: POST /chat/completions<br/>{prompt: extract_curriculum}
    LLM-->>Worker: curriculum: [...]

    Worker->>LLM: POST /chat/completions<br/>{prompt: generate_ads}
    LLM-->>Worker: ads: {headlines, texts, ...}

    Worker->>Worker: Validate with Zod schemas
    Worker->>DB: UPDATE uploads SET status: completed, data: {...}
    Worker-->>Queue: Mark job as completed

    Dashboard->>API: GET /api/llm/results/{job_id}
    API->>DB: SELECT * FROM uploads WHERE id = job_id
    DB-->>API: {data: {objectives, curriculum, ads}}
    API-->>Dashboard: Return results

    Dashboard-->>Admin: Show preview with edit option

    Admin->>Dashboard: Approve content
    Dashboard->>API: POST /api/courses {title, objectives, ...}
    API->>DB: INSERT INTO courses
    DB-->>API: course_id
    API-->>Dashboard: 201 Created
    Dashboard-->>Admin: Course created successfully

    Note over Admin,DB: Total time: 30-90s (depends on PDF size and LLM latency)
```

### 4.3 Campaign UTM Generation Flow

```mermaid
flowchart TD
    Start([Marketing Manager creates campaign]) --> Input[Input campaign details:<br/>Season, Year, Related Courses]

    Input --> Generate[Auto-generate trackingTag:<br/>{season}-{year}-{course-slug}]

    Generate --> UTM[Build UTM parameters:<br/>source, medium, campaign, content]

    UTM --> Validate{Validate UTM format}

    Validate -->|Invalid| Error[Show validation error]
    Error --> Input

    Validate -->|Valid| Save[Save campaign to database]

    Save --> CreateLinks[Generate tracking links for each course]

    CreateLinks --> Display[Display UTM links in dashboard]

    Display --> Copy{Marketing copies link}

    Copy -->|Yes| Paste[Paste in Meta Ads Manager<br/>or email campaigns]

    Paste --> Track[Track clicks and conversions<br/>in GA4 + Internal Analytics]

    Track --> Report[Generate campaign report:<br/>Clicks, Leads, CTR, CPL]

    Report --> End([Campaign performance measured])

    style Start fill:#e1f5ff
    style Generate fill:#fff4e1
    style Save fill:#e1ffe1
    style Track fill:#ffe1e1
    style End fill:#e1e1ff
```

---

## 5. Technology Decisions

### 5.1 Frontend Stack

| Technology | Decision | Rationale | Alternatives Considered |
|------------|----------|-----------|-------------------------|
| **React 18+** | ✅ Chosen | Mature, large ecosystem, component-based, hooks for state | Vue 3 (smaller community), Svelte (less mature) |
| **Vite** | ✅ Chosen | Fast HMR, optimized builds, better DX than Webpack | Webpack (slower), Parcel (less plugins) |
| **TypeScript** | ✅ Chosen | Type safety, better IDE support, catches errors early | JavaScript (no type safety) |
| **TailwindCSS** | ✅ Chosen | Utility-first, customizable, small bundle size | Bootstrap (less flexible), Styled Components (CSS-in-JS overhead) |
| **React Router v6** | ✅ Chosen | Standard routing, code splitting support | Next.js (overkill for this use case, requires Node server) |
| **TanStack Query** | ✅ Chosen | Server state management, caching, automatic refetching | Redux Toolkit (more boilerplate), SWR (less features) |
| **Zod** | ✅ Chosen | Runtime validation, TypeScript integration | Yup (less type-safe), Joi (Node-only) |
| **Lucide React** | ✅ Chosen | Modern icons, tree-shakeable, customizable | Font Awesome (heavier), Heroicons (fewer icons) |

**Trade-offs Accepted:**
- **No SSR/SSG:** React without Next.js means no server-side rendering. Acceptable because SEO is handled via semantic HTML, meta tags, and sitemap.
- **Client-side routing:** Requires fallback to `index.html` on Nginx for SPA routing.

### 5.2 Backend Stack

| Technology | Decision | Rationale | Alternatives Considered |
|------------|----------|-----------|-------------------------|
| **Payload CMS** | ✅ Chosen | Headless CMS with admin UI, TypeScript, flexible collections, hooks system | Strapi (less TypeScript support), Directus (Vue-based admin), Contentful (SaaS, expensive) |
| **Node.js 20 LTS** | ✅ Chosen | JavaScript runtime, large package ecosystem, matches frontend language | Deno (less mature ecosystem), Bun (too new) |
| **Express 4** | ✅ Chosen | Minimal web framework, used by Payload internally | Fastify (faster but less compatible with Payload), Koa (less middleware) |
| **PostgreSQL 16+** | ✅ Chosen | Relational integrity, JSONB for flexible fields, robust, battle-tested | MySQL (weaker JSON support), MongoDB (no relational integrity), Supabase (SaaS dependency) |
| **Prisma** | ❌ Rejected | Payload has its own ORM, adding Prisma adds complexity | N/A |

**Trade-offs Accepted:**
- **Payload ORM limitations:** Less flexible than Prisma, but sufficient for CRUD operations. Custom queries use raw SQL when needed.
- **Node.js single-threaded:** Not ideal for CPU-intensive tasks, but LLM processing offloaded to workers.

### 5.3 Queue & Worker Stack

| Technology | Decision | Rationale | Alternatives Considered |
|------------|----------|-----------|-------------------------|
| **BullMQ** | ✅ Chosen | Reliable, Redis-based, retry logic, priority queues, BullBoard UI | Agenda (MongoDB dependency), Bee-Queue (less features), AWS SQS (vendor lock-in) |
| **Redis 7+** | ✅ Chosen | Fast, in-memory, pub/sub support, persistence options | Kafka (overkill for this scale), RabbitMQ (more complex setup) |
| **BullBoard** | ✅ Chosen | Web UI for monitoring queues, job status, retries | Redis Commander (no job-specific UI) |

**Trade-offs Accepted:**
- **Redis as single point of failure:** Mitigated with Redis persistence (AOF + RDB snapshots) and monitoring.
- **In-process workers:** Workers run as separate Node processes, not separate machines. Acceptable for initial scale.

### 5.4 Infrastructure Stack

| Technology | Decision | Rationale | Alternatives Considered |
|------------|----------|-----------|-------------------------|
| **Docker** | ✅ Chosen | Containerization, consistent environments, easy deployment | Kubernetes (overkill for single VPS), bare metal (less portable) |
| **Docker Compose** | ✅ Chosen | Multi-container orchestration, simple YAML config | Kubernetes (too complex), Docker Swarm (less popular) |
| **Nginx** | ✅ Chosen | Reverse proxy, SSL termination, static file serving, battle-tested | Traefik (more complex), Caddy (less mature) |
| **Ubuntu 22.04 LTS** | ✅ Chosen | Long-term support, large community, stable | Debian (less frequent updates), Alpine (smaller but less compatible) |
| **Let's Encrypt** | ✅ Chosen | Free SSL certificates, auto-renewal via Certbot | Paid certs (unnecessary cost), Cloudflare (adds dependency) |

**Trade-offs Accepted:**
- **Single VPS:** No horizontal scaling initially. Acceptable for MVP, can migrate to multi-server later.
- **Docker overhead:** ~200MB RAM per container. Acceptable given 3.8GB total RAM on VPS.

### 5.5 LLM Integration

| Technology | Decision | Rationale | Alternatives Considered |
|------------|----------|-----------|-------------------------|
| **OpenAI GPT-4 Turbo** | ✅ Primary | High-quality content generation, fast, reliable API | Claude Sonnet (more expensive), Gemini (less accurate for Spanish) |
| **Claude Sonnet 3.5** | ✅ Fallback | Excellent for structured extraction, good Spanish support | Llama 3 (requires self-hosting) |
| **Ollama + Llama 3.1 70B** | ✅ Backup | Local fallback for cost control, no API rate limits | GPT-3.5 (less capable), Mistral (weaker in Spanish) |

**Trade-offs Accepted:**
- **API dependency:** OpenAI/Claude APIs can have outages. Mitigated with Ollama fallback and job retry logic.
- **Cost variability:** LLM costs vary with usage. Monitored via token tracking and monthly budget alerts.

---

## 6. Scalability Strategy

### 6.1 Vertical Scaling (Phase 1)

**Current VPS Specs:**
- 1 vCore (AMD EPYC 9354P)
- 3.8 GB RAM
- 48 GB SSD

**Upgrade Path:**
1. **Level 1 (Current):** 1 vCore, 4 GB RAM → Supports ~500 concurrent users
2. **Level 2:** 2 vCores, 8 GB RAM → Supports ~2,000 concurrent users
3. **Level 3:** 4 vCores, 16 GB RAM → Supports ~5,000 concurrent users

**When to Upgrade:**
- CPU > 80% for 1+ hour
- RAM > 90% sustained
- Disk I/O bottleneck (check with `iostat`)

### 6.2 Horizontal Scaling (Phase 2+)

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Nginx Load Balancer<br/>Round Robin]
    end

    subgraph "Frontend Tier (Stateless)"
        FE1[Frontend Instance 1]
        FE2[Frontend Instance 2]
        FE3[Frontend Instance N]
    end

    subgraph "API Tier (Stateless)"
        API1[Payload API Instance 1]
        API2[Payload API Instance 2]
        API3[Payload API Instance N]
    end

    subgraph "Worker Tier (Stateless)"
        W1[Worker Instance 1]
        W2[Worker Instance 2]
    end

    subgraph "Data Tier (Stateful)"
        PG[(PostgreSQL Primary)]
        PG_Replica[(PostgreSQL Replica<br/>Read-only)]
        Redis[(Redis Cluster)]
        S3[/S3-Compatible Storage<br/>MinIO Cluster/]
    end

    LB --> FE1
    LB --> FE2
    LB --> FE3

    LB --> API1
    LB --> API2
    LB --> API3

    API1 --> PG
    API2 --> PG
    API3 --> PG

    API1 -.->|Reads| PG_Replica
    API2 -.->|Reads| PG_Replica

    API1 --> Redis
    API2 --> Redis

    Redis --> W1
    Redis --> W2

    W1 --> PG
    W2 --> PG

    API1 --> S3
    W1 --> S3

    PG -.->|Streaming Replication| PG_Replica

    style LB fill:#e1f5ff
    style FE1 fill:#e1ffe1
    style API1 fill:#fff4e1
    style PG fill:#e1e1ff
    style Redis fill:#ffe1e1
```

**Scaling Triggers:**
- **Frontend:** CPU > 70% on any instance → add instance
- **API:** Avg response time > 500ms → add instance
- **Workers:** Queue length > 1000 jobs → add worker
- **Database:** Read queries > 1000 QPS → add read replica

### 6.3 Caching Strategy

| Layer | Cache Type | TTL | Invalidation Strategy |
|-------|-----------|-----|----------------------|
| **Frontend** | Browser Cache | 1 year (static assets) | Cache busting via hash in filename |
| **CDN** | Cloudflare (optional) | 1 hour (HTML), 1 year (assets) | Purge on deploy |
| **API** | Redis Cache | 5 min (course list), 1 hour (course detail) | Invalidate on `afterChange` hook |
| **Database** | PostgreSQL Query Cache | Built-in | Automatic |

**Cache Keys:**
- Course list: `courses:list:{offerType}:{modality}:{page}`
- Course detail: `course:detail:{slug}`
- Campus list: `campuses:list`

---

## 7. Security Architecture

### 7.1 Defense in Depth

```mermaid
graph TB
    subgraph "Layer 1: Edge Security"
        Cloudflare[Cloudflare<br/>DDoS Protection, WAF<br/>optional]
        Firewall[UFW Firewall<br/>Ports 80, 443, 22 only]
    end

    subgraph "Layer 2: Transport Security"
        SSL[SSL/TLS 1.3<br/>Let's Encrypt Certificates]
        HSTS[HSTS Header<br/>Force HTTPS]
    end

    subgraph "Layer 3: Application Security"
        RateLimit[Rate Limiting<br/>API: 100/15min<br/>Auth: 5/15min]
        CAPTCHA[hCaptcha<br/>Bot Protection]
        CORS[CORS Policy<br/>Allowed Origins Only]
    end

    subgraph "Layer 4: Authentication & Authorization"
        JWT[JWT Tokens<br/>15min Access<br/>7d Refresh]
        RBAC[Role-Based Access Control<br/>5 Roles]
        2FA[2FA Optional<br/>TOTP]
    end

    subgraph "Layer 5: Data Security"
        Encryption[Encryption at Rest<br/>PostgreSQL TDE<br/>optional]
        Hashing[Password Hashing<br/>bcrypt 12 rounds]
        Audit[Audit Logging<br/>All Mutations]
    end

    subgraph "Layer 6: Infrastructure Security"
        Docker[Docker Secrets<br/>No .env in Git]
        Updates[Auto Security Updates<br/>unattended-upgrades]
    end

    Cloudflare --> Firewall
    Firewall --> SSL
    SSL --> HSTS
    HSTS --> RateLimit
    RateLimit --> CAPTCHA
    CAPTCHA --> CORS
    CORS --> JWT
    JWT --> RBAC
    RBAC --> 2FA
    2FA --> Encryption
    Encryption --> Hashing
    Hashing --> Audit
    Audit --> Docker
    Docker --> Updates

    style Cloudflare fill:#e1f5ff
    style SSL fill:#fff4e1
    style JWT fill:#e1ffe1
    style Encryption fill:#ffe1e1
    style Docker fill:#e1e1ff
```

### 7.2 RBAC Permission Matrix

| Collection | Admin | Gestor | Marketing | Asesor | Lectura |
|------------|-------|--------|-----------|--------|---------|
| **Courses** | CRUD | CRUD | Read | Read | Read |
| **CourseRuns** | CRUD | CRUD | Read | Read | Read |
| **Campuses** | CRUD | CRUD | Read | Read | Read |
| **Cycles** | CRUD | CRUD | Read | Read | Read |
| **Campaigns** | CRUD | Read | CRUD | Read | Read |
| **AdsTemplates** | CRUD | Read | CRUD | Read | Read |
| **Leads** | CRUD | Read | RU (notes) | RU (notes, status) | Read |
| **Users** | CRUD | None | None | None | None |
| **Settings** | RU | None | None | None | Read |
| **Analytics** | Read | Read | Read | None | Read |

**Legend:** C=Create, R=Read, U=Update, D=Delete

---

## 8. Deployment Architecture

### 8.1 Docker Compose Setup

```yaml
# docker-compose.yml (simplified)
version: '3.9'

services:
  nginx:
    image: nginx:1.26-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infra/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./infra/nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - cms
    networks:
      - external

  frontend:
    build:
      context: .
      dockerfile: infra/docker/Dockerfile.frontend
    environment:
      - VITE_API_URL=https://cepcomunicacion.com/api
    networks:
      - external

  cms:
    build:
      context: .
      dockerfile: infra/docker/Dockerfile.cms
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/cep
      - REDIS_URL=redis://redis:6379
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}
    depends_on:
      - postgres
      - redis
    networks:
      - external
      - internal

  worker-automation:
    build:
      context: .
      dockerfile: infra/docker/Dockerfile.worker
    command: npm run worker:automation
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://user:pass@postgres:5432/cep
    depends_on:
      - redis
      - postgres
    networks:
      - internal

  worker-llm:
    build:
      context: .
      dockerfile: infra/docker/Dockerfile.worker
    command: npm run worker:llm
    environment:
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - redis
    networks:
      - internal

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=cep
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=${PG_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - internal

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - internal

networks:
  external:
    driver: bridge
  internal:
    driver: bridge
    internal: true

volumes:
  postgres-data:
  redis-data:
```

### 8.2 CI/CD Pipeline

```mermaid
flowchart LR
    Dev[Developer pushes code] --> GitHub[GitHub Repository]

    GitHub --> CI{CI Pipeline<br/>GitHub Actions}

    CI --> Lint[Lint<br/>ESLint + Prettier]
    CI --> TypeCheck[Type Check<br/>tsc --noEmit]
    CI --> Test[Unit Tests<br/>Vitest]

    Lint --> Build{All checks pass?}
    TypeCheck --> Build
    Test --> Build

    Build -->|No| Fail[Pipeline fails<br/>PR blocked]

    Build -->|Yes| Docker[Build Docker Images<br/>frontend, cms, worker]

    Docker --> Registry[Push to<br/>GitHub Container Registry]

    Registry --> Deploy{Deploy to Production?}

    Deploy -->|Manual Approval| SSH[SSH to VPS]

    SSH --> Pull[Pull latest images]
    Pull --> Down[docker-compose down]
    Down --> Up[docker-compose up -d]
    Up --> Health[Health check]

    Health -->|Success| Notify[Slack notification<br/>"Deployment successful"]
    Health -->|Fail| Rollback[Rollback to previous version]

    Rollback --> NotifyFail[Slack notification<br/>"Deployment failed"]

    style Dev fill:#e1f5ff
    style CI fill:#fff4e1
    style Build fill:#e1ffe1
    style Deploy fill:#ffe1e1
    style Health fill:#e1e1ff
```

---

## 9. Monitoring & Observability

### 9.1 Metrics to Track

| Category | Metric | Tool | Alert Threshold |
|----------|--------|------|-----------------|
| **Infrastructure** | CPU Usage | Prometheus + Node Exporter | > 80% for 5 min |
| | RAM Usage | Prometheus + Node Exporter | > 90% |
| | Disk Usage | Prometheus + Node Exporter | > 85% |
| **Application** | API Latency (p95) | Prometheus + Express metrics | > 500ms |
| | Error Rate (5xx) | Prometheus | > 1% |
| | Request Rate | Prometheus | N/A (monitoring only) |
| **Database** | Query Latency (p95) | PostgreSQL logs + pg_stat_statements | > 100ms |
| | Connection Pool Usage | Prometheus | > 80% of max |
| | Deadlocks | PostgreSQL logs | Any deadlock |
| **Queue** | Queue Length | BullBoard + Prometheus | > 1000 jobs |
| | Job Failure Rate | BullBoard | > 5% |
| | Worker Health | BullBoard | Worker down for 1 min |
| **Business** | Leads per hour | Custom dashboard | < 5 (during campaign) |
| | Conversion Rate | GA4 + Internal | < 1.5% |

### 9.2 Logging Strategy

| Service | Log Level | Destination | Retention |
|---------|-----------|-------------|-----------|
| **Frontend** | Error only | Sentry (optional) | 30 days |
| **Payload API** | Info (production), Debug (dev) | Docker logs + File | 7 days |
| **Workers** | Info | Docker logs + File | 7 days |
| **Nginx** | Access + Error | File (`/var/log/nginx/`) | 14 days |
| **PostgreSQL** | Warn + Error | Docker logs | 7 days |

**Log Format:** JSON structured logs with:
- `timestamp`
- `level` (error, warn, info, debug)
- `service` (frontend, cms, worker-automation, etc.)
- `message`
- `context` (user_id, request_id, job_id, etc.)

---

## 10. Disaster Recovery

### 10.1 Backup Strategy

| Asset | Frequency | Method | Retention | Storage Location |
|-------|-----------|--------|-----------|------------------|
| **PostgreSQL** | Daily (03:00 UTC) | `pg_dump` | 30 days | S3-compatible (MinIO or AWS S3) |
| **Redis** | None (ephemeral data) | N/A | N/A | N/A |
| **Media Files** | Weekly | `rsync` to S3 | 60 days | S3-compatible |
| **Docker Images** | On build | GitHub Container Registry | Latest 10 tags | GitHub |
| **Configuration** | On commit | Git repository | Infinite | GitHub |

### 10.2 Recovery Procedures

**Scenario 1: Database Corruption**

1. Stop all services: `docker-compose down`
2. Restore from latest backup:
   ```bash
   docker-compose exec postgres psql -U user -d cep < backup_2025-10-20.sql
   ```
3. Verify data integrity (check row counts, foreign keys)
4. Restart services: `docker-compose up -d`
5. Monitor logs for errors

**RTO:** 2 hours
**RPO:** 24 hours (last backup)

**Scenario 2: VPS Failure**

1. Provision new VPS with same specs
2. Install Docker + Docker Compose
3. Clone repository
4. Restore PostgreSQL backup
5. Restore media files from S3
6. Update DNS (if IP changed)
7. Run `docker-compose up -d`
8. Verify all services healthy

**RTO:** 4 hours
**RPO:** 24 hours

---

## 11. Future Architecture Considerations

### 11.1 Phase 2+ Enhancements

1. **Separate Read/Write Database**
   - PostgreSQL primary (writes)
   - PostgreSQL replica (reads) → API queries SELECT from replica
   - Reduces load on primary database

2. **CDN for Static Assets**
   - Cloudflare or AWS CloudFront
   - Cache images, CSS, JS globally
   - Reduces bandwidth costs and improves load times

3. **Microservices Extraction**
   - LLM service → Separate deployment (Python FastAPI + Celery)
   - Analytics service → Separate deployment (real-time data processing)
   - Keep core CRUD in Payload CMS

4. **Event-Driven Architecture**
   - Replace hooks with event bus (Kafka or NATS)
   - Loose coupling between services
   - Better scalability for high-traffic scenarios

5. **Kubernetes Migration**
   - When traffic > 10,000 concurrent users
   - Auto-scaling based on CPU/RAM
   - Multi-zone deployment for HA

---

## Conclusion

This architecture is designed for:
- **Simplicity:** Easy to understand and maintain
- **Scalability:** Can grow from MVP to enterprise-scale
- **Security:** Defense in depth with RBAC, encryption, audit logging
- **Reliability:** Backups, monitoring, graceful degradation
- **Developer Experience:** TypeScript everywhere, clear boundaries, monorepo for code sharing

**Next Steps:**
1. Review and approve this architecture specification
2. Set up development environment (Docker Compose locally)
3. Begin Phase 1: Infrastructure setup
4. Iteratively build according to PRD roadmap

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-20 | Claude AI (SOLARIA AGENCY) | Initial architecture specification |

**Approval:**
- [ ] Technical Lead: _______________ Date: ___________
- [ ] Security Review: _______________ Date: ___________
- [ ] Client Representative: _______________ Date: ___________
