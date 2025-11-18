/**
 * CoursesList Component
 *
 * Client-side component that wraps CourseFilters and course grid
 * Handles the filtered state and rendering
 */

'use client';

import { useState, memo } from 'react';
import { CourseCard } from './CourseCard';
import { CourseFilters } from './CourseFilters';
import type { Course } from '@/lib/types';

export interface CoursesListProps {
  courses: Course[];
}

export const CoursesList = memo(function CoursesList({ courses }: CoursesListProps) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

  return (
    <>
      {/* Filters Section */}
      <CourseFilters courses={courses} onFilteredCoursesChange={setFilteredCourses} />

      {/* Courses Grid Section */}
      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">No se encontraron cursos</h2>
              <p className="text-neutral-600 mb-6">
                Prueba con otros filtros o términos de búsqueda diferentes.
              </p>
            </div>
          ) : (
            <div className="courses-grid-3col">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
});
