'use client'

import { Users } from 'lucide-react'
import { ComingSoonPage } from '@payload-config/components/ui/ComingSoonPage'

export default function CampusAlumnosPage() {
  return (
    <ComingSoonPage
      title="Alumnos Matriculados"
      description="Gestión de enrollments y progreso de alumnos"
      icon={Users}
      expectedPhase="Fase B"
      plannedFeatures={[
        'Ver alumnos por curso/convocatoria',
        'Gestionar acceso (conceder/revocar)',
        'Seguimiento de progreso individual',
        'Historial de actividad por alumno',
        'Exportar informes de progreso',
      ]}
      note="Los alumnos se vinculan automáticamente al matricularse en una convocatoria."
    />
  )
}
