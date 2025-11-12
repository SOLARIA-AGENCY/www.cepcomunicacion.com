import { CicloPlantilla, CursoCiclo, InstanciaGrado, CicloDetalleView } from '@/types'

// ==========================================
// CURSOS DE CICLO (SUPEDITADOS)
// ==========================================

const CURSOS_AUDIOVISUALES: CursoCiclo[] = [
  {
    id: 'cc-1',
    ciclo_plantilla_id: 'ciclo-1',
    nombre: 'Fundamentos de la Producción Audiovisual',
    codigo: 'GSAE-FPA',
    descripcion: 'Introducción a los procesos de producción audiovisual, desde la preproducción hasta la distribución.',
    duracion_horas: 160,
    orden: 1,
    objetivos: [
      'Comprender el flujo de trabajo de producción audiovisual',
      'Identificar roles y responsabilidades en un equipo de producción',
      'Gestionar recursos y presupuestos básicos'
    ],
    contenidos: [
      'Historia del cine y la televisión',
      'Fases de producción audiovisual',
      'Gestión de equipos y recursos',
      'Planificación de rodajes'
    ]
  },
  {
    id: 'cc-2',
    ciclo_plantilla_id: 'ciclo-1',
    nombre: 'Técnicas de Realización y Dirección',
    codigo: 'GSAE-TRD',
    descripcion: 'Técnicas avanzadas de dirección cinematográfica y televisiva, lenguaje audiovisual y narrativa.',
    duracion_horas: 180,
    orden: 2,
    objetivos: [
      'Dominar el lenguaje audiovisual',
      'Aplicar técnicas de dirección de actores',
      'Desarrollar proyectos audiovisuales completos'
    ],
    contenidos: [
      'Teoría del montaje y composición',
      'Dirección de actores',
      'Diseño de producción',
      'Storyboarding y planificación visual'
    ]
  },
  {
    id: 'cc-3',
    ciclo_plantilla_id: 'ciclo-1',
    nombre: 'Postproducción y Edición Digital',
    codigo: 'GSAE-PED',
    descripcion: 'Edición de vídeo, corrección de color, sonido y efectos visuales con software profesional.',
    duracion_horas: 200,
    orden: 3,
    objetivos: [
      'Dominar herramientas de edición profesional (Premiere, DaVinci)',
      'Aplicar técnicas de corrección de color',
      'Integrar efectos visuales y sonido'
    ],
    contenidos: [
      'Adobe Premiere Pro avanzado',
      'DaVinci Resolve (edición y color)',
      'After Effects para motion graphics',
      'Diseño sonoro y mezcla'
    ]
  }
]

const CURSOS_COMERCIO: CursoCiclo[] = [
  {
    id: 'cc-4',
    ciclo_plantilla_id: 'ciclo-2',
    nombre: 'Técnicas de Venta y Negociación',
    codigo: 'GMCI-TVN',
    descripcion: 'Estrategias de venta, negociación comercial y atención al cliente.',
    duracion_horas: 120,
    orden: 1,
    objetivos: [
      'Aplicar técnicas de venta consultiva',
      'Negociar acuerdos comerciales',
      'Gestionar objeciones del cliente'
    ],
    contenidos: [
      'Psicología de la venta',
      'Técnicas de negociación',
      'Cierre de ventas',
      'Fidelización de clientes'
    ]
  },
  {
    id: 'cc-5',
    ciclo_plantilla_id: 'ciclo-2',
    nombre: 'Gestión de Inventarios y Logística',
    codigo: 'GMCI-GIL',
    descripcion: 'Control de stocks, gestión de almacenes y optimización de la cadena de suministro.',
    duracion_horas: 100,
    orden: 2,
    objetivos: [
      'Optimizar niveles de inventario',
      'Gestionar sistemas de almacenaje',
      'Coordinar procesos logísticos'
    ],
    contenidos: [
      'Sistemas de gestión de inventarios',
      'Métodos de almacenaje',
      'Logística de distribución',
      'Software ERP básico'
    ]
  }
]

