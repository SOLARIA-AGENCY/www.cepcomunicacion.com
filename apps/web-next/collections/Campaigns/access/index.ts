/**
 * Campaigns Collection - Access Control Export
 *
 * 6-Tier RBAC System:
 * 1. Public: No access (business intelligence protection)
 * 2. Lectura: Read only
 * 3. Asesor: Read only
 * 4. Marketing: Create + Update own campaigns (ownership-based)
 * 5. Gestor: Full CRUD
 * 6. Admin: Full CRUD
 */

export { canCreateCampaigns } from './canCreateCampaigns';
export { canReadCampaigns } from './canReadCampaigns';
export { canUpdateCampaigns } from './canUpdateCampaigns';
export { canDeleteCampaigns } from './canDeleteCampaigns';
