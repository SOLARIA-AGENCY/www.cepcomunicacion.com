/**
 * Blog Page
 *
 * Blog posts listing
 * NOTE: Will be implemented when BlogPosts collection is available
 */

import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white" style={{ padding: 'clamp(2rem, 6vw, 4rem) 0' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-fluid-section-title font-bold mb-4">Blog</h1>
            <p className="text-fluid-body opacity-90">
              Artículos, noticias y recursos sobre formación profesional
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Próximamente</h2>
            <p className="text-neutral-600 mb-6">
              Estamos trabajando en traerte contenido de calidad sobre formación profesional, tendencias del sector y consejos para tu desarrollo profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cursos" className="btn-primary inline-block">
                Ver Cursos
              </Link>
              <Link href="/" className="btn-secondary inline-block">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
