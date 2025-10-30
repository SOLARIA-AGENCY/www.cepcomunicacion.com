/**
 * Can Create AdsTemplates Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED (no anonymous template creation)
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (not involved in marketing)
 * - Marketing: ALLOWED (can create templates)
 * - Gestor: ALLOWED (full content management)
 * - Admin: ALLOWED (full system access)
 *
 * Business Intelligence Protection:
 * Templates contain marketing strategy and should not be publicly accessible.
 */

import type { Access } from 'payload';

export const canCreateAdsTemplates: Access = ({ req: { user } }) => {
  // Deny public access (no anonymous template creation)
  if (!user) {
    return false;
  }

  // Allow: admin, gestor, marketing
  if (['admin', 'gestor', 'marketing'].includes(user.role)) {
    return true;
  }

  // Deny: lectura, asesor, and any other roles
  return false;
};

export default canCreateAdsTemplates;
