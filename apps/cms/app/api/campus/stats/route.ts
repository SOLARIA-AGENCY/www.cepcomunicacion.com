import { NextResponse } from 'next/server'

/**
 * Campus Virtual - Dashboard Stats API (Mock)
 * Phase A: Returns mock data for development
 *
 * GET /api/campus/stats
 */
export async function GET() {
  // Mock data for Campus Virtual dashboard
  const stats = {
    alumnosActivos: 248,
    alumnosActivosChange: '+12%',
    cursosEnCurso: 15,
    cursosEnCursoChange: '+3',
    sesionesHoy: 4,
    tareasPendientes: 32,
    tareasPendientesChange: '-8',
    materialesSubidos: 156,
    certificadosEmitidos: 89,
  }

  return NextResponse.json({
    success: true,
    data: stats,
    _mock: true,
    _phase: 'A',
  })
}
