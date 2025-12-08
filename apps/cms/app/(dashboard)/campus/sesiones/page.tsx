'use client'

import { Video } from 'lucide-react'
import { ComingSoonPage } from '@payload-config/components/ui/ComingSoonPage'

export default function CampusSesionesPage() {
  return (
    <ComingSoonPage
      title="Sesiones en Vivo"
      description="Programación de clases en directo y semipresenciales"
      icon={Video}
      expectedPhase="Fase C"
      plannedFeatures={[
        'Programar sesiones con fecha/hora',
        'Integración con Zoom/Google Meet',
        'Envío automático de recordatorios',
        'Control de asistencia',
        'Grabación automática (opcional)',
      ]}
      note="Las sesiones pueden ser presenciales, online o híbridas."
    />
  )
}
