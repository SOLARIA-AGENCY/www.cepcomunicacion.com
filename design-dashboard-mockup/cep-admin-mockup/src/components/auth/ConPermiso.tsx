import type { ReactNode } from 'react'
import type { ModuloSistema, AccionPermiso } from '@/types'
import { usePermiso } from '@/hooks/usePermiso'

interface ConPermisoProps {
  modulo: ModuloSistema
  accion: AccionPermiso
  children: ReactNode
  fallback?: ReactNode
}

export function ConPermiso({ modulo, accion, children, fallback = null }: ConPermisoProps) {
  const tienePermiso = usePermiso(modulo, accion)

  if (!tienePermiso) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
