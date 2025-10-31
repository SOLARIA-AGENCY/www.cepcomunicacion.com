/**
 * Vitest Setup File
 *
 * Global test configuration and mocks
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock environment variables
process.env.PAYLOAD_SECRET = 'test-secret-32-characters-long-for-testing';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => ({ src, alt, ...props }),
}));

// Extend Vitest matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor} - ${ceiling}`
          : `expected ${received} to be within range ${floor} - ${ceiling}`,
    };
  },
});

// Global test utilities
global.testUtils = {
  createMockCourse: (overrides = {}) => ({
    id: '1',
    name: 'Test Course',
    slug: 'test-course',
    course_type: 'privados',
    modality: 'online',
    duration_hours: 40,
    price: 400,
    active: true,
    featured: false,
    financial_aid_available: false,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    ...overrides,
  }),
  createMockCycle: (overrides = {}) => ({
    id: '1',
    name: 'Test Cycle',
    code: 'TC',
    level: 'ciclo-superior',
    duration_years: 2,
    active: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    ...overrides,
  }),
  createMockCampus: (overrides = {}) => ({
    id: '1',
    name: 'Test Campus',
    code: 'TC',
    city: 'Test City',
    active: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    ...overrides,
  }),
};

// TypeScript declaration for global test utils
declare global {
  var testUtils: {
    createMockCourse: (overrides?: any) => any;
    createMockCycle: (overrides?: any) => any;
    createMockCampus: (overrides?: any) => any;
  };
}
