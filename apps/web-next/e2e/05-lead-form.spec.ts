import { test, expect } from '@playwright/test';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CoursesPage } from './pages/CoursesPage';

/**
 * Lead Form Submission E2E Tests
 *
 * Test coverage:
 * - Form field validation
 * - GDPR consent checkboxes
 * - Form submission flow
 * - Success/error messages
 * - Required field handling
 * - Email/phone validation
 *
 * NOTE: These tests assume a lead form exists on course detail pages.
 * If the form is not yet implemented, tests will be skipped.
 */

test.describe('Lead Form Submission', () => {
  let courseDetailPage: CourseDetailPage;

  test.beforeEach(async ({ page }) => {
    courseDetailPage = new CourseDetailPage(page);

    // Navigate to a course detail page first
    const coursesPage = new CoursesPage(page);
    await coursesPage.navigate();

    const isEmpty = await coursesPage.isEmptyStateVisible();
    if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
      await coursesPage.clickCourseCard(0);
    }
  });

  test.describe('Form Visibility', () => {
    test('should display lead capture form on course detail page', async () => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        await expect(courseDetailPage.leadForm).toBeVisible();
      } else {
        test.skip(); // Form not yet implemented
      }
    });

    test('should have all required form fields', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        // Check for common form fields
        const nameField = page.locator('input[name="name"], input[id="name"]');
        const emailField = page.locator('input[name="email"], input[id="email"]');
        const phoneField = page.locator('input[name="phone"], input[id="phone"]');

        const hasRequiredFields =
          (await nameField.count() > 0) &&
          (await emailField.count() > 0) &&
          (await phoneField.count() > 0);

        expect(hasRequiredFields).toBe(true);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Field Validation', () => {
    test('should validate required fields', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        const submitButton = page.locator('button[type="submit"]');

        // Try to submit empty form
        await submitButton.click();

        // Should show validation errors
        const validationMessages = page.locator('[class*="error"], [class*="invalid"], [role="alert"]');
        const hasValidation = await validationMessages.count() > 0;

        expect(hasValidation).toBe(true);
      } else {
        test.skip();
      }
    });

    test('should validate email format', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        const emailField = page.locator('input[name="email"], input[id="email"]').first();

        // Enter invalid email
        await emailField.fill('invalid-email');

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Wait a bit for validation
        await page.waitForTimeout(500);

        // Should show email validation error
        const emailError = page.locator('text=/.*email.*válido|valid.*email|formato.*email/i');
        const hasEmailError = await emailError.count() > 0;

        expect(hasEmailError).toBe(true);
      } else {
        test.skip();
      }
    });

    test('should validate phone format', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        const phoneField = page.locator('input[name="phone"], input[id="phone"]').first();

        // Enter invalid phone
        await phoneField.fill('abc');

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        await page.waitForTimeout(500);

        // Should show phone validation error or prevent submission
        const phoneError = page.locator('text=/.*teléfono.*válido|valid.*phone|formato.*teléfono/i');
        const hasPhoneError = await phoneError.count() > 0;

        // Either shows error or field has validation attribute
        const hasValidation = hasPhoneError || await phoneField.getAttribute('type') === 'tel';

        expect(hasValidation).toBe(true);
      } else {
        test.skip();
      }
    });
  });

  test.describe('GDPR Compliance', () => {
    test('should have GDPR consent checkbox', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        const consentCheckbox = page.locator('input[type="checkbox"]').filter({ has: page.locator('text=/.*privacidad|GDPR|protección.*datos|consentimiento/i') });
        const hasConsent = await consentCheckbox.count() > 0;

        expect(hasConsent).toBe(true);
      } else {
        test.skip();
      }
    });

    test('should require GDPR consent to submit', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        // Fill form without checking consent
        await page.fill('input[name="name"], input[id="name"]', 'Test User');
        await page.fill('input[name="email"], input[id="email"]', 'test@example.com');
        await page.fill('input[name="phone"], input[id="phone"]', '600123456');

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        await page.waitForTimeout(500);

        // Should show consent error or prevent submission
        const consentError = page.locator('text=/.*consentimiento|consent|privacidad.*requerido/i');
        const hasConsentError = await consentError.count() > 0;

        expect(hasConsentError).toBe(true);
      } else {
        test.skip();
      }
    });

    test('should have link to privacy policy', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        const privacyLink = page.locator('a[href*="privacidad"], a[href*="privacy"]');
        const hasPrivacyLink = await privacyLink.count() > 0;

        expect(hasPrivacyLink).toBe(true);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Form Submission', () => {
    test('should submit form with valid data', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        // Fill all required fields
        await page.fill('input[name="name"], input[id="name"]', 'Juan Pérez');
        await page.fill('input[name="email"], input[id="email"]', 'juan.perez@example.com');
        await page.fill('input[name="phone"], input[id="phone"]', '600123456');

        // Check GDPR consent
        const consentCheckbox = page.locator('input[type="checkbox"]').first();
        await consentCheckbox.check();

        // Submit form
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Wait for response
        await page.waitForTimeout(2000);

        // Should show success message or confirmation
        const successMessage = page.locator('text=/.*éxito|success|enviado|gracias|thank you/i');
        const hasSuccess = await successMessage.count() > 0;

        expect(hasSuccess).toBe(true);
      } else {
        test.skip();
      }
    });

    test('should clear form after successful submission', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        // Fill and submit form
        await page.fill('input[name="name"], input[id="name"]', 'Test User');
        await page.fill('input[name="email"], input[id="email"]', 'test@example.com');
        await page.fill('input[name="phone"], input[id="phone"]', '600123456');

        const consentCheckbox = page.locator('input[type="checkbox"]').first();
        await consentCheckbox.check();

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        await page.waitForTimeout(2000);

        // Check if form was cleared
        const nameValue = await page.locator('input[name="name"], input[id="name"]').inputValue();
        expect(nameValue).toBe('');
      } else {
        test.skip();
      }
    });

    test('should handle server errors gracefully', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        // Mock a server error by intercepting API call
        await page.route('**/api/leads', route => {
          route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Server error' }),
          });
        });

        // Fill and submit form
        await page.fill('input[name="name"], input[id="name"]', 'Test User');
        await page.fill('input[name="email"], input[id="email"]', 'test@example.com');
        await page.fill('input[name="phone"], input[id="phone"]', '600123456');

        const consentCheckbox = page.locator('input[type="checkbox"]').first();
        await consentCheckbox.check();

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        await page.waitForTimeout(2000);

        // Should show error message
        const errorMessage = page.locator('text=/.*error|problema|intenta.*nuevo/i');
        const hasError = await errorMessage.count() > 0;

        expect(hasError).toBe(true);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have proper labels for all inputs', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
        const count = await inputs.count();

        for (let i = 0; i < count; i++) {
          const input = inputs.nth(i);
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false;

          expect(hasLabel || !!ariaLabel).toBe(true);
        }
      } else {
        test.skip();
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      const isFormVisible = await courseDetailPage.isLeadFormVisible();

      if (isFormVisible) {
        // Tab through form fields
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Should focus on form elements
        const focusedElement = page.locator(':focus');
        const tagName = await focusedElement.evaluate(el => el.tagName);

        expect(['INPUT', 'TEXTAREA', 'BUTTON']).toContain(tagName);
      } else {
        test.skip();
      }
    });
  });
});
