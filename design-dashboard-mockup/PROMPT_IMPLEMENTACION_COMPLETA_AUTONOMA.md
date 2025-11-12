# PROMPT DE IMPLEMENTACIÓN COMPLETA Y AUTÓNOMA - Dashboard CEP Comunicación

## 🎯 OBJETIVO

Implementar **TODAS las secciones restantes** del mockup visual del dashboard en una sola sesión, sin pausas ni preguntas. Este es un mockup visual puro (NO funcional).

**Ubicación del proyecto:**
```
/Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup/
```

## ✅ ESTADO ACTUAL (33% Completado)

Ya implementado:
- ✅ Aulas (3 páginas: Norte, Santa Cruz, Sur) con ClassroomDialog
- ✅ Profesores (TeachersPage.tsx) con TeacherDialog
- ✅ Mock data: 15 profesores, 8 staff administrativo (parcial)
- ✅ Patrón correcto: Delete button DENTRO del modal

## 🚀 TAREAS A EJECUTAR (SIN PAUSAS)

### FASE 1: Instalar Componentes shadcn Necesarios (2 min)

```bash
cd /Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/design-dashboard-mockup/cep-admin-mockup
npx shadcn@latest add table
npx shadcn@latest add tabs
```

**IMPORTANTE:** Si pregunta por sobrescribir, responde "y" (yes) automáticamente.

### FASE 2: Expandir Mock Data (10 min)

Modificar `src/data/mockData.ts` - AGREGAR al final del archivo (después de `teachersExpanded`):

