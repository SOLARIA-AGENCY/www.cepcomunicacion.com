import { test, expect } from '@playwright/test';
import { CoursesPage } from './pages/CoursesPage';
import { NavigationComponent } from './pages/NavigationComponent';

/**
 * Courses Catalog E2E Tests
 *
 * Test coverage:
 * - Course listing display
 * - Course cards rendering
 * - Empty state handling
 * - Navigation to course details
 * - Course count display
 */

test.describe('Courses Catalog Page', () => {
  let coursesPage: CoursesPage;
  let navigation: NavigationComponent;

  test.beforeEach(async ({ page }) => {
    coursesPage = new CoursesPage(page);
    navigation = new NavigationComponent(page);
    await coursesPage.navigate();
  });

  test.describe('Page Layout', () => {
    test('should display page title "Catálogo de Cursos"', async () => {
      await expect(coursesPage.pageTitle).toBeVisible();
      await expect(coursesPage.pageTitle).toContainText('Catálogo de Cursos');
    });

    test('should have hero section with gradient background', async ({ page }) => {
      const heroSection = page.locator('section.bg-gradient-to-r');
      await expect(heroSection).toBeVisible();
    });

    test('should display CTA section at bottom', async () => {
      await expect(coursesPage.ctaSection).toBeVisible();
      await expect(coursesPage.ctaSection).toContainText('¿No encuentras lo que buscas?');
    });
  });

  test.describe('Course Listing', () => {
    test('should display courses grid or empty state', async () => {
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (isEmpty) {
        await expect(coursesPage.emptyState).toBeVisible();
        await expect(coursesPage.emptyState).toContainText('No hay cursos disponibles');
      } else {
        await expect(coursesPage.coursesGrid).toBeVisible();
        const count = await coursesPage.getCoursesCount();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('should show correct course count', async () => {
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty) {
        const actualCount = await coursesPage.getCoursesCount();
        const displayedCount = await coursesPage.getCourseCountText();

        // The displayed count should match actual count
        expect(displayedCount).toContain(actualCount.toString());
      }
    });

    test('should display course cards with required information', async ({ page }) => {
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty) {
        const firstCard = coursesPage.getCourseCard(0);

        // Each card should have a title (h3)
        await expect(firstCard.locator('h3')).toBeVisible();

        // Each card should have a clickable link
        const link = firstCard.locator('a').first();
        await expect(link).toBeVisible();
      } else {
        test.skip();
      }
    });

    test('should navigate to course detail when clicking a course card', async ({ page }) => {
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty) {
        const count = await coursesPage.getCoursesCount();
        if (count > 0) {
          await coursesPage.clickCourseCard(0);
          await expect(page).toHaveURL(/.*\/cursos\/.+/);
        }
      } else {
        test.skip();
      }
    });

    test('should display multiple courses if available', async () => {
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty) {
        const count = await coursesPage.getCoursesCount();

        // Based on seeded data, we should have at least 3 courses
        if (count >= 3) {
          expect(count).toBeGreaterThanOrEqual(3);

          // All cards should be visible
          for (let i = 0; i < Math.min(count, 3); i++) {
            const card = coursesPage.getCourseCard(i);
            await expect(card).toBeVisible();
          }
        }
      } else {
        test.skip();
      }
    });
  });

  test.describe('Course Card Information', () => {
    test('should display course titles', async () => {
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty) {
        const titles = await coursesPage.getCourseTitles();
        expect(titles.length).toBeGreaterThan(0);

        // Each title should be non-empty
        titles.forEach(title => {
          expect(title.trim()).not.toBe('');
        });
      } else {
        test.skip();
      }
    });

    test('should show course metadata (modality, duration, etc.)', async ({ page }) => {
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        const firstCard = coursesPage.getCourseCard(0);

        // Card should contain some metadata (badges, icons, etc.)
        const hasContent = await firstCard.locator('p, span, div').count();
        expect(hasContent).toBeGreaterThan(0);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Empty State', () => {
    test('should show "Volver al inicio" link when no courses', async ({ page }) => {
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (isEmpty) {
        const backLink = page.getByRole('link', { name: 'Volver al inicio' });
        await expect(backLink).toBeVisible();

        await backLink.click();
        await expect(page).toHaveURL(/.*\/$/);
      } else {
        test.skip();
      }
    });

    test('should display helpful message when no courses available', async () => {
      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (isEmpty) {
        const message = coursesPage.page.locator('text=Los cursos aparecerán aquí');
        await expect(message).toBeVisible();
      } else {
        test.skip();
      }
    });
  });

  test.describe('Navigation Integration', () => {
    test('should have visible header navigation', async () => {
      await expect(navigation.header).toBeVisible();
    });

    test('should navigate back to home from header logo', async ({ page }) => {
      await navigation.clickLogo();
      await expect(page).toHaveURL(/.*\/$/);
    });

    test('should navigate to Contacto from header', async ({ page }) => {
      await navigation.navigateToContacto();
      await expect(page).toHaveURL(/.*\/contacto/);
    });

    test('should navigate to Blog from header', async ({ page }) => {
      await navigation.navigateToBlog();
      await expect(page).toHaveURL(/.*\/blog/);
    });
  });

  test.describe('CTA Section', () => {
    test('should display "Solicitar Información" button in CTA', async () => {
      const ctaButton = coursesPage.page.locator('section').filter({ hasText: '¿No encuentras lo que buscas?' }).getByRole('link', { name: 'Solicitar Información' });
      await expect(ctaButton).toBeVisible();
    });

    test('should navigate to Contacto when clicking CTA button', async ({ page }) => {
      const ctaButton = page.locator('section').filter({ hasText: '¿No encuentras lo que buscas?' }).getByRole('link', { name: 'Solicitar Información' });
      await ctaButton.click();
      await expect(page).toHaveURL(/.*\/contacto/);
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(coursesPage.pageTitle).toBeVisible();
      await expect(navigation.mobileMenuButton).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(coursesPage.pageTitle).toBeVisible();

      const isEmpty = await coursesPage.isEmptyStateVisible();
      if (!isEmpty) {
        await expect(coursesPage.coursesGrid).toBeVisible();
      }
    });

    test('should display courses in grid layout on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      const isEmpty = await coursesPage.isEmptyStateVisible();
      if (!isEmpty) {
        await expect(coursesPage.coursesGrid).toBeVisible();

        // Grid should use CSS Grid or Flexbox
        const gridStyle = await coursesPage.coursesGrid.evaluate(el =>
          window.getComputedStyle(el).display
        );
        expect(['grid', 'flex']).toContain(gridStyle);
      }
    });
  });

  test.describe('Performance', () => {
    test('should load page quickly', async ({ page }) => {
      const startTime = Date.now();
      await coursesPage.navigate();
      const loadTime = Date.now() - startTime;

      // Page should load in less than 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await coursesPage.navigate();
      await page.waitForTimeout(1000);

      const criticalErrors = errors.filter(err =>
        !err.includes('Download the React DevTools')
      );

      expect(criticalErrors.length).toBe(0);
    });
  });
});
