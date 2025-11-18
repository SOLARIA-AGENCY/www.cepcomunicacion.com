/**
 * Cursos para Desempleados Page
 *
 * Courses for unemployed workers catalog page
 */

import Link from 'next/link';

export const metadata = {
  title: 'Cursos para Desempleados - CEP Formación',
  description:
    'Cursos subvencionados para personas en situación de desempleo. Formación gratuita con certificación oficial.',
};

export default function CursosDesempleadosPage() {
  return (
    <div className="cursos-desempleados-page">
      {/* Hero Section */}
      <section
        className="hero bg-gradient-to-r from-primary to-primary-light text-white"
        style={{ padding: 'clamp(2.5rem, 8vw, 6rem) 0' }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-fluid-hero title-hero font-bold mb-4">Cursos para Desempleados</h1>
            <p className="text-fluid-hero-sub mb-6 opacity-90">
              Formación subvencionada para mejorar tu empleabilidad
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h2 className="section-title-uppercase text-2xl mb-6">Formación para el Empleo</h2>
              <p className="text-fluid-body text-neutral-700 mb-6 text-center">
                Cursos gratuitos financiados por organismos públicos para personas en situación de
                desempleo. Mejora tus competencias profesionales y aumenta tus oportunidades
                laborales.
              </p>
              <div className="text-center">
                <Link href="/contacto" className="btn-primary">
                  Ver Cursos Disponibles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
