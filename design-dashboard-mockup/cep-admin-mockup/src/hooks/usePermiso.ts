import type { ModuloSistema, AccionPermiso, Usuario } from '@/types'
import { tienePermiso, USUARIOS_MOCK } from '@/data/mockAdministracion'

// Mock: En producción, esto vendría de un contexto de autenticación
const USUARIO_MOCK: Usuario = USUARIOS_MOCK[0] // Carlos Pérez - Super Admin

export function usePermiso(modulo: ModuloSistema, accion: AccionPermiso): boolean {
  // Mock: En producción, obtendría el usuario del contexto
  const usuario = USUARIO_MOCK

  return tienePermiso(usuario, modulo, accion)
}

export function usePuede() {
  return {
    ver: (modulo: ModuloSistema) => usePermiso(modulo, 'ver'),
    crear: (modulo: ModuloSistema) => usePermiso(modulo, 'crear'),
    editar: (modulo: ModuloSistema) => usePermiso(modulo, 'editar'),
    eliminar: (modulo: ModuloSistema) => usePermiso(modulo, 'eliminar'),
    exportar: (modulo: ModuloSistema) => usePermiso(modulo, 'exportar'),
  }
}
