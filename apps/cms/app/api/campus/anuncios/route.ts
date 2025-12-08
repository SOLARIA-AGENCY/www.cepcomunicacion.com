import { NextResponse } from 'next/server'

/**
 * Campus Virtual - Anuncios API (Mock)
 * Phase A: Returns mock announcements data
 *
 * GET /api/campus/anuncios
 */
export async function GET() {
  const anuncios = [
    {
      id: '1',
      titulo: 'Horarios de Examenes Finales',
      contenido: 'Se han publicado los horarios de examenes finales. Consulta tu panel de alumno.',
      curso: null, // Global announcement
      destacado: true,
      fechaPublicacion: '2025-12-08T09:00:00Z',
      autor: 'Administracion',
    },
    {
      id: '2',
      titulo: 'Nueva sesion de refuerzo',
      contenido: 'El proximo viernes habra una sesion extra de refuerzo para dudas del proyecto final.',
      curso: 'Marketing Digital',
      destacado: false,
      fechaPublicacion: '2025-12-07T14:30:00Z',
      autor: 'Prof. Ana Lopez',
    },
    {
      id: '3',
      titulo: 'Cambio de horario sesion Speaking',
      contenido: 'La sesion de speaking del jueves se traslada al viernes a las 11:00.',
      curso: 'Ingles B2',
      destacado: true,
      fechaPublicacion: '2025-12-06T10:00:00Z',
      autor: 'Prof. John Smith',
    },
  ]

  return NextResponse.json({
    success: true,
    data: anuncios,
    total: anuncios.length,
    _mock: true,
    _phase: 'A',
  })
}
