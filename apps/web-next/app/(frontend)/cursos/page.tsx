/**
 * Courses Page
 *
 * Professional catalog page with filtering capability
 * Server Component with data fetching from Payload CMS via REST API
 */

import Link from 'next/link';
import { payloadClient } from '@/lib/payloadClient';
import { CoursesList } from '@/components/ui';
import type { Course } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function CursosPage() {
  // Fetch courses with relationships via REST API
  let courses: Course[] = [];
  try {
    const coursesResult = await payloadClient.find<Course>('courses', {
      where: {
        active: {
          equals: true,
        },
      },
      limit: 50,
      sort: '-createdAt',
      depth: 2, // Include cycle and other relationships
    });
    courses = coursesResult.docs || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
  }

  return (
    <div className="courses-page bg-neutral-50">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-primary to-primary-light text-white"
        style={{ padding: 'clamp(2rem, 6vw, 4rem) 0' }}
      >
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-fluid-section-title font-bold uppercase mb-4">
              Catálogo de Cursos
            </h1>
            <p className="text-fluid-body opacity-90 mb-4">
              Descubre nuestra amplia oferta formativa. Tenemos {courses.length} cursos disponibles
              para impulsar tu carrera profesional.
            </p>
          </div>
        </div>
      </section>

      {/* Courses with Filters */}
      {courses.length === 0 ? (
        <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
          <div className="container">
            <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                No hay cursos disponibles
              </h2>
              <p className="text-neutral-600 mb-6">
                Los cursos aparecerán aquí una vez sean publicados desde el panel de administración.
              </p>
              <Link href="/" className="btn-primary inline-block">
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <CoursesList courses={courses} />
      )}

      {/* CTA Section */}
      <section
        className="bg-white border-t border-neutral-200"
        style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}
      >
        <div className="container">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Contacta con nuestro equipo y te ayudaremos a encontrar el curso perfecto para tus
              necesidades
            </p>
            <Link href="/contacto" className="btn-primary inline-block">
              Solicitar Información
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
