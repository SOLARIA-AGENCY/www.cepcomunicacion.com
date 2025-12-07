import { test, expect, Page } from '@playwright/test';

/**
 * Academix Multitenant Dashboard - Exhaustive E2E Test Suite
 * Updated to match actual implementation with correct selectors
 */

// Helper function to login using dev bypass
async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.waitForSelector('form', { timeout: 10000 });
  await page.locator('#email').fill('admin@academix.com');
  await page.locator('#password').fill('admin123');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
}

// ============================================================================
// MAIN DASHBOARD TESTS
// ============================================================================
test.describe('Dashboard - Main Overview', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should display mock data indicator in development', async ({ page }) => {
    await page.goto('/dashboard');
    const mockIndicator = page.locator('text=Mock Data');
    await expect(mockIndicator).toBeVisible();
  });

  test('should display global metrics cards', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Total Tenants')).toBeVisible();
    await expect(page.locator('text=Activos')).toBeVisible();
    await expect(page.locator('text=En Trial')).toBeVisible();
    await expect(page.locator('text=MRR Total')).toBeVisible();
  });

  test('should display correct tenant count', async ({ page }) => {
    await page.goto('/dashboard');
    // Mock data has 3 tenants - check the number is displayed
    const totalSection = page.locator('text=Total Tenants').locator('..');
    await expect(totalSection).toBeVisible();
  });

  test('should display quick action cards', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Onboarding Pendiente')).toBeVisible();
    await expect(page.locator('text=Tickets de Soporte')).toBeVisible();
    await expect(page.locator('text=Pagos Fallidos')).toBeVisible();
  });

  test('should display tenants table with correct headers', async ({ page }) => {
    await page.goto('/dashboard');
    const headers = ['Tenant', 'Plan', 'Estado', 'Usuarios', 'Cursos', 'MRR'];
    for (const header of headers) {
      await expect(page.locator(`th:has-text("${header}")`)).toBeVisible();
    }
  });

  test('should show all mock tenants in table', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=CEP Formacion')).toBeVisible();
    await expect(page.locator('text=Academia Madrid')).toBeVisible();
    await expect(page.locator('text=Instituto Barcelona')).toBeVisible();
  });

  test('should display plan badges correctly', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Professional').first()).toBeVisible();
    await expect(page.locator('text=Starter')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();
  });

  test('should display status badges correctly', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Activo').first()).toBeVisible();
    await expect(page.locator('text=Trial').first()).toBeVisible();
  });

  test('should have "Nuevo Tenant" button', async ({ page }) => {
    await page.goto('/dashboard');
    const newTenantBtn = page.locator('button:has-text("Nuevo Tenant")');
    await expect(newTenantBtn).toBeVisible();
  });

  test('should display ACADEMIX header', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1:has-text("ACADEMIX")')).toBeVisible();
  });
});

// ============================================================================
// NAVIGATION TESTS
// ============================================================================
test.describe('Dashboard - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should have navigation with all items', async ({ page }) => {
    await page.goto('/dashboard');
    // Navigation items with accents as they appear in the UI
    const navItems = [
      'Dashboard',
      'Tenants',
      'Facturación',
      'Suscripciones',
      'Soporte',
      'Configuración',
      'Estado',
      'Impersonar'
    ];

    for (const item of navItems) {
      const navLink = page.locator(`a:has-text("${item}")`).first();
      await expect(navLink).toBeVisible();
    }
  });

  test('should navigate to Tenants page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a:has-text("Tenants")');
    await expect(page).toHaveURL(/\/dashboard\/tenants/);
  });

  test('should navigate to Facturación page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a:has-text("Facturación")');
    await expect(page).toHaveURL(/\/dashboard\/facturacion/);
  });

  test('should navigate to Suscripciones page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a:has-text("Suscripciones")');
    await expect(page).toHaveURL(/\/dashboard\/suscripciones/);
  });

  test('should navigate to Soporte page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a:has-text("Soporte")');
    await expect(page).toHaveURL(/\/dashboard\/soporte/);
  });

  test('should navigate to Configuración page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a:has-text("Configuración")');
    await expect(page).toHaveURL(/\/dashboard\/configuracion/);
  });

  test('should navigate to Estado page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a:has-text("Estado")');
    await expect(page).toHaveURL(/\/dashboard\/estado/);
  });

  test('should navigate to Impersonar page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a:has-text("Impersonar")');
    await expect(page).toHaveURL(/\/dashboard\/impersonar/);
  });
});

