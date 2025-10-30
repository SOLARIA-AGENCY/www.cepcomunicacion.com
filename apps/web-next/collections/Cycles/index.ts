import type { CollectionConfig } from 'payload'

export const Cycles: CollectionConfig = {
  slug: 'cycles',
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
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      options: [
        { label: 'Ciclo Medio', value: 'ciclo-medio' },
        { label: 'Ciclo Superior', value: 'ciclo-superior' },
      ],
    },
    {
      name: 'duration_years',
      type: 'number',
      required: true,
      min: 1,
      max: 3,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