```typescript
// ============================================
// ESTUDIANTES (20 registros)
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
  address: string
  city: string
  postal_code: string
  emergency_contact: string
  emergency_phone: string
  enrolled_courses: string[]
  status: 'active' | 'inactive' | 'graduated'
  photo: string
}

export const studentsData: Student[] = [
  {
    id: "S001",
    first_name: "Ana",
    last_name: "Martín López",
    initials: "AM",
    email: "ana.martin@estudiante.com",
    phone: "+34 612 111 001",
    dni: "12345678A",
    date_of_birth: "1998-05-15",
    address: "Calle Mayor 45",
    city: "Santa Cruz de Tenerife",
    postal_code: "38001",
    emergency_contact: "María López García",
    emergency_phone: "+34 612 111 002",
    enrolled_courses: ["CURSO001", "CURSO003"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=16"
  },
  {
    id: "S002",
    first_name: "Carlos",
    last_name: "Rodríguez Pérez",
    initials: "CR",
    email: "carlos.rodriguez@estudiante.com",
    phone: "+34 612 111 003",
    dni: "23456789B",
    date_of_birth: "1995-08-22",
    address: "Avenida Anaga 12",
    city: "San Cristóbal de La Laguna",
    postal_code: "38200",
    emergency_contact: "Laura Pérez Sosa",
    emergency_phone: "+34 612 111 004",
    enrolled_courses: ["CURSO002"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=17"
  },
  {
    id: "S003",
    first_name: "Laura",
    last_name: "González Ruiz",
    initials: "LG",
    email: "laura.gonzalez@estudiante.com",
    phone: "+34 612 111 005",
    dni: "34567890C",
    date_of_birth: "2000-03-10",
    address: "Plaza España 8",
    city: "Santa Cruz de Tenerife",
    postal_code: "38002",
    emergency_contact: "Pedro González Martín",
    emergency_phone: "+34 612 111 006",
    enrolled_courses: ["CURSO001", "CURSO002", "CURSO003"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=18"
  },
  {
    id: "S004",
    first_name: "David",
    last_name: "Hernández Castro",
    initials: "DH",
    email: "david.hernandez@estudiante.com",
    phone: "+34 612 111 007",
    dni: "45678901D",
    date_of_birth: "1997-11-28",
    address: "Rambla Pulido 33",
    city: "Santa Cruz de Tenerife",
    postal_code: "38003",
    emergency_contact: "Carmen Castro Díaz",
    emergency_phone: "+34 612 111 008",
    enrolled_courses: [],
    status: "inactive",
    photo: "https://i.pravatar.cc/150?img=19"
  },
  {
    id: "S005",
    first_name: "Sofía",
    last_name: "Sánchez Morales",
    initials: "SS",
    email: "sofia.sanchez@estudiante.com",
    phone: "+34 612 111 009",
    dni: "56789012E",
    date_of_birth: "1999-06-05",
    address: "Calle Castillo 67",
    city: "Santa Cruz de Tenerife",
    postal_code: "38004",
    emergency_contact: "Antonio Sánchez Vega",
    emergency_phone: "+34 612 111 010",
    enrolled_courses: ["CURSO001"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=20"
  },
  // Agregar 15 más con mismo patrón (S006 a S020)
  {
    id: "S006",
    first_name: "Miguel",
    last_name: "Torres Jiménez",
    initials: "MT",
    email: "miguel.torres@estudiante.com",
    phone: "+34 612 111 011",
    dni: "67890123F",
    date_of_birth: "1996-09-18",
    address: "Calle Pilar 22",
    city: "La Laguna",
    postal_code: "38201",
    emergency_contact: "Rosa Jiménez Flores",
    emergency_phone: "+34 612 111 012",
    enrolled_courses: ["CURSO002", "CURSO003"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=21"
  },
  {
    id: "S007",
    first_name: "Elena",
    last_name: "Díaz Fernández",
    initials: "ED",
    email: "elena.diaz@estudiante.com",
    phone: "+34 612 111 013",
    dni: "78901234G",
    date_of_birth: "1998-12-03",
    address: "Avenida Trinidad 45",
    city: "Santa Cruz",
    postal_code: "38005",
    emergency_contact: "Juan Díaz Suárez",
    emergency_phone: "+34 612 111 014",
    enrolled_courses: ["CURSO001"],
    status: "graduated",
    photo: "https://i.pravatar.cc/150?img=22"
  },
  {
    id: "S008",
    first_name: "Javier",
    last_name: "Ruiz Domínguez",
    initials: "JR",
    email: "javier.ruiz@estudiante.com",
    phone: "+34 612 111 015",
    dni: "89012345H",
    date_of_birth: "1997-04-20",
    address: "Calle Méndez Núñez 89",
    city: "Santa Cruz",
    postal_code: "38006",
    emergency_contact: "Isabel Domínguez Ramos",
    emergency_phone: "+34 612 111 016",
    enrolled_courses: ["CURSO003"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=23"
  },
  {
    id: "S009",
    first_name: "Patricia",
    last_name: "Vázquez Moreno",
    initials: "PV",
    email: "patricia.vazquez@estudiante.com",
    phone: "+34 612 111 017",
    dni: "90123456I",
    date_of_birth: "1999-07-11",
    address: "Plaza Weyler 5",
    city: "Santa Cruz",
    postal_code: "38001",
    emergency_contact: "Francisco Vázquez Gil",
    emergency_phone: "+34 612 111 018",
    enrolled_courses: ["CURSO001", "CURSO002"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=24"
  },
  {
    id: "S010",
    first_name: "Raúl",
    last_name: "Muñoz Herrera",
    initials: "RM",
    email: "raul.munoz@estudiante.com",
    phone: "+34 612 111 019",
    dni: "01234567J",
    date_of_birth: "1998-01-30",
    address: "Ronda Norte 12",
    city: "La Laguna",
    postal_code: "38202",
    emergency_contact: "Ana Herrera Santos",
    emergency_phone: "+34 612 111 020",
    enrolled_courses: [],
    status: "inactive",
    photo: "https://i.pravatar.cc/150?img=25"
  },
  {
    id: "S011",
    first_name: "Carmen",
    last_name: "Jiménez Ortiz",
    initials: "CJ",
    email: "carmen.jimenez@estudiante.com",
    phone: "+34 612 111 021",
    dni: "11234567K",
    date_of_birth: "1996-10-25",
    address: "Calle San Francisco 78",
    city: "Santa Cruz",
    postal_code: "38002",
    emergency_contact: "Luis Jiménez Pérez",
    emergency_phone: "+34 612 111 022",
    enrolled_courses: ["CURSO002"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=26"
  },
  {
    id: "S012",
    first_name: "Alberto",
    last_name: "Romero Navarro",
    initials: "AR",
    email: "alberto.romero@estudiante.com",
    phone: "+34 612 111 023",
    dni: "21234567L",
    date_of_birth: "1997-02-14",
    address: "Avenida Marítima 34",
    city: "Santa Cruz",
    postal_code: "38003",
    emergency_contact: "Sara Navarro Cruz",
    emergency_phone: "+34 612 111 024",
    enrolled_courses: ["CURSO001", "CURSO003"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=27"
  },
  {
    id: "S013",
    first_name: "Beatriz",
    last_name: "Alonso García",
    initials: "BA",
    email: "beatriz.alonso@estudiante.com",
    phone: "+34 612 111 025",
    dni: "31234567M",
    date_of_birth: "1999-05-08",
    address: "Calle La Rosa 56",
    city: "La Laguna",
    postal_code: "38203",
    emergency_contact: "Miguel Alonso Ruiz",
    emergency_phone: "+34 612 111 026",
    enrolled_courses: ["CURSO003"],
    status: "graduated",
    photo: "https://i.pravatar.cc/150?img=28"
  },
  {
    id: "S014",
    first_name: "Francisco",
    last_name: "Gil Serrano",
    initials: "FG",
    email: "francisco.gil@estudiante.com",
    phone: "+34 612 111 027",
    dni: "41234567N",
    date_of_birth: "1998-08-19",
    address: "Plaza Príncipe 91",
    city: "Santa Cruz",
    postal_code: "38004",
    emergency_contact: "Teresa Serrano Luna",
    emergency_phone: "+34 612 111 028",
    enrolled_courses: ["CURSO001"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=29"
  },
  {
    id: "S015",
    first_name: "Marta",
    last_name: "Castro Rubio",
    initials: "MC",
    email: "marta.castro@estudiante.com",
    phone: "+34 612 111 029",
    dni: "51234567O",
    date_of_birth: "1997-11-12",
    address: "Rambla General Franco 23",
    city: "Santa Cruz",
    postal_code: "38005",
    emergency_contact: "Pablo Castro Díaz",
    emergency_phone: "+34 612 111 030",
    enrolled_courses: ["CURSO002", "CURSO003"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=30"
  },
  {
    id: "S016",
    first_name: "Sergio",
    last_name: "Iglesias Molina",
    initials: "SI",
    email: "sergio.iglesias@estudiante.com",
    phone: "+34 612 111 031",
    dni: "61234567P",
    date_of_birth: "1996-03-27",
    address: "Calle Viera y Clavijo 67",
    city: "La Laguna",
    postal_code: "38204",
    emergency_contact: "Laura Molina Sanz",
    emergency_phone: "+34 612 111 032",
    enrolled_courses: ["CURSO001"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=31"
  },
  {
    id: "S017",
    first_name: "Isabel",
    last_name: "Medina Ortega",
    initials: "IM",
    email: "isabel.medina@estudiante.com",
    phone: "+34 612 111 033",
    dni: "71234567Q",
    date_of_birth: "1999-09-06",
    address: "Avenida San Sebastián 12",
    city: "Santa Cruz",
    postal_code: "38006",
    emergency_contact: "Andrés Medina Vega",
    emergency_phone: "+34 612 111 034",
    enrolled_courses: [],
    status: "inactive",
    photo: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: "S018",
    first_name: "Adrián",
    last_name: "Cabrera Flores",
    initials: "AC",
    email: "adrian.cabrera@estudiante.com",
    phone: "+34 612 111 035",
    dni: "81234567R",
    date_of_birth: "1998-06-21",
    address: "Calle Bethencourt Alfonso 45",
    city: "Santa Cruz",
    postal_code: "38001",
    emergency_contact: "Cristina Flores Gómez",
    emergency_phone: "+34 612 111 036",
    enrolled_courses: ["CURSO003"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=33"
  },
  {
    id: "S019",
    first_name: "Cristina",
    last_name: "Ramos Delgado",
    initials: "CR",
    email: "cristina.ramos@estudiante.com",
    phone: "+34 612 111 037",
    dni: "91234567S",
    date_of_birth: "1997-12-16",
    address: "Plaza Candelaria 8",
    city: "Santa Cruz",
    postal_code: "38002",
    emergency_contact: "Jorge Ramos Martín",
    emergency_phone: "+34 612 111 038",
    enrolled_courses: ["CURSO001", "CURSO002"],
    status: "graduated",
    photo: "https://i.pravatar.cc/150?img=34"
  },
  {
    id: "S020",
    first_name: "Pablo",
    last_name: "Suárez León",
    initials: "PS",
    email: "pablo.suarez@estudiante.com",
    phone: "+34 612 111 039",
    dni: "10234567T",
    date_of_birth: "1996-04-09",
    address: "Calle Numancia 90",
    city: "La Laguna",
    postal_code: "38205",
    emergency_contact: "Elena León Rivera",
    emergency_phone: "+34 612 111 040",
    enrolled_courses: ["CURSO002"],
    status: "active",
    photo: "https://i.pravatar.cc/150?img=35"
  }
]

// ============================================
// SEDES / CAMPUSES (5 registros)
// ============================================
export interface Campus {
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
  classrooms_count: number
  active: boolean
}

export const campusesData: Campus[] = [
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
    opening_hours: "Lunes a Viernes: 08:00 - 21:00",
    image_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
    classrooms_count: 4,
    active: true
  },
  {
    id: "C002",
    name: "CEP Santa Cruz",
    code: "SANTA-CRUZ",
    address: "Calle Castillo 123",
    city: "Santa Cruz de Tenerife",
    postal_code: "38001",
    phone: "+34 922 234 567",
    email: "santacruz@cepcomunicacion.com",
    manager_name: "Carlos Rodríguez López",
    manager_email: "carlos.rodriguez@cepcomunicacion.com",
    opening_hours: "Lunes a Viernes: 08:30 - 20:30",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop",
    classrooms_count: 3,
    active: true
  },
  {
    id: "C003",
    name: "CEP Sur",
    code: "SUR",
    address: "Avenida de Los Pueblos 78",
    city: "Arona",
    postal_code: "38640",
    phone: "+34 922 345 678",
    email: "sur@cepcomunicacion.com",
    manager_name: "Laura Martínez Sánchez",
    manager_email: "laura.martinez@cepcomunicacion.com",
    opening_hours: "Lunes a Viernes: 09:00 - 21:00",
    image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
    classrooms_count: 2,
    active: true
  },
  {
    id: "C004",
    name: "CEP Online",
    code: "ONLINE",
    address: "Campus Virtual",
    city: "Tenerife",
    postal_code: "38000",
    phone: "+34 922 456 789",
    email: "online@cepcomunicacion.com",
    manager_name: "Miguel Hernández Castro",
    manager_email: "miguel.hernandez@cepcomunicacion.com",
    opening_hours: "24/7 - Soporte: Lunes a Viernes 09:00-18:00",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    classrooms_count: 0,
    active: true
  },
  {
    id: "C005",
    name: "CEP Este (Próximamente)",
    code: "ESTE",
    address: "Calle La Marina 34",
    city: "Candelaria",
    postal_code: "38530",
    phone: "+34 922 567 890",
    email: "este@cepcomunicacion.com",
    manager_name: "Pendiente de asignación",
    manager_email: "contacto@cepcomunicacion.com",
    opening_hours: "Próximamente",
    image_url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=400&fit=crop",
    classrooms_count: 0,
    active: false
  }
]

// ============================================
// CICLOS FORMATIVOS (6 registros)
// ============================================
export interface Cycle {
  id: string
  name: string
  code: string
  level: 'grado-medio' | 'grado-superior'
  duration_hours: number
  requirements: string[]
  description: string
  courses: string[]
  active: boolean
}

export const cyclesData: Cycle[] = [
  {
    id: "CY001",
    name: "Técnico Superior en Marketing y Publicidad",
    code: "TSMP",
    level: "grado-superior",
    duration_hours: 2000,
    requirements: [
      "Bachillerato o equivalente",
      "Prueba de acceso a Grado Superior"
    ],
    description: "Formación profesional de grado superior en marketing digital, publicidad, estrategias de comunicación y gestión de marcas.",
    courses: ["CURSO001", "CURSO002", "CURSO003"],
    active: true
  },
  {
    id: "CY002",
    name: "Técnico Superior en Desarrollo de Aplicaciones Web",
    code: "TSDAW",
    level: "grado-superior",
    duration_hours: 2000,
    requirements: [
      "Bachillerato o equivalente",
      "Prueba de acceso a Grado Superior"
    ],
    description: "Ciclo formativo de desarrollo web con tecnologías frontend y backend, bases de datos y despliegue de aplicaciones.",
    courses: ["CURSO004", "CURSO005"],
    active: true
  },
  {
    id: "CY003",
    name: "Técnico en Sistemas Microinformáticos y Redes",
    code: "TSMR",
    level: "grado-medio",
    duration_hours: 1600,
    requirements: [
      "ESO o equivalente",
      "Prueba de acceso a Grado Medio"
    ],
    description: "Formación técnica en instalación, configuración y mantenimiento de sistemas informáticos y redes locales.",
    courses: ["CURSO006"],
    active: true
  },
  {
    id: "CY004",
    name: "Técnico Superior en Administración de Sistemas Informáticos en Red",
    code: "TSASIR",
    level: "grado-superior",
    duration_hours: 2000,
    requirements: [
      "Bachillerato o equivalente",
      "Prueba de acceso a Grado Superior"
    ],
    description: "Especialización en administración de servidores, redes empresariales, seguridad informática y virtualización.",
    courses: [],
    active: true
  },
  {
    id: "CY005",
    name: "Técnico Superior en Producción Audiovisual",
    code: "TSPA",
    level: "grado-superior",
    duration_hours: 2000,
    requirements: [
      "Bachillerato o equivalente",
      "Portfolio de trabajos audiovisuales (recomendado)"
    ],
    description: "Formación completa en producción de vídeo, edición, postproducción, iluminación y dirección de proyectos audiovisuales.",
    courses: ["CURSO007"],
    active: true
  },
  {
    id: "CY006",
    name: "Técnico en Gestión Administrativa",
    code: "TGA",
    level: "grado-medio",
    duration_hours: 1600,
    requirements: [
      "ESO o equivalente",
      "Prueba de acceso a Grado Medio"
    ],
    description: "Ciclo formativo de gestión administrativa, contabilidad, atención al cliente y ofimática empresarial.",
    courses: [],
    active: false
  }
]

// ============================================
// CURSOS (10 registros)
// ============================================
export interface Course {
  id: string
  name: string
  code: string
  type: 'telematico' | 'ocupados' | 'desempleados' | 'privados' | 'ciclo-medio' | 'ciclo-superior'
  modality: 'presencial' | 'semipresencial' | 'telematico'
  cycle_id?: string
  duration_hours: number
  price: number
  max_students: number
  current_students: number
  description: string
  objectives: string[]
  requirements: string[]
  status: 'draft' | 'published' | 'archived'
  featured: boolean
}

export const coursesData: Course[] = [
  {
    id: "CURSO001",
    name: "Community Manager Profesional",
    code: "CM-PRO-2025",
    type: "privados",
    modality: "semipresencial",
    cycle_id: "CY001",
    duration_hours: 120,
    price: 890,
    max_students: 25,
    current_students: 18,
    description: "Curso completo de gestión de redes sociales, estrategia de contenidos y analítica digital.",
    objectives: [
      "Crear y gestionar estrategias de contenido para redes sociales",
      "Dominar herramientas de programación y analítica",
      "Diseñar campañas publicitarias en Meta Ads"
    ],
    requirements: [
      "Conocimientos básicos de informática",
      "Acceso a ordenador e internet"
    ],
    status: "published",
    featured: true
  },
  {
    id: "CURSO002",
    name: "SEO y SEM Avanzado",
    code: "SEO-SEM-ADV",
    type: "privados",
    modality: "presencial",
    cycle_id: "CY001",
    duration_hours: 80,
    price: 750,
    max_students: 20,
    current_students: 15,
    description: "Posicionamiento web orgánico (SEO) y campañas de pago (SEM) con Google Ads y herramientas avanzadas.",
    objectives: [
      "Optimizar sitios web para buscadores",
      "Crear campañas SEM rentables",
      "Analizar y mejorar el ROI de campañas"
    ],
    requirements: [
      "Conocimientos básicos de marketing digital"
    ],
    status: "published",
    featured: true
  },
  {
    id: "CURSO003",
    name: "Diseño UX/UI con Figma",
    code: "UX-UI-FIG",
    type: "privados",
    modality: "telematico",
    cycle_id: "CY001",
    duration_hours: 100,
    price: 680,
    max_students: 30,
    current_students: 22,
    description: "Diseño de interfaces y experiencias de usuario con metodologías ágiles y herramientas profesionales.",
    objectives: [
      "Crear prototipos interactivos en Figma",
      "Aplicar principios de diseño centrado en el usuario",
      "Realizar pruebas de usabilidad"
    ],
    requirements: [
      "Conocimientos básicos de diseño gráfico (recomendado)"
    ],
    status: "published",
    featured: false
  },
  {
    id: "CURSO004",
    name: "Desarrollo Frontend con React",
    code: "REACT-2025",
    type: "ciclo-superior",
    modality: "presencial",
    cycle_id: "CY002",
    duration_hours: 150,
    price: 1200,
    max_students: 18,
    current_students: 12,
    description: "Desarrollo de aplicaciones web modernas con React, TypeScript, TailwindCSS y despliegue en producción.",
    objectives: [
      "Crear aplicaciones SPA con React y React Router",
      "Gestionar estado con Context API y Zustand",
      "Desplegar aplicaciones en Vercel/Netlify"
    ],
    requirements: [
      "JavaScript ES6+ intermedio",
      "HTML y CSS avanzado"
    ],
    status: "published",
    featured: true
  },
  {
    id: "CURSO005",
    name: "Backend con Node.js y PostgreSQL",
    code: "NODE-PSQL",
    type: "ciclo-superior",
    modality: "semipresencial",
    cycle_id: "CY002",
    duration_hours: 140,
    price: 1150,
    max_students: 18,
    current_students: 9,
    description: "Desarrollo de APIs REST con Node.js, Express, autenticación JWT y bases de datos relacionales.",
    objectives: [
      "Diseñar y desarrollar APIs RESTful escalables",
      "Implementar autenticación y autorización segura",
      "Trabajar con PostgreSQL y ORMs"
    ],
    requirements: [
      "JavaScript avanzado",
      "Conocimientos de bases de datos SQL"
    ],
    status: "published",
    featured: false
  },
  {
    id: "CURSO006",
    name: "Redes Cisco CCNA",
    code: "CCNA-2025",
    type: "ciclo-medio",
    modality: "presencial",
    cycle_id: "CY003",
    duration_hours: 200,
    price: 1500,
    max_students: 15,
    current_students: 15,
    description: "Preparación para certificación CCNA con configuración de routers, switches y protocolos de enrutamiento.",
    objectives: [
      "Configurar dispositivos Cisco IOS",
      "Implementar VLANs y enrutamiento dinámico",
      "Obtener certificación CCNA"
    ],
    requirements: [
      "Conocimientos básicos de redes TCP/IP"
    ],
    status: "published",
    featured: false
  },
  {
    id: "CURSO007",
    name: "Edición de Vídeo con Premiere Pro",
    code: "PREMIERE-PRO",
    type: "privados",
    modality: "presencial",
    cycle_id: "CY005",
    duration_hours: 90,
    price: 820,
    max_students: 20,
    current_students: 14,
    description: "Edición profesional de vídeo, corrección de color, efectos visuales y exportación para diferentes plataformas.",
    objectives: [
      "Dominar la interfaz y flujo de trabajo de Premiere Pro",
      "Aplicar transiciones, efectos y corrección de color",
      "Exportar vídeos optimizados para redes sociales y YouTube"
    ],
    requirements: [
      "Conocimientos básicos de edición de vídeo"
    ],
    status: "published",
    featured: true
  },
  {
    id: "CURSO008",
    name: "Marketing para Desempleados",
    code: "MKT-DESEMP",
    type: "desempleados",
    modality: "semipresencial",
    duration_hours: 60,
    price: 0,
    max_students: 25,
    current_students: 20,
    description: "Curso gratuito de marketing digital básico para personas desempleadas con certificación oficial.",
    objectives: [
      "Conocer los fundamentos del marketing digital",
      "Crear perfiles profesionales en LinkedIn",
      "Realizar campañas básicas en redes sociales"
    ],
    requirements: [
      "Estar en situación de desempleo (DARDE)",
      "Conocimientos básicos de informática"
    ],
    status: "published",
    featured: false
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
    description: "Bonificado por FUNDAE para trabajadores en activo. Tablas dinámicas, macros y automatización.",
    objectives: [
      "Crear tablas dinámicas y gráficos avanzados",
      "Automatizar tareas con macros",
      "Trabajar con bases de datos en Excel"
    ],
    requirements: [
      "Estar en situación de empleo",
      "Excel nivel básico-intermedio"
    ],
    status: "published",
    featured: false
  },
  {
    id: "CURSO010",
    name: "Inteligencia Artificial para Marketing (Próximamente)",
    code: "AI-MKT-2025",
    type: "privados",
    modality: "telematico",
    duration_hours: 50,
    price: 590,
    max_students: 40,
    current_students: 0,
    description: "Uso de ChatGPT, Midjourney, y herramientas IA para automatizar tareas de marketing y crear contenido.",
    objectives: [
      "Generar textos publicitarios con IA",
      "Crear imágenes para redes sociales con Midjourney",
      "Automatizar workflows de marketing con IA"
    ],
    requirements: [
      "Conocimientos básicos de marketing digital"
    ],
    status: "draft",
    featured: false
  }
]

// ============================================
// CAMPAÑAS (8 registros)
// ============================================
export interface Campaign {
  id: string
  name: string
  type: 'email' | 'social' | 'paid_ads' | 'organic' | 'event' | 'referral'
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
  start_date: string
  end_date: string
  budget: number
  target_leads: number
  total_leads: number
  total_conversions: number
  conversion_rate: number
  cost_per_lead: number
  roi: number
  utm_source: string
  utm_medium: string
  utm_campaign: string
}

export const campaignsData: Campaign[] = [
  {
    id: "CAMP001",
    name: "Captación Community Manager Q1 2025",
    type: "paid_ads",
    status: "active",
    start_date: "2025-01-15",
    end_date: "2025-03-31",
    budget: 3500,
    target_leads: 100,
    total_leads: 67,
    total_conversions: 18,
    conversion_rate: 26.87,
    cost_per_lead: 52.24,
    roi: 145.5,
    utm_source: "meta",
    utm_medium: "cpc",
    utm_campaign: "cm-q1-2025"
  },
  {
    id: "CAMP002",
    name: "Email Marketing Cursos de Verano",
    type: "email",
    status: "active",
    start_date: "2025-02-01",
    end_date: "2025-06-30",
    budget: 800,
    target_leads: 150,
    total_leads: 42,
    total_conversions: 8,
    conversion_rate: 19.05,
    cost_per_lead: 19.05,
    roi: 87.3,
    utm_source: "mailchimp",
    utm_medium: "email",
    utm_campaign: "verano-2025"
  },
  {
    id: "CAMP003",
    name: "LinkedIn Ads - Ciclos Formativos",
    type: "paid_ads",
    status: "paused",
    start_date: "2024-11-01",
    end_date: "2025-01-31",
    budget: 2200,
    target_leads: 60,
    total_leads: 55,
    total_conversions: 12,
    conversion_rate: 21.82,
    cost_per_lead: 40.00,
    roi: 102.1,
    utm_source: "linkedin",
    utm_medium: "cpc",
    utm_campaign: "ciclos-2024"
  },
  {
    id: "CAMP004",
    name: "Orgánico Instagram - Diseño UX/UI",
    type: "organic",
    status: "active",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    budget: 0,
    target_leads: 200,
    total_leads: 38,
    total_conversions: 6,
    conversion_rate: 15.79,
    cost_per_lead: 0,
    roi: 0,
    utm_source: "instagram",
    utm_medium: "organic",
    utm_campaign: "ux-ui-contenido"
  },
  {
    id: "CAMP005",
    name: "Evento Jornada Puertas Abiertas CEP Norte",
    type: "event",
    status: "completed",
    start_date: "2024-12-10",
    end_date: "2024-12-10",
    budget: 1200,
    target_leads: 80,
    total_leads: 95,
    total_conversions: 23,
    conversion_rate: 24.21,
    cost_per_lead: 12.63,
    roi: 215.8,
    utm_source: "eventbrite",
    utm_medium: "event",
    utm_campaign: "puertas-abiertas-dic24"
  },
  {
    id: "CAMP006",
    name: "Google Ads - Cursos Desempleados",
    type: "paid_ads",
    status: "active",
    start_date: "2025-02-01",
    end_date: "2025-04-30",
    budget: 1800,
    target_leads: 120,
    total_leads: 34,
    total_conversions: 12,
    conversion_rate: 35.29,
    cost_per_lead: 52.94,
    roi: 178.4,
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "desempleados-2025"
  },
  {
    id: "CAMP007",
    name: "Programa Referidos - Descuento 15%",
    type: "referral",
    status: "active",
    start_date: "2024-10-01",
    end_date: "2025-06-30",
    budget: 500,
    target_leads: 50,
    total_leads: 28,
    total_conversions: 11,
    conversion_rate: 39.29,
    cost_per_lead: 17.86,
    roi: 198.2,
    utm_source: "referral",
    utm_medium: "word-of-mouth",
    utm_campaign: "descuento-15-referidos"
  },
  {
    id: "CAMP008",
    name: "TikTok Ads - Edición Vídeo (Test)",
    type: "social",
    status: "draft",
    start_date: "2025-03-01",
    end_date: "2025-03-31",
    budget: 600,
    target_leads: 80,
    total_leads: 0,
    total_conversions: 0,
    conversion_rate: 0,
    cost_per_lead: 0,
    roi: 0,
    utm_source: "tiktok",
    utm_medium: "cpc",
    utm_campaign: "video-editing-test"
  }
]

// ============================================
// PERFIL DE USUARIO (1 registro)
// ============================================
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

export const currentUserProfile: UserProfile = {
  id: "U001",
  first_name: "Carlos",
  last_name: "Pérez",
  email: "carlos.perez@cepcomunicacion.com",
  phone: "+34 612 345 000",
  role: "admin",
  department: "Dirección",
  photo: "https://i.pravatar.cc/150?img=12",
  language: "es",
  timezone: "Atlantic/Canary",
  email_notifications: true,
  sms_notifications: false
}
```

