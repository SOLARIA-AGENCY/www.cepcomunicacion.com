'use client'

import { Layers } from 'lucide-react'
import { ComingSoonPage } from '@payload-config/components/ui/ComingSoonPage'

export default function CampusCursosPage() {
  return (
    <ComingSoonPage
      title="Estructura de Cursos"
      description="Gestión de módulos y lecciones del campus virtual"
      icon={Layers}
      expectedPhase="Fase B"
      plannedFeatures={[
        'Crear y organizar módulos de curso',
        'Añadir lecciones con contenido multimedia',
        'Drag & drop para reordenar contenido',
        'Programar visibilidad por fechas',
        'Control de acceso por enrollment',
      ]}
      note="Los cursos se vinculan automáticamente con las convocatorias activas."
    />
  )
}
