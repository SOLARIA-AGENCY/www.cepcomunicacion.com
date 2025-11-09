/**
 * Home Page Component
 *
 * Main landing page with hero section, featured courses, and CTA
 * Server Component with data fetching from Payload CMS
 */

import Link from 'next/link';
import { CourseCard } from '@/components/ui';
import { payloadClient } from '@/lib/payloadClient';
import type { Course } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch featured courses from Payload CMS via REST API
  let featuredCourses: Course[] = [];
  try {
    const coursesData = await payloadClient.find('courses', {
      where: {
        featured: {
          equals: true,
        },
        active: {
          equals: true,
        },
      },
      limit: 3,
      depth: 2, // Include cycle data
    });
    featuredCourses = coursesData.docs || [];
  } catch (error) {
    console.error('Error fetching featured courses:', error);
  }

  return (
    <div className="home-page">
      {/* Hero Section - Fluid Responsive */}
      <section className="hero bg-gradient-to-r from-primary to-primary-light text-white" style={{ padding: 'clamp(2.5rem, 8vw, 6rem) 0' }}>
        <div className="container">
          <div className="max-w-3xl xl:max-w-4xl mx-auto text-center">
            <h1 className="text-fluid-hero title-hero font-bold mb-4 md:mb-6">
              Formación Profesional de Calidad
            </h1>
            <p className="text-fluid-hero-sub mb-6 md:mb-8 opacity-90">
              Cursos presenciales, online y semipresenciales. Ciclos formativos y formación
              para el empleo con ayudas disponibles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/cursos" className="btn-primary bg-white text-primary hover:bg-neutral-100 text-center text-sm md:text-base">
                Ver Cursos
              </Link>
              <Link href="/contacto" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-center text-sm md:text-base">
                Solicitar Información
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section - Fluid Responsive */}
      <section className="bg-neutral-50" style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div className="mb-6 md:mb-8">
            <h2 className="text-fluid-section-title section-title-uppercase font-bold mb-2">Cursos Destacados</h2>
            <p className="text-fluid-body text-neutral-600 text-left">
              Descubre nuestros cursos más populares y con mayor demanda
            </p>
          </div>

          {featuredCourses.length > 0 ? (
            <>
              <div className="grid-fluid-cards">
                {featuredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* View All Courses Link */}
              <div className="text-center mt-8">
                <Link
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
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">
                No hay cursos destacados disponibles en este momento.
              </p>
              <Link href="/cursos" className="mt-4 inline-block text-primary hover:underline">
                Ver todos los cursos disponibles
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Fluid Responsive */}
      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div className="grid-fluid-features">
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
              <h3 className="card-title-uppercase font-semibold mb-2" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}>Formación de Calidad</h3>
              <p className="text-fluid-body text-neutral-600 text-center">
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
              <h3 className="card-title-uppercase font-semibold mb-2" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}>Ayudas Disponibles</h3>
              <p className="text-fluid-body text-neutral-600 text-center">
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
              <h3 className="card-title-uppercase font-semibold mb-2" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}>Flexibilidad</h3>
              <p className="text-fluid-body text-neutral-600 text-center">
                Modalidades presencial, online y semipresencial para adaptarnos a ti
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Fluid Responsive */}
      <section className="bg-secondary text-white" style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container text-center">
          <h2 className="text-fluid-section-title font-bold mb-4 md:mb-6">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-fluid-hero-sub mb-6 md:mb-8 opacity-90 max-w-2xl xl:max-w-3xl mx-auto px-4">
            Contacta con nosotros y te ayudaremos a encontrar el curso perfecto para
            impulsar tu carrera profesional
          </p>
          <Link href="/contacto" className="btn-primary bg-white text-secondary hover:bg-neutral-100 inline-block">
            Solicitar Información
          </Link>
        </div>
      </section>
    </div>
  );
}
