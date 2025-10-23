/**
 * Course Detail Page Component
 *
 * Displays detailed information about a single course
 */

import { useParams } from 'react-router-dom';
import { useCourse } from '@hooks/useCourses';
import { Alert } from '@components/ui';
import { CourseDetailSkeleton } from './skeletons';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const courseState = useCourse(slug || '');

  // Loading state
  if (courseState.status === 'loading') {
    return <CourseDetailSkeleton />;
  }

  // Error state
  if (courseState.status === 'error') {
    return (
      <div className="container py-12">
        <Alert variant="error" title="Error al Cargar el Curso">
          {courseState.error}
        </Alert>
        <div className="mt-6 text-center">
          <a href="/cursos" className="text-primary hover:underline font-semibold">
            ← Volver a cursos
          </a>
        </div>
      </div>
    );
  }

  // No course found
  if (!courseState.data) {
    return (
      <div className="container py-12 text-center">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-16 w-16 text-neutral-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Curso no encontrado</h1>
          <p className="text-neutral-600 mb-6">
            El curso que buscas no existe o ha sido eliminado.
          </p>
          <a href="/cursos" className="btn-primary">
            Ver todos los cursos
          </a>
        </div>
      </div>
    );
  }

  const course = courseState.data;

  // Get cycle name
  const cycleName =
    typeof course.cycle !== 'string' && course.cycle?.name
      ? course.cycle.name
      : 'Sin ciclo';

  // Get campuses
  const campusNames =
    course.campuses && Array.isArray(course.campuses)
      ? course.campuses
          .map((campus) =>
            typeof campus !== 'string' && campus?.name ? `${campus.name} - ${campus.city}` : ''
          )
          .filter(Boolean)
      : [];

  // Modality labels
  const modalityLabels = {
    presencial: 'Presencial',
    online: 'Online',
    hibrido: 'Semipresencial',
  };

  return (
    <div className="course-detail-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white py-16">
        <div className="container">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm opacity-90">
              <a href="/" className="hover:underline">
                Inicio
              </a>
              <span className="mx-2">/</span>
              <a href="/cursos" className="hover:underline">
                Cursos
              </a>
              <span className="mx-2">/</span>
              <span>{course.title}</span>
            </nav>

            {/* Badge */}
            <div className="mb-4">
              <span className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded">
                {cycleName}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

            {/* Short Description */}
            {course.short_description && (
              <p className="text-xl opacity-90 mb-6">{course.short_description}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {modalityLabels[course.modality]}
              </div>
              {course.duration_hours && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {course.duration_hours} horas
                </div>
              )}
              {course.financial_aid_available && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ayudas disponibles
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Description */}
              {course.description && (
                <div className="card mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Descripción del Curso</h2>
                  <div className="prose max-w-none text-neutral-700">
                    <p>{course.description}</p>
                  </div>
                </div>
              )}

              {/* Campuses */}
              {campusNames.length > 0 && (
                <div className="card mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Sedes Disponibles</h2>
                  <ul className="space-y-2">
                    {campusNames.map((name, index) => (
                      <li key={index} className="flex items-center text-neutral-700">
                        <svg
                          className="w-5 h-5 mr-2 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* CTA Card */}
              <div className="card sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Solicita Información</h3>

                {/* Price */}
                {course.price && (
                  <div className="mb-4 pb-4 border-b border-neutral-200">
                    <div className="text-3xl font-bold text-primary">{course.price}€</div>
                    <div className="text-sm text-neutral-600">Precio del curso</div>
                  </div>
                )}

                {/* CTA Button */}
                <a href="/contacto" className="btn-primary w-full mb-3">
                  Solicitar Información
                </a>

                <p className="text-xs text-neutral-500 text-center">
                  Te responderemos en menos de 24 horas
                </p>

                {/* Course Features */}
                <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
                  <div className="flex items-start text-sm">
                    <svg
                      className="w-5 h-5 mr-2 text-secondary flex-shrink-0 mt-0.5"
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
                    <span className="text-neutral-700">Certificado oficial al finalizar</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <svg
                      className="w-5 h-5 mr-2 text-secondary flex-shrink-0 mt-0.5"
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
                    <span className="text-neutral-700">Docentes expertos del sector</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <svg
                      className="w-5 h-5 mr-2 text-secondary flex-shrink-0 mt-0.5"
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
                    <span className="text-neutral-700">Contenido actualizado</span>
                  </div>
                  {course.financial_aid_available && (
                    <div className="flex items-start text-sm">
                      <svg
                        className="w-5 h-5 mr-2 text-secondary flex-shrink-0 mt-0.5"
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
                      <span className="text-neutral-700">Acceso a becas y ayudas</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
