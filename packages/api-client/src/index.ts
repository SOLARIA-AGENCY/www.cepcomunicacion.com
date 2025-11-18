/**
 * Shared API Client for CEP Comunicación
 * Unified API client for communicating with Payload CMS backend
 */

import type {
  Course,
  CourseRun,
  CourseType,
  CourseArea,
  Center,
  BlogPost,
  BlogCategory,
  User,
  TeamMember,
  Testimonial,
  FAQ,
  SiteConfig,
  ApiResponse,
  ApiError,
  SearchFilters,
  PaginationParams,
  ContactForm,
  CourseApplicationForm,
} from '@cepcomunicacion/types';

export class PayloadClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string = 'http://localhost:3001', headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch ${endpoint}: ${error.message} (URL: ${url})`);
      }
      throw error;
    }
  }

  // Generic CRUD operations
  async find<T>(
    collection: string,
    params: {
      where?: Record<string, any>;
      sort?: string;
      limit?: number;
      page?: number;
      depth?: number;
    } = {},
  ): Promise<ApiResponse<T>> {
    const searchParams = new URLSearchParams();

    if (params.where) {
      searchParams.set('where', JSON.stringify(params.where));
    }
    if (params.sort) {
      searchParams.set('sort', params.sort);
    }
    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }
    if (params.page) {
      searchParams.set('page', params.page.toString());
    }
    if (params.depth) {
      searchParams.set('depth', params.depth.toString());
    }

    const query = searchParams.toString();
    const endpoint = `/api/${collection}${query ? `?${query}` : ''}`;

    return this.request<ApiResponse<T>>(endpoint);
  }

  async findById<T>(collection: string, id: string, depth: number = 2): Promise<T> {
    return this.request<T>(`/api/${collection}/${id}?depth=${depth}`);
  }

  async findBySlug<T>(collection: string, slug: string, depth: number = 2): Promise<T> {
    const where = { slug: { equals: slug } };
    const result = await this.find<T>(collection, { where, limit: 1, depth });

    if (result.docs && result.docs.length > 0) {
      return result.docs[0];
    }

    throw new Error(`${collection} with slug "${slug}" not found`);
  }

  async create<T>(collection: string, data: Partial<T>): Promise<T> {
    return this.request<T>(`/api/${collection}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T> {
    return this.request<T>(`/api/${collection}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(collection: string, id: string): Promise<void> {
    await this.request(`/api/${collection}/${id}`, {
      method: 'DELETE',
    });
  }

  // Course-specific methods
  async getCourses(
    params: {
      type?: CourseType;
      area?: CourseArea;
      featured?: boolean;
      active?: boolean;
      limit?: number;
      page?: number;
    } = {},
  ): Promise<ApiResponse<Course>> {
    const where: Record<string, any> = {};

    if (params.type) where.type = { equals: params.type };
    if (params.area) where.area = { equals: params.area };
    if (params.featured !== undefined) where.featured = { equals: params.featured };
    if (params.active !== undefined) where.active = { equals: params.active };

    return this.find<Course>('courses', {
      where,
      limit: params.limit,
      page: params.page,
      sort: '-createdAt',
      depth: 2,
    });
  }

  async getCourseBySlug(slug: string): Promise<Course> {
    return this.findBySlug<Course>('courses', slug);
  }

  async getFeaturedCourses(limit: number = 3): Promise<ApiResponse<Course>> {
    return this.getCourses({
      featured: true,
      active: true,
      limit,
    });
  }

  async getCoursesByType(type: CourseType, limit?: number): Promise<ApiResponse<Course>> {
    return this.getCourses({ type, active: true, limit });
  }

  async getCoursesByArea(area: CourseArea, limit?: number): Promise<ApiResponse<Course>> {
    return this.getCourses({ area, active: true, limit });
  }

  async searchCourses(query: string, limit: number = 10): Promise<ApiResponse<Course>> {
    const where = {
      or: [
        { name: { like: query } },
        { description: { like: query } },
        { shortDescription: { like: query } },
      ],
      active: { equals: true },
    };

    return this.find<Course>('courses', {
      where,
      limit,
      sort: '-featured',
      depth: 2,
    });
  }

  // Course Run methods
  async getCourseRuns(courseId?: string): Promise<ApiResponse<CourseRun>> {
    const where = courseId ? { course: { equals: courseId } } : {};

    return this.find<CourseRun>('course-runs', {
      where,
      sort: 'startDate',
      depth: 1,
    });
  }

  // Center methods
  async getCenters(featured?: boolean): Promise<ApiResponse<Center>> {
    const where: Record<string, any> = { active: { equals: true } };
    if (featured !== undefined) where.featured = { equals: featured };

    return this.find<Center>('centers', {
      where,
      sort: 'name',
      depth: 1,
    });
  }

  async getCenterBySlug(slug: string): Promise<Center> {
    return this.findBySlug<Center>('centers', slug);
  }

  // Blog methods
  async getBlogPosts(published: boolean = true, limit?: number): Promise<ApiResponse<BlogPost>> {
    const where = { published: { equals: published } };

    return this.find<BlogPost>('posts', {
      where,
      limit,
      sort: '-publishedAt',
      depth: 2,
    });
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return this.findBySlug<BlogPost>('posts', slug);
  }

  async getBlogCategories(): Promise<ApiResponse<BlogCategory>> {
    return this.find<BlogCategory>('categories', {
      sort: 'name',
      depth: 1,
    });
  }

  // Team methods
  async getTeamMembers(featured?: boolean): Promise<ApiResponse<TeamMember>> {
    const where: Record<string, any> = { active: { equals: true } };
    if (featured !== undefined) where.featured = { equals: featured };

    return this.find<TeamMember>('team-members', {
      where,
      sort: 'order',
      depth: 1,
    });
  }

  // Testimonial methods
  async getTestimonials(
    approved: boolean = true,
    featured?: boolean,
  ): Promise<ApiResponse<Testimonial>> {
    const where: Record<string, any> = { approved: { equals: approved } };
    if (featured !== undefined) where.featured = { equals: featured };

    return this.find<Testimonial>('testimonials', {
      where,
      sort: '-createdAt',
      depth: 2,
    });
  }

  // FAQ methods
  async getFAQs(category?: string): Promise<ApiResponse<FAQ>> {
    const where: Record<string, any> = { active: { equals: true } };
    if (category) where.category = { equals: category };

    return this.find<FAQ>('faqs', {
      where,
      sort: 'order',
      depth: 1,
    });
  }

  // Site configuration
  async getSiteConfig(): Promise<SiteConfig> {
    return this.request<SiteConfig>('/api/globals/site-config');
  }

  // Form submissions
  async submitContactForm(data: ContactForm): Promise<void> {
    await this.request('/api/forms/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitCourseApplication(data: CourseApplicationForm): Promise<void> {
    await this.request('/api/forms/course-application', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Authentication (if implemented)
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    await this.request('/api/users/logout', {
      method: 'POST',
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/api/users/me');
  }

  // Utility methods
  setAuthToken(token: string): void {
    this.headers.Authorization = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.headers.Authorization;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

// Create default client instance
export const createPayloadClient = (baseUrl?: string, headers?: Record<string, string>) => {
  return new PayloadClient(baseUrl, headers);
};

// Export singleton instance for convenience
export const payloadClient = new PayloadClient();

export default PayloadClient;
