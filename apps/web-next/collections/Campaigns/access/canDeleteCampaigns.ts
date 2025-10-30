/**
 * Can Delete Campaigns Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (read-only for campaigns)
 * - Marketing: DENIED (cannot delete campaigns)
 * - Gestor: ALLOWED
 * - Admin: ALLOWED
 *
 * Note: Soft delete via 'active' flag is preferred for data retention
 */

import type { Access } from 'payload';

export const canDeleteCampaigns: Access = ({ req: { user } }) => {
  // Deny public access
  if (!user) {
    return false;
  }

  // Allow: gestor, admin only
  if (['gestor', 'admin'].includes(user.role)) {
    return true;
  }

  // Deny: lectura, asesor, marketing, and any other roles
  return false;
};

export default canDeleteCampaigns;
