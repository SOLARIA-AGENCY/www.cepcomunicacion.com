import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object
 *
 * Represents the homepage (/) with all its elements and actions
 * - Hero section
 * - Featured courses
 * - Features section
 * - CTA section
 */
export class HomePage extends BasePage {
  // Selectors
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly viewCoursesButton: Locator;
  readonly contactButton: Locator;
  readonly featuredCoursesSection: Locator;
  readonly featuredCoursesTitle: Locator;
  readonly courseCards: Locator;
  readonly viewAllCoursesLink: Locator;
  readonly featuresSection: Locator;
  readonly ctaSection: Locator;

  constructor(page: Page) {
    super(page);

    // Hero section elements
    this.heroTitle = page.locator('h1').filter({ hasText: 'Formación Profesional de Calidad' });
    this.heroSubtitle = page.locator('p').filter({ hasText: 'Cursos presenciales, online' });
    this.viewCoursesButton = page.getByRole('link', { name: 'Ver Cursos' });
    this.contactButton = page.getByRole('link', { name: 'Solicitar Información' }).first();

    // Featured courses section
    this.featuredCoursesSection = page.locator('section').filter({ hasText: 'Cursos Destacados' });
    this.featuredCoursesTitle = page.locator('h2').filter({ hasText: 'Cursos Destacados' });
    this.courseCards = page.locator('article').filter({ has: page.locator('h3') });
    this.viewAllCoursesLink = page.getByRole('link', { name: 'Ver todos los cursos' });

    // Features section
    this.featuresSection = page.locator('section').filter({ hasText: 'Formación de Calidad' });

    // CTA section
    this.ctaSection = page.locator('section').filter({ hasText: '¿Listo para dar el siguiente paso?' });
  }

  /**
   * Navigate to homepage
   */
  async navigate() {
    await this.goto('/');
  }

  /**
   * Check if hero section is visible
   */
  async isHeroVisible(): Promise<boolean> {
    return await this.heroTitle.isVisible();
  }

  /**
   * Click "Ver Cursos" button in hero
   */
  async clickViewCourses() {
    await this.viewCoursesButton.click();
    await this.waitForNavigation();
  }

  /**
   * Click "Solicitar Información" button
   */
  async clickContactButton() {
    await this.contactButton.click();
    await this.waitForNavigation();
  }

  /**
   * Get number of featured courses displayed
   */
  async getFeaturedCoursesCount(): Promise<number> {
    return await this.courseCards.count();
  }

  /**
   * Click on a specific course card by index
   */
  async clickCourseCard(index: number) {
    await this.courseCards.nth(index).click();
    await this.waitForNavigation();
  }

  /**
   * Click "Ver todos los cursos" link
   */
  async clickViewAllCourses() {
    await this.viewAllCoursesLink.click();
    await this.waitForNavigation();
  }

  /**
   * Check if featured courses section has content
   */
  async hasFeaturedCourses(): Promise<boolean> {
    const count = await this.getFeaturedCoursesCount();
    return count > 0;
  }

  /**
   * Get all feature titles
   */
  async getFeatureTitles(): Promise<string[]> {
    const features = await this.featuresSection.locator('h3').allTextContents();
    return features;
  }

  /**
   * Check if CTA section is visible
   */
  async isCtaVisible(): Promise<boolean> {
    return await this.ctaSection.isVisible();
  }
}
