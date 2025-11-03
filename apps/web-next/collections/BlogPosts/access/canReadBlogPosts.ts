/**
 * Can Read BlogPosts Access Control
 *
 * 6-Tier RBAC:
 * - Public: ALLOWED (published and active posts only)
 * - Lectura: ALLOWED (all posts)
 * - Asesor: ALLOWED (all posts)
 * - Marketing: ALLOWED (all posts)
 * - Gestor: ALLOWED (all posts)
 * - Admin: ALLOWED (all posts)
 *
 * Business Logic:
 * - Public users see only posts with status='published' AND active=true
 * - Authenticated users see all posts regardless of status/active
 */

import type { Access } from 'payload';

export const canReadBlogPosts: Access = ({ req: { user } }) => {
  // Authenticated users can read all posts
  if (user) {
    return true;
  }

  // Public users can only read published and active posts
  return {
    and: [
      {
        status: {
          equals: 'published',
        },
      },
      {
        active: {
          equals: true,
        },
      },
    ],
  };
};

export default canReadBlogPosts;
