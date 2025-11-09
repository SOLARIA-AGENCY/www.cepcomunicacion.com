/**
 * Course Detail Page
 *
 * Dynamic page showing full course information
 * Server Component with data fetching from Payload CMS
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { payloadClient } from '@/lib/payloadClient';
import type { Course } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Modality labels
const MODALITY_LABELS = {
  presencial: 'Presencial',
  online: 'Online',
  hibrido: 'Semipresencial',
} as const;

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch course by slug
  const coursesResult = await payloadClient.find<Course>('courses', {
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 3, // Include cycle, campuses, and other relationships
  });

  const course = coursesResult.docs[0];

  if (!course) {
    notFound();
  }

  // Get cycle information (type guard for number | Cycle union)
  const cycleName = course.cycle && typeof course.cycle === 'object' && 'name' in course.cycle ? course.cycle.name : null;

  // Get campus information
  const campuses = course.campuses && Array.isArray(course.campuses)
    ? course.campuses.filter(c => typeof c !== 'string')
    : [];

  return (
    <div className="course-detail-page bg-neutral-50">
      {/* Breadcrumb */}
      <section className="bg-white border-b border-neutral-200 py-4">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/cursos" className="hover:text-primary transition-colors">Cursos</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{course.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white" style={{ padding: 'clamp(2rem, 6vw, 4rem) 0' }}>
        <div className="container">
          <div className="max-w-4xl">
            {/* Cycle Badge */}
            {cycleName && (
              <div className="mb-4">
                <span className="inline-block bg-white/20 backdrop-blur text-white text-sm px-3 py-1 rounded-full">
                  {cycleName}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-fluid-section-title title-uppercase font-bold mb-4">{course.name}</h1>

            {/* Description */}
            {course.short_description && (
              <p className="text-fluid-body opacity-90 mb-6">
                {course.short_description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 text-sm">
              {/* Modality */}
              {course.modality && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{MODALITY_LABELS[course.modality]}</span>
                </div>
              )}

              {/* Duration */}
              {course.duration_hours && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.duration_hours} horas</span>
                </div>
              )}

              {/* Financial Aid */}
              {course.financial_aid_available && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ayudas disponibles</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {course.short_description && (
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                  <h2 className="text-2xl section-title-uppercase font-bold text-neutral-900 mb-4">Descripción del curso</h2>
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-700 leading-relaxed">{course.short_description}</p>
                  </div>
                </div>
              )}

              {/* Campuses */}
              {campuses.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                  <h2 className="text-2xl section-title-uppercase font-bold text-neutral-900 mb-4">Sedes disponibles</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {campuses.map((campus: any) => (
                      <div key={campus.id} className="border border-neutral-200 rounded-lg p-4">
                        <h3 className="font-semibold text-neutral-900 mb-2">{campus.name}</h3>
                        {campus.city && (
                          <p className="text-sm text-neutral-600">{campus.city}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="text-xl card-title-uppercase font-bold text-neutral-900 mb-4">Información del curso</h3>

                <div className="space-y-4 mb-6">
                  {/* Duration */}
                  {course.duration_hours && (
                    <div className="flex justify-between py-3 border-b border-neutral-200">
                      <span className="text-neutral-600">Duración:</span>
                      <span className="font-semibold text-neutral-900">{course.duration_hours}h</span>
                    </div>
                  )}

                  {/* Modality */}
                  {course.modality && (
                    <div className="flex justify-between py-3 border-b border-neutral-200">
                      <span className="text-neutral-600">Modalidad:</span>
                      <span className="font-semibold text-neutral-900">{MODALITY_LABELS[course.modality]}</span>
                    </div>
                  )}

                  {/* Price */}
                  {course.base_price !== null && course.base_price !== undefined && (
                    <div className="flex justify-between py-3 border-b border-neutral-200">
                      <span className="text-neutral-600">Precio:</span>
                      <span className="font-semibold text-neutral-900">
                        {course.base_price === 0 ? 'Gratuito' : `${course.base_price}€`}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link href="/contacto" className="btn-primary w-full text-center block">
                  Solicitar Información
                </Link>

                {/* Financial Aid Notice */}
                {course.financial_aid_available && (
                  <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-secondary mb-1">Ayudas disponibles</p>
                        <p className="text-xs text-neutral-600">Este curso cuenta con opciones de financiación</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses CTA */}
      <section className="bg-white border-t border-neutral-200" style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
        <div className="container text-center">
          <h2 className="text-2xl section-title-uppercase font-bold text-neutral-900 mb-3">¿Quieres ver más cursos?</h2>
          <p className="text-neutral-600 mb-6">Descubre toda nuestra oferta formativa</p>
          <Link href="/cursos" className="btn-secondary inline-block">
            Ver todos los cursos
          </Link>
        </div>
      </section>
    </div>
  );
}
