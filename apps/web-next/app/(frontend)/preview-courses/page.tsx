/**
 * Preview Courses Page
 *
 * Temporary page to preview CourseCard design with mock data
 * DELETE THIS FILE after verifying the design
 */

import { CourseCard } from '@/components/ui';
import type { Course } from '@/lib/types';

export const metadata = {
  title: 'Preview Cursos - CEP Formación',
  description: 'Vista previa del diseño de tarjetas de cursos',
};

// Mock data para visualizar el diseño del CourseCard
const mockCourses: Course[] = [
  {
    id: 1,
    slug: 'marketing-digital-redes-sociales',
    name: 'Marketing Digital y Redes Sociales',
    short_description: 'Aprende a crear estrategias de marketing digital efectivas en redes sociales. Contenidos actualizados con las últimas tendencias del sector.',
    modality: 'online',
    course_type: 'ocupados',
    duration_hours: 150,
    base_price: 0,
    financial_aid_available: false,
    active: true,
    featured: true,
    cycle: {
      id: 1,
      slug: 'fp-marketing',
      name: 'Marketing y Publicidad',
      code: 'MKT-001',
      level: 'grado_superior',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    course_runs: [
      {
        id: 1,
        slug: 'mkt-digital-ene-2025',
        course: 1,
        start_date: '2025-02-15',
        end_date: '2025-06-30',
        enrollment_deadline: '2025-02-10',
        max_students: 25,
        current_enrollment: 12,
        price: 0,
        subsidized: true,
        status: 'enrollment_open',
        campus: {
          id: 1,
          slug: 'madrid-centro',
          name: 'Madrid Centro',
          city: 'Madrid',
          active: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    slug: 'diseno-grafico-photoshop',
    name: 'Diseño Gráfico con Adobe Photoshop',
    short_description: 'Domina las herramientas profesionales de diseño gráfico. Desde lo básico hasta técnicas avanzadas de edición y composición.',
    modality: 'presencial',
    course_type: 'privado',
    duration_hours: 120,
    base_price: 599,
    financial_aid_available: true,
    active: true,
    featured: false,
    cycle: {
      id: 2,
      slug: 'fp-diseno',
      name: 'Diseño Gráfico',
      code: 'DIS-001',
      level: 'grado_medio',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    course_runs: [
      {
        id: 2,
        slug: 'photoshop-mar-2025',
        course: 2,
        start_date: '2025-03-01',
        end_date: '2025-05-31',
        enrollment_deadline: '2025-02-25',
        max_students: 15,
        current_enrollment: 8,
        price: 549,
        subsidized: false,
        status: 'enrollment_open',
        campus: {
          id: 2,
          slug: 'barcelona-eixample',
          name: 'Barcelona Eixample',
          city: 'Barcelona',
          active: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    slug: 'desarrollo-web-full-stack',
    name: 'Desarrollo Web Full Stack',
    short_description: 'Conviértete en desarrollador web completo. HTML, CSS, JavaScript, React, Node.js y bases de datos. Proyecto final incluido.',
    modality: 'hibrido',
    course_type: 'teleformacion',
    duration_hours: 300,
    base_price: 1200,
    financial_aid_available: true,
    active: true,
    featured: true,
    cycle: {
      id: 3,
      slug: 'fp-desarrollo-web',
      name: 'Desarrollo de Aplicaciones Web',
      code: 'DAW-001',
      level: 'grado_superior',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    course_runs: [
      {
        id: 3,
        slug: 'fullstack-abr-2025',
        course: 3,
        start_date: '2025-04-01',
        end_date: '2025-09-30',
        enrollment_deadline: '2025-03-25',
        max_students: 20,
        current_enrollment: 15,
        price: 1050,
        subsidized: false,
        status: 'enrollment_open',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    slug: 'administracion-empresas',
    name: 'Administración y Gestión de Empresas',
    short_description: 'Formación completa en gestión empresarial. Contabilidad, recursos humanos, planificación estratégica y operaciones.',
    modality: 'presencial',
    course_type: 'desempleados',
    duration_hours: 200,
    base_price: 0,
    financial_aid_available: false,
    active: true,
    featured: false,
    cycle: {
      id: 4,
      slug: 'fp-administracion',
      name: 'Administración y Gestión',
      code: 'ADM-001',
      level: 'grado_superior',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    course_runs: [
      {
        id: 4,
        slug: 'admin-may-2025',
        course: 4,
        start_date: '2025-05-15',
        end_date: '2025-10-15',
        enrollment_deadline: '2025-05-10',
        max_students: 30,
        current_enrollment: 5,
        price: 0,
        subsidized: true,
        status: 'published',
        campus: {
          id: 3,
          slug: 'valencia-centro',
          name: 'Valencia Centro',
          city: 'Valencia',
          active: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    slug: 'ciclo-medio-sistemas',
    name: 'Sistemas Microinformáticos y Redes',
    short_description: 'Ciclo formativo de grado medio oficial. Instala, configura y mantiene sistemas informáticos en red.',
    modality: 'presencial',
    course_type: 'ciclo_medio',
    duration_hours: 2000,
    base_price: 3500,
    financial_aid_available: true,
    active: true,
    featured: true,
    cycle: {
      id: 5,
      slug: 'fp-sistemas',
      name: 'Sistemas Microinformáticos',
      code: 'SMR-001',
      level: 'grado_medio',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    course_runs: [
      {
        id: 5,
        slug: 'smr-sep-2025',
        course: 5,
        start_date: '2025-09-15',
        end_date: '2027-06-30',
        enrollment_deadline: '2025-07-31',
        max_students: 25,
        current_enrollment: 18,
        price: 3200,
        subsidized: false,
        status: 'published',
        campus: {
          id: 1,
          slug: 'madrid-centro',
          name: 'Madrid Centro',
          city: 'Madrid',
          active: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 6,
    slug: 'ciclo-superior-dam',
    name: 'Desarrollo de Aplicaciones Multiplataforma',
    short_description: 'Ciclo formativo de grado superior oficial. Desarrolla aplicaciones para móviles, escritorio y web con las últimas tecnologías.',
    modality: 'hibrido',
    course_type: 'ciclo_superior',
    duration_hours: 2000,
    base_price: 4200,
    financial_aid_available: true,
    active: true,
    featured: true,
    cycle: {
      id: 6,
      slug: 'fp-dam',
      name: 'Desarrollo de Aplicaciones Multiplataforma',
      code: 'DAM-001',
      level: 'grado_superior',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    course_runs: [
      {
        id: 6,
        slug: 'dam-sep-2025',
        course: 6,
        start_date: '2025-09-15',
        end_date: '2027-06-30',
        enrollment_deadline: '2025-07-31',
        max_students: 30,
        current_enrollment: 22,
        price: 3800,
        subsidized: false,
        status: 'enrollment_open',
        campus: {
          id: 2,
          slug: 'barcelona-eixample',
          name: 'Barcelona Eixample',
          city: 'Barcelona',
          active: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export default function PreviewCoursesPage() {
  return (
    <div className="preview-courses-page bg-neutral-50">
      {/* Preview Banner */}
      <div className="bg-yellow-500 text-white py-3">
        <div className="container text-center">
          <p className="font-semibold">
            🎨 VISTA PREVIA - Datos de ejemplo para verificar diseño del CourseCard
          </p>
          <p className="text-sm opacity-90">
            Eliminar este archivo después de verificar: apps/web-next/app/(frontend)/preview-courses/page.tsx
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white" style={{ padding: 'clamp(2rem, 6vw, 4rem) 0' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-fluid-section-title font-bold uppercase mb-4">Vista Previa - Catálogo de Cursos</h1>
            <p className="text-fluid-body opacity-90 mb-4">
              Mostrando {mockCourses.length} cursos de ejemplo con el diseño mejorado del CourseCard
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid Section */}
      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          {/* Course Count */}
          <div className="mb-6">
            <p className="text-neutral-600">
              Mostrando <span className="font-semibold text-neutral-900">{mockCourses.length}</span> cursos de ejemplo
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid-fluid-cards">
            {mockCourses.map((course) => (
              <div
                key={course.id}
                className={
                  course.course_type === 'ciclo_medio' || course.course_type === 'ciclo_superior'
                    ? 'cycle-card-wide'
                    : ''
                }
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features to Verify */}
      <section className="bg-white border-t border-neutral-200" style={{ padding: 'clamp(2rem, 4vw, 3rem) 0' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 text-center">
              ✨ Características del Nuevo Diseño
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">🏷️ Badges de Tipo</h3>
                <p className="text-sm text-neutral-600">
                  Colores distintos por categoría: PRIVADO (rojo), OCUPADOS (azul), DESEMPLEADOS (verde),
                  TELEFORMACIÓN (morado), CICLO MEDIO (naranja), CICLO SUPERIOR (índigo)
                </p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">📸 Imágenes Inteligentes</h3>
                <p className="text-sm text-neutral-600">
                  Imágenes de Pexels seleccionadas según el nombre del curso (marketing, diseño, programación, negocios)
                </p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">📊 Panel de Información</h3>
                <p className="text-sm text-neutral-600">
                  Ubicación/Campus, fecha de inicio, y precio/subvención con iconos visuales
                </p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">🎯 CTA Mejorado</h3>
                <p className="text-sm text-neutral-600">
                  Botón "VER CURSO" con hover effect y flecha, más visible y llamativo
                </p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">💰 Info Financiera</h3>
                <p className="text-sm text-neutral-600">
                  Badge "Ayudas disponibles" para cursos con ayuda financiera
                </p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">⚡ Optimización React</h3>
                <p className="text-sm text-neutral-600">
                  React.memo, useMemo, useCallback para mejor rendimiento
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
