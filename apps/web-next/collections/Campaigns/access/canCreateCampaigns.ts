/**
 * Can Create Campaigns Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED (business intelligence protection)
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (read-only for campaigns)
 * - Marketing: ALLOWED
 * - Gestor: ALLOWED
 * - Admin: ALLOWED
 */

import type { Access } from 'payload';

export const canCreateCampaigns: Access = ({ req: { user } }) => {
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

export default canCreateCampaigns;
