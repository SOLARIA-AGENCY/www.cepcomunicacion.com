import type {
  Course,
  Convocation,
  Campus,
  Classroom,
  Teacher,
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

// ============================================
// TEACHERS EXPANDED - Interfaz completa
// ============================================
export interface TeacherExpanded extends Teacher {
  initials: string
  photo: string
  department: string
  bio: string // OBLIGATORIO (no opcional)
  certifications: {
    title: string
    institution: string
    year: number
  }[]
  courses: {
    id: string
    name: string
    code: string
    type: string
    modality: string
    students: number
  }[]
  campuses: string[] // IDs de sedes asignadas
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
    specialties: ["SEO", "SEM", "Analytics", "Google Ads", "Meta Ads"],
    bio: "15 años de experiencia en marketing digital y publicidad. Especializada en campañas de rendimiento para e-commerce y generación de leads B2B. Ha gestionado presupuestos superiores a 500K€ anuales con ROI promedio del 320%.",
    active: true,
    courses_count: 3,
    certifications: [
      {
        title: "Google Ads Certified",
        institution: "Google",
        year: 2023
      },
      {
        title: "Master en Marketing Digital",
        institution: "ESIC Business School",
        year: 2019
      },
      {
        title: "Certificación Meta Blueprint",
        institution: "Meta",
        year: 2022
      }
    ],
    courses: [
      {
        id: "CURSO001",
        name: "Community Manager Profesional",
        code: "CM-PRO-2025",
        type: "Privado",
        modality: "Semipresencial",
        students: 18
      },
      {
        id: "CURSO002",
        name: "SEO y SEM Avanzado",
        code: "SEO-SEM-ADV",
        type: "Privado",
        modality: "Presencial",
        students: 15
      },
      {
        id: "CURSO008",
        name: "Marketing para Desempleados",
        code: "MKT-DESEMP",
        type: "Desempleados",
        modality: "Semipresencial",
        students: 20
      }
    ],
    campuses: ["C001", "C002"]
  },
  {
    id: "2",
    first_name: "Carlos",
    last_name: "Rodríguez Martínez",
    initials: "CR",
    email: "carlos.rodriguez@cepcomunicacion.com",
    phone: "+34 612 345 679",
    photo: "https://i.pravatar.cc/150?img=12",
    department: "Desarrollo Web",
    specialties: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    bio: "Desarrollador full-stack con 10 años de experiencia en tecnologías web modernas. Ha liderado proyectos para empresas como CaixaBank y Telefónica. Especializado en arquitecturas escalables y metodologías ágiles.",
    active: true,
    courses_count: 2,
    certifications: [
      {
        title: "AWS Certified Solutions Architect",
        institution: "Amazon Web Services",
        year: 2023
      },
      {
        title: "Técnico Superior en Desarrollo de Aplicaciones Web",
        institution: "CEP Comunicación",
        year: 2015
      }
    ],
    courses: [
      {
        id: "CURSO004",
        name: "Desarrollo Frontend con React",
        code: "REACT-2025",
        type: "Ciclo Superior",
        modality: "Presencial",
        students: 12
      },
      {
        id: "CURSO005",
        name: "Backend con Node.js y PostgreSQL",
        code: "NODE-PSQL",
        type: "Ciclo Superior",
        modality: "Semipresencial",
        students: 9
      }
    ],
    campuses: ["C001"]
  },
  {
    id: "3",
    first_name: "Laura",
    last_name: "Martínez Sosa",
    initials: "LM",
    email: "laura.martinez@cepcomunicacion.com",
    phone: "+34 634 567 890",
    photo: "https://i.pravatar.cc/150?img=5",
    department: "Diseño Gráfico",
    specialties: ["Figma", "Adobe XD", "UI/UX", "Design Systems", "Prototipado"],
    bio: "Diseñadora UX/UI con 12 años de experiencia en diseño centrado en el usuario. Ha trabajado para startups como Glovo y Cabify. Especialista en design systems y metodologías de diseño ágil.",
    active: true,
    courses_count: 2,
    certifications: [
      {
        title: "UX Design Professional Certificate",
        institution: "Google",
        year: 2022
      },
      {
        title: "Advanced Figma Certification",
        institution: "Figma",
        year: 2023
      }
    ],
    courses: [
      {
        id: "CURSO003",
        name: "Diseño UX/UI con Figma",
        code: "UX-UI-FIG",
        type: "Privado",
        modality: "Semipresencial",
        students: 14
      },
      {
        id: "CURSO006",
        name: "Design Systems Profesional",
        code: "DS-PRO",
        type: "Privado",
        modality: "Presencial",
        students: 10
      }
    ],
    campuses: ["C001", "C002"]
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
    specialties: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Producción", "Motion Graphics"],
    bio: "Productor audiovisual y editor con más de 8 años en televisión y publicidad. Ha trabajado en producciones para Antena 3 y Mediaset. Especializado en postproducción y motion graphics.",
    active: true,
    courses_count: 2,
    certifications: [
      {
        title: "Adobe Certified Expert - Premiere Pro",
        institution: "Adobe",
        year: 2021
      },
      {
        title: "DaVinci Resolve Colorist Certification",
        institution: "Blackmagic Design",
        year: 2023
      }
    ],
    courses: [
      {
        id: "CURSO007",
        name: "Edición de Vídeo Profesional",
        code: "VIDEO-PRO",
        type: "Privado",
        modality: "Presencial",
        students: 11
      },
      {
        id: "CURSO009",
        name: "Motion Graphics y VFX",
        code: "MOTION-VFX",
        type: "Ciclo Superior",
        modality: "Presencial",
        students: 13
      }
    ],
    campuses: ["C001", "C003"]
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
    specialties: ["Instagram", "TikTok", "Content Marketing", "Copywriting", "Influencer Marketing"],
    bio: "Community Manager y Content Creator con 7 años de experiencia gestionando cuentas de más de 500K seguidores. Especializada en estrategias de contenido viral y growth hacking en redes sociales.",
    active: true,
    courses_count: 3,
    certifications: [
      {
        title: "Meta Social Media Marketing Professional Certificate",
        institution: "Meta",
        year: 2022
      },
      {
        title: "Content Marketing Certified",
        institution: "HubSpot Academy",
        year: 2023
      }
    ],
    courses: [
      {
        id: "CURSO010",
        name: "TikTok y Reels para Empresas",
        code: "TIKTOK-BIZ",
        type: "Privado",
        modality: "Telemático",
        students: 22
      },
      {
        id: "CURSO011",
        name: "Content Marketing Estratégico",
        code: "CONTENT-STR",
        type: "Ocupados",
        modality: "Semipresencial",
        students: 17
      },
      {
        id: "CURSO001",
        name: "Community Manager Profesional",
        code: "CM-PRO-2025",
        type: "Privado",
        modality: "Semipresencial",
        students: 18
      }
    ],
    campuses: ["C002", "C004"]
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
    specialties: ["PHP", "Laravel", "MySQL", "API REST", "Microservicios"],
    bio: "Backend developer con 9 años de experiencia en PHP y Laravel. Ha desarrollado sistemas de gestión empresarial para compañías con más de 1000 usuarios concurrentes. Experto en optimización de bases de datos y arquitecturas de microservicios.",
    active: true,
    courses_count: 2,
    certifications: [
      {
        title: "Laravel Certified Developer",
        institution: "Laravel",
        year: 2022
      },
      {
        title: "MySQL Database Administrator",
        institution: "Oracle",
        year: 2020
      }
    ],
    courses: [
      {
        id: "CURSO012",
        name: "Desarrollo Backend con Laravel",
        code: "LARAVEL-ADV",
        type: "Ciclo Superior",
        modality: "Semipresencial",
        students: 14
      },
      {
        id: "CURSO013",
        name: "API REST y Microservicios",
        code: "API-MICRO",
        type: "Privado",
        modality: "Telemático",
        students: 16
      }
    ],
    campuses: ["C001", "C002"]
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
    specialties: ["Ilustración Digital", "Procreate", "Diseño Editorial", "Branding"],
    bio: "Ilustradora y diseñadora editorial premiada con más de 10 años de experiencia. Ha ilustrado más de 50 libros infantiles y trabajado para editoriales como Planeta y Anaya. Especialista en ilustración digital con iPad y Procreate.",
    active: true,
    courses_count: 2,
    certifications: [
      {
        title: "Certificado en Ilustración Digital",
        institution: "Domestika",
        year: 2021
      },
      {
        title: "Diseño Editorial Avanzado",
        institution: "EINA Barcelona",
        year: 2018
      }
    ],
    courses: [
      {
        id: "CURSO014",
        name: "Ilustración Digital con Procreate",
        code: "PROCREATE-ILL",
        type: "Privado",
        modality: "Semipresencial",
        students: 19
      },
      {
        id: "CURSO015",
        name: "Diseño Editorial y Maquetación",
        code: "EDITORIAL-DES",
        type: "Privado",
        modality: "Presencial",
        students: 12
      }
    ],
    campuses: ["C002"]
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
    specialties: ["Fotografía Comercial", "Iluminación de Estudio", "Retoque Photoshop", "Fotografía de Producto"],
    bio: "Fotógrafo profesional con 11 años de experiencia en fotografía comercial y publicitaria. Ha trabajado para marcas como Zara, Mango y Desigual. Especializado en fotografía de moda y producto con iluminación de estudio profesional.",
    active: true,
    courses_count: 2,
    certifications: [
      {
        title: "Certificado en Fotografía Comercial",
        institution: "Institute of Photography",
        year: 2019
      },
      {
        title: "Adobe Certified Professional - Photoshop",
        institution: "Adobe",
        year: 2022
      }
    ],
    courses: [
      {
        id: "CURSO016",
        name: "Fotografía de Producto Profesional",
        code: "PHOTO-PROD",
        type: "Privado",
        modality: "Presencial",
        students: 10
      },
      {
        id: "CURSO017",
        name: "Retoque Fotográfico Avanzado",
        code: "RETOUCH-ADV",
        type: "Privado",
        modality: "Semipresencial",
        students: 15
      }
    ],
    campuses: ["C001", "C003"]
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
    specialties: ["Email Marketing", "Marketing Automation", "HubSpot", "Salesforce", "CRM"],
    bio: "Especialista en marketing automation y CRM con 8 años de experiencia. Ha implementado sistemas de automatización que han generado aumentos del 300% en conversiones. Certificada en HubSpot y Salesforce.",
    active: true,
    courses_count: 3,
    certifications: [
      {
        title: "HubSpot Marketing Software Certified",
        institution: "HubSpot Academy",
        year: 2023
      },
      {
        title: "Salesforce Marketing Cloud Consultant",
        institution: "Salesforce",
        year: 2022
      },
      {
        title: "Email Marketing Specialist",
        institution: "Digital Marketing Institute",
        year: 2021
      }
    ],
    courses: [
      {
        id: "CURSO018",
        name: "Email Marketing y Automatización",
        code: "EMAIL-AUTO",
        type: "Privado",
        modality: "Telemático",
        students: 21
      },
      {
        id: "CURSO019",
        name: "HubSpot para Marketing",
        code: "HUBSPOT-MKT",
        type: "Ocupados",
        modality: "Semipresencial",
        students: 18
      },
      {
        id: "CURSO020",
        name: "CRM y Gestión de Clientes",
        code: "CRM-MGMT",
        type: "Privado",
        modality: "Telemático",
        students: 16
      }
    ],
    campuses: ["C001", "C002", "C004"]
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
    specialties: ["Vue.js", "Nuxt.js", "Firebase", "Progressive Web Apps", "Tailwind CSS"],
    bio: "Frontend developer especializado en aplicaciones SPA y PWA con 7 años de experiencia. Ha desarrollado aplicaciones web para más de 30 clientes utilizando Vue.js y Nuxt. Experto en optimización de rendimiento y SEO técnico.",
    active: true,
    courses_count: 2,
    certifications: [
      {
        title: "Vue.js Developer Certification",
        institution: "VueSchool",
        year: 2023
      },
      {
        title: "Firebase Certified Developer",
        institution: "Google",
        year: 2022
      }
    ],
    courses: [
      {
        id: "CURSO021",
        name: "Desarrollo Frontend con Vue.js",
        code: "VUE-DEV",
        type: "Ciclo Superior",
        modality: "Semipresencial",
        students: 11
      },
      {
        id: "CURSO022",
        name: "Progressive Web Apps",
        code: "PWA-DEV",
        type: "Privado",
        modality: "Telemático",
        students: 13
      }
    ],
    campuses: ["C002"]
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
    specialties: ["Gestión de Proyectos", "Scrum", "Agile", "PRINCE2", "Lean"],
    bio: "Project Manager certificada PMP con 14 años de experiencia gestionando proyectos tecnológicos. Ha liderado equipos de hasta 50 personas en proyectos valorados en más de 5M€. Experta en metodologías ágiles y transformación digital.",
    active: true,
    courses_count: 3,
    certifications: [
      {
        title: "Project Management Professional (PMP)",
        institution: "PMI",
        year: 2020
      },
      {
        title: "Certified ScrumMaster (CSM)",
        institution: "Scrum Alliance",
        year: 2021
      },
      {
        title: "PRINCE2 Practitioner",
        institution: "AXELOS",
        year: 2019
      }
    ],
    courses: [
      {
        id: "CURSO023",
        name: "Gestión de Proyectos Ágiles",
        code: "AGILE-PM",
        type: "Privado",
        modality: "Semipresencial",
        students: 16
      },
      {
        id: "CURSO024",
        name: "Scrum Master Certification Prep",
        code: "SCRUM-PREP",
        type: "Privado",
        modality: "Telemático",
        students: 20
      },
      {
        id: "CURSO025",
        name: "Gestión Empresarial Digital",
        code: "BIZ-DIGITAL",
        type: "Ocupados",
        modality: "Semipresencial",
        students: 14
      }
    ],
    campuses: ["C001", "C002", "C003"]
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
    specialties: ["Blender", "Cinema 4D", "3D Animation", "VFX", "Unreal Engine"],
    bio: "Animador 3D y especialista en efectos visuales con 8 años de experiencia en la industria. Ha trabajado en proyectos para Netflix y Movistar+. Experto en Blender, Cinema 4D y Unreal Engine para animación y visualización arquitectónica.",
    active: true,
    courses_count: 2,
    certifications: [
      {
        title: "Blender Certified Trainer",
        institution: "Blender Foundation",
        year: 2022
      },
      {
        title: "Cinema 4D Professional",
        institution: "Maxon",
        year: 2021
      }
    ],
    courses: [
      {
        id: "CURSO026",
        name: "Animación 3D con Blender",
        code: "BLENDER-3D",
        type: "Ciclo Superior",
        modality: "Presencial",
        students: 12
      },
      {
        id: "CURSO027",
        name: "VFX y Efectos Visuales",
        code: "VFX-PRO",
        type: "Privado",
        modality: "Semipresencial",
        students: 9
      }
    ],
    campuses: ["C001", "C003"]
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
    specialties: ["E-commerce", "Google Ads", "Meta Ads", "Amazon Ads", "Shopify"],
    bio: "Especialista en publicidad digital y e-commerce con 9 años de experiencia. Ha gestionado más de 100 tiendas online generando facturaciones superiores a 20M€. Certificada en Google Ads, Meta Ads y Amazon Advertising.",
    active: true,
    courses_count: 3,
    certifications: [
      {
        title: "Google Ads Search Certification",
        institution: "Google",
        year: 2023
      },
      {
        title: "Meta Certified Media Planning Professional",
        institution: "Meta",
        year: 2023
      },
      {
        title: "Amazon Advertising Accreditation",
        institution: "Amazon",
        year: 2022
      }
    ],
    courses: [
      {
        id: "CURSO028",
        name: "E-commerce con Shopify",
        code: "SHOPIFY-PRO",
        type: "Privado",
        modality: "Semipresencial",
        students: 17
      },
      {
        id: "CURSO029",
        name: "Publicidad Digital Multicanal",
        code: "ADS-MULTI",
        type: "Privado",
        modality: "Telemático",
        students: 23
      },
      {
        id: "CURSO002",
        name: "SEO y SEM Avanzado",
        code: "SEO-SEM-ADV",
        type: "Privado",
        modality: "Presencial",
        students: 15
      }
    ],
    campuses: ["C001", "C002", "C004"]
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
    specialties: ["Python", "Django", "FastAPI", "Machine Learning", "Data Science"],
    bio: "Desarrollador backend y científico de datos con 10 años de experiencia. Ha implementado sistemas de inteligencia artificial para análisis predictivo y procesamiento de lenguaje natural. Experto en Python, Django y frameworks de ML como TensorFlow y scikit-learn.",
    active: true,
    courses_count: 3,
    certifications: [
      {
        title: "Python for Data Science and AI",
        institution: "IBM",
        year: 2022
      },
      {
        title: "Machine Learning Specialization",
        institution: "Stanford University - Coursera",
        year: 2021
      },
      {
        title: "Django Certified Developer",
        institution: "Django Software Foundation",
        year: 2020
      }
    ],
    courses: [
      {
        id: "CURSO030",
        name: "Desarrollo Backend con Python y Django",
        code: "PYTHON-DJANGO",
        type: "Ciclo Superior",
        modality: "Semipresencial",
        students: 13
      },
      {
        id: "CURSO031",
        name: "Machine Learning Aplicado",
        code: "ML-APPLIED",
        type: "Privado",
        modality: "Telemático",
        students: 15
      },
      {
        id: "CURSO032",
        name: "Data Science con Python",
        code: "DATA-PYTHON",
        type: "Privado",
        modality: "Semipresencial",
        students: 11
      }
    ],
    campuses: ["C001", "C002"]
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
    specialties: ["UX Research", "User Testing", "Wireframing", "Prototyping", "Design Thinking"],
    bio: "UX Designer y UX Researcher certificada con 9 años de experiencia. Ha conducido más de 200 sesiones de investigación con usuarios para empresas como Santander y BBVA. Especialista en metodologías de Design Thinking y tests de usabilidad.",
    active: true,
    courses_count: 2,
    certifications: [
      {
        title: "UX Research Professional Certificate",
        institution: "Nielsen Norman Group",
        year: 2022
      },
      {
        title: "Design Thinking Facilitator",
        institution: "IDEO U",
        year: 2021
      }
    ],
    courses: [
      {
        id: "CURSO033",
        name: "UX Research y Testing",
        code: "UX-RESEARCH",
        type: "Privado",
        modality: "Semipresencial",
        students: 12
      },
      {
        id: "CURSO034",
        name: "Design Thinking Aplicado",
        code: "DESIGN-THINK",
        type: "Privado",
        modality: "Presencial",
        students: 14
      }
    ],
    campuses: ["C002", "C003"]
  },
]

