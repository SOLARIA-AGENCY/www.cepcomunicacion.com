/**
 * Payload CMS REST API Client
 *
 * Production-ready HTTP client for consuming Payload CMS REST API endpoints.
 * Replaces direct Payload SDK usage to eliminate PostgreSQL schema conflicts.
 *
 * @module payloadClient
 * @see https://payloadcms.com/docs/rest-api/overview
 */

/**
 * Options for finding documents in a collection
 */
export interface PayloadFindOptions {
  /** MongoDB-style where query for filtering documents */
  where?: Record<string, any>;
  /** Maximum number of documents to return */
  limit?: number;
  /** Depth of relationship population (0-10) */
  depth?: number;
  /** Field to sort by (prefix with - for descending) */
  sort?: string;
}

/**
 * Standard Payload API response structure for collection queries
 */
export interface PayloadResponse<T> {
  /** Array of documents matching the query */
  docs: T[];
  /** Total number of documents matching the query */
  totalDocs: number;
  /** Maximum documents per page */
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
 * HTTP Client for Payload CMS REST API
 *
 * Provides methods to query Payload collections via REST endpoints.
 * Handles query parameter construction, error handling, and TypeScript typing.
 *
 * @example
 * ```typescript
 * // Fetch featured courses
 * const data = await payloadClient.find('courses', {
 *   where: { featured: { equals: true }, active: { equals: true } },
 *   limit: 3,
 *   depth: 2
 * });
 * console.log(data.docs); // Course[]
 *
 * // Fetch course by ID
 * const course = await payloadClient.findByID('courses', 123, 3);
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
  }

  /**
   * Find documents in a collection
   *
   * Queries a Payload collection with optional filtering, pagination, and relationship population.
   *
   * @template T - Type of documents in the collection
   * @param collection - Name of the Payload collection (e.g., 'courses', 'cycles')
   * @param options - Query options (where, limit, depth, sort)
   * @returns Promise resolving to Payload response with docs array and metadata
   * @throws Error if API request fails
   *
   * @example
   * ```typescript
   * const coursesData = await payloadClient.find('courses', {
   *   where: { slug: { equals: 'desarrollo-web' } },
   *   limit: 1,
   *   depth: 3
   * });
   * const course = coursesData.docs[0];
   * ```
   */
  async find<T>(
    collection: string,
    options: PayloadFindOptions
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
        cache: 'no-store', // Disable caching for SSR
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${collection}: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
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
   * Find a single document by ID
   *
   * Retrieves a specific document from a collection by its unique identifier.
   *
   * @template T - Type of the document
   * @param collection - Name of the Payload collection
   * @param id - Document ID (can be string or number)
   * @param depth - Depth of relationship population (default: 0)
   * @returns Promise resolving to the document
   * @throws Error if document not found or API request fails
   *
   * @example
   * ```typescript
   * const course = await payloadClient.findByID('courses', 123, 3);
   * console.log(course.name);
   * ```
   */
  async findByID<T>(
    collection: string,
    id: string | number,
    depth: number = 0
  ): Promise<T> {
    const url = `${this.baseUrl}/api/${collection}/${id}?depth=${depth}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${collection} with ID ${id}: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch ${collection} with ID ${id}: ${error.message} (URL: ${url})`
        );
      }
      throw error;
    }
  }
}

/**
 * Singleton instance of PayloadClient
 *
 * Use this instance throughout your application for all Payload API requests.
 *
 * @example
 * ```typescript
 * import { payloadClient } from '@/lib/payloadClient';
 *
 * const courses = await payloadClient.find('courses', { limit: 10 });
 * ```
 */
export const payloadClient = new PayloadClient();
