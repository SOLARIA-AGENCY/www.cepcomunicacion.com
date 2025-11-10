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
import type { Course, CourseRun } from '@/lib/types';
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

// Course type labels and colors
const COURSE_TYPE_CONFIG = {
  privado: { label: 'PRIVADO', color: 'bg-red-600' },
  ocupados: { label: 'OCUPADOS', color: 'bg-blue-600' },
  desempleados: { label: 'DESEMPLEADOS', color: 'bg-green-600' },
  teleformacion: { label: 'TELEFORMACIÓN', color: 'bg-purple-600' },
  ciclo_medio: { label: 'CICLO MEDIO', color: 'bg-orange-600' },
  ciclo_superior: { label: 'CICLO SUPERIOR', color: 'bg-indigo-600' },
} as const;

// Placeholder images from Pexels (high quality, course-related)
const PLACEHOLDER_IMAGES = {
  default: 'https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=800',
  marketing: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
  design: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
  programming: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
  business: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
} as const;

export const CourseCard = memo(function CourseCard({ course, onClick }: CourseCardProps) {
  // Extract image URL - use featured_image or intelligent placeholder
  const imageUrl = useMemo(() => {
    // If course has featured_image, use it
    if (course.featured_image && typeof course.featured_image === 'object' && 'url' in course.featured_image) {
      return course.featured_image.url;
    }

    // Otherwise, select intelligent placeholder based on course name
    const nameLower = course.name.toLowerCase();
    if (nameLower.includes('marketing') || nameLower.includes('social') || nameLower.includes('digital')) {
      return PLACEHOLDER_IMAGES.marketing;
    }
    if (nameLower.includes('diseño') || nameLower.includes('gráfico') || nameLower.includes('photoshop')) {
      return PLACEHOLDER_IMAGES.design;
    }
    if (nameLower.includes('desarrollo') || nameLower.includes('web') || nameLower.includes('programación')) {
      return PLACEHOLDER_IMAGES.programming;
    }
    if (nameLower.includes('administración') || nameLower.includes('gestión') || nameLower.includes('empresa')) {
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
    if (!course.course_runs || course.course_runs.length === 0) return null;

    const run = course.course_runs[0];
    if (isCourseRunPopulated(run)) {
      return run;
    }
    return null;
  }, [course.course_runs]);

  // Get campus name from active course run
  const campusName = useMemo(() => {
    if (!activeCourseRun?.campus) return null;

    if (isCampusPopulated(activeCourseRun.campus)) {
      return activeCourseRun.campus.name;
    }
    return null;
  }, [activeCourseRun]);

  // Format start date
  const formattedStartDate = useMemo(() => {
    if (!activeCourseRun?.start_date) return null;

    const date = new Date(activeCourseRun.start_date);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, [activeCourseRun]);

  // Get price/subsidy info
  const priceInfo = useMemo(() => {
    if (activeCourseRun?.subsidized) {
      return {
        text: '100% Subvencionado',
        highlight: true,
      };
    }

    if (activeCourseRun?.price && activeCourseRun.price > 0) {
      return {
        text: `${activeCourseRun.price}€`,
        highlight: false,
      };
    }

    if (course.base_price && course.base_price > 0) {
      return {
        text: `${course.base_price}€`,
        highlight: false,
      };
    }

    return {
      text: 'Gratuito',
      highlight: true,
    };
  }, [activeCourseRun, course.base_price]);

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
        />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {/* Course Type Badge */}
          {course.course_type && COURSE_TYPE_CONFIG[course.course_type] && (
            <span className={`${COURSE_TYPE_CONFIG[course.course_type].color} text-white text-xs font-bold px-3 py-1.5 rounded shadow-md uppercase tracking-wide`}>
              {COURSE_TYPE_CONFIG[course.course_type].label}
            </span>
          )}

          {/* Featured Badge */}
          {course.featured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded shadow-md uppercase tracking-wide">
              Destacado
            </span>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="flex flex-col flex-1">
        {/* Cycle Badge */}
        {cycleName && (
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-md mb-3 self-start uppercase tracking-wide">
            {cycleName}
          </span>
        )}

        {/* Title - LEFT ALIGNED, UPPERCASE */}
        <h3 className="text-xl font-bold mb-3 text-neutral-900 line-clamp-2 uppercase text-left">
          {course.name}
        </h3>

        {/* Short Description */}
        {course.short_description && (
          <p className="text-neutral-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {course.short_description}
          </p>
        )}

        {/* Course Info Panel - NEW */}
        <div className="flex flex-col gap-3 mb-4 p-4 bg-neutral-50 rounded-lg">
          {/* Campus/Location */}
          {(campusName || course.modality === 'online') && (
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <svg className="w-4 h-4 flex-shrink-0 text-neutral-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>{campusName || 'Online'}</span>
            </div>
          )}

          {/* Start Date */}
          {formattedStartDate && (
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <svg className="w-4 h-4 flex-shrink-0 text-neutral-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              <span>Inicio: {formattedStartDate}</span>
            </div>
          )}

          {/* Price/Subsidy */}
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 flex-shrink-0 text-neutral-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
            </svg>
            <span className={`font-semibold ${priceInfo.highlight ? 'text-green-600' : 'text-neutral-700'}`}>
              {priceInfo.text}
            </span>
          </div>
        </div>

        {/* Course Meta */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
          {/* Modality */}
          {course.modality && (
            <span className="font-medium">{MODALITY_LABELS[course.modality]}</span>
          )}

          {/* Duration */}
          {course.duration_hours && (
            <>
              <span className="text-neutral-400">•</span>
              <span>{course.duration_hours}h</span>
            </>
          )}
        </div>

        {/* CTA Button - NEW DESIGN */}
        <div className="mt-auto">
          <div className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white font-bold text-sm uppercase tracking-wide rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            VER CURSO
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </div>

        {/* Financial Aid Badge */}
        {course.financial_aid_available && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <span className="inline-flex items-center text-xs text-green-600 font-semibold">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ayudas disponibles
            </span>
          </div>
        )}
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
