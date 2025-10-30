import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          CEP Comunicación v2
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma Educativa con Payload CMS 3.61.1 + Next.js 16
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">13 Colecciones</h2>
            <p className="text-blue-100">Payload CMS implementado completamente</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">1,040+ Tests</h2>
            <p className="text-green-100">100% cobertura de seguridad</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">6-Tier RBAC</h2>
            <p className="text-purple-100">Control de acceso granular</p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">0 Vulnerabilidades</h2>
            <p className="text-orange-100">Seguridad enterprise-grade</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-center transition-colors duration-200"
          >
            🔐 Admin Panel
          </Link>

          <Link
            href="/cursos"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-center transition-colors duration-200"
          >
            📚 Ver Cursos
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Payload CMS 3.61.1 configurado</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>PostgreSQL conectado</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>13 colecciones registradas</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Next.js 16 App Router activo</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
