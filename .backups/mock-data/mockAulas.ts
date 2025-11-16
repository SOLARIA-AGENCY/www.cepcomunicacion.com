export interface Aula {
  id: string
  nombre: string
  codigo: string
  sede: string
  capacidad: number
  tipo: 'teoria' | 'laboratorio' | 'taller' | 'seminario'
  equipamiento: string[]
}

export const aulasMockData: Aula[] = [
  // CEP Norte
  {
    id: 'aula-a1',
    nombre: 'Aula A1',
    codigo: 'A1',
    sede: 'CEP Norte',
    capacidad: 30,
    tipo: 'teoria',
    equipamiento: ['Proyector', 'Pizarra digital', 'Aire acondicionado'],
  },
  {
    id: 'lab-inf-1',
    nombre: 'Lab Informática 1',
    codigo: 'LAB-INF-01',
    sede: 'CEP Norte',
    capacidad: 20,
    tipo: 'laboratorio',
    equipamiento: ['20 ordenadores', 'Proyector', 'Software desarrollo'],
  },
  {
    id: 'lab-diseno-1',
    nombre: 'Lab Diseño 1',
    codigo: 'LAB-DIS-01',
    sede: 'CEP Norte',
    capacidad: 15,
    tipo: 'laboratorio',
    equipamiento: ['15 iMac', 'Adobe Creative Suite', 'Tabletas gráficas'],
  },
  {
    id: 'aula-b1',
    nombre: 'Aula B1',
    codigo: 'B1',
    sede: 'CEP Norte',
    capacidad: 25,
    tipo: 'teoria',
    equipamiento: ['Proyector', 'Sistema de audio'],
  },

  // CEP Sur
  {
    id: 'lab-inf-2',
    nombre: 'Lab Informática 2',
    codigo: 'LAB-INF-02',
    sede: 'CEP Sur',
    capacidad: 18,
    tipo: 'laboratorio',
    equipamiento: ['18 ordenadores', 'Proyector', 'Software desarrollo'],
  },
  {
    id: 'aula-c1',
    nombre: 'Aula C1',
    codigo: 'C1',
    sede: 'CEP Sur',
    capacidad: 25,
    tipo: 'teoria',
    equipamiento: ['Proyector', 'Pizarra digital'],
  },

  // CEP Santa Cruz
  {
    id: 'aula-b1-sc',
    nombre: 'Aula B1',
    codigo: 'B1',
    sede: 'CEP Santa Cruz',
    capacidad: 32,
    tipo: 'teoria',
    equipamiento: ['Proyector', 'Sistema de audio', 'Aire acondicionado'],
  },
  {
    id: 'estudio-foto',
    nombre: 'Estudio Fotográfico',
    codigo: 'EST-FOTO',
    sede: 'CEP Santa Cruz',
    capacidad: 12,
    tipo: 'taller',
    equipamiento: ['Equipos de iluminación', 'Fondos fotográficos', 'Cámaras profesionales'],
  },
]

export interface HorarioDetallado {
  id: string
  convocatoria_id: string
  curso_nombre: string
  codigo_curso: string
  aula_id: string
  profesor: string
  dia: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado'
  hora_inicio: string // "09:00"
  hora_fin: string // "11:00"
  duracion_minutos: number
  estado: 'planificada' | 'abierta' | 'en_curso' | 'completada' | 'cancelada'
  tiene_conflicto: boolean
  color: string
}

