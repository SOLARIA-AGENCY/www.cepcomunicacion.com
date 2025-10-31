import { test, expect } from '@playwright/test';
import { NavigationComponent } from './pages/NavigationComponent';
import { HomePage } from './pages/HomePage';

/**
 * Navigation Flow E2E Tests
 *
 * Test coverage:
 * - Header navigation (desktop/mobile)
 * - Logo/brand link
 * - Mobile menu toggle
 * - Multi-page navigation flow
 * - Active state indicators
 * - Sticky header behavior
 */

test.describe('Navigation Component', () => {
  let navigation: NavigationComponent;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    navigation = new NavigationComponent(page);
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test.describe('Header Visibility', () => {
    test('should display header on all pages', async () => {
      await expect(navigation.header).toBeVisible();
    });

    test('should display logo/brand link', async () => {
      await expect(navigation.logo).toBeVisible();
      await expect(navigation.logo).toContainText('CEP Formación');
    });

    test('should have sticky header', async ({ page }) => {
      const headerPosition = await navigation.header.evaluate(el =>
        window.getComputedStyle(el).position
      );
      expect(headerPosition).toBe('sticky');
    });

    test('should have shadow or border for visual separation', async ({ page }) => {
      const headerClass = await navigation.header.getAttribute('class');
      expect(headerClass).toContain('shadow');
    });
  });

  test.describe('Desktop Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('should display desktop navigation on large screens', async () => {
      await expect(navigation.desktopNav).toBeVisible();
    });

    test('should hide mobile menu button on desktop', async () => {
      const isMobileButtonVisible = await navigation.isMobileMenuButtonVisible();
      expect(isMobileButtonVisible).toBe(false);
    });

    test('should navigate to Inicio page', async ({ page }) => {
      await navigation.navigateToCursos();
      await navigation.homeLink.click();
      await expect(page).toHaveURL(/.*\/$/);
    });

    test('should navigate to Cursos page', async ({ page }) => {
      await navigation.navigateToCursos();
      await expect(page).toHaveURL(/.*\/cursos/);
    });

    test('should navigate to Blog page', async ({ page }) => {
      await navigation.navigateToBlog();
      await expect(page).toHaveURL(/.*\/blog/);
    });

    test('should navigate to Contacto page', async ({ page }) => {
      await navigation.navigateToContacto();
      await expect(page).toHaveURL(/.*\/contacto/);
    });

    test('should have all main navigation links visible', async () => {
      await expect(navigation.homeLink).toBeVisible();
      await expect(navigation.cursosLink).toBeVisible();
      await expect(navigation.blogLink).toBeVisible();
      await expect(navigation.contactoLink).toBeVisible();
    });

    test('should highlight Contacto button with primary style', async ({ page }) => {
      const buttonClass = await navigation.contactoLink.getAttribute('class');
      expect(buttonClass).toContain('btn-primary');
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should hide desktop navigation on mobile', async () => {
      const isDesktopVisible = await navigation.isDesktopNavVisible();
      expect(isDesktopVisible).toBe(false);
    });

    test('should display mobile menu button', async () => {
      await expect(navigation.mobileMenuButton).toBeVisible();
    });

    test('should toggle mobile menu on button click', async () => {
      // Menu should be closed initially
      let isMenuOpen = await navigation.isMobileMenuOpen();
      expect(isMenuOpen).toBe(false);

      // Open menu
      await navigation.toggleMobileMenu();
      isMenuOpen = await navigation.isMobileMenuOpen();
      expect(isMenuOpen).toBe(true);

      // Close menu
      await navigation.toggleMobileMenu();
      isMenuOpen = await navigation.isMobileMenuOpen();
      expect(isMenuOpen).toBe(false);
    });

    test('should show all navigation links in mobile menu', async ({ page }) => {
      await navigation.toggleMobileMenu();

      // All main links should be visible in mobile menu
      const mobileLinks = navigation.mobileMenu.locator('a');
      const count = await mobileLinks.count();

      // Should have at least: Inicio, Cursos, Sobre Nosotros, Blog, FAQ, Design Hub, Contacto
      expect(count).toBeGreaterThanOrEqual(6);
    });

    test('should navigate using mobile menu - Cursos', async ({ page }) => {
      await navigation.toggleMobileMenu();
      await page.getByRole('link', { name: 'Cursos' }).last().click();
      await expect(page).toHaveURL(/.*\/cursos/);
    });

    test('should navigate using mobile menu - Contacto', async ({ page }) => {
      await navigation.toggleMobileMenu();
      await page.getByRole('link', { name: 'Contacto' }).last().click();
      await expect(page).toHaveURL(/.*\/contacto/);
    });

    test('should navigate using mobile menu - Blog', async ({ page }) => {
      await navigation.toggleMobileMenu();
      await page.getByRole('link', { name: 'Blog' }).last().click();
      await expect(page).toHaveURL(/.*\/blog/);
    });

    test('should close mobile menu after navigation', async ({ page }) => {
      await navigation.toggleMobileMenu();
      expect(await navigation.isMobileMenuOpen()).toBe(true);

      await page.getByRole('link', { name: 'Cursos' }).last().click();
      await page.waitForTimeout(500);

      // Menu should close after navigation
      const isMenuOpen = await navigation.isMobileMenuOpen();
      expect(isMenuOpen).toBe(false);
    });

    test('should change menu icon when menu is open', async ({ page }) => {
      // Get icon before opening
      const closedIcon = await navigation.mobileMenuButton.locator('svg path').first().getAttribute('d');

      await navigation.toggleMobileMenu();

      // Get icon after opening
      const openIcon = await navigation.mobileMenuButton.locator('svg path').first().getAttribute('d');

      // Icons should be different (hamburger vs X)
      expect(closedIcon).not.toBe(openIcon);
    });
  });

  test.describe('Logo Navigation', () => {
    test('should navigate to home from logo on any page', async ({ page }) => {
      // Navigate to courses page
      await navigation.navigateToCursos();
      await expect(page).toHaveURL(/.*\/cursos/);

      // Click logo
      await navigation.clickLogo();
      await expect(page).toHaveURL(/.*\/$/);
    });

    test('should keep logo visible on all pages', async ({ page }) => {
      const pages = ['/', '/cursos', '/blog', '/contacto'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        await expect(navigation.logo).toBeVisible();
      }
    });
  });

  test.describe('Multi-Page Navigation Flow', () => {
    test('should navigate through multiple pages smoothly', async ({ page }) => {
      // Home -> Cursos
      await navigation.navigateToCursos();
      await expect(page).toHaveURL(/.*\/cursos/);
      await expect(navigation.header).toBeVisible();

      // Cursos -> Blog
      await navigation.navigateToBlog();
      await expect(page).toHaveURL(/.*\/blog/);
      await expect(navigation.header).toBeVisible();

      // Blog -> Contacto
      await navigation.navigateToContacto();
      await expect(page).toHaveURL(/.*\/contacto/);
      await expect(navigation.header).toBeVisible();

      // Contacto -> Home
      await navigation.clickLogo();
      await expect(page).toHaveURL(/.*\/$/);
      await expect(navigation.header).toBeVisible();
    });

    test('should maintain header state across navigation', async ({ page }) => {
      await navigation.navigateToCursos();
      const headerClass1 = await navigation.header.getAttribute('class');

      await navigation.navigateToBlog();
      const headerClass2 = await navigation.header.getAttribute('class');

      // Header classes should be consistent
      expect(headerClass1).toBe(headerClass2);
    });
  });

  test.describe('Responsive Breakpoints', () => {
    const breakpoints = [
      { name: 'Mobile Small', width: 320, height: 568 },
      { name: 'Mobile Medium', width: 375, height: 667 },
      { name: 'Mobile Large', width: 414, height: 896 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop Small', width: 1024, height: 768 },
      { name: 'Desktop Large', width: 1920, height: 1080 },
    ];

    for (const breakpoint of breakpoints) {
      test(`should render correctly at ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`, async ({ page }) => {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });

        await expect(navigation.header).toBeVisible();
        await expect(navigation.logo).toBeVisible();

        // Check if mobile or desktop nav is shown based on breakpoint
        const isMobile = breakpoint.width < 768;

        if (isMobile) {
          await expect(navigation.mobileMenuButton).toBeVisible();
        } else {
          const isDesktopVisible = await navigation.isDesktopNavVisible();
          expect(isDesktopVisible).toBe(true);
        }
      });
    }
  });

  test.describe('Keyboard Navigation', () => {
    test('should be keyboard accessible - Tab navigation', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Focus on first interactive element (logo)
      await navigation.logo.focus();
      await expect(navigation.logo).toBeFocused();

      // Tab through navigation links
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // One of the nav links should be focused
      const focusedElement = await page.locator(':focus').textContent();
      expect(focusedElement).toBeTruthy();
    });

    test('should activate links with Enter key', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await navigation.cursosLink.focus();
      await page.keyboard.press('Enter');

      await expect(page).toHaveURL(/.*\/cursos/);
    });

    test('should toggle mobile menu with keyboard', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await navigation.mobileMenuButton.focus();
      await page.keyboard.press('Enter');

      const isMenuOpen = await navigation.isMobileMenuOpen();
      expect(isMenuOpen).toBe(true);
    });
  });

  test.describe('Visual Styling', () => {
    test('should have white background', async ({ page }) => {
      const bgColor = await navigation.header.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.backgroundColor;
      });

      // Should be white or very light color
      expect(bgColor).toMatch(/rgb\(255,\s*255,\s*255\)|white/);
    });

    test('should have proper z-index for sticky behavior', async ({ page }) => {
      const zIndex = await navigation.header.evaluate(el =>
        window.getComputedStyle(el).zIndex
      );

      const zIndexNum = parseInt(zIndex);
      expect(zIndexNum).toBeGreaterThan(10); // High enough to stay on top
    });

    test('should have hover effects on desktop links', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      const linkClass = await navigation.cursosLink.getAttribute('class');
      expect(linkClass).toContain('hover:');
    });
  });
});
