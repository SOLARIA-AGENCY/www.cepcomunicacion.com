'use client'

import { ClipboardCheck } from 'lucide-react'
import { ComingSoonPage } from '@payload-config/components/ui/ComingSoonPage'

export default function CampusTareasPage() {
  return (
    <ComingSoonPage
      title="Tareas y Evaluaciones"
      description="Gestión de entregas y calificaciones de alumnos"
      icon={ClipboardCheck}
      expectedPhase="Fase C"
      plannedFeatures={[
        'Crear tareas con fecha límite',
        'Adjuntar archivos de referencia',
        'Recibir entregas de alumnos',
        'Sistema de calificación y feedback',
        'Rúbricas personalizables',
        'Notificaciones de nuevas entregas',
      ]}
      note="Las tareas se asocian a lecciones específicas o pueden ser independientes del curso."
    />
  )
}
