import type {
  Course,
  Convocation,
  Campus,
  Classroom,
  Teacher,
  Student,
  Lead,
  Campaign,
  DashboardMetrics,
} from "../types"

// Dashboard Metrics
export const dashboardMetrics: DashboardMetrics = {
  total_courses: 48,
  active_courses: 32,
  total_students: 1247,
  active_students: 856,
  total_leads: 2341,
  leads_this_month: 187,
  conversion_rate: 34.5,
  total_revenue: 487650,
  active_convocations: 18,
  total_teachers: 45,
  total_campuses: 5,
  classroom_utilization: 78.5,
}

// Campuses
export const campuses: Campus[] = [
  {
    id: "1",
    name: "CEP Madrid Centro",
    address: "Calle Gran Vía, 45",
    city: "Madrid",
    postal_code: "28013",
    phone: "+34 91 123 4567",
    email: "madrid@cepcomunicacion.com",
    active: true,
    classrooms_count: 8,
  },
  {
    id: "2",
    name: "CEP Barcelona",
    address: "Avinguda Diagonal, 123",
    city: "Barcelona",
    postal_code: "08028",
    phone: "+34 93 456 7890",
    email: "barcelona@cepcomunicacion.com",
    active: true,
    classrooms_count: 6,
  },
  {
    id: "3",
    name: "CEP Valencia",
    address: "Calle Colón, 67",
    city: "Valencia",
    postal_code: "46004",
    phone: "+34 96 789 0123",
    email: "valencia@cepcomunicacion.com",
    active: true,
    classrooms_count: 5,
  },
  {
    id: "4",
    name: "CEP Sevilla",
    address: "Avenida de la Constitución, 89",
    city: "Sevilla",
    postal_code: "41001",
    phone: "+34 95 234 5678",
    email: "sevilla@cepcomunicacion.com",
    active: true,
    classrooms_count: 4,
  },
  {
    id: "5",
    name: "CEP Online Campus",
    address: "Campus Virtual",
    city: "Madrid",
    postal_code: "28000",
    phone: "+34 91 000 0000",
    email: "online@cepcomunicacion.com",
    active: true,
    classrooms_count: 0,
  },
]

// Classrooms
export const classrooms: Classroom[] = [
  {
    id: "1",
    name: "Aula 101",
    campus_id: "1",
    campus_name: "CEP Madrid Centro",
    capacity: 25,
    equipment: ["Proyector", "Pizarra Digital", "Audio", "Cámaras"],
    active: true,
  },
  {
    id: "2",
    name: "Aula 102",
    campus_id: "1",
    campus_name: "CEP Madrid Centro",
    capacity: 30,
    equipment: ["Proyector", "Pizarra Digital", "Audio"],
    active: true,
  },
  {
    id: "3",
    name: "Laboratorio de Medios",
    campus_id: "1",
    campus_name: "CEP Madrid Centro",
    capacity: 20,
    equipment: ["Mac Studio", "Cámaras 4K", "Iluminación", "Chroma"],
    active: true,
  },
  {
    id: "4",
    name: "Aula 201",
    campus_id: "2",
    campus_name: "CEP Barcelona",
    capacity: 28,
    equipment: ["Proyector", "Pizarra Digital", "Audio"],
    active: true,
  },
  {
    id: "5",
    name: "Estudio de Grabación",
    campus_id: "2",
    campus_name: "CEP Barcelona",
    capacity: 15,
    equipment: ["Micrófonos Pro", "Mezcladora", "Aislamiento Acústico"],
    active: true,
  },
]

