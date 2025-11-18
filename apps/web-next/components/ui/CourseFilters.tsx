/**
 * CourseFilters Component
 *
 * Client-side filtering system for courses page
 * Filters by: area, type, modality, and text search
 */

'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import type { Course } from '@/lib/types';

export interface CourseFiltersProps {
  courses: Course[];
  onFilteredCoursesChange: (filtered: Course[]) => void;
}

export const CourseFilters = memo(function CourseFilters({
  courses,
  onFilteredCoursesChange,
}: CourseFiltersProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('todas');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedModality, setSelectedModality] = useState<string>('todas');

  // Filter courses based on all active filters
  const filteredCourses = useMemo(() => {
    let result = courses;

    // Search text filter
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      result = result.filter((course) => {
        const name = course.name.toLowerCase();
        const shortDesc = course.short_description?.toLowerCase() || '';
        const area = course.area || '';
        const type = course.course_type || '';

        return (
          name.includes(search) ||
          shortDesc.includes(search) ||
          area.includes(search) ||
          type.includes(search)
        );
      });
    }

    // Area filter
    if (selectedArea !== 'todas') {
      result = result.filter((course) => course.area === selectedArea);
    }

    // Type filter
    if (selectedType !== 'todos') {
      result = result.filter((course) => course.course_type === selectedType);
    }

    // Modality filter
    if (selectedModality !== 'todas') {
      result = result.filter((course) => course.modality === selectedModality);
    }

    return result;
  }, [courses, searchText, selectedArea, selectedType, selectedModality]);

  // Notify parent when filtered courses change
  useMemo(() => {
    onFilteredCoursesChange(filteredCourses);
  }, [filteredCourses, onFilteredCoursesChange]);

  // Handler functions for filters
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const handleAreaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
  }, []);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  }, []);

  const handleModalityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModality(e.target.value);
  }, []);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSearchText('');
    setSelectedArea('todas');
    setSelectedType('todos');
    setSelectedModality('todas');
  }, []);

  // Check if any filter is active
  const hasActiveFilters =
    searchText.trim() ||
    selectedArea !== 'todas' ||
    selectedType !== 'todos' ||
    selectedModality !== 'todas';

  return (
    <section className="bg-white border-b-2 border-neutral-200 sticky top-0 z-40 shadow-sm">
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label
              htmlFor="search-courses"
              className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide"
            >
              <svg
                className="w-4 h-4 inline-block mr-1 -mt-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              Buscar Curso
            </label>
            <input
              type="text"
              id="search-courses"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre, área o palabra clave..."
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Area Filter */}
          <div>
            <label
              htmlFor="filter-area"
              className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide"
            >
              Filtrar por Área
            </label>
            <select
              id="filter-area"
              value={selectedArea}
              onChange={handleAreaChange}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white cursor-pointer"
            >
              <option value="todas">Todas las áreas</option>
              <option value="sanitaria">Área Sanitaria</option>
              <option value="horeca">Área Horeca</option>
              <option value="salud">Área Salud</option>
              <option value="tecnologia">Área Tecnología</option>
              <option value="audiovisual">Área Audiovisual</option>
              <option value="administracion">Área Administración</option>
              <option value="marketing">Área Marketing</option>
              <option value="educacion">Área Educación</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label
              htmlFor="filter-type"
              className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide"
            >
              Filtrar por Tipo
            </label>
            <select
              id="filter-type"
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white cursor-pointer"
            >
              <option value="todos">Todos los tipos</option>
              <option value="privado">Cursos Privados</option>
              <option value="ocupados">Trabajadores Ocupados</option>
              <option value="desempleados">Trabajadores Desempleados</option>
              <option value="teleformacion">Teleformación</option>
              <option value="ciclo_medio">Ciclo Medio</option>
              <option value="ciclo_superior">Ciclo Superior</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Modality Filter */}
          <div>
            <label
              htmlFor="filter-modality"
              className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide"
            >
              Filtrar por Modalidad
            </label>
            <select
              id="filter-modality"
              value={selectedModality}
              onChange={handleModalityChange}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white cursor-pointer"
            >
              <option value="todas">Todas las modalidades</option>
              <option value="online">Online</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Semipresencial</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              className="w-full px-6 py-3 bg-neutral-100 hover:bg-primary hover:text-white border-2 border-neutral-300 hover:border-primary rounded-lg font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 disabled:hover:text-neutral-700 disabled:hover:border-neutral-300"
            >
              <svg
                className="w-4 h-4 inline-block mr-2 -mt-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
              Limpiar Filtros
            </button>
          </div>

          {/* Results Counter */}
          <div className="md:col-span-2 flex items-end">
            <div className="w-full text-center md:text-right text-neutral-600 py-3">
              Mostrando <strong className="text-primary text-lg">{filteredCourses.length}</strong>{' '}
              de {courses.length} cursos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
