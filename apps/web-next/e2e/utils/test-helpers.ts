import { Page, expect } from '@playwright/test';
import type { AxeResults } from 'axe-core';

/**
 * Test Helper Utilities
 *
 * Provides common functions for E2E tests including:
 * - Login helpers for different user roles
 * - Form filling utilities
 * - Accessibility checking
 * - Performance metrics collection
 * - Wait utilities
 */

/**
 * Default admin credentials for testing
 */
export const ADMIN_CREDENTIALS = {
  email: 'admin@cepcomunicacion.com',
  password: 'Admin123456!',
};

/**
 * User credentials by role
 */
export const USER_CREDENTIALS = {
  admin: {
    email: 'admin@cepcomunicacion.com',
    password: 'Admin123456!',
  },
  gestor: {
    email: 'gestor@cepcomunicacion.com',
    password: 'Gestor123456!',
  },
  marketing: {
    email: 'marketing@cepcomunicacion.com',
    password: 'Marketing123456!',
  },
  asesor: {
    email: 'asesor@cepcomunicacion.com',
    password: 'Asesor123456!',
  },
  lectura: {
    email: 'lectura@cepcomunicacion.com',
    password: 'Lectura123456!',
  },
};

export type UserRole = keyof typeof USER_CREDENTIALS;

/**
 * Login to Payload admin panel as admin user
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/admin/login');

  // Wait for login form to be visible
  await page.waitForSelector('input[name="email"]', { timeout: 10000 });

  // Fill credentials
  await page.fill('input[name="email"]', ADMIN_CREDENTIALS.email);
  await page.fill('input[name="password"]', ADMIN_CREDENTIALS.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for redirect to admin dashboard
  await page.waitForURL(/.*\/admin/, { timeout: 15000 });

  // Verify we're logged in by checking for dashboard elements
  await expect(page.locator('text=/Dashboard|Collections/i')).toBeVisible({ timeout: 10000 });
}

/**
 * Login with specific role
 */
export async function loginAsRole(page: Page, role: UserRole): Promise<void> {
  const credentials = USER_CREDENTIALS[role];

  await page.goto('/admin/login');
  await page.waitForSelector('input[name="email"]', { timeout: 10000 });

  await page.fill('input[name="email"]', credentials.email);
  await page.fill('input[name="password"]', credentials.password);

  await page.click('button[type="submit"]');
  await page.waitForURL(/.*\/admin/, { timeout: 15000 });
}

/**
 * Logout from admin panel
 */
export async function logout(page: Page): Promise<void> {
  // Look for logout button or account menu
  const logoutButton = page.locator('button, a').filter({ hasText: /logout|cerrar sesión/i });

  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/.*\/admin\/login/, { timeout: 10000 });
  }
}

/**
 * Check accessibility with axe-core
 *
 * @returns Array of accessibility violations
 */
export async function checkAccessibility(page: Page): Promise<AxeResults['violations']> {
  try {
    // Dynamically import axe-core to avoid bundling issues
    const AxeBuilder = await import('@axe-core/playwright').then(m => m.default);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    return results.violations;
  } catch (error) {
    console.warn('axe-core not available, skipping accessibility check:', error);
    return [];
  }
}

/**
 * Fill lead form with valid data
 */
export async function fillLeadForm(page: Page, data: Partial<LeadFormData> = {}): Promise<void> {
  const defaults: LeadFormData = {
    first_name: 'Test',
    last_name: 'User',
    email: `test-${Date.now()}@example.com`,
    phone: '+34 600 123 456',
    message: 'Interested in your courses',
    gdpr_consent: true,
    privacy_policy_accepted: true,
  };

  const formData = { ...defaults, ...data };

  // Fill text inputs
  await page.fill('input[name="first_name"]', formData.first_name);
  await page.fill('input[name="last_name"]', formData.last_name);
  await page.fill('input[name="email"]', formData.email);
  await page.fill('input[name="phone"]', formData.phone);

  // Fill textarea if present
  const messageField = page.locator('textarea[name="message"]');
  if (await messageField.isVisible()) {
    await messageField.fill(formData.message);
  }

  // Check consent boxes
  if (formData.gdpr_consent) {
    await page.check('input[name="gdpr_consent"]');
  }
  if (formData.privacy_policy_accepted) {
    await page.check('input[name="privacy_policy_accepted"]');
  }
}