### FASE 3: Crear Componentes de Diálogos (15 min)

#### 3.1. `src/components/dialogs/StudentDialog.tsx`

```typescript
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Student } from "@/data/mockData"

interface StudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  student?: Student
}

export function StudentDialog({ open, onOpenChange, mode = 'create', student }: StudentDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar el alumno' : 'Complete los campos para crear un nuevo alumno'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name">Nombre *</Label>
              <Input
                id="first_name"
                placeholder="ej: Ana"
                defaultValue={student?.first_name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="last_name">Apellidos *</Label>
              <Input
                id="last_name"
                placeholder="ej: Martín López"
                defaultValue={student?.last_name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                placeholder="ej: 12345678A"
                defaultValue={student?.dni}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date_of_birth">Fecha de Nacimiento *</Label>
              <Input
                id="date_of_birth"
                type="date"
                defaultValue={student?.date_of_birth}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ej: alumno@email.com"
                defaultValue={student?.email}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                placeholder="ej: +34 612 345 678"
                defaultValue={student?.phone}
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                placeholder="ej: Calle Mayor 45"
                defaultValue={student?.address}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                placeholder="ej: Santa Cruz"
                defaultValue={student?.city}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="postal_code">Código Postal</Label>
              <Input
                id="postal_code"
                placeholder="ej: 38001"
                defaultValue={student?.postal_code}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emergency_contact">Contacto de Emergencia</Label>
              <Input
                id="emergency_contact"
                placeholder="ej: María López García"
                defaultValue={student?.emergency_contact}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emergency_phone">Teléfono de Emergencia</Label>
              <Input
                id="emergency_phone"
                placeholder="ej: +34 612 111 002"
                defaultValue={student?.emergency_phone}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Estado *</Label>
              <Select defaultValue={student?.status || 'active'}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="graduated">Graduado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Alumno
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Alumno'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### 3.2. `src/components/dialogs/AdministrativeDialog.tsx`

```typescript
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdministrativeStaff } from "@/data/mockData"

