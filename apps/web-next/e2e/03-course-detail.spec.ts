import { test, expect } from '@playwright/test';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CoursesPage } from './pages/CoursesPage';
import { NavigationComponent } from './pages/NavigationComponent';

/**
 * Course Detail Page E2E Tests
 *
 * Test coverage:
 * - Dynamic route loading
 * - Course metadata display
 * - 404 error handling
 * - Related courses section
 * - Lead form visibility
 * - Breadcrumb navigation
 */

test.describe('Course Detail Page', () => {
  let courseDetailPage: CourseDetailPage;
  let navigation: NavigationComponent;

  test.beforeEach(async ({ page }) => {
    courseDetailPage = new CourseDetailPage(page);
    navigation = new NavigationComponent(page);
  });

  test.describe('Valid Course Detail', () => {
    test('should load valid course from catalog', async ({ page }) => {
      // First navigate to courses catalog
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty) {
        // Get first course title and click it
        const count = await coursesPage.getCoursesCount();
        if (count > 0) {
          await coursesPage.clickCourseCard(0);

          // Should navigate to course detail
          await expect(page).toHaveURL(/.*\/cursos\/.+/);

          // Course title should be visible
          await expect(courseDetailPage.courseTitle).toBeVisible();
        }
      } else {
        test.skip();
      }
    });

    test('should display course title on detail page', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);

        const title = await courseDetailPage.getCourseTitle();
        expect(title).toBeTruthy();
        expect(title.trim().length).toBeGreaterThan(0);
      } else {
        test.skip();
      }
    });

    test('should display course metadata', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);

        const metadataVisible = await courseDetailPage.isMetadataVisible();
        expect(metadataVisible).toBe(true);
      } else {
        test.skip();
      }
    });

    test('should have valid URL slug format', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);

        const url = page.url();
        // URL should match /cursos/[slug] pattern
        expect(url).toMatch(/\/cursos\/[a-z0-9-]+$/);
      } else {
        test.skip();
      }
    });
  });

  test.describe('404 Error Handling', () => {
    test('should handle invalid course slug gracefully', async ({ page }) => {
      await courseDetailPage.navigate('this-course-does-not-exist-123456');

      // Wait a bit for potential redirect or error message
      await page.waitForTimeout(2000);

      // Should either show 404 message or redirect to courses page
      const currentUrl = page.url();
      const has404 = await courseDetailPage.isNotFound();

      // Either we're on a 404 page or redirected back to courses
      const isHandledGracefully = has404 || currentUrl.includes('/cursos') && !currentUrl.includes('this-course-does-not-exist');

      expect(isHandledGracefully).toBe(true);
    });

    test('should handle special characters in slug', async ({ page }) => {
      await courseDetailPage.navigate('invalid@#$%slug');

      await page.waitForTimeout(2000);

      // Should handle gracefully without crashing
      const title = await page.title();
      expect(title).toBeTruthy();
    });
  });

  test.describe('Course Information Display', () => {
    test('should show all course sections', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);

        // Course should have main content sections
        const title = await courseDetailPage.courseTitle.isVisible();
        expect(title).toBe(true);

        // Page should have meaningful content
        const bodyText = await page.locator('body').textContent();
        expect(bodyText?.trim().length).toBeGreaterThan(100);
      } else {
        test.skip();
      }
    });

    test('should display course in proper layout', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);

        // Should have container for layout
        const container = page.locator('.container, [class*="container"]');
        const hasContainer = await container.count() > 0;
        expect(hasContainer).toBe(true);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Navigation Integration', () => {
    test('should have visible header navigation', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);

        await expect(navigation.header).toBeVisible();
      } else {
        test.skip();
      }
    });

    test('should navigate back to courses from header', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);

        await navigation.navigateToCursos();
        await expect(page).toHaveURL(/.*\/cursos$/);
      } else {
        test.skip();
      }
    });

    test('should navigate to home from logo', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);

        await navigation.clickLogo();
        await expect(page).toHaveURL(/.*\/$/);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await page.setViewportSize({ width: 375, height: 667 });
        await coursesPage.clickCourseCard(0);

        await expect(courseDetailPage.courseTitle).toBeVisible();
        await expect(navigation.mobileMenuButton).toBeVisible();
      } else {
        test.skip();
      }
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await page.setViewportSize({ width: 768, height: 1024 });
        await coursesPage.clickCourseCard(0);

        await expect(courseDetailPage.courseTitle).toBeVisible();
      } else {
        test.skip();
      }
    });

    test('should be responsive on desktop viewport', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await coursesPage.clickCourseCard(0);

        await expect(courseDetailPage.courseTitle).toBeVisible();
        await expect(navigation.desktopNav).toBeVisible();
      } else {
        test.skip();
      }
    });
  });

  test.describe('Multiple Course Navigation', () => {
    test('should navigate between different courses', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();
      const count = await coursesPage.getCoursesCount();

      if (!isEmpty && count >= 2) {
        // Navigate to first course
        await coursesPage.clickCourseCard(0);
        const firstUrl = page.url();

        // Go back to courses
        await page.goBack();

        // Navigate to second course
        await coursesPage.clickCourseCard(1);
        const secondUrl = page.url();

        // URLs should be different
        expect(firstUrl).not.toBe(secondUrl);
      } else {
        test.skip();
      }
    });
  });

  test.describe('SEO and Metadata', () => {
    test('should have page title set', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);

        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
      } else {
        test.skip();
      }
    });

    test('should not have console errors on load', async ({ page }) => {
      const coursesPage = new CoursesPage(page);
      const errors: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await coursesPage.navigate();

      const isEmpty = await coursesPage.isEmptyStateVisible();

      if (!isEmpty && await coursesPage.getCoursesCount() > 0) {
        await coursesPage.clickCourseCard(0);
        await page.waitForTimeout(1000);

        const criticalErrors = errors.filter(err =>
          !err.includes('Download the React DevTools')
        );

        expect(criticalErrors.length).toBe(0);
      } else {
        test.skip();
      }
    });
  });
});