// Students (simple version - deprecated, use studentsData instead)
// export const students: Student[] = Array.from({ length: 20 }, (_, i) => ({
//   id: `${i + 1}`,
//   first_name: ["Pablo", "Lucía", "Diego", "Carmen", "Alejandro", "Elena", "Miguel", "Sara", "David", "Marta"][i % 10],
//   last_name: ["García", "Martínez", "López", "González", "Rodríguez", "Fernández", "Pérez", "Sánchez", "Romero", "Torres"][i % 10],
//   email: `alumno${i + 1}@example.com`,
//   phone: `+34 6${String(i).padStart(8, "0")}`,
//   enrollments_count: Math.floor(Math.random() * 3) + 1,
//   active: Math.random() > 0.1,
//   created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
// }))

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
  courses: Array<{
    id: string
    name: string
    code: string
    mandatory?: boolean
  }>
  career_opportunities?: string[]
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
    courses: [
      { id: "3", name: "Producción Audiovisual", code: "PA-101", mandatory: true }
    ],
    career_opportunities: [
      "Realizador/a de audiovisuales",
      "Director/a de fotografía",
      "Productor/a de eventos",
      "Técnico/a de sonido",
      "Editor/a de vídeo"
    ],
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
    courses: [
      { id: "2", name: "Marketing Digital", code: "MD-202", mandatory: true },
      { id: "4", name: "Estrategias de Publicidad", code: "EP-204", mandatory: false }
    ],
    career_opportunities: [
      "Especialista en Marketing Digital",
      "Community Manager",
      "Director/a de Publicidad",
      "Analista de Marketing",
      "Consultor/a de Comunicación"
    ],
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
    career_opportunities: [
      "Técnico/a de Soporte Informático",
      "Administrador/a de Redes",
      "Técnico/a de Sistemas",
      "Especialista en Ciberseguridad"
    ],
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
    career_opportunities: [
      "Desarrollador/a Full Stack",
      "Programador/a Frontend",
      "Programador/a Backend",
      "Arquitecto/a de Software",
      "DevOps Engineer"
    ],
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
    career_opportunities: [
      "Animador/a 3D",
      "Desarrollador/a de Videojuegos",
      "Diseñador/a de Entornos Virtuales",
      "Artista de VFX",
      "Modelador/a 3D"
    ],
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

// ============================================
// INTERFACES PARA CALENDARIOS Y AULAS
// ============================================

export interface WeeklyScheduleSlot {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  start_time: string // "09:00"
  end_time: string // "13:00"
  course_id: string
  course_name: string
  teacher_name: string
  color: string // Para visualización
}

export interface ClassroomExpanded {
  id: string
  name: string
  capacity: number
  floor: number
  equipment: string[] // Array DINÁMICO (no checkboxes fijos)
  weekly_schedule: WeeklyScheduleSlot[]
}

export interface CampusExpanded {
  id: string
  name: string
  code: string
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
  manager_name: string
  manager_email: string
  opening_hours: string
  image_url: string
  classrooms: ClassroomExpanded[]
  active: boolean
  description: string // OBLIGATORIO
  facilities: string[] // Instalaciones disponibles
}

// ============================================
// CAMPUSES EXPANDIDOS CON AULAS Y CALENDARIOS
// ============================================

