import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroCarousel } from '@/components/ui/HeroCarousel';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('HeroCarousel', () => {
  it('renders carousel with all slides', () => {
    render(<HeroCarousel />);

    // Check if all slide titles are present
    expect(screen.getByText('El momento es ahora')).toBeInTheDocument();
    expect(screen.getByText('Creemos en el poder de la actitud')).toBeInTheDocument();
    expect(screen.getByText('Creemos en ti')).toBeInTheDocument();
  });

  it('renders navigation controls', () => {
    render(<HeroCarousel />);

    // Check for previous and next buttons
    expect(screen.getByLabelText('Anterior')).toBeInTheDocument();
    expect(screen.getByLabelText('Siguiente')).toBeInTheDocument();
  });

  it('renders pagination indicators', () => {
    render(<HeroCarousel />);

    // Check for pagination dots
    expect(screen.getByLabelText('Ir a la diapositiva 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Ir a la diapositiva 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Ir a la diapositiva 3')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<HeroCarousel />);

    // Check for primary action buttons
    expect(screen.getByText('Ver Cursos')).toBeInTheDocument();
    expect(screen.getByText('Descubre Más')).toBeInTheDocument();
    expect(screen.getByText('Comenzar Ahora')).toBeInTheDocument();
  });

  it('renders auto-play control', () => {
    render(<HeroCarousel />);

    // Check for auto-play toggle button
    expect(screen.getByLabelText('Pausar')).toBeInTheDocument();
  });
});
