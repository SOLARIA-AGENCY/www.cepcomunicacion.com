/**
 * Contact Page
 *
 * Contact form and information
 * NOTE: Form functionality will be implemented when Leads collection is available
 */

import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-primary to-primary-light text-white"
        style={{ padding: 'clamp(2rem, 6vw, 4rem) 0' }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-fluid-section-title font-bold mb-4">Contacto</h1>
            <p className="text-fluid-body opacity-90">
              Estamos aquí para ayudarte. Contacta con nosotros y resolveremos todas tus dudas.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Envíanos un mensaje</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <svg
                  className="w-12 h-12 text-blue-500 mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-neutral-700 mb-3">
                  El formulario de contacto estará disponible próximamente.
                </p>
                <p className="text-sm text-neutral-600">
                  Por favor, utiliza la información de contacto de la derecha mientras tanto.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Información de Contacto
                </h2>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Teléfono</h3>
                      <p className="text-neutral-600">+34 900 000 000</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                      <p className="text-neutral-600">info@cepcomunicacion.com</p>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Horario</h3>
                      <p className="text-neutral-600">Lunes a Viernes: 9:00 - 19:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  ¿Buscas información sobre cursos?
                </h3>
                <p className="text-neutral-600 text-sm mb-4">
                  Explora nuestro catálogo completo de cursos disponibles
                </p>
                <Link href="/cursos" className="btn-primary inline-block w-full text-center">
                  Ver Cursos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
