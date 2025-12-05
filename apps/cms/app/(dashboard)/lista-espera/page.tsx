'use client'

export const dynamic = 'force-dynamic'

import { MockupTable } from '@payload-config/components/mockup/MockupTable'

export default function ListaEsperaPage() {
  const columns = ['Alumno', 'Curso Deseado', 'Prioridad', 'Fecha Entrada', 'Estado', 'Contacto']

  const rows = [
    [
      'Sofía Martínez Pérez',
      'Ciclo Superior - Desarrollo Apps',
      <span key="1" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Alta</span>,
      '15/11/2025',
      <span key="1b" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Lista</span>,
      'sofia.martinez@email.com'
    ],
    [
      'David González Ruiz',
      'Marketing Digital Avanzado',
      <span key="2" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Media</span>,
      '18/11/2025',
      <span key="2b" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Enviado</span>,
      'david.gonzalez@email.com'
    ],
    [
      'Isabel Fernández López',
      'Community Manager',
      <span key="3" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Alta</span>,
      '20/11/2025',
      <span key="3b" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Lista</span>,
      'isabel.fernandez@email.com'
    ],
    [
      'Miguel Ángel Sánchez',
      'Desarrollo Full Stack',
      <span key="4" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Baja</span>,
      '22/11/2025',
      <span key="4b" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Lista</span>,
      'miguel.sanchez@email.com'
    ],
    [
      'Carmen Rodríguez Torres',
      'Diseño UX/UI',
      <span key="5" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Media</span>,
      '16/11/2025',
      <span key="5b" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Aceptado</span>,
      'carmen.rodriguez@email.com'
    ]
  ]

  return (
    <div className="p-6">
      <MockupTable
        title="Lista de Espera"
        description="Gestión de alumnos en lista de espera para cursos con plazas completas"
        columns={columns}
        rows={rows}
        onAdd={() => console.log('Añadir a lista')}
        addButtonText="Añadir a Lista"
        onExport={() => console.log('Exportar CSV')}
      />
    </div>
  )
}
