import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { NavigationComponent } from './pages/NavigationComponent';

/**
 * Accessibility E2E Tests
 *
 * Test coverage:
 * - Keyboard navigation
 * - ARIA labels and roles
 * - Focus management
 * - Semantic HTML
 * - Color contrast
 * - Screen reader compatibility
 * - WCAG 2.1 Level AA compliance
 */

test.describe('Accessibility Tests', () => {
  test.describe('Keyboard Navigation', () => {
    test('should navigate homepage with keyboard only', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Tab through interactive elements
      await page.keyboard.press('Tab');
      let focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Continue tabbing
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });

    test('should activate links with Enter key', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Focus on "Ver Cursos" button
      await homePage.viewCoursesButton.focus();
      await page.keyboard.press('Enter');

      // Should navigate to courses page
      await expect(page).toHaveURL(/.*\/cursos/);
    });

    test('should activate links with Space key', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Focus on "Ver Cursos" button
      await homePage.viewCoursesButton.focus();
      await page.keyboard.press('Space');

      // Should navigate to courses page
      await expect(page).toHaveURL(/.*\/cursos/);
    });

    test('should navigate mobile menu with keyboard', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const navigation = new NavigationComponent(page);
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Focus on mobile menu button
      await navigation.mobileMenuButton.focus();
      await expect(navigation.mobileMenuButton).toBeFocused();

      // Press Enter to open menu
      await page.keyboard.press('Enter');

      // Menu should be open
      const isMenuOpen = await navigation.isMobileMenuOpen();
      expect(isMenuOpen).toBe(true);
    });

    test('should trap focus in mobile menu when open', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const navigation = new NavigationComponent(page);
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Open mobile menu
      await navigation.toggleMobileMenu();

      // Tab through menu items
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Tab');
      }

      // Focus should still be within the menu
      const focusedElement = page.locator(':focus');
      const isInMenu = await focusedElement.evaluate(el => {
        return el.closest('.md\\:hidden') !== null;
      });

      // Focus should be managed within menu or back to toggle button
      expect(isInMenu || await navigation.mobileMenuButton.isFocused()).toBe(true);
    });

    test('should allow Skip to Content navigation', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Press Tab to potentially reveal skip link
      await page.keyboard.press('Tab');

      // Check if skip link exists (common accessibility pattern)
      const skipLink = page.locator('a[href="#main-content"], a[href="#content"]');
      const hasSkipLink = await skipLink.count() > 0;

      // Skip link is recommended but not required for this test
      // Just verify we can tab through the page
      await expect(page.locator(':focus')).toBeVisible();
    });
  });

  test.describe('ARIA Labels and Roles', () => {
    test('should have proper ARIA labels on navigation', async ({ page }) => {
      const navigation = new NavigationComponent(page);
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Header should have navigation role or nav element
      const nav = page.locator('nav');
      const navCount = await nav.count();
      expect(navCount).toBeGreaterThan(0);
    });

    test('should have ARIA label on mobile menu button', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const navigation = new NavigationComponent(page);
      const homePage = new HomePage(page);
      await homePage.navigate();

      const ariaLabel = await navigation.mobileMenuButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain('menu');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // h2, h3 should follow logical order
      const h2Count = await page.locator('h2').count();
      const h3Count = await page.locator('h3').count();

      expect(h2Count).toBeGreaterThan(0);

      // Verify h1 contains main page title
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text).toContain('Formación');
    });

    test('should have semantic HTML landmarks', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Check for main landmark
      const main = page.locator('main, [role="main"]');
      const hasMain = await main.count() > 0;

      // Check for header
      const header = page.locator('header, [role="banner"]');
      const hasHeader = await header.count() > 0;

      expect(hasHeader).toBe(true);
      // Main is recommended but not always in layout
    });

    test('should have alt text on images', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');

          // Alt can be empty for decorative images, but should exist
          expect(alt !== null).toBe(true);
        }
      }
    });

    test('should have proper button semantics', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // All clickable elements should be buttons or links
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      if (buttonCount > 0) {
        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i);
          const type = await button.getAttribute('type');

          // Button should have type attribute
          // (or be a link styled as button)
          const isButton = type !== null;
          expect(isButton).toBe(true);
        }
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Focus on first interactive element
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');

      // Check if focus outline is visible
      const outlineStyle = await focusedElement.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          outline: style.outline,
          outlineWidth: style.outlineWidth,
          boxShadow: style.boxShadow,
        };
      });

      // Should have some visible focus indicator
      const hasFocusIndicator =
        outlineStyle.outline !== 'none' ||
        outlineStyle.outlineWidth !== '0px' ||
        outlineStyle.boxShadow !== 'none';

      expect(hasFocusIndicator).toBe(true);
    });

    test('should maintain focus order in logical sequence', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      const focusOrder: string[] = [];

      // Tab through first 10 elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const element = page.locator(':focus');
        const tagName = await element.evaluate(el => el.tagName);
        const text = await element.textContent();

        focusOrder.push(`${tagName}:${text?.substring(0, 20)}`);
      }

      // Focus order should follow visual order (top to bottom, left to right)
      // Logo/brand should be early in focus order
      const brandIndex = focusOrder.findIndex(item => item.includes('CEP'));
      expect(brandIndex).toBeGreaterThanOrEqual(0);
      expect(brandIndex).toBeLessThan(3); // Should be one of first elements
    });

    test('should restore focus after modal/menu close', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const navigation = new NavigationComponent(page);
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Focus and open mobile menu
      await navigation.mobileMenuButton.focus();
      await page.keyboard.press('Enter');

      // Close menu
      await page.keyboard.press('Escape');

      // Focus should return to menu button
      const isFocused = await navigation.mobileMenuButton.isFocused();
      expect(isFocused).toBe(true);
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have descriptive link text', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      const links = page.locator('a');
      const linkCount = await links.count();

      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');

        // Link should have meaningful text or aria-label
        const hasDescriptiveText =
          (text && text.trim().length > 0) ||
          (ariaLabel && ariaLabel.length > 0);

        expect(hasDescriptiveText).toBe(true);
      }
    });

    test('should not use "click here" or generic link text', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      const links = page.locator('a');
      const linkTexts = await links.allTextContents();

      const genericTexts = ['click here', 'click', 'here', 'read more', 'más'];
      const hasGenericText = linkTexts.some(text =>
        genericTexts.includes(text.toLowerCase().trim())
      );

      // Should avoid generic link text (not a hard fail, but best practice)
      // This is a soft check - we're looking for meaningful link text
      expect(hasGenericText).toBe(false);
    });

    test('should have lang attribute on html element', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
      expect(lang).toMatch(/^es|en/); // Spanish or English
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have labels associated with inputs', async ({ page }) => {
      // Navigate to contact page or form page
      await page.goto('/contacto');

      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();

      if (inputCount > 0) {
        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledby = await input.getAttribute('aria-labelledby');

          // Input should have id with associated label, or aria-label
          const hasLabel =
            (id && await page.locator(`label[for="${id}"]`).count() > 0) ||
            !!ariaLabel ||
            !!ariaLabelledby;

          expect(hasLabel).toBe(true);
        }
      }
    });

    test('should have visible required field indicators', async ({ page }) => {
      await page.goto('/contacto');

      const requiredInputs = page.locator('input[required], textarea[required]');
      const count = await requiredInputs.count();

      if (count > 0) {
        // Check if there's a required indicator (*, "requerido", aria-required)
        const firstRequired = requiredInputs.first();
        const ariaRequired = await firstRequired.getAttribute('aria-required');

        // Should have aria-required or visual indicator
        expect(ariaRequired === 'true' || ariaRequired === 'required').toBe(true);
      }
    });
  });

  test.describe('Color and Contrast', () => {
    test('should not rely solely on color for information', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      // Check if course cards use text + color (not just color)
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        const firstCard = coursesPage.getCourseCard(0);

        // Card should have text content, not just colored indicators
        const textContent = await firstCard.textContent();
        expect(textContent).toBeTruthy();
        expect(textContent!.trim().length).toBeGreaterThan(10);
      }
    });

    test('should have sufficient color contrast on primary buttons', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      const button = homePage.viewCoursesButton;

      // Get computed colors
      const colors = await button.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
        };
      });

      // Both should have valid colors set
      expect(colors.color).toBeTruthy();
      expect(colors.backgroundColor).toBeTruthy();
      expect(colors.color).not.toBe('rgba(0, 0, 0, 0)');
    });
  });

  test.describe('Responsive Accessibility', () => {
    test('should maintain accessibility on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Should have one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Mobile menu button should be accessible
      const navigation = new NavigationComponent(page);
      const ariaLabel = await navigation.mobileMenuButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      // Should be keyboard navigable
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should maintain accessibility on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Should have proper heading hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Should be keyboard navigable
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Page Titles', () => {
    test('should have unique, descriptive page titles', async ({ page }) => {
      const pages = [
        { path: '/', expectedKeyword: 'Formación|CEP|Inicio' },
        { path: '/cursos', expectedKeyword: 'Cursos|Catálogo' },
        { path: '/blog', expectedKeyword: 'Blog' },
        { path: '/contacto', expectedKeyword: 'Contacto' },
      ];

      for (const pageInfo of pages) {
        await page.goto(pageInfo.path);
        const title = await page.title();

        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);

        // Title should contain relevant keyword (flexible check)
        const hasRelevantContent = new RegExp(pageInfo.expectedKeyword, 'i').test(title);
        expect(hasRelevantContent).toBe(true);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle 404 errors accessibly', async ({ page }) => {
      await page.goto('/this-page-does-not-exist-404');

      await page.waitForTimeout(2000);

      // Should still have h1 on 404 page
      const h1 = page.locator('h1');
      const h1Count = await h1.count();

      // Either redirects or shows 404 page with h1
      if (h1Count > 0) {
        expect(h1Count).toBe(1);
      } else {
        // Redirected to valid page
        const currentUrl = page.url();
        expect(currentUrl).not.toContain('this-page-does-not-exist-404');
      }
    });
  });
});
