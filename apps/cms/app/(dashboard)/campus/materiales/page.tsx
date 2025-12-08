'use client'

import { FileUp } from 'lucide-react'
import { ComingSoonPage } from '@payload-config/components/ui/ComingSoonPage'

export default function CampusMaterialesPage() {
  return (
    <ComingSoonPage
      title="Materiales Didácticos"
      description="Biblioteca de recursos por curso y lección"
      icon={FileUp}
      expectedPhase="Fase B"
      plannedFeatures={[
        'Subir PDFs, videos y enlaces',
        'Organizar por curso/módulo/lección',
        'Programar fecha de publicación',
        'Control de visibilidad por alumno',
        'Estadísticas de descargas',
      ]}
      note="Los materiales se asocian a lecciones específicas o al curso completo."
    />
  )
}
