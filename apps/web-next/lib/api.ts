/**
 * API Client for CEP Comunicación
 * Handles communication with Payload CMS backend
 */

import { PayloadClient } from './payloadClient';

// Import Course type from shared package
import type { Course as CourseType } from '@cepcomunicacion/types';

// Re-export with original name
export type Course = CourseType;

export interface PaginatedResponse<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage?: number;
  page: number;
  pagingCounter?: number;
  prevPage?: number;
  totalDocs: number;
  totalPages: number;
}

export interface GetCoursesParams {
  page?: number;
  limit?: number;
  featured?: boolean;
  modality?: string;
  cycle?: string;
  search?: string;
}

// Initialize Payload client
const payloadClient = new PayloadClient();

/**
 * Fetch courses from API
 */
export async function getCourses(
  params: GetCoursesParams = {},
): Promise<PaginatedResponse<Course>> {
  try {
    const where: any = {};

    if (params.featured !== undefined) where.featured = { equals: params.featured };
    if (params.modality) where.modality = { equals: params.modality };
    if (params.cycle) where.cycle = { slug: { equals: params.cycle } };
    if (params.search) where.or = [{ name: { contains: params.search } }];

    const response = await payloadClient.find('courses', {
      where,
      limit: params.limit || 10,
      depth: 2,
      sort: '-createdAt',
    });
    return response as PaginatedResponse<Course>;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return {
      docs: [],
      hasNextPage: false,
      hasPrevPage: false,
      limit: params.limit || 10,
      page: 1,
      pagingCounter: 1,
      totalDocs: 0,
      totalPages: 0,
    };
  }
}

/**
 * Fetch a single course by slug
 */
export async function getCourse(slug: string): Promise<Course | null> {
  try {
    const response = await payloadClient.find('courses', {
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    return (response.docs[0] as Course) || null;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

/**
 * Fetch cycles from API
 */
export async function getCycles() {
  try {
    const response = await payloadClient.find('cycles', {
      sort: 'order_display',
    });
    return response.docs;
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return [];
  }
}

/**
 * Fetch campuses from API
 */
export async function getCampuses() {
  try {
    const response = await payloadClient.find('campuses', {
      sort: 'name',
    });
    return response.docs;
  } catch (error) {
    console.error('Error fetching campuses:', error);
    return [];
  }
}