export const campusesData: CampusExpanded[] = [
  {
    id: "C001",
    name: "CEP Norte",
    code: "NORTE",
    address: "Avenida Los Menceyes 45",
    city: "San Cristóbal de La Laguna",
    postal_code: "38200",
    phone: "+34 922 123 456",
    email: "norte@cepcomunicacion.com",
    manager_name: "Ana García Pérez",
    manager_email: "ana.garcia@cepcomunicacion.com",
    opening_hours: "Lunes a Viernes: 08:00 - 21:00 | Sábados: 09:00 - 14:00",
    image_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
    description: "Sede principal ubicada en el corazón de La Laguna, con fácil acceso en transporte público. Instalaciones modernas renovadas en 2022 con tecnología de última generación. Cuenta con 4 aulas equipadas, sala de profesores, biblioteca digital y zona de coworking para alumnos.",
    facilities: [
      "4 Aulas completamente equipadas",
      "Biblioteca digital con 500+ recursos",
      "Zona de coworking con WiFi 6",
      "Cafetería con máquinas vending",
      "Aparcamiento privado (20 plazas)",
      "Acceso para personas con movilidad reducida"
    ],
    classrooms: [
      {
        id: "A1-NORTE",
        name: "Aula A1",
        capacity: 25,
        floor: 1,
        equipment: [
          "Proyector 4K",
          "Ordenadores (25 unidades)",
          "Pizarra Digital Interactiva",
          "Sistema de Audio Profesional",
          "Cámaras para streaming",
          "Aire Acondicionado",
          "Mobiliario ergonómico"
        ],
        weekly_schedule: [
          {
            day: "monday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO001",
            course_name: "Community Manager Profesional",
            teacher_name: "María García Pérez",
            color: "#3b82f6"
          },
          {
            day: "monday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO004",
            course_name: "Desarrollo Frontend con React",
            teacher_name: "Carlos Rodríguez Martínez",
            color: "#8b5cf6"
          },
          {
            day: "tuesday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO002",
            course_name: "SEO y SEM Avanzado",
            teacher_name: "María García Pérez",
            color: "#3b82f6"
          },
          {
            day: "wednesday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO003",
            course_name: "Diseño UX/UI con Figma",
            teacher_name: "Laura Martínez Sosa",
            color: "#ec4899"
          },
          {
            day: "thursday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO001",
            course_name: "Community Manager Profesional",
            teacher_name: "María García Pérez",
            color: "#3b82f6"
          },
          {
            day: "friday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO005",
            course_name: "Backend con Node.js",
            teacher_name: "Carlos Rodríguez Martínez",
            color: "#8b5cf6"
          }
        ]
      },
      {
        id: "A2-NORTE",
        name: "Aula A2",
        capacity: 20,
        floor: 1,
        equipment: [
          "Proyector Full HD",
          "Ordenadores (20 unidades)",
          "Pizarra blanca",
          "Sistema de Audio",
          "Aire Acondicionado"
        ],
        weekly_schedule: [
          {
            day: "monday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO006",
            course_name: "Design Systems Profesional",
            teacher_name: "Laura Martínez Sosa",
            color: "#ec4899"
          },
          {
            day: "tuesday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO012",
            course_name: "Desarrollo Backend con Laravel",
            teacher_name: "David Martín Torres",
            color: "#f59e0b"
          },
          {
            day: "wednesday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO007",
            course_name: "Edición de Vídeo Profesional",
            teacher_name: "Javier Fernández Ruiz",
            color: "#10b981"
          },
          {
            day: "friday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO023",
            course_name: "Gestión de Proyectos Ágiles",
            teacher_name: "Isabel Moreno Pardo",
            color: "#6366f1"
          }
        ]
      },
      {
        id: "A3-NORTE",
        name: "Aula A3",
        capacity: 30,
        floor: 2,
        equipment: [
          "Proyector 4K",
          "Ordenadores (30 unidades - Mac)",
          "Pizarra Digital Interactiva",
          "Tabletas gráficas Wacom",
          "Sistema de Audio Profesional",
          "Aire Acondicionado"
        ],
        weekly_schedule: [
          {
            day: "monday",
            start_time: "10:00",
            end_time: "14:00",
            course_id: "CURSO016",
            course_name: "Fotografía de Producto Profesional",
            teacher_name: "Miguel Romero Castro",
            color: "#ef4444"
          },
          {
            day: "tuesday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO026",
            course_name: "Animación 3D con Blender",
            teacher_name: "Francisco Jiménez Ruiz",
            color: "#14b8a6"
          },
          {
            day: "thursday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO030",
            course_name: "Desarrollo Backend con Python y Django",
            teacher_name: "Alberto Ortiz Sanz",
            color: "#8b5cf6"
          }
        ]
      },
      {
        id: "A4-NORTE",
        name: "Estudio Audiovisual",
        capacity: 15,
        floor: 2,
        equipment: [
          "Cámaras profesionales 4K (3 unidades)",
          "Iluminación profesional completa",
          "Fondo croma green screen",
          "Micrófonos profesionales",
          "Mezcladora de audio",
          "Ordenadores de edición (5 unidades)",
          "Software Adobe Creative Cloud",
          "Insonorización acústica"
        ],
        weekly_schedule: [
          {
            day: "wednesday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO009",
            course_name: "Motion Graphics y VFX",
            teacher_name: "Javier Fernández Ruiz",
            color: "#10b981"
          },
          {
            day: "thursday",
            start_time: "10:00",
            end_time: "14:00",
            course_id: "CURSO017",
            course_name: "Retoque Fotográfico Avanzado",
            teacher_name: "Miguel Romero Castro",
            color: "#ef4444"
          }
        ]
      }
    ],
    active: true
  },
  {
    id: "C002",
    name: "CEP Santa Cruz",
    code: "SANTA-CRUZ",
    address: "Calle Castillo 82",
    city: "Santa Cruz de Tenerife",
    postal_code: "38001",
    phone: "+34 922 234 567",
    email: "santacruz@cepcomunicacion.com",
    manager_name: "Carlos Rodríguez Martínez",
    manager_email: "carlos.rodriguez@cepcomunicacion.com",
    opening_hours: "Lunes a Viernes: 08:30 - 21:00 | Sábados: 09:00 - 14:00",
    image_url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=400&fit=crop",
    description: "Sede céntrica en pleno corazón de Santa Cruz, a 5 minutos del Auditorio. Completamente renovada en 2023 con espacios modernos y luminosos. Especializada en cursos de marketing digital y diseño gráfico.",
    facilities: [
      "3 Aulas totalmente equipadas",
      "Sala de reuniones para trabajos en grupo",
      "WiFi de alta velocidad",
      "Zona de descanso con cafetera",
      "Próximo a paradas de tranvía y guagua"
    ],
    classrooms: [
      {
        id: "B1-SC",
        name: "Aula B1",
        capacity: 22,
        floor: 1,
        equipment: [
          "Proyector 4K",
          "Ordenadores (22 unidades)",
          "Pizarra Digital",
          "Sistema de Audio",
          "Aire Acondicionado",
          "Mobiliario modular"
        ],
        weekly_schedule: [
          {
            day: "monday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO010",
            course_name: "TikTok y Reels para Empresas",
            teacher_name: "Ana López Torres",
            color: "#ec4899"
          },
          {
            day: "tuesday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO011",
            course_name: "Content Marketing Estratégico",
            teacher_name: "Ana López Torres",
            color: "#ec4899"
          },
          {
            day: "wednesday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO014",
            course_name: "Ilustración Digital con Procreate",
            teacher_name: "Carmen López Díaz",
            color: "#f59e0b"
          },
          {
            day: "friday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO021",
            course_name: "Desarrollo Frontend con Vue.js",
            teacher_name: "Roberto Castro Vega",
            color: "#10b981"
          }
        ]
      },
      {
        id: "B2-SC",
        name: "Aula B2",
        capacity: 18,
        floor: 1,
        equipment: [
          "Proyector Full HD",
          "Ordenadores (18 unidades)",
          "Pizarra blanca",
          "Sistema de Audio",
          "Aire Acondicionado"
        ],
        weekly_schedule: [
          {
            day: "monday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO028",
            course_name: "E-commerce con Shopify",
            teacher_name: "Patricia Delgado Ríos",
            color: "#6366f1"
          },
          {
            day: "wednesday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO033",
            course_name: "UX Research y Testing",
            teacher_name: "Raquel Herrera Campos",
            color: "#8b5cf6"
          },
          {
            day: "thursday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO018",
            course_name: "Email Marketing y Automatización",
            teacher_name: "Silvia Navarro Gil",
            color: "#14b8a6"
          }
        ]
      },
      {
        id: "B3-SC",
        name: "Aula B3",
        capacity: 25,
        floor: 2,
        equipment: [
          "Proyector 4K",
          "Ordenadores (25 unidades)",
          "Pizarra Digital Interactiva",
          "Sistema de Audio Premium",
          "Webcam 4K para videoconferencias",
          "Aire Acondicionado"
        ],
        weekly_schedule: [
          {
            day: "tuesday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO019",
            course_name: "HubSpot para Marketing",
            teacher_name: "Silvia Navarro Gil",
            color: "#14b8a6"
          },
          {
            day: "thursday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO032",
            course_name: "Data Science con Python",
            teacher_name: "Alberto Ortiz Sanz",
            color: "#8b5cf6"
          }
        ]
      }
    ],
    active: true
  },
  {
    id: "C003",
    name: "CEP Sur",
    code: "SUR",
    address: "Avenida de Los Pueblos 23",
    city: "Arona",
    postal_code: "38640",
    phone: "+34 922 345 678",
    email: "sur@cepcomunicacion.com",
    manager_name: "Laura Martínez Sosa",
    manager_email: "laura.martinez@cepcomunicacion.com",
    opening_hours: "Lunes a Viernes: 09:00 - 21:00 | Sábados: 09:00 - 13:00",
    image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
    description: "Sede ubicada en el sur de Tenerife, perfectamente comunicada. Abierta en 2024 con instalaciones de vanguardia. Enfocada en formación presencial de calidad con grupos reducidos.",
    facilities: [
      "2 Aulas modernas",
      "Estudio de fotografía",
      "WiFi de alta velocidad",
      "Aparcamiento gratuito (30 plazas)",
      "Zona de descanso exterior"
    ],
    classrooms: [
      {
        id: "C1-SUR",
        name: "Aula C1",
        capacity: 20,
        floor: 1,
        equipment: [
          "Proyector 4K",
          "Ordenadores (20 unidades)",
          "Pizarra Digital",
          "Sistema de Audio",
          "Aire Acondicionado"
        ],
        weekly_schedule: [
          {
            day: "monday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO027",
            course_name: "VFX y Efectos Visuales",
            teacher_name: "Francisco Jiménez Ruiz",
            color: "#14b8a6"
          },
          {
            day: "wednesday",
            start_time: "16:00",
            end_time: "20:00",
            course_id: "CURSO034",
            course_name: "Design Thinking Aplicado",
            teacher_name: "Raquel Herrera Campos",
            color: "#8b5cf6"
          },
          {
            day: "friday",
            start_time: "09:00",
            end_time: "13:00",
            course_id: "CURSO025",
            course_name: "Gestión Empresarial Digital",
            teacher_name: "Isabel Moreno Pardo",
            color: "#6366f1"
          }
        ]
      },
      {
        id: "C2-SUR",
        name: "Estudio Fotográfico",
        capacity: 12,
        floor: 1,
        equipment: [
          "Iluminación profesional completa",
          "Fondos varios (blanco, negro, croma)",
          "Cámaras profesionales (2 unidades)",
          "Reflectores y difusores",
          "Mesa de producto",
          "Ordenadores de edición (3 unidades)"
        ],
        weekly_schedule: [
          {
            day: "tuesday",
            start_time: "10:00",
            end_time: "14:00",
            course_id: "CURSO016",
            course_name: "Fotografía de Producto Profesional",
            teacher_name: "Miguel Romero Castro",
            color: "#ef4444"
          },
          {
            day: "thursday",
            start_time: "10:00",
            end_time: "14:00",
            course_id: "CURSO017",
            course_name: "Retoque Fotográfico Avanzado",
            teacher_name: "Miguel Romero Castro",
            color: "#ef4444"
          }
        ]
      }
    ],
    active: true
  },
  {
    id: "C004",
    name: "CEP Online Campus",
    code: "ONLINE",
    address: "Campus Virtual",
    city: "Online",
    postal_code: "00000",
    phone: "+34 922 000 000",
    email: "online@cepcomunicacion.com",
    manager_name: "Silvia Navarro Gil",
    manager_email: "silvia.navarro@cepcomunicacion.com",
    opening_hours: "24/7 - Plataforma disponible siempre",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    description: "Campus virtual con plataforma LMS de última generación. Acceso desde cualquier lugar del mundo. Videoconferencias en directo, contenido grabado, foros, tutorías personalizadas y certificaciones oficiales.",
    facilities: [
      "Plataforma LMS Moodle personalizada",
      "Videoconferencias Zoom integradas",
      "Biblioteca digital con 1000+ recursos",
      "Tutorías online 1-a-1",
      "Foros de estudiantes",
      "App móvil para iOS y Android"
    ],
    classrooms: [],
    active: true
  }
]

// Export aliases for backward compatibility
export const teachersData = teachersExpanded
export const cyclesData = cycles

// ============================================
// CURSOS EXPANDIDOS (10 registros detallados)
// ============================================
export interface CourseDetailed {
  id: string
  name: string
  code: string
  type: 'privados' | 'ocupados' | 'desempleados' | 'teleformacion' | 'ciclo-medio' | 'ciclo-superior'
  modality: 'presencial' | 'semipresencial' | 'telematico'
  cycle_id?: string
  cycle_name?: string
  duration_hours: number
  price: number
  max_students: number
  current_students: number
  description: string // OBLIGATORIO
  objectives: string[]
  requirements: string[]
  syllabus: {
    module: string
    hours: number
    topics: string[]
  }[]
  teachers: {
    id: string
    name: string
    photo: string
  }[]
  campuses: {
    id: string
    name: string
    code: string
  }[]
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  start_date?: string
  end_date?: string
  enrollment_deadline?: string
  certificate_name?: string
}

