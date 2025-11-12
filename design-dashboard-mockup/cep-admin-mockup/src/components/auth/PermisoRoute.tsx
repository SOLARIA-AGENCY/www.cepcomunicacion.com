import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { ModuloSistema, AccionPermiso } from '@/types'
import { usePermiso } from '@/hooks/usePermiso'

interface PermisoRouteProps {
  modulo: ModuloSistema
  accion: AccionPermiso
  children: ReactNode
  redirectTo?: string
}

export function PermisoRoute({
  modulo,
  accion,
  children,
  redirectTo = '/',
}: PermisoRouteProps) {
  const tienePermiso = usePermiso(modulo, accion)

  if (!tienePermiso) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