// Courses
export const courses: Course[] = [
  {
    id: "1",
    title: "Máster en Comunicación Digital y Redes Sociales",
    description: "Programa completo de especialización en comunicación digital",
    type: "privados",
    modality: "semipresencial",
    status: "publicado",
    duration: 600,
    price: 4500,
    campus: ["1", "2"],
    published: true,
    created_at: "2024-09-01",
  },
  {
    id: "2",
    title: "Curso de Marketing Digital y Publicidad Online",
    description: "Aprende estrategias de marketing digital desde cero",
    type: "ocupados",
    modality: "telematico",
    status: "publicado",
    duration: 200,
    price: 0,
    published: true,
    created_at: "2024-10-15",
  },
  {
    id: "3",
    title: "Técnico Superior en Realización Audiovisual",
    description: "FP de Grado Superior oficial",
    type: "ciclo-superior",
    modality: "presencial",
    status: "publicado",
    duration: 2000,
    price: 0,
    campus: ["1", "2", "3"],
    published: true,
    created_at: "2024-01-20",
  },
  {
    id: "4",
    title: "Community Manager Profesional",
    description: "Gestión profesional de redes sociales y comunidades online",
    type: "privados",
    modality: "telematico",
    status: "publicado",
    duration: 150,
    price: 1200,
    published: true,
    created_at: "2024-11-01",
  },
  {
    id: "5",
    title: "Producción de Vídeo y Contenido Audiovisual",
    description: "Aprende a crear contenido audiovisual profesional",
    type: "desempleados",
    modality: "presencial",
    status: "publicado",
    duration: 300,
    price: 0,
    campus: ["1", "2"],
    published: true,
    created_at: "2024-08-10",
  },
]

// Convocations
export const convocations: Convocation[] = [
  {
    id: "1",
    course_id: "1",
    course_title: "Máster en Comunicación Digital y Redes Sociales",
    start_date: "2025-02-15",
    end_date: "2025-12-20",
    status: "abierta",
    capacity_min: 15,
    capacity_max: 25,
    enrolled: 18,
    campus_id: "1",
    campus_name: "CEP Madrid Centro",
    price: 4500,
  },
  {
    id: "2",
    course_id: "3",
    course_title: "Técnico Superior en Realización Audiovisual",
    start_date: "2025-09-01",
    end_date: "2027-06-30",
    status: "planificada",
    capacity_min: 20,
    capacity_max: 30,
    enrolled: 0,
    campus_id: "1",
    campus_name: "CEP Madrid Centro",
  },
  {
    id: "3",
    course_id: "4",
    course_title: "Community Manager Profesional",
    start_date: "2025-01-20",
    end_date: "2025-04-15",
    status: "abierta",
    capacity_min: 12,
    capacity_max: 20,
    enrolled: 16,
    campus_id: "5",
    campus_name: "CEP Online Campus",
    price: 1200,
  },
  {
    id: "4",
    course_id: "2",
    course_title: "Marketing Digital y Publicidad Online",
    start_date: "2024-11-10",
    end_date: "2025-01-30",
    status: "abierta",
    capacity_min: 15,
    capacity_max: 40,
    enrolled: 38,
    campus_id: "5",
    campus_name: "CEP Online Campus",
  },
  {
    id: "5",
    course_id: "5",
    course_title: "Producción de Vídeo y Contenido Audiovisual",
    start_date: "2025-03-01",
    end_date: "2025-08-31",
    status: "planificada",
    capacity_min: 10,
    capacity_max: 15,
    enrolled: 0,
    campus_id: "2",
    campus_name: "CEP Barcelona",
  },
]

// Teachers (Expandido a 15 profesores con más datos)
export interface TeacherExpanded extends Teacher {
  initials: string
  photo: string
  department: string
  bio: string
}

