// src/types/sedes.ts
// Tipos completos para el sistema de gestión de sedes

export interface Sede {
  id: string
  codigo: string // "NORTE", "SANTA-CRUZ", "SUR"
  nombre: string
  descripcion: string
  activa: boolean

  // Ubicación
  direccion: string
  ciudad: string
  provincia: string
  codigoPostal: string
  latitud: number
  longitud: number

  // Contacto
  telefono: string
  email: string
  sitioWeb?: string
  horarioAtencion: string

  // Responsable
  responsable: {
    id: string
    nombre: string
    cargo: string
    email: string
    telefono: string
    avatar?: string
  }

  // Instalaciones
  instalaciones: Array<{
    id: string
    nombre: string
    categoria: string
  }>

  // Imágenes
  imagenPrincipal: string
  galeria?: string[]

  // Estadísticas (calculadas)
  cantidadAulas: number
  cantidadPersonal: number
  cantidadAlumnos: number
  cantidadCursosActivos: number
}

export interface Aula {
  id: string
  nombre: string
  codigo: string
  capacidad: number
  disponible: boolean
  metrosCuadrados: number
  planta: string
  equipamiento: string[]
  cursoActual?: {
    nombre: string
    horario: string
  } | null
}

export interface PersonalSede {
  id: string
  nombre: string
  rol: 'profesor' | 'administrativo' | 'coordinador' | 'mantenimiento'
  email: string
  telefono: string
  avatar?: string
  especialidad?: string
  horario: string
  cursosAsignados?: number
  activo: boolean
}

export interface AlumnoSede {
  id: string
  nombre: string
  email: string
  telefono: string
  avatar?: string
  cursoActual?: {
    id: string
    nombre: string
  }
  fechaMatricula: Date
  estadoPago: 'pagado' | 'pendiente' | 'parcial'
  porcentajeAsistencia: number
  estado: 'activo' | 'graduado' | 'baja'
}

export interface InstanciaVistaCompleta {
  id: string
  plantillaId: string
  codigoCompleto: string
  nombreCurso: string
  modalidad: string
  tipo: string
  fechaInicio: Date
  fechaFin: Date
  estado: string
  plazasTotales: number
  plazasOcupadas: number
  porcentajeOcupacion: number
  precio: number
  horario: string
  aulaNombre: string
  aulaId: string
  sedeNombre: string
  sedeId: string
  profesorNombre?: string
  profesorId?: string
}

export interface EstadisticasSede {
  // KPIs principales
  tasaOcupacion: number
  satisfaccion: number
  tasaFinalizacion: number
  ingresosMensuales: number

  // Alumnos
  total: number
  activos: number
  nuevosMes: number
  graduados: number

  // Cursos
  cursosActivos: number
  proximasConvocatorias: number
  alumnosTotales: number
  ocupacionMedia: number

  // Gráficos (opcional para mockup)
  evolucionAlumnos?: Array<{ mes: string; alumnos: number }>
  distribucionCursos?: Array<{ curso: string; cantidad: number }>
  ocupacionAulas?: Array<{ aula: string; porcentaje: number }>
}

export interface SedeDetalle extends Sede {
  aulas: Aula[]
  personal: PersonalSede[]
  alumnos: AlumnoSede[]
  instanciasCursos: InstanciaVistaCompleta[]
  estadisticas: EstadisticasSede
}
