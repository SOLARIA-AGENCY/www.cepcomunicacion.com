import { NextResponse } from 'next/server'

/**
 * Campus Virtual - Sesiones en Vivo API (Mock)
 * Phase A: Returns mock live session data
 *
 * GET /api/campus/sesiones
 */
export async function GET() {
  const sesiones = [
    {
      id: '1',
      curso: 'Marketing Digital',
      titulo: 'Introduccion a Meta Ads',
      fecha: new Date().toISOString().split('T')[0],
      hora: '10:00',
      duracion: 90,
      instructor: 'Prof. Ana Lopez',
      plataforma: 'zoom',
      estado: 'programada',
      inscritos: 28,
    },
    {
      id: '2',
      curso: 'Ingles B2',
      titulo: 'Speaking Practice Session',
      fecha: new Date().toISOString().split('T')[0],
      hora: '12:00',
      duracion: 60,
      instructor: 'Prof. John Smith',
      plataforma: 'google_meet',
      estado: 'programada',
      inscritos: 15,
    },
    {
      id: '3',
      curso: 'Contabilidad',
      titulo: 'Cierre de Ejercicio',
      fecha: new Date().toISOString().split('T')[0],
      hora: '16:00',
      duracion: 120,
      instructor: 'Prof. Carlos Ruiz',
      plataforma: 'zoom',
      estado: 'en_vivo',
      inscritos: 22,
    },
  ]

  return NextResponse.json({
    success: true,
    data: sesiones,
    total: sesiones.length,
    _mock: true,
    _phase: 'A',
  })
}
