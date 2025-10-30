/**
 * Can Read Campaigns Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED (business intelligence protection)
 * - Lectura: ALLOWED (reporting access)
 * - Asesor: ALLOWED (read-only)
 * - Marketing: ALLOWED
 * - Gestor: ALLOWED
 * - Admin: ALLOWED
 */

import type { Access } from 'payload';

export const canReadCampaigns: Access = ({ req: { user } }) => {
  // Deny public access (business intelligence protection)
  if (!user) {
    return false;
  }

  // All authenticated users can read campaigns
  // (lectura, asesor, marketing, gestor, admin)
  return true;
};

export default canReadCampaigns;
