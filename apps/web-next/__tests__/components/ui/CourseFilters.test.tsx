/**
 * CourseFilters Component Tests
 *
 * Unit tests for CourseFilters component with:
 * - Area filtering (8 categories)
 * - Type filtering (6 types)
 * - Modality filtering (3 modalities)
 * - Text search
 * - Reset filters functionality
 * - Results counter
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CourseFilters } from '@/components/ui/CourseFilters';
import type { Course } from '@/lib/types';

describe('CourseFilters', () => {
  const mockCourses: Course[] = [
    {
      id: 1,
      slug: 'piloto-drones',
      name: 'PILOTO DE DRONES PROFESIONAL',
      short_description: 'Curso de piloto de drones',
      cycle: 1,
      modality: 'presencial',
      course_type: 'privado',
      area: 'tecnologia',
      duration_hours: 60,
      active: true,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      id: 2,
      slug: 'streaming-vivo',
      name: 'STREAMING EN VIVO PROFESIONAL',
      short_description: 'Curso de streaming',
      cycle: 1,
      modality: 'hibrido',
      course_type: 'privado',
      area: 'audiovisual',
      duration_hours: 80,
      active: true,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      id: 3,
      slug: 'video-redes',
      name: 'PRODUCCIÓN DE VIDEO PARA REDES SOCIALES',
      short_description: 'Curso de video para redes',
      cycle: 1,
      modality: 'online',
      course_type: 'privado',
      area: 'marketing',
      duration_hours: 100,
      active: true,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      id: 4,
      slug: 'enfermeria',
      name: 'AUXILIAR DE ENFERMERÍA',
      short_description: 'Curso de enfermería',
      cycle: 1,
      modality: 'presencial',
      course_type: 'ocupados',
      area: 'sanitaria',
      duration_hours: 200,
      active: true,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
  ] as Course[];

  const mockOnFilteredCoursesChange = vi.fn();

  describe('Rendering', () => {
    it('should render all filter controls', () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      expect(screen.getByLabelText(/buscar curso/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filtrar por área/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filtrar por tipo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filtrar por modalidad/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /limpiar filtros/i })).toBeInTheDocument();
    });

    it('should display results counter with total courses', () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      expect(screen.getByText(/mostrando/i)).toBeInTheDocument();
      expect(screen.getByText(/de 4 cursos/i)).toBeInTheDocument();
    });
  });

  describe('Area Filter', () => {
    it('should have 9 area options (todas + 8 areas)', () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const areaSelect = screen.getByLabelText(/filtrar por área/i);
      const options = areaSelect.querySelectorAll('option');

      expect(options).toHaveLength(9);
      expect(options[0]).toHaveTextContent('Todas las áreas');
    });

    it('should filter courses by area: tecnologia', async () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const areaSelect = screen.getByLabelText(/filtrar por área/i);
      fireEvent.change(areaSelect, { target: { value: 'tecnologia' } });

      await waitFor(() => {
        const calls = mockOnFilteredCoursesChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall).toHaveLength(1);
        expect(lastCall[0].area).toBe('tecnologia');
      });
    });

    it('should filter courses by area: audiovisual', async () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const areaSelect = screen.getByLabelText(/filtrar por área/i);
      fireEvent.change(areaSelect, { target: { value: 'audiovisual' } });

      await waitFor(() => {
        const calls = mockOnFilteredCoursesChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall).toHaveLength(1);
        expect(lastCall[0].area).toBe('audiovisual');
      });
    });
  });

  describe('Type Filter', () => {
    it('should have 7 type options (todos + 6 types)', () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const typeSelect = screen.getByLabelText(/filtrar por tipo/i);
      const options = typeSelect.querySelectorAll('option');

      expect(options).toHaveLength(7);
      expect(options[0]).toHaveTextContent('Todos los tipos');
    });

    it('should filter courses by type: privado', async () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const typeSelect = screen.getByLabelText(/filtrar por tipo/i);
      fireEvent.change(typeSelect, { target: { value: 'privado' } });

      await waitFor(() => {
        const calls = mockOnFilteredCoursesChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall).toHaveLength(3);
        lastCall.forEach((course: Course) => {
          expect(course.course_type).toBe('privado');
        });
      });
    });
  });

  describe('Modality Filter', () => {
    it('should have 4 modality options (todas + 3 modalities)', () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const modalitySelect = screen.getByLabelText(/filtrar por modalidad/i);
      const options = modalitySelect.querySelectorAll('option');

      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent('Todas las modalidades');
    });

    it('should filter courses by modality: online', async () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const modalitySelect = screen.getByLabelText(/filtrar por modalidad/i);
      fireEvent.change(modalitySelect, { target: { value: 'online' } });

      await waitFor(() => {
        const calls = mockOnFilteredCoursesChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall).toHaveLength(1);
        expect(lastCall[0].modality).toBe('online');
      });
    });
  });

  describe('Text Search', () => {
    it('should filter courses by search text in name', async () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const searchInput = screen.getByLabelText(/buscar curso/i);
      fireEvent.change(searchInput, { target: { value: 'DRONES' } });

      await waitFor(() => {
        const calls = mockOnFilteredCoursesChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall).toHaveLength(1);
        expect(lastCall[0].name).toContain('DRONES');
      });
    });

    it('should be case-insensitive', async () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const searchInput = screen.getByLabelText(/buscar curso/i);
      fireEvent.change(searchInput, { target: { value: 'streaming' } });

      await waitFor(() => {
        const calls = mockOnFilteredCoursesChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall).toHaveLength(1);
        expect(lastCall[0].name).toContain('STREAMING');
      });
    });
  });

  describe('Multiple Filters', () => {
    it('should combine area and type filters', async () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const areaSelect = screen.getByLabelText(/filtrar por área/i);
      const typeSelect = screen.getByLabelText(/filtrar por tipo/i);

      fireEvent.change(areaSelect, { target: { value: 'tecnologia' } });
      fireEvent.change(typeSelect, { target: { value: 'privado' } });

      await waitFor(() => {
        const calls = mockOnFilteredCoursesChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall).toHaveLength(1);
        expect(lastCall[0].area).toBe('tecnologia');
        expect(lastCall[0].course_type).toBe('privado');
      });
    });
  });

  describe('Reset Filters', () => {
    it('should reset all filters when button is clicked', async () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const searchInput = screen.getByLabelText(/buscar curso/i) as HTMLInputElement;
      const areaSelect = screen.getByLabelText(/filtrar por área/i) as HTMLSelectElement;
      const resetButton = screen.getByRole('button', { name: /limpiar filtros/i });

      // Apply filters
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.change(areaSelect, { target: { value: 'tecnologia' } });

      // Reset
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(searchInput.value).toBe('');
        expect(areaSelect.value).toBe('todas');
      });
    });

    it('should be disabled when no filters are active', () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      const resetButton = screen.getByRole('button', { name: /limpiar filtros/i });
      expect(resetButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(
        <CourseFilters
          courses={mockCourses}
          onFilteredCoursesChange={mockOnFilteredCoursesChange}
        />
      );

      expect(screen.getByLabelText(/buscar curso/i)).toHaveAttribute('id', 'search-courses');
      expect(screen.getByLabelText(/filtrar por área/i)).toHaveAttribute('id', 'filter-area');
      expect(screen.getByLabelText(/filtrar por tipo/i)).toHaveAttribute('id', 'filter-type');
      expect(screen.getByLabelText(/filtrar por modalidad/i)).toHaveAttribute('id', 'filter-modality');
    });
  });
});
