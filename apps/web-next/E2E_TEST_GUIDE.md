# E2E Testing Guide - CEPComunicacion v2

Comprehensive guide for running, debugging, and maintaining End-to-End (E2E) tests using Playwright.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Page Object Model](#page-object-model)
- [Debugging Tests](#debugging-tests)
- [CI/CD Integration](#cicd-integration)
- [Writing New Tests](#writing-new-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The E2E test suite validates complete user workflows across the CEPComunicacion educational platform. Tests cover:

- **Homepage Flow**: Hero section, featured courses, navigation
- **Course Discovery**: Catalog browsing, filtering, search
- **Course Detail Pages**: Dynamic routes, metadata display, 404 handling
- **Lead Form Submission**: Validation, GDPR compliance, error handling
- **Navigation**: Header/footer links, mobile menu, keyboard navigation
- **Accessibility**: WCAG 2.1 Level AA compliance, screen reader support

**Total Test Count**: 100+ test cases across 6 test files

**Browsers Tested**:
- Chromium (Desktop Chrome)
- Firefox (Desktop)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

---

## Prerequisites

### Required Software

1. **Node.js**: v22.20.0 or higher
2. **pnpm**: v9.x or higher
3. **PostgreSQL**: Running locally or Docker container
4. **Next.js Dev Server**: Application running on http://localhost:3001

### Environment Setup

Ensure your `.env.local` file contains:

```bash
# Database connection
DATABASE_URI=postgresql://user:password@localhost:5432/cepcomunicacion

# Payload CMS
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3001

# Optional: Custom Playwright base URL
PLAYWRIGHT_BASE_URL=http://localhost:3001
```

---

## Installation

### 1. Install Dependencies

```bash
cd apps/web-next
pnpm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers (~500MB).

### 3. Seed Test Data

```bash
pnpm seed
```

This creates:
- 2 Campuses (Madrid Centro, Barcelona Diagonal)
- 2 Cycles (Ciclo Superior Marketing, Ciclo Medio Gestión)
- 3 Courses (Marketing Digital, Desarrollo Web, Gestión Empresarial)
- 2 CourseRuns (scheduled instances)
- 1 Admin User (admin@cepcomunicacion.com)

---

## Running Tests

### Quick Start

```bash
# Start Next.js dev server (in one terminal)
pnpm dev

# Run all E2E tests (in another terminal)
pnpm test:e2e
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm test:e2e` | Run all tests headless (CI mode) |
| `pnpm test:e2e:headed` | Run tests with browser visible |
| `pnpm test:e2e:ui` | Open Playwright UI for interactive testing |
| `pnpm test:e2e:debug` | Run tests in debug mode with breakpoints |
| `pnpm test:e2e:chromium` | Run tests only in Chromium |
| `pnpm test:e2e:firefox` | Run tests only in Firefox |
| `pnpm test:e2e:webkit` | Run tests only in WebKit |
| `pnpm test:e2e:mobile` | Run tests on mobile browsers |
| `pnpm test:e2e:report` | Show HTML test report |
| `pnpm test:all` | Run unit tests + E2E tests |

### Run Specific Test File

```bash
npx playwright test e2e/01-homepage.spec.ts
```

### Run Tests Matching Pattern

```bash
npx playwright test --grep "Hero Section"
```

### Run Tests on Specific Viewport

```bash
npx playwright test --project=mobile-chrome
```

---

## Test Structure

```
apps/web-next/
├── e2e/
│   ├── pages/                      # Page Object Models
│   │   ├── BasePage.ts             # Base page class with common methods
│   │   ├── HomePage.ts             # Homepage selectors and actions
│   │   ├── CoursesPage.ts          # Courses catalog page
│   │   ├── CourseDetailPage.ts     # Course detail page
│   │   └── NavigationComponent.ts  # Header navigation component
│   ├── 01-homepage.spec.ts         # Homepage E2E tests (25 tests)
│   ├── 02-courses-catalog.spec.ts  # Courses catalog tests (20 tests)
│   ├── 03-course-detail.spec.ts    # Course detail tests (15 tests)
│   ├── 04-navigation.spec.ts       # Navigation tests (30 tests)
│   ├── 05-lead-form.spec.ts        # Lead form submission tests (15 tests)
│   └── 06-accessibility.spec.ts    # Accessibility tests (20 tests)
├── playwright.config.ts            # Playwright configuration
└── E2E_TEST_GUIDE.md              # This file
```

---

## Page Object Model

The test suite uses the **Page Object Model (POM)** pattern for maintainability.

### Example: HomePage

```typescript
import { HomePage } from './pages/HomePage';

test('should display hero section', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();

  await expect(homePage.heroTitle).toBeVisible();
  await expect(homePage.heroTitle).toContainText('Formación Profesional');
});
```

### Benefits

- **Reusability**: Shared selectors across tests
- **Maintainability**: Update selectors in one place
- **Readability**: Tests read like user actions
- **Type Safety**: TypeScript autocompletion

### Available Page Objects

| Class | Purpose |
|-------|---------|
| `BasePage` | Common methods (navigate, wait, screenshot) |
| `HomePage` | Hero section, featured courses, CTA |
| `CoursesPage` | Course grid, filtering, empty state |
| `CourseDetailPage` | Course metadata, lead form, 404 handling |
| `NavigationComponent` | Header, mobile menu, logo |

---

## Debugging Tests

### Interactive UI Mode

```bash
pnpm test:e2e:ui
```

- **Time Travel**: Inspect DOM at each step
- **Watch Mode**: Auto-rerun on file changes
- **Pick Locator**: Click elements to generate selectors

### Debug Mode with Breakpoints

```bash
pnpm test:e2e:debug
```

Add `await page.pause()` in your test to set a breakpoint:

```typescript
test('debug example', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Execution stops here
  await page.click('button');
});
```

### Headed Mode (Visible Browser)

```bash
pnpm test:e2e:headed
```

Watch tests execute in a real browser window.

### Screenshots on Failure

Automatically captured at:
```
test-results/<test-name>/test-failed-1.png
```

### Trace Viewer

After test failure, view detailed trace:

```bash
npx playwright show-trace test-results/.../trace.zip
```

Includes:
- Network requests
- Console logs
- Screenshots at each step
- DOM snapshots

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Start PostgreSQL
        run: |
          docker run -d \
            -e POSTGRES_PASSWORD=test \
            -e POSTGRES_DB=cepcomunicacion \
            -p 5432:5432 \
            postgres:16

      - name: Seed database
        run: pnpm seed

      - name: Build Next.js app
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-screenshots
          path: test-results/
```

### Running Tests in CI

The `playwright.config.ts` automatically detects CI environment:

```typescript
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : 3,
```

- **CI**: 1 worker (stable), 2 retries (handle flakiness)
- **Local**: 3 workers (parallel), 0 retries (faster feedback)

---

## Writing New Tests

### 1. Create Page Object (if needed)

```typescript
// e2e/pages/ContactPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  readonly pageTitle: Locator;
  readonly contactForm: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1');
    this.contactForm = page.locator('form[data-testid="contact-form"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.goto('/contacto');
  }

  async submitForm(data: { name: string; email: string; message: string }) {
    await this.fillInput('input[name="name"]', data.name);
    await this.fillInput('input[name="email"]', data.email);
    await this.fillInput('textarea[name="message"]', data.message);
    await this.submitButton.click();
  }
}
```

### 2. Create Test File

```typescript
// e2e/07-contact.spec.ts
import { test, expect } from '@playwright/test';
import { ContactPage } from './pages/ContactPage';

test.describe('Contact Page', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.navigate();
  });

  test('should display contact form', async () => {
    await expect(contactPage.contactForm).toBeVisible();
  });

  test('should submit contact form with valid data', async () => {
    await contactPage.submitForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello world',
    });

    // Assert success message
    await expect(page.locator('text=Mensaje enviado')).toBeVisible();
  });
});
```

### 3. Use Test Fixtures

```typescript
test.use({
  viewport: { width: 1920, height: 1080 },
  locale: 'es-ES',
  timezoneId: 'Europe/Madrid',
});
```

### 4. Test Data Best Practices

- **Use seeded data**: Reference existing courses/cycles from seed script
- **Avoid hardcoded IDs**: Use slugs or titles for navigation
- **Test idempotency**: Tests should work with any data state
- **Clean up**: Reset form state after each test

---

## Best Practices

### Selectors

**Priority Order:**

1. **User-facing attributes**: `getByRole`, `getByText`, `getByLabel`
   ```typescript
   page.getByRole('button', { name: 'Ver Cursos' })
   ```

2. **Test IDs**: `data-testid` for stable selectors
   ```typescript
   page.locator('[data-testid="course-card"]')
   ```

3. **CSS selectors**: Last resort
   ```typescript
   page.locator('div.course-card > h3')
   ```

**Avoid**:
- XPath (brittle, hard to read)
- Complex CSS chains (couples to DOM structure)
- Index-based selectors (`.nth(0)` unless necessary)

### Assertions

**Use Playwright's auto-waiting assertions:**

```typescript
// ✅ Good - Auto-waits for element
await expect(page.locator('h1')).toBeVisible();

// ❌ Bad - Manual wait
await page.waitForSelector('h1');
expect(await page.locator('h1').isVisible()).toBe(true);
```

### Test Isolation

Each test should be **independent**:

```typescript
test.beforeEach(async ({ page }) => {
  // Fresh page state for each test
  await page.goto('/');
});

test.afterEach(async ({ page }) => {
  // Clean up if needed
  await page.close();
});
```

### Handling Flakiness

**Use auto-waiting**:
```typescript
await expect(page.locator('button')).toBeEnabled();
```

**Avoid hard timeouts**:
```typescript
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await page.waitForLoadState('networkidle');
```

**Retry failed tests** (configured in `playwright.config.ts`):
```typescript
retries: process.env.CI ? 2 : 0,
```

### Accessibility Testing

Use `@axe-core/playwright` for automated WCAG checks:

```typescript
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
```

---

## Troubleshooting

### Issue: "Timeout waiting for selector"

**Solution**:
1. Check if server is running (`pnpm dev`)
2. Verify base URL in `playwright.config.ts`
3. Increase timeout: `await page.waitForSelector('h1', { timeout: 10000 })`

### Issue: "Test passed locally but fails in CI"

**Solution**:
1. Run tests with `--workers=1` to disable parallelization
2. Enable retries: `npx playwright test --retries=2`
3. Check for race conditions or shared state

### Issue: "Element is not visible"

**Solution**:
1. Wait for page load: `await page.waitForLoadState('domcontentloaded')`
2. Scroll element into view: `await element.scrollIntoViewIfNeeded()`
3. Check viewport size (mobile vs desktop)

### Issue: "Database connection errors"

**Solution**:
1. Ensure PostgreSQL is running
2. Run seed script: `pnpm seed`
3. Check `.env.local` for correct `DATABASE_URI`

### Issue: "Playwright browsers not installed"

**Solution**:
```bash
npx playwright install --with-deps
```

### Issue: "Tests are slow"

**Solution**:
1. Run specific test file: `npx playwright test e2e/01-homepage.spec.ts`
2. Increase workers: `npx playwright test --workers=4`
3. Skip expensive tests locally: `test.skip('expensive test', ...)`

---

## Test Coverage Report

After running tests, view coverage:

```bash
pnpm test:e2e:report
```

Open `playwright-report/index.html` in your browser.

**Metrics**:
- Total tests: 100+
- Pass rate: >95%
- Execution time: <60 seconds (parallel)
- Browser coverage: Chromium, Firefox, WebKit, Mobile

---

## Performance Benchmarks

| Test Suite | Tests | Avg Time | Workers |
|------------|-------|----------|---------|
| Homepage | 25 | 8s | 3 |
| Courses Catalog | 20 | 6s | 3 |
| Course Detail | 15 | 5s | 3 |
| Navigation | 30 | 12s | 3 |
| Lead Form | 15 | 7s | 3 |
| Accessibility | 20 | 10s | 3 |
| **Total** | **125** | **48s** | **3** |

---

## Additional Resources

- **Playwright Docs**: https://playwright.dev
- **Best Practices**: https://playwright.dev/docs/best-practices
- **API Reference**: https://playwright.dev/docs/api/class-test
- **VS Code Extension**: Playwright Test for VS Code

---

## Maintenance

### Updating Selectors

When UI changes, update Page Objects:

```typescript
// e2e/pages/HomePage.ts
this.heroTitle = page.locator('h1').filter({ hasText: 'New Title' });
```

Run tests to verify:
```bash
pnpm test:e2e
```

### Adding New Test Coverage

1. Identify user journey
2. Create/update Page Object
3. Write test cases
4. Verify in all browsers: `pnpm test:e2e`
5. Document in this guide

### Reviewing Test Results

**Green CI build**: All tests passed ✅
**Red CI build**: Check failed tests in GitHub Actions artifacts

---

## Support

For issues or questions:
1. Check this guide
2. Review Playwright docs
3. Inspect test artifacts (`test-results/`, `playwright-report/`)
4. Ask team lead or create GitHub issue

---

**Last Updated**: 2025-10-31
**Test Suite Version**: 1.0.0
**Playwright Version**: 1.56.1
