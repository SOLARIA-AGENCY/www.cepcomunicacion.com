/**
 * Mock course data for demonstration purposes
 * Used across home, cursos, and specialty pages
 */

export interface MockCourse {
  id: string
  title: string
  slug: string
  short_description: string
  duration_hours: number
  modality: 'presencial' | 'online' | 'hibrido'
  course_type: 'desempleados' | 'ocupados' | 'privados' | 'teleformacion' | 'fp-ciclo-medio' | 'fp-ciclo-superior'
  price: number
  featured_image: string
  active: boolean
}

export const mockCourses: MockCourse[] = [
  {
    id: '1',
    title: 'Marketing Digital Avanzado',
    slug: 'marketing-digital-avanzado',
    short_description: 'Domina las estrategias de marketing digital, SEO, SEM y redes sociales para impulsar tu negocio online',
    duration_hours: 200,
    modality: 'hibrido',
    course_type: 'ocupados',
    price: 1299,
    featured_image: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '2',
    title: 'Desarrollo Web Full Stack',
    slug: 'desarrollo-web-full-stack',
    short_description: 'Aprende a desarrollar aplicaciones web completas con React, Node.js y bases de datos modernas',
    duration_hours: 300,
    modality: 'online',
    course_type: 'teleformacion',
    price: 1599,
    featured_image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '3',
    title: 'Data Science con Python',
    slug: 'data-science-python',
    short_description: 'Conviértete en analista de datos con Python, Machine Learning y visualización de datos',
    duration_hours: 250,
    modality: 'presencial',
    course_type: 'desempleados',
    price: 0,
    featured_image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '4',
    title: 'Diseño UX/UI Profesional',
    slug: 'diseno-ux-ui',
    short_description: 'Diseña interfaces intuitivas y experiencias de usuario excepcionales con Figma y Adobe XD',
    duration_hours: 180,
    modality: 'online',
    course_type: 'privados',
    price: 999,
    featured_image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '5',
    title: 'Community Manager Certificado',
    slug: 'community-manager',
    short_description: 'Gestiona comunidades online, crea contenido viral y mide el impacto en redes sociales',
    duration_hours: 150,
    modality: 'hibrido',
    course_type: 'ocupados',
    price: 899,
    featured_image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '6',
    title: 'Administración de Sistemas Cloud',
    slug: 'administracion-sistemas-cloud',
    short_description: 'Especialízate en AWS, Azure y Google Cloud para gestionar infraestructura en la nube',
    duration_hours: 280,
    modality: 'online',
    course_type: 'teleformacion',
    price: 1399,
    featured_image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '7',
    title: 'Ciberseguridad y Hacking Ético',
    slug: 'ciberseguridad-hacking-etico',
    short_description: 'Protege sistemas y redes con técnicas de pentesting y análisis de vulnerabilidades',
    duration_hours: 320,
    modality: 'presencial',
    course_type: 'privados',
    price: 1799,
    featured_image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '8',
    title: 'Desarrollo de Apps Móviles',
    slug: 'desarrollo-apps-moviles',
    short_description: 'Crea aplicaciones nativas para iOS y Android con React Native y Flutter',
    duration_hours: 260,
    modality: 'online',
    course_type: 'desempleados',
    price: 0,
    featured_image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '9',
    title: 'Técnico en Administración y Finanzas',
    slug: 'fp-administracion-finanzas',
    short_description: 'Ciclo Formativo de Grado Superior en Administración y Finanzas con prácticas garantizadas',
    duration_hours: 2000,
    modality: 'presencial',
    course_type: 'fp-ciclo-superior',
    price: 2500,
    featured_image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '10',
    title: 'Técnico en Gestión Administrativa',
    slug: 'fp-gestion-administrativa',
    short_description: 'Ciclo Formativo de Grado Medio en Gestión Administrativa con título oficial',
    duration_hours: 1600,
    modality: 'presencial',
    course_type: 'fp-ciclo-medio',
    price: 1800,
    featured_image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '11',
    title: 'Project Management Professional (PMP)',
    slug: 'project-management-pmp',
    short_description: 'Certifícate como Project Manager y lidera proyectos con metodologías ágiles',
    duration_hours: 200,
    modality: 'hibrido',
    course_type: 'ocupados',
    price: 1499,
    featured_image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '12',
    title: 'Fotografía y Edición Digital',
    slug: 'fotografia-edicion-digital',
    short_description: 'Aprende técnicas de fotografía profesional y edición con Photoshop y Lightroom',
    duration_hours: 120,
    modality: 'presencial',
    course_type: 'privados',
    price: 799,
    featured_image: 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '13',
    title: 'Excel Avanzado y Business Intelligence',
    slug: 'excel-avanzado-bi',
    short_description: 'Domina Excel, Power BI y análisis de datos para tomar decisiones empresariales',
    duration_hours: 100,
    modality: 'online',
    course_type: 'teleformacion',
    price: 599,
    featured_image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '14',
    title: 'Inteligencia Artificial con ChatGPT',
    slug: 'inteligencia-artificial-chatgpt',
    short_description: 'Aprende a integrar IA en tus proyectos con ChatGPT, Midjourney y herramientas AI',
    duration_hours: 80,
    modality: 'online',
    course_type: 'ocupados',
    price: 699,
    featured_image: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  },
  {
    id: '15',
    title: 'Inglés para Negocios (B2-C1)',
    slug: 'ingles-negocios',
    short_description: 'Perfecciona tu inglés empresarial con enfoque en presentaciones y negociación',
    duration_hours: 150,
    modality: 'presencial',
    course_type: 'desempleados',
    price: 0,
    featured_image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=800',
    active: true
  }
]

// Helper functions
export const getCoursesByType = (type: MockCourse['course_type']) => {
  return mockCourses.filter(course => course.course_type === type && course.active)
}

export const getCoursesByModality = (modality: MockCourse['modality']) => {
  return mockCourses.filter(course => course.modality === modality && course.active)
}

export const getRandomCourses = (count: number = 6) => {
  const shuffled = [...mockCourses].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
