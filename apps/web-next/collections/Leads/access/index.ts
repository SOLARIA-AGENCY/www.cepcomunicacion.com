/**
 * Leads Collection Access Control
 *
 * Exports all access control functions for the Leads collection with
 * 6-tier RBAC + PUBLIC access for form submissions.
 *
 * Access Functions:
 * 1. Collection-level access (4 functions)
 *
 * Total: 4 access control functions
 */

// Collection-level access
export { canCreateLeads } from './canCreateLeads';
export { canReadLeads } from './canReadLeads';
export { canUpdateLeads } from './canUpdateLeads';
export { canDeleteLeads } from './canDeleteLeads';
