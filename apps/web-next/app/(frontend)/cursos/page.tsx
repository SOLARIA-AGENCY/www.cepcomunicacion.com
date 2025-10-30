import Link from 'next/link'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

export default async function CursosPage() {
  const payload = await getPayloadHMR({ config })

  // Fetch courses with relationships
  const coursesResult = await payload.find({
    collection: 'courses',
    where: {
      active: {
        equals: true,
      },
    },
    limit: 50,
    sort: '-createdAt',
  })

  const courses = coursesResult.docs

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-block mb-4 text-blue-100 hover:text-white transition-colors"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-5xl font-bold mb-4">Catálogo de Cursos</h1>
          <p className="text-xl text-blue-100">
            {courses.length} cursos disponibles
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No hay cursos todavía
            </h2>
            <p className="text-gray-600 mb-6">
              Crea cursos desde el panel de administración
            </p>
            <Link
              href="/admin"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Ir al Admin Panel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Course Type Badge */}
                  <div className="mb-3">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {course.course_type?.replace('_', ' ').toUpperCase() || 'CURSO'}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.name}
                  </h3>

                  {/* Course Description */}
                  {course.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>
                  )}

                  {/* Course Details */}
                  <div className="space-y-2 mb-4">
                    {course.duration_hours && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-indigo-500">⏱</span>
                        <span>{course.duration_hours} horas</span>
                      </div>
                    )}

                    {course.modality && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-green-500">📍</span>
                        <span className="capitalize">{course.modality}</span>
                      </div>
                    )}

                    {course.price !== null && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-yellow-500">💰</span>
                        <span>
                          {course.price === 0 ? 'Gratuito' : `${course.price}€`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cycle Reference */}
                  {course.cycle && typeof course.cycle === 'object' && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Ciclo formativo:</div>
                      <div className="text-sm font-medium text-gray-900">
                        {course.cycle.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    Ver más información
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">
            ¿Necesitas crear o editar cursos?
          </p>
          <Link
            href="/admin"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Acceder al Panel de Administración
          </Link>
        </div>
      </div>
    </div>
  )
}