// ==========================================
// CICLOS PLANTILLA
// ==========================================

export const CICLOS_PLANTILLA_MOCK: CicloPlantilla[] = [
  {
    id: 'ciclo-1',
    nombre: 'Grado Superior en Audiovisuales y Espectáculos',
    codigo: 'GSAE',
    tipo: 'superior',
    familia_profesional: 'Comunicación, Imagen y Sonido',
    descripcion: 'Formación completa en producción audiovisual, realización cinematográfica y televisiva, y gestión de proyectos multimedia.',
    objetivos: [
      'Planificar y gestionar producciones audiovisuales',
      'Dirigir proyectos cinematográficos y televisivos',
      'Aplicar técnicas de postproducción digital',
      'Coordinar equipos técnicos y artísticos'
    ],
    perfil_profesional: 'Técnico Superior en Realización de Proyectos Audiovisuales y Espectáculos, capacitado para trabajar en productoras, televisiones, agencias de publicidad y empresas de eventos.',
    duracion_total_horas: 2000,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    color: 'bg-purple-600',
    cursos: CURSOS_AUDIOVISUALES,
    total_instancias: 4,
    instancias_activas: 2,
    total_alumnos: 78,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2025-06-01T00:00:00Z'
  },
  {
    id: 'ciclo-2',
    nombre: 'Grado Medio en Actividades Comerciales',
    codigo: 'GMCI',
    tipo: 'medio',
    familia_profesional: 'Comercio y Marketing',
    descripcion: 'Formación en técnicas de venta, gestión comercial, atención al cliente y organización de establecimientos.',
    objetivos: [
      'Realizar operaciones de venta de productos y servicios',
      'Gestionar stocks e inventarios',
      'Organizar el punto de venta',
      'Aplicar técnicas de merchandising'
    ],
    perfil_profesional: 'Técnico en Actividades Comerciales, preparado para trabajar en comercios minoristas, grandes superficies, departamentos comerciales y empresas de distribución.',
    duracion_total_horas: 1400,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    color: 'bg-blue-600',
    cursos: CURSOS_COMERCIO,
    total_instancias: 6,
    instancias_activas: 3,
    total_alumnos: 124,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2025-06-01T00:00:00Z'
  },
  {
    id: 'ciclo-3',
    nombre: 'Grado Superior en Marketing y Publicidad',
    codigo: 'GSMP',
    tipo: 'superior',
    familia_profesional: 'Comercio y Marketing',
    descripcion: 'Formación avanzada en estrategias de marketing digital, publicidad online, redes sociales y analítica web.',
    objetivos: [
      'Diseñar campañas de marketing digital',
      'Gestionar redes sociales corporativas',
      'Analizar métricas y KPIs de marketing',
      'Crear contenido publicitario multiplataforma'
    ],
    perfil_profesional: 'Técnico Superior en Marketing y Publicidad, con competencias para trabajar en agencias de publicidad, departamentos de marketing y empresas digitales.',
    duracion_total_horas: 2000,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    color: 'bg-pink-600',
    cursos: [], // Añadir cursos si es necesario
    total_instancias: 3,
    instancias_activas: 2,
    total_alumnos: 56,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2025-06-01T00:00:00Z'
  }
]

// ==========================================
// INSTANCIAS DE GRADO (CONVOCATORIAS)
// ==========================================

