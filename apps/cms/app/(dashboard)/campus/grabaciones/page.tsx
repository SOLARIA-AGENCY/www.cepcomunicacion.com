'use client'

import { PlayCircle } from 'lucide-react'
import { ComingSoonPage } from '@payload-config/components/ui/ComingSoonPage'

export default function CampusGrabacionesPage() {
  return (
    <ComingSoonPage
      title="Grabaciones de Clases"
      description="Archivo de sesiones grabadas disponibles para alumnos"
      icon={PlayCircle}
      expectedPhase="Fase C"
      plannedFeatures={[
        'Acceso a grabaciones de sesiones pasadas',
        'Organización por curso y fecha',
        'Reproducción con marcadores temporales',
        'Control de acceso por enrollment',
        'Estadísticas de visualización',
      ]}
      note="Las grabaciones se generan automáticamente desde las sesiones en vivo (si está habilitado)."
    />
  )
}
