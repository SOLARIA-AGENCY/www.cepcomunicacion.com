/**
 * Can Update BlogPosts Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (read-only role)
 * - Marketing: ALLOWED (own posts only, created_by = user.id)
 * - Gestor: ALLOWED (all posts)
 * - Admin: ALLOWED (all posts)
 *
 * Ownership-based permissions:
 * Marketing users can only update posts they created (created_by = user.id)
 */

import type { Access } from 'payload';

export const canUpdateBlogPosts: Access = ({ req: { user } }) => {
  // Deny public access
  if (!user) {
    return false;
  }

  // Admin and gestor can update all posts
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing can only update their own posts
  if (user.role === 'marketing') {
    return {
      created_by: {
        equals: user.id,
      },
    };
  }

  // Deny: lectura, asesor, and any other roles
  return false;
};

export default canUpdateBlogPosts;
