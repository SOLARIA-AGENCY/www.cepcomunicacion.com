import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'course_type',
      type: 'select',
      required: true,
      options: [
        { label: 'Telemático', value: 'telematico' },
        { label: 'Ocupados', value: 'ocupados' },
        { label: 'Desempleados', value: 'desempleados' },
        { label: 'Privados', value: 'privados' },
        { label: 'Ciclo Medio', value: 'ciclo-medio' },
        { label: 'Ciclo Superior', value: 'ciclo-superior' },
      ],
    },
    {
      name: 'cycle',
      type: 'relationship',
      relationTo: 'cycles',
    },
    {
      name: 'campuses',
      type: 'relationship',
      relationTo: 'campuses',
      hasMany: true,
    },
    {
      name: 'duration_hours',
      type: 'number',
      min: 0,
    },
    {
      name: 'modality',
      type: 'select',
      options: [
        { label: 'Presencial', value: 'presencial' },
        { label: 'Online', value: 'online' },
        { label: 'Híbrido', value: 'hibrido' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'financial_aid_available',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