export const teachers: Teacher[] = [
  {
    id: "1",
    first_name: "María",
    last_name: "García Pérez",
    email: "maria.garcia@cepcomunicacion.com",
    phone: "+34 600 111 222",
    specialties: ["Comunicación Digital", "Redes Sociales", "Marketing"],
    active: true,
    courses_count: 5,
  },
  {
    id: "2",
    first_name: "Carlos",
    last_name: "Rodríguez López",
    email: "carlos.rodriguez@cepcomunicacion.com",
    phone: "+34 600 222 333",
    specialties: ["Realización Audiovisual", "Producción", "Edición"],
    active: true,
    courses_count: 3,
  },
  {
    id: "3",
    first_name: "Laura",
    last_name: "Martínez Sánchez",
    email: "laura.martinez@cepcomunicacion.com",
    phone: "+34 600 333 444",
    specialties: ["Community Management", "Social Media", "Content Creation"],
    active: true,
    courses_count: 4,
  },
  {
    id: "4",
    first_name: "Javier",
    last_name: "Fernández Ruiz",
    email: "javier.fernandez@cepcomunicacion.com",
    phone: "+34 600 444 555",
    specialties: ["Marketing Digital", "SEO", "SEM", "Analytics"],
    active: true,
    courses_count: 6,
  },
  {
    id: "5",
    first_name: "Ana",
    last_name: "López Torres",
    email: "ana.lopez@cepcomunicacion.com",
    phone: "+34 600 555 666",
    specialties: ["Fotografía", "Vídeo", "Post-producción"],
    active: true,
    courses_count: 3,
  },
]

