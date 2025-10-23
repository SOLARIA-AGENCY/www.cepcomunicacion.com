/**
 * Home Page Component
 *
 * Main landing page with hero section, featured courses, and CTA
 */

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero bg-gradient-to-r from-primary to-primary-light text-white py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Formación Profesional de Calidad
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Cursos presenciales, online y semipresenciales. Ciclos formativos y formación
              para el empleo.
            </p>
            <div className="flex gap-4">
              <a href="/cursos" className="btn-primary bg-white text-primary hover:bg-neutral-100">
                Ver Cursos
              </a>
              <a href="/contacto" className="btn-secondary border-white text-white hover:bg-white hover:text-primary">
                Solicitar Información
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Cursos Destacados</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Placeholder for featured courses */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="h-48 bg-neutral-200 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Curso Ejemplo {i}</h3>
                <p className="text-neutral-600 mb-4">
                  Descripción breve del curso y sus características principales.
                </p>
                <a href={`/cursos/${i}`} className="text-primary font-semibold hover:underline">
                  Ver detalles →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contacta con nosotros y te ayudaremos a encontrar el curso perfecto
          </p>
          <a href="/contacto" className="btn-primary bg-white text-secondary hover:bg-neutral-100">
            Contactar Ahora
          </a>
        </div>
      </section>
    </div>
  );
}
