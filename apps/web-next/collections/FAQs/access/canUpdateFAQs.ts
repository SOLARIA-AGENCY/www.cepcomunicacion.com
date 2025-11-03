/**
 * Can Update FAQs Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (read-only role)
 * - Marketing: ALLOWED (own FAQs only, created_by = user.id)
 * - Gestor: ALLOWED (all FAQs)
 * - Admin: ALLOWED (all FAQs)
 *
 * Ownership-based permissions:
 * Marketing users can only update FAQs they created (created_by = user.id)
 */

import type { Access } from 'payload';

export const canUpdateFAQs: Access = ({ req: { user } }) => {
  // Deny public access
  if (!user) {
    return false;
  }

  // Admin and gestor can update all FAQs
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing can only update their own FAQs
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

export default canUpdateFAQs;
