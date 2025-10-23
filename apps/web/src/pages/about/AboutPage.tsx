/**
 * About Page
 *
 * Company information, mission, vision, and values.
 * Static content page optimized for SEO and accessibility.
 */

import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Sobre Nosotros</h1>
            <p className="text-xl opacity-90">
              CEP Formación es un centro líder en formación profesional, comprometido con la
              excelencia educativa y el desarrollo de competencias que transforman carreras
              profesionales.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="card">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-neutral-900">Nuestra Misión</h2>
              <p className="text-neutral-700 leading-relaxed">
                Proporcionar formación profesional de alta calidad, accesible y práctica que
                prepare a nuestros estudiantes para los desafíos del mercado laboral actual.
                Nos comprometemos a ofrecer programas educativos innovadores con docentes
                expertos y contenidos actualizados constantemente.
              </p>
            </div>

            {/* Vision */}
            <div className="card">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-neutral-900">Nuestra Visión</h2>
              <p className="text-neutral-700 leading-relaxed">
                Ser el centro de formación profesional de referencia en España, reconocido por
                la excelencia de nuestros programas, la empleabilidad de nuestros egresados y
                nuestro compromiso con la innovación educativa y la transformación digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900">Nuestros Valores</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Estos principios guían nuestro trabajo diario y definen nuestra cultura
              institucional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Excelencia</h3>
              <p className="text-neutral-600">
                Nos comprometemos con la calidad en cada aspecto de nuestra formación, desde el
                contenido hasta la metodología de enseñanza.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Inclusión</h3>
              <p className="text-neutral-600">
                Creemos en la educación accesible para todos. Ofrecemos ayudas y flexibilidad
                para que nadie quede excluido de la formación.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Innovación</h3>
              <p className="text-neutral-600">
                Incorporamos las últimas tecnologías y metodologías educativas para ofrecer una
                experiencia de aprendizaje moderna y efectiva.
              </p>
            </div>

            {/* Value 4 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Empleabilidad</h3>
              <p className="text-neutral-600">
                Diseñamos nuestros programas pensando en las necesidades reales del mercado
                laboral, preparando a nuestros estudiantes para el éxito profesional.
              </p>
            </div>

            {/* Value 5 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Compromiso</h3>
              <p className="text-neutral-600">
                Estamos comprometidos con el éxito de cada estudiante, ofreciendo apoyo continuo
                durante y después de su formación.
              </p>
            </div>

            {/* Value 6 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Transparencia</h3>
              <p className="text-neutral-600">
                Mantenemos una comunicación clara y honesta con nuestros estudiantes, siempre con
                información detallada sobre programas, costos y resultados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-neutral-900">¿Por Qué Elegirnos?</h2>
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-neutral-900">
                    Docentes Expertos
                  </h3>
                  <p className="text-neutral-600">
                    Nuestro equipo docente está formado por profesionales en activo con amplia
                    experiencia en el sector, que comparten conocimientos prácticos y actuales.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-neutral-900">
                    Flexibilidad Total
                  </h3>
                  <p className="text-neutral-600">
                    Ofrecemos modalidades presencial, online y semipresencial para adaptarnos a tu
                    ritmo de vida y necesidades personales.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-neutral-900">
                    Certificación Oficial
                  </h3>
                  <p className="text-neutral-600">
                    Todos nuestros cursos están homologados y ofrecen certificados oficiales
                    reconocidos por el Ministerio de Educación y empresas del sector.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-neutral-900">
                    Ayudas y Financiación
                  </h3>
                  <p className="text-neutral-600">
                    Facilitamos el acceso a la formación con becas, subvenciones y planes de
                    financiación flexibles sin intereses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Transformar tu Carrera?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a miles de estudiantes que ya han confiado en CEP Formación para alcanzar sus
            objetivos profesionales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cursos" className="btn-primary bg-white text-primary hover:bg-neutral-100">
              Ver Cursos
            </Link>
            <Link
              to="/contacto"
              className="btn-secondary border-white text-white hover:bg-white hover:text-primary"
            >
              Solicitar Información
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