export const coursesData: CourseDetailed[] = [
  {
    id: "CURSO001",
    name: "Community Manager Profesional",
    code: "CM-PRO-2025",
    type: "privados",
    modality: "semipresencial",
    cycle_id: "1",
    cycle_name: "Técnico Superior en Marketing y Publicidad",
    duration_hours: 120,
    price: 890,
    max_students: 25,
    current_students: 18,
    description: "Curso completo de gestión de redes sociales, estrategia de contenidos y analítica digital. Aprenderás a crear, implementar y medir estrategias efectivas en todas las plataformas sociales principales. Incluye prácticas reales con empresas colaboradoras y certificación reconocida por la industria.",
    objectives: [
      "Crear y gestionar estrategias de contenido para redes sociales (Facebook, Instagram, TikTok, LinkedIn, Twitter/X)",
      "Dominar herramientas de programación y analítica (Hootsuite, Buffer, Meta Business Suite, Google Analytics)",
      "Diseñar y ejecutar campañas publicitarias en Meta Ads y LinkedIn Ads con presupuesto controlado",
      "Gestionar crisis de reputación online y protocolo de respuesta en redes sociales",
      "Crear contenido visual atractivo con Canva y herramientas de edición básicas",
      "Interpretar métricas y elaborar informes de rendimiento para clientes"
    ],
    requirements: [
      "Conocimientos básicos de informática y navegación en internet",
      "Acceso a ordenador personal (Windows o Mac) e internet estable",
      "Tener perfiles personales activos en al menos 3 redes sociales",
      "Edad mínima: 16 años"
    ],
    syllabus: [
      {
        module: "Introducción al Social Media Marketing",
        hours: 15,
        topics: [
          "Ecosistema digital actual y evolución de redes sociales",
          "Principales plataformas: características y públicos objetivos",
          "Rol y responsabilidades del Community Manager",
          "Casos de éxito y fracasos en redes sociales"
        ]
      },
      {
        module: "Estrategia de Contenidos",
        hours: 20,
        topics: [
          "Definición de buyer persona y audiencia objetivo",
          "Creación de calendario editorial y plan de publicaciones",
          "Tipos de contenido: educativo, entretenimiento, promocional",
          "Copywriting para redes sociales y técnicas de engagement",
          "Storytelling de marca y voz de la empresa"
        ]
      },
      {
        module: "Gestión de Plataformas",
        hours: 25,
        topics: [
          "Facebook e Instagram: algoritmo, formatos, mejores prácticas",
          "LinkedIn: estrategia B2B y personal branding",
          "TikTok: tendencias, challenges y contenido viral",
          "Twitter/X: actualidad, engagement y gestión de crisis",
          "YouTube: estrategia de vídeo marketing y optimización SEO"
        ]
      },
      {
        module: "Publicidad en Redes Sociales",
        hours: 25,
        topics: [
          "Meta Ads Manager: configuración de campañas completas",
          "Segmentación avanzada y públicos personalizados",
          "Creatividades publicitarias: imágenes, vídeos, carruseles",
          "Presupuestos, pujas y optimización de costes",
          "LinkedIn Ads: campañas B2B y lead generation"
        ]
      },
      {
        module: "Herramientas y Analítica",
        hours: 20,
        topics: [
          "Hootsuite, Buffer y herramientas de programación",
          "Meta Business Suite y estadísticas nativas",
          "Google Analytics 4 para tráfico desde redes sociales",
          "Elaboración de informes y dashboards con Looker Studio",
          "KPIs clave: alcance, engagement, conversión, ROI"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 15,
        topics: [
          "Desarrollo de estrategia completa para marca real",
          "Presentación de plan de contenidos mensual",
          "Configuración y lanzamiento de campaña publicitaria",
          "Defensa del proyecto ante tribunal y compañeros"
        ]
      }
    ],
    teachers: [
      {
        id: "1",
        name: "María García Pérez",
        photo: "https://i.pravatar.cc/150?img=1"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      },
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      }
    ],
    status: "published",
    featured: true,
    start_date: "2025-02-01",
    end_date: "2025-05-30",
    enrollment_deadline: "2025-01-25",
    certificate_name: "Certificado Profesional en Community Management"
  },
  {
    id: "CURSO002",
    name: "SEO y SEM Avanzado",
    code: "SEO-SEM-ADV",
    type: "privados",
    modality: "presencial",
    cycle_id: "1",
    cycle_name: "Técnico Superior en Marketing y Publicidad",
    duration_hours: 80,
    price: 750,
    max_students: 20,
    current_students: 15,
    description: "Posicionamiento web orgánico (SEO) y campañas de pago (SEM) con Google Ads. Aprenderás a optimizar sitios web para aparecer en las primeras posiciones de Google y a crear campañas rentables de publicidad en buscadores. Incluye certificación oficial de Google Ads.",
    objectives: [
      "Optimizar sitios web para buscadores siguiendo las directrices de Google",
      "Realizar auditorías SEO técnicas completas con herramientas profesionales",
      "Investigar palabras clave y crear estrategias de contenido SEO",
      "Construir estrategias de link building éticas y efectivas",
      "Crear y optimizar campañas SEM rentables en Google Ads",
      "Analizar y mejorar el ROI de campañas de búsqueda pagada"
    ],
    requirements: [
      "Conocimientos básicos de marketing digital",
      "Comprensión de HTML y CSS (nivel básico)",
      "Acceso a un sitio web propio o de prueba (se puede proporcionar)"
    ],
    syllabus: [
      {
        module: "Fundamentos SEO",
        hours: 15,
        topics: [
          "Cómo funcionan los motores de búsqueda",
          "Algoritmos de Google y actualizaciones principales",
          "SEO On-Page vs Off-Page vs Técnico",
          "Herramientas esenciales: Google Search Console, Analytics, Ahrefs, SEMrush"
        ]
      },
      {
        module: "SEO Técnico",
        hours: 20,
        topics: [
          "Arquitectura web y estructura de URLs",
          "Velocidad de carga y Core Web Vitals",
          "Indexabilidad y rastreo: robots.txt, sitemap.xml",
          "Mobile-first indexing y responsive design",
          "Datos estructurados y rich snippets"
        ]
      },
      {
        module: "SEO On-Page",
        hours: 15,
        topics: [
          "Investigación de palabras clave con herramientas profesionales",
          "Optimización de títulos, meta descripciones y encabezados",
          "Contenido de calidad y estrategia de contenidos",
          "Imágenes: alt text, compresión, lazy loading",
          "Enlaces internos y siloing"
        ]
      },
      {
        module: "SEO Off-Page",
        hours: 10,
        topics: [
          "Link building: estrategias white-hat",
          "Guest posting y colaboraciones",
          "Digital PR y menciones de marca",
          "Análisis de backlinks y desautorización"
        ]
      },
      {
        module: "Google Ads (SEM)",
        hours: 20,
        topics: [
          "Estructura de cuentas y campañas en Google Ads",
          "Tipos de concordancia de palabras clave",
          "Redacción de anuncios efectivos y extensiones",
          "Estrategias de puja y presupuestos",
          "Quality Score y optimización de landing pages",
          "Remarketing y audiencias personalizadas"
        ]
      }
    ],
    teachers: [
      {
        id: "1",
        name: "María García Pérez",
        photo: "https://i.pravatar.cc/150?img=1"
      }
    ],
    campuses: [
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      }
    ],
    status: "published",
    featured: true,
    start_date: "2025-02-15",
    end_date: "2025-04-30",
    enrollment_deadline: "2025-02-08",
    certificate_name: "Certificado en SEO y SEM Avanzado + Google Ads Certification"
  },
  {
    id: "CURSO003",
    name: "Diseño UX/UI con Figma",
    code: "UX-UI-FIG",
    type: "privados",
    modality: "telematico",
    cycle_id: "1",
    cycle_name: "Técnico Superior en Marketing y Publicidad",
    duration_hours: 100,
    price: 680,
    max_students: 30,
    current_students: 22,
    description: "Diseño de interfaces y experiencias de usuario con metodologías ágiles y herramientas profesionales. Aprenderás a crear prototipos interactivos, realizar pruebas de usabilidad y aplicar principios de diseño centrado en el usuario. 100% online con clases en directo y proyecto final real.",
    objectives: [
      "Crear prototipos interactivos profesionales en Figma",
      "Aplicar principios de diseño centrado en el usuario (UCD)",
      "Realizar investigación de usuarios con entrevistas y encuestas",
      "Diseñar wireframes, mockups y prototipos de alta fidelidad",
      "Realizar pruebas de usabilidad y analizar resultados",
      "Implementar design systems y componentes reutilizables"
    ],
    requirements: [
      "Conocimientos básicos de diseño gráfico (recomendado pero no obligatorio)",
      "Ordenador con al menos 8GB RAM",
      "Cuenta gratuita en Figma"
    ],
    syllabus: [
      {
        module: "Fundamentos UX",
        hours: 20,
        topics: [
          "Qué es UX y por qué es importante",
          "Diferencias entre UX, UI y CX",
          "Metodología Design Thinking",
          "Investigación de usuarios: entrevistas, encuestas, personas",
          "Customer Journey Maps y User Flows"
        ]
      },
      {
        module: "Fundamentos UI",
        hours: 20,
        topics: [
          "Principios de diseño visual: jerarquía, contraste, espacio",
          "Teoría del color aplicada a interfaces",
          "Tipografía para pantallas",
          "Sistemas de grids y layouts responsivos",
          "Accesibilidad web (WCAG 2.1)"
        ]
      },
      {
        module: "Figma Avanzado",
        hours: 25,
        topics: [
          "Herramientas y atajos de Figma",
          "Auto Layout y constraints",
          "Componentes, variantes y propiedades",
          "Prototipos interactivos con animaciones",
          "Colaboración en tiempo real",
          "Plugins esenciales y flujo de trabajo optimizado"
        ]
      },
      {
        module: "Design Systems",
        hours: 15,
        topics: [
          "Qué es un design system y por qué crearlo",
          "Atomic Design: átomos, moléculas, organismos",
          "Creación de biblioteca de componentes",
          "Tokens de diseño y consistencia visual",
          "Documentación y handoff a desarrollo"
        ]
      },
      {
        module: "Testing y Validación",
        hours: 10,
        topics: [
          "Pruebas de usabilidad moderadas y no moderadas",
          "A/B testing y test multivariante",
          "Heatmaps y análisis de comportamiento",
          "Herramientas: Hotjar, Maze, UserTesting"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 10,
        topics: [
          "Desarrollo de app móvil o web completa",
          "Research, wireframes, diseño y prototipo",
          "Pruebas de usabilidad con usuarios reales",
          "Presentación del proyecto"
        ]
      }
    ],
    teachers: [
      {
        id: "3",
        name: "Laura Martínez Sosa",
        photo: "https://i.pravatar.cc/150?img=3"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-03-01",
    end_date: "2025-06-15",
    enrollment_deadline: "2025-02-22",
    certificate_name: "Certificado Profesional en Diseño UX/UI"
  },
  {
    id: "CURSO004",
    name: "Desarrollo Frontend con React",
    code: "REACT-2025",
    type: "ciclo-superior",
    modality: "presencial",
    cycle_id: "4",
    cycle_name: "Técnico Superior en Desarrollo de Aplicaciones Web",
    duration_hours: 150,
    price: 1200,
    max_students: 18,
    current_students: 12,
    description: "Desarrollo de aplicaciones web modernas con React, TypeScript, TailwindCSS y despliegue en producción. Aprenderás a crear SPAs escalables, gestionar estado complejo y desplegar aplicaciones en la nube. Incluye prácticas con proyectos reales de empresas.",
    objectives: [
      "Crear aplicaciones SPA con React 18+ y React Router",
      "Dominar TypeScript para desarrollo type-safe",
      "Gestionar estado con Context API, Zustand y React Query",
      "Estilizar componentes con TailwindCSS y CSS Modules",
      "Implementar autenticación JWT y protección de rutas",
      "Desplegar aplicaciones en Vercel/Netlify con CI/CD"
    ],
    requirements: [
      "JavaScript ES6+ nivel intermedio-avanzado",
      "HTML5 y CSS3 nivel avanzado",
      "Conocimientos de Git y GitHub",
      "Comprensión de conceptos de programación orientada a objetos"
    ],
    syllabus: [
      {
        module: "Fundamentos React",
        hours: 25,
        topics: [
          "JSX, componentes funcionales y hooks básicos",
          "useState, useEffect y ciclo de vida",
          "Props, children y composición de componentes",
          "Renderizado condicional y listas",
          "Eventos y formularios controlados"
        ]
      },
      {
        module: "TypeScript para React",
        hours: 20,
        topics: [
          "Tipos básicos e interfaces",
          "Tipado de props y hooks",
          "Generics y utility types",
          "Configuración de tsconfig.json"
        ]
      },
      {
        module: "Estado y Routing",
        hours: 30,
        topics: [
          "Context API y useContext",
          "React Router v6: rutas, navegación, parámetros",
          "Zustand para estado global ligero",
          "React Query para gestión de datos asíncronos",
          "Optimistic updates y cache"
        ]
      },
      {
        module: "Estilos y UI",
        hours: 25,
        topics: [
          "TailwindCSS: configuración y customización",
          "Componentes reutilizables con shadcn/ui",
          "CSS Modules y Styled Components",
          "Responsive design y mobile-first",
          "Animaciones con Framer Motion"
        ]
      },
      {
        module: "Autenticación y Seguridad",
        hours: 20,
        topics: [
          "JSON Web Tokens (JWT)",
          "Protected routes y roles",
          "OAuth 2.0 con Google/GitHub",
          "Secure storage y XSS prevention"
        ]
      },
      {
        module: "Testing y Deployment",
        hours: 20,
        topics: [
          "Vitest y React Testing Library",
          "Unit tests y integration tests",
          "GitHub Actions para CI/CD",
          "Deployment en Vercel y Netlify",
          "Environment variables y secrets"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 10,
        topics: [
          "Desarrollo de aplicación full-stack completa",
          "Integración con backend (Node.js/Express)",
          "Deploy a producción",
          "Presentación y defensa"
        ]
      }
    ],
    teachers: [
      {
        id: "2",
        name: "Carlos Rodríguez Martínez",
        photo: "https://i.pravatar.cc/150?img=2"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    status: "published",
    featured: true,
    start_date: "2025-02-10",
    end_date: "2025-07-15",
    enrollment_deadline: "2025-02-03",
    certificate_name: "Certificado Profesional en Desarrollo Frontend React"
  },
  {
    id: "CURSO005",
    name: "Backend con Node.js y PostgreSQL",
    code: "NODE-PSQL",
    type: "ciclo-superior",
    modality: "semipresencial",
    cycle_id: "4",
    cycle_name: "Técnico Superior en Desarrollo de Aplicaciones Web",
    duration_hours: 140,
    price: 1150,
    max_students: 18,
    current_students: 9,
    description: "Desarrollo de APIs REST con Node.js, Express, autenticación JWT y bases de datos relacionales. Aprenderás a construir backends escalables, seguros y bien documentados. Incluye integración con frontend React y despliegue en servidores cloud.",
    objectives: [
      "Diseñar y desarrollar APIs RESTful escalables con Express.js",
      "Implementar autenticación y autorización segura con JWT",
      "Trabajar con PostgreSQL y ORMs (Prisma/TypeORM)",
      "Validar datos con Zod y manejar errores correctamente",
      "Documentar APIs con Swagger/OpenAPI",
      "Desplegar en Railway/Render con Docker"
    ],
    requirements: [
      "JavaScript avanzado y comprensión de asincronía (Promises, async/await)",
      "Conocimientos de bases de datos SQL (SELECT, JOIN, WHERE)",
      "Git y terminal de comandos",
      "Conceptos de HTTP y arquitectura cliente-servidor"
    ],
    syllabus: [
      {
        module: "Node.js y Express",
        hours: 25,
        topics: [
          "Introducción a Node.js y el event loop",
          "NPM, package.json y gestión de dependencias",
          "Express: routing, middleware, controllers",
          "Request/Response cycle y manejo de errores",
          "CORS y seguridad básica"
        ]
      },
      {
        module: "PostgreSQL y ORMs",
        hours: 30,
        topics: [
          "Diseño de esquemas relacionales",
          "Prisma ORM: modelos, migraciones, relaciones",
          "Queries complejas y optimización",
          "Transacciones y atomicidad",
          "Indexación y performance"
        ]
      },
      {
        module: "Autenticación y Autorización",
        hours: 25,
        topics: [
          "Hashing de contraseñas con bcrypt",
          "JSON Web Tokens (JWT): creación y verificación",
          "Refresh tokens y token rotation",
          "Role-Based Access Control (RBAC)",
          "Rate limiting y brute-force protection"
        ]
      },
      {
        module: "Validación y Seguridad",
        hours: 20,
        topics: [
          "Validación de schemas con Zod",
          "SQL injection prevention",
          "XSS y CSRF protection",
          "Helmet.js y security headers",
          "Environment variables y secrets management"
        ]
      },
      {
        module: "Testing y Documentación",
        hours: 20,
        topics: [
          "Unit tests con Vitest",
          "Integration tests con Supertest",
          "Mocking de base de datos",
          "Swagger/OpenAPI para documentación",
          "Postman collections"
        ]
      },
      {
        module: "Deployment",
        hours: 20,
        topics: [
          "Docker: Dockerfile, docker-compose",
          "Deploy en Railway/Render",
          "PostgreSQL en Supabase/Neon",
          "Monitoring con Sentry",
          "CI/CD con GitHub Actions"
        ]
      }
    ],
    teachers: [
      {
        id: "2",
        name: "Carlos Rodríguez Martínez",
        photo: "https://i.pravatar.cc/150?img=2"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-03-15",
    end_date: "2025-07-30",
    enrollment_deadline: "2025-03-08"
  },
  {
    id: "CURSO006",
    name: "Redes Cisco CCNA",
    code: "CCNA-2025",
    type: "ciclo-medio",
    modality: "presencial",
    cycle_id: "3",
    cycle_name: "Técnico en Sistemas Microinformáticos y Redes",
    duration_hours: 200,
    price: 1500,
    max_students: 15,
    current_students: 15,
    description: "Preparación para certificación CCNA con configuración de routers, switches y protocolos de enrutamiento. Incluye laboratorios con equipos reales Cisco y simulador Packet Tracer. Al finalizar estarás preparado para el examen oficial CCNA 200-301.",
    objectives: [
      "Configurar dispositivos Cisco IOS mediante CLI",
      "Implementar VLANs, trunking y enrutamiento inter-VLAN",
      "Configurar protocolos de enrutamiento dinámico (OSPF, EIGRP)",
      "Implementar NAT, ACLs y seguridad básica",
      "Troubleshooting de redes complejas",
      "Aprobar el examen CCNA 200-301"
    ],
    requirements: [
      "Conocimientos básicos de redes TCP/IP",
      "Comprensión del modelo OSI",
      "Familiaridad con sistemas operativos (Windows/Linux)"
    ],
    syllabus: [
      {
        module: "Fundamentos de Redes",
        hours: 30,
        topics: [
          "Modelo OSI y TCP/IP",
          "Direccionamiento IPv4 y subnetting",
          "Introducción a IPv6",
          "Cables, conectores y medios de transmisión"
        ]
      },
      {
        module: "Switching",
        hours: 40,
        topics: [
          "Operación de switches y tabla MAC",
          "VLANs: creación, asignación, beneficios",
          "Trunking (802.1Q) y VTP",
          "STP, RSTP y PortFast",
          "EtherChannel y agregación de enlaces"
        ]
      },
      {
        module: "Routing",
        hours: 50,
        topics: [
          "Enrutamiento estático",
          "Routing dinámico: RIP, OSPF, EIGRP",
          "Default routes y rutas sumarias",
          "Inter-VLAN routing (router-on-a-stick, SVI)",
          "Métricas y administrative distance"
        ]
      },
      {
        module: "Servicios de Red",
        hours: 30,
        topics: [
          "DHCP: servidor, relay, snooping",
          "NAT: estática, dinámica, PAT",
          "ACLs: estándar y extendidas",
          "DNS y resolución de nombres"
        ]
      },
      {
        module: "Seguridad y Gestión",
        hours: 25,
        topics: [
          "Seguridad de switches (port security, DHCP snooping)",
          "SSH y acceso seguro a dispositivos",
          "SNMP para monitorización",
          "Syslog y troubleshooting"
        ]
      },
      {
        module: "Preparación Examen",
        hours: 25,
        topics: [
          "Repaso de todos los temas del temario CCNA",
          "Exámenes de práctica",
          "Laboratorios intensivos",
          "Estrategias para el examen oficial"
        ]
      }
    ],
    teachers: [
      {
        id: "6",
        name: "Miguel Hernández Castro",
        photo: "https://i.pravatar.cc/150?img=6"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-02-01",
    end_date: "2025-08-31",
    enrollment_deadline: "2025-01-25",
    certificate_name: "Preparación Certificación Cisco CCNA 200-301"
  },
  {
    id: "CURSO007",
    name: "Edición de Vídeo con Premiere Pro",
    code: "PREMIERE-PRO",
    type: "privados",
    modality: "presencial",
    cycle_id: "5",
    cycle_name: "Técnico Superior en Producción Audiovisual",
    duration_hours: 90,
    price: 820,
    max_students: 20,
    current_students: 14,
    description: "Edición profesional de vídeo, corrección de color, efectos visuales y exportación para diferentes plataformas. Aprenderás a editar vídeos profesionales para YouTube, redes sociales, publicidad y cine. Incluye proyecto final con material real de producción.",
    objectives: [
      "Dominar la interfaz y flujo de trabajo de Adobe Premiere Pro",
      "Aplicar transiciones, efectos y corrección de color profesional",
      "Editar audio: limpieza, mezcla, sincronización",
      "Trabajar con multicámara y proxies para proyectos 4K",
      "Exportar vídeos optimizados para YouTube, Instagram, TikTok",
      "Integración con After Effects y Adobe Audition"
    ],
    requirements: [
      "Conocimientos básicos de edición de vídeo (opcional)",
      "Ordenador potente: Intel i7/AMD Ryzen 7, 16GB RAM, GPU dedicada",
      "Adobe Creative Cloud (se puede usar versión de prueba)"
    ],
    syllabus: [
      {
        module: "Interfaz y Flujo de Trabajo",
        hours: 15,
        topics: [
          "Panels, workspaces y personalización",
          "Importación de medios y organización",
          "Secuencias y ajustes de proyecto",
          "Atajos de teclado esenciales",
          "Proxies y transcoding para rendimiento"
        ]
      },
      {
        module: "Edición Básica",
        hours: 20,
        topics: [
          "Herramientas de corte: razor, ripple, rolling",
          "Inserts, overwrite y tres puntos de edición",
          "Trim mode y refinamiento de cortes",
          "Transiciones: cortes, fundidos, wipes",
          "Velocidad y tiempo: slow motion, time remapping"
        ]
      },
      {
        module: "Color Grading",
        hours: 20,
        topics: [
          "Lumetri Color: ruedas, curvas, HSL",
          "Corrección de color primaria y secundaria",
          "LUTs y looks cinematográficos",
          "Matching de color entre clips",
          "Scopes: waveform, vectorscope, histogram"
        ]
      },
      {
        module: "Audio",
        hours: 15,
        topics: [
          "Sincronización de audio y vídeo",
          "Limpieza de audio con Essential Sound",
          "Mezcla de audio: música, diálogos, efectos",
          "Keyframes y automatización de volumen",
          "Integración con Adobe Audition"
        ]
      },
      {
        module: "Efectos y Motion Graphics",
        hours: 10,
        topics: [
          "Efectos de vídeo: estabilización, desenfoques",
          "Keyframes y animación de efectos",
          "Títulos y gráficos esenciales",
          "Dynamic Link con After Effects",
          "Masking y composición básica"
        ]
      },
      {
        module: "Exportación y Entrega",
        hours: 10,
        topics: [
          "Codecs y formatos: H.264, ProRes, DNxHD",
          "Ajustes para YouTube (1080p, 4K)",
          "Optimización para Instagram, TikTok, Facebook",
          "Media Encoder para batch export",
          "Archivado de proyectos"
        ]
      }
    ],
    teachers: [
      {
        id: "7",
        name: "Ana López Ruiz",
        photo: "https://i.pravatar.cc/150?img=7"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    status: "published",
    featured: true,
    start_date: "2025-02-20",
    end_date: "2025-05-15",
    enrollment_deadline: "2025-02-13",
    certificate_name: "Certificado Profesional en Edición de Vídeo"
  },
  {
    id: "CURSO008",
    name: "Marketing Digital para Desempleados",
    code: "MKT-DESEMP",
    type: "desempleados",
    modality: "semipresencial",
    duration_hours: 60,
    price: 0,
    max_students: 25,
    current_students: 20,
    description: "Curso gratuito de marketing digital básico para personas desempleadas con certificación oficial. Subvencionado 100% por el Servicio Canario de Empleo. Aprenderás los fundamentos del marketing digital, redes sociales y herramientas básicas para mejorar tu empleabilidad.",
    objectives: [
      "Conocer los fundamentos del marketing digital y sus canales",
      "Crear perfiles profesionales optimizados en LinkedIn",
      "Gestionar páginas de empresa en redes sociales",
      "Realizar campañas básicas en Facebook e Instagram",
      "Utilizar Google My Business para negocios locales",
      "Obtener certificación oficial de empleabilidad digital"
    ],
    requirements: [
      "Estar en situación de desempleo inscrito en el DARDE (Servicio Canario de Empleo)",
      "Conocimientos básicos de informática y navegación web",
      "Disponer de ordenador e internet para clases online"
    ],
    syllabus: [
      {
        module: "Introducción al Marketing Digital",
        hours: 10,
        topics: [
          "Qué es el marketing digital y sus ventajas",
          "Canales principales: web, email, redes, buscadores",
          "Casos de éxito de pequeñas empresas",
          "Herramientas gratuitas esenciales"
        ]
      },
      {
        module: "Redes Sociales Básicas",
        hours: 20,
        topics: [
          "Creación y optimización de perfil de LinkedIn",
          "Páginas de Facebook para negocios",
          "Instagram Business y publicaciones efectivas",
          "Estrategia básica de contenidos",
          "Programación con Meta Business Suite"
        ]
      },
      {
        module: "Google My Business",
        hours: 10,
        topics: [
          "Creación de ficha de empresa en Google",
          "Optimización para búsquedas locales",
          "Gestión de reseñas",
          "Publicaciones y actualizaciones"
        ]
      },
      {
        module: "Email Marketing Básico",
        hours: 10,
        topics: [
          "Herramientas gratuitas: Mailchimp, Brevo",
          "Creación de campañas sencillas",
          "Listas de contactos y segmentación básica",
          "Análisis de resultados"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 10,
        topics: [
          "Desarrollo de estrategia digital para negocio propio o simulado",
          "Presentación de plan de acción",
          "Obtención de certificado oficial"
        ]
      }
    ],
    teachers: [
      {
        id: "1",
        name: "María García Pérez",
        photo: "https://i.pravatar.cc/150?img=1"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      },
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-03-01",
    end_date: "2025-04-15",
    enrollment_deadline: "2025-02-20",
    certificate_name: "Certificado Oficial de Empleabilidad Digital (SCE)"
  },
  {
    id: "CURSO009",
    name: "Excel Avanzado para Empresas",
    code: "EXCEL-ADV-EMP",
    type: "ocupados",
    modality: "telematico",
    duration_hours: 40,
    price: 0,
    max_students: 35,
    current_students: 28,
    description: "Bonificado por FUNDAE para trabajadores en activo. Tablas dinámicas, macros y automatización con VBA. Aprenderás a dominar Excel a nivel profesional para análisis de datos, informes automáticos y dashboards interactivos. 100% bonificable por la Seguridad Social.",
    objectives: [
      "Crear tablas dinámicas y gráficos avanzados para análisis de datos",
      "Automatizar tareas repetitivas con macros y VBA básico",
      "Trabajar con bases de datos en Excel: filtros, tablas, Power Query",
      "Crear dashboards interactivos con segmentadores y gráficos dinámicos",
      "Dominar funciones avanzadas: BUSCARV, SI.ERROR, SUMAR.SI.CONJUNTO",
      "Proteger y compartir libros de trabajo de forma segura"
    ],
    requirements: [
      "Estar dado de alta en el régimen general de la Seguridad Social (trabajador en activo)",
      "Excel nivel básico-intermedio (conocer fórmulas básicas, formato de celdas)",
      "Microsoft Excel 2016 o superior (Office 365 recomendado)"
    ],
    syllabus: [
      {
        module: "Funciones Avanzadas",
        hours: 10,
        topics: [
          "BUSCARV, BUSCARH, INDICE, COINCIDIR",
          "Funciones lógicas avanzadas: SI.ERROR, Y, O",
          "Funciones de fecha y hora",
          "Funciones de texto: CONCATENAR, EXTRAE, ENCONTRAR",
          "Funciones estadísticas: CONTAR.SI, SUMAR.SI.CONJUNTO"
        ]
      },
      {
        module: "Tablas Dinámicas",
        hours: 10,
        topics: [
          "Creación y configuración de tablas dinámicas",
          "Agrupación de datos por fechas, rangos, categorías",
          "Campos calculados y elementos calculados",
          "Gráficos dinámicos y segmentadores",
          "Actualización y refresh de datos"
        ]
      },
      {
        module: "Power Query y Power Pivot",
        hours: 10,
        topics: [
          "Importación de datos desde múltiples fuentes",
          "Transformación y limpieza de datos con Power Query",
          "Combinar consultas (merge y append)",
          "Introducción a Power Pivot y modelo de datos",
          "Medidas DAX básicas"
        ]
      },
      {
        module: "Automatización con Macros",
        hours: 10,
        topics: [
          "Grabadora de macros",
          "Edición básica de código VBA",
          "Automatización de tareas repetitivas",
          "Botones y controles de formulario",
          "Debugging y gestión de errores"
        ]
      }
    ],
    teachers: [
      {
        id: "5",
        name: "Pedro Sánchez Díaz",
        photo: "https://i.pravatar.cc/150?img=5"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    status: "published",
    featured: false,
    start_date: "2025-03-10",
    end_date: "2025-04-10",
    enrollment_deadline: "2025-03-03",
    certificate_name: "Certificado FUNDAE Excel Avanzado Empresarial"
  },
  {
    id: "CURSO010",
    name: "Inteligencia Artificial para Marketing",
    code: "AI-MKT-2025",
    type: "privados",
    modality: "telematico",
    duration_hours: 50,
    price: 590,
    max_students: 40,
    current_students: 0,
    description: "Uso de ChatGPT, Midjourney y herramientas IA para automatizar tareas de marketing y crear contenido. Aprenderás a utilizar las últimas herramientas de inteligencia artificial para generar textos, imágenes, vídeos y automatizar workflows completos de marketing. Próximamente en marzo 2025.",
    objectives: [
      "Generar textos publicitarios profesionales con ChatGPT y Claude",
      "Crear imágenes para redes sociales con Midjourney y DALL-E 3",
      "Automatizar workflows de marketing con Make y Zapier + IA",
      "Generar vídeos con IA: scripts, locución, edición",
      "Análisis de datos y predicciones con herramientas IA",
      "Ética y limitaciones de la IA en marketing"
    ],
    requirements: [
      "Conocimientos básicos de marketing digital",
      "Familiaridad con redes sociales y creación de contenido",
      "No se requieren conocimientos técnicos o programación"
    ],
    syllabus: [
      {
        module: "Fundamentos IA para Marketing",
        hours: 8,
        topics: [
          "Qué es la IA generativa y cómo funciona",
          "Principales herramientas: ChatGPT, Claude, Gemini",
          "Prompt engineering: técnicas y mejores prácticas",
          "Limitaciones y sesgos de los modelos de IA",
          "Aspectos legales: derechos de autor, privacidad"
        ]
      },
      {
        module: "Generación de Textos",
        hours: 12,
        topics: [
          "ChatGPT para copywriting: ads, emails, landing pages",
          "Creación de calendarios de contenido automatizados",
          "Generación de artículos de blog optimizados para SEO",
          "Personalización masiva de mensajes",
          "Traducción y adaptación multiidioma"
        ]
      },
      {
        module: "Generación de Imágenes",
        hours: 10,
        topics: [
          "Midjourney: prompts avanzados y estilos",
          "DALL-E 3 y Adobe Firefly",
          "Generación de logos, mockups y diseños",
          "Edición de imágenes con IA: remove.bg, Photoshop IA",
          "Consideraciones éticas y watermarks"
        ]
      },
      {
        module: "Vídeo y Audio",
        hours: 8,
        topics: [
          "Generación de scripts de vídeo con IA",
          "Text-to-speech profesional: ElevenLabs, Play.ht",
          "Generación de vídeos con IA: Synthesia, D-ID",
          "Subtitulado automático y traducción",
          "Edición automatizada con IA"
        ]
      },
      {
        module: "Automatización y Análisis",
        hours: 10,
        topics: [
          "Zapier y Make para workflows automáticos",
          "Integración de IA en CRM y email marketing",
          "Análisis predictivo y segmentación con IA",
          "Chatbots inteligentes para atención al cliente",
          "A/B testing automatizado con IA"
        ]
      },
      {
        module: "Proyecto Final",
        hours: 2,
        topics: [
          "Desarrollo de campaña completa con herramientas IA",
          "Presentación de resultados y ROI",
          "Mejores prácticas y lecciones aprendidas"
        ]
      }
    ],
    teachers: [
      {
        id: "1",
        name: "María García Pérez",
        photo: "https://i.pravatar.cc/150?img=1"
      },
      {
        id: "3",
        name: "Laura Martínez Sosa",
        photo: "https://i.pravatar.cc/150?img=3"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    status: "draft",
    featured: false,
    start_date: "2025-03-15",
    enrollment_deadline: "2025-03-08",
    certificate_name: "Certificado Profesional en IA para Marketing"
  }
]

// ============================================
// CAMPAÑAS (10 registros)
// ============================================
export interface CampaignDetailed {
  id: string
  name: string
  code: string
  type: 'email' | 'social' | 'paid_ads' | 'organic' | 'event' | 'referral'
  status: 'activa' | 'pausada' | 'finalizada' | 'borrador'
  description: string // OBLIGATORIA
  start_date: string
  end_date: string
  budget: number
  spent: number
  objectives: {
    target_leads: number
    target_enrollments: number
  }
  metrics: {
    total_leads: number
    total_enrollments: number
    conversion_rate: number
    cost_per_lead: number
    cost_per_enrollment: number
  }
  utm_params: {
    utm_source: string
    utm_medium: string
    utm_campaign: string
    utm_term?: string
    utm_content?: string
  }
  courses: {
    id: string
    name: string
    code: string
  }[]
  campuses: {
    id: string
    name: string
    code: string
  }[]
  created_by: string
  created_at: string
}

export const campaignsData: CampaignDetailed[] = [
  {
    id: "CAMP001",
    name: "Lanzamiento Cursos Marketing Digital 2025",
    code: "MKT-LAUNCH-2025-Q1",
    type: "paid_ads",
    status: "activa",
    description: "Campaña de lanzamiento de cursos de marketing digital para el primer trimestre 2025. Incluye Meta Ads (Facebook e Instagram), Google Ads y remarketing. Objetivo: captar 150 leads cualificados con tasa de conversión mínima del 15%. Público objetivo: profesionales de 25-45 años interesados en upskilling digital.",
    start_date: "2025-01-15",
    end_date: "2025-03-31",
    budget: 3500,
    spent: 1850,
    objectives: {
      target_leads: 150,
      target_enrollments: 25
    },
    metrics: {
      total_leads: 87,
      total_enrollments: 14,
      conversion_rate: 16.1,
      cost_per_lead: 21.26,
      cost_per_enrollment: 132.14
    },
    utm_params: {
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "mkt-launch-2025-q1",
      utm_content: "carousel-testimonials"
    },
    courses: [
      {
        id: "CURSO001",
        name: "Community Manager Profesional",
        code: "CM-PRO-2025"
      },
      {
        id: "CURSO002",
        name: "SEO y SEM Avanzado",
        code: "SEO-SEM-ADV"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      },
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      }
    ],
    created_by: "María García Pérez",
    created_at: "2025-01-10"
  },
  {
    id: "CAMP002",
    name: "Email Nurturing - Cursos Desarrollo Web",
    code: "EMAIL-DEV-NURTURE-Q1",
    type: "email",
    status: "activa",
    description: "Secuencia de 8 emails automatizada para leads que descargaron el ebook 'Guía de Desarrollo Web 2025'. Segmentación por nivel de experiencia (principiante, intermedio, avanzado). Contenido educativo + ofertas exclusivas de cursos React y Node.js. Objetivo: conversión del 8% de la lista.",
    start_date: "2025-02-01",
    end_date: "2025-04-30",
    budget: 450,
    spent: 180,
    objectives: {
      target_leads: 300,
      target_enrollments: 24
    },
    metrics: {
      total_leads: 156,
      total_enrollments: 11,
      conversion_rate: 7.05,
      cost_per_lead: 1.15,
      cost_per_enrollment: 16.36
    },
    utm_params: {
      utm_source: "mailchimp",
      utm_medium: "email",
      utm_campaign: "dev-nurture-q1",
      utm_content: "ebook-download"
    },
    courses: [
      {
        id: "CURSO004",
        name: "Desarrollo Frontend con React",
        code: "REACT-2025"
      },
      {
        id: "CURSO005",
        name: "Backend con Node.js y PostgreSQL",
        code: "NODE-PSQL"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    created_by: "Carlos Rodríguez Martínez",
    created_at: "2025-01-25"
  },
  {
    id: "CAMP003",
    name: "Webinar Gratuito - Introducción a UX/UI",
    code: "WEBINAR-UX-FEB",
    type: "event",
    status: "finalizada",
    description: "Webinar online gratuito de 90 minutos sobre fundamentos de diseño UX/UI. Incluye demostración en vivo con Figma y Q&A. Estrategia de lead magnet para conversión posterior a curso completo de UX/UI. Promoción vía redes sociales orgánicas (LinkedIn, Instagram) + email marketing a base de datos existente.",
    start_date: "2025-02-15",
    end_date: "2025-02-15",
    budget: 150,
    spent: 150,
    objectives: {
      target_leads: 100,
      target_enrollments: 8
    },
    metrics: {
      total_leads: 142,
      total_enrollments: 12,
      conversion_rate: 8.45,
      cost_per_lead: 1.06,
      cost_per_enrollment: 12.50
    },
    utm_params: {
      utm_source: "linkedin",
      utm_medium: "organic",
      utm_campaign: "webinar-ux-feb",
      utm_content: "event-post"
    },
    courses: [
      {
        id: "CURSO003",
        name: "Diseño UX/UI con Figma",
        code: "UX-UI-FIG"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    created_by: "Laura Martínez Sosa",
    created_at: "2025-01-30"
  },
  {
    id: "CAMP004",
    name: "Campaña Orgánica Instagram - Cursos Audiovisuales",
    code: "INSTA-AV-ORGANIC-Q1",
    type: "organic",
    status: "activa",
    description: "Estrategia de contenido orgánico en Instagram enfocada en cursos audiovisuales (edición vídeo, fotografía, motion graphics). Publicación diaria: carruseles educativos, reels con tips, testimonios de alumnos. Uso de hashtags específicos del sector audiovisual. Colaboraciones con influencers locales del sector creativo. Objetivo: crecimiento de 500 seguidores mensuales y 50 leads orgánicos.",
    start_date: "2025-01-01",
    end_date: "2025-03-31",
    budget: 200,
    spent: 120,
    objectives: {
      target_leads: 150,
      target_enrollments: 10
    },
    metrics: {
      total_leads: 68,
      total_enrollments: 5,
      conversion_rate: 7.35,
      cost_per_lead: 1.76,
      cost_per_enrollment: 24.00
    },
    utm_params: {
      utm_source: "instagram",
      utm_medium: "organic",
      utm_campaign: "av-organic-q1",
      utm_content: "bio-link"
    },
    courses: [
      {
        id: "CURSO007",
        name: "Edición de Vídeo con Premiere Pro",
        code: "PREMIERE-PRO"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    created_by: "Ana López Ruiz",
    created_at: "2024-12-20"
  },
  {
    id: "CAMP005",
    name: "Programa de Referencias - Alumnos Actuales",
    code: "REFERRAL-2025-CONTINUOUS",
    type: "referral",
    status: "activa",
    description: "Programa de incentivos para alumnos actuales que recomienden CEP a amigos/conocidos. Por cada referido matriculado, el alumno recibe 50€ de descuento en su próximo curso + el nuevo alumno recibe 25€ de descuento. Sistema de tracking mediante códigos únicos. Comunicación vía email mensual + cartelería en sedes físicas.",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    budget: 1000,
    spent: 175,
    objectives: {
      target_leads: 80,
      target_enrollments: 30
    },
    metrics: {
      total_leads: 23,
      total_enrollments: 9,
      conversion_rate: 39.13,
      cost_per_lead: 7.61,
      cost_per_enrollment: 19.44
    },
    utm_params: {
      utm_source: "referral",
      utm_medium: "word-of-mouth",
      utm_campaign: "referral-2025",
      utm_content: "student-code"
    },
    courses: [], // Aplica a todos los cursos
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      },
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      },
      {
        id: "C003",
        name: "CEP Sur",
        code: "SUR"
      }
    ],
    created_by: "Pedro Sánchez Díaz",
    created_at: "2024-12-15"
  },
  {
    id: "CAMP006",
    name: "Google Ads - Certificaciones Cisco",
    code: "GOOGLE-CISCO-Q1",
    type: "paid_ads",
    status: "pausada",
    description: "Campaña de búsqueda en Google Ads enfocada en keywords de certificaciones Cisco (CCNA, CCNP). Incluye Display Ads con remarketing. Segmentación: profesionales IT de 25-50 años. Landing page específica con testimonios de alumnos certificados + comparativa de precios vs competencia. Pausada temporalmente por optimización de landing page.",
    start_date: "2025-01-20",
    end_date: "2025-04-20",
    budget: 2000,
    spent: 650,
    objectives: {
      target_leads: 60,
      target_enrollments: 15
    },
    metrics: {
      total_leads: 18,
      total_enrollments: 3,
      conversion_rate: 16.67,
      cost_per_lead: 36.11,
      cost_per_enrollment: 216.67
    },
    utm_params: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "cisco-q1",
      utm_term: "certificacion-ccna"
    },
    courses: [
      {
        id: "CURSO006",
        name: "Redes Cisco CCNA",
        code: "CCNA-2025"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    created_by: "Miguel Hernández Castro",
    created_at: "2025-01-12"
  },
  {
    id: "CAMP007",
    name: "Social Media - Cursos Desempleados Gratuitos",
    code: "SOCIAL-DESEMP-Q1",
    type: "social",
    status: "activa",
    description: "Campaña social orgánica + paid para promocionar cursos gratuitos subvencionados para desempleados. Contenido empático enfocado en reinserción laboral y mejora de empleabilidad. Publicaciones en Facebook (orgánico + ads) + Instagram Stories. Colaboración con oficinas de empleo del Cabildo. Público: desempleados inscritos en DARDE de 30-55 años.",
    start_date: "2025-02-01",
    end_date: "2025-03-15",
    budget: 800,
    spent: 420,
    objectives: {
      target_leads: 120,
      target_enrollments: 40
    },
    metrics: {
      total_leads: 78,
      total_enrollments: 28,
      conversion_rate: 35.90,
      cost_per_lead: 5.38,
      cost_per_enrollment: 15.00
    },
    utm_params: {
      utm_source: "facebook",
      utm_medium: "cpc",
      utm_campaign: "desemp-q1",
      utm_content: "carousel-testimonials"
    },
    courses: [
      {
        id: "CURSO008",
        name: "Marketing Digital para Desempleados",
        code: "MKT-DESEMP"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      },
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      }
    ],
    created_by: "María García Pérez",
    created_at: "2025-01-22"
  },
  {
    id: "CAMP008",
    name: "Email FUNDAE - Empresas Sector Tech",
    code: "EMAIL-FUNDAE-TECH",
    type: "email",
    status: "borrador",
    description: "Campaña de email marketing B2B dirigida a responsables de RRHH de empresas tecnológicas locales. Promoción de cursos bonificables FUNDAE (Excel, Power BI, Python). Base de datos segmentada: 200 empresas del sector tech con más de 10 empleados. Email personalizado por nombre de empresa. Incluye calculadora de bonificación FUNDAE. Próximo lanzamiento en marzo 2025.",
    start_date: "2025-03-01",
    end_date: "2025-05-31",
    budget: 300,
    spent: 0,
    objectives: {
      target_leads: 40,
      target_enrollments: 15
    },
    metrics: {
      total_leads: 0,
      total_enrollments: 0,
      conversion_rate: 0,
      cost_per_lead: 0,
      cost_per_enrollment: 0
    },
    utm_params: {
      utm_source: "mailchimp",
      utm_medium: "email",
      utm_campaign: "fundae-tech",
      utm_content: "b2b-cold"
    },
    courses: [
      {
        id: "CURSO009",
        name: "Excel Avanzado para Empresas",
        code: "EXCEL-ADV-EMP"
      }
    ],
    campuses: [
      {
        id: "C004",
        name: "CEP Online",
        code: "ONLINE"
      }
    ],
    created_by: "Pedro Sánchez Díaz",
    created_at: "2025-02-10"
  },
  {
    id: "CAMP009",
    name: "Retargeting - Abandonos Carrito Matrícula",
    code: "RETARGET-CART-ABANDON",
    type: "paid_ads",
    status: "activa",
    description: "Campaña de retargeting en Meta Ads (Facebook + Instagram) dirigida a usuarios que iniciaron proceso de matrícula pero no completaron pago. Audiencia custom de píxel de Meta. Creatividades con incentivo: 10% descuento por finalizar matrícula en 48h. Secuencia de 3 impactos en 7 días. ROI esperado: 300%.",
    start_date: "2025-02-05",
    end_date: "2025-12-31",
    budget: 1200,
    spent: 380,
    objectives: {
      target_leads: 0,
      target_enrollments: 35
    },
    metrics: {
      total_leads: 0,
      total_enrollments: 18,
      conversion_rate: 0,
      cost_per_lead: 0,
      cost_per_enrollment: 21.11
    },
    utm_params: {
      utm_source: "meta",
      utm_medium: "retargeting",
      utm_campaign: "cart-abandon",
      utm_content: "discount-10pct"
    },
    courses: [], // Aplica a todos
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      },
      {
        id: "C002",
        name: "CEP Santa Cruz",
        code: "SANTA-CRUZ"
      },
      {
        id: "C003",
        name: "CEP Sur",
        code: "SUR"
      }
    ],
    created_by: "Laura Martínez Sosa",
    created_at: "2025-01-28"
  },
  {
    id: "CAMP010",
    name: "LinkedIn Organic - Thought Leadership IT",
    code: "LINKEDIN-IT-ORGANIC",
    type: "organic",
    status: "finalizada",
    description: "Estrategia de contenido orgánico en LinkedIn para posicionar a CEP como referente en formación IT. Publicaciones semanales con artículos técnicos, casos de éxito de alumnos empleados tras cursos, tendencias del sector. Engagement con comunidad IT local. Objetivo: generar autoridad de marca y leads cualificados de alto valor (empresas grandes).",
    start_date: "2024-12-01",
    end_date: "2025-01-31",
    budget: 100,
    spent: 100,
    objectives: {
      target_leads: 25,
      target_enrollments: 8
    },
    metrics: {
      total_leads: 31,
      total_enrollments: 10,
      conversion_rate: 32.26,
      cost_per_lead: 3.23,
      cost_per_enrollment: 10.00
    },
    utm_params: {
      utm_source: "linkedin",
      utm_medium: "organic",
      utm_campaign: "it-thought-leadership",
      utm_content: "article-post"
    },
    courses: [
      {
        id: "CURSO004",
        name: "Desarrollo Frontend con React",
        code: "REACT-2025"
      },
      {
        id: "CURSO005",
        name: "Backend con Node.js y PostgreSQL",
        code: "NODE-PSQL"
      },
      {
        id: "CURSO006",
        name: "Redes Cisco CCNA",
        code: "CCNA-2025"
      }
    ],
    campuses: [
      {
        id: "C001",
        name: "CEP Norte",
        code: "NORTE"
      }
    ],
    created_by: "Carlos Rodríguez Martínez",
    created_at: "2024-11-25"
  }
]

// ============================================
// ESTUDIANTES - CON CURSOS MATRICULADOS
// ============================================
export interface Student {
  id: string
  first_name: string
  last_name: string
  initials: string
  email: string
  phone: string
  dni: string
  date_of_birth: string
  photo?: string
  address: string
  city: string
  postal_code: string
  campus_id: string
  emergency_contact: string
  emergency_phone: string
  enrolled_courses: {
    id: string
    name: string
    code: string
    status: 'active' | 'completed' | 'dropped'
    grade?: number
  }[]
  academic_notes: string // OBLIGATORIO
  status: 'active' | 'inactive' | 'graduated'
}

export const studentsData: Student[] = [
  {
    id: "S001",
    first_name: "Ana",
    last_name: "Martín López",
    initials: "AM",
    dni: "12345678A",
    date_of_birth: "1998-05-15",
    email: "ana.martin@email.com",
    phone: "+34 612 345 001",
    photo: "https://i.pravatar.cc/150?img=10",
    address: "Calle Mayor 45, 3º B",
    city: "San Cristóbal de La Laguna",
    postal_code: "38200",
    campus_id: "C001",
    emergency_contact: "María López García",
    emergency_phone: "+34 612 111 001",
    status: "active",
    academic_notes: "Alumna destacada con excelente participación en clase. Demuestra gran interés por las redes sociales y marketing digital. Ha completado todos los proyectos con nota superior a 85. Participa activamente en debates y aporta ideas creativas. Recomendada para prácticas en empresas del sector.",
    enrolled_courses: [
      { id: "CURSO001", name: "Community Manager Profesional", code: "CM-2025", status: "active", grade: 88 },
      { id: "CURSO002", name: "SEO y SEM Avanzado", code: "SEO-2025", status: "active", grade: 92 }
    ]
  },
  {
    id: "S002",
    first_name: "Carlos",
    last_name: "Rodríguez Pérez",
    initials: "CR",
    dni: "23456789B",
    date_of_birth: "1997-08-22",
    email: "carlos.rodriguez@email.com",
    phone: "+34 612 345 002",
    photo: "https://i.pravatar.cc/150?img=12",
    address: "Avenida Trinidad 78, 1º A",
    city: "Santa Cruz de Tenerife",
    postal_code: "38005",
    campus_id: "C002",
    emergency_contact: "José Rodríguez Martín",
    emergency_phone: "+34 612 111 002",
    status: "active",
    academic_notes: "Estudiante con sólidas bases técnicas en desarrollo web. Destaca en programación frontend y tiene experiencia previa en HTML/CSS. Necesita mejorar trabajo en equipo pero individualmente entrega proyectos de alta calidad. Ha asistido a todos los talleres opcionales.",
    enrolled_courses: [
      { id: "CURSO004", name: "Desarrollo Frontend con React", code: "REACT-2025", status: "active", grade: 90 },
      { id: "CURSO005", name: "Backend con Node.js", code: "NODE-PSQL", status: "active", grade: 85 }
    ]
  },
  {
    id: "S003",
    first_name: "Laura",
    last_name: "González Sánchez",
    initials: "LG",
    dni: "34567890C",
    date_of_birth: "1999-02-10",
    email: "laura.gonzalez@email.com",
    phone: "+34 612 345 003",
    photo: "https://i.pravatar.cc/150?img=20",
    address: "Calle La Rosa 23, Bajo",
    city: "Santa Cruz de Tenerife",
    postal_code: "38001",
    campus_id: "C002",
    emergency_contact: "Carmen Sánchez Torres",
    emergency_phone: "+34 612 111 003",
    status: "graduated",
    academic_notes: "Graduada con honores. Completó el ciclo formativo con nota media de 9.2. Destacó en proyectos de diseño visual y branding. Obtuvo prácticas en agencia reconocida durante el último trimestre. Actualmente trabaja como diseñadora junior en el sector.",
    enrolled_courses: [
      { id: "CURSO003", name: "Diseño UX/UI con Figma", code: "UXUI-2024", status: "completed", grade: 94 },
      { id: "CURSO006", name: "Design Systems Profesional", code: "DS-2024", status: "completed", grade: 91 }
    ]
  },
  {
    id: "S004",
    first_name: "David",
    last_name: "Fernández Torres",
    initials: "DF",
    dni: "45678901D",
    date_of_birth: "2000-11-03",
    email: "david.fernandez@email.com",
    phone: "+34 612 345 004",
    photo: "https://i.pravatar.cc/150?img=15",
    address: "Calle Tabares 56, 2º D",
    city: "San Cristóbal de La Laguna",
    postal_code: "38201",
    campus_id: "C001",
    emergency_contact: "Ana Torres Ruiz",
    emergency_phone: "+34 612 111 004",
    status: "active",
    academic_notes: "Alumno con potencial pero asistencia irregular durante el primer mes. Ha mejorado significativamente tras mentoría personalizada. Demuestra habilidades en edición de vídeo y motion graphics. Pendiente recuperar 2 entregas atrasadas antes de finalizar trimestre.",
    enrolled_courses: [
      { id: "CURSO007", name: "Edición de Vídeo Profesional", code: "VIDEO-2025", status: "active", grade: 75 },
      { id: "CURSO008", name: "Motion Graphics con After Effects", code: "MOGRAPH-2025", status: "active", grade: 78 }
    ]
  },
  {
    id: "S005",
    first_name: "Elena",
    last_name: "Jiménez Mora",
    initials: "EJ",
    dni: "56789012E",
    date_of_birth: "1998-07-19",
    email: "elena.jimenez@email.com",
    phone: "+34 612 345 005",
    photo: "https://i.pravatar.cc/150?img=25",
    address: "Avenida Los Menceyes 90, 4º C",
    city: "San Cristóbal de La Laguna",
    postal_code: "38205",
    campus_id: "C001",
    emergency_contact: "Pedro Jiménez Vega",
    emergency_phone: "+34 612 111 005",
    status: "inactive",
    academic_notes: "Alumna que solicitó baja temporal por motivos personales tras completar el 60% del programa. Buen rendimiento académico previo (nota media 8.5). Expreso interés en retomar estudios en próxima convocatoria. Mantiene contacto con departamento académico.",
    enrolled_courses: [
      { id: "CURSO009", name: "Analítica Web con Google Analytics", code: "GA4-2025", status: "dropped" },
      { id: "CURSO010", name: "Email Marketing Avanzado", code: "EMAIL-2025", status: "dropped" }
    ]
  },
  {
    id: "S006",
    first_name: "Miguel",
    last_name: "Castro Díaz",
    initials: "MC",
    dni: "67890123F",
    date_of_birth: "1999-12-08",
    email: "miguel.castro@email.com",
    phone: "+34 612 345 006",
    photo: "https://i.pravatar.cc/150?img=33",
    address: "Calle San Agustín 12, 1º Izq",
    city: "Santa Cruz de Tenerife",
    postal_code: "38003",
    campus_id: "C002",
    emergency_contact: "Rosa Díaz Suárez",
    emergency_phone: "+34 612 111 006",
    status: "active",
    academic_notes: "Alumno muy motivado con background previo en administración. Está realizando transición profesional hacia marketing digital. Destaca por su capacidad analítica y visión estratégica. Excelente en presentaciones orales y trabajo en equipo. Potencial para liderar proyectos grupales.",
    enrolled_courses: [
      { id: "CURSO001", name: "Community Manager Profesional", code: "CM-2025", status: "active", grade: 87 },
      { id: "CURSO009", name: "Analítica Web con Google Analytics", code: "GA4-2025", status: "active", grade: 93 }
    ]
  },
  {
    id: "S007",
    first_name: "Sara",
    last_name: "Ruiz Morales",
    initials: "SR",
    dni: "78901234G",
    date_of_birth: "2001-04-25",
    email: "sara.ruiz@email.com",
    phone: "+34 612 345 007",
    photo: "https://i.pravatar.cc/150?img=28",
    address: "Calle El Pilar 34, 3º A",
    city: "San Cristóbal de La Laguna",
    postal_code: "38202",
    campus_id: "C001",
    emergency_contact: "Luis Ruiz Delgado",
    emergency_phone: "+34 612 111 007",
    status: "active",
    academic_notes: "Alumna proactiva con gran creatividad visual. Ha ganado el concurso interno de diseño de campaña social. Demuestra dominio avanzado de herramientas Adobe. Participa activamente en eventos del centro. Recomendada para representar el centro en concursos regionales de diseño.",
    enrolled_courses: [
      { id: "CURSO003", name: "Diseño UX/UI con Figma", code: "UXUI-2025", status: "active", grade: 95 },
      { id: "CURSO011", name: "Branding y Diseño de Identidad", code: "BRAND-2025", status: "active", grade: 90 }
    ]
  },
  {
    id: "S008",
    first_name: "Javier",
    last_name: "Ortiz Navarro",
    initials: "JO",
    dni: "89012345H",
    date_of_birth: "1997-09-14",
    email: "javier.ortiz@email.com",
    phone: "+34 612 345 008",
    photo: "https://i.pravatar.cc/150?img=51",
    address: "Avenida Canarias 67, 2º B",
    city: "Santa Cruz de Tenerife",
    postal_code: "38007",
    campus_id: "C002",
    emergency_contact: "Marta Navarro Gil",
    emergency_phone: "+34 612 111 008",
    status: "graduated",
    academic_notes: "Graduado en 2024 con especialización en desarrollo backend. Completó proyecto final sobre arquitectura de microservicios que fue presentado en evento tech local. Actualmente trabaja como developer full-stack en startup tecnológica. Mantiene colaboración con el centro como mentor de nuevos alumnos.",
    enrolled_courses: [
      { id: "CURSO005", name: "Backend con Node.js", code: "NODE-PSQL", status: "completed", grade: 96 },
      { id: "CURSO012", name: "Desarrollo Backend con Laravel", code: "LARAVEL-2024", status: "completed", grade: 89 }
    ]
  }
]

// ============================================
// PERSONAL ADMINISTRATIVO
// ============================================
export interface AdministrativeStaff {
  id: string
  first_name: string
  last_name: string
  initials: string
  email: string
  phone: string
  extension?: string
  photo?: string
  position: string
  department: string
  campuses: string[] // IDs de sedes asignadas
  responsibilities: string[] // Lista dinámica
  certifications: {
    title: string
    institution: string
    year: number
  }[]
  bio: string // OBLIGATORIO
  active: boolean
}

export const administrativeStaffData: AdministrativeStaff[] = [
  {
    id: "AD001",
    first_name: "Carmen",
    last_name: "Suárez Vega",
    initials: "CS",
    email: "carmen.suarez@cepcomunicacion.com",
    phone: "+34 922 100 001",
    extension: "101",
    photo: "https://i.pravatar.cc/150?img=5",
    position: "Coordinadora de Secretaría Académica",
    department: "Secretaría Académica",
    campuses: ["C001", "C002"],
    responsibilities: [
      "Gestión de matrículas y expedientes académicos",
      "Coordinación de calendarios de exámenes",
      "Atención personalizada a estudiantes",
      "Tramitación de certificados y títulos",
      "Supervisión del equipo de secretaría"
    ],
    certifications: [
      {
        title: "Gestión Administrativa Universitaria",
        institution: "UNED",
        year: 2019
      },
      {
        title: "RGPD en Centros Educativos",
        institution: "Cámara de Comercio de Tenerife",
        year: 2021
      }
    ],
    bio: "Coordinadora de Secretaría Académica con más de 12 años de experiencia en centros de formación profesional. Especializada en gestión de expedientes académicos, digitalización de procesos administrativos y atención al estudiante. Ha liderado la implementación del sistema de gestión académica digital en CEP Comunicación. Responsable de asegurar el cumplimiento normativo en todos los procesos de matrícula y certificación.",
    active: true
  },
  {
    id: "AD002",
    first_name: "Pedro",
    last_name: "Hernández Gil",
    initials: "PH",
    email: "pedro.hernandez@cepcomunicacion.com",
    phone: "+34 922 100 002",
    extension: "102",
    photo: "https://i.pravatar.cc/150?img=14",
    position: "Responsable de Administración y Finanzas",
    department: "Administración",
    campuses: ["C001", "C002", "C003"],
    responsibilities: [
      "Gestión presupuestaria y control financiero",
      "Elaboración de informes económicos mensuales",
      "Coordinación con proveedores y contratos",
      "Supervisión de facturación y cobros",
      "Planificación financiera anual"
    ],
    certifications: [
      {
        title: "Máster en Dirección Financiera",
        institution: "EAE Business School",
        year: 2017
      },
      {
        title: "Contabilidad Avanzada para PYMEs",
        institution: "Colegio de Economistas",
        year: 2020
      }
    ],
    bio: "Responsable de Administración y Finanzas con amplia trayectoria en gestión económica de centros educativos. Experto en optimización de recursos, control presupuestario y planificación financiera estratégica. Ha implementado sistemas de reporting financiero que han mejorado la transparencia y eficiencia económica del centro. Colabora estrechamente con dirección en la toma de decisiones estratégicas basadas en análisis económico-financiero.",
    active: true
  },
  {
    id: "AD003",
    first_name: "Isabel",
    last_name: "Moreno Campos",
    initials: "IM",
    email: "isabel.moreno@cepcomunicacion.com",
    phone: "+34 922 100 003",
    photo: "https://i.pravatar.cc/150?img=9",
    position: "Recepcionista Senior",
    department: "Recepción",
    campuses: ["C001"],
    responsibilities: [
      "Atención presencial y telefónica a visitantes",
      "Gestión de registro de entrada y salida",
      "Coordinación de salas de reuniones",
      "Recepción y distribución de correspondencia",
      "Primera orientación a alumnos potenciales"
    ],
    certifications: [
      {
        title: "Atención al Cliente de Excelencia",
        institution: "INEM",
        year: 2018
      }
    ],
    bio: "Recepcionista senior con más de 8 años de experiencia en el centro. Primera cara visible de CEP Comunicación, reconocida por su trato amable y eficiente. Experta en gestión de agendas y coordinación de espacios. Ha desarrollado protocolos de atención que han mejorado significativamente la experiencia del visitante. Su conocimiento profundo del centro la convierte en punto de referencia para orientación inicial de nuevos alumnos.",
    active: true
  },
  {
    id: "AD004",
    first_name: "Antonio",
    last_name: "Delgado Cruz",
    initials: "AD",
    email: "antonio.delgado@cepcomunicacion.com",
    phone: "+34 922 100 004",
    extension: "104",
    photo: "https://i.pravatar.cc/150?img=52",
    position: "Técnico de Sistemas y Soporte IT",
    department: "Informática",
    campuses: ["C001", "C002"],
    responsibilities: [
      "Mantenimiento de infraestructura tecnológica",
      "Soporte técnico a profesores y personal",
      "Gestión de plataformas de aprendizaje online",
      "Administración de redes y servidores",
      "Seguridad informática y backups"
    ],
    certifications: [
      {
        title: "Cisco CCNA",
        institution: "Cisco Networking Academy",
        year: 2020
      },
      {
        title: "Microsoft Azure Administrator",
        institution: "Microsoft",
        year: 2022
      },
      {
        title: "Ciberseguridad Aplicada",
        institution: "Universidad de La Laguna",
        year: 2023
      }
    ],
    bio: "Técnico de Sistemas especializado en infraestructura educativa con más de 10 años de experiencia. Responsable de mantener operativos todos los sistemas tecnológicos del centro. Ha liderado la migración a cloud y la implementación de soluciones de ciberseguridad. Proporciona formación técnica al personal docente en nuevas herramientas. Su trabajo garantiza el funcionamiento 24/7 de las plataformas de aprendizaje online que utilizan más de 1200 estudiantes.",
    active: true
  },
  {
    id: "AD005",
    first_name: "Lucía",
    last_name: "Ramírez Santos",
    initials: "LR",
    email: "lucia.ramirez@cepcomunicacion.com",
    phone: "+34 922 100 005",
    extension: "105",
    photo: "https://i.pravatar.cc/150?img=44",
    position: "Responsable de Contabilidad",
    department: "Contabilidad",
    campuses: ["C001"],
    responsibilities: [
      "Contabilidad general y registro de operaciones",
      "Conciliaciones bancarias",
      "Preparación de documentación fiscal",
      "Control de tesorería",
      "Auditorías internas"
    ],
    certifications: [
      {
        title: "Grado en Administración y Dirección de Empresas",
        institution: "Universidad de La Laguna",
        year: 2015
      },
      {
        title: "Experto en Contabilidad y Fiscalidad",
        institution: "Colegio de Economistas",
        year: 2018
      }
    ],
    bio: "Responsable de Contabilidad con sólida formación académica y experiencia práctica en gestión contable de organizaciones educativas. Garantiza el correcto registro de todas las operaciones económicas y el cumplimiento de obligaciones fiscales. Ha implementado procedimientos de control interno que han reducido errores contables en un 95%. Colabora estrechamente con auditoría externa para asegurar transparencia y compliance financiero.",
    active: true
  },
  {
    id: "AD006",
    first_name: "Francisco",
    last_name: "Torres Abad",
    initials: "FT",
    email: "francisco.torres@cepcomunicacion.com",
    phone: "+34 922 100 006",
    photo: "https://i.pravatar.cc/150?img=68",
    position: "Auxiliar Administrativo",
    department: "Administración",
    campuses: ["C002"],
    responsibilities: [
      "Archivo y gestión documental",
      "Apoyo en tareas administrativas generales",
      "Preparación de documentación",
      "Atención telefónica y emails",
      "Gestión de suministros de oficina"
    ],
    certifications: [],
    bio: "Auxiliar administrativo polivalente que presta apoyo esencial en múltiples áreas del centro. Con 5 años de experiencia, ha demostrado gran capacidad de adaptación y aprendizaje. Destaca por su organización, atención al detalle y disposición para asumir nuevas responsabilidades. Su trabajo eficiente en gestión documental y archivo ha facilitado la digitalización progresiva de los procesos administrativos del centro.",
    active: true
  },
  {
    id: "AD007",
    first_name: "Rosa",
    last_name: "Méndez Flores",
    initials: "RM",
    email: "rosa.mendez@cepcomunicacion.com",
    phone: "+34 922 100 007",
    photo: "https://i.pravatar.cc/150?img=38",
    position: "Coordinadora de Sede Sur",
    department: "Administración",
    campuses: ["C003"],
    responsibilities: [
      "Gestión integral de sede sur",
      "Coordinación con dirección académica",
      "Supervisión de instalaciones y recursos",
      "Atención a estudiantes y profesores de la sede",
      "Elaboración de informes de actividad"
    ],
    certifications: [
      {
        title: "Gestión de Centros Educativos",
        institution: "Universidad Internacional de La Rioja",
        year: 2019
      }
    ],
    bio: "Coordinadora de la sede sur con capacidad demostrada para gestión autónoma de campus educativo. Responsable del funcionamiento diario de la sede incluyendo aspectos académicos, logísticos y administrativos. Ha conseguido aumentar la satisfacción de estudiantes de la sede en un 30% mediante mejoras en servicios y comunicación. Su liderazgo cercano y eficiente la convierte en referente para el equipo local.",
    active: true
  },
  {
    id: "AD008",
    first_name: "José",
    last_name: "Álvarez Pino",
    initials: "JA",
    email: "jose.alvarez@cepcomunicacion.com",
    phone: "+34 922 100 008",
    photo: "https://i.pravatar.cc/150?img=60",
    position: "Administrativo Junior",
    department: "Secretaría Académica",
    campuses: ["C002"],
    responsibilities: [
      "Apoyo en gestión de matrículas",
      "Atención de consultas académicas",
      "Preparación de certificados académicos",
      "Actualización de bases de datos",
      "Apoyo logístico en eventos"
    ],
    certifications: [],
    bio: "Administrativo junior incorporado recientemente al equipo de secretaría académica. Licenciado en Administración y Dirección de Empresas, aporta conocimientos actualizados y gran entusiasmo. En proceso de formación continua sobre normativa académica y sistemas de gestión del centro. Destaca por su capacidad de trabajo, actitud proactiva y excelente manejo de herramientas ofimáticas. Gran potencial de desarrollo profesional.",
    active: true
  }
]

// ============================================
// PERFIL DE USUARIO ACTUAL
// ============================================
export const currentUserProfile = {
  id: "1",
  first_name: "María",
  last_name: "García Pérez",
  initials: "MG",
  email: "maria.garcia@cepcomunicacion.com",
  phone: "+34 922 345 678",
  role: "Admin",
  department: "Dirección Académica",
  photo: "https://i.pravatar.cc/150?img=1",
  bio: "Directora Académica de CEP Comunicación con más de 15 años de experiencia en formación profesional. Especializada en diseño curricular, gestión de equipos docentes y desarrollo de programas formativos innovadores. Coordinadora de proyectos de transformación digital educativa.",
  created_at: "2020-01-15"
}
