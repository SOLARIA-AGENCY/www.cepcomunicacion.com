# Legacy Archive - CEP Comunicación

**Created**: 2025-11-23
**Last Updated**: 2025-12-05
**Purpose**: Archive historical documentation, temporary scripts, and development artifacts

## Archive Statistics

- **Total Archived Files**: 71+ markdown documents
- **Categories**: 6 organized subdirectories
- **Purpose**: Historical reference and learning from development process

## Directory Structure

### `/docs/` - Technical Documentation Archive (71 files)

#### `/docs/audits/` (6 files)
Security, code, and design system audits:
- `AUDIT_HERO_IMAGES.md` - Hero image optimization audit
- `AUDIT_REPORT.md` - General audit reports
- `AUDIT_REPORT_2025-10-26.md` - Dated audit
- `CODE_AUDIT_WEEK4.md` - Weekly code review
- `COMPREHENSIVE_AUDIT_REPORT.md` - Full system audit
- `SECURITY_AUDIT_REPORT_2025-11-05.md` - Security focused

#### `/docs/deployment/` (6 files)
Infrastructure and deployment documentation:
- `BACKEND_DEPLOYMENT_PLAN.md` - Backend strategy
- `DEPLOYMENT_DOCUMENTATION.md` - General deployment docs
- `DEPLOYMENT_GUIDE.md` - Step-by-step guides
- `DEPLOYMENT_HETZNER.md` - Hetzner VPS setup
- `DEPLOYMENT_NETLIFY.md` - Netlify configuration
- `SOLARIA_SERVER_DEPLOYMENT.md` - Server deployment

#### `/docs/architecture/` (7 files)
Architecture decisions and implementation plans:
- `ARCHITECTURE_DECISION_RECORD.md` - ADR collection
- `COURSERUNS_IMPLEMENTATION.md` - Course system design
- `IMPLEMENTATION_COMPLETE.md` - Completion reports
- `IMPLEMENTATION_PRIVATE_COURSES_AREAS.md` - Feature specs
- `STACK_EVALUATION.md` - Technology evaluation
- `STRAPI_MIGRATION_PLAN.md` - CMS migration (deprecated)
- `UPGRADE_PLAN_PAYLOAD_NEXTJS.md` - Payload CMS upgrade

#### `/docs/security/` (3 files)
Security implementation and patterns:
- `PRODUCTION_SECURITY_CHECKLIST.md` - Production hardening
- `SECURITY_IMPLEMENTATION.md` - Security features
- `SECURITY_PATTERNS.md` - Security best practices

#### `/docs/sessions/` (6 files)
Development prompts and session guides:
- `DEVELOPMENT_PROMPT.md` - Development context
- `EMERGENCY_RECOVERY_PROMPT.md` - Recovery procedures
- `LESSONS_LEARNED.md` - Development insights
- `NEXT_SESSION_GUIDE.md` - Session handoff docs
- `PATTERNS_OPTIMIZATION_MEMORY.md` - Optimization patterns
- `PROGRESS.md` - Progress tracking

#### `/docs/` root (30+ files)
Unsorted phase summaries and status reports:
- `PHASE_STATUS.md`, `PHASE1_PROGRESS_SUMMARY.md`
- `DEPLOYMENT_STATUS.md`, `DEPLOYMENT_STATUS_FINAL.md`
- `PROJECT_AUDIT_AND_AGENT_STRATEGY.md`
- `SESSION_SUMMARY_2025-10-23.md`
- `WEEK4_SUMMARY.md`, etc.

### `/cms-mockups/` - Archived CMS Component Prototypes
Early dashboard mockup components (superseded by production components):
- Page prototypes for Cursos, Ciclos, Convocatorias, Sedes
- Original UI explorations before design system standardization

### `/backups/`
HTML backup files created during frontend development iterations

### `/env-files/`
Environment configuration backups and test files

### `/frontend-html-prototypes/`
Static HTML/CSS/JS prototypes used for design exploration

### `/scripts/`
Temporary automation scripts:
- **Python**: Frontend fixes, color corrections, hero image updates
- **Shell**: Deployment scripts, setup automation
- **TypeScript**: Database seeding, user creation, testing utilities

## Why These Files Were Archived

1. **Historical Value**: Document project evolution and decisions made
2. **Learning Reference**: Preserve lessons learned and patterns discovered
3. **Incident Analysis**: Enable post-mortem analysis of issues
4. **Clean Codebase**: Remove clutter from active development area
5. **Zero Technical Debt**: Part of SOLARIA Methodology compliance

## Related Active Documentation

See these files in the project root:
- `CLAUDE.md` - Current project instructions and configuration
- `README.md` - Project overview
- `agents.md` - Agent system documentation

## Incident Documentation

See `.memory/` folder for:
- `learning_log.jsonl` - Structured learning from incidents
- `INCIDENT_2025-11-23_NextJS_Module_Cache.md` - Cache corruption analysis
- `PATTERNS_ANTIPATTERNS.md` - Development patterns

## Restoration

If any archived file is needed:
```bash
# Example: Restore a specific document
cp legacy/docs/audits/[filename] ./docs/

# Example: Restore a script
cp legacy/scripts/[script-name] ./
```

**Note**: Most scripts are single-use and may require updates for current codebase structure.

---

**Archive Maintainer**: Claude Code (SOLARIA AGENCY)
**Last Audit**: 2025-12-05