// Teachers con información expandida para el mockup
export const teachersExpanded: TeacherExpanded[] = [
  {
    id: "1",
    first_name: "María",
    last_name: "García Pérez",
    initials: "MG",
    email: "maria.garcia@cepcomunicacion.com",
    phone: "+34 612 345 678",
    photo: "https://i.pravatar.cc/150?img=1",
    department: "Marketing Digital",
    specialties: ["SEO", "SEM", "Analytics"],
    bio: "15 años de experiencia en marketing digital. Certificada en Google Ads y Analytics.",
    active: true,
    courses_count: 5,
  },
  {
    id: "2",
    first_name: "Carlos",
    last_name: "Rodríguez López",
    initials: "CR",
    email: "carlos.rodriguez@cepcomunicacion.com",
    phone: "+34 623 456 789",
    photo: "https://i.pravatar.cc/150?img=12",
    department: "Desarrollo Web",
    specialties: ["React", "Node.js", "TypeScript"],
    bio: "Full-stack developer con 10 años de experiencia. Especialista en arquitecturas modernas.",
    active: true,
    courses_count: 3,
  },
  {
    id: "3",
    first_name: "Laura",
    last_name: "Martínez Sánchez",
    initials: "LM",
    email: "laura.martinez@cepcomunicacion.com",
    phone: "+34 634 567 890",
    photo: "https://i.pravatar.cc/150?img=5",
    department: "Diseño Gráfico",
    specialties: ["Adobe Creative Suite", "Branding", "UI/UX"],
    bio: "Diseñadora gráfica con 12 años de experiencia. Especialista en identidad corporativa.",
    active: true,
    courses_count: 4,
  },
  {
    id: "4",
    first_name: "Javier",
    last_name: "Fernández Ruiz",
    initials: "JF",
    email: "javier.fernandez@cepcomunicacion.com",
    phone: "+34 645 678 901",
    photo: "https://i.pravatar.cc/150?img=15",
    department: "Audiovisual",
    specialties: ["Producción", "Edición", "Motion Graphics"],
    bio: "Productor audiovisual con más de 8 años en el sector.",
    active: true,
    courses_count: 6,
  },
  {
    id: "5",
    first_name: "Ana",
    last_name: "López Torres",
    initials: "AL",
    email: "ana.lopez@cepcomunicacion.com",
    phone: "+34 656 789 012",
    photo: "https://i.pravatar.cc/150?img=9",
    department: "Marketing Digital",
    specialties: ["Redes Sociales", "Content Marketing", "Copywriting"],
    bio: "Community Manager con 7 años de experiencia.",
    active: true,
    courses_count: 3,
  },
  {
    id: "6",
    first_name: "David",
    last_name: "Martín Torres",
    initials: "DM",
    email: "david.martin@cepcomunicacion.com",
    phone: "+34 667 890 123",
    photo: "https://i.pravatar.cc/150?img=13",
    department: "Desarrollo Web",
    specialties: ["PHP", "Laravel", "MySQL"],
    bio: "Backend developer especializado en arquitecturas escalables.",
    active: true,
    courses_count: 4,
  },
  {
    id: "7",
    first_name: "Carmen",
    last_name: "López Díaz",
    initials: "CL",
    email: "carmen.lopez@cepcomunicacion.com",
    phone: "+34 678 901 234",
    photo: "https://i.pravatar.cc/150?img=10",
    department: "Diseño Gráfico",
    specialties: ["Ilustración Digital", "Diseño Editorial"],
    bio: "Ilustradora y diseñadora editorial premiada.",
    active: true,
    courses_count: 3,
  },
  {
    id: "8",
    first_name: "Miguel",
    last_name: "Romero Castro",
    initials: "MR",
    email: "miguel.romero@cepcomunicacion.com",
    phone: "+34 689 012 345",
    photo: "https://i.pravatar.cc/150?img=17",
    department: "Audiovisual",
    specialties: ["Fotografía", "Iluminación", "Retoque"],
    bio: "Fotógrafo profesional con 11 años de experiencia.",
    active: true,
    courses_count: 4,
  },
  {
    id: "9",
    first_name: "Silvia",
    last_name: "Navarro Gil",
    initials: "SN",
    email: "silvia.navarro@cepcomunicacion.com",
    phone: "+34 690 123 456",
    photo: "https://i.pravatar.cc/150?img=20",
    department: "Marketing Digital",
    specialties: ["Email Marketing", "Automation", "CRM"],
    bio: "Especialista en marketing automation.",
    active: true,
    courses_count: 5,
  },
  {
    id: "10",
    first_name: "Roberto",
    last_name: "Castro Vega",
    initials: "RC",
    email: "roberto.castro@cepcomunicacion.com",
    phone: "+34 601 234 567",
    photo: "https://i.pravatar.cc/150?img=33",
    department: "Desarrollo Web",
    specialties: ["Vue.js", "Nuxt", "Firebase"],
    bio: "Frontend developer especializado en aplicaciones SPA.",
    active: true,
    courses_count: 3,
  },
  {
    id: "11",
    first_name: "Isabel",
    last_name: "Moreno Pardo",
    initials: "IM",
    email: "isabel.moreno@cepcomunicacion.com",
    phone: "+34 612 345 678",
    photo: "https://i.pravatar.cc/150?img=24",
    department: "Gestión Empresarial",
    specialties: ["Gestión de Proyectos", "Scrum", "Agile"],
    bio: "Project Manager certificada PMP.",
    active: true,
    courses_count: 4,
  },
  {
    id: "12",
    first_name: "Francisco",
    last_name: "Jiménez Ruiz",
    initials: "FJ",
    email: "francisco.jimenez@cepcomunicacion.com",
    phone: "+34 623 456 789",
    photo: "https://i.pravatar.cc/150?img=51",
    department: "Audiovisual",
    specialties: ["3D Animation", "VFX", "Cinema 4D"],
    bio: "Animador 3D con 8 años de experiencia.",
    active: true,
    courses_count: 3,
  },
  {
    id: "13",
    first_name: "Patricia",
    last_name: "Delgado Ríos",
    initials: "PD",
    email: "patricia.delgado@cepcomunicacion.com",
    phone: "+34 634 567 890",
    photo: "https://i.pravatar.cc/150?img=29",
    department: "Marketing Digital",
    specialties: ["E-commerce", "Google Ads", "Meta Ads"],
    bio: "Especialista en publicidad digital.",
    active: true,
    courses_count: 5,
  },
  {
    id: "14",
    first_name: "Alberto",
    last_name: "Ortiz Sanz",
    initials: "AO",
    email: "alberto.ortiz@cepcomunicacion.com",
    phone: "+34 645 678 901",
    photo: "https://i.pravatar.cc/150?img=52",
    department: "Desarrollo Web",
    specialties: ["Python", "Django", "Machine Learning"],
    bio: "Desarrollador backend con experiencia en IA.",
    active: true,
    courses_count: 4,
  },
  {
    id: "15",
    first_name: "Raquel",
    last_name: "Herrera Campos",
    initials: "RH",
    email: "raquel.herrera@cepcomunicacion.com",
    phone: "+34 656 789 012",
    photo: "https://i.pravatar.cc/150?img=32",
    department: "Diseño Gráfico",
    specialties: ["UX Research", "Wireframing", "Prototyping"],
    bio: "UX Designer certificada en Nielsen Norman Group.",
    active: true,
    courses_count: 3,
  },
]

