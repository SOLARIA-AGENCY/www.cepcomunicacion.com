'use client'

export const dynamic = 'force-dynamic'

import { MockupTable } from '@payload-config/components/mockup/MockupTable'

export default function MatriculasPage() {
  const columns = ['Alumno', 'Curso', 'Estado', 'Fecha Solicitud', 'Convocatoria', 'Observaciones']

  const rows = [
    [
      'María García López',
      'Marketing Digital Avanzado',
      <span key="1" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aceptada</span>,
      '20/11/2025',
      'ENE-2026-MAD',
      'Documentación completa'
    ],
    [
      'Juan Martínez Ruiz',
      'Desarrollo Full Stack',
      <span key="2" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>,
      '22/11/2025',
      'FEB-2026-TFE',
      'Falta certificado académico'
    ],
    [
      'Ana Sánchez Torres',
      'Community Manager',
      <span key="3" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aceptada</span>,
      '19/11/2025',
      'ENE-2026-MAD',
      'Pago realizado'
    ],
    [
      'Pedro López Fernández',
      'SEO y Posicionamiento Web',
      <span key="4" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rechazada</span>,
      '18/11/2025',
      'DIC-2025-VLC',
      'Plazas completas'
    ],
    [
      'Laura Rodríguez Gil',
      'Diseño Gráfico Digital',
      <span key="5" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>,
      '23/11/2025',
      'MAR-2026-BCN',
      'En revisión'
    ],
    [
      'Carlos Gómez Martín',
      'Administración de Sistemas',
      <span key="6" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aceptada</span>,
      '21/11/2025',
      'ENE-2026-SVQ',
      'Beca FUNDAE aplicada'
    ]
  ]

  return (
    <div className="p-6">
      <MockupTable
        title="Gestión de Matrículas"
        description="Control de solicitudes de matrícula, estados y seguimiento de inscripciones"
        columns={columns}
        rows={rows}
        onAdd={() => console.log('Registrar matrícula')}
        addButtonText="Registrar Matrícula"
        onExport={() => console.log('Exportar CSV')}
      />
    </div>
  )
}
