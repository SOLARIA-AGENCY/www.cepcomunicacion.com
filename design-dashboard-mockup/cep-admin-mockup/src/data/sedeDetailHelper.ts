// ============================================================================
// FUNCIÓN HELPER: Get Sede Detalle
// ============================================================================

import type { SedeDetalle, Aula, PersonalSede, AlumnoSede, EstadisticasSede } from '@/types/sedes'
import { instanciasData } from './mockData'

export function getSedeDetalle(sedeId: string): SedeDetalle | undefined {
  // Mapear IDs de rutas a IDs de sedes en mockData
  const sedeIdMap: Record<string, string> = {
    'cep-norte': 'sede-norte',
    'cep-santa-cruz': 'sede-santa-cruz',
    'cep-sur': 'sede-sur',
  }

  const mappedSedeId = sedeIdMap[sedeId] || sedeId

  // Encontrar instancias de la sede
  const instanciasSede = instanciasData.filter(i => i.sedeId === mappedSedeId)

  // Mock data según la sede
  const sedesDetalle: Record<string, SedeDetalle> = {
    'sede-norte': {
      id: 'sede-norte',
      codigo: 'NORTE',
      nombre: 'CEP Norte',
      descripcion: 'Centro de formación profesional en la zona norte de Tenerife',
      activa: true,
      direccion: 'Calle La Marina, 57',
      ciudad: 'Santa Cruz de Tenerife',
      provincia: 'Santa Cruz de Tenerife',
      codigoPostal: '38001',
      latitud: 28.4682,
      longitud: -16.2546,
      telefono: '+34 922 123 456',
      email: 'norte@cepcomunicacion.com',
      sitioWeb: 'https://www.cepcomunicacion.com/sedes/norte',
      horarioAtencion: 'Lunes a Viernes: 8:00 - 20:00',
      responsable: {
        id: 'resp-norte',
        nombre: 'Ana García Martínez',
        cargo: 'Directora',
        email: 'ana.garcia@cepcomunicacion.com',
        telefono: '+34 922 123 450',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      instalaciones: [
        { id: 'inst-1', nombre: 'Biblioteca', categoria: 'Espacios comunes' },
        { id: 'inst-2', nombre: 'Cafetería', categoria: 'Espacios comunes' },
        { id: 'inst-3', nombre: 'Sala de informática', categoria: 'Aulas especializadas' },
      ],
      imagenPrincipal: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      cantidadAulas: 12,
      cantidadPersonal: 18,
      cantidadAlumnos: 245,
      cantidadCursosActivos: instanciasSede.filter(i => i.estado === 'abierta' || i.estado === 'en_curso').length,

      // Data adicional
      aulas: generateAulasMock('norte', 12),
      personal: generatePersonalMock('norte', 18),
      alumnos: generateAlumnosMock('norte', 245),
      instanciasCursos: instanciasSede,
      estadisticas: generateEstadisticasMock(instanciasSede),
    },
    'sede-santa-cruz': {
      id: 'sede-santa-cruz',
      codigo: 'SC',
      nombre: 'CEP Santa Cruz',
      descripcion: 'Centro principal en Santa Cruz de Tenerife',
      activa: true,
      direccion: 'Avenida Tres de Mayo, 71',
      ciudad: 'Santa Cruz de Tenerife',
      provincia: 'Santa Cruz de Tenerife',
      codigoPostal: '38005',
      latitud: 28.4636,
      longitud: -16.2518,
      telefono: '+34 922 234 567',
      email: 'santacruz@cepcomunicacion.com',
      sitioWeb: 'https://www.cepcomunicacion.com/sedes/santa-cruz',
      horarioAtencion: 'Lunes a Viernes: 8:00 - 21:00',
      responsable: {
        id: 'resp-sc',
        nombre: 'Carlos Rodríguez López',
        cargo: 'Director',
        email: 'carlos.rodriguez@cepcomunicacion.com',
        telefono: '+34 922 234 560',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      instalaciones: [
        { id: 'inst-sc-1', nombre: 'Auditorio', categoria: 'Espacios comunes' },
        { id: 'inst-sc-2', nombre: 'Laboratorio multimedia', categoria: 'Aulas especializadas' },
        { id: 'inst-sc-3', nombre: 'Sala de reuniones', categoria: 'Espacios comunes' },
      ],
      imagenPrincipal: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
      cantidadAulas: 15,
      cantidadPersonal: 22,
      cantidadAlumnos: 320,
      cantidadCursosActivos: instanciasSede.filter(i => i.estado === 'abierta' || i.estado === 'en_curso').length,

      aulas: generateAulasMock('santa-cruz', 15),
      personal: generatePersonalMock('santa-cruz', 22),
      alumnos: generateAlumnosMock('santa-cruz', 320),
      instanciasCursos: instanciasSede,
      estadisticas: generateEstadisticasMock(instanciasSede),
    },
    'sede-sur': {
      id: 'sede-sur',
      codigo: 'SUR',
      nombre: 'CEP Sur',
      descripcion: 'Centro de formación en la zona sur de Tenerife',
      activa: true,
      direccion: 'Calle El Jable, 33',
      ciudad: 'Arona',
      provincia: 'Santa Cruz de Tenerife',
      codigoPostal: '38640',
      latitud: 28.0997,
      longitud: -16.6809,
      telefono: '+34 922 345 678',
      email: 'sur@cepcomunicacion.com',
      sitioWeb: 'https://www.cepcomunicacion.com/sedes/sur',
      horarioAtencion: 'Lunes a Viernes: 9:00 - 20:00',
      responsable: {
        id: 'resp-sur',
        nombre: 'María López Sánchez',
        cargo: 'Coordinadora',
        email: 'maria.lopez@cepcomunicacion.com',
        telefono: '+34 922 345 670',
        avatar: 'https://i.pravatar.cc/150?img=9',
      },
      instalaciones: [
        { id: 'inst-sur-1', nombre: 'Sala de estudio', categoria: 'Espacios comunes' },
        { id: 'inst-sur-2', nombre: 'Taller práctico', categoria: 'Aulas especializadas' },
      ],
      imagenPrincipal: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      cantidadAulas: 10,
      cantidadPersonal: 14,
      cantidadAlumnos: 180,
      cantidadCursosActivos: instanciasSede.filter(i => i.estado === 'abierta' || i.estado === 'en_curso').length,

      aulas: generateAulasMock('sur', 10),
      personal: generatePersonalMock('sur', 14),
      alumnos: generateAlumnosMock('sur', 180),
      instanciasCursos: instanciasSede,
      estadisticas: generateEstadisticasMock(instanciasSede),
    },
  }

  return sedesDetalle[mappedSedeId]
}

// Helper functions
function generateAulasMock(sede: string, cantidad: number): Aula[] {
  const aulas: Aula[] = []
  for (let i = 0; i < cantidad; i++) {
    aulas.push({
      id: `aula-${sede}-${i + 1}`,
      nombre: `Aula ${String.fromCharCode(65 + i)}`,
      codigo: `${sede.toUpperCase()}-${String.fromCharCode(65 + i)}`,
      capacidad: 20 + Math.floor(Math.random() * 20),
      disponible: Math.random() > 0.3,
      metrosCuadrados: 40 + Math.floor(Math.random() * 30),
      planta: i < cantidad / 2 ? 'Planta Baja' : 'Primera Planta',
      equipamiento: ['Proyector', 'Pizarra digital', 'Ordenadores', 'WiFi'],
      cursoActual: Math.random() > 0.5 ? {
        nombre: 'Marketing Digital',
        horario: '9:00 - 13:00',
      } : null,
    })
  }
  return aulas
}

function generatePersonalMock(sede: string, cantidad: number): PersonalSede[] {
  const personal: PersonalSede[] = []
  const roles: Array<'profesor' | 'administrativo' | 'coordinador' | 'mantenimiento'> =
    ['profesor', 'administrativo', 'coordinador', 'mantenimiento']

  for (let i = 0; i < cantidad; i++) {
    const rol = roles[Math.floor(Math.random() * roles.length)]
    personal.push({
      id: `personal-${sede}-${i + 1}`,
      nombre: `Persona ${i + 1}`,
      rol,
      email: `persona${i + 1}@cepcomunicacion.com`,
      telefono: `+34 922 ${Math.floor(100000 + Math.random() * 900000)}`,
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
      especialidad: rol === 'profesor' ? 'Marketing Digital' : undefined,
      horario: 'L-V 9:00-17:00',
      cursosAsignados: rol === 'profesor' ? Math.floor(Math.random() * 5) : undefined,
      activo: true,
    })
  }
  return personal
}

function generateAlumnosMock(sede: string, cantidad: number): AlumnoSede[] {
  const alumnos: AlumnoSede[] = []
  const estados: Array<'activo' | 'graduado' | 'baja'> = ['activo', 'graduado', 'baja']
  const estadosPago: Array<'pagado' | 'pendiente' | 'parcial'> = ['pagado', 'pendiente', 'parcial']

  for (let i = 0; i < cantidad; i++) {
    alumnos.push({
      id: `alumno-${sede}-${i + 1}`,
      nombre: `Alumno ${i + 1}`,
      email: `alumno${i + 1}@example.com`,
      telefono: `+34 ${Math.floor(600000000 + Math.random() * 99999999)}`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 50) + 1}`,
      cursoActual: {
        id: `curso-${i + 1}`,
        nombre: 'Marketing Digital',
      },
      fechaMatricula: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      estadoPago: estadosPago[Math.floor(Math.random() * estadosPago.length)],
      porcentajeAsistencia: 60 + Math.floor(Math.random() * 40),
      estado: estados[Math.floor(Math.random() * estados.length)],
    })
  }
  return alumnos
}

function generateEstadisticasMock(instancias: any[]): EstadisticasSede {
  const cursosActivos = instancias.filter(i => i.estado === 'abierta' || i.estado === 'en_curso').length
  const totalPlazas = instancias.reduce((acc, i) => acc + i.plazasTotales, 0)
  const plazasOcupadas = instancias.reduce((acc, i) => acc + i.plazasOcupadas, 0)

  return {
    tasaOcupacion: totalPlazas > 0 ? Math.round((plazasOcupadas / totalPlazas) * 100) : 0,
    satisfaccion: 85 + Math.floor(Math.random() * 10),
    tasaFinalizacion: 80 + Math.floor(Math.random() * 15),
    ingresosMensuales: 25000 + Math.floor(Math.random() * 20000),
    total: 200 + Math.floor(Math.random() * 100),
    activos: 150 + Math.floor(Math.random() * 80),
    nuevosMes: 10 + Math.floor(Math.random() * 20),
    graduados: 50 + Math.floor(Math.random() * 30),
    cursosActivos,
    proximasConvocatorias: Math.floor(Math.random() * 10),
    alumnosTotales: plazasOcupadas,
    ocupacionMedia: totalPlazas > 0 ? Math.round((plazasOcupadas / totalPlazas) * 100) : 0,
  }
}