export const INSTANCIAS_GRADO_MOCK: InstanciaGrado[] = [
  // Audiovisuales - Instancia 1
  {
    id: 'inst-1',
    ciclo_plantilla_id: 'ciclo-1',
    ciclo_plantilla: CICLOS_PLANTILLA_MOCK[0],
    nombre_convocatoria: 'Septiembre 2025 - Turno Mañana',
    codigo_convocatoria: 'GSAE-SEP25-M',
    campus: { id: 'sede-1', name: 'CEP Norte' },
    aula: { id: 'aula-1', nombre: 'Aula Multimedia 1' },
    fecha_inicio: '2025-09-15',
    fecha_fin: '2027-06-30',
    horario: 'Lunes a Viernes 9:00-14:00',
    turno: 'mañana',
    precio: 4500,
    plazas_totales: 25,
    plazas_ocupadas: 22,
    lista_espera: 8,
    estado: 'abierta',
    profesores: [
      { id: 'prof-1', nombre: 'Carlos Ruiz', foto: 'https://i.pravatar.cc/150?img=12', asignatura: 'Fundamentos' },
      { id: 'prof-2', nombre: 'Ana Torres', foto: 'https://i.pravatar.cc/150?img=5', asignatura: 'Realización' }
    ],
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-06-10T00:00:00Z'
  },
  // Audiovisuales - Instancia 2
  {
    id: 'inst-2',
    ciclo_plantilla_id: 'ciclo-1',
    ciclo_plantilla: CICLOS_PLANTILLA_MOCK[0],
    nombre_convocatoria: 'Enero 2026 - Turno Tarde',
    codigo_convocatoria: 'GSAE-ENE26-T',
    campus: { id: 'sede-3', name: 'CEP Sur' },
    aula: { id: 'aula-5', nombre: 'Estudio de Grabación' },
    fecha_inicio: '2026-01-15',
    fecha_fin: '2027-12-20',
    horario: 'Lunes a Viernes 15:00-20:00',
    turno: 'tarde',
    precio: 4500,
    plazas_totales: 20,
    plazas_ocupadas: 15,
    lista_espera: 3,
    estado: 'planificada',
    profesores: [
      { id: 'prof-3', nombre: 'Miguel Sánchez', foto: 'https://i.pravatar.cc/150?img=8' }
    ],
    created_at: '2025-04-15T00:00:00Z',
    updated_at: '2025-06-01T00:00:00Z'
  },
  // Comercio - Instancia 1
  {
    id: 'inst-3',
    ciclo_plantilla_id: 'ciclo-2',
    ciclo_plantilla: CICLOS_PLANTILLA_MOCK[1],
    nombre_convocatoria: 'Septiembre 2025 - Presencial',
    codigo_convocatoria: 'GMCI-SEP25-P',
    campus: { id: 'sede-2', name: 'CEP Santa Cruz' },
    fecha_inicio: '2025-09-10',
    fecha_fin: '2026-06-25',
    horario: 'Lunes a Viernes 9:00-13:00',
    turno: 'mañana',
    precio: 2800,
    plazas_totales: 30,
    plazas_ocupadas: 28,
    lista_espera: 12,
    estado: 'en_curso',
    profesores: [
      { id: 'prof-4', nombre: 'Laura Gómez', foto: 'https://i.pravatar.cc/150?img=9' }
    ],
    created_at: '2025-02-20T00:00:00Z',
    updated_at: '2025-06-08T00:00:00Z'
  }
]

// ==========================================
// VISTA DE DETALLE (CON INSTANCIAS CARGADAS)
// ==========================================

export const CICLOS_DETALLE_MOCK: CicloDetalleView[] = CICLOS_PLANTILLA_MOCK.map((ciclo) => ({
  ...ciclo,
  instancias: INSTANCIAS_GRADO_MOCK.filter((inst) => inst.ciclo_plantilla_id === ciclo.id),
  alumnos_actuales: ciclo.total_alumnos,
  tasa_empleabilidad: ciclo.id === 'ciclo-1' ? 87 : ciclo.id === 'ciclo-2' ? 72 : 81,
  salidas_profesionales: ciclo.id === 'ciclo-1'
    ? [
        'Realizador audiovisual',
        'Editor de vídeo',
        'Director de fotografía',
        'Productor ejecutivo',
        'Técnico de sonido'
      ]
    : ciclo.id === 'ciclo-2'
    ? [
        'Vendedor técnico comercial',
        'Responsable de tienda',
        'Jefe de sección',
        'Promotor de ventas'
      ]
    : [
        'Especialista en marketing digital',
        'Community manager',
        'Analista de datos',
        'Gestor de campañas online'
      ]
}))
