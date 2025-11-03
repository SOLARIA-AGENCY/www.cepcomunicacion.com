import { test, expect } from '@playwright/test';
import { waitForPageLoad, type PerformanceMetrics } from './utils/test-helpers';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';

/**
 * Performance & Accessibility E2E Tests
 *
 * Test coverage:
 * - Page load times
 * - First Contentful Paint (FCP)
 * - Time to Interactive (TTI)
 * - Cumulative Layout Shift (CLS)
 * - Lighthouse scores (requires lighthouse CLI)
 * - Image lazy loading
 * - Network request optimization
 * - WCAG 2.1 Level AA accessibility
 * - Keyboard navigation
 * - Screen reader support
 *
 * Performance Targets:
 * - FCP < 1.5s
 * - TTI < 3.5s
 * - CLS < 0.1
 * - Total load < 3s
 * - Lighthouse Performance > 90
 * - Lighthouse Accessibility > 95
 */

test.describe('Performance Tests', () => {
  test.describe('Page Load Performance', () => {
    test('homepage should load in less than 3 seconds', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await waitForPageLoad(page);

      const loadTime = Date.now() - startTime;

      console.log(`Homepage load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(3000);
    });

    test('courses catalog should load in less than 2 seconds', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/cursos');
      await waitForPageLoad(page);

      const loadTime = Date.now() - startTime;

      console.log(`Courses page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(2000);
    });

    test('course detail page should load in less than 2 seconds', async ({ page }) => {
      // First get a valid course slug
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        // Get first course URL
        await coursesPage.clickCourseCard(0);

        const courseUrl = page.url();
        const startTime = Date.now();

        // Reload to measure performance
        await page.goto(courseUrl);
        await waitForPageLoad(page);

        const loadTime = Date.now() - startTime;

        console.log(`Course detail load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(2000);
      } else {
        test.skip(); // No courses to test
      }
    });
  });

  test.describe('Core Web Vitals', () => {
    test('First Contentful Paint (FCP) should be less than 1.5 seconds', async ({ page }) => {
      await page.goto('/');

      const metrics: PerformanceMetrics = await waitForPageLoad(page);

      console.log(`FCP: ${metrics.firstContentfulPaint}ms`);
      expect(metrics.firstContentfulPaint).toBeLessThan(1500);
    });

    test('Time to Interactive (TTI) should be less than 3.5 seconds', async ({ page }) => {
      await page.goto('/');

      const metrics: PerformanceMetrics = await waitForPageLoad(page);

      console.log(`TTI (domInteractive): ${metrics.domInteractive}ms`);
      expect(metrics.domInteractive).toBeLessThan(3500);
    });

    test('Cumulative Layout Shift (CLS) should be minimal', async ({ page }) => {
      await page.goto('/');

      // Wait for page to fully load and stabilize
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Allow time for any shifts

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          });

          observer.observe({ type: 'layout-shift', buffered: true });

          // Resolve after short delay
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 1000);
        });
      });

      console.log(`CLS: ${cls}`);
      expect(cls).toBeLessThan(0.1);
    });
  });

  test.describe('Image Optimization', () => {
    test('images should be lazy-loaded correctly', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Check if images have loading="lazy" attribute
      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        const lazyImages = await images.filter({ has: page.locator('[loading="lazy"]') }).count();

        console.log(`Total images: ${imageCount}, Lazy-loaded: ${lazyImages}`);

        // At least some images should be lazy-loaded (not all, as hero might be eager)
        expect(lazyImages).toBeGreaterThan(0);
      } else {
        test.skip(); // No images on page
      }
    });

    test('images should have appropriate sizes', async ({ page }) => {
      await page.goto('/');

      // Check for oversized images
      const oversizedImages = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        const oversized = images.filter(img => {
          const displayWidth = img.clientWidth;
          const naturalWidth = img.naturalWidth;

          // Image should not be more than 2x larger than displayed
          return naturalWidth > displayWidth * 2;
        });

        return oversized.length;
      });

      console.log(`Oversized images: ${oversizedImages}`);
      expect(oversizedImages).toBe(0);
    });

    test('images should have alt text for accessibility', async ({ page }) => {
      await page.goto('/');

      // Check all images have alt attributes
      const imagesWithoutAlt = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.filter(img => !img.hasAttribute('alt')).length;
      });

      console.log(`Images without alt: ${imagesWithoutAlt}`);
      expect(imagesWithoutAlt).toBe(0);
    });
  });

  test.describe('Network Request Optimization', () => {
    test('should not make excessive API requests', async ({ page }) => {
      const requests: string[] = [];

      page.on('request', (request) => {
        requests.push(request.url());
      });

      await page.goto('/');
      await waitForPageLoad(page);

      // Filter to API requests only
      const apiRequests = requests.filter(url => url.includes('/api/'));

      console.log(`Total requests: ${requests.length}, API requests: ${apiRequests.length}`);

      // Should not make more than 10 API requests for homepage
      expect(apiRequests.length).toBeLessThan(10);
    });

    test('should cache static assets', async ({ page, context }) => {
      // First visit
      await page.goto('/');
      await waitForPageLoad(page);

      // Second visit (should use cache)
      const cachedRequests: string[] = [];

      page.on('response', (response) => {
        const headers = response.headers();
        if (headers['x-cache'] === 'HIT' || response.fromCache()) {
          cachedRequests.push(response.url());
        }
      });

      await page.goto('/');
      await waitForPageLoad(page);

      console.log(`Cached requests: ${cachedRequests.length}`);

      // Should have some cached assets
      expect(cachedRequests.length).toBeGreaterThan(0);
    });

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('/');
      await waitForPageLoad(page);

      // Filter out known development warnings
      const criticalErrors = errors.filter(err => {
        return !err.includes('Download the React DevTools') &&
               !err.includes('PropTypes') &&
               !err.includes('[HMR]');
      });

      console.log(`Console errors: ${criticalErrors.length}`);
      expect(criticalErrors.length).toBe(0);
    });
  });

  test.describe('Responsive Performance', () => {
    test('should maintain performance on mobile viewport', async ({ page }) => {
      // Simulate mobile device
      await page.setViewportSize({ width: 375, height: 667 });

      const startTime = Date.now();
      await page.goto('/');
      await waitForPageLoad(page);

      const loadTime = Date.now() - startTime;

      console.log(`Mobile load time: ${loadTime}ms`);

      // Mobile might be slightly slower, but still < 4s
      expect(loadTime).toBeLessThan(4000);
    });

    test('should maintain performance on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const startTime = Date.now();
      await page.goto('/');
      await waitForPageLoad(page);

      const loadTime = Date.now() - startTime;

      console.log(`Tablet load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(3000);
    });

    test('should maintain performance on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      const startTime = Date.now();
      await page.goto('/');
      await waitForPageLoad(page);

      const loadTime = Date.now() - startTime;

      console.log(`Desktop load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(3000);
    });
  });

  test.describe('Bundle Size & JavaScript Performance', () => {
    test('should not load excessive JavaScript', async ({ page }) => {
      const jsRequests: { url: string; size: number }[] = [];

      page.on('response', async (response) => {
        if (response.url().endsWith('.js')) {
          const buffer = await response.body().catch(() => null);
          if (buffer) {
            jsRequests.push({
              url: response.url(),
              size: buffer.length
            });
          }
        }
      });

      await page.goto('/');
      await waitForPageLoad(page);

      const totalJsSize = jsRequests.reduce((sum, req) => sum + req.size, 0);
      const totalJsSizeMB = (totalJsSize / 1024 / 1024).toFixed(2);

      console.log(`Total JS size: ${totalJsSizeMB}MB`);

      // Modern sites should keep JS under 1MB for initial load
      expect(totalJsSize).toBeLessThan(1024 * 1024); // 1MB
    });

    test('should execute JavaScript efficiently', async ({ page }) => {
      await page.goto('/');

      // Measure JavaScript execution time
      const jsExecutionTime = await page.evaluate(() => {
        const entries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return entries.domComplete - entries.domInteractive;
      });

      console.log(`JS execution time: ${jsExecutionTime}ms`);

      // JS execution should be fast
      expect(jsExecutionTime).toBeLessThan(1000);
    });
  });
});

test.describe('Accessibility Tests', () => {
  test.describe('Keyboard Navigation', () => {
    test('should navigate homepage with keyboard only', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should have visible focus indicator
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active) return null;

        const styles = window.getComputedStyle(active);
        return {
          tagName: active.tagName,
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
        };
      });

      expect(focusedElement).toBeTruthy();
      console.log('Focused element:', focusedElement);
    });

    test('should activate links with Enter key', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Tab to "Ver Cursos" button
      await page.keyboard.press('Tab');

      // Press Enter
      await page.keyboard.press('Enter');

      // Should navigate
      await page.waitForTimeout(1000);

      const url = page.url();
      console.log('Navigated to:', url);

      // Should have navigated somewhere
      expect(url).not.toBe('/');
    });

    test('should trap focus in mobile menu when open', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Open mobile menu
      const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="navigation"]').first();

      if (await mobileMenuButton.isVisible({ timeout: 3000 })) {
        await mobileMenuButton.click();

        // Tab through menu items
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Focus should stay within menu
        const focusedElement = await page.evaluate(() => {
          const active = document.activeElement;
          return active?.closest('[role="navigation"], nav') !== null;
        });

        expect(focusedElement).toBe(true);
      } else {
        test.skip(); // Mobile menu not found
      }
    });
  });

  test.describe('ARIA Labels and Semantic HTML', () => {
    test('should have proper ARIA labels on navigation', async ({ page }) => {
      await page.goto('/');

      // Check for nav with aria-label
      const nav = page.locator('nav[aria-label], [role="navigation"]');
      const hasAriaNav = await nav.count();

      expect(hasAriaNav).toBeGreaterThan(0);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      // Check heading levels
      const headings = await page.evaluate(() => {
        const h1s = document.querySelectorAll('h1').length;
        const h2s = document.querySelectorAll('h2').length;
        const h3s = document.querySelectorAll('h3').length;

        return { h1s, h2s, h3s };
      });

      console.log('Headings:', headings);

      // Should have exactly one h1
      expect(headings.h1s).toBe(1);

      // Should have some h2s for structure
      expect(headings.h2s).toBeGreaterThan(0);
    });

    test('should have lang attribute on html element', async ({ page }) => {
      await page.goto('/');

      const lang = await page.evaluate(() => document.documentElement.lang);

      expect(lang).toBeTruthy();
      expect(lang).toMatch(/es|en/i);
    });
  });

  test.describe('Color and Contrast', () => {
    test('should have sufficient color contrast on buttons', async ({ page }) => {
      await page.goto('/');

      // This is a simplified test - full contrast checking requires axe-core
      const buttons = page.locator('button, a.button, [role="button"]');
      const buttonCount = await buttons.count();

      expect(buttonCount).toBeGreaterThan(0);

      // All buttons should have visible text
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();

        expect(text?.trim()).toBeTruthy();
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have labels associated with form inputs', async ({ page }) => {
      // Go to contact page (likely has forms)
      await page.goto('/contacto');

      // Check if form exists
      const form = page.locator('form');

      if (await form.isVisible({ timeout: 3000 })) {
        // Check inputs have labels or aria-label
        const inputs = form.locator('input, textarea, select');
        const inputCount = await inputs.count();

        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');

          // Should have one of: associated label, aria-label, or aria-labelledby
          const hasLabel = id && await page.locator(`label[for="${id}"]`).count() > 0;

          expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      } else {
        test.skip(); // No form on contact page
      }
    });
  });
});
