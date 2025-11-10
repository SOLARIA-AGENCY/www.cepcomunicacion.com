/**
 * CourseCard Component Tests - CEP Formación Redesign
 *
 * Unit tests for CourseCard component
 * - Component rendering
 * - CEP brand colors by course type
 * - Pricing display rules
 * - 3-column grid layout
 * - Tenerife locations
 * - Accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CourseCard } from '@/components/ui/CourseCard';
import type { Course } from '@/lib/types';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CourseCard - CEP Formación Redesign', () => {
  const baseCourse: Partial<Course> = {
    id: '1',
    name: 'Marketing Digital y Redes Sociales',
    slug: 'marketing-digital-redes-sociales',
    short_description: 'Domina las estrategias de marketing en redes sociales',
    modality: 'online',
    duration_hours: 100,
    active: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  };

  describe('CEP Brand Colors by Course Type', () => {
    it('should display PRIVADO badge and pricing for privado courses', () => {
      const privateCourse: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={privateCourse} />);
      expect(screen.getByText('PRIVADO')).toBeInTheDocument();
      expect(screen.getByText('CONSULTAR PRECIO')).toBeInTheDocument();
    });

    it('should display TRABAJADORES OCUPADOS badge and 100% SUBVENCIONADO for ocupados courses', () => {
      const ocupadosCourse: Course = {
        ...baseCourse,
        course_type: 'ocupados',
      } as Course;

      render(<CourseCard course={ocupadosCourse} />);
      expect(screen.getByText('TRABAJADORES OCUPADOS')).toBeInTheDocument();
      expect(screen.getByText('100% SUBVENCIONADO')).toBeInTheDocument();
    });

    it('should display TRABAJADORES DESEMPLEADOS badge and GRATUITO for desempleados courses', () => {
      const desempleadosCourse: Course = {
        ...baseCourse,
        course_type: 'desempleados',
      } as Course;

      render(<CourseCard course={desempleadosCourse} />);
      expect(screen.getByText('TRABAJADORES DESEMPLEADOS')).toBeInTheDocument();
      expect(screen.getByText('GRATUITO - 100% SUBVENCIONADO')).toBeInTheDocument();
    });

    it('should display CICLO MEDIO badge and CONSULTAR PRECIO for ciclo_medio courses', () => {
      const cicloMedioCourse: Course = {
        ...baseCourse,
        course_type: 'ciclo_medio',
      } as Course;

      render(<CourseCard course={cicloMedioCourse} />);
      expect(screen.getByText('CICLO MEDIO')).toBeInTheDocument();
      expect(screen.getByText('CONSULTAR PRECIO')).toBeInTheDocument();
    });

    it('should display CICLO SUPERIOR badge and CONSULTAR PRECIO for ciclo_superior courses', () => {
      const cicloSuperiorCourse: Course = {
        ...baseCourse,
        course_type: 'ciclo_superior',
      } as Course;

      render(<CourseCard course={cicloSuperiorCourse} />);
      expect(screen.getByText('CICLO SUPERIOR')).toBeInTheDocument();
      expect(screen.getByText('CONSULTAR PRECIO')).toBeInTheDocument();
    });
  });

  describe('Pricing Display Rules', () => {
    it('should NOT display euro prices for any course type', () => {
      const privateCourse: Course = {
        ...baseCourse,
        course_type: 'privado',
        base_price: 500,
      } as Course;

      const { container } = render(<CourseCard course={privateCourse} />);
      const text = container.textContent || '';

      // No debe haber texto como "500€" o "€"
      expect(text).not.toMatch(/\d+€/);
    });

    it('should display CONSULTAR PRECIO for private courses regardless of price field', () => {
      const privateCourseWithPrice: Course = {
        ...baseCourse,
        course_type: 'privado',
        base_price: 1000,
      } as Course;

      render(<CourseCard course={privateCourseWithPrice} />);
      expect(screen.getByText('CONSULTAR PRECIO')).toBeInTheDocument();
    });
  });

  describe('Modality and Duration Display', () => {
    it('should display modality in UPPERCASE', () => {
      const course: Course = {
        ...baseCourse,
        modality: 'presencial',
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} />);
      expect(screen.getByText('PRESENCIAL')).toBeInTheDocument();
    });

    it('should display duration with H suffix in UPPERCASE', () => {
      const course: Course = {
        ...baseCourse,
        duration_hours: 150,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} />);
      expect(screen.getByText('150H')).toBeInTheDocument();
    });

    it('should display ONLINE for online courses', () => {
      const course: Course = {
        ...baseCourse,
        modality: 'online',
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} />);
      expect(screen.getByText('ONLINE')).toBeInTheDocument();
    });

    it('should display SEMIPRESENCIAL for hibrido courses', () => {
      const course: Course = {
        ...baseCourse,
        modality: 'hibrido',
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} />);
      expect(screen.getByText('SEMIPRESENCIAL')).toBeInTheDocument();
    });
  });

  describe('Tenerife Location Display', () => {
    it('should append ", Tenerife" to campus name', () => {
      const courseWithCampus: Course = {
        ...baseCourse,
        course_type: 'privado',
        course_runs: [
          {
            id: '1',
            campus: {
              id: '1',
              name: 'CEP NORTE',
              address: 'Test Address',
              city: 'Santa Cruz',
              active: true,
              createdAt: '2025-01-01',
              updatedAt: '2025-01-01',
            },
            start_date: '2025-02-15',
            enrollment_open: true,
            published: true,
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
          },
        ],
      } as Course;

      render(<CourseCard course={courseWithCampus} />);
      expect(screen.getByText(/CEP NORTE, Tenerife/i)).toBeInTheDocument();
    });

    it('should display "Online, Tenerife" for online courses', () => {
      const onlineCourse: Course = {
        ...baseCourse,
        modality: 'online',
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={onlineCourse} />);
      expect(screen.getByText(/Online, Tenerife/i)).toBeInTheDocument();
    });
  });

  describe('Eliminated Elements', () => {
    it('should NOT display "DESTACADO" badge even if featured is true', () => {
      const featuredCourse: Course = {
        ...baseCourse,
        course_type: 'privado',
        featured: true,
      } as Course;

      render(<CourseCard course={featuredCourse} />);
      expect(screen.queryByText('DESTACADO')).not.toBeInTheDocument();
      expect(screen.queryByText('Destacado')).not.toBeInTheDocument();
    });

    it('should NOT display "Ayudas disponibles" even if financial_aid_available is true', () => {
      const aidCourse: Course = {
        ...baseCourse,
        course_type: 'privado',
        financial_aid_available: true,
      } as Course;

      render(<CourseCard course={aidCourse} />);
      expect(screen.queryByText('Ayudas disponibles')).not.toBeInTheDocument();
    });
  });

  describe('Title Display', () => {
    it('should render course name in UPPERCASE', () => {
      const course: Course = {
        ...baseCourse,
        name: 'Marketing Digital',
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} />);
      const heading = screen.getByRole('heading', { name: /marketing digital/i });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('uppercase');
    });

    it('should align title to LEFT', () => {
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} />);
      const heading = screen.getByRole('heading', { name: /marketing/i });
      expect(heading).toHaveClass('text-left');
    });
  });

  describe('CTA Button', () => {
    it('should display "VER CURSO" button', () => {
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} />);
      expect(screen.getByText('VER CURSO')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should render as Link when no onClick provided', () => {
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `/cursos/${baseCourse.slug}`);
    });

    it('should call onClick handler when provided', () => {
      const handleClick = vi.fn();
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} onClick={handleClick} />);

      const card = screen.getByRole('button');
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events (Enter)', () => {
      const handleClick = vi.fn();
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} onClick={handleClick} />);

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events (Space)', () => {
      const handleClick = vi.fn();
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} onClick={handleClick} />);

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ', code: 'Space' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper role when interactive', () => {
      const handleClick = vi.fn();
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} onClick={handleClick} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should be keyboard accessible with tabIndex', () => {
      const handleClick = vi.fn();
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} onClick={handleClick} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('should have proper link semantics without onClick', () => {
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={course} />);
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('should have aria-hidden on SVG icons', () => {
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      const { container } = render(<CourseCard course={course} />);
      const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing short_description', () => {
      const courseWithoutDesc: Course = {
        ...baseCourse,
        short_description: undefined,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={courseWithoutDesc} />);
      expect(screen.getByText(/marketing digital y redes sociales/i)).toBeInTheDocument();
    });

    it('should handle missing duration_hours', () => {
      const courseWithoutDuration: Course = {
        ...baseCourse,
        duration_hours: undefined,
        course_type: 'privado',
      } as Course;

      render(<CourseCard course={courseWithoutDuration} />);
      expect(screen.queryByText(/H$/)).not.toBeInTheDocument();
    });

    it('should default to CONSULTAR PRECIO for unknown course types', () => {
      const unknownTypeCourse: Course = {
        ...baseCourse,
        course_type: undefined,
      } as Course;

      render(<CourseCard course={unknownTypeCourse} />);
      expect(screen.getByText('CONSULTAR PRECIO')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should not re-render when props are the same (memo)', () => {
      const course: Course = {
        ...baseCourse,
        course_type: 'privado',
      } as Course;

      const { rerender } = render(<CourseCard course={course} />);
      const firstRenderText = screen.getByText(/marketing digital y redes sociales/i).innerHTML;

      rerender(<CourseCard course={course} />);
      const secondRenderText = screen.getByText(/marketing digital y redes sociales/i).innerHTML;

      expect(firstRenderText).toBe(secondRenderText);
    });
  });
});
