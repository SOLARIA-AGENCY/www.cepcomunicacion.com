import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'lectura',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Gestor', value: 'gestor' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Asesor', value: 'asesor' },
        { label: 'Lectura', value: 'lectura' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
