/**
 * App Component - Main Application Router
 *
 * Defines all routes and layout structure for the CEP Formación website
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { PageErrorBoundary } from '@components/boundaries';

// Pages
import HomePage from '@pages/home/HomePage';
import CoursesPage from '@pages/courses/CoursesPage';
import CourseDetailPage from '@pages/courses/CourseDetailPage';
import ContactPage from '@pages/contact/ContactPage';
import AboutPage from '@pages/about/AboutPage';
import FAQPage from '@pages/faq/FAQPage';
import BlogPage from '@pages/blog/BlogPage';
import BlogDetailPage from '@pages/blog/BlogDetailPage';
import DesignHubPage from '@pages/design-hub/DesignHubPage';

// 404 page
const NotFoundPage = () => <div className="container py-12 text-center"><h1 className="text-4xl font-bold">404 - Página no encontrada</h1></div>;

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app min-h-screen flex flex-col">
        {/* Header - Responsive with mobile menu */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                CEP Formación
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex gap-3 lg:gap-4 xl:gap-6 items-center text-sm lg:text-base">
                <Link to="/" className="text-neutral-700 hover:text-primary transition-colors">
                  Inicio
                </Link>
                <Link to="/cursos" className="text-neutral-700 hover:text-primary transition-colors">
                  Cursos
                </Link>
                <Link to="/sobre-nosotros" className="text-neutral-700 hover:text-primary transition-colors hidden lg:inline">
                  Sobre Nosotros
                </Link>
                <Link to="/blog" className="text-neutral-700 hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link to="/faq" className="text-neutral-700 hover:text-primary transition-colors hidden xl:inline">
                  FAQ
                </Link>
                <Link to="/design-hub" className="text-neutral-400 hover:text-primary transition-colors text-xs lg:text-sm hidden xl:inline">
                  Design Hub
                </Link>
                <Link to="/contacto" className="btn-primary py-2 px-3 lg:px-4 text-xs lg:text-sm">
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
                    to="/"
                    className="text-neutral-700 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/cursos"
                    className="text-neutral-700 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cursos
                  </Link>
                  <Link
                    to="/sobre-nosotros"
                    className="text-neutral-700 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sobre Nosotros
                  </Link>
                  <Link
                    to="/blog"
                    className="text-neutral-700 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    to="/faq"
                    className="text-neutral-700 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/design-hub"
                    className="text-neutral-400 hover:text-primary transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Design Hub
                  </Link>
                  <Link
                    to="/contacto"
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

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <PageErrorBoundary>
                  <HomePage />
                </PageErrorBoundary>
              }
            />
            <Route
              path="/cursos/:slug"
              element={
                <PageErrorBoundary>
                  <CourseDetailPage />
                </PageErrorBoundary>
              }
            />
            <Route
              path="/cursos"
              element={
                <PageErrorBoundary>
                  <CoursesPage />
                </PageErrorBoundary>
              }
            />
            <Route
              path="/contacto"
              element={
                <PageErrorBoundary>
                  <ContactPage />
                </PageErrorBoundary>
              }
            />
            <Route
              path="/sobre-nosotros"
              element={
                <PageErrorBoundary>
                  <AboutPage />
                </PageErrorBoundary>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <PageErrorBoundary>
                  <BlogDetailPage />
                </PageErrorBoundary>
              }
            />
            <Route
              path="/blog"
              element={
                <PageErrorBoundary>
                  <BlogPage />
                </PageErrorBoundary>
              }
            />
            <Route
              path="/faq"
              element={
                <PageErrorBoundary>
                  <FAQPage />
                </PageErrorBoundary>
              }
            />
            <Route
              path="/design-hub"
              element={
                <PageErrorBoundary>
                  <DesignHubPage />
                </PageErrorBoundary>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer - Fluid Responsive */}
        <footer className="bg-neutral-900 text-white" style={{ padding: 'clamp(1.5rem, 4vw, 3rem) 0' }}>
          <div className="container">
            <div className="grid-fluid-footer">
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">CEP Formación</h3>
                <p className="text-neutral-400 text-xs md:text-sm">
                  Centro de formación profesional de calidad con cursos presenciales, online y semipresenciales.
                </p>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Enlaces Rápidos</h4>
                <ul className="space-y-2">
                  <li><Link to="/cursos" className="text-neutral-400 hover:text-white transition-colors text-sm">Cursos</Link></li>
                  <li><Link to="/sobre-nosotros" className="text-neutral-400 hover:text-white transition-colors text-sm">Sobre Nosotros</Link></li>
                  <li><Link to="/blog" className="text-neutral-400 hover:text-white transition-colors text-sm">Blog</Link></li>
                  <li><Link to="/contacto" className="text-neutral-400 hover:text-white transition-colors text-sm">Contacto</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/politica-privacidad" className="text-neutral-400 hover:text-white transition-colors text-sm">Política de Privacidad</Link></li>
                  <li><Link to="/aviso-legal" className="text-neutral-400 hover:text-white transition-colors text-sm">Aviso Legal</Link></li>
                  <li><Link to="/cookies" className="text-neutral-400 hover:text-white transition-colors text-sm">Política de Cookies</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contacto</h4>
                <ul className="space-y-2 text-neutral-400 text-xs md:text-sm">
                  <li>Tel: +34 900 000 000</li>
                  <li>info@cepcomunicacion.com</li>
                  <li>Lunes a Viernes: 9:00 - 19:00</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-neutral-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-neutral-400 text-xs md:text-sm">
              <p>&copy; {new Date().getFullYear()} CEP Formación. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
