/**
 * Mock data for testing and design preview
 */

export const mockCourses = [
  {
    id: 1,
    name: 'Marketing Digital y Redes Sociales',
    slug: 'marketing-digital-redes-sociales',
    course_type: 'ciclo-superior',
    duration_hours: 100,
    modality: 'online',
    price: 900,
    description: 'Domina las estrategias de marketing en Facebook, Instagram, LinkedIn y TikTok.',
    financial_aid_available: true,
    featured: true,
    active: true,
    cycle: {
      name: 'Ciclo Superior en Marketing y Publicidad',
      code: 'CSMP',
    },
  },
  {
    id: 2,
    name: 'Diseño Gráfico con Adobe Creative Suite',
    slug: 'diseno-grafico-adobe',
    course_type: 'privados',
    duration_hours: 80,
    modality: 'presencial',
    price: 1100,
    description: 'Photoshop, Illustrator e InDesign para proyectos publicitarios profesionales.',
    financial_aid_available: false,
    featured: false,
    active: true,
    cycle: {
      name: 'Ciclo Superior en Marketing y Publicidad',
      code: 'CSMP',
    },
  },
  {
    id: 3,
    name: 'Administrativo de Oficina',
    slug: 'administrativo-oficina',
    course_type: 'ciclo-medio',
    duration_hours: 160,
    modality: 'presencial',
    price: 0,
    description: 'Certificado de profesionalidad para desempleados. Aprende gestión documental.',
    financial_aid_available: false,
    featured: true,
    active: true,
    cycle: {
      name: 'Ciclo Medio en Gestión Administrativa',
      code: 'CMGA',
    },
  },
];
