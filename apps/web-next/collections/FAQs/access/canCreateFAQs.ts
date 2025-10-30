/**
 * Can Create FAQs Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (read-only role for FAQs)
 * - Marketing: ALLOWED
 * - Gestor: ALLOWED
 * - Admin: ALLOWED
 */

import type { Access } from 'payload';

export const canCreateFAQs: Access = ({ req: { user } }) => {
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

export default canCreateFAQs;
