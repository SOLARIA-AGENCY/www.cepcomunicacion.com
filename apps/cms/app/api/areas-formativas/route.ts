import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import { NextResponse } from 'next/server';

/**
 * GET /api/areas-formativas
 *
 * Retorna todas las áreas formativas activas
 * Usado por frontend para dropdown en formulario de creación de cursos
 */
export async function GET() {
  try {
    const payload = await getPayloadHMR({ config: configPromise });

    const areas = await payload.find({
      collection: 'areas-formativas',
      where: {
        activo: {
          equals: true,
        },
      },
      sort: 'nombre',
      limit: 100,
    });

    return NextResponse.json({
      success: true,
      data: areas.docs.map((area) => ({
        id: area.id,
        nombre: area.nombre,
        codigo: area.codigo,
        color: area.color,
      })),
    });
  } catch (error) {
    console.error('Error fetching areas formativas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener áreas formativas' },
      { status: 500 }
    );
  }
}
