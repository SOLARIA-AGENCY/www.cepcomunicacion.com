import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import type { ScheduleEntry } from '@payload-config/components/ui/ScheduleBuilder';

interface CreateConvocationRequest {
  courseId: string;
  fechaInicio: string;
  fechaFin: string;
  horario: ScheduleEntry[];
  modalidad: string;
  estado: string;
  plazasTotales: number;
  precio: number;
  profesorId: string;
  sedeId: string;
  aulaId: string;
}

/**
 * POST /api/convocatorias
 *
 * Crea una nueva convocatoria para un curso
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateConvocationRequest = await request.json();
    const {
      courseId,
      fechaInicio,
      fechaFin,
      horario,
      modalidad,
      estado,
      plazasTotales,
      precio,
      profesorId,
      sedeId,
      aulaId,
    } = body;

    // Validaciones básicas
    if (!courseId || !fechaInicio || !fechaFin || !horario || horario.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: courseId, fechaInicio, fechaFin, horario' },
        { status: 400 }
      );
    }

    const payload = await getPayloadHMR({ config: configPromise });

    // Verificar que el curso existe
    const course = await payload.findByID({
      collection: 'courses',
      id: parseInt(courseId),
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Convertir horario a formato de cadena para almacenar
    const horarioFormatted = horario
      .map((entry: ScheduleEntry) => {
        const dayLabels: Record<string, string> = {
          monday: 'Lunes',
          tuesday: 'Martes',
          wednesday: 'Miércoles',
          thursday: 'Jueves',
          friday: 'Viernes',
          saturday: 'Sábado',
          sunday: 'Domingo',
        };
        const dayLabel = dayLabels[entry.day] || entry.day;
        return `${dayLabel} ${entry.startTime}-${entry.endTime}`;
      })
      .join(', ');

    // Find earliest start time and latest end time across all schedule entries
    const startTimes = horario.map((e: ScheduleEntry) => e.startTime);
    const endTimes = horario.map((e: ScheduleEntry) => e.endTime);

    const earliestStart = startTimes.sort()[0] || '09:00:00';
    const latestEnd = endTimes.sort().reverse()[0] || '14:00:00';

    // Crear convocatoria en Payload
    const convocation = await payload.create({
      collection: 'course-runs' as any,
      data: {
        course: parseInt(courseId),
        start_date: fechaInicio,
        end_date: fechaFin,
        schedule_days: horario.map((e: ScheduleEntry) => e.day), // Array de días (english weekdays)
        schedule_time_start: earliestStart, // Earliest start time across all days
        schedule_time_end: latestEnd, // Latest end time across all days
        status: estado === 'abierta' ? 'enrollment_open' : 'draft' as any,
        min_students: 5, // Valor por defecto
        max_students: plazasTotales,
        current_enrollments: 0,
        price_override: precio > 0 ? precio : undefined, // Use price_override instead of base_price
        // TODO: Agregar campos de profesor, sede, aula cuando estén disponibles
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: convocation.id,
        courseId: course.id,
        courseName: course.name,
      },
      message: `Convocatoria creada exitosamente`,
    });
  } catch (error: any) {
    console.error('Error creating convocation:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al crear convocatoria',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/convocatorias?courseId=X
 *
 * Lista convocatorias de un curso
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'courseId requerido' },
        { status: 400 }
      );
    }

    const payload = await getPayloadHMR({ config: configPromise });

    const convocations = await payload.find({
      collection: 'course-runs' as any,
      where: {
        course: {
          equals: parseInt(courseId),
        },
      },
      limit: 100,
      sort: '-start_date',
    });

    return NextResponse.json({
      success: true,
      data: convocations.docs.map((conv: any) => ({
        id: conv.id,
        fechaInicio: conv.start_date,
        fechaFin: conv.end_date,
        horario: `${conv.schedule_days?.join(', ')} ${conv.schedule_time_start}-${conv.schedule_time_end}`,
        estado: conv.status,
        plazasTotales: conv.max_students,
        plazasOcupadas: conv.current_enrollments,
        precio: conv.price_override || 0,
      })),
      total: convocations.totalDocs,
    });
  } catch (error) {
    console.error('Error fetching convocations:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener convocatorias' },
      { status: 500 }
    );
  }
}
