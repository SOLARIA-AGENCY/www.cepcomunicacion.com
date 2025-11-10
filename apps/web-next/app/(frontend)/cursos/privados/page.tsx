/**
 * Cursos Privados Page
 *
 * Private courses catalog page
 */

import Link from 'next/link';

export const metadata = {
  title: 'Cursos Privados - CEP Formación',
  description: 'Cursos privados de formación profesional. Amplía tus competencias con formación especializada.',
};

export default function CursosPrivadosPage() {
  return (
    <div className="cursos-privados-page">
      {/* Hero Section */}
      <section className="hero bg-gradient-to-r from-primary to-primary-light text-white" style={{ padding: 'clamp(2.5rem, 8vw, 6rem) 0' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-fluid-hero title-hero font-bold mb-4">
              Cursos Privados
            </h1>
            <p className="text-fluid-hero-sub mb-6 opacity-90">
              Formación especializada para tu desarrollo profesional
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h2 className="section-title-uppercase text-2xl mb-6">
                Catálogo de Cursos en Desarrollo
              </h2>
              <p className="text-fluid-body text-neutral-700 mb-6 text-center">
                Estamos preparando nuestra oferta de cursos privados con formación especializada
                en diferentes áreas profesionales. Próximamente dispondrás del catálogo completo.
              </p>
              <div className="text-center">
                <Link href="/contacto" className="btn-primary">
                  Solicitar Información
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
