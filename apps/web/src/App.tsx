/**
 * App Component - Main Application Router
 *
 * Defines all routes and layout structure for the CEP Formación website
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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

// 404 page
const NotFoundPage = () => <div className="container py-12 text-center"><h1 className="text-4xl font-bold">404 - Página no encontrada</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <div className="app min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold text-primary">
                CEP Formación
              </Link>
              <div className="flex gap-6">
                <Link to="/" className="text-neutral-700 hover:text-primary transition-colors">
                  Inicio
                </Link>
                <Link to="/cursos" className="text-neutral-700 hover:text-primary transition-colors">
                  Cursos
                </Link>
                <Link to="/sobre-nosotros" className="text-neutral-700 hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
                <Link to="/blog" className="text-neutral-700 hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link to="/faq" className="text-neutral-700 hover:text-primary transition-colors">
                  FAQ
                </Link>
                <Link to="/contacto" className="btn-primary py-2 px-4 text-sm">
                  Contacto
                </Link>
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
                  <li><Link to="/cursos" className="text-neutral-400 hover:text-white transition-colors">Cursos</Link></li>
                  <li><Link to="/sobre-nosotros" className="text-neutral-400 hover:text-white transition-colors">Sobre Nosotros</Link></li>
                  <li><Link to="/blog" className="text-neutral-400 hover:text-white transition-colors">Blog</Link></li>
                  <li><Link to="/contacto" className="text-neutral-400 hover:text-white transition-colors">Contacto</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/politica-privacidad" className="text-neutral-400 hover:text-white transition-colors">Política de Privacidad</Link></li>
                  <li><Link to="/aviso-legal" className="text-neutral-400 hover:text-white transition-colors">Aviso Legal</Link></li>
                  <li><Link to="/cookies" className="text-neutral-400 hover:text-white transition-colors">Política de Cookies</Link></li>
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
