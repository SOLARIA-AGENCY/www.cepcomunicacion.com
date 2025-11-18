/**
 * Ciclos Formativos Page
 *
 * Landing page for professional training cycles (FP)
 */

import Link from 'next/link';

export const metadata = {
  title: 'Ciclos Formativos - CEP Formación',
  description:
    'Formación Profesional de Grado Medio y Superior. Ciclos formativos con titulación oficial.',
};

export default function CiclosPage() {
  return (
    <div className="ciclos-page">
      {/* Hero Section */}
      <section
        className="hero bg-gradient-to-r from-primary to-primary-light text-white"
        style={{ padding: 'clamp(2.5rem, 8vw, 6rem) 0' }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-fluid-hero title-hero font-bold mb-4">Ciclos Formativos</h1>
            <p className="text-fluid-hero-sub mb-6 opacity-90">
              Formación Profesional de Grado Medio y Superior con titulación oficial
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
                Oferta Formativa en Desarrollo
              </h2>
              <p className="text-fluid-body text-neutral-700 mb-6 text-center">
                Estamos preparando nuestra oferta de Ciclos Formativos de Grado Medio y Grado
                Superior. Próximamente dispondrás de toda la información sobre especialidades,
                horarios, requisitos y convocatorias.
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
