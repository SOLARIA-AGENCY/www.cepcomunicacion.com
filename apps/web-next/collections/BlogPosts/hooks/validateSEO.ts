/**
 * Validate SEO Hook
 *
 * Auto-populates seo_title from title if not provided.
 * Truncates to 60 characters maximum for SEO best practices.
 */

import type { FieldHook } from 'payload';

export const validateSEO: FieldHook = async ({
  data,
  req,
  operation,
  value,
  originalDoc,
}) => {
  // If seo_title is provided, return it as-is
  if (value) {
    return value;
  }

  // If no seo_title and we have a title, use title (truncated to 60 chars)
  const title = data?.title || originalDoc?.title;
  if (!title) {
    return value;
  }

  // Truncate to 60 characters for SEO best practices
  const seoTitle = title.length > 60 ? title.substring(0, 60) : title;

  return seoTitle;
};

export default validateSEO;
