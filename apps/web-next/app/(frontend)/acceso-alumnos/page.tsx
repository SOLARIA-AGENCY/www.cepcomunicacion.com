/**
 * Acceso Alumnos Page
 *
 * Student login and access portal
 */

import Link from 'next/link';

export const metadata = {
  title: 'Acceso Alumnos - CEP Formación',
  description:
    'Portal de acceso para alumnos matriculados. Accede a tus cursos, materiales y seguimiento académico.',
};

export default function AccesoAlumnosPage() {
  return (
    <div className="acceso-alumnos-page">
      {/* Hero Section */}
      <section
        className="hero bg-gradient-to-r from-primary to-primary-light text-white"
        style={{ padding: 'clamp(2.5rem, 8vw, 6rem) 0' }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-fluid-hero title-hero font-bold mb-4">Acceso Alumnos</h1>
            <p className="text-fluid-hero-sub mb-6 opacity-90">
              Accede a tu campus virtual y gestiona tu formación
            </p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-md mx-auto">
            <div className="card">
              <h2 className="section-title-uppercase text-2xl mb-6">Identificación de Usuario</h2>

              <div className="space-y-6">
                <p className="text-center text-neutral-700">
                  El portal de alumnos estará disponible próximamente.
                </p>

                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="font-semibold text-center mb-4">¿Necesitas ayuda?</h3>
                  <div className="space-y-3">
                    <Link href="/faq" className="block text-center text-primary hover:underline">
                      Preguntas Frecuentes
                    </Link>
                    <Link href="/contacto" className="block text-center btn-primary">
                      Contactar con Soporte
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
