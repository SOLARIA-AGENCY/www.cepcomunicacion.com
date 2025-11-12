// Course Types
export type CourseType =
  | "telematico"
  | "ocupados"
  | "desempleados"
  | "privados"
  | "ciclo-medio"
  | "ciclo-superior"

export type CourseModality = "presencial" | "semipresencial" | "telematico"

export type CourseStatus = "borrador" | "publicado" | "archivado"

export interface Course {
  id: string
  title: string
  description: string
  type: CourseType
  modality: CourseModality
  status: CourseStatus
  duration: number // hours
  price: number
  image?: string
  campus?: string[]
  published: boolean
  created_at: string
}

// Convocation/Programming Types
export type ConvocationStatus = "abierta" | "lista_espera" | "cerrada" | "planificada"

export interface Convocation {
  id: string
  course_id: string
  course_title: string
  start_date: string
  end_date: string
  status: ConvocationStatus
  capacity_min: number
  capacity_max: number
  enrolled: number
  campus_id: string
  campus_name: string
  price?: number
}

// Campus/Sede Types
export interface Campus {
  id: string
  name: string
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
  active: boolean
  classrooms_count: number
}

// Classroom/Aula Types
export interface Classroom {
  id: string
  name: string
  campus_id: string
  campus_name: string
  capacity: number
  equipment: string[]
  active: boolean
}

// Teacher/Profesor Types
export interface Teacher {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  specialties: string[]
  active: boolean
  courses_count: number
}

// Student/Alumno Types
export interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  enrollments_count: number
  active: boolean
  created_at: string
}

// Lead Types
export type LeadStatus = "nuevo" | "contactado" | "inscrito" | "descartado"
export type LeadSource = "web" | "meta_ads" | "whatsapp" | "referido" | "telefono"

export interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  course_interest: string
  status: LeadStatus
  source: LeadSource
  assigned_to?: string
  notes?: string
  created_at: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

// Campaign Types
export type CampaignStatus = "activa" | "pausada" | "finalizada"

export interface Campaign {
  id: string
  name: string
  description: string
  status: CampaignStatus
  budget: number
  leads_generated: number
  conversions: number
  conversion_rate: number
  cost_per_lead: number
  start_date: string
  end_date: string
}

// KPI/Metrics Types
export interface DashboardMetrics {
  total_courses: number
  active_courses: number
  total_students: number
  active_students: number
  total_leads: number
  leads_this_month: number
  conversion_rate: number
  total_revenue: number
  active_convocations: number
  total_teachers: number
  total_campuses: number
  classroom_utilization: number
}

// ==========================================
// ADMINISTRACIÓN Y PERMISOS
// ==========================================

export type ModuloSistema =
  | 'cursos'
  | 'programacion'
  | 'ciclos'
  | 'sedes'
  | 'aulas'
  | 'profesores'
  | 'administrativos'
  | 'alumnos'
  | 'leads'
  | 'matriculas'
  | 'campanas'
  | 'creatividades'
  | 'contenido'
  | 'analiticas'
  | 'administracion'

export type AccionPermiso = 'ver' | 'crear' | 'editar' | 'eliminar' | 'exportar'

export interface Permiso {
  modulo: ModuloSistema
  acciones: AccionPermiso[]
}

export interface Rol {
  id: string
  nombre: string
  descripcion: string
  permisos: Permiso[]
  es_sistema: boolean // No se puede editar/eliminar
  usuarios_count: number
  color: string // Para badges
  created_at: string
  updated_at: string
}

export interface Usuario {
  id: string
  nombre: string
  apellido: string
  email: string
  foto?: string
  rol: Rol
  activo: boolean
  ultimo_acceso?: string
  created_at: string
  updated_at: string
}

export interface ActividadLog {
  id: string
  usuario: Usuario
  accion: string
  modulo: ModuloSistema
  detalle: string
  ip: string
  timestamp: string
}

// Tipo para personal que tiene acceso al dashboard
export interface PersonalConAcceso {
  tiene_acceso: boolean
  usuario?: Usuario
}
