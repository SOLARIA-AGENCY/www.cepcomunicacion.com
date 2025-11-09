/**
 * Courses Page Component
 *
 * Displays list of courses with real-time filtering
 */

import { useState } from 'react';
import { useCourses } from '@hooks/useCourses';
import { useCampuses } from '@hooks/useCampuses';
import { useCycles } from '@hooks/useCycles';
import { CourseCard, Alert } from '@components/ui';
import { CourseListSkeleton } from './skeletons';
import type { CourseFilters } from '../../types';

export default function CoursesPage() {
  // Filter state
  const [filters, setFilters] = useState<CourseFilters>({
    cycle: '',
    campus: '',
    modality: undefined,
    search: '',
  });

  // Fetch data with filters
  const coursesState = useCourses(filters);
  const campusesState = useCampuses();
  const cyclesState = useCycles();

  // Handle filter changes
  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    setFilters((prev: CourseFilters) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Debounce search (simple implementation)
    setFilters((prev: CourseFilters) => ({
      ...prev,
      search: value || undefined,
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      cycle: '',
      campus: '',
      modality: undefined,
      search: '',
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.cycle || filters.campus || filters.modality || filters.search;

  return (
    <div className="courses-page py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Nuestros Cursos</h1>
          <p className="text-neutral-600">
            Encuentra el curso perfecto para tu carrera profesional
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="form-label">Buscar</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nombre del curso..."
                value={filters.search || ''}
                onChange={handleSearchChange}
              />
            </div>

            {/* Cycle Filter */}
            <div>
              <label className="form-label">Ciclo Formativo</label>
              <select
                className="form-input"
                value={filters.cycle || ''}
                onChange={(e) => handleFilterChange('cycle', e.target.value)}
              >
                <option value="">Todos los ciclos</option>
                {cyclesState.status === 'success' &&
                  cyclesState.data?.map((cycle) => (
                    <option key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Modality Filter */}
            <div>
              <label className="form-label">Modalidad</label>
              <select
                className="form-input"
                value={filters.modality || ''}
                onChange={(e) => handleFilterChange('modality', e.target.value)}
              >
                <option value="">Todas las modalidades</option>
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
                <option value="hibrido">Semipresencial</option>
              </select>
            </div>

            {/* Campus Filter */}
            <div>
              <label className="form-label">Campus</label>
              <select
                className="form-input"
                value={filters.campus || ''}
                onChange={(e) => handleFilterChange('campus', e.target.value)}
              >
                <option value="">Todos los campus</option>
                {campusesState.status === 'success' &&
                  campusesState.data?.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name} - {campus.city}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary hover:underline font-semibold"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Loading State */}
        {coursesState.status === 'loading' && <CourseListSkeleton count={6} />}

        {/* Error State */}
        {coursesState.status === 'error' && (
          <Alert variant="error" title="Error al Cargar Cursos">
            {coursesState.error}
          </Alert>
        )}

        {/* Success State - Courses Grid */}
        {coursesState.status === 'success' && (
          <>
            {/* Results Count */}
            <div className="mb-6 text-neutral-600">
              {coursesState.data && coursesState.data.length > 0 ? (
                <p>
                  Mostrando <span className="font-semibold">{coursesState.data.length}</span>{' '}
                  {coursesState.data.length === 1 ? 'curso' : 'cursos'}
                </p>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                    No se encontraron cursos
                  </h3>
                  <p className="mt-2 text-neutral-600">
                    {hasActiveFilters
                      ? 'Intenta ajustar los filtros para ver más resultados'
                      : 'No hay cursos disponibles en este momento'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="mt-4 text-primary hover:underline font-semibold"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Courses Grid */}
            {coursesState.data && coursesState.data.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesState.data.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
