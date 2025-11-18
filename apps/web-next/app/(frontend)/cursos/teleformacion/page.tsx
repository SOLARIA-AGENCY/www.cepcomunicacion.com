/**
 * Cursos Teleformación Page
 *
 * Online learning courses catalog page
 */

import Link from 'next/link';

export const metadata = {
  title: 'Cursos Teleformación - CEP Formación',
  description:
    'Cursos 100% online. Formación a distancia con campus virtual y tutorización personalizada.',
};

export default function CursosTeleformacionPage() {
  return (
    <div className="cursos-teleformacion-page">
      {/* Hero Section */}
      <section
        className="hero bg-gradient-to-r from-primary to-primary-light text-white"
        style={{ padding: 'clamp(2.5rem, 8vw, 6rem) 0' }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-fluid-hero title-hero font-bold mb-4">Cursos Teleformación</h1>
            <p className="text-fluid-hero-sub mb-6 opacity-90">
              Formación 100% online con metodología flexible
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h2 className="section-title-uppercase text-2xl mb-6">Formación Online de Calidad</h2>
              <p className="text-fluid-body text-neutral-700 mb-6 text-center">
                Cursos completamente online con campus virtual, contenidos multimedia interactivos y
                tutorización personalizada. Estudia a tu ritmo desde cualquier lugar.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-semibold mb-2">Campus Virtual</h3>
                  <p className="text-sm text-neutral-600">Acceso 24/7 a todos tus materiales</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">👨‍🏫</div>
                  <h3 className="font-semibold mb-2">Tutorización</h3>
                  <p className="text-sm text-neutral-600">Soporte personalizado</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎓</div>
                  <h3 className="font-semibold mb-2">Certificación</h3>
                  <p className="text-sm text-neutral-600">Titulación oficial acreditada</p>
                </div>
              </div>
              <div className="text-center">
                <Link href="/contacto" className="btn-primary">
                  Explorar Cursos Online
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
