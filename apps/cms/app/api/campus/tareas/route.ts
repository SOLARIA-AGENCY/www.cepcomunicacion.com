import { NextResponse } from 'next/server'

/**
 * Campus Virtual - Tareas y Evaluaciones API (Mock)
 * Phase A: Returns mock assignments data
 *
 * GET /api/campus/tareas
 */
export async function GET() {
  const tareas = [
    {
      id: '1',
      titulo: 'Proyecto Final Marketing Digital',
      curso: 'Marketing Digital',
      fechaLimite: '2025-12-15T23:59:00Z',
      entregas: 28,
      pendientes: 17,
      calificadas: 11,
      estado: 'activa',
    },
    {
      id: '2',
      titulo: 'Balance de Situacion',
      curso: 'Contabilidad Avanzada',
      fechaLimite: '2025-12-10T23:59:00Z',
      entregas: 25,
      pendientes: 7,
      calificadas: 18,
      estado: 'activa',
    },
    {
      id: '3',
      titulo: 'Writing Essay - My Future Career',
      curso: 'Ingles B2',
      fechaLimite: '2025-12-20T23:59:00Z',
      entregas: 8,
      pendientes: 35,
      calificadas: 0,
      estado: 'activa',
    },
    {
      id: '4',
      titulo: 'Analisis de Campana Meta Ads',
      curso: 'Marketing Digital',
      fechaLimite: '2025-11-30T23:59:00Z',
      entregas: 42,
      pendientes: 3,
      calificadas: 42,
      estado: 'cerrada',
    },
  ]

  return NextResponse.json({
    success: true,
    data: tareas,
    total: tareas.length,
    _mock: true,
    _phase: 'A',
  })
}
