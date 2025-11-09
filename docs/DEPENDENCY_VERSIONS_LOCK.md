# Dependency Versions Lock - CEPComunicacion v2

**Last Updated:** 2025-11-09
**Status:** ✅ Production Locked
**Purpose:** Single source of truth for all project dependencies

---

## Critical Context

### Historical Issues

1. **Next.js 15.2.3 → Payload 3.62.1 Incompatibility** (ADR-002)
   - Issue: Admin UI crashed with "Cannot destructure property 'config'"
   - Root cause: Next.js 15.2.3 + React 19.2.0 + Payload RSC bug
   - Resolution: Custom admin dashboard (apps/admin)

2. **Drizzle Kit + Turbopack Incompatibility** (Ongoing)
   - Issue: `esbuild` + `drizzle-kit` fail to parse in Turbopack
   - Resolution: Use `--webpack` flag for production builds
   - Config: `next.config.ts` includes webpack override for `NODE_ENV=production`

3. **Version Stability Rule**
   - ❌ **NEVER upgrade dependencies without testing locally first**
   - ❌ **NEVER change versions in Dockerfiles directly**
   - ✅ **ALWAYS update package.json first, test, then deploy**

---

## Locked Versions (apps/web-next - Frontend)

### Core Framework

```json
{
  "next": "^16.0.1",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.7.2"
}
```

**Notes:**
- Next.js 16 requires `--webpack` flag (Drizzle Kit incompatibility)
- React 19 is stable but requires careful usage with Server Components
- TypeScript 5.7.2 is latest stable

### Payload CMS Integration

```json
{
  "@payloadcms/db-postgres": "^3.61.1",
  "@payloadcms/next": "^3.61.1",
  "@payloadcms/richtext-slate": "^3.61.1",
  "payload": "^3.61.1"
}
```

**Notes:**
- Payload 3.61.1 used for **API only** (not admin UI)
- Admin UI replaced with custom Next.js dashboard (`apps/admin`)
- All Payload versions must match exactly (3.61.1)

### Styling & UI

```json
{
  "tailwindcss": "^3.4.18",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.4.49",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.4"
}
```

**Notes:**
- TailwindCSS 3.4.18 (not v4 alpha)
- PostCSS 8.4.x required by Tailwind

### Testing

```json
{
  "@playwright/test": "^1.56.1",
  "vitest": "^2.1.8",
  "@testing-library/react": "^16.1.0",
  "@testing-library/jest-dom": "^6.6.3"
}
```

---

## Locked Versions (apps/admin - Admin Dashboard)

### Core Framework

```json
{
  "next": "15.2.3",
  "react": "19.1.1",
  "react-dom": "19.1.1",
  "typescript": "5.9.3"
}
```

**Notes:**
- Admin dashboard uses **Next.js 15.2.3** (NOT 16)
- Separate from frontend to avoid Payload compatibility issues
- Uses **TailwindCSS 4.1.15** (different from web-next)

### Payload API Client

```json
{
  "None - Uses REST API directly with fetch()"
}
```

**Notes:**
- Admin dashboard does NOT use `@payloadcms/*` packages
- Communicates with CMS via REST API (`http://cms:3000/api`)
- JWT token-based authentication

---

## Locked Versions (apps/cms - Payload CMS Backend)

### Core Framework

```json
{
  "payload": "^3.62.1",
  "next": "^15.2.3",
  "react": "^19.1.1",
  "react-dom": "^19.1.1"
}
```

**Notes:**
- CMS uses Payload 3.62.1 (latest)
- Next.js 15.2.3 required by Payload
- Admin UI disabled (custom dashboard used instead)

### Database

```json
{
  "@payloadcms/db-postgres": "^3.62.1",
  "pg": "^8.11.3",
  "drizzle-orm": "^0.31.2",
  "drizzle-kit": "^0.22.7"
}
```

**Notes:**
- PostgreSQL adapter with Drizzle ORM
- Drizzle Kit version locked (compatibility issues with newer versions)

### Rich Text

```json
{
  "@payloadcms/richtext-slate": "^3.62.1"
}
```

**Notes:**
- Slate editor (not Lexical) for better stability
- Version must match Payload exactly

---

## Build Commands & Flags

### Frontend (apps/web-next)

```bash
# Development (uses Turbopack by default)
pnpm dev

# Production build (MUST use webpack)
pnpm exec next build --webpack

# Why --webpack?
# - Drizzle Kit + esbuild + Turbopack incompatibility
# - Configured in next.config.ts with webpack override
```

**Dockerfile Command:**
```dockerfile
RUN pnpm exec next build --webpack
```

### Admin Dashboard (apps/admin)

```bash
# Development
pnpm dev

# Production build (TailwindCSS 4.x CLI)
pnpm run build  # Uses: next build (Turbopack works here)
```

**Dockerfile Command:**
```dockerfile
RUN pnpm run build  # No --webpack needed
```

### CMS Backend (apps/cms)

```bash
# Development
pnpm dev

# Production build
pnpm run build  # Uses: payload build && next build
```

---

## Version Upgrade Policy

### ⛔ Never Upgrade Without Testing

1. **Test locally first**
   - Update `package.json`
   - Run `pnpm install`
   - Run `pnpm run build`
   - Run tests: `pnpm test`
   - Test in Docker: `docker compose build --no-cache`

