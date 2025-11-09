/**
 * Payload CMS REST API Client
 *
 * Production-ready HTTP client for consuming Payload CMS REST API.
 * Implements ADR-003 architecture decision to decouple frontend from direct database access.
 *
 * @module payloadClient
 * @see docs/ADR/ADR-003-frontend-rest-api-refactor.md
 */

/**
 * Options for querying Payload collections
 */
export interface PayloadFindOptions {
  /** MongoDB-style query object for filtering documents */
  where?: Record<string, any>;
  /** Maximum number of documents to return */
  limit?: number;
  /** Depth of relationship population (0-10) */
  depth?: number;
  /** Field name to sort by, prefix with '-' for descending */
  sort?: string;
}

/**
 * Payload API response structure for collection queries
 */
export interface PayloadResponse<T> {
  /** Array of matching documents */
  docs: T[];
  /** Total number of matching documents */
  totalDocs: number;
  /** Number of documents per page */
  limit: number;
  /** Current page number */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPrevPage: boolean;
}

/**
 * Payload CMS REST API Client
 *
 * Provides type-safe methods for querying Payload collections via REST API.
 * Uses native fetch() with Next.js-optimized cache strategies.
 *
 * @example
 * ```typescript
 * // Fetch featured courses
 * const response = await payloadClient.find<Course>('courses', {
 *   where: { featured: { equals: true }, active: { equals: true } },
 *   limit: 3,
 *   depth: 2
 * });
 *
 * // Fetch course by ID
 * const course = await payloadClient.findByID<Course>('courses', '123', 3);
 * ```
 */
export class PayloadClient {
  private baseUrl: string;

  /**
   * Creates a new PayloadClient instance
   *
   * @param baseUrl - Base URL of the Payload CMS API (defaults to NEXT_PUBLIC_CMS_URL or http://cms:3000)
   */
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_CMS_URL || 'http://cms:3000';
    // Remove trailing slash for consistent URL construction
    this.baseUrl = this.baseUrl.replace(/\/$/, '');
  }

  /**
   * Fetch multiple documents from a Payload collection
   *
   * @template T - The type of documents in the collection
   * @param collection - Name of the Payload collection
   * @param options - Query options (where, limit, depth, sort)
   * @returns Promise resolving to Payload response with docs and pagination metadata
   * @throws Error if the API request fails
   *
   * @example
   * ```typescript
   * const data = await payloadClient.find<Course>('courses', {
   *   where: { slug: { equals: 'desarrollo-web' } },
   *   limit: 1,
   *   depth: 3
   * });
   * console.log(data.docs[0]); // Course object
   * ```
   */
  async find<T>(
    collection: string,
    options: PayloadFindOptions = {}
  ): Promise<PayloadResponse<T>> {
    const params = new URLSearchParams();

    // Construct query parameters
    if (options.where) {
      params.append('where', JSON.stringify(options.where));
    }
    if (options.limit !== undefined) {
      params.append('limit', options.limit.toString());
    }
    if (options.depth !== undefined) {
      params.append('depth', options.depth.toString());
    }
    if (options.sort) {
      params.append('sort', options.sort);
    }

    const queryString = params.toString();
    const url = `${this.baseUrl}/api/${collection}${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Use no-store cache strategy for dynamic SSR data
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${collection}: ${response.status} ${response.statusText} (URL: ${url})`
        );
      }

      const data: PayloadResponse<T> = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch ${collection}: ${error.message} (URL: ${url})`
        );
      }
      throw error;
    }
  }

  /**
   * Fetch a single document by ID from a Payload collection
   *
   * @template T - The type of the document
   * @param collection - Name of the Payload collection
   * @param id - Document ID (string or number)
   * @param depth - Depth of relationship population (default: 0)
   * @returns Promise resolving to the document
   * @throws Error if the API request fails or document not found
   *
   * @example
   * ```typescript
   * const course = await payloadClient.findByID<Course>('courses', '507f1f77bcf86cd799439011', 2);
   * console.log(course.title); // "Desarrollo Web Full Stack"
   * ```
   */
  async findByID<T>(
    collection: string,
    id: string | number,
    depth: number = 0
  ): Promise<T> {
    const params = new URLSearchParams();

    if (depth > 0) {
      params.append('depth', depth.toString());
    }

    const queryString = params.toString();
    const url = `${this.baseUrl}/api/${collection}/${id}${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Use no-store cache strategy for dynamic SSR data
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${collection}/${id}: ${response.status} ${response.statusText} (URL: ${url})`
        );
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch ${collection}/${id}: ${error.message} (URL: ${url})`
        );
      }
      throw error;
    }
  }
}

/**
 * Singleton instance of PayloadClient
 *
 * Use this instance throughout the application for consistent configuration.
 *
 * @example
 * ```typescript
 * import { payloadClient } from '@/lib/payloadClient';
 *
 * const courses = await payloadClient.find('courses', { limit: 10 });
 * ```
 */
export const payloadClient = new PayloadClient();