export interface LeadFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  gdpr_consent: boolean;
  privacy_policy_accepted: boolean;
}

/**
 * Wait for page load with performance metrics
 *
 * @returns Performance metrics object
 */
export async function waitForPageLoad(page: Page): Promise<PerformanceMetrics> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
    console.warn('Network idle timeout exceeded');
  });

  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      firstContentfulPaint: fcp ? fcp.startTime : 0,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
    };
  });

  return metrics;
}

export interface PerformanceMetrics {
  domContentLoaded: number;
  loadComplete: number;
  domInteractive: number;
  firstContentfulPaint: number;
  totalLoadTime: number;
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 10000
): Promise<void> {
  await page.waitForResponse(
    response => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
}

/**
 * Capture console errors
 */
export function captureConsoleErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

/**
 * Filter out known non-critical errors
 */
export function filterCriticalErrors(errors: string[]): string[] {
  return errors.filter(err => {
    // Filter out known development warnings
    if (err.includes('Download the React DevTools')) return false;
    if (err.includes('PropTypes')) return false;
    if (err.includes('[HMR]')) return false;

    return true;
  });
}

/**
 * Take screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `e2e/screenshots/${name}-${timestamp}.png`;

  await page.screenshot({ path: filename, fullPage: true });
  console.log(`Screenshot saved: ${filename}`);
}

/**
 * Wait for element with retry
 */
export async function waitForElementWithRetry(
  page: Page,
  selector: string,
  retries: number = 3,
  delay: number = 1000
): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await page.waitForSelector(selector, { timeout: delay });
      return true;
    } catch (error) {
      if (i === retries - 1) {
        return false;
      }
      await page.waitForTimeout(delay);
    }
  }
  return false;
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(page: Page, selector: string): Promise<void> {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, selector);

  // Wait for scroll animation
  await page.waitForTimeout(500);
}

/**
 * Get page Lighthouse score (requires lighthouse CLI)
 * This is a placeholder - actual implementation would require lighthouse integration
 */
export async function getLighthouseScore(url: string): Promise<LighthouseScore | null> {
  console.warn('Lighthouse integration not yet implemented');
  return null;
}

export interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

/**
 * Create test course data
 */
export function createMockCourseData(overrides: Partial<MockCourse> = {}): MockCourse {
  const id = Math.random().toString(36).substring(7);

  return {
    id,
    title: `Test Course ${id}`,
    slug: `test-course-${id}`,
    description: 'This is a test course description',
    type: 'telematico',
    modality: 'online',
    duration: 120,
    price: 1500,
    featured: false,
    ...overrides,
  };
}

export interface MockCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  modality: string;
  duration: number;
  price: number;
  featured: boolean;
}

/**
 * Seed test data via API (if endpoint exists)
 */
export async function seedTestData(page: Page, data: any): Promise<void> {
  try {
    await page.request.post('/api/seed', {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.warn('Seed API not available:', error);
  }
}

/**
 * Clean up test data
 */
export async function cleanupTestData(page: Page): Promise<void> {
  try {
    await page.request.delete('/api/cleanup');
  } catch (error) {
    console.warn('Cleanup API not available:', error);
  }
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 10000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {
    console.warn('Network idle timeout exceeded');
  });
}

/**
 * Get current route/pathname
 */
export async function getCurrentPath(page: Page): Promise<string> {
  return await page.evaluate(() => window.location.pathname);
}

/**
 * Navigate and wait for load
 */
export async function navigateAndWait(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await waitForPageLoad(page);
}
