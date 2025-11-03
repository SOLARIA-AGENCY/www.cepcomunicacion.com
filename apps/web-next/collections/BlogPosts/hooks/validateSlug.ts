/**
 * Validate Slug Hook
 *
 * Auto-generates slug from title if not provided.
 * Normalizes Spanish characters and converts to lowercase with hyphens.
 *
 * Normalization rules:
 * - á, é, í, ó, ú → a, e, i, o, u
 * - ñ → n
 * - ü → u
 * - Spaces → hyphens
 * - Multiple hyphens → single hyphen
 * - Remove special characters
 * - Convert to lowercase
 */

import type { FieldHook } from 'payload';

export const validateSlug: FieldHook = async ({
  data,
  req,
  operation,
  value,
  originalDoc,
}) => {
  // If slug is provided, return it as-is (validation happens in field validator)
  if (value) {
    return value;
  }

  // If no slug and we have a title, generate slug
  const title = data?.title || originalDoc?.title;
  if (!title) {
    return value;
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ñ/g, 'n')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  return slug;
};

export default validateSlug;
