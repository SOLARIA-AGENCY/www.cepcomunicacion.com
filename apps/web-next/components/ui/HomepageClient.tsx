'use client';

import { useState, useEffect } from 'react';
import { CourseCard } from '@/components/ui/CourseCard';
import type { Course } from '@/lib/types';

// Mock featured courses data - replace with API call
const mockFeaturedCourses: Course[] = [
  {
    id: '1',
    name: 'Auxiliar de Enfermería',
    slug: 'auxiliar-enfermeria',
    course_type: 'desempleados',
    area: 'sanitaria',
    modality: 'presencial',
    duration_hours: 600,
    short_description:
      'Formación completa para trabajar como auxiliar de enfermería en centros sanitarios.',
    image:
      'https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=800',
    courseRuns: [
      {
        id: '1',
        startDate: '2025-01-15',
        location: 'CEP Santa Cruz',
        published: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Marketing Digital y Redes Sociales',
    slug: 'marketing-digital-redes-sociales',
    course_type: 'privado',
    area: 'marketing',
    modality: 'online',
    duration_hours: 120,
    short_description:
      'Aprende a crear estrategias de marketing digital y gestionar redes sociales profesionales.',
    image:
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    courseRuns: [
      {
        id: '2',
        startDate: '2025-02-01',
        location: 'Online',
        published: true,
      },
    ],
  },
  {
    id: '3',
    name: 'Desarrollo Web Full Stack',
    slug: 'desarrollo-web-full-stack',
    course_type: 'ocupados',
    area: 'tecnologia',
    modality: 'hibrido',
    duration_hours: 450,
    short_description:
      'Conviértete en desarrollador web aprendiendo las tecnologías más demandadas del mercado.',
    image:
      'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
    courseRuns: [
      {
        id: '3',
        startDate: '2025-01-20',
        location: 'CEP Norte',
        published: true,
      },
    ],
  },
];

interface HomepageClientProps {
  heroCarousel: React.ReactNode;
}

export function HomepageClient({ heroCarousel }: HomepageClientProps) {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API call
    const loadCourses = async () => {
      try {
        // const response = await fetch('/api/courses/featured');
        // const data = await response.json();
        // setFeaturedCourses(data);

        // Mock data for now
        setTimeout(() => {
          setFeaturedCourses(mockFeaturedCourses);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading featured courses:', error);
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - passed as prop */}
      {heroCarousel}

      {/* Featured Courses Section */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
              Cursos Destacados
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Descubre nuestros cursos más demandados y comienza tu formación hoy mismo
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="h-48 bg-neutral-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : featuredCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              <div className="text-center">
                <a
                  href="/cursos"
                  className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:text-primary-dark transition-colors"
                >
                  Ver todos los cursos
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-600 mb-4">No hay cursos destacados disponibles</p>
              <a href="/cursos" className="btn-primary">
                Ver todos los cursos
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
              ¿Por qué elegir CEP Formación?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Te ofrecemos las mejores herramientas para tu éxito profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cep-rosa text-white rounded-full mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-neutral-900">Formación de Calidad</h3>
              <p className="text-neutral-600 leading-relaxed">
                Contenido actualizado y profesores expertos con años de experiencia en el sector.
                Aprende las habilidades que realmente demandan las empresas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cep-ocupados text-white rounded-full mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-neutral-900">Ayudas Disponibles</h3>
              <p className="text-neutral-600 leading-relaxed">
                Accede a subvenciones y becas para financiar tu formación. Te ayudamos a encontrar
                la mejor opción económica para ti.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cep-desempleados text-white rounded-full mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-neutral-900">Flexibilidad</h3>
              <p className="text-neutral-600 leading-relaxed">
                Elige entre modalidad presencial, online o semipresencial. Adapta tu formación a tu
                ritmo de vida y profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="text-xl mb-8 text-neutral-100 leading-relaxed">
              Contacta con nosotros y recibe asesoramiento personalizado sobre el curso que mejor se
              adapta a tus necesidades y objetivos profesionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contacto"
                className="btn-white px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2"
              >
                Solicitar Información
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
              <a
                href="/sedes"
                className="btn-outline-white px-8 py-4 text-lg font-bold inline-flex items-center justify-center gap-2"
              >
                Visitar Nuestras Sedes
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