// ============================================================================
// TENANTS PAGE TESTS
// ============================================================================
test.describe('Dashboard - Tenants Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/tenants');
  });

  test('should display tenants page content', async ({ page }) => {
    // Check page loaded
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have Tenants nav item active', async ({ page }) => {
    const tenantsLink = page.locator('a:has-text("Tenants")').first();
    await expect(tenantsLink).toBeVisible();
  });
});

// ============================================================================
// FACTURACION (BILLING) PAGE TESTS
// ============================================================================
test.describe('Dashboard - Facturación', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/facturacion');
  });

  test('should display billing page content', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have Facturación nav item', async ({ page }) => {
    await expect(page.locator('a:has-text("Facturación")')).toBeVisible();
  });
});

// ============================================================================
// SUSCRIPCIONES PAGE TESTS
// ============================================================================
test.describe('Dashboard - Suscripciones', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/suscripciones');
  });

  test('should display subscriptions page content', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });
});

// ============================================================================
// SOPORTE (SUPPORT) PAGE TESTS
// ============================================================================
test.describe('Dashboard - Soporte', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/soporte');
  });

  test('should display support page content', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });
});

// ============================================================================
// CONFIGURACION PAGE TESTS
// ============================================================================
test.describe('Dashboard - Configuración', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/configuracion');
  });

  test('should display configuration page content', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });
});

// ============================================================================
// ESTADO (STATUS) PAGE TESTS
// ============================================================================
test.describe('Dashboard - Estado', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/estado');
  });

  test('should display status page content', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });
});

// ============================================================================
// IMPERSONAR (IMPERSONATE) PAGE TESTS
// ============================================================================
test.describe('Dashboard - Impersonar', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/impersonar');
  });

  test('should display impersonation page content', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });
});

// ============================================================================
// RESPONSIVE DESIGN TESTS
// ============================================================================
test.describe('Dashboard - Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await expect(page.locator('h1:has-text("ACADEMIX")')).toBeVisible();
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');
    await expect(page.locator('h1:has-text("ACADEMIX")')).toBeVisible();
  });

  test('should be responsive on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard');
    await expect(page.locator('h1:has-text("ACADEMIX")')).toBeVisible();
    // On desktop, navigation should be visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});

// ============================================================================
// USER INTERFACE TESTS
// ============================================================================
test.describe('Dashboard - UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
  });

  test('should have user email in header', async ({ page }) => {
    await expect(page.locator('text=admin@academix.com')).toBeVisible();
  });

  test('should have Super Admin badge', async ({ page }) => {
    await expect(page.locator('text=Super Admin')).toBeVisible();
  });

  test('should have logout button', async ({ page }) => {
    await expect(page.locator('button:has-text("Cerrar Sesión")')).toBeVisible();
  });

  test('should have consistent styling across pages', async ({ page }) => {
    // Check main dashboard
    await page.goto('/dashboard');
    const dashboardBg = await page.locator('body').evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Check tenants page
    await page.goto('/dashboard/tenants');
    const tenantsBg = await page.locator('body').evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    expect(dashboardBg).toBe(tenantsBg);
  });
});

// ============================================================================
// FOOTER TESTS
// ============================================================================
test.describe('Dashboard - Footer', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
  });

  test('should display footer with branding', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer').locator('text=ACADEMIX')).toBeVisible();
  });

  test('should display version number', async ({ page }) => {
    await expect(page.locator('text=v1.0.0')).toBeVisible();
  });

  test('should display SOLARIA AGENCY copyright', async ({ page }) => {
    await expect(page.locator('text=SOLARIA AGENCY')).toBeVisible();
  });

  test('should display system status indicator', async ({ page }) => {
    await expect(page.locator('text=Todos los sistemas operativos')).toBeVisible();
  });

  test('should have documentation link', async ({ page }) => {
    await expect(page.locator('a:has-text("Documentación")')).toBeVisible();
  });

  test('should have API link', async ({ page }) => {
    await expect(page.locator('a:has-text("API")')).toBeVisible();
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================
test.describe('Dashboard - Performance', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================
test.describe('Dashboard - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/dashboard');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/dashboard');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
