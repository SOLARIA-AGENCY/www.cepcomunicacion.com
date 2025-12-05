'use client'

import { useState } from 'react'

export default function AccesoAlumnosPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Campus Virtual</h1>
          <p className="text-lg text-gray-600">
            Accede a tu área de alumno para consultar cursos, materiales y calificaciones
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Acceso de Alumnos</h2>
              <p className="text-sm text-gray-600">
                Ingresa con tus credenciales de estudiante
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Correo Electrónico o DNI
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="alumno@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#F2014B] focus:ring-[#F2014B]" />
                  <span className="text-gray-600">Recordar sesión</span>
                </label>
                <a href="#" className="text-[#F2014B] hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button className="w-full bg-[#F2014B] hover:bg-[#d01040] text-white font-semibold py-3 rounded-lg transition-colors">
                Acceder al Campus
              </button>

              <div className="text-center text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <a href="/contacto" className="text-[#F2014B] hover:underline font-semibold">
                  Solicita información
                </a>
              </div>
            </div>
          </div>

          {/* Features del Campus */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Qué encontrarás en el Campus?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Materiales del Curso</h4>
                    <p className="text-sm text-gray-600">
                      Accede a todos los recursos, apuntes y contenidos multimedia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Calendario de Clases</h4>
                    <p className="text-sm text-gray-600">
                      Consulta horarios, fechas de exámenes y eventos importantes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Tareas y Entregas</h4>
                    <p className="text-sm text-gray-600">
                      Envía trabajos, consulta feedback y descarga ejercicios
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Calificaciones</h4>
                    <p className="text-sm text-gray-600">
                      Revisa tus notas, progreso y certificaciones obtenidas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-[#F2014B]/5 border-2 border-[#F2014B]/20 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#F2014B]/10 rounded-lg flex-shrink-0">
                  <svg className="h-5 w-5 text-[#F2014B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">¿Necesitas ayuda?</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Si tienes problemas para acceder, contacta con soporte técnico:
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    📧 soporte@cepcomunicacion.com<br />
                    📞 +34 922 XXX XXX
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Vista preliminar del Campus Virtual • Los datos mostrados son de ejemplo</p>
        </div>
      </div>
    </div>
  )
}
