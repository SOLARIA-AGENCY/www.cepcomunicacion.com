/**
 * CourseCard Component
 *
 * Reusable card for displaying course information
 * Optimized with React.memo and useMemo/useCallback hooks
 * Adapted for Next.js with Link component
 *
 * Updated: Includes course type badges, enhanced info fields, and better CTA
 */

'use client';

import { memo, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type { Course, CourseRun, CourseType, CourseArea } from '@/lib/types';
import { isCampusPopulated, isCourseRunPopulated } from '@/lib/types';

export interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

// Modality labels (moved outside component to prevent recreation)
const MODALITY_LABELS = {
  presencial: 'Presencial',
  online: 'Online',
  hibrido: 'Semipresencial',
} as const;

// Course type labels and colors - CEP Formación Brand Colors
const COURSE_TYPE_CONFIG = {
  privado: {
    label: 'PRIVADO',
    color: 'bg-cep-rosa',
    buttonColor: 'bg-cep-rosa hover:bg-cep-rosa-dark',
  },
  ocupados: {
    label: 'TRABAJADORES OCUPADOS',
    color: 'bg-cep-ocupados',
    buttonColor: 'bg-cep-ocupados hover:bg-cep-ocupados-dark',
  },
  desempleados: {
    label: 'TRABAJADORES DESEMPLEADOS',
    color: 'bg-cep-desempleados',
    buttonColor: 'bg-cep-desempleados hover:bg-cep-desempleados-dark',
  },
  teleformacion: {
    label: 'TELEFORMACIÓN',
    color: 'bg-cep-teleformacion',
    buttonColor: 'bg-cep-teleformacion hover:bg-cep-teleformacion-dark',
  },
  ciclo_medio: {
    label: 'CICLO MEDIO',
    color: 'bg-cep-rosa',
    buttonColor: 'bg-cep-rosa hover:bg-cep-rosa-dark',
  },
  ciclo_superior: {
    label: 'CICLO SUPERIOR',
    color: 'bg-cep-rosa',
    buttonColor: 'bg-cep-rosa hover:bg-cep-rosa-dark',
  },
} as const;

// Area labels and colors for badges
const AREA_CONFIG = {
  sanitaria: { label: 'SANITARIA', color: 'bg-red-600' },
  horeca: { label: 'HORECA', color: 'bg-orange-600' },
  salud: { label: 'SALUD', color: 'bg-green-600' },
  tecnologia: { label: 'TECNOLOGÍA', color: 'bg-blue-600' },
  audiovisual: { label: 'AUDIOVISUAL', color: 'bg-purple-600' },
  administracion: { label: 'ADMINISTRACIÓN', color: 'bg-cyan-600' },
  marketing: { label: 'MARKETING', color: 'bg-pink-600' },
  educacion: { label: 'EDUCACIÓN', color: 'bg-yellow-600' },
} as const;

// Helper functions for safe type indexing
function getCourseTypeConfig(type: string) {
  return (
    COURSE_TYPE_CONFIG[type as keyof typeof COURSE_TYPE_CONFIG] || {
      label: type.toUpperCase(),
      color: 'bg-gray-600',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
    }
  );
}

function getAreaConfig(area: string) {
  const areaMapping = {
    computing: 'tecnologia',
    communication: 'audiovisual',
    business: 'administracion',
    languages: 'educacion',
    health: 'salud',
    industry: 'administracion',
  };

  const configKey = areaMapping[area as keyof typeof areaMapping] as keyof typeof AREA_CONFIG;
  return AREA_CONFIG[configKey] || { label: area.toUpperCase(), color: 'bg-gray-600' };
}

// Placeholder images from Pexels (high quality, course-related)
const PLACEHOLDER_IMAGES = {
  default:
    'https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=800',
  marketing:
    'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
  design:
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
  programming:
    'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
  business:
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
} as const;

export const CourseCard = memo(function CourseCard({ course, onClick }: CourseCardProps) {
  // Extract image URL - use image or featured_image or intelligent placeholder
  const imageUrl = useMemo(() => {
    // If course has image, use it
    if (course.image) {
      return course.image;
    }

    // If course has featured_image, extract URL (can be string or object)
    if (course.featured_image) {
      // If it's an object with url property, use that
      if (typeof course.featured_image === 'object' && 'url' in course.featured_image) {
        // Replace incorrect port 3001 with correct 3002
        const url = course.featured_image.url.replace(':3001', ':3002');
        return url;
      }
      // Otherwise treat as string (legacy)
      if (typeof course.featured_image === 'string') {
        return course.featured_image.replace(':3001', ':3002');
      }
    }

    // Otherwise, select intelligent placeholder based on course name
    const nameLower = course.name.toLowerCase();
    if (
      nameLower.includes('marketing') ||
      nameLower.includes('social') ||
      nameLower.includes('digital')
    ) {
      return PLACEHOLDER_IMAGES.marketing;
    }
    if (
      nameLower.includes('diseño') ||
      nameLower.includes('gráfico') ||
      nameLower.includes('photoshop')
    ) {
      return PLACEHOLDER_IMAGES.design;
    }
    if (
      nameLower.includes('desarrollo') ||
      nameLower.includes('web') ||
      nameLower.includes('programación')
    ) {
      return PLACEHOLDER_IMAGES.programming;
    }
    if (
      nameLower.includes('administración') ||
      nameLower.includes('gestión') ||
      nameLower.includes('empresa')
    ) {
      return PLACEHOLDER_IMAGES.business;
    }
    return PLACEHOLDER_IMAGES.default;
  }, [course.featured_image, course.name]);

  // Get cycle name - memoized to prevent recalculation
  const cycleName = useMemo(() => {
    if (!course.cycle) return null;

    // Type guard: cycle can be number | Cycle object
    if (typeof course.cycle === 'object' && 'name' in course.cycle) {
      return course.cycle.name;
    }

    return null; // cycle is just an ID, not populated
  }, [course.cycle]);

  // Get active course run (first enrollment_open or published)
  const activeCourseRun = useMemo(() => {
    const courseRuns = course.courseRuns || course.course_runs;
    if (!courseRuns || courseRuns.length === 0) return null;

    const run = courseRuns[0];
    if (isCourseRunPopulated(run)) {
      return run;
    }
    return null;
  }, [course.courseRuns, course.course_runs]);

  // Get location from active course run
  const locationName = useMemo(() => {
    if (!activeCourseRun?.location) return null;
    return activeCourseRun.location;
  }, [activeCourseRun]);

  // Format start date
  const formattedStartDate = useMemo(() => {
    if (!activeCourseRun?.startDate) return null;

    const date = new Date(activeCourseRun.startDate);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, [activeCourseRun]);

  // Get price/subsidy info - CEP Formación pricing rules
  const priceInfo = useMemo(() => {
    const courseType = course.course_type;

    // PRIVADO/CICLOS: "CONSULTAR PRECIO"
    if (
      courseType === 'privado' ||
      courseType === 'ciclo_medio' ||
      courseType === 'ciclo_superior'
    ) {
      return {
        text: 'CONSULTAR PRECIO',
        highlight: false,
        colorClass: 'text-cep-rosa',
        iconColor: 'text-cep-rosa',
      };
    }

    // OCUPADOS: "100% SUBVENCIONADO"
    if (courseType === 'ocupados') {
      return {
        text: '100% SUBVENCIONADO',
        highlight: true,
        colorClass: 'text-cep-ocupados',
        iconColor: 'text-cep-ocupados',
      };
    }

    // DESEMPLEADOS: "GRATUITO - 100% SUBVENCIONADO"
    if (courseType === 'desempleados') {
      return {
        text: 'GRATUITO - 100% SUBVENCIONADO',
        highlight: true,
        colorClass: 'text-cep-desempleados',
        iconColor: 'text-cep-desempleados',
      };
    }

    // TELEFORMACIÓN: "CONSULTAR PRECIO"
    if (courseType === 'teleformacion') {
      return {
        text: 'CONSULTAR PRECIO',
        highlight: false,
        colorClass: 'text-cep-teleformacion',
        iconColor: 'text-cep-teleformacion',
      };
    }

    // Default fallback
    return {
      text: 'CONSULTAR PRECIO',
      highlight: false,
      colorClass: 'text-neutral-700',
      iconColor: 'text-neutral-500',
    };
  }, [course.course_type]);

  // Handle click - memoized to prevent recreation
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const cardContent = (
    <>
      {/* Featured Image with Badges */}
      <div className="relative h-56 -mx-8 -mt-8 mb-4 rounded-t-xl overflow-hidden bg-neutral-200">
        <img
          src={imageUrl}
          alt={course.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          width="360"
          height="220"
        />

        {/* Badges Container - Course Type and Area */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {/* Course Type Badge */}
          {course.course_type && (
            <span
              className={`${getCourseTypeConfig(course.course_type).color} text-white text-xs font-bold px-3 py-1.5 rounded shadow-md uppercase tracking-wide`}
            >
              {getCourseTypeConfig(course.course_type).label}
            </span>
          )}

          {/* Area Badge */}
          {course.area && (
            <span
              className={`${getAreaConfig(course.area).color} text-white text-xs font-bold px-3 py-1.5 rounded shadow-md uppercase tracking-wide`}
            >
              {getAreaConfig(course.area).label}
            </span>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="flex flex-col flex-1">
        {/* Category Label */}
        {cycleName && (
          <span className="inline-block bg-neutral-100 text-neutral-700 text-xs font-semibold px-3 py-1 rounded-md mb-3 self-start uppercase tracking-wide">
            {cycleName}
          </span>
        )}

        {/* Title - LEFT ALIGNED, UPPERCASE, NO TRUNCATE */}
        <h3 className="text-lg font-bold mb-3 text-neutral-900 line-clamp-2 uppercase text-left leading-tight">
          {course.name}
        </h3>

        {/* Short Description */}
        {course.short_description && (
          <p className="text-neutral-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {course.short_description}
          </p>
        )}

        {/* Course Info Panel - CEP Formación Standardized */}
        <div className="flex flex-col gap-3 mb-4 p-4 bg-neutral-50 rounded-lg flex-grow">
          {/* Campus/Location - CEP Tenerife */}
          {(locationName || course.modality === 'online') && (
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <svg
                className="w-4 h-4 flex-shrink-0 text-neutral-500"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>{locationName || 'Online'}, Tenerife</span>
            </div>
          )}

          {/* Start Date */}
          {formattedStartDate && (
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <svg
                className="w-4 h-4 flex-shrink-0 text-neutral-500"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
              </svg>
              <span>Inicio: {formattedStartDate}</span>
            </div>
          )}

          {/* Modality + Hours - UPPERCASE + BOLD */}
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
            <span className="uppercase">
              {course.modality && MODALITY_LABELS[course.modality as keyof typeof MODALITY_LABELS]
                ? MODALITY_LABELS[course.modality as keyof typeof MODALITY_LABELS].toUpperCase()
                : 'ONLINE'}
            </span>
            {course.duration_hours && (
              <>
                <span className="text-neutral-400">•</span>
                <span className="uppercase">{course.duration_hours}H</span>
              </>
            )}
          </div>

          {/* Price/Subsidy - Color by type */}
          <div className="flex items-center gap-2 text-sm font-bold">
            <svg
              className={`w-4 h-4 flex-shrink-0 ${priceInfo.iconColor}`}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {course.course_type === 'desempleados' || course.course_type === 'ocupados' ? (
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              ) : (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
              )}
            </svg>
            <span className={`${priceInfo.colorClass} uppercase text-xs tracking-wide`}>
              {priceInfo.text}
            </span>
          </div>
        </div>

        {/* CTA Buttons - Primary and Checkout */}
        <div className="mt-auto space-y-2" data-course-type={course.course_type}>
          <div
            className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-white font-bold text-sm uppercase tracking-wide rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
              course.course_type
                ? getCourseTypeConfig(course.course_type).buttonColor
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            VER CURSO
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </div>
          <Link
            href="/checkout"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-current text-current font-bold text-sm uppercase tracking-wide rounded-lg hover:bg-current hover:text-white transition-all duration-300"
            style={{
              color: course.course_type
                ? getCourseTypeConfig(course.course_type).color.replace('bg-', '#')
                : '#1e40af'
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            INSCRIBIRSE AHORA
          </Link>
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div
        className="card cursor-pointer flex flex-col"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Prevent default space scrolling
            handleClick();
          }
        }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/cursos/${course.slug}`} className="card cursor-pointer block flex flex-col">
      {cardContent}
    </Link>
  );
});
