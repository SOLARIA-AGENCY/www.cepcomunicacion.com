/**
 * Mock data for testing and design preview
 * Updated to match Course interface from types/index.ts
 */

import type { Course } from '../../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Marketing Digital y Redes Sociales',
    slug: 'marketing-digital-redes-sociales',
    duration_hours: 100,
    modality: 'online',
    price: 900,
    description: 'Domina las estrategias de marketing en Facebook, Instagram, LinkedIn y TikTok.',
    financial_aid_available: true,
    featured: true,
    active: true,
    cycle: 'ciclo-superior-marketing-publicidad',
    created_by: 'admin-user',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Diseño Gráfico con Adobe Creative Suite',
    slug: 'diseno-grafico-adobe',
    duration_hours: 80,
    modality: 'presencial',
    price: 1100,
    description: 'Photoshop, Illustrator e InDesign para proyectos publicitarios profesionales.',
    financial_aid_available: false,
    featured: false,
    active: true,
    cycle: 'ciclo-superior-marketing-publicidad',
    created_by: 'admin-user',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Administrativo de Oficina',
    slug: 'administrativo-oficina',
    duration_hours: 160,
    modality: 'presencial',
    price: 0,
    description: 'Certificado de profesionalidad para desempleados. Aprende gestión documental.',
    financial_aid_available: false,
    featured: true,
    active: true,
    cycle: 'ciclo-medio-gestion-administrativa',
    created_by: 'admin-user',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];
