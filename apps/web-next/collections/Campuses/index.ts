import type { CollectionConfig } from 'payload'

export const Campuses: CollectionConfig = {
  slug: 'campuses',
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
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'postal_code',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