// Students
export const students: Student[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  first_name: ["Pablo", "Lucía", "Diego", "Carmen", "Alejandro", "Elena", "Miguel", "Sara", "David", "Marta"][i % 10],
  last_name: ["García", "Martínez", "López", "González", "Rodríguez", "Fernández", "Pérez", "Sánchez", "Romero", "Torres"][i % 10],
  email: `alumno${i + 1}@example.com`,
  phone: `+34 6${String(i).padStart(8, "0")}`,
  enrollments_count: Math.floor(Math.random() * 3) + 1,
  active: Math.random() > 0.1,
  created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
}))

// Leads
export const leads: Lead[] = [
  {
    id: "1",
    first_name: "Pedro",
    last_name: "Sánchez Díaz",
    email: "pedro.sanchez@example.com",
    phone: "+34 655 111 222",
    course_interest: "Máster en Comunicación Digital",
    status: "nuevo",
    source: "meta_ads",
    created_at: "2025-01-08",
    utm_source: "facebook",
    utm_medium: "cpc",
    utm_campaign: "master-comunicacion-enero-2025",
  },
  {
    id: "2",
    first_name: "Isabel",
    last_name: "Ruiz Moreno",
    email: "isabel.ruiz@example.com",
    phone: "+34 655 222 333",
    course_interest: "Community Manager Profesional",
    status: "contactado",
    source: "web",
    assigned_to: "María García",
    created_at: "2025-01-06",
  },
  {
    id: "3",
    first_name: "Antonio",
    last_name: "Jiménez Castro",
    email: "antonio.jimenez@example.com",
    phone: "+34 655 333 444",
    course_interest: "Técnico Superior en Realización Audiovisual",
    status: "inscrito",
    source: "referido",
    assigned_to: "Laura Martínez",
    created_at: "2025-01-05",
  },
  {
    id: "4",
    first_name: "Rosa",
    last_name: "Hernández Gil",
    email: "rosa.hernandez@example.com",
    phone: "+34 655 444 555",
    course_interest: "Marketing Digital y Publicidad Online",
    status: "contactado",
    source: "whatsapp",
    assigned_to: "Javier Fernández",
    created_at: "2025-01-07",
  },
  {
    id: "5",
    first_name: "Manuel",
    last_name: "Ortega Blanco",
    email: "manuel.ortega@example.com",
    phone: "+34 655 555 666",
    course_interest: "Producción de Vídeo",
    status: "nuevo",
    source: "meta_ads",
    created_at: "2025-01-09",
    utm_source: "instagram",
    utm_medium: "stories",
    utm_campaign: "video-produccion-enero",
  },
]

