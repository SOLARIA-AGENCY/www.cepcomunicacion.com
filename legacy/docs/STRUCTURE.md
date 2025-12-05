# Project Structure - CEPComunicacion v2

**Last Updated:** 2025-10-21
**Status:** Phase 0 Complete - Phase 1 Ready

---

## Directory Tree

```
www.cepcomunicacion.com/
│
├── .claude/                           # Claude Code configuration
│   ├── memories/
│   │   └── development-methodology.md # Development best practices
│   ├── tasks/
│   │   └── README.md                  # TaskMaster integration
│   └── settings.local.json            # Local settings
│
├── .conductor/                        # Conductor tool (legacy)
│   └── manado/
│
├── .specify/                          # Specify tool (legacy)
│   ├── memory/
│   ├── scripts/
│   └── templates/
│
├── claude_speckit_commands/           # SpecKit commands
│   └── commands/
│       ├── speckit.analyze.md
│       ├── speckit.checklist.md
│       ├── speckit.clarify.md
│       ├── speckit.constitution.md
│       ├── speckit.implement.md
│       ├── speckit.plan.md
│       ├── speckit.specify.md
│       └── speckit.tasks.md
│
├── apps/                              # Monorepo applications
│   └── README.md
│   └── (future)
│       ├── api/                       # Cloudflare Workers API
│       ├── web/                       # Student portal (React)
│       └── admin/                     # Admin panel (React)
│
├── packages/                          # Shared packages
│   └── README.md
│   └── (future)
│       ├── database/                  # Drizzle ORM schemas
│       ├── types/                     # TypeScript types
│       ├── ui/                        # UI components
│       └── utils/                     # Utilities
│
├── infra/                             # Infrastructure
│   └── README.md
│   └── (future)
│       ├── cloudflare/                # Cloudflare config
│       └── terraform/                 # Terraform (optional)
│
├── docs/                              # Documentation (11,405+ lines)
│   ├── README.md                      # Documentation index
│   │
│   ├── specs/                         # Technical specifications
│   │   ├── README.md
│   │   ├── 00-prd/
│   │   │   └── PRD.md
│   │   ├── 01-architecture/
│   │   │   └── ARCHITECTURE.md
│   │   ├── 02-database/
│   │   │   └── DATABASE_SCHEMA.md
│   │   ├── 03-api/
│   │   │   └── API.md
│   │   ├── 04-frontend/
│   │   │   └── COMPONENTS.md
│   │   ├── 05-workers/
│   │   │   └── WORKERS.md
│   │   ├── 06-llm/
│   │   │   └── (TBD)
│   │   ├── 07-security/
│   │   │   └── SECURITY.md
│   │   ├── 08-analytics/
│   │   │   └── (TBD)
│   │   └── 09-infrastructure/
│   │       └── (TBD)
│   │
│   ├── reports/                       # Progress & audit reports
│   │   ├── SPEC_PROGRESS.md
│   │   └── AUDIT_COMPLETENESS.md
│   │
│   ├── executive/                     # Executive summaries
│   │   └── RESUMEN_EJECUTIVO.md
│   │
│   └── guides/                        # Development guides
│       ├── PROJECT_INDEX.md
│       ├── PROMPT_SPEC_DRIVEN_CEPCOMUNICACION_V2.md
│       ├── Plataforma integral de gestión formativa CEPComunicacion.com v2.md
│       ├── cepcomunicacion_v_2_desarrollo.md
│       └── PROMPT PARA GENERAR ARTICULO FINAL
│
├── .gitignore                         # Git ignore rules
├── CLAUDE.md                          # Solaria Agency server docs
├── DEVELOPMENT.md                     # Development tracking
├── README.md                          # Project README
├── REORGANIZATION_SUMMARY.md          # This reorganization summary
└── STRUCTURE.md                       # This file
```

---

## Key Directories

### Root Level
| File/Directory | Purpose |
|----------------|---------|
| `.gitignore` | Git ignore patterns for development |
| `CLAUDE.md` | Solaria Agency server documentation |
| `DEVELOPMENT.md` | Active development tracking and progress |
| `README.md` | Main project overview |
| `REORGANIZATION_SUMMARY.md` | Reorganization details |
| `STRUCTURE.md` | This structure reference |

### Monorepo Structure
| Directory | Purpose | Status |
|-----------|---------|--------|
| `/apps/` | Applications (api, web, admin) | Ready for Phase 1 |
| `/packages/` | Shared code libraries | Ready for Phase 1 |
| `/infra/` | Infrastructure configuration | Ready for Phase 1 |

### Documentation
| Directory | Purpose | Files |
|-----------|---------|-------|
| `/docs/specs/` | Technical specifications | 10 modules |
| `/docs/reports/` | Progress and audit reports | 2 reports |
| `/docs/executive/` | Executive summaries | 1 summary |
| `/docs/guides/` | Development guides | 5 guides |

### Development Tools
| Directory | Purpose | Status |
|-----------|---------|--------|
| `.claude/` | Claude Code configuration | Active |
| `.conductor/` | Conductor tool | Legacy |
| `.specify/` | Specify tool | Legacy |
| `claude_speckit_commands/` | SpecKit commands | Active |

---

## File Counts

```
Total Directories:    22
Total Files:          40+
Documentation Files:  15+
README Files:         8
Specification Lines:  11,405+
```

---

## Phase Readiness

### ✅ Phase 0: Planning (COMPLETE)
- All specifications written and organized
- Documentation complete and structured
- Project thoroughly documented

### 🚧 Phase 1: Foundation (READY)
- Monorepo structure created (`/apps/`, `/packages/`, `/infra/`)
- Development tracking in place (`DEVELOPMENT.md`)
- Git ignore configured
- Claude Code configured

### 📋 Phase 2+: (PLANNED)
- Structure ready for implementation
- Specifications ready for reference

---

## Quick Navigation

### For Developers
```bash
# View specifications
cd docs/specs/

# View development status
cat DEVELOPMENT.md

# View methodology
cat .claude/memories/development-methodology.md
```

### For Project Managers
```bash
# View progress
cat docs/reports/SPEC_PROGRESS.md

# View executive summary
cat docs/executive/RESUMEN_EJECUTIVO.md

# View project index
cat docs/guides/PROJECT_INDEX.md
```

### For Implementation
```bash
# Future application code
cd apps/

# Future shared packages
cd packages/

# Future infrastructure
cd infra/
```

---

## File Size Summary

```
Documentation:        ~11,405 lines
Specifications:       ~10,000 lines
Reports:              ~1,000 lines
Guides:               ~2,000 lines
README files:         ~500 lines
Development tracking: ~200 lines
```

---

## Important Paths

### Most Referenced
- `/docs/specs/README.md` - Specification index
- `/docs/guides/PROJECT_INDEX.md` - Complete project index
- `/DEVELOPMENT.md` - Current development status
- `/README.md` - Project overview

### Starting Points
- **New Developer:** Read `/README.md`, then `/DEVELOPMENT.md`
- **Implementing Feature:** Check `/docs/specs/` for relevant spec
- **Project Status:** Read `/docs/reports/SPEC_PROGRESS.md`
- **Architecture:** Read `/docs/specs/01-architecture/ARCHITECTURE.md`

---

**Maintained By:** Development Team
**Updated:** After reorganization
**Next Review:** Start of Phase 1
