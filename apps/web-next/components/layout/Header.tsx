/**
 * Header Component
 *
 * Responsive navigation header with mobile menu
 * Adapted for Next.js with Link component
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
            CEP Formación
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-3 lg:gap-4 xl:gap-6 items-center text-sm lg:text-base">
            <Link href="/" className="text-neutral-700 hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/cursos" className="text-neutral-700 hover:text-primary transition-colors">
              Cursos
            </Link>
            <Link href="/sobre-nosotros" className="text-neutral-700 hover:text-primary transition-colors hidden lg:inline">
              Sobre Nosotros
            </Link>
            <Link href="/blog" className="text-neutral-700 hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/faq" className="text-neutral-700 hover:text-primary transition-colors hidden xl:inline">
              FAQ
            </Link>
            <Link href="/design-hub" className="text-neutral-400 hover:text-primary transition-colors text-xs lg:text-sm hidden xl:inline">
              Design Hub
            </Link>
            <Link href="/contacto" className="btn-primary py-2 px-3 lg:px-4 text-xs lg:text-sm">
              Contacto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-primary"
            aria-label="Toggle menu"
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
          <div className="md:hidden mt-4 pb-4 border-t border-neutral-200 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-neutral-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/cursos"
                className="text-neutral-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cursos
              </Link>
              <Link
                href="/sobre-nosotros"
                className="text-neutral-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/blog"
                className="text-neutral-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/faq"
                className="text-neutral-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/design-hub"
                className="text-neutral-400 hover:text-primary transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Design Hub
              </Link>
              <Link
                href="/contacto"
                className="btn-primary py-2 px-4 text-sm inline-block text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
