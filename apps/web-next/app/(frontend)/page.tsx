'use client'

import { HeroCarouselSimple } from '@/components/ui/HeroCarouselSimple'
import { CourseCard } from '@/components/ui/CourseCard'
import { getRandomCourses } from '@/lib/mockCourses'

export default function HomePage() {
  const courses = getRandomCourses(6)

  return (
    <div className="home-page">
      {/* Hero Section - Solo imágenes limpias */}
      <HeroCarouselSimple />

      {/* Sección de texto Hero - Separada */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Formación Profesional de Calidad
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Impulsa tu carrera con nuestros cursos especializados y obtén la certificación que necesitas
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/cursos"
              className="inline-flex items-center px-6 py-3 bg-[#F2014B] text-white font-semibold rounded-lg hover:bg-[#d01040] transition-colors"
            >
              Ver todos los cursos
            </a>
            <a
              href="/contacto"
              className="inline-flex items-center px-6 py-3 border-2 border-[#F2014B] text-[#F2014B] font-semibold rounded-lg hover:bg-[#F2014B] hover:text-white transition-colors"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      {/* Cursos Destacados */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Cursos Destacados
            </h2>
            <p className="text-lg text-gray-600">
              Descubre nuestros cursos más populares con imágenes y contenido actualizado
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              className="inline-flex items-center text-[#F2014B] font-semibold text-lg hover:underline"
              href="/cursos"
            >
              Ver todos los cursos
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F2014B]/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-[#F2014B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Formación de Calidad</h3>
              <p className="text-gray-600">
                Cursos homologados con docentes expertos y contenidos actualizados
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ayudas Disponibles</h3>
              <p className="text-gray-600">
                Acceso a becas y financiación para facilitar tu formación profesional
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Prácticas Garantizadas</h3>
              <p className="text-gray-600">
                Convenios con empresas para asegurar tu experiencia profesional
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
