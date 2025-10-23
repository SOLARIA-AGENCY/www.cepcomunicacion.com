/**
 * Home Page Component
 *
 * Main landing page with hero section, featured courses, and CTA
 */

import { useCourses } from '@hooks/useCourses';
import { CourseCard, Alert } from '@components/ui';
import { CourseCardSkeleton } from '@pages/courses/skeletons';

export default function HomePage() {
  // Fetch featured courses only
  const featuredCoursesState = useCourses({ featured: true });

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
              para el empleo con ayudas disponibles.
            </p>
            <div className="flex gap-4 flex-wrap">
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
      <section className="py-16 bg-neutral-50">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Cursos Destacados</h2>
            <p className="text-neutral-600">
              Descubre nuestros cursos más populares y con mayor demanda
            </p>
          </div>

          {/* Loading State */}
          {featuredCoursesState.status === 'loading' && (
            <div className="grid md:grid-cols-3 gap-8">
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </div>
          )}

          {/* Error State */}
          {featuredCoursesState.status === 'error' && (
            <Alert variant="error" title="Error al Cargar Cursos">
              {featuredCoursesState.error}
            </Alert>
          )}

          {/* Success State */}
          {featuredCoursesState.status === 'success' && (
            <>
              {featuredCoursesState.data && featuredCoursesState.data.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-3 gap-8">
                    {featuredCoursesState.data.slice(0, 3).map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>

                  {/* View All Courses Link */}
                  <div className="text-center mt-8">
                    <a
                      href="/cursos"
                      className="inline-flex items-center text-primary font-semibold hover:underline"
                    >
                      Ver todos los cursos
                      <svg
                        className="ml-2 w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-600">
                    No hay cursos destacados disponibles en este momento.
                  </p>
                  <a href="/cursos" className="mt-4 inline-block text-primary hover:underline">
                    Ver todos los cursos disponibles
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Formación de Calidad</h3>
              <p className="text-neutral-600">
                Cursos homologados con docentes expertos y contenidos actualizados
              </p>
            </div>

            {/* Feature 2 */}
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ayudas Disponibles</h3>
              <p className="text-neutral-600">
                Acceso a becas y financiación para facilitar tu formación profesional
              </p>
            </div>

            {/* Feature 3 */}
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexibilidad</h3>
              <p className="text-neutral-600">
                Modalidades presencial, online y semipresencial para adaptarnos a ti
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contacta con nosotros y te ayudaremos a encontrar el curso perfecto para
            impulsar tu carrera profesional
          </p>
          <a href="/contacto" className="btn-primary bg-white text-secondary hover:bg-neutral-100">
            Solicitar Información
          </a>
        </div>
      </section>
    </div>
  );
}
