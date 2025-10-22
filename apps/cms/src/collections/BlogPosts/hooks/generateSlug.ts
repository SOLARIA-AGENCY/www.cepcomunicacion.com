import { CollectionBeforeChangeHook } from 'payload';
import { slugify } from '../../../utils/slugify';

/**
 * Automatically generate slug from blog post title if not provided
 *
 * This hook runs before validation and creates a URL-friendly slug
 * from the post title if a slug is not already provided.
 */
export const generateSlug: CollectionBeforeChangeHook = async ({ data, operation }) => {
  // Only generate slug on create, or if title changes on update
  if (operation === 'create' || (operation === 'update' && data.title)) {
    // If slug is not provided or is empty, generate from title
    if (!data.slug || data.slug.trim() === '') {
      if (data.title) {
        data.slug = slugify(data.title);
      }
    }
  }

  return data;
};
