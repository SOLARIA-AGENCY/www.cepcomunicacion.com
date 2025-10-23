/**
 * API Client for Payload CMS Backend
 *
 * Handles all HTTP requests to the Payload CMS REST API
 * Base URL is proxied through Vite dev server to avoid CORS issues
 */

import type { PaginatedResponse, SingleResponse } from '@types/index';

/**
 * API Configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * API Client Configuration
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Generic HTTP Client
 */
class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Generic request method
   */
  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...init } = config;
    const url = this.buildURL(endpoint, params);

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...defaultHeaders,
          ...init.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

/**
 * Export singleton instance
 */
export const apiClient = new APIClient(API_BASE_URL);

/**
 * Collection-specific API methods
 */

/**
 * Courses API
 */
export const coursesAPI = {
  /**
   * Get all courses with optional filters
   */
  async getAll(params?: {
    cycle?: string;
    campus?: string;
    modality?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<PaginatedResponse<any>>('/courses', params);
  },

  /**
   * Get single course by slug
   */
  async getBySlug(slug: string) {
    return apiClient.get<any>(`/courses/${slug}`);
  },

  /**
   * Get single course by ID
   */
  async getById(id: string) {
    return apiClient.get<any>(`/courses/${id}`);
  },
};

/**
 * Course Runs API
 */
export const courseRunsAPI = {
  /**
   * Get all course runs
   */
  async getAll(params?: {
    course?: string;
    campus?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<PaginatedResponse<any>>('/course-runs', params);
  },

  /**
   * Get course runs for a specific course
   */
  async getByCourse(courseId: string) {
    return apiClient.get<PaginatedResponse<any>>('/course-runs', {
      'where[course][equals]': courseId,
      'where[status][in]': 'enrollment_open,in_progress',
    });
  },
};

/**
 * Campuses API
 */
export const campusesAPI = {
  /**
   * Get all active campuses
   */
  async getAll() {
    return apiClient.get<PaginatedResponse<any>>('/campuses', {
      'where[active][equals]': true,
    });
  },

  /**
   * Get single campus by slug
   */
  async getBySlug(slug: string) {
    return apiClient.get<any>(`/campuses/${slug}`);
  },
};

/**
 * Cycles API
 */
export const cyclesAPI = {
  /**
   * Get all active cycles
   */
  async getAll() {
    return apiClient.get<PaginatedResponse<any>>('/cycles', {
      'where[active][equals]': true,
    });
  },
};

/**
 * Leads API
 */
export const leadsAPI = {
  /**
   * Create new lead (form submission)
   */
  async create(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    course?: string;
    campus?: string;
    message?: string;
    gdpr_consent: boolean;
    privacy_policy_accepted: boolean;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  }) {
    return apiClient.post<SingleResponse<any>>('/leads', data);
  },
};

/**
 * Blog Posts API
 */
export const blogAPI = {
  /**
   * Get all published blog posts
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    tag?: string;
  }) {
    return apiClient.get<PaginatedResponse<any>>('/blog-posts', {
      'where[status][equals]': 'published',
      ...params,
    });
  },

  /**
   * Get single blog post by slug
   */
  async getBySlug(slug: string) {
    return apiClient.get<any>(`/blog-posts/${slug}`);
  },
};

/**
 * FAQs API
 */
export const faqsAPI = {
  /**
   * Get all active FAQs
   */
  async getAll(params?: {
    category?: string;
  }) {
    return apiClient.get<PaginatedResponse<any>>('/faqs', {
      'where[active][equals]': true,
      sort: 'order',
      ...params,
    });
  },
};

/**
 * Media API
 */
export const mediaAPI = {
  /**
   * Get media file by ID
   */
  async getById(id: string) {
    return apiClient.get<any>(`/media/${id}`);
  },
};

/**
 * Export all APIs as a single object
 */
export const api = {
  courses: coursesAPI,
  courseRuns: courseRunsAPI,
  campuses: campusesAPI,
  cycles: cyclesAPI,
  leads: leadsAPI,
  blog: blogAPI,
  faqs: faqsAPI,
  media: mediaAPI,
};

export default api;
