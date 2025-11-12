/**
 * NUEVA ARQUITECTURA: PLANTILLAS + INSTANCIAS DE CURSOS
 *
 * Patrón: Course Template + Course Instance (usado por Udemy, Coursera, EdX)
 *
 * Objetivo: Separar la información REUTILIZABLE (plantilla) de las
 * convocatorias ESPECÍFICAS (instancias) para gestionar múltiples sedes/fechas
 */

// ============================================================================
// TIPOS BASE
// ============================================================================

export type CourseType =
  | "privados"
  | "ocupados"
  | "desempleados"
  | "teleformacion"
  | "ciclo-medio"
  | "ciclo-superior"

export type CourseModality = "presencial" | "semipresencial" | "telematico"

export type SubvencionType = "no" | "parcial" | "total"

export type InstanciaEstado =
  | "planificada"
  | "abierta"
  | "en_curso"
  | "finalizada"
  | "cancelada"

// ============================================================================
// ENTIDAD FINANCIADORA
// ============================================================================

export interface EntidadFinanciadora {
  id: string
  nombre: string
  codigo:
    | "ministerio"
    | "sepe"
    | "fundae"
    | "gobierno-canarias"
    | "ue-fse"
    | "otra"
  logo: string
  descripcion?: string
}

// ============================================================================
// PLANTILLA DE CURSO (Master)
// ============================================================================

/**
 * Contiene información REUTILIZABLE que NO cambia entre convocatorias:
 * - Temario, objetivos, requisitos
 * - Información general del curso
 * - Configuración base de precios
 */
export interface CursoPlantilla {
  id: string
  codigo: string // "CM-PRO" (sin año/sede)
  nombre: string
  descripcion: string
  objetivos: string[]
  requisitos: string[]
  tipo: CourseType
  modalidad: CourseModality
  duracionHoras: number
  precioBase: number

  // Temario estructurado
  temario: {
    module: string
    hours: number
    topics: string[]
  }[]

  // Medios visuales
  imagenPortada: string

  // Subvenciones
  subvencionado: SubvencionType
  entidadesFinanciadoras: EntidadFinanciadora[]

  // Certificación
  nombreCertificado?: string

  // Metadata
  activo: boolean
  fechaCreacion: Date
  fechaActualizacion?: Date
  creadoPor?: string
}

// ============================================================================
// INSTANCIA DE CURSO (Course Run / Convocatoria)
// ============================================================================

/**
 * Representa una convocatoria ESPECÍFICA del curso:
 * - Asignación a sede, aula, profesor
 * - Fechas concretas de inicio/fin
 * - Gestión de plazas y matriculación
 * - Estado actual de la convocatoria
 */
export interface InstanciaCurso {
  id: string
  plantillaId: string // FK a CursoPlantilla
  codigoCompleto: string // "CM-PRO-2025-NORTE-ENE" (generado automáticamente)

  // Asignación específica
  sedeId: string
  sedeNombre: string // "CEP Norte"
  aulaId: string
  aulaNombre: string // "Aula A1"
  profesorId: string
  profesorNombre: string
  profesorAvatar?: string

  // Programación temporal
  fechaInicio: Date
  fechaFin: Date
  horario: string // "L-V: 18:00-21:00"
  diasSemana: string[] // ["lunes", "martes", "miércoles", "jueves", "viernes"]

  // Capacidad y matriculación
  plazasTotales: number
  plazasOcupadas: number
  plazasDisponibles: number // calculado: plazasTotales - plazasOcupadas
  porcentajeOcupacion: number // calculado: (plazasOcupadas / plazasTotales) * 100

  // Pricing (puede variar por sede/convocatoria para promociones)
  precio: number
  precioConDescuento?: number

  // Estado de la convocatoria
  estado: InstanciaEstado
  convocatoria: string // "Enero 2025", "Verano 2025", "Otoño 2025"

  // Fechas límite
  fechaLimiteInscripcion?: Date

  // Metadata
  fechaCreacion: Date
  fechaActualizacion?: Date
  creadoPor: string
  actualizadoPor?: string
}

// ============================================================================
// VISTA COMPLETA DE INSTANCIA (para UI/Catálogo)
// ============================================================================

/**
 * Combina datos de PLANTILLA + INSTANCIA para mostrar en el catálogo público
 * y en las cards de cursos. Evita hacer joins en el frontend.
 */
export interface InstanciaVistaCompleta extends InstanciaCurso {
  // Datos heredados de la plantilla
  nombreCurso: string
  descripcionCurso: string
  objetivosCurso: string[]
  requisitosCurso: string[]
  modalidad: CourseModality
  duracionHoras: number
  tipo: CourseType
  temario: {
    module: string
    hours: number
    topics: string[]
  }[]
  imagenPortada: string
  subvencionado: SubvencionType
  entidadesFinanciadoras: EntidadFinanciadora[]
  nombreCertificado?: string
}

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

/**
 * Filtros para búsqueda de instancias en el catálogo
 */
export interface FiltrosInstancias {
  searchTerm?: string
  tipo?: CourseType | "todos"
  modalidad?: CourseModality | "todas"
  sede?: string | "todas"
  estado?: InstanciaEstado | "todos"
  convocatoria?: string
  precioMaximo?: number
  subvencionado?: boolean
  plazasDisponibles?: boolean
}

/**
 * Estadísticas de una plantilla (resumen de todas sus instancias)
 */
export interface EstadisticasPlantilla {
  plantillaId: string
  totalInstancias: number
  instanciasActivas: number
  totalMatriculados: number
  capacidadTotal: number
  tasaOcupacionPromedio: number
  ingresosTotales: number
  proximaConvocatoria?: {
    id: string
    fechaInicio: Date
    sedeNombre: string
  }
}
