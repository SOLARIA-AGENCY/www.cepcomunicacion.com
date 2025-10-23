/**
 * TypeScript Types for CEP Formación Frontend
 *
 * These types match the Payload CMS collections schema
 * They will be updated to use auto-generated types from Payload in Phase 3
 */

/**
 * Course Types
 */
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  cycle: Cycle | string;
  campuses?: (Campus | string)[];
  modality: 'presencial' | 'online' | 'hibrido';
  duration_hours?: number;
  price?: number;
  financial_aid_available: boolean;
  featured: boolean;
  active: boolean;
  meta_title?: string;
  meta_description?: string;
  featured_image?: Media | string;
  created_by: User | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Course Run (Scheduled Instance)
 */
export interface CourseRun {
  id: string;
  course: Course | string;
  campus?: Campus | string;
  start_date: string;
  end_date: string;
  enrollment_deadline: string;
  status: 'draft' | 'published' | 'enrollment_open' | 'in_progress' | 'completed' | 'cancelled';
  min_students: number;
  max_students: number;
  current_enrollments: number;
  price_override?: number;
  schedule_days?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  schedule_time_start?: string;
  schedule_time_end?: string;
  created_by: User | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Campus / Site
 */
export interface Campus {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  postal_code: string;
  province: string;
  country: string;
  phone: string;
  email: string;
  active: boolean;
  created_by: User | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cycle (Educational Program)
 */
export interface Cycle {
  id: string;
  name: string;
  slug: string;
  description?: string;
  level: 'fp_basica' | 'grado_medio' | 'grado_superior';
  active: boolean;
  created_by: User | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lead (Prospective Student)
 */
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  course?: Course | string;
  campus?: Campus | string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assigned_to?: User | string;
  gdpr_consent: boolean;
  privacy_policy_accepted: boolean;
  consent_timestamp?: string;
  consent_ip_address?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Blog Post
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any; // Lexical editor content
  featured_image?: Media | string;
  author: User | string;
  status: 'draft' | 'published';
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
  created_by: User | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * FAQ (Frequently Asked Question)
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  active: boolean;
  created_by: User | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Media (File Upload)
 */
export interface Media {
  id: string;
  filename: string;
  alt: string;
  caption?: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  url: string;
  sizes?: {
    thumbnail?: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
    card?: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
    hero?: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
  };
  folder?: string;
  focalX?: number;
  focalY?: number;
  created_by: User | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User (CMS User)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'gestor' | 'marketing' | 'asesor' | 'lectura';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response Wrappers
 */
export interface PaginatedResponse<T> {
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

export interface SingleResponse<T> {
  doc: T;
}

/**
 * Form Types
 */
export interface LeadFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  course?: string; // Course ID
  campus?: string; // Campus ID
  message?: string;
  gdpr_consent: boolean;
  privacy_policy_accepted: boolean;
}

export interface LeadFormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  course?: string;
  campus?: string;
  message?: string;
  gdpr_consent?: string;
  privacy_policy_accepted?: string;
  general?: string;
}

/**
 * Filter Types
 */
export interface CourseFilters {
  cycle?: string;
  campus?: string;
  modality?: 'presencial' | 'online' | 'hibrido';
  featured?: boolean;
  search?: string;
}

/**
 * Utility Types
 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingState<T = any> {
  status: Status;
  data: T | null;
  error: string | null;
}
