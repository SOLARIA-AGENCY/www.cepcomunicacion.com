import { NextResponse } from 'next/server'

/**
 * Campus Virtual - Cursos API (Mock)
 * Phase A: Returns mock course structure data
 *
 * GET /api/campus/cursos
 */
export async function GET() {
  const cursos = [
    {
      id: '1',
      titulo: 'Marketing Digital',
      modulos: 8,
      lecciones: 42,
      duracion: '60h',
      estado: 'publicado',
      alumnosMatriculados: 45,
    },
    {
      id: '2',
      titulo: 'Contabilidad Avanzada',
      modulos: 6,
      lecciones: 28,
      duracion: '40h',
      estado: 'publicado',
      alumnosMatriculados: 32,
    },
    {
      id: '3',
      titulo: 'Ingles B2',
      modulos: 10,
      lecciones: 55,
      duracion: '80h',
      estado: 'borrador',
      alumnosMatriculados: 0,
    },
  ]

  return NextResponse.json({
    success: true,
    data: cursos,
    total: cursos.length,
    _mock: true,
    _phase: 'A',
  })
}
