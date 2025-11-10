/**
 * Header Component
 *
 * Responsive navigation header with mobile menu and dropdown
 * Updated structure: INICIO | CICLOS | SEDES | CURSOS ▼ | NOSOTROS | FAQ | BLOG | CONTACTO | ACCESO ALUMNOS
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container py-4" role="navigation" aria-label="Navegación principal">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
            CEP Formación
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-3 xl:gap-4 items-center">
            <Link href="/" className="nav-uppercase text-neutral-700 hover:text-primary transition-colors">
              Inicio
            </Link>

            <Link href="/ciclos" className="nav-uppercase text-neutral-700 hover:text-primary transition-colors">
              Ciclos
            </Link>

            <Link href="/sedes" className="nav-uppercase text-neutral-700 hover:text-primary transition-colors">
              Sedes
            </Link>

            {/* DROPDOWN CURSOS */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                className="nav-uppercase text-neutral-700 hover:text-primary transition-colors flex items-center gap-1"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                Cursos
                <svg
                  className={`w-3 h-3 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M6 8L2 4h8z"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[240px] border border-neutral-100"
                  role="menu"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href="/cursos/privados"
                    className="block px-5 py-3 nav-uppercase text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all hover:pl-6"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Cursos Privados
                  </Link>
                  <Link
                    href="/cursos/ocupados"
                    className="block px-5 py-3 nav-uppercase text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all hover:pl-6"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Cursos Ocupados
                  </Link>
                  <Link
                    href="/cursos/desempleados"
                    className="block px-5 py-3 nav-uppercase text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all hover:pl-6"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Cursos Desempleados
                  </Link>
                  <Link
                    href="/cursos/teleformacion"
                    className="block px-5 py-3 nav-uppercase text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all hover:pl-6"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Cursos Teleformación
                  </Link>
                </div>
              )}
            </div>

            <Link href="/sobre-nosotros" className="nav-uppercase text-neutral-700 hover:text-primary transition-colors">
              Nosotros
            </Link>

            <Link href="/faq" className="nav-uppercase text-neutral-700 hover:text-primary transition-colors">
              FAQ
            </Link>

            <Link href="/blog" className="nav-uppercase text-neutral-700 hover:text-primary transition-colors">
              Blog
            </Link>

            <Link href="/contacto" className="nav-uppercase btn-primary py-2 px-4">
              Contacto
            </Link>

            <Link href="/acceso-alumnos" className="nav-uppercase btn-secondary py-2 px-4">
              Acceso Alumnos
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-primary"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-neutral-200 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="nav-uppercase text-neutral-700 hover:text-primary transition-colors text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>

              <Link
                href="/ciclos"
                className="nav-uppercase text-neutral-700 hover:text-primary transition-colors text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ciclos
              </Link>

              <Link
                href="/sedes"
                className="nav-uppercase text-neutral-700 hover:text-primary transition-colors text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sedes
              </Link>

              {/* Mobile Dropdown CURSOS */}
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="nav-uppercase text-neutral-700 hover:text-primary transition-colors text-base flex items-center gap-2 w-full"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  Cursos
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M6 8L2 4h8z"/>
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 border-primary">
                    <Link
                      href="/cursos/privados"
                      className="block py-2 nav-uppercase text-sm text-neutral-700 hover:text-primary transition-colors"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Cursos Privados
                    </Link>
                    <Link
                      href="/cursos/ocupados"
                      className="block py-2 nav-uppercase text-sm text-neutral-700 hover:text-primary transition-colors"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Cursos Ocupados
                    </Link>
                    <Link
                      href="/cursos/desempleados"
                      className="block py-2 nav-uppercase text-sm text-neutral-700 hover:text-primary transition-colors"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Cursos Desempleados
                    </Link>
                    <Link
                      href="/cursos/teleformacion"
                      className="block py-2 nav-uppercase text-sm text-neutral-700 hover:text-primary transition-colors"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Cursos Teleformación
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/sobre-nosotros"
                className="nav-uppercase text-neutral-700 hover:text-primary transition-colors text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nosotros
              </Link>

              <Link
                href="/faq"
                className="nav-uppercase text-neutral-700 hover:text-primary transition-colors text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>

              <Link
                href="/blog"
                className="nav-uppercase text-neutral-700 hover:text-primary transition-colors text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>

              <Link
                href="/contacto"
                className="nav-uppercase btn-primary py-2 px-4 inline-block text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>

              <Link
                href="/acceso-alumnos"
                className="nav-uppercase btn-secondary py-2 px-4 inline-block text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Acceso Alumnos
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