interface AdministrativeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  staff?: AdministrativeStaff
}

export function AdministrativeDialog({ open, onOpenChange, mode = 'create', staff }: AdministrativeDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Personal Administrativo' : 'Agregar Personal Administrativo'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar el personal' : 'Complete los campos para agregar personal administrativo'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={staff?.photo} />
              <AvatarFallback>{staff?.first_name?.[0]}{staff?.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Subir Foto
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG o WebP. Max 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name">Nombre *</Label>
              <Input
                id="first_name"
                placeholder="ej: Ana"
                defaultValue={staff?.first_name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="last_name">Apellidos *</Label>
              <Input
                id="last_name"
                placeholder="ej: García Pérez"
                defaultValue={staff?.last_name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">Puesto *</Label>
              <Input
                id="position"
                placeholder="ej: Secretaria Académica"
                defaultValue={staff?.position}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Departamento *</Label>
              <Select defaultValue={staff?.department}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administración">Administración</SelectItem>
                  <SelectItem value="Secretaría Académica">Secretaría Académica</SelectItem>
                  <SelectItem value="Recepción">Recepción</SelectItem>
                  <SelectItem value="Informática">Informática</SelectItem>
                  <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ej: nombre@cepcomunicacion.com"
                defaultValue={staff?.email}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                placeholder="ej: +34 922 123 456"
                defaultValue={staff?.phone}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="extension">Extensión</Label>
              <Input
                id="extension"
                placeholder="ej: 101"
                defaultValue={staff?.extension}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Estado *</Label>
              <Select defaultValue={staff?.active ? 'active' : 'inactive'}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Personal
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Personal'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### 3.3. `src/components/dialogs/CampusDialog.tsx`

```typescript
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Campus } from "@/data/mockData"

interface CampusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  campus?: Campus
}

export function CampusDialog({ open, onOpenChange, mode = 'create', campus }: CampusDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Sede' : 'Agregar Nueva Sede'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar la sede' : 'Complete los campos para crear una nueva sede'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Image Upload */}
          <div className="grid gap-2">
            <Label>Imagen de la Sede</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {campus?.image_url ? (
                <img src={campus.image_url} alt="Preview" className="w-full h-32 object-cover rounded mb-2" />
              ) : (
                <div className="h-32 flex items-center justify-center bg-muted rounded mb-2">
                  <p className="text-sm text-muted-foreground">Vista previa de imagen</p>
                </div>
              )}
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Subir Imagen
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG o WebP. Recomendado 800x400px
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de la Sede *</Label>
              <Input
                id="name"
                placeholder="ej: CEP Norte"
                defaultValue={campus?.name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                placeholder="ej: NORTE"
                defaultValue={campus?.code}
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                placeholder="ej: Avenida Los Menceyes 45"
                defaultValue={campus?.address}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                placeholder="ej: San Cristóbal de La Laguna"
                defaultValue={campus?.city}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="postal_code">Código Postal *</Label>
              <Input
                id="postal_code"
                placeholder="ej: 38200"
                defaultValue={campus?.postal_code}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                placeholder="ej: +34 922 123 456"
                defaultValue={campus?.phone}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ej: norte@cepcomunicacion.com"
                defaultValue={campus?.email}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="manager_name">Responsable</Label>
              <Input
                id="manager_name"
                placeholder="ej: Ana García Pérez"
                defaultValue={campus?.manager_name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="manager_email">Email Responsable</Label>
              <Input
                id="manager_email"
                type="email"
                placeholder="ej: ana.garcia@cepcomunicacion.com"
                defaultValue={campus?.manager_email}
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="opening_hours">Horario de Atención</Label>
              <Input
                id="opening_hours"
                placeholder="ej: Lunes a Viernes: 08:00 - 21:00"
                defaultValue={campus?.opening_hours}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Sede
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Sede'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### 3.4. `src/components/dialogs/CycleDialog.tsx`

```typescript
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Cycle } from "@/data/mockData"

interface CycleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  cycle?: Cycle
}

export function CycleDialog({ open, onOpenChange, mode = 'create', cycle }: CycleDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Ciclo Formativo' : 'Agregar Nuevo Ciclo Formativo'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar el ciclo' : 'Complete los campos para crear un nuevo ciclo formativo'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="name">Nombre del Ciclo *</Label>
              <Input
                id="name"
                placeholder="ej: Técnico Superior en Marketing y Publicidad"
                defaultValue={cycle?.name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                placeholder="ej: TSMP"
                defaultValue={cycle?.code}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="level">Nivel *</Label>
              <Select defaultValue={cycle?.level}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grado-medio">Grado Medio</SelectItem>
                  <SelectItem value="grado-superior">Grado Superior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration_hours">Duración (horas) *</Label>
              <Input
                id="duration_hours"
                type="number"
                placeholder="ej: 2000"
                defaultValue={cycle?.duration_hours}
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción del ciclo formativo..."
                rows={3}
                defaultValue={cycle?.description}
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="requirements">Requisitos (uno por línea)</Label>
              <Textarea
                id="requirements"
                placeholder="Bachillerato o equivalente&#10;Prueba de acceso a Grado Superior"
                rows={3}
                defaultValue={cycle?.requirements.join('\n')}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Ciclo
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Ciclo'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### 3.5. `src/components/dialogs/CourseDialog.tsx`

```typescript
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Course } from "@/data/mockData"

interface CourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  course?: Course
}

export function CourseDialog({ open, onOpenChange, mode = 'create', course }: CourseDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Curso' : 'Agregar Nuevo Curso'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar el curso' : 'Complete los campos para crear un nuevo curso'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="py-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="pricing">Precios</TabsTrigger>
            <TabsTrigger value="enrollment">Plazas</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="name">Nombre del Curso *</Label>
                <Input
                  id="name"
                  placeholder="ej: Community Manager Profesional"
                  defaultValue={course?.name}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  placeholder="ej: CM-PRO-2025"
                  defaultValue={course?.code}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select defaultValue={course?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telematico">Telemático</SelectItem>
                    <SelectItem value="ocupados">Ocupados</SelectItem>
                    <SelectItem value="desempleados">Desempleados</SelectItem>
                    <SelectItem value="privados">Privados</SelectItem>
                    <SelectItem value="ciclo-medio">Ciclo Medio</SelectItem>
                    <SelectItem value="ciclo-superior">Ciclo Superior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="modality">Modalidad *</Label>
                <Select defaultValue={course?.modality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="semipresencial">Semipresencial</SelectItem>
                    <SelectItem value="telematico">Telemático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Estado *</Label>
                <Select defaultValue={course?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch id="featured" defaultChecked={course?.featured} />
                <Label htmlFor="featured">Curso destacado</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción del curso..."
                  rows={3}
                  defaultValue={course?.description}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="objectives">Objetivos (uno por línea)</Label>
                <Textarea
                  id="objectives"
                  placeholder="Objetivo 1&#10;Objetivo 2&#10;Objetivo 3"
                  rows={4}
                  defaultValue={course?.objectives.join('\n')}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="requirements">Requisitos (uno por línea)</Label>
                <Textarea
                  id="requirements"
                  placeholder="Requisito 1&#10;Requisito 2"
                  rows={3}
                  defaultValue={course?.requirements.join('\n')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="ej: 890"
                  defaultValue={course?.price}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration_hours">Duración (horas) *</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  placeholder="ej: 120"
                  defaultValue={course?.duration_hours}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="enrollment" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="max_students">Plazas Máximas *</Label>
                <Input
                  id="max_students"
                  type="number"
                  placeholder="ej: 25"
                  defaultValue={course?.max_students}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="current_students">Plazas Ocupadas</Label>
                <Input
                  id="current_students"
                  type="number"
                  placeholder="ej: 18"
                  defaultValue={course?.current_students}
                  disabled
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Curso
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Curso'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### 3.6. `src/components/dialogs/CampaignDialog.tsx`

```typescript
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Campaign } from "@/data/mockData"

interface CampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  campaign?: Campaign
}

export function CampaignDialog({ open, onOpenChange, mode = 'create', campaign }: CampaignDialogProps) {
  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Campaña' : 'Crear Nueva Campaña'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique los campos para actualizar la campaña' : 'Complete los campos para crear una nueva campaña'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="py-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="objectives">Objetivos</TabsTrigger>
            <TabsTrigger value="budget">Presupuesto</TabsTrigger>
            <TabsTrigger value="utm">UTM</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="name">Nombre de la Campaña *</Label>
                <Input
                  id="name"
                  placeholder="ej: Captación Community Manager Q1 2025"
                  defaultValue={campaign?.name}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select defaultValue={campaign?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="social">Redes Sociales</SelectItem>
                    <SelectItem value="paid_ads">Anuncios Pagados</SelectItem>
                    <SelectItem value="organic">Orgánico</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                    <SelectItem value="referral">Referidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Estado *</Label>
                <Select defaultValue={campaign?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="paused">Pausada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="archived">Archivada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="start_date">Fecha Inicio *</Label>
                <Input
                  id="start_date"
                  type="date"
                  defaultValue={campaign?.start_date}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end_date">Fecha Fin *</Label>
                <Input
                  id="end_date"
                  type="date"
                  defaultValue={campaign?.end_date}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="target_leads">Objetivo de Leads *</Label>
                <Input
                  id="target_leads"
                  type="number"
                  placeholder="ej: 100"
                  defaultValue={campaign?.target_leads}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="budget">Presupuesto (€) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="ej: 3500"
                  defaultValue={campaign?.budget}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="utm" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="utm_source">UTM Source</Label>
                <Input
                  id="utm_source"
                  placeholder="ej: meta"
                  defaultValue={campaign?.utm_source}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="utm_medium">UTM Medium</Label>
                <Input
                  id="utm_medium"
                  placeholder="ej: cpc"
                  defaultValue={campaign?.utm_medium}
                />
              </div>

              <div className="grid gap-2 col-span-2">
                <Label htmlFor="utm_campaign">UTM Campaign</Label>
                <Input
                  id="utm_campaign"
                  placeholder="ej: cm-q1-2025"
                  defaultValue={campaign?.utm_campaign}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {isEdit && (
              <Button
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar Campaña
              </Button>
            )}
            <div className={cn("flex gap-2", !isEdit && "w-full justify-end")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {isEdit ? 'Guardar Cambios' : 'Crear Campaña'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### FASE 4: Crear Páginas (40 min)

*Por limitación de espacio, continúo en el siguiente mensaje con los archivos de páginas completos.*

**CONTINÚA EJECUTANDO AUTOMÁTICAMENTE** sin parar. Todas las instrucciones están diseñadas para ejecutarse sin intervención del usuario.
