/**
 * CourseCard Component
 *
 * Reusable card for displaying course information
 */

import type { Course } from '@types/index';

export interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  // Extract image URL - handle both Media object and string ID
  const getImageUrl = () => {
    if (!course.featured_image) return null;

    if (typeof course.featured_image === 'string') {
      return `/api/media/${course.featured_image}`;
    }

    // If it's a Media object with sizes
    return course.featured_image.sizes?.card?.url || course.featured_image.url;
  };

  const imageUrl = getImageUrl();

  // Get cycle name - handle both Cycle object and string ID
  const getCycleName = () => {
    if (!course.cycle) return null;

    if (typeof course.cycle === 'string') {
      return null; // Will need to fetch separately
    }

    return course.cycle.name;
  };

  const cycleName = getCycleName();

  // Format modality
  const modalityLabels = {
    presencial: 'Presencial',
    online: 'Online',
    hibrido: 'Semipresencial',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: navigate to course detail
      window.location.href = `/cursos/${course.slug}`;
    }
  };

  return (
    <div
      className="card cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Featured Image */}
      {imageUrl ? (
        <div className="relative h-48 -mx-8 -mt-8 mb-4 rounded-t-xl overflow-hidden bg-neutral-200">
          <img
            src={imageUrl}
            alt={course.featured_image && typeof course.featured_image !== 'string' ? course.featured_image.alt : course.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {course.featured && (
            <div className="absolute top-2 right-2 bg-accent text-white text-xs font-semibold px-2 py-1 rounded">
              Destacado
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-48 -mx-8 -mt-8 mb-4 rounded-t-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
          <svg className="w-16 h-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {course.featured && (
            <div className="absolute top-2 right-2 bg-accent text-white text-xs font-semibold px-2 py-1 rounded">
              Destacado
            </div>
          )}
        </div>
      )}

      {/* Course Content */}
      <div>
        {/* Cycle Badge */}
        {cycleName && (
          <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">
            {cycleName}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 text-neutral-900 line-clamp-2">
          {course.title}
        </h3>

        {/* Short Description */}
        {course.short_description && (
          <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
            {course.short_description}
          </p>
        )}

        {/* Course Meta */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {/* Modality */}
            <span className="text-primary font-semibold">
              {modalityLabels[course.modality]}
            </span>

            {/* Duration */}
            {course.duration_hours && (
              <>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-600">{course.duration_hours}h</span>
              </>
            )}
          </div>

          {/* CTA */}
          <span className="text-primary hover:underline font-semibold">
            Ver más →
          </span>
        </div>

        {/* Financial Aid Badge */}
        {course.financial_aid_available && (
          <div className="mt-3 pt-3 border-t border-neutral-200">
            <span className="inline-flex items-center text-xs text-secondary font-semibold">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ayudas disponibles
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
