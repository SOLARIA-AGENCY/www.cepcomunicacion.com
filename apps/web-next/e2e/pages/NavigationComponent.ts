import { Page, Locator } from '@playwright/test';

/**
 * Navigation Component Object
 *
 * Represents the header navigation (shared across all pages)
 * - Desktop navigation
 * - Mobile menu
 * - Logo/Brand
 */
export class NavigationComponent {
  readonly page: Page;

  // Header elements
  readonly header: Locator;
  readonly logo: Locator;
  readonly desktopNav: Locator;
  readonly mobileMenuButton: Locator;
  readonly mobileMenu: Locator;

  // Navigation links
  readonly homeLink: Locator;
  readonly cursosLink: Locator;
  readonly sobreNosotrosLink: Locator;
  readonly blogLink: Locator;
  readonly faqLink: Locator;
  readonly designHubLink: Locator;
  readonly contactoLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = page.locator('header');
    this.logo = page.locator('header a').filter({ hasText: 'CEP Formación' });
    this.desktopNav = page.locator('header nav > div > div.hidden.md\\:flex');
    this.mobileMenuButton = page.locator('header button[aria-label="Toggle menu"]');
    this.mobileMenu = page.locator('header .md\\:hidden.mt-4');

    // Desktop navigation links
    this.homeLink = page.locator('header a[href="/"]').filter({ hasText: 'Inicio' });
    this.cursosLink = page.locator('header a[href="/cursos"]');
    this.sobreNosotrosLink = page.locator('header a[href="/sobre-nosotros"]');
    this.blogLink = page.locator('header a[href="/blog"]');
    this.faqLink = page.locator('header a[href="/faq"]');
    this.designHubLink = page.locator('header a[href="/design-hub"]');
    this.contactoLink = page.locator('header a[href="/contacto"]').first();
  }

  /**
   * Check if header is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.header.isVisible();
  }

  /**
   * Click on logo to go home
   */
  async clickLogo() {
    await this.logo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigate to Cursos page
   */
  async navigateToCursos() {
    await this.cursosLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigate to Contacto page
   */
  async navigateToContacto() {
    await this.contactoLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigate to Blog page
   */
  async navigateToBlog() {
    await this.blogLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Toggle mobile menu
   */
  async toggleMobileMenu() {
    await this.mobileMenuButton.click();
    await this.page.waitForTimeout(300); // Animation delay
  }

  /**
   * Check if mobile menu is open
   */
  async isMobileMenuOpen(): Promise<boolean> {
    return await this.mobileMenu.isVisible();
  }

  /**
   * Check if desktop navigation is visible
   */
  async isDesktopNavVisible(): Promise<boolean> {
    return await this.desktopNav.isVisible();
  }

  /**
   * Check if mobile menu button is visible
   */
  async isMobileMenuButtonVisible(): Promise<boolean> {
    return await this.mobileMenuButton.isVisible();
  }

  /**
   * Get all visible navigation links (desktop)
   */
  async getDesktopLinks(): Promise<string[]> {
    const links = await this.desktopNav.locator('a').allTextContents();
    return links;
  }

  /**
   * Navigate using mobile menu
   */
  async navigateToWithMobile(linkText: string) {
    await this.toggleMobileMenu();
    await this.page.getByText(linkText, { exact: true }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
