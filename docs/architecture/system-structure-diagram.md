# CEP Comunicación - System Architecture Diagram

## Current System Structure

```mermaid
graph TB
    subgraph "Production Environment"
        DOMAIN[www.cepcomunicacion.com]
    end

    subgraph "Development Environment"
        subgraph "Frontend (Public Website)"
            WEB_NEXT[apps/web-next]
            WEB_NEXT --> |Port 3000| NEXTJS[Next.js App Router]
            NEXTJS --> |Pages| PAGES["/ (home)<br/>/cursos<br/>/ciclos<br/>/blog<br/>/contacto<br/>/sedes<br/>/sobre-nosotros"]
            NEXTJS --> |Dynamic Routes| DYNAMIC["/cursos/[slug]<br/>/cursos/desempleados<br/>/cursos/ocupados<br/>/cursos/privados<br/>/cursos/teleformacion"]
        end

        subgraph "Backend (CMS + API)"
            CMS[apps/cms]
            CMS --> |Port 3001| PAYLOAD[Payload CMS]
            CMS --> |Admin Dashboard| DASHBOARD["/dashboard<br/>/dashboard/ciclos<br/>/dashboard/profesores<br/>/dashboard/programacion<br/>/dashboard/sedes"]
            CMS --> |Legal Pages| LEGAL["/legal/cookies<br/>/legal/privacidad<br/>/legal/terminos"]
            CMS --> |API Endpoints| API["/api/*"]
        end

        subgraph "Admin Panel"
            ADMIN[apps/admin]
            ADMIN --> |Port 3002| ADMIN_PANEL["Admin Dashboard<br/>Media Management<br/>Upload Functionality"]
        end

        subgraph "Services Layer"
            POSTGRES[(PostgreSQL<br/>Port 5432)]
            REDIS[(Redis<br/>Port 6379)]
            DOCKER[Docker Containers]
        end

        subgraph "Package Management"
            API_CLIENT[packages/api-client]
            TYPES[packages/types]
        end
    end

    subgraph "Data Flow"
        COURSE_DATA[Course Convocations]
        SYNC[Auto-sync Mechanism]

        DASHBOARD --> |Creates/Updates| COURSE_DATA
        COURSE_DATA --> |Auto-sync| SYNC
        SYNC --> |Populates| PAGES
        SYNC --> |Populates| DYNAMIC
    end

    %% Connections
    WEB_NEXT -.-> |API Calls| CMS
    ADMIN -.-> |API Calls| CMS
    CMS --> |Stores/Retrieves| POSTGRES
    CMS --> |Caching| REDIS
    POSTGRES --> |Containerized| DOCKER
    REDIS --> |Containerized| DOCKER

    API_CLIENT --> |Shared Types| WEB_NEXT
    API_CLIENT --> |Shared Types| CMS
    API_CLIENT --> |Shared Types| ADMIN
    TYPES --> |Type Definitions| API_CLIENT

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef services fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef packages fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef dataflow fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    class WEB_NEXT,NEXTJS,PAGES,DYNAMIC frontend
    class CMS,PAYLOAD,DASHBOARD,LEGAL,API backend
    class POSTGRES,REDIS,DOCKER services
    class API_CLIENT,TYPES packages
    class COURSE_DATA,SYNC dataflow
```

## Component Responsibilities

### Frontend (apps/web-next)

- **Purpose**: Public website for course presentation and information
- **Technology**: Next.js 14+ with App Router
- **Key Features**:
  - Course catalog display
  - Course convocation listings
  - Static content pages (About, Contact, etc.)
  - Responsive design with TailwindCSS
  - SEO optimization

### Backend CMS (apps/cms)

- **Purpose**: Content management and administrative dashboard
- **Technology**: Payload CMS + Next.js
- **Key Features**:
  - Course management interface
  - Professor administration
  - Scheduling and programming
  - Legal page management
  - API endpoints for frontend consumption

### Admin Panel (apps/admin)

- **Purpose**: Administrative operations and media management
- **Technology**: Next.js with custom admin interface
- **Key Features**:
  - Media upload and management
  - Administrative dashboard
  - System configuration

### Services Layer

- **PostgreSQL**: Primary data storage
- **Redis**: Caching and session management
- **Docker**: Container orchestration for development

## Integration Points

### Course Convocation Sync

1. **Creation**: Admin creates course convocations in CMS dashboard
2. **Processing**: Backend processes and validates course data
3. **Sync**: Automatic synchronization to frontend
4. **Display**: Frontend displays updated course information

### API Communication

- Frontend consumes CMS API endpoints
- Shared type definitions ensure consistency
- Real-time updates through proper caching strategy

## Development Workflow

### Local Development

```bash
# Start services
docker-compose up -d postgres redis

# Start backend (CMS)
cd apps/cms && pnpm dev  # Port 3001

# Start frontend
cd apps/web-next && pnpm dev  # Port 3000

# Start admin panel (optional)
cd apps/admin && pnpm dev  # Port 3002
```

### Build Process

- Each app has independent build configuration
- Standalone output for Docker deployment
- TypeScript compilation with strict mode
- Optimized bundles for production

## Key Technical Decisions

### Monorepo Structure

- Shared packages for type safety
- Independent deployment capability
- Consistent tooling across applications

### Next.js App Router

- Modern React patterns
- Server-side rendering
- Optimized performance

### Payload CMS Integration

- Headless CMS architecture
- Type-safe API generation
- Admin interface included

### Docker Services

- Consistent development environment
- Easy deployment scaling
- Service isolation

---

_Last Updated: 2025-11-17_
_Status: Architecture Documented and Verified_
