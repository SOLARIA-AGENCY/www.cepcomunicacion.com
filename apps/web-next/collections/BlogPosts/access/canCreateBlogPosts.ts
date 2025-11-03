/**
 * Can Create BlogPosts Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (read-only role for blog posts)
 * - Marketing: ALLOWED
 * - Gestor: ALLOWED
 * - Admin: ALLOWED
 */

import type { Access } from 'payload';

export const canCreateBlogPosts: Access = ({ req: { user } }) => {
  // Deny public access
  if (!user) {
    return false;
  }

  // Allow: marketing, gestor, admin
  if (['marketing', 'gestor', 'admin'].includes(user.role)) {
    return true;
  }

  // Deny: lectura, asesor, and any other roles
  return false;
};

export default canCreateBlogPosts;
