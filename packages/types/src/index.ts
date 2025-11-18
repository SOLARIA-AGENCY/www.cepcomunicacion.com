/**
 * Shared TypeScript types for CEP Comunicación
 * Unified type definitions used across frontend, CMS, and admin applications
 */

// Base entity interface
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}

// Course Types
export interface Cycle extends BaseEntity {
  name: string;
  code: string;
  slug: string;
  level?: 'grado_medio' | 'grado_superior';
}

export interface Course extends BaseEntity {
  code: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  short_description?: string; // Legacy field name
  type: CourseType;
  area: CourseArea;
  duration: number;
  duration_hours?: number; // Legacy field name
  price: number;
  base_price?: number; // Legacy field name
  subsidyPercentage?: number;
  featured: boolean;
  active: boolean;
  image?: string;
  featured_image?: string; // Legacy field name for compatibility
  gallery?: string[];
  requirements?: string[];
  objectives?: string[];
  methodology?: string;
  evaluation?: string;
  certification?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  modality?: 'presencial' | 'online' | 'hibrido';
  financial_aid_available?: boolean; // Legacy field name
  course_type?: string; // Legacy field name
  cycle?: string | number | Cycle;
  campuses?: (string | Center)[];
  courseRuns?: CourseRun[];
  course_runs?: CourseRun[]; // Legacy field name for compatibility
}

export interface CourseRun extends BaseEntity {
  course: string | Course;
  startDate: string;
  endDate: string;
  schedule: string;
  location: string;
  maxStudents: number;
  currentStudents: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  price?: number;
  subsidyPercentage?: number;
}

export enum CourseType {
  PRIVATE = 'private',
  OCCUPIED = 'occupied',
  UNEMPLOYED = 'unemployed',
  TELETRAINING = 'teletraining',
}

export enum CourseArea {
  COMPUTING = 'computing',
  COMMUNICATION = 'communication',
  BUSINESS = 'business',
  LANGUAGES = 'languages',
  HEALTH = 'health',
  INDUSTRY = 'industry',
}

// Course Categories
export interface CourseCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parent?: string | CourseCategory;
  courses?: string[] | Course[];
}

// Center/Campus Types
export interface Center extends BaseEntity {
  name: string;
  slug: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone?: string;
  email?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  image?: string;
  description?: string;
  facilities?: string[];
  schedule?: string;
  active: boolean;
  featured: boolean;
}

// Blog Types
export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: string | User;
  categories?: string[] | BlogCategory[];
  tags?: string[];
  published: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface BlogCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parent?: string | BlogCategory;
  posts?: string[] | BlogPost[];
}

// User Types
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
  profile?: {
    bio?: string;
    avatar?: string;
    phone?: string;
  };
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  AUTHOR = 'author',
  STUDENT = 'student',
}

// Team Types
export interface TeamMember extends BaseEntity {
  name: string;
  slug: string;
  position: string;
  department?: string;
  bio?: string;
  photo?: string;
  email?: string;
  phone?: string;
  order?: number;
  active: boolean;
  featured: boolean;
}

// Testimonial Types
export interface Testimonial extends BaseEntity {
  name: string;
  content: string;
  rating: number;
  course?: string | Course;
  approved: boolean;
  featured: boolean;
}

// FAQ Types
export interface FAQ extends BaseEntity {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  active: boolean;
}

// Configuration Types
export interface SiteConfig extends BaseEntity {
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  ogImage?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo?: {
    titleTemplate?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  totalPages?: number;
  docs?: T[];
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  consent: boolean;
}

export interface CourseApplicationForm {
  course: string;
  name: string;
  email: string;
  phone: string;
  dni: string;
  birthDate: string;
  address: string;
  education: string;
  experience?: string;
  motivation: string;
  consent: boolean;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
  external?: boolean;
  order?: number;
  active?: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  type?: CourseType[];
  area?: CourseArea[];
  priceMin?: number;
  priceMax?: number;
  duration?: number;
  featured?: boolean;
  active?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type ID = string;

// Re-export commonly used Payload types (when available)
// export type { PayloadRequest } from 'payload';
// export type { CollectionConfig, GlobalConfig } from 'payload/config';
