import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Check that login page has required elements
    await expect(page.locator('h1')).toContainText(/Iniciar sesión|Login/i);
    await expect(page.getByLabel(/email|correo/i)).toBeVisible();
    await expect(page.getByLabel(/password|contraseña/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar|login|iniciar/i })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click submit without filling fields
    await page.getByRole('button', { name: /entrar|login|iniciar/i }).click();

    // Check for validation messages
    await expect(page.locator('text=/requerido|required/i')).toHaveCount(2);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in wrong credentials
    await page.getByLabel(/email|correo/i).fill('wrong@example.com');
    await page.getByLabel(/password|contraseña/i).fill('wrongpassword');
    await page.getByRole('button', { name: /entrar|login|iniciar/i }).click();

    // Should show error message
    await expect(page.locator('text=/credenciales|invalid|incorrect/i')).toBeVisible({ timeout: 10000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill in correct credentials (from DATABASE_SAMPLE_DATA_REPORT.md)
    await page.getByLabel(/email|correo/i).fill('admin@cepcomunicacion.com');
    await page.getByLabel(/password|contraseña/i).fill('CEP2025Admin!Secure');
    await page.getByRole('button', { name: /entrar|login|iniciar/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Dashboard should show welcome or user info
    await expect(page.locator('text=/admin@cepcomunicacion.com|bienvenido/i')).toBeVisible();
  });

  test('should redirect to dashboard if already logged in', async ({ page, context }) => {
    // Simulate already logged in by setting cookie
    await context.addCookies([{
      name: 'payload-token',
      value: 'dummy-token-for-test',
      domain: 'localhost',
      path: '/',
    }]);

    // Try to access login page
    await page.goto('/login');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.getByLabel(/email|correo/i).fill('admin@cepcomunicacion.com');
    await page.getByLabel(/password|contraseña/i).fill('CEP2025Admin!Secure');
    await page.getByRole('button', { name: /entrar|login|iniciar/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    // Click logout button
    await page.getByRole('button', { name: /cerrar sesión|logout|salir/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // Should not be able to access dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
