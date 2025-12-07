# Academix Multitenant Dashboard - E2E Test Suite

## Overview

Comprehensive end-to-end test suite for the Academix Super Admin Dashboard using Playwright.

**Test Results:** 52 tests | 100% pass rate | ~60s execution time

## Test Coverage

### Authentication Tests (`auth.spec.ts`)
| Test | Description |
|------|-------------|
| Login form display | Verifies ACADEMIX branding and form elements |
| DEV MODE banner | Confirms development mode indicator |
| Login functionality | Tests credential bypass in dev mode |
| localStorage persistence | Validates user session storage |
| Form validation | Checks label presence and form structure |
| Platform description | Verifies "Portal de Gestión SaaS" text |
| Restricted access info | Confirms security notice display |

### Dashboard Main Overview (`dashboard.spec.ts`)
| Test | Description |
|------|-------------|
| Mock data indicator | Verifies development mock data banner |
| Global metrics cards | Tests Total Tenants, Activos, En Trial, MRR |
| Tenant count display | Validates tenant statistics |
| Quick action cards | Tests Onboarding, Tickets, Pagos Fallidos |
| Tenants table headers | Verifies Tenant, Plan, Estado, Usuarios, Cursos, MRR |
| Mock tenants display | CEP Formacion, Academia Madrid, Instituto Barcelona |
| Plan badges | Professional, Starter, Enterprise |
| Status badges | Activo, Trial |
| "Nuevo Tenant" button | Tests creation action availability |
| ACADEMIX header | Validates main branding |

### Navigation Tests
| Test | Description |
|------|-------------|
| Navigation items | Dashboard, Tenants, Facturación, Suscripciones, Soporte, Configuración, Estado, Impersonar |
| Route navigation | Tests all 8 navigation routes work correctly |
| Active state | Verifies correct nav item highlighting |

### Page-Specific Tests
- **Tenants Management** - Content display, nav state
- **Facturación** - Billing page content
- **Suscripciones** - Subscriptions page
- **Soporte** - Support page
- **Configuración** - Settings page
- **Estado** - System status page
- **Impersonar** - Impersonation page

### Responsive Design Tests
| Viewport | Resolution |
|----------|------------|
| Mobile | 375x667 |
| Tablet | 768x1024 |
| Desktop | 1920x1080 |

### UI Components Tests
- User email display (admin@academix.com)
- Super Admin badge
- Logout button ("Cerrar Sesión")
- Consistent styling across pages

### Footer Tests
- ACADEMIX branding
- Version number (v1.0.0)
- SOLARIA AGENCY copyright
- System status indicator
- Documentation link
- API link

### Performance Tests
- Dashboard load time < 10 seconds

### Accessibility Tests
- Proper heading hierarchy
- Visible focus indicators
- Keyboard navigation support

## Running Tests

```bash
# Run all tests
pnpm test

# Run with UI mode
pnpm test --ui

# Run specific test file
pnpm test tests/e2e/auth.spec.ts

# Run with specific browser
pnpm test --project=chromium

# Generate HTML report
pnpm test --reporter=html
pnpm exec playwright show-report
```

## Configuration

Tests are configured in `playwright.config.ts`:
- **Base URL:** `http://localhost:3001`
- **Web Server:** Auto-starts `pnpm dev` on port 3001
- **Browser:** Chromium (default)
- **Timeout:** 30 seconds per test
- **Retries:** 0 in dev, 2 in CI

## Test Architecture

```
tests/
├── e2e/
│   ├── auth.spec.ts       # Authentication flow tests (8 tests)
│   └── dashboard.spec.ts  # Dashboard functionality tests (44 tests)
├── README.md              # This documentation
└── playwright.config.ts   # Playwright configuration
```

## Mock Data

Tests verify the following mock tenant data:
- **CEP Formación** - Professional plan, Activo, 12 users, €299/mo
- **Academia Madrid** - Starter plan, Trial, 3 users
- **Instituto Barcelona** - Enterprise plan, Activo, 28 users, €599/mo

## CI/CD Integration

Tests are designed to run in CI environments:
- Headless browser execution
- Automatic retries on failure
- HTML report generation
- Exit code 0 on success

## Maintenance

When updating tests:
1. Run `pnpm test` to verify all pass
2. Remove old compiled `.js` files if TypeScript changes aren't reflected
3. Check `playwright-report/` for failure details
4. Update this README if adding new test categories

---

**Last Updated:** 2025-12-07
**Test Framework:** Playwright 1.49.1
**Total Tests:** 52
**Coverage:** Authentication, Navigation, Dashboard, Footer, Responsive, Performance, Accessibility
