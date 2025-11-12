import type { Rol, Usuario, ActividadLog, Permiso, ModuloSistema, AccionPermiso, PersonalConAcceso } from '@/types'

// ==========================================
// PERMISOS PREDEFINIDOS
// ==========================================

const PERMISOS_COMPLETOS: Permiso[] = [
  { modulo: 'cursos', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'programacion', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'ciclos', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'sedes', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'aulas', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'profesores', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'administrativos', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'alumnos', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'leads', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'matriculas', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'campanas', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'creatividades', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'contenido', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
  { modulo: 'analiticas', acciones: ['ver', 'exportar'] },
  { modulo: 'administracion', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
]

// ==========================================
// ROLES PREDEFINIDOS
// ==========================================

export const ROLES_MOCK: Rol[] = [
  {
    id: 'rol-1',
    nombre: 'Super Admin',
    descripcion: 'Acceso total al sistema sin restricciones',
    permisos: PERMISOS_COMPLETOS,
    es_sistema: true,
    usuarios_count: 2,
    color: 'bg-red-600',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'rol-2',
    nombre: 'Admin',
    descripcion: 'Administrador general con acceso a todos los módulos excepto administración de roles',
    permisos: PERMISOS_COMPLETOS.filter((p) => p.modulo !== 'administracion'),
    es_sistema: true,
    usuarios_count: 3,
    color: 'bg-orange-600',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'rol-3',
    nombre: 'Coordinador Académico',
    descripcion: 'Gestión completa de cursos, programación, profesores y alumnos',
    permisos: [
      { modulo: 'cursos', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
      { modulo: 'programacion', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
      { modulo: 'ciclos', acciones: ['ver', 'editar'] },
      { modulo: 'sedes', acciones: ['ver'] },
      { modulo: 'aulas', acciones: ['ver', 'crear', 'editar'] },
      { modulo: 'profesores', acciones: ['ver', 'crear', 'editar', 'exportar'] },
      { modulo: 'alumnos', acciones: ['ver', 'crear', 'editar', 'exportar'] },
      { modulo: 'matriculas', acciones: ['ver', 'crear', 'editar', 'exportar'] },
      { modulo: 'analiticas', acciones: ['ver', 'exportar'] },
    ],
    es_sistema: false,
    usuarios_count: 5,
    color: 'bg-blue-600',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
  },
  {
    id: 'rol-4',
    nombre: 'Profesor',
    descripcion: 'Acceso de solo lectura a cursos y alumnos asignados',
    permisos: [
      { modulo: 'cursos', acciones: ['ver'] },
      { modulo: 'programacion', acciones: ['ver'] },
      { modulo: 'alumnos', acciones: ['ver'] },
      { modulo: 'aulas', acciones: ['ver'] },
    ],
    es_sistema: false,
    usuarios_count: 24,
    color: 'bg-green-600',
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z',
  },
  {
    id: 'rol-5',
    nombre: 'Marketing',
    descripcion: 'Gestión de campañas, creatividades, leads y contenido web',
    permisos: [
      { modulo: 'cursos', acciones: ['ver', 'exportar'] },
      { modulo: 'leads', acciones: ['ver', 'crear', 'editar', 'exportar'] },
      { modulo: 'matriculas', acciones: ['ver', 'exportar'] },
      { modulo: 'campanas', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
      { modulo: 'creatividades', acciones: ['ver', 'crear', 'editar', 'eliminar', 'exportar'] },
      { modulo: 'contenido', acciones: ['ver', 'crear', 'editar', 'exportar'] },
      { modulo: 'analiticas', acciones: ['ver', 'exportar'] },
    ],
    es_sistema: false,
    usuarios_count: 4,
    color: 'bg-purple-600',
    created_at: '2025-01-18T00:00:00Z',
    updated_at: '2025-02-05T00:00:00Z',
  },
  {
    id: 'rol-6',
    nombre: 'Administrativo',
    descripcion: 'Gestión de leads, matrículas y datos de alumnos',
    permisos: [
      { modulo: 'cursos', acciones: ['ver'] },
      { modulo: 'programacion', acciones: ['ver'] },
      { modulo: 'sedes', acciones: ['ver'] },
      { modulo: 'alumnos', acciones: ['ver', 'crear', 'editar', 'exportar'] },
      { modulo: 'leads', acciones: ['ver', 'crear', 'editar', 'exportar'] },
      { modulo: 'matriculas', acciones: ['ver', 'crear', 'editar', 'exportar'] },
    ],
    es_sistema: false,
    usuarios_count: 6,
    color: 'bg-teal-600',
    created_at: '2025-01-22T00:00:00Z',
    updated_at: '2025-01-22T00:00:00Z',
  },
  {
    id: 'rol-7',
    nombre: 'Auditor',
    descripcion: 'Acceso de solo lectura a todos los módulos para auditoría y reportes',
    permisos: PERMISOS_COMPLETOS.map((p) => ({
      modulo: p.modulo,
      acciones: ['ver', 'exportar'] as AccionPermiso[],
    })),
    es_sistema: false,
    usuarios_count: 2,
    color: 'bg-gray-600',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
  },
]

// ==========================================
// USUARIOS MOCK
// ==========================================

export const USUARIOS_MOCK: Usuario[] = [
  {
    id: 'usr-1',
    nombre: 'Carlos',
    apellido: 'Pérez',
    email: 'carlos.perez@cepcomunicacion.com',
    foto: 'https://i.pravatar.cc/150?img=12',
    rol: ROLES_MOCK[0], // Super Admin
    activo: true,
    ultimo_acceso: '2025-06-12T10:30:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-06-12T10:30:00Z',
  },
  {
    id: 'usr-2',
    nombre: 'Ana',
    apellido: 'García',
    email: 'ana.garcia@cepcomunicacion.com',
    foto: 'https://i.pravatar.cc/150?img=5',
    rol: ROLES_MOCK[1], // Admin
    activo: true,
    ultimo_acceso: '2025-06-12T09:15:00Z',
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-06-12T09:15:00Z',
  },
  {
    id: 'usr-3',
    nombre: 'Miguel',
    apellido: 'Rodríguez',
    email: 'miguel.rodriguez@cepcomunicacion.com',
    foto: 'https://i.pravatar.cc/150?img=8',
    rol: ROLES_MOCK[2], // Coordinador Académico
    activo: true,
    ultimo_acceso: '2025-06-11T17:45:00Z',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-06-11T17:45:00Z',
  },
  {
    id: 'usr-4',
    nombre: 'Laura',
    apellido: 'Martínez',
    email: 'laura.martinez@cepcomunicacion.com',
    foto: 'https://i.pravatar.cc/150?img=9',
    rol: ROLES_MOCK[4], // Marketing
    activo: true,
    ultimo_acceso: '2025-06-12T08:00:00Z',
    created_at: '2025-01-18T00:00:00Z',
    updated_at: '2025-06-12T08:00:00Z',
  },
  {
    id: 'usr-5',
    nombre: 'Javier',
    apellido: 'López',
    email: 'javier.lopez@cepcomunicacion.com',
    foto: 'https://i.pravatar.cc/150?img=15',
    rol: ROLES_MOCK[3], // Profesor
    activo: true,
    ultimo_acceso: '2025-06-10T14:20:00Z',
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-06-10T14:20:00Z',
  },
  {
    id: 'usr-6',
    nombre: 'Carmen',
    apellido: 'Sánchez',
    email: 'carmen.sanchez@cepcomunicacion.com',
    foto: 'https://i.pravatar.cc/150?img=10',
    rol: ROLES_MOCK[5], // Administrativo
    activo: false,
    ultimo_acceso: '2025-05-28T11:00:00Z',
    created_at: '2025-01-22T00:00:00Z',
    updated_at: '2025-05-28T11:00:00Z',
  },
]

// ==========================================
// ACTIVIDAD LOG MOCK
// ==========================================

export const ACTIVIDAD_LOG_MOCK: ActividadLog[] = [
  {
    id: 'log-1',
    usuario: USUARIOS_MOCK[0],
    accion: 'Editar',
    modulo: 'cursos',
    detalle: 'Editó el curso "Marketing Digital 2025"',
    ip: '192.168.1.100',
    timestamp: '2025-06-12T10:30:00Z',
  },
  {
    id: 'log-2',
    usuario: USUARIOS_MOCK[1],
    accion: 'Crear',
    modulo: 'campanas',
    detalle: 'Creó la campaña "Verano 2025 - Redes Sociales"',
    ip: '192.168.1.101',
    timestamp: '2025-06-12T09:15:00Z',
  },
  {
    id: 'log-3',
    usuario: USUARIOS_MOCK[3],
    accion: 'Exportar',
    modulo: 'leads',
    detalle: 'Exportó 245 leads a CSV',
    ip: '192.168.1.105',
    timestamp: '2025-06-12T08:00:00Z',
  },
  {
    id: 'log-4',
    usuario: USUARIOS_MOCK[2],
    accion: 'Crear',
    modulo: 'programacion',
    detalle: 'Creó convocatoria "Diseño Gráfico - Julio 2025"',
    ip: '192.168.1.103',
    timestamp: '2025-06-11T17:45:00Z',
  },
  {
    id: 'log-5',
    usuario: USUARIOS_MOCK[0],
    accion: 'Eliminar',
    modulo: 'administracion',
    detalle: 'Eliminó el usuario "pedro.gomez@cepcomunicacion.com"',
    ip: '192.168.1.100',
    timestamp: '2025-06-11T16:00:00Z',
  },
]

// ==========================================
// HELPERS
// ==========================================

export function tienePermiso(
  usuario: Usuario | null,
  modulo: ModuloSistema,
  accion: AccionPermiso
): boolean {
  if (!usuario || !usuario.activo) return false

  const permisoModulo = usuario.rol.permisos.find((p) => p.modulo === modulo)
  if (!permisoModulo) return false

  return permisoModulo.acciones.includes(accion)
}

export function esStaffConAcceso(personalId: string): PersonalConAcceso {
  const usuario = USUARIOS_MOCK.find((u) => u.id === personalId)
  return {
    tiene_acceso: !!usuario,
    usuario,
  }
}
