import { NextResponse } from 'next/server'

/**
 * Campus Virtual - Alumnos Matriculados API (Mock)
 * Phase A: Returns mock enrolled students data
 *
 * GET /api/campus/alumnos
 */
export async function GET() {
  const alumnos = [
    {
      id: '1',
      nombre: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      cursos: ['Marketing Digital', 'Ingles B2'],
      progreso: 68,
      ultimoAcceso: '2025-12-08T09:30:00Z',
      estado: 'activo',
    },
    {
      id: '2',
      nombre: 'Juan Perez',
      email: 'juan.perez@example.com',
      cursos: ['Contabilidad Avanzada'],
      progreso: 45,
      ultimoAcceso: '2025-12-07T14:20:00Z',
      estado: 'activo',
    },
    {
      id: '3',
      nombre: 'Laura Martinez',
      email: 'laura.martinez@example.com',
      cursos: ['Marketing Digital'],
      progreso: 92,
      ultimoAcceso: '2025-12-08T08:15:00Z',
      estado: 'activo',
    },
    {
      id: '4',
      nombre: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@example.com',
      cursos: ['Ingles B2', 'Contabilidad Avanzada'],
      progreso: 15,
      ultimoAcceso: '2025-12-01T16:45:00Z',
      estado: 'inactivo',
    },
  ]

  return NextResponse.json({
    success: true,
    data: alumnos,
    total: alumnos.length,
    _mock: true,
    _phase: 'A',
  })
}
