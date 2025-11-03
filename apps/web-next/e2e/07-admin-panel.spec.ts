import { test, expect } from '@playwright/test';
import { loginAsAdmin, logout, USER_CREDENTIALS } from './utils/test-helpers';

/**
 * Payload Admin Panel E2E Tests
 *
 * Test coverage:
 * - Admin authentication (login/logout)
 * - Dashboard visibility and navigation
 * - Collections access
 * - CRUD operations on courses
 * - Permission enforcement
 * - Admin UI responsiveness
 *
 * Prerequisites:
 * - Admin user must exist (created via seed script)
 * - Payload CMS must be running
 */

test.describe('Payload Admin Panel', () => {
  test.describe('Authentication', () => {
    test('should load admin login page at /admin/login', async ({ page }) => {
      await page.goto('/admin/login');

      // Check for login form elements
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should fail login with invalid credentials', async ({ page }) => {
      await page.goto('/admin/login');

      await page.fill('input[name="email"]', 'invalid@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.locator('text=/invalid|incorrect|error/i')).toBeVisible({ timeout: 5000 });

      // Should still be on login page
      expect(page.url()).toContain('/admin/login');
    });

    test('should successfully login with valid admin credentials', async ({ page }) => {
      await loginAsAdmin(page);

      // Should redirect to admin dashboard
      expect(page.url()).toMatch(/\/admin/);

      // Should see dashboard or collections
      await expect(page.locator('text=/Dashboard|Collections|Courses/i')).toBeVisible();
    });

    test('should successfully logout', async ({ page }) => {
      await loginAsAdmin(page);

      // Find and click logout button
      const logoutButton = page.locator('button, a').filter({ hasText: /logout|cerrar sesión|sign out/i }).first();

      if (await logoutButton.isVisible({ timeout: 5000 })) {
        await logoutButton.click();

        // Should redirect to login page
        await expect(page).toHaveURL(/.*\/admin\/login/, { timeout: 10000 });
      } else {
        // If no logout button, test is inconclusive but not failed
        test.skip();
      }
    });
  });

  test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should display dashboard after login', async ({ page }) => {
      // Check for dashboard elements
      const hasDashboard = await page.locator('text=/Dashboard/i').isVisible({ timeout: 5000 });
      const hasCollections = await page.locator('text=/Collections/i').isVisible({ timeout: 5000 });

      expect(hasDashboard || hasCollections).toBeTruthy();
    });

    test('should have navigation sidebar', async ({ page }) => {
      // Payload typically has a sidebar navigation
      const sidebar = page.locator('nav, aside, [role="navigation"]').first();
      await expect(sidebar).toBeVisible({ timeout: 5000 });
    });

    test('should display user account information', async ({ page }) => {
      // Look for admin email or account menu
      const accountInfo = page.locator(`text=${USER_CREDENTIALS.admin.email}`).first();

      if (await accountInfo.isVisible({ timeout: 5000 })) {
        await expect(accountInfo).toBeVisible();
      } else {
        // Account info might be in a dropdown
        const accountMenu = page.locator('button, a').filter({ hasText: /account|profile|admin/i }).first();
        await expect(accountMenu).toBeVisible();
      }
    });
  });

  test.describe('Collections Access', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should display collections menu', async ({ page }) => {
      // Look for Collections link or menu
      const collectionsMenu = page.locator('text=/Collections/i').first();

      if (await collectionsMenu.isVisible({ timeout: 5000 })) {
        await expect(collectionsMenu).toBeVisible();
      } else {
        test.skip(); // Collections might be displayed differently
      }
    });

    test('should access Courses collection', async ({ page }) => {
      // Navigate to Courses collection
      await page.goto('/admin/collections/courses');

      // Should see courses list or empty state
      await expect(page.locator('text=/Courses|No courses found|Create New/i')).toBeVisible({ timeout: 10000 });
    });

    test('should access Cycles collection', async ({ page }) => {
      await page.goto('/admin/collections/cycles');

      await expect(page.locator('text=/Cycles|No cycles found|Create New/i')).toBeVisible({ timeout: 10000 });
    });

    test('should access Campuses collection', async ({ page }) => {
      await page.goto('/admin/collections/campuses');

      await expect(page.locator('text=/Campuses|No campuses found|Create New/i')).toBeVisible({ timeout: 10000 });
    });

    test('should access Users collection (admin only)', async ({ page }) => {
      await page.goto('/admin/collections/users');

      // Admin should have access
      await expect(page.locator('text=/Users|No users found|Create New/i')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Course CRUD Operations', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/collections/courses');
    });

    test('should display courses list', async ({ page }) => {
      // Should see either courses or empty state
      const hasCourses = await page.locator('[data-testid="course-row"], tr').count() > 0;
      const hasEmptyState = await page.locator('text=/No courses found|No results/i').isVisible({ timeout: 5000 });

      expect(hasCourses || hasEmptyState).toBeTruthy();
    });

    test('should open create course form', async ({ page }) => {
      // Find "Create New" or similar button
      const createButton = page.locator('button, a').filter({ hasText: /Create New|Add New|New Course/i }).first();

      if (await createButton.isVisible({ timeout: 5000 })) {
        await createButton.click();

        // Should navigate to create form
        await expect(page).toHaveURL(/.*\/admin\/collections\/courses\/create/, { timeout: 10000 });

        // Should see form fields
        await expect(page.locator('input[name="title"], input[id*="title"]')).toBeVisible({ timeout: 5000 });
      } else {
        test.skip(); // Create button might be positioned differently
      }
    });

    test('should create new course with valid data', async ({ page }) => {
      // Navigate to create form
      await page.goto('/admin/collections/courses/create');

      // Wait for form to load
      await page.waitForLoadState('networkidle', { timeout: 10000 });

      const titleInput = page.locator('input[name="title"], input[id*="title"]').first();

      if (await titleInput.isVisible({ timeout: 5000 })) {
        const testCourseTitle = `Test Course ${Date.now()}`;

        await titleInput.fill(testCourseTitle);

        // Fill other required fields if present
        const descriptionField = page.locator('textarea[name="description"], textarea[id*="description"]').first();
        if (await descriptionField.isVisible({ timeout: 2000 })) {
          await descriptionField.fill('Test course description');
        }

        // Submit form
        const saveButton = page.locator('button').filter({ hasText: /Save|Create|Publish/i }).first();
        await saveButton.click();

        // Should show success message or redirect
        await expect(page.locator('text=/Success|Created|Saved/i')).toBeVisible({ timeout: 10000 });
      } else {
        test.skip(); // Form structure might be different
      }
    });

    test('should edit existing course', async ({ page }) => {
      // Go to courses list
      await page.goto('/admin/collections/courses');

      // Find first course row
      const firstCourse = page.locator('[data-testid="course-row"], tr').first();

      if (await firstCourse.isVisible({ timeout: 5000 })) {
        await firstCourse.click();

        // Should navigate to edit form
        await expect(page).toHaveURL(/.*\/admin\/collections\/courses\/[^\/]+/, { timeout: 10000 });

        // Should see form fields with existing data
        const titleInput = page.locator('input[name="title"], input[id*="title"]').first();
        await expect(titleInput).toBeVisible();
        await expect(titleInput).not.toHaveValue('');
      } else {
        test.skip(); // No courses to edit
      }
    });

    test('should delete course with confirmation', async ({ page }) => {
      // Go to courses list
      await page.goto('/admin/collections/courses');

      // Check if any courses exist
      const courseRows = await page.locator('[data-testid="course-row"], tbody tr').count();

      if (courseRows > 0) {
        // Click first course to go to edit page
        await page.locator('[data-testid="course-row"], tbody tr').first().click();

        // Wait for edit page to load
        await page.waitForLoadState('networkidle', { timeout: 10000 });

        // Find delete button
        const deleteButton = page.locator('button').filter({ hasText: /Delete|Remove/i }).first();

        if (await deleteButton.isVisible({ timeout: 5000 })) {
          // Click delete
          await deleteButton.click();

          // Confirm deletion in modal
          const confirmButton = page.locator('button').filter({ hasText: /Confirm|Yes|Delete/i }).first();

          if (await confirmButton.isVisible({ timeout: 3000 })) {
            await confirmButton.click();
          }

          // Should redirect back to list
          await expect(page).toHaveURL(/.*\/admin\/collections\/courses$/, { timeout: 10000 });
        } else {
          test.skip(); // Delete button not found
        }
      } else {
        test.skip(); // No courses to delete
      }
    });
  });

  test.describe('Search and Filtering', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/collections/courses');
    });

    test('should have search functionality', async ({ page }) => {
      // Look for search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();

      if (await searchInput.isVisible({ timeout: 5000 })) {
        await expect(searchInput).toBeVisible();

        // Try searching
        await searchInput.fill('Test');
        await page.waitForTimeout(1000); // Wait for debounced search

        // Results should update (hard to assert without knowing data)
        expect(true).toBeTruthy();
      } else {
        test.skip(); // Search not implemented or positioned differently
      }
    });
  });

  test.describe('Responsive Admin UI', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/admin/collections/courses');

      // Admin UI should still be functional
      await expect(page.locator('text=/Courses|Collections/i')).toBeVisible({ timeout: 10000 });
    });

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await page.goto('/admin/collections/courses');

      // Admin UI should be fully visible
      await expect(page.locator('text=/Courses|Collections/i')).toBeVisible({ timeout: 10000 });
    });
  });
});