export const horariosDetalladosMock: HorarioDetallado[] = [
  // Marketing Digital Avanzado - Aula A1 (CEP Norte)
  {
    id: 'h1-l',
    convocatoria_id: '1',
    curso_nombre: 'Marketing Digital Avanzado',
    codigo_curso: 'MKT-ADV-001',
    aula_id: 'aula-a1',
    profesor: 'Juan García',
    dia: 'lunes',
    hora_inicio: '09:00',
    hora_fin: '11:00',
    duracion_minutos: 120,
    estado: 'en_curso',
    tiene_conflicto: false,
    color: '#ff2014',
  },
  {
    id: 'h1-x',
    convocatoria_id: '1',
    curso_nombre: 'Marketing Digital Avanzado',
    codigo_curso: 'MKT-ADV-001',
    aula_id: 'aula-a1',
    profesor: 'Juan García',
    dia: 'miercoles',
    hora_inicio: '09:00',
    hora_fin: '11:00',
    duracion_minutos: 120,
    estado: 'en_curso',
    tiene_conflicto: false,
    color: '#ff2014',
  },
  {
    id: 'h1-v',
    convocatoria_id: '1',
    curso_nombre: 'Marketing Digital Avanzado',
    codigo_curso: 'MKT-ADV-001',
    aula_id: 'aula-a1',
    profesor: 'Juan García',
    dia: 'viernes',
    hora_inicio: '09:00',
    hora_fin: '11:00',
    duracion_minutos: 120,
    estado: 'en_curso',
    tiene_conflicto: false,
    color: '#ff2014',
  },

  // SEO y Posicionamiento Web - Lab Informática 1 (CEP Norte)
  {
    id: 'h2-m',
    convocatoria_id: '2',
    curso_nombre: 'SEO y Posicionamiento Web',
    codigo_curso: 'SEO-001',
    aula_id: 'lab-inf-1',
    profesor: 'María López',
    dia: 'martes',
    hora_inicio: '10:00',
    hora_fin: '12:00',
    duracion_minutos: 120,
    estado: 'abierta',
    tiene_conflicto: false,
    color: '#10b981',
  },
  {
    id: 'h2-j',
    convocatoria_id: '2',
    curso_nombre: 'SEO y Posicionamiento Web',
    codigo_curso: 'SEO-001',
    aula_id: 'lab-inf-1',
    profesor: 'María López',
    dia: 'jueves',
    hora_inicio: '10:00',
    hora_fin: '12:00',
    duracion_minutos: 120,
    estado: 'abierta',
    tiene_conflicto: false,
    color: '#10b981',
  },

  // Community Manager - Aula A1 (CONFLICTO con Marketing Digital en miércoles)
  {
    id: 'h3-l',
    convocatoria_id: '3',
    curso_nombre: 'Community Manager',
    codigo_curso: 'CMM-PRO-001',
    aula_id: 'aula-a1',
    profesor: 'Juan García',
    dia: 'lunes',
    hora_inicio: '16:00',
    hora_fin: '18:00',
    duracion_minutos: 120,
    estado: 'planificada',
    tiene_conflicto: false,
    color: '#3b82f6',
  },
  {
    id: 'h3-x-conflicto',
    convocatoria_id: '3',
    curso_nombre: 'Community Manager',
    codigo_curso: 'CMM-PRO-001',
    aula_id: 'aula-a1',
    profesor: 'Juan García',
    dia: 'miercoles',
    hora_inicio: '10:00', // CONFLICTO: Aula A1 tiene Marketing 09:00-11:00
    hora_fin: '12:00',
    duracion_minutos: 120,
    estado: 'planificada',
    tiene_conflicto: true,
    color: '#f97316',
  },

  // Desarrollo de Aplicaciones Web - Lab Informática 2 (CEP Sur)
  {
    id: 'h4-l',
    convocatoria_id: '4',
    curso_nombre: 'Desarrollo Web',
    codigo_curso: 'DAW-001',
    aula_id: 'lab-inf-2',
    profesor: 'Ana Ruiz',
    dia: 'lunes',
    hora_inicio: '16:00',
    hora_fin: '18:00',
    duracion_minutos: 120,
    estado: 'en_curso',
    tiene_conflicto: false,
    color: '#ff2014',
  },
  {
    id: 'h4-m',
    convocatoria_id: '4',
    curso_nombre: 'Desarrollo Web',
    codigo_curso: 'DAW-001',
    aula_id: 'lab-inf-2',
    profesor: 'Ana Ruiz',
    dia: 'martes',
    hora_inicio: '16:00',
    hora_fin: '18:00',
    duracion_minutos: 120,
    estado: 'en_curso',
    tiene_conflicto: false,
    color: '#ff2014',
  },
  {
    id: 'h4-x',
    convocatoria_id: '4',
    curso_nombre: 'Desarrollo Web',
    codigo_curso: 'DAW-001',
    aula_id: 'lab-inf-2',
    profesor: 'Ana Ruiz',
    dia: 'miercoles',
    hora_inicio: '16:00',
    hora_fin: '18:00',
    duracion_minutos: 120,
    estado: 'en_curso',
    tiene_conflicto: false,
    color: '#ff2014',
  },

  // Administración y Finanzas - Aula B1 (CEP Santa Cruz)
  {
    id: 'h5-m',
    convocatoria_id: '5',
    curso_nombre: 'Administración y Finanzas',
    codigo_curso: 'ADMIN-FIN-001',
    aula_id: 'aula-b1-sc',
    profesor: 'Luis Sánchez',
    dia: 'martes',
    hora_inicio: '12:00',
    hora_fin: '14:00',
    duracion_minutos: 120,
    estado: 'planificada',
    tiene_conflicto: false,
    color: '#3b82f6',
  },
  {
    id: 'h5-j',
    convocatoria_id: '5',
    curso_nombre: 'Administración y Finanzas',
    codigo_curso: 'ADMIN-FIN-001',
    aula_id: 'aula-b1-sc',
    profesor: 'Luis Sánchez',
    dia: 'jueves',
    hora_inicio: '12:00',
    hora_fin: '14:00',
    duracion_minutos: 120,
    estado: 'planificada',
    tiene_conflicto: false,
    color: '#3b82f6',
  },

  // Diseño Gráfico - Lab Diseño 1 (CEP Norte)
  {
    id: 'h6-l',
    convocatoria_id: '6',
    curso_nombre: 'Diseño Gráfico',
    codigo_curso: 'DGD-001',
    aula_id: 'lab-diseno-1',
    profesor: 'Carmen Díaz',
    dia: 'lunes',
    hora_inicio: '14:00',
    hora_fin: '16:00',
    duracion_minutos: 120,
    estado: 'completada',
    tiene_conflicto: false,
    color: '#6b7280',
  },
  {
    id: 'h6-x',
    convocatoria_id: '6',
    curso_nombre: 'Diseño Gráfico',
    codigo_curso: 'DGD-001',
    aula_id: 'lab-diseno-1',
    profesor: 'Carmen Díaz',
    dia: 'miercoles',
    hora_inicio: '14:00',
    hora_fin: '16:00',
    duracion_minutos: 120,
    estado: 'completada',
    tiene_conflicto: false,
    color: '#6b7280',
  },
  {
    id: 'h6-v',
    convocatoria_id: '6',
    curso_nombre: 'Diseño Gráfico',
    codigo_curso: 'DGD-001',
    aula_id: 'lab-diseno-1',
    profesor: 'Carmen Díaz',
    dia: 'viernes',
    hora_inicio: '14:00',
    hora_fin: '16:00',
    duracion_minutos: 120,
    estado: 'completada',
    tiene_conflicto: false,
    color: '#6b7280',
  },

  // Fotografía Profesional - Estudio Fotográfico (CEP Santa Cruz) - Sábado
  {
    id: 'h8-s',
    convocatoria_id: '8',
    curso_nombre: 'Fotografía Profesional',
    codigo_curso: 'FOTO-PRO-001',
    aula_id: 'estudio-foto',
    profesor: 'Laura Fernández',
    dia: 'sabado',
    hora_inicio: '10:00',
    hora_fin: '14:00',
    duracion_minutos: 240,
    estado: 'abierta',
    tiene_conflicto: false,
    color: '#10b981',
  },

  // Aula B1 (CEP Norte) - Horario tarde
  {
    id: 'h-extra-1',
    convocatoria_id: 'extra-1',
    curso_nombre: 'Excel Avanzado',
    codigo_curso: 'EXC-ADV-001',
    aula_id: 'aula-b1',
    profesor: 'Pedro Gómez',
    dia: 'martes',
    hora_inicio: '18:00',
    hora_fin: '20:00',
    duracion_minutos: 120,
    estado: 'en_curso',
    tiene_conflicto: false,
    color: '#ff2014',
  },
  {
    id: 'h-extra-2',
    convocatoria_id: 'extra-1',
    curso_nombre: 'Excel Avanzado',
    codigo_curso: 'EXC-ADV-001',
    aula_id: 'aula-b1',
    profesor: 'Pedro Gómez',
    dia: 'jueves',
    hora_inicio: '18:00',
    hora_fin: '20:00',
    duracion_minutos: 120,
    estado: 'en_curso',
    tiene_conflicto: false,
    color: '#ff2014',
  },
]
