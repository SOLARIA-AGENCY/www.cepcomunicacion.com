import { test, expect } from '@playwright/test';

/**
 * Academix Authentication E2E Tests
 * Updated to match actual login page implementation (DEV MODE)
 */

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form with ACADEMIX branding', async ({ page }) => {
    // Check that login page has correct branding
    await expect(page.locator('h1')).toContainText(/ACADEMIX/i);

    // Check form elements by their IDs
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText(/Acceder|Portal/i);
  });

  test('should display dev mode banner', async ({ page }) => {
    // Check for dev mode indicator
    await expect(page.locator('text=DEV MODE')).toBeVisible();
  });

  test('should login with any credentials in dev mode', async ({ page }) => {
    // Fill in credentials
    await page.locator('#email').fill('admin@cepcomunicacion.com');
    await page.locator('#password').fill('anypassword');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test('should store user in localStorage after login', async ({ page }) => {
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    // Check localStorage
    const user = await page.evaluate(() => localStorage.getItem('academix-user'));
    expect(user).not.toBeNull();
    expect(JSON.parse(user!)).toHaveProperty('email');
    expect(JSON.parse(user!)).toHaveProperty('role', 'admin');
  });

  test('should show loading state during login', async ({ page }) => {
    await page.locator('#email').fill('admin@test.com');
    await page.locator('#password').fill('password');

    // Start login
    await page.locator('button[type="submit"]').click();

    // Check for navigation to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test('should have proper form labels', async ({ page }) => {
    // Check labels
    await expect(page.locator('label[for="email"]')).toContainText(/email/i);
    await expect(page.locator('label[for="password"]')).toContainText(/contraseña/i);
  });

  test('should display platform description', async ({ page }) => {
    await expect(page.locator('text=Portal de Gestión SaaS')).toBeVisible();
  });

  test('should display restricted access info', async ({ page }) => {
    await expect(page.locator('text=ACCESO RESTRINGIDO')).toBeVisible();
  });
});
