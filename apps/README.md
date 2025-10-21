# Applications

This directory contains the main applications of the CEPComunicacion v2 monorepo.

## Structure

```
apps/
├── api/       # Cloudflare Workers API (Hono.js)
├── web/       # Student portal (React + Vite)
└── admin/     # Administration panel (React + Vite)
```

## Applications

### API (`/apps/api/`)
**Status:** Not yet created
**Type:** Cloudflare Workers
**Framework:** Hono.js
**Purpose:** Backend API for all client applications

**Features:**
- RESTful API endpoints
- Authentication & authorization
- Business logic
- Database operations (Drizzle ORM)
- File storage (R2)
- Caching (KV)

### Web (`/apps/web/`)
**Status:** Not yet created
**Type:** React SPA
**Framework:** React + Vite
**Purpose:** Student-facing portal

**Features:**
- Course catalog browsing
- Student enrollment
- Progress tracking
- Document access
- Payment processing
- Profile management

### Admin (`/apps/admin/`)
**Status:** Not yet created
**Type:** React SPA
**Framework:** React + Vite
**Purpose:** Administrative panel

**Features:**
- User management
- Course management
- Enrollment processing
- Financial reporting
- Analytics dashboards
- Configuration

## Development

Applications will be created in Phase 1 of development. Each application will:
- Use shared packages from `/packages/`
- Follow TypeScript strict mode
- Include comprehensive tests
- Have its own README with specific setup instructions

## Dependencies

Applications depend on:
- `/packages/database/` - Database schemas and client
- `/packages/types/` - Shared TypeScript types
- `/packages/ui/` - Shared UI components
- `/packages/utils/` - Shared utilities

---

**Phase:** Phase 1 (Foundation)
**Next Steps:** Set up API application structure
