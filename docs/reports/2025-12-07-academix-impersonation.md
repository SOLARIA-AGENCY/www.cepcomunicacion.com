# Academix Dashboard & Impersonator Review (2025-12-07)

**Context:** PROMPT_DE_CORRECCION highlighted that SOLARIA's Academix portal (apps/admin) still serves mock dashboards and cannot impersonate real tenants hosted in Payload (apps/cms). This document captures the current implementation gaps discovered during code review and outlines actionable steps required before real tenants can be listed or impersonated.

## Current Findings

1. **Dashboard uses hardcoded tenant list.**
   - File: `apps/admin/app/dashboard/page.tsx` defines `mockTenants` (lines 16-68) and never performs a fetch.
   - KPIs (MRR, active count, etc.) derive from that mock array, so values never match the database.

2. **Tenants management page also static.**
   - File: `apps/admin/app/dashboard/tenants/page.tsx` embeds an extended `mockTenants` array (lines 26-93) and implements filters purely in-memory.
   - No attempt to read Payload's `tenants` collection or persist create/update operations.

3. **Impersonator dialog is purely cosmetic.**
   - File: `apps/admin/app/dashboard/impersonar/page.tsx` imports `mockTenants`, triggers `setTimeout`, and eventually performs `window.open` to a hardcoded URL (line 84). There is no call to the CMS to request a token/session, no audit trail, and no per-tenant routing.

4. **Authentication bypass disables API access.**
   - Login page (`apps/admin/app/login/page.tsx`) stores a fake user in `localStorage` and never calls Payload (`/api/users/login`).
   - `apps/admin/lib/api.ts` contains a provisional dev-mode branch that returns mock data when `NODE_ENV === 'development'` and therefore never sets `Authorization` headers for subsequent requests.
   - Without a real Payload session cookie or bearer token, every request to `/api/tenants` would yield `401 Unauthorized`.

5. **Missing Tenant subscription fields.**
   - Payload collection `apps/cms/src/collections/Tenants/Tenants.ts` defines basic info (slug, domain, branding, contact, limits) but lacks `plan`, `status`, `mrr`, or impersonation URLs.
   - Academix UI expects those attributes for badges and CTA targets, so the backend schema must be extended before wiring up real data.

6. **No impersonation API or audit log.**
   - Neither apps/cms nor apps/admin expose an endpoint resembling `/api/admin/impersonate`.
   - There is no token minting strategy (JWT, signed URL, etc.), no record kept in `AuditLogs`, and no restrictions per tenant.

## Recommended Implementation Steps

1. **Enable real authentication in Academix.**
   - Replace the dev login bypass with a call to `apiClient.login` and persist the returned Payload token (cookie or Authorization header) for SSR/CSR usage.
   - Update the dashboard layout guard to validate the session via `/api/users/me` before rendering.

2. **Extend Payload schema for SaaS metadata.**
   - Add a `subscription` group to `Tenants` with fields: `plan` (enum starter/professional/enterprise), `status` (active/trial/suspended/cancelled), `mrr`, `trialEndsAt`, plus `adminEmail`, `dashboardUrl`, `payloadUrl`.
   - Generate a database migration so those values persist.

3. **Expose tenants listing endpoint for SOLARIA.**
   - Create a dedicated Next route in `apps/admin/app/api/tenants/route.ts` that proxies to Payload `/api/tenants?depth=0` using the authenticated user's token. Handle errors and return normalized DTOs consumed by the dashboard pages.
   - Update dashboard/tenants/impersonar screens to fetch via React Query or server components instead of `useState(mockTenants)`.

4. **Design impersonation workflow.**
   - CMS side: implement a secure server action or API route that issues a short-lived impersonation token tied to the requested tenant + target user, logging the intent in `AuditLogs`.
   - Admin side: call this endpoint when SOLARIA chooses “Dashboard CMS” or “Payload Admin”, receive redirect URL + token, set cookie (or append query param), then open the tenant instance.
   - Ensure token scope limits accessible collections and expires quickly.

5. **Add automated tests.**
   - Update Playwright specs (`apps/admin/tests/e2e/dashboard.spec.ts`) to run against seeded tenants, asserting real counts and verifying impersonation modals trigger API requests.
   - Add API-level tests for the new `/api/tenants` proxy and impersonation endpoint once implemented.

6. **Document operational steps.**
   - Mirror this review inside `docs/` and update `VERSION_COMPATIBILITY.md` once the schema/token changes land so future agents know how the multi-tenant bridge works.

## Blockers / Dependencies

- Need secure method to obtain a SOLARIA superadmin token for server-side requests (env var or OAuth).
- Database migration for the new tenant fields must be generated and applied before the UI can read/write plans or MRR.
- Payload instance must expose impersonation hooks (either via Payload plugins or custom Express middleware) before the Academix UI can hand off sessions safely.

---
_Last updated: 2025-12-07 by Codex agent._
