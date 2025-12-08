'use client'

import { Award } from 'lucide-react'
import { ComingSoonPage } from '@payload-config/components/ui/ComingSoonPage'

export default function CampusCertificadosPage() {
  return (
    <ComingSoonPage
      title="Certificados y Diplomas"
      description="Generación y gestión de acreditaciones"
      icon={Award}
      expectedPhase="Fase D"
      plannedFeatures={[
        'Plantillas de certificado personalizables',
        'Generación automática al completar curso',
        'Código de verificación único',
        'Descarga en PDF con firma digital',
        'Verificación pública de autenticidad',
        'Historial de certificados emitidos',
      ]}
      note="Los certificados incluyen un código QR para verificación online."
    />
  )
}