// Campaigns
export const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Campaña Máster Comunicación Digital - Enero 2025",
    description: "Captación de leads para el máster de comunicación digital",
    status: "activa",
    budget: 3500,
    leads_generated: 87,
    conversions: 18,
    conversion_rate: 20.7,
    cost_per_lead: 40.23,
    start_date: "2025-01-01",
    end_date: "2025-01-31",
  },
  {
    id: "2",
    name: "Black Friday - Cursos Privados 2024",
    description: "Oferta especial Black Friday todos los cursos privados",
    status: "finalizada",
    budget: 5000,
    leads_generated: 234,
    conversions: 89,
    conversion_rate: 38.0,
    cost_per_lead: 21.37,
    start_date: "2024-11-20",
    end_date: "2024-11-30",
  },
  {
    id: "3",
    name: "Campaña Instagram - Community Manager",
    description: "Promoción del curso de Community Manager en Instagram",
    status: "activa",
    budget: 1500,
    leads_generated: 45,
    conversions: 16,
    conversion_rate: 35.6,
    cost_per_lead: 33.33,
    start_date: "2025-01-05",
    end_date: "2025-02-05",
  },
  {
    id: "4",
    name: "Campaña Google Ads - Ciclos FP",
    description: "Captación para ciclos formativos de grado superior",
    status: "pausada",
    budget: 4000,
    leads_generated: 67,
    conversions: 23,
    conversion_rate: 34.3,
    cost_per_lead: 59.70,
    start_date: "2024-12-01",
    end_date: "2025-02-28",
  },
  {
    id: "5",
    name: "Campaña Referidos - Descuento Alumnos",
    description: "Programa de referidos para alumnos actuales",
    status: "activa",
    budget: 2000,
    leads_generated: 28,
    conversions: 15,
    conversion_rate: 53.6,
    cost_per_lead: 71.43,
    start_date: "2024-11-01",
    end_date: "2025-03-31",
  },
]

// ============================================================================
// PERSONAL ADMINISTRATIVO (8 miembros)
// ============================================================================

export interface StaffMember {
  id: string
  first_name: string
  last_name: string
  initials: string
  email: string
  phone: string
  photo: string
  role: string
  campus: string
  department: string
  active: boolean
}

export const staff: StaffMember[] = [
  {
    id: "1",
    first_name: "Beatriz",
    last_name: "Ramírez Soto",
    initials: "BR",
    email: "beatriz.ramirez@cepcomunicacion.com",
    phone: "+34 922 345 678",
    photo: "https://i.pravatar.cc/150?img=16",
    role: "Directora General",
    campus: "CEP Madrid Centro",
    department: "Dirección",
    active: true
  },
  {
    id: "2",
    first_name: "Enrique",
    last_name: "Molina Castro",
    initials: "EM",
    email: "enrique.molina@cepcomunicacion.com",
    phone: "+34 922 456 789",
    photo: "https://i.pravatar.cc/150?img=53",
    role: "Coordinador Académico",
    campus: "CEP Madrid Centro",
    department: "Coordinación",
    active: true
  },
  {
    id: "3",
    first_name: "Cristina",
    last_name: "Vega Díaz",
    initials: "CV",
    email: "cristina.vega@cepcomunicacion.com",
    phone: "+34 922 567 890",
    photo: "https://i.pravatar.cc/150?img=44",
    role: "Secretaria",
    campus: "CEP Barcelona",
    department: "Secretaría",
    active: true
  },
  {
    id: "4",
    first_name: "Antonio",
    last_name: "Serrano López",
    initials: "AS",
    email: "antonio.serrano@cepcomunicacion.com",
    phone: "+34 922 678 901",
    photo: "https://i.pravatar.cc/150?img=58",
    role: "Administrativo",
    campus: "CEP Madrid Centro",
    department: "Administración",
    active: true
  },
  {
    id: "5",
    first_name: "Mónica",
    last_name: "Ramos Gil",
    initials: "MR",
    email: "monica.ramos@cepcomunicacion.com",
    phone: "+34 922 789 012",
    photo: "https://i.pravatar.cc/150?img=47",
    role: "Recepcionista",
    campus: "CEP Madrid Centro",
    department: "Recepción",
    active: true
  },
  {
    id: "6",
    first_name: "Fernando",
    last_name: "Ortega Ruiz",
    initials: "FO",
    email: "fernando.ortega@cepcomunicacion.com",
    phone: "+34 922 890 123",
    photo: "https://i.pravatar.cc/150?img=61",
    role: "Coordinador Académico",
    campus: "CEP Barcelona",
    department: "Coordinación",
    active: true
  },
  {
    id: "7",
    first_name: "Teresa",
    last_name: "Blanco Sanz",
    initials: "TB",
    email: "teresa.blanco@cepcomunicacion.com",
    phone: "+34 922 901 234",
    photo: "https://i.pravatar.cc/150?img=48",
    role: "Recepcionista",
    campus: "CEP Valencia",
    department: "Recepción",
    active: true
  },
  {
    id: "8",
    first_name: "Luis Miguel",
    last_name: "Herrera Castro",
    initials: "LH",
    email: "luis.herrera@cepcomunicacion.com",
    phone: "+34 922 012 345",
    photo: "https://i.pravatar.cc/150?img=62",
    role: "Administrativo",
    campus: "CEP Valencia",
    department: "Administración",
    active: true
  }
]

