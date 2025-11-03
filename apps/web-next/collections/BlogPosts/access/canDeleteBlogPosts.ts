/**
 * Can Delete BlogPosts Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (read-only role)
 * - Marketing: DENIED (cannot delete even own posts - use soft delete instead)
 * - Gestor: ALLOWED (all posts)
 * - Admin: ALLOWED (all posts)
 *
 * Note: Marketing users should use soft delete (active=false) instead of hard delete
 */

import type { Access } from 'payload';

export const canDeleteBlogPosts: Access = ({ req: { user } }) => {
  // Deny public access
  if (!user) {
    return false;
  }

  // Only admin and gestor can delete posts
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Deny: marketing, lectura, asesor, and any other roles
  return false;
};

export default canDeleteBlogPosts;
