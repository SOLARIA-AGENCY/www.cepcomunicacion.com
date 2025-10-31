import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { NavigationComponent } from './pages/NavigationComponent';

/**
 * Homepage E2E Tests
 *
 * Test coverage:
 * - Hero section rendering
 * - Featured courses display
 * - Navigation functionality
 * - Responsive behavior
 * - Call-to-action buttons
 */

test.describe('Homepage', () => {
  let homePage: HomePage;
  let navigation: NavigationComponent;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    navigation = new NavigationComponent(page);
    await homePage.navigate();
  });

  test.describe('Hero Section', () => {
    test('should display hero section with title and subtitle', async () => {
      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.heroTitle).toContainText('Formación Profesional');
      await expect(homePage.heroSubtitle).toBeVisible();
    });

    test('should have "Ver Cursos" button that navigates to /cursos', async ({ page }) => {
      await expect(homePage.viewCoursesButton).toBeVisible();
      await homePage.clickViewCourses();
      await expect(page).toHaveURL(/.*\/cursos/);
    });

    test('should have "Solicitar Información" button that navigates to /contacto', async ({ page }) => {
      await expect(homePage.contactButton).toBeVisible();
      await homePage.clickContactButton();
      await expect(page).toHaveURL(/.*\/contacto/);
    });

    test('should have gradient background in hero section', async ({ page }) => {
      const heroSection = page.locator('section.hero');
      await expect(heroSection).toHaveCSS('background-image', /gradient/);
    });
  });

  test.describe('Featured Courses Section', () => {
    test('should display "Cursos Destacados" section', async () => {
      await expect(homePage.featuredCoursesTitle).toBeVisible();
      await expect(homePage.featuredCoursesTitle).toContainText('Cursos Destacados');
    });

    test('should show featured courses or empty state', async () => {
      const hasCourses = await homePage.hasFeaturedCourses();

      if (hasCourses) {
        const count = await homePage.getFeaturedCoursesCount();
        expect(count).toBeGreaterThan(0);
        expect(count).toBeLessThanOrEqual(3); // Max 3 featured courses

        // Should have "Ver todos los cursos" link
        await expect(homePage.viewAllCoursesLink).toBeVisible();
      } else {
        // Should show empty state message
        const emptyMessage = homePage.page.locator('text=No hay cursos destacados disponibles');
        await expect(emptyMessage).toBeVisible();
      }
    });

    test('should navigate to course detail when clicking course card', async ({ page }) => {
      const hasCourses = await homePage.hasFeaturedCourses();

      if (hasCourses) {
        await homePage.clickCourseCard(0);
        await expect(page).toHaveURL(/.*\/cursos\/.+/);
      } else {
        test.skip();
      }
    });

    test('should navigate to /cursos when clicking "Ver todos los cursos"', async ({ page }) => {
      const hasCourses = await homePage.hasFeaturedCourses();

      if (hasCourses) {
        await homePage.clickViewAllCourses();
        await expect(page).toHaveURL(/.*\/cursos/);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Features Section', () => {
    test('should display three feature cards', async () => {
      const featureTitles = await homePage.getFeatureTitles();
      expect(featureTitles.length).toBe(3);
    });

    test('should show "Formación de Calidad" feature', async () => {
      const titles = await homePage.getFeatureTitles();
      expect(titles).toContain('Formación de Calidad');
    });

    test('should show "Ayudas Disponibles" feature', async () => {
      const titles = await homePage.getFeatureTitles();
      expect(titles).toContain('Ayudas Disponibles');
    });

    test('should show "Flexibilidad" feature', async () => {
      const titles = await homePage.getFeatureTitles();
      expect(titles).toContain('Flexibilidad');
    });

    test('should display icons for each feature', async ({ page }) => {
      const featureIcons = page.locator('div.inline-flex svg');
      const count = await featureIcons.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });

  test.describe('CTA Section', () => {
    test('should display CTA section at bottom', async () => {
      await expect(homePage.ctaSection).toBeVisible();
    });

    test('should have "¿Listo para dar el siguiente paso?" heading', async () => {
      const ctaHeading = homePage.page.locator('h2').filter({ hasText: '¿Listo para dar el siguiente paso?' });
      await expect(ctaHeading).toBeVisible();
    });

    test('should have "Solicitar Información" button in CTA', async () => {
      const ctaButton = homePage.page.locator('section').filter({ hasText: '¿Listo para dar el siguiente paso?' }).getByRole('link', { name: 'Solicitar Información' });
      await expect(ctaButton).toBeVisible();
    });
  });

  test.describe('Navigation Integration', () => {
    test('should have visible header with logo', async () => {
      await expect(navigation.header).toBeVisible();
      await expect(navigation.logo).toBeVisible();
    });

    test('should navigate to Cursos page from header', async ({ page }) => {
      await navigation.navigateToCursos();
      await expect(page).toHaveURL(/.*\/cursos/);
    });

    test('should navigate to Contacto page from header', async ({ page }) => {
      await navigation.navigateToContacto();
      await expect(page).toHaveURL(/.*\/contacto/);
    });

    test('should return to home when clicking logo', async ({ page }) => {
      // Navigate away first
      await navigation.navigateToCursos();
      await expect(page).toHaveURL(/.*\/cursos/);

      // Click logo to return home
      await navigation.clickLogo();
      await expect(page).toHaveURL(/.*\/$/);
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.featuredCoursesTitle).toBeVisible();

      // Mobile menu button should be visible
      await expect(navigation.mobileMenuButton).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad

      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.featuredCoursesTitle).toBeVisible();
    });

    test('should be responsive on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 }); // Full HD

      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.featuredCoursesTitle).toBeVisible();

      // Desktop navigation should be visible
      await expect(navigation.desktopNav).toBeVisible();
    });
  });

  test.describe('Page Metadata', () => {
    test('should have correct page title', async ({ page }) => {
      const title = await page.title();
      expect(title).toBeTruthy();
    });

    test('should load without console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await homePage.navigate();
      await page.waitForTimeout(2000);

      // Filter out known Next.js development warnings
      const criticalErrors = errors.filter(err =>
        !err.includes('Download the React DevTools')
      );

      expect(criticalErrors.length).toBe(0);
    });
  });
});