// ============================================================================
// CICLOS FORMATIVOS
// ============================================================================

export interface Cycle {
  id: string
  name: string
  code: string
  level: 'grado-medio' | 'grado-superior'
  duration_hours: number
  requirements: string[]
  description: string
  courses: string[] // course IDs
  active: boolean
}

export const cycles: Cycle[] = [
  {
    id: "1",
    name: "Realización Audiovisual y Espectáculos",
    code: "IMS0C",
    level: "grado-superior",
    duration_hours: 2000,
    requirements: [
      "Bachillerato o equivalente",
      "Prueba de acceso a grado superior"
    ],
    description: "Formación profesional en producción y realización de contenidos audiovisuales y eventos.",
    courses: ["3"],
    active: true
  },
  {
    id: "2",
    name: "Marketing y Publicidad",
    code: "COMG0",
    level: "grado-superior",
    duration_hours: 2000,
    requirements: [
      "Bachillerato o equivalente",
      "Prueba de acceso a grado superior"
    ],
    description: "Formación en estrategias de marketing, publicidad y comunicación comercial.",
    courses: ["2", "4"],
    active: true
  },
  {
    id: "3",
    name: "Sistemas Microinformáticos y Redes",
    code: "IFC0C",
    level: "grado-medio",
    duration_hours: 2000,
    requirements: [
      "ESO o equivalente",
      "Prueba de acceso a grado medio"
    ],
    description: "Instalación, configuración y mantenimiento de sistemas microinformáticos y redes.",
    courses: [],
    active: true
  },
  {
    id: "4",
    name: "Desarrollo de Aplicaciones Web",
    code: "IFC0D",
    level: "grado-superior",
    duration_hours: 2000,
    requirements: [
      "Bachillerato o equivalente",
      "Prueba de acceso a grado superior"
    ],
    description: "Desarrollo de aplicaciones web con tecnologías frontend y backend.",
    courses: [],
    active: true
  },
  {
    id: "5",
    name: "Animaciones 3D, Juegos y Entornos Interactivos",
    code: "IMS0B",
    level: "grado-superior",
    duration_hours: 2000,
    requirements: [
      "Bachillerato o equivalente",
      "Prueba de acceso a grado superior"
    ],
    description: "Creación de animaciones 3D, videojuegos y experiencias interactivas.",
    courses: [],
    active: true
  }
]

// ============================================================================
// PERFIL DE USUARIO
// ============================================================================

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: 'admin' | 'gestor' | 'marketing' | 'asesor' | 'lectura'
  department: string
  photo: string
  language: 'es' | 'en' | 'ca'
  timezone: string
  email_notifications: boolean
  sms_notifications: boolean
}

export const currentUser: UserProfile = {
  id: "current-user",
  first_name: "Carlos",
  last_name: "Pérez",
  email: "carlos.perez@cepcomunicacion.com",
  phone: "+34 600 123 456",
  role: "admin",
  department: "Dirección",
  photo: "https://i.pravatar.cc/150?img=12",
  language: "es",
  timezone: "Europe/Madrid",
  email_notifications: true,
  sms_notifications: false
}

// ============================================================================
// ESTUDIANTES EXPANDIDOS
// ============================================================================

