/**
 * App Component - Main Application Router
 *
 * Defines all routes and layout structure for the CEP Formación website
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageErrorBoundary } from '@components/boundaries';

// Pages
import HomePage from '@pages/home/HomePage';
import CoursesPage from '@pages/courses/CoursesPage';
import CourseDetailPage from '@pages/courses/CourseDetailPage';
import ContactPage from '@pages/contact/ContactPage';

// Placeholder pages (will be implemented)
const AboutPage = () => <div className="container py-12"><h1 className="text-4xl font-bold">Sobre Nosotros</h1></div>;
const BlogPage = () => <div className="container py-12"><h1 className="text-4xl font-bold">Blog</h1></div>;
const FAQPage = () => <div className="container py-12"><h1 className="text-4xl font-bold">Preguntas Frecuentes</h1></div>;
const NotFoundPage = () => <div className="container py-12 text-center"><h1 className="text-4xl font-bold">404 - Página no encontrada</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <div className="app min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold text-primary">
                CEP Formación
              </a>
              <div className="flex gap-6">
                <a href="/" className="text-neutral-700 hover:text-primary transition-colors">
                  Inicio
                </a>
                <a href="/cursos" className="text-neutral-700 hover:text-primary transition-colors">
                  Cursos
                </a>
                <a href="/sobre-nosotros" className="text-neutral-700 hover:text-primary transition-colors">
                  Sobre Nosotros
                </a>
                <a href="/blog" className="text-neutral-700 hover:text-primary transition-colors">
                  Blog
                </a>
                <a href="/faq" className="text-neutral-700 hover:text-primary transition-colors">
                  FAQ
                </a>
                <a href="/contacto" className="btn-primary py-2 px-4 text-sm">
                  Contacto
                </a>
              </div>
            </div>
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-neutral-900 text-white py-12">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">CEP Formación</h3>
                <p className="text-neutral-400 text-sm">
                  Centro de formación profesional de calidad con cursos presenciales, online y semipresenciales.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
                <ul className="space-y-2">
                  <li><a href="/cursos" className="text-neutral-400 hover:text-white transition-colors">Cursos</a></li>
                  <li><a href="/sobre-nosotros" className="text-neutral-400 hover:text-white transition-colors">Sobre Nosotros</a></li>
                  <li><a href="/blog" className="text-neutral-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="/contacto" className="text-neutral-400 hover:text-white transition-colors">Contacto</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="/politica-privacidad" className="text-neutral-400 hover:text-white transition-colors">Política de Privacidad</a></li>
                  <li><a href="/aviso-legal" className="text-neutral-400 hover:text-white transition-colors">Aviso Legal</a></li>
                  <li><a href="/cookies" className="text-neutral-400 hover:text-white transition-colors">Política de Cookies</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contacto</h4>
                <ul className="space-y-2 text-neutral-400 text-sm">
                  <li>Tel: +34 900 000 000</li>
                  <li>info@cepcomunicacion.com</li>
                  <li>Lunes a Viernes: 9:00 - 19:00</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CEP Formación. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
