/**
 * Payload CMS REST API Client
 *
 * Provides typed interface for fetching data from Payload CMS via REST API
 * Decouples frontend from Payload internals (ADR-003)
 */

// Base API URL - uses environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Error class for API errors
 */
export class PayloadAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'PayloadAPIError';
  }
}

/**
 * Generic find query parameters
 */
export interface FindQuery {
  where?: Record<string, any>;
  limit?: number;
  page?: number;
  sort?: string;
  depth?: number;
}

/**
 * Generic API response structure
 */
export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * Minimal type definitions (to avoid dependency on @/payload-types)
 */
export interface Course {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  course_type: 'telematico' | 'ocupados' | 'desempleados' | 'privados' | 'ciclo-medio' | 'ciclo-superior';
  modality: 'presencial' | 'online' | 'hibrido';
  duration_hours?: number;
  base_price?: number;
  price?: number;
  financial_aid_available?: boolean;
  featured?: boolean;
  active: boolean;
  cycle?: string | Cycle;
  campuses?: Array<string | Campus>;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: string;
  name: string;
  slug: string;
  description?: string;
  level: 'medio' | 'superior';
  active: boolean;
}

export interface Campus {
  id: string;
  name: string;
  slug: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  active: boolean;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // Disable caching for dynamic data
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new PayloadAPIError(
        `API error: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof PayloadAPIError) {
      throw error;
    }

    // Network or parsing error
    console.error('Payload API Error:', error);
    throw new PayloadAPIError(
      `Failed to fetch from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Build query string from FindQuery parameters
 */
function buildQueryString(query?: FindQuery): string {
  if (!query) return '';

  const params = new URLSearchParams();

  if (query.where) {
    params.append('where', JSON.stringify(query.where));
  }

  if (query.limit !== undefined) {
    params.append('limit', String(query.limit));
  }

  if (query.page !== undefined) {
    params.append('page', String(query.page));
  }

  if (query.sort) {
    params.append('sort', query.sort);
  }

  if (query.depth !== undefined) {
    params.append('depth', String(query.depth));
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Payload CMS API Client
 */
export const payloadClient = {
  /**
   * Find documents in a collection
   */
  async find<T>(collection: string, query?: FindQuery): Promise<PayloadResponse<T>> {
    const queryString = buildQueryString(query);
    return fetchAPI<PayloadResponse<T>>(`/${collection}${queryString}`);
  },

  /**
   * Find document by ID
   */
  async findById<T>(collection: string, id: string, depth?: number): Promise<T> {
    const queryString = depth !== undefined ? `?depth=${depth}` : '';
    return fetchAPI<T>(`/${collection}/${id}${queryString}`);
  },

  /**
   * Find document by slug
   */
  async findBySlug<T>(collection: string, slug: string, depth?: number): Promise<T | null> {
    const result = await this.find<T>(collection, {
      where: { slug: { equals: slug } },
      limit: 1,
      depth,
    });

    return result.docs[0] || null;
  },

  /**
   * Collection-specific helpers
   */
  courses: {
    async findAll(query?: FindQuery): Promise<PayloadResponse<Course>> {
      return payloadClient.find<Course>('courses', query);
    },

    async findBySlug(slug: string, depth?: number): Promise<Course | null> {
      return payloadClient.findBySlug<Course>('courses', slug, depth);
    },

    async findFeatured(limit = 3): Promise<Course[]> {
      const result = await payloadClient.find<Course>('courses', {
        where: {
          featured: { equals: true },
          active: { equals: true },
        },
        limit,
        depth: 2,
      });
      return result.docs;
    },

    async findActive(query?: FindQuery): Promise<PayloadResponse<Course>> {
      return payloadClient.find<Course>('courses', {
        ...query,
        where: {
          active: { equals: true },
          ...(query?.where || {}),
        },
      });
    },
  },

  cycles: {
    async findAll(query?: FindQuery): Promise<PayloadResponse<Cycle>> {
      return payloadClient.find<Cycle>('cycles', query);
    },

    async findBySlug(slug: string): Promise<Cycle | null> {
      return payloadClient.findBySlug<Cycle>('cycles', slug);
    },
  },

  campuses: {
    async findAll(query?: FindQuery): Promise<PayloadResponse<Campus>> {
      return payloadClient.find<Campus>('campuses', query);
    },

    async findBySlug(slug: string): Promise<Campus | null> {
      return payloadClient.findBySlug<Campus>('campuses', slug);
    },
  },
};

export default payloadClient;
