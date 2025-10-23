/**
 * Courses Page Component
 *
 * Displays list of courses with filtering options
 */

export default function CoursesPage() {
  return (
    <div className="courses-page py-12">
      <div className="container">
        <h1 className="text-4xl font-bold mb-8">Nuestros Cursos</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Ciclo Formativo</label>
              <select className="form-input">
                <option>Todos los ciclos</option>
                <option>FP Básica</option>
                <option>Grado Medio</option>
                <option>Grado Superior</option>
              </select>
            </div>
            <div>
              <label className="form-label">Modalidad</label>
              <select className="form-input">
                <option>Todas las modalidades</option>
                <option>Presencial</option>
                <option>Online</option>
                <option>Semipresencial</option>
              </select>
            </div>
            <div>
              <label className="form-label">Campus</label>
              <select className="form-input">
                <option>Todos los campus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card">
              <div className="h-48 bg-neutral-200 rounded-lg mb-4"></div>
              <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">
                Grado Superior
              </span>
              <h3 className="text-xl font-semibold mb-2">Nombre del Curso {i}</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Descripción breve del curso y sus objetivos principales.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-semibold">Presencial</span>
                <a href={`/cursos/${i}`} className="text-primary hover:underline">
                  Ver más →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
