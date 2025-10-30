/**
 * Can Delete FAQs Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (read-only role)
 * - Marketing: DENIED (cannot delete even own FAQs - use soft delete instead)
 * - Gestor: ALLOWED (all FAQs)
 * - Admin: ALLOWED (all FAQs)
 *
 * Note: Marketing users should use soft delete (active=false) instead of hard delete
 */

import type { Access } from 'payload';

export const canDeleteFAQs: Access = ({ req: { user } }) => {
  // Deny public access
  if (!user) {
    return false;
  }

  // Only admin and gestor can delete FAQs
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Deny: marketing, lectura, asesor, and any other roles
  return false;
};

export default canDeleteFAQs;
