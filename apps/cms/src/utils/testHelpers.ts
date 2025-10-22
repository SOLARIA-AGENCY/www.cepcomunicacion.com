import { Payload } from 'payload';
import request from 'supertest';
import { Express } from 'express';

export interface TestContext {
  payload: Payload;
  app: Express;
  adminToken: string;
}

/**
 * Creates a test context with Payload instance and Express app
 * This will be fully implemented after payload.config.ts is created
 */
export async function createTestContext(): Promise<TestContext> {
  // This will be implemented after payload.config.ts
  // For now, return a mock to satisfy TypeScript
  throw new Error('createTestContext not yet implemented - will be added with payload.config.ts');
}

/**
 * Authenticates as admin and returns JWT token
 * @param app - Express application instance
 * @returns JWT authentication token
 */
export async function loginAsAdmin(app: Express): Promise<string> {
  const response = await request(app).post('/api/users/login').send({
    email: 'admin@cepcomunicacion.com',
    password: 'admin123',
  });

  if (!response.body.token) {
    throw new Error('Failed to login as admin - no token returned');
  }

  return response.body.token;
}

/**
 * Authenticates as a specific role and returns JWT token
 * @param app - Express application instance
 * @param role - User role to login as
 * @returns JWT authentication token
 */
export async function loginAsRole(app: Express, role: string): Promise<string> {
  const credentials: Record<string, { email: string; password: string }> = {
    admin: { email: 'admin@cepcomunicacion.com', password: 'admin123' },
    gestor: { email: 'gestor@cepcomunicacion.com', password: 'gestor123' },
    marketing: { email: 'marketing@cepcomunicacion.com', password: 'marketing123' },
    asesor: { email: 'asesor@cepcomunicacion.com', password: 'asesor123' },
    lectura: { email: 'lectura@cepcomunicacion.com', password: 'lectura123' },
  };

  const creds = credentials[role];
  if (!creds) {
    throw new Error(`Unknown role: ${role}`);
  }

  const response = await request(app).post('/api/users/login').send(creds);

  if (!response.body.token) {
    throw new Error(`Failed to login as ${role} - no token returned`);
  }

  return response.body.token;
}

/**
 * Creates a test cycle for testing purposes
 * @param payload - Payload instance
 * @returns Created cycle document
 */
export async function createTestCycle(payload: Payload) {
  return await payload.create({
    collection: 'cycles',
    data: {
      slug: 'test-cycle',
      name: 'Test Cycle',
      level: 'grado_medio',
      description: 'Test description',
    },
  });
}

/**
 * Creates a test campus for testing purposes
 * @param payload - Payload instance
 * @returns Created campus document
 */
export async function createTestCampus(payload: Payload) {
  return await payload.create({
    collection: 'campuses',
    data: {
      slug: 'test-campus',
      name: 'Test Campus',
      address: '123 Test Street',
      city: 'Test City',
      postal_code: '28001',
      province: 'Madrid',
    },
  });
}

/**
 * Creates a test course for testing purposes
 * @param payload - Payload instance
 * @param cycleId - ID of the cycle to associate with
 * @returns Created course document
 */
export async function createTestCourse(payload: Payload, cycleId: string) {
  return await payload.create({
    collection: 'courses',
    data: {
      slug: 'test-course',
      name: 'Test Course',
      code: 'TEST001',
      cycle: cycleId,
      description: 'Test course description',
    },
  });
}

/**
 * Cleans up test data from a collection
 * @param payload - Payload instance
 * @param collection - Collection name to clean
 */
export async function cleanupCollection(payload: Payload, collection: string) {
  const items = await payload.find({
    collection: collection as any,
    limit: 1000,
  });

  for (const item of items.docs) {
    await payload.delete({
      collection: collection as any,
      id: item.id,
    });
  }
}