2. **Document the change**
   - Update this file (DEPENDENCY_VERSIONS_LOCK.md)
   - Create ADR if major version change
   - Note incompatibilities in `KNOWN_ISSUES.md`

3. **Deploy cautiously**
   - Deploy to staging first
   - Monitor logs for 24 hours
   - Verify all features work
   - Then deploy to production

### ✅ Safe to Upgrade (Patch Versions)

These can be upgraded with caution:

- **Patch versions** of locked dependencies (e.g., `3.61.1` → `3.61.2`)
- **Dev dependencies** that don't affect build (e.g., ESLint, Prettier)
- **Testing libraries** (after running test suite)

### ⚠️ Requires Testing (Minor Versions)

These require local testing first:

- **Minor versions** of core frameworks (e.g., `16.0.1` → `16.1.0`)
- **TailwindCSS** updates (can break styles)
- **TypeScript** updates (can introduce new type errors)
- **Payload CMS** updates (API changes)

### 🚨 Requires ADR (Major Versions)

These require Architecture Decision Record:

- **Next.js major versions** (e.g., `16.x` → `17.x`)
- **React major versions** (e.g., `19.x` → `20.x`)
- **Payload CMS major versions** (e.g., `3.x` → `4.x`)
- **TailwindCSS major versions** (e.g., `3.x` → `4.x`)

---

## Known Incompatibilities

### 1. Next.js 16 + Drizzle Kit + Turbopack

**Problem:**
```
Unknown module type: @esbuild/linux-x64/README.md
Reading source code for parsing failed: invalid utf-8 sequence
```

**Solution:**
Use `--webpack` flag for production builds

**Config:**
```ts
// next.config.ts
const nextConfig: NextConfig = {
  turbopack: {}, // Empty config to silence warning
  ...(process.env.NODE_ENV === 'production' && {
    webpack: (config) => {
      return config;
    },
  }),
};
```

**Build Command:**
```bash
pnpm exec next build --webpack
```

### 2. Payload 3.62.1 + Next.js 15.2.3 Admin UI

**Problem:**
```
TypeError: Cannot destructure property 'config' of 'G(...)' as it is undefined
```

**Solution:**
Custom admin dashboard (`apps/admin`) consuming Payload REST API

**Status:** Permanent workaround until Payload 4.x (see ADR-002)

### 3. TailwindCSS 4.x + Next.js 16

**Problem:**
- Admin dashboard uses TailwindCSS 4.1.15 (CSS-first config)
- Frontend uses TailwindCSS 3.4.18 (JS config)

**Solution:**
Keep separate versions per app (monorepo allows this)

**Reason:**
- TailwindCSS 4.x is alpha, breaking changes expected
- Frontend (public-facing) needs stability
- Admin (internal) can use cutting-edge

---

## Dependency Audit Log

### 2025-11-09: Version Lock Documentation

**Actions:**
- Documented current versions across all apps
- Added build flag requirements (`--webpack`)
- Established upgrade policy
- Created known incompatibilities section

**Reason:**
- Multiple version conflicts during deployment
- Need single source of truth
- Prevent accidental upgrades

**Modified By:** Claude (AI Assistant) + CTO Review

---

### 2025-11-04: Custom Admin Dashboard (ADR-002)

**Actions:**
- Created `apps/admin` with Next.js 15.2.3
- Removed dependency on Payload admin UI
- Locked admin to separate version set

**Reason:**
- Payload 3.62.1 admin UI broken with Next.js 15.2.3

**Modified By:** Development Team

---

### 2025-10-23: Strapi → Payload Migration Cancelled

**Actions:**
- Reverted to Payload CMS
- Locked Payload version to 3.61.1

**Reason:**
- Strapi 4.x TypeScript support insufficient
- Payload CMS better monorepo integration

**Modified By:** CTO Decision

---

## Quick Reference

### Check Versions

```bash
# Frontend
cd apps/web-next && cat package.json | grep -A 5 '"dependencies"'

# Admin
cd apps/admin && cat package.json | grep -A 5 '"dependencies"'

# CMS
cd apps/cms && cat package.json | grep -A 5 '"dependencies"'
```

### Update Lockfiles

```bash
# After changing package.json
pnpm install --frozen-lockfile=false

# Verify no breaking changes
pnpm run build
pnpm test
```

### Verify Build Flags

```bash
# Frontend (MUST use --webpack)
cd apps/web-next
pnpm exec next build --webpack

# Admin (can use default)
cd apps/admin
pnpm run build
```

---

## Emergency Rollback

If deployment fails due to version issues:

```bash
# 1. SSH to server
ssh root@46.62.222.138

# 2. Check current image
cd /var/www/cepcomunicacion
docker images | grep cepcomunicacion-frontend

# 3. Rollback to previous image
docker tag cepcomunicacion-frontend:previous cepcomunicacion-frontend:latest
docker compose up -d frontend

# 4. Verify
curl -I http://46.62.222.138/
```

---

## Contacts

- **Version Questions:** Check this file first
- **Upgrade Requests:** Create issue with testing results
- **Emergency Rollback:** Contact CTO immediately

---

**Remember:**
- ✅ This file is the SSOT (Single Source of Truth)
- ✅ Update this file BEFORE changing versions
- ✅ Test locally BEFORE deploying
- ⛔ NEVER upgrade in production without staging test

---

**End of Document**
