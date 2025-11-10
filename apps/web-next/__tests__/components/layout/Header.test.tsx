/**
 * Header Component Tests
 *
 * Comprehensive unit tests for Header navigation component
 * - Navigation structure and rendering
 * - Dropdown functionality
 * - Responsive behavior
 * - Accessibility compliance
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Header } from '@/components/layout/Header';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Header Component - Navigation Structure', () => {
  beforeEach(() => {
    render(<Header />);
  });

  it('should render the CEP Formación logo/brand', () => {
    const logo = screen.getByText(/CEP Formación/i);
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('should render all 8 main navigation items (desktop)', () => {
    // Desktop navigation items
    const inicio = screen.getAllByText(/inicio/i)[0];
    const ciclos = screen.getAllByText(/ciclos/i)[0];
    const cursos = screen.getAllByText(/cursos/i)[0];
    const nosotros = screen.getAllByText(/nosotros/i)[0];
    const faq = screen.getAllByText(/faq/i)[0];
    const blog = screen.getAllByText(/blog/i)[0];
    const contacto = screen.getAllByText(/contacto/i)[0];
    const accesoAlumnos = screen.getAllByText(/acceso alumnos/i)[0];

    expect(inicio).toBeInTheDocument();
    expect(ciclos).toBeInTheDocument();
    expect(cursos).toBeInTheDocument();
    expect(nosotros).toBeInTheDocument();
    expect(faq).toBeInTheDocument();
    expect(blog).toBeInTheDocument();
    expect(contacto).toBeInTheDocument();
    expect(accesoAlumnos).toBeInTheDocument();
  });

  it('should use "NOSOTROS" instead of "SOBRE NOSOTROS"', () => {
    const nosotros = screen.getAllByText(/nosotros/i)[0];
    expect(nosotros).toBeInTheDocument();

    // Verify the href is still /sobre-nosotros
    const nosotrosLink = screen.getAllByRole('link', { name: /nosotros/i })[0];
    expect(nosotrosLink).toHaveAttribute('href', '/sobre-nosotros');
  });

  it('should have correct navigation link hrefs', () => {
    const links = screen.getAllByRole('link');

    // Find specific links
    const inicioLink = links.find(link => link.getAttribute('href') === '/');
    const ciclosLink = links.find(link => link.getAttribute('href') === '/ciclos');
    const nosotrosLink = links.find(link => link.getAttribute('href') === '/sobre-nosotros');
    const faqLink = links.find(link => link.getAttribute('href') === '/faq');
    const blogLink = links.find(link => link.getAttribute('href') === '/blog');
    const contactoLink = links.find(link => link.getAttribute('href') === '/contacto');
    const accesoLink = links.find(link => link.getAttribute('href') === '/acceso-alumnos');

    expect(inicioLink).toBeInTheDocument();
    expect(ciclosLink).toBeInTheDocument();
    expect(nosotrosLink).toBeInTheDocument();
    expect(faqLink).toBeInTheDocument();
    expect(blogLink).toBeInTheDocument();
    expect(contactoLink).toBeInTheDocument();
    expect(accesoLink).toBeInTheDocument();
  });

  it('should NOT display "DESIGN HUB" in navigation', () => {
    const designHub = screen.queryByText(/design hub/i);
    expect(designHub).not.toBeInTheDocument();
  });
});

describe('Header Component - Dropdown Functionality', () => {
  beforeEach(() => {
    render(<Header />);
  });

  it('should have CURSOS dropdown button with aria attributes', () => {
    const cursosButton = screen.getAllByRole('button', { name: /cursos/i })[0];
    expect(cursosButton).toHaveAttribute('aria-haspopup', 'true');
    expect(cursosButton).toHaveAttribute('aria-expanded');
  });

  it('should show dropdown icon (SVG) in CURSOS button', () => {
    const cursosButton = screen.getAllByRole('button', { name: /cursos/i })[0];
    const svg = cursosButton.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should display 4 dropdown items when clicked', async () => {
    const cursosButton = screen.getAllByRole('button', { name: /cursos/i })[0];

    // Click to open dropdown
    fireEvent.click(cursosButton);

    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByText(/cursos privados/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/cursos privados/i)).toBeInTheDocument();
    expect(screen.getByText(/cursos ocupados/i)).toBeInTheDocument();
    expect(screen.getByText(/cursos desempleados/i)).toBeInTheDocument();
    expect(screen.getByText(/cursos teleformación/i)).toBeInTheDocument();
  });

  it('should have correct hrefs for dropdown items', async () => {
    const cursosButton = screen.getAllByRole('button', { name: /cursos/i })[0];
    fireEvent.click(cursosButton);

    await waitFor(() => {
      const privadosLink = screen.getByRole('link', { name: /cursos privados/i });
      expect(privadosLink).toHaveAttribute('href', '/cursos/privados');
    });

    const ocupadosLink = screen.getByRole('link', { name: /cursos ocupados/i });
    const desempleadosLink = screen.getByRole('link', { name: /cursos desempleados/i });
    const teleformacionLink = screen.getByRole('link', { name: /cursos teleformación/i });

    expect(ocupadosLink).toHaveAttribute('href', '/cursos/ocupados');
    expect(desempleadosLink).toHaveAttribute('href', '/cursos/desempleados');
    expect(teleformacionLink).toHaveAttribute('href', '/cursos/teleformacion');
  });

  it('should toggle aria-expanded when dropdown is opened/closed', async () => {
    const cursosButton = screen.getAllByRole('button', { name: /cursos/i })[0];

    // Initially collapsed
    expect(cursosButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(cursosButton);
    await waitFor(() => {
      expect(cursosButton).toHaveAttribute('aria-expanded', 'true');
    });

    // Click to close
    fireEvent.click(cursosButton);
    await waitFor(() => {
      expect(cursosButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('should close dropdown when clicking a dropdown item', async () => {
    const cursosButton = screen.getAllByRole('button', { name: /cursos/i })[0];

    // Open dropdown
    fireEvent.click(cursosButton);
    await waitFor(() => {
      expect(screen.getByText(/cursos privados/i)).toBeInTheDocument();
    });

    // Click a dropdown item
    const privadosLink = screen.getByRole('link', { name: /cursos privados/i });
    fireEvent.click(privadosLink);

    // Dropdown should close
    await waitFor(() => {
      expect(cursosButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

describe('Header Component - Mobile Menu', () => {
  beforeEach(() => {
    render(<Header />);
  });

  it('should render mobile menu toggle button', () => {
    const toggleButton = screen.getByLabelText(/toggle menu/i);
    expect(toggleButton).toBeInTheDocument();
  });

  it('should have aria-expanded attribute on mobile toggle', () => {
    const toggleButton = screen.getByLabelText(/toggle menu/i);
    expect(toggleButton).toHaveAttribute('aria-expanded');
  });

  it('should toggle mobile menu when clicking toggle button', async () => {
    const toggleButton = screen.getByLabelText(/toggle menu/i);

    // Initially closed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('should display all navigation items in mobile menu', async () => {
    const toggleButton = screen.getByLabelText(/toggle menu/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      // All items should appear multiple times (desktop + mobile)
      expect(screen.getAllByText(/inicio/i).length).toBeGreaterThan(1);
      expect(screen.getAllByText(/ciclos/i).length).toBeGreaterThan(1);
      expect(screen.getAllByText(/nosotros/i).length).toBeGreaterThan(1);
      expect(screen.getAllByText(/faq/i).length).toBeGreaterThan(1);
      expect(screen.getAllByText(/blog/i).length).toBeGreaterThan(1);
      expect(screen.getAllByText(/contacto/i).length).toBeGreaterThan(1);
      expect(screen.getAllByText(/acceso alumnos/i).length).toBeGreaterThan(1);
    });
  });

  it('should close mobile menu when clicking a nav link', async () => {
    const toggleButton = screen.getByLabelText(/toggle menu/i);

    // Open mobile menu
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    // Click a navigation link (get the mobile version)
    const links = screen.getAllByRole('link', { name: /inicio/i });
    const mobileLink = links[links.length - 1]; // Last one should be mobile
    fireEvent.click(mobileLink);

    // Menu should close
    await waitFor(() => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

describe('Header Component - Accessibility', () => {
  beforeEach(() => {
    render(<Header />);
  });

  it('should have navigation landmark with aria-label', () => {
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navegación principal');
  });

  it('should have role="menu" on dropdown menu when open', async () => {
    const cursosButton = screen.getAllByRole('button', { name: /cursos/i })[0];
    fireEvent.click(cursosButton);

    await waitFor(() => {
      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
    });
  });

  it('should be keyboard navigable', async () => {
    const user = userEvent.setup();

    // Tab through navigation
    await user.tab();

    // Logo should be focused
    const logo = screen.getByText(/CEP Formación/i).closest('a');
    expect(logo).toHaveFocus();
  });

  it('should have proper button aria-labels', () => {
    const mobileToggle = screen.getByLabelText(/toggle menu/i);
    expect(mobileToggle).toBeInTheDocument();
  });
});

describe('Header Component - Styling', () => {
  beforeEach(() => {
    render(<Header />);
  });

  it('should have nav-uppercase class on navigation links', () => {
    const links = screen.getAllByRole('link', { name: /inicio/i });
    expect(links[0]).toHaveClass('nav-uppercase');
  });

  it('should have btn-primary class on Contacto button', () => {
    const contactoLinks = screen.getAllByRole('link', { name: /contacto/i });
    const contactoButton = contactoLinks[0];
    expect(contactoButton).toHaveClass('btn-primary');
  });

  it('should have btn-secondary class on Acceso Alumnos button', () => {
    const accesoLinks = screen.getAllByRole('link', { name: /acceso alumnos/i });
    const accesoButton = accesoLinks[0];
    expect(accesoButton).toHaveClass('btn-secondary');
  });

  it('should have sticky header classes', () => {
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0', 'z-50');
  });
});

describe('Header Component - Edge Cases', () => {
  it('should handle rapid dropdown toggling', async () => {
    render(<Header />);
    const cursosButton = screen.getAllByRole('button', { name: /cursos/i })[0];

    // Rapid clicks
    fireEvent.click(cursosButton);
    fireEvent.click(cursosButton);
    fireEvent.click(cursosButton);

    // Should end up in a consistent state
    expect(cursosButton).toHaveAttribute('aria-expanded');
  });

  it('should handle mobile menu toggle spam', async () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText(/toggle menu/i);

    // Rapid clicks
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);

    // Should end up in a consistent state
    expect(toggleButton).toHaveAttribute('aria-expanded');
  });
});
