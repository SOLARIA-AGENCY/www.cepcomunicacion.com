import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Courses Page Object
 *
 * Represents the courses catalog page (/cursos)
 * - Course grid
 * - Filtering (future)
 * - Search (future)
 * - Pagination (future)
 */
export class CoursesPage extends BasePage {
  // Selectors
  readonly pageTitle: Locator;
  readonly courseCount: Locator;
  readonly coursesGrid: Locator;
  readonly courseCards: Locator;
  readonly emptyState: Locator;
  readonly ctaSection: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('h1').filter({ hasText: 'Catálogo de Cursos' });
    this.courseCount = page.locator('span.font-semibold');
    this.coursesGrid = page.locator('.grid-fluid-cards');
    this.courseCards = page.locator('article').filter({ has: page.locator('h3') });
    this.emptyState = page.locator('text=No hay cursos disponibles');
    this.ctaSection = page.locator('section').filter({ hasText: '¿No encuentras lo que buscas?' });
  }

  /**
   * Navigate to courses page
   */
  async navigate() {
    await this.goto('/cursos');
  }

  /**
   * Get number of courses displayed
   */
  async getCoursesCount(): Promise<number> {
    return await this.courseCards.count();
  }

  /**
   * Get course count text
   */
  async getCourseCountText(): Promise<string> {
    return await this.courseCount.textContent() || '0';
  }

  /**
   * Click on a specific course card by index
   */
  async clickCourseCard(index: number) {
    await this.courseCards.nth(index).click();
    await this.waitForNavigation();
  }

  /**
   * Click on course card by title
   */
  async clickCourseByTitle(title: string) {
    await this.page.getByRole('heading', { name: title }).click();
    await this.waitForNavigation();
  }

  /**
   * Check if empty state is visible
   */
  async isEmptyStateVisible(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  /**
   * Get all course titles
   */
  async getCourseTitles(): Promise<string[]> {
    const titles = await this.courseCards.locator('h3').allTextContents();
    return titles;
  }

  /**
   * Check if courses grid is visible
   */
  async isCoursesGridVisible(): Promise<boolean> {
    return await this.coursesGrid.isVisible();
  }

  /**
   * Get course card by index
   */
  getCourseCard(index: number): Locator {
    return this.courseCards.nth(index);
  }

  /**
   * Check if course has specific modality badge
   */
  async courseHasModality(index: number, modality: string): Promise<boolean> {
    const card = this.getCourseCard(index);
    const badges = await card.locator('span.badge').allTextContents();
    return badges.some(badge => badge.toLowerCase().includes(modality.toLowerCase()));
  }
}