export interface StudentExpanded {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  dni: string
  date_of_birth: string
  address: string
  city: string
  postal_code: string
  emergency_contact: string
  emergency_phone: string
  enrolled_courses: string[] // course IDs
  status: 'active' | 'inactive' | 'graduated'
}

const firstNames = ["Pablo", "Lucía", "Diego", "Carmen", "Alejandro", "Elena", "Miguel", "Sara", "David", "Marta", "Javier", "Laura", "Carlos", "Ana", "Daniel", "María", "Antonio", "Isabel", "Francisco", "Rosa"]
const lastNames = ["García", "Martínez", "López", "González", "Rodríguez", "Fernández", "Pérez", "Sánchez", "Romero", "Torres", "Ruiz", "Díaz", "Moreno", "Muñoz", "Álvarez", "Jiménez", "Castro", "Ortiz", "Rubio", "Molina"]

export const studentsExpanded: StudentExpanded[] = Array.from({ length: 25 }, (_, i) => ({
  id: `student-${i + 1}`,
  first_name: firstNames[i % firstNames.length],
  last_name: `${lastNames[i % lastNames.length]} ${lastNames[(i + 5) % lastNames.length]}`,
  email: `alumno${i + 1}@example.com`,
  phone: `+34 6${String(i + 10).padStart(8, "0")}`,
  dni: `${String(12345678 + i).slice(0, 8)}${String.fromCharCode(65 + (i % 23))}`,
  date_of_birth: `199${5 + (i % 5)}-0${1 + (i % 9)}-${10 + (i % 18)}`,
  address: `Calle ${lastNames[i % lastNames.length]}, ${i + 1}`,
  city: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Tenerife"][i % 5],
  postal_code: `${28000 + (i * 10)}`,
  emergency_contact: `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 7) % lastNames.length]}`,
  emergency_phone: `+34 6${String(i + 40).padStart(8, "0")}`,
  enrolled_courses: [String((i % 5) + 1)],
  status: i % 7 === 0 ? 'graduated' : i % 11 === 0 ? 'inactive' : 'active'
}))

// ============================================================================
// CURSOS EXPANDIDOS
// ============================================================================

export const coursesExpanded = [
  ...courses,
  {
    id: "6",
    title: "Diseño Gráfico Profesional con Adobe Creative Suite",
    description: "Domina Photoshop, Illustrator e InDesign",
    type: "privados" as const,
    modality: "presencial" as const,
    status: "publicado" as const,
    duration: 180,
    price: 1800,
    campus: ["1", "2"],
    published: true,
    created_at: "2024-09-15",
  },
  {
    id: "7",
    title: "Gestión de Redes Sociales Avanzado",
    description: "Estrategias profesionales para Instagram, TikTok y LinkedIn",
    type: "ocupados" as const,
    modality: "telematico" as const,
    status: "publicado" as const,
    duration: 120,
    price: 0,
    published: true,
    created_at: "2024-10-01",
  },
  {
    id: "8",
    title: "Fotografía Digital y Retoque Fotográfico",
    description: "Técnicas profesionales de fotografía y post-producción",
    type: "privados" as const,
    modality: "semipresencial" as const,
    status: "publicado" as const,
    duration: 150,
    price: 1500,
    campus: ["1"],
    published: true,
    created_at: "2024-08-20",
  },
  {
    id: "9",
    title: "Google Ads y Meta Ads Certificación",
    description: "Preparación para certificaciones oficiales",
    type: "privados" as const,
    modality: "telematico" as const,
    status: "publicado" as const,
    duration: 100,
    price: 900,
    published: true,
    created_at: "2024-11-05",
  },
  {
    id: "10",
    title: "Edición de Vídeo con Adobe Premiere y After Effects",
    description: "Post-producción profesional de contenidos audiovisuales",
    type: "desempleados" as const,
    modality: "presencial" as const,
    status: "publicado" as const,
    duration: 250,
    price: 0,
    campus: ["1", "2"],
    published: true,
    created_at: "2024-07-10",
  }
]
