'use client'

import { Bell } from 'lucide-react'
import { ComingSoonPage } from '@payload-config/components/ui/ComingSoonPage'

export default function CampusAnunciosPage() {
  return (
    <ComingSoonPage
      title="Anuncios del Campus"
      description="Comunicaciones y notificaciones para alumnos"
      icon={Bell}
      expectedPhase="Fase B"
      plannedFeatures={[
        'Publicar anuncios globales o por curso',
        'Programar fecha de publicación',
        'Notificar por email a destinatarios',
        'Destacar anuncios importantes',
        'Historial de comunicaciones',
      ]}
      note="Los alumnos reciben anuncios en su panel y opcionalmente por email."
    />
  )
}
