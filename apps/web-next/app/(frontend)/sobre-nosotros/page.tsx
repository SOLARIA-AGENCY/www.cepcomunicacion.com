/**
 * About Page
 *
 * Company information, mission, vision, and values
 */

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white" style={{ padding: 'clamp(2.5rem, 8vw, 6rem) 0' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-fluid-hero font-bold mb-4 md:mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-fluid-hero-sub opacity-90">
              Formación profesional de calidad desde hace más de 20 años
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
              <h2 className="text-fluid-section-title font-bold mb-6 text-center">Nuestra Misión</h2>
              <p className="text-fluid-body text-neutral-700 leading-relaxed mb-4">
                En CEP Formación nos dedicamos a proporcionar educación de excelencia que impulse el desarrollo profesional y personal de nuestros estudiantes. Creemos en el poder transformador de la formación continua y trabajamos para hacer accesible la educación de calidad a todos.
              </p>
              <p className="text-fluid-body text-neutral-700 leading-relaxed">
                Nuestro compromiso es ofrecer programas actualizados, docentes expertos y un acompañamiento personalizado que garantice el éxito de cada estudiante en su trayectoria profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-neutral-50" style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <h2 className="text-fluid-section-title font-bold mb-8 text-center">Nuestros Valores</h2>
          <div className="grid-fluid-features">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excelencia</h3>
              <p className="text-neutral-600">
                Buscamos la máxima calidad en todo lo que hacemos, desde nuestros programas hasta el trato con nuestros estudiantes.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compromiso</h3>
              <p className="text-neutral-600">
                Estamos comprometidos con el éxito de nuestros estudiantes y su desarrollo profesional continuo.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovación</h3>
              <p className="text-neutral-600">
                Adoptamos las últimas tecnologías y metodologías para ofrecer la mejor experiencia de aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white" style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container text-center">
          <h2 className="text-fluid-section-title font-bold mb-4 md:mb-6">
            Únete a Nuestra Comunidad
          </h2>
          <p className="text-fluid-hero-sub mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
            Descubre cómo podemos ayudarte a alcanzar tus objetivos profesionales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cursos" className="btn-primary bg-white text-secondary hover:bg-neutral-100 inline-block">
              Ver Cursos
            </Link>
            <Link href="/contacto" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-secondary inline-block">
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
