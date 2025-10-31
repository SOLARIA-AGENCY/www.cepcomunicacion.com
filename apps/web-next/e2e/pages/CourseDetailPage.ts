import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Course Detail Page Object
 *
 * Represents individual course detail page (/cursos/[slug])
 * - Course metadata display
 * - Lead capture form
 * - Related courses
 * - Breadcrumbs
 */
export class CourseDetailPage extends BasePage {
  // Selectors
  readonly courseTitle: Locator;
  readonly courseDescription: Locator;
  readonly courseModality: Locator;
  readonly courseDuration: Locator;
  readonly courseType: Locator;
  readonly leadForm: Locator;
  readonly relatedCoursesSection: Locator;
  readonly breadcrumbs: Locator;
  readonly notFoundMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.courseTitle = page.locator('h1');
    this.courseDescription = page.locator('[data-testid="course-description"]');
    this.courseModality = page.locator('[data-testid="course-modality"]');
    this.courseDuration = page.locator('[data-testid="course-duration"]');
    this.courseType = page.locator('[data-testid="course-type"]');
    this.leadForm = page.locator('form[data-testid="lead-form"]');
    this.relatedCoursesSection = page.locator('section').filter({ hasText: 'Cursos Relacionados' });
    this.breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
    this.notFoundMessage = page.locator('text=Curso no encontrado');
  }

  /**
   * Navigate to course detail by slug
   */
  async navigate(slug: string) {
    await this.goto(`/cursos/${slug}`);
  }

  /**
   * Get course title
   */
  async getCourseTitle(): Promise<string> {
    return await this.courseTitle.textContent() || '';
  }

  /**
   * Check if course metadata is visible
   */
  async isMetadataVisible(): Promise<boolean> {
    const titleVisible = await this.courseTitle.isVisible();
    return titleVisible;
  }

  /**
   * Check if lead form is visible
   */
  async isLeadFormVisible(): Promise<boolean> {
    return await this.leadForm.isVisible();
  }

  /**
   * Check if related courses section is visible
   */
  async hasRelatedCourses(): Promise<boolean> {
    try {
      return await this.relatedCoursesSection.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if breadcrumbs are visible
   */
  async hasBreadcrumbs(): Promise<boolean> {
    try {
      return await this.breadcrumbs.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if 404 message is shown
   */
  async isNotFound(): Promise<boolean> {
    try {
      return await this.notFoundMessage.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  /**
   * Get course modality text
   */
  async getModality(): Promise<string> {
    try {
      return await this.courseModality.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Get course duration text
   */
  async getDuration(): Promise<string> {
    try {
      return await this.courseDuration.textContent() || '';
    } catch {
      return '';
    }
  }
}
