/**
 * Minimal TypeScript types for Payload CMS API responses
 * Based on actual CMS schema (apps/cms/src/collections)
 *
 * Created as part of ADR-003 migration to Vite frontend
 * These types replace the auto-generated Payload types that were
 * previously available in the Next.js integration.
 */

export interface Course {
  id: number;
  slug: string;
  name: string;

  // Description
  short_description?: string;
  long_description?: any; // Rich text (Slate JSON)

  // Relationships
  cycle: number | Cycle;
  campuses?: (number | Campus)[];
  featured_image?: number | Media;
  course_runs?: (number | CourseRun)[]; // Active course offerings

  // Course details
  modality: 'presencial' | 'online' | 'hibrido';
  course_type?: 'privado' | 'ocupados' | 'desempleados' | 'teleformacion' | 'ciclo_medio' | 'ciclo_superior';
  area?: 'sanitaria' | 'horeca' | 'salud' | 'tecnologia' | 'audiovisual' | 'administracion' | 'marketing' | 'educacion';
  duration_hours?: number;
  base_price?: number;
  financial_aid_available?: boolean;

  // Flags
  active?: boolean;
  featured?: boolean;

  // SEO
  meta_title?: string;
  meta_description?: string;

  // Metadata
  created_by?: number | User;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: number;
  slug: string;
  name: string;
  code: string;
  level: 'fp_basica' | 'grado_medio' | 'grado_superior' | 'certificado_profesionalidad';
  description?: string;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campus {
  id: number;
  slug: string;
  name: string;
  code?: string;

  // Location
  address?: string;
  city?: string;
  postal_code?: string;
  province?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Contact
  phone?: string;
  email?: string;

  // Flags
  active?: boolean;
  is_main?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CourseRun {
  id: number;
  slug: string;

  // Relationships
  course: number | Course;
  campus?: number | Campus;

  // Scheduling
  start_date: string;
  end_date: string;
  enrollment_deadline?: string;
  schedule?: {
    days: string[];
    time_start?: string;
    time_end?: string;
  };

  // Capacity
  min_students?: number;
  max_students?: number;
  current_enrollment?: number;

  // Pricing
  price?: number;
  subsidized?: boolean;
  subsidized_price?: number;

  // Status
  status: 'draft' | 'published' | 'enrollment_open' | 'enrollment_closed' | 'in_progress' | 'completed' | 'cancelled';

  // Instructor
  instructor_name?: string;

  // Metadata
  created_by?: number | User;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: number;
  alt?: string;
  url: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

// Type guards (utility functions)
export function isCyclePopulated(cycle: number | Cycle | undefined): cycle is Cycle {
  return typeof cycle === 'object' && cycle !== null && 'name' in cycle;
}

export function isCampusPopulated(campus: number | Campus | undefined): campus is Campus {
  return typeof campus === 'object' && campus !== null && 'name' in campus;
}

export function isMediaPopulated(media: number | Media | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media;
}

export function isUserPopulated(user: number | User | undefined): user is User {
  return typeof user === 'object' && user !== null && 'email' in user;
}

export function isCourseRunPopulated(courseRun: number | CourseRun | undefined): courseRun is CourseRun {
  return typeof courseRun === 'object' && courseRun !== null && 'start_date' in courseRun;
}
