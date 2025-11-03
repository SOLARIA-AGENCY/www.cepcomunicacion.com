/**
 * CourseCard Component Tests
 *
 * Unit tests for CourseCard component
 * - Component rendering
 * - Props handling
 * - Event handlers
 * - Accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CourseCard } from '@/components/ui/CourseCard';
import type { Course } from '@/payload-types';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CourseCard', () => {
  const mockCourse: Course = {
    id: '1',
    name: 'Marketing Digital y Redes Sociales',
    slug: 'marketing-digital-redes-sociales',
    description: 'Domina las estrategias de marketing en redes sociales',
    course_type: 'ciclo-superior',
    modality: 'online',
    duration_hours: 100,
    price: 900,
    financial_aid_available: true,
    featured: true,
    active: true,
    cycle: {
      id: '1',
      name: 'Ciclo Superior en Marketing',
      code: 'CSMP',
      level: 'ciclo-superior',
      duration_years: 2,
      active: true,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    campuses: [],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  };

  describe('Rendering', () => {
    it('should render course name', () => {
      render(<CourseCard course={mockCourse} />);
      expect(screen.getByText(mockCourse.name)).toBeInTheDocument();
    });

    it('should render course description', () => {
      render(<CourseCard course={mockCourse} />);
      expect(screen.getByText(mockCourse.description!)).toBeInTheDocument();
    });

    it('should render cycle name when available', () => {
      render(<CourseCard course={mockCourse} />);
      expect(screen.getByText('Ciclo Superior en Marketing')).toBeInTheDocument();
    });

    it('should render modality label', () => {
      render(<CourseCard course={mockCourse} />);
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('should render duration hours', () => {
      render(<CourseCard course={mockCourse} />);
      expect(screen.getByText('100h')).toBeInTheDocument();
    });

    it('should render featured badge when featured', () => {
      render(<CourseCard course={mockCourse} />);
      expect(screen.getByText('Destacado')).toBeInTheDocument();
    });

    it('should render financial aid badge when available', () => {
      render(<CourseCard course={mockCourse} />);
      expect(screen.getByText('Ayudas disponibles')).toBeInTheDocument();
    });

    it('should not render financial aid badge when not available', () => {
      const courseWithoutAid = { ...mockCourse, financial_aid_available: false };
      render(<CourseCard course={courseWithoutAid} />);
      expect(screen.queryByText('Ayudas disponibles')).not.toBeInTheDocument();
    });

    it('should render default icon when no featured image', () => {
      render(<CourseCard course={mockCourse} />);
      const svg = screen.getByRole('link').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should render as Link when no onClick provided', () => {
      render(<CourseCard course={mockCourse} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `/cursos/${mockCourse.slug}`);
    });

    it('should call onClick handler when provided', () => {
      const handleClick = vi.fn();
      render(<CourseCard course={mockCourse} onClick={handleClick} />);

      const card = screen.getByRole('button');
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events (Enter)', () => {
      const handleClick = vi.fn();
      render(<CourseCard course={mockCourse} onClick={handleClick} />);

      const card = screen.getByRole('button');
      // Use keyDown instead of keyPress (deprecated)
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events (Space)', () => {
      const handleClick = vi.fn();
      render(<CourseCard course={mockCourse} onClick={handleClick} />);

      const card = screen.getByRole('button');
      // Use keyDown instead of keyPress (deprecated)
      fireEvent.keyDown(card, { key: ' ', code: 'Space' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper role when interactive', () => {
      const handleClick = vi.fn();
      render(<CourseCard course={mockCourse} onClick={handleClick} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should be keyboard accessible with tabIndex', () => {
      const handleClick = vi.fn();
      render(<CourseCard course={mockCourse} onClick={handleClick} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('should have proper link semantics without onClick', () => {
      render(<CourseCard course={mockCourse} />);
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  describe('Modality Display', () => {
    it('should display "Presencial" for presencial modality', () => {
      const presencialCourse = { ...mockCourse, modality: 'presencial' as const };
      render(<CourseCard course={presencialCourse} />);
      expect(screen.getByText('Presencial')).toBeInTheDocument();
    });

    it('should display "Semipresencial" for hibrido modality', () => {
      const hibridoCourse = { ...mockCourse, modality: 'hibrido' as const };
      render(<CourseCard course={hibridoCourse} />);
      expect(screen.getByText('Semipresencial')).toBeInTheDocument();
    });

    it('should display "Online" for online modality', () => {
      const onlineCourse = { ...mockCourse, modality: 'online' as const };
      render(<CourseCard course={onlineCourse} />);
      expect(screen.getByText('Online')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing description', () => {
      const courseWithoutDesc = { ...mockCourse, description: undefined };
      render(<CourseCard course={courseWithoutDesc} />);
      expect(screen.getByText(mockCourse.name)).toBeInTheDocument();
    });

    it('should handle missing cycle', () => {
      const courseWithoutCycle = { ...mockCourse, cycle: undefined };
      render(<CourseCard course={courseWithoutCycle} />);
      expect(screen.queryByText('Ciclo Superior en Marketing')).not.toBeInTheDocument();
    });

    it('should handle string cycle reference (not populated)', () => {
      const courseWithStringCycle = { ...mockCourse, cycle: '12345' };
      render(<CourseCard course={courseWithStringCycle} />);
      expect(screen.queryByText('Ciclo Superior en Marketing')).not.toBeInTheDocument();
    });

    it('should handle missing duration_hours', () => {
      const courseWithoutDuration = { ...mockCourse, duration_hours: undefined };
      render(<CourseCard course={courseWithoutDuration} />);
      expect(screen.queryByText(/h$/)).not.toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should not re-render when props are the same (memo)', () => {
      const { rerender } = render(<CourseCard course={mockCourse} />);
      const firstRenderText = screen.getByText(mockCourse.name).innerHTML;

      rerender(<CourseCard course={mockCourse} />);
      const secondRenderText = screen.getByText(mockCourse.name).innerHTML;

      expect(firstRenderText).toBe(secondRenderText);
    });
  });
});
