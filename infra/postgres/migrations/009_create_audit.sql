-- ============================================================================
-- MIGRATION 009: CREATE AUDIT LOGS TABLE
-- ============================================================================
-- Description: Creates audit_logs table for GDPR compliance and activity tracking
-- Dependencies: 001_create_base_tables.sql (users)
-- Tables: audit_logs
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================

-- =========================
-- TABLE: audit_logs
-- =========================
-- Comprehensive audit trail for GDPR compliance and security

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER NOT NULL,
    entity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'GDPR-compliant audit trail for all data access and modifications';
COMMENT ON COLUMN audit_logs.user_id IS 'User who performed the action (FK to users table) - SET NULL on delete to preserve audit trail';
COMMENT ON COLUMN audit_logs.action IS 'Action performed: created, updated, deleted, accessed, exported, erased';
COMMENT ON COLUMN audit_logs.entity_type IS 'Entity type: lead, course, user, campaign, etc.';
COMMENT ON COLUMN audit_logs.entity_id IS 'Entity ID (e.g., lead.id, course.id)';
COMMENT ON COLUMN audit_logs.entity_data IS 'JSONB snapshot of entity data BEFORE change (for rollback and compliance)';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of user (IPv4 or IPv6) - INET type supports both';
COMMENT ON COLUMN audit_logs.user_agent IS 'Browser/client user agent string';
COMMENT ON COLUMN audit_logs.timestamp IS 'When the action occurred (WITH TIME ZONE for accuracy)';

-- Foreign Key Behavior:
-- - ON DELETE SET NULL: Preserve audit trail even if user is deleted (GDPR Article 30 requirement)

-- GDPR Compliance Requirements:
-- 1. Record of Processing Activities (GDPR Article 30)
--    - All lead data access/modifications must be logged
--    - Minimum retention: 3 years for compliance audits
--
-- 2. Data Subject Rights (GDPR Articles 15, 16, 17, 18, 20, 21)
--    - Right to access: Log all data exports (action='exported')
--    - Right to erasure: Log data deletion (action='erased')
--    - Right to rectification: Log updates with before/after snapshots
--
-- 3. Data Breach Notification (GDPR Article 33)
--    - Audit logs help detect unauthorized access
--    - IP and user_agent help identify breach scope
--
-- 4. Accountability Principle (GDPR Article 5)
--    - Demonstrate compliance to supervisory authorities
--    - Audit trail proves proper data handling

-- Action Types:
-- - created: New record created
-- - updated: Record modified
-- - deleted: Record soft-deleted (marked as deleted)
-- - accessed: Sensitive data viewed (e.g., lead personal info)
-- - exported: Data exported (CSV, PDF, API response)
-- - erased: Hard deletion (GDPR erasure request)

-- Example Usage:
-- Log lead creation:
-- INSERT INTO audit_logs (user_id, action, entity_type, entity_id, entity_data, ip_address)
-- VALUES (42, 'created', 'lead', 1234, '{"name":"John Doe","email":"john@example.com"}', '192.168.1.1');

-- Log GDPR erasure request:
-- INSERT INTO audit_logs (user_id, action, entity_type, entity_id, entity_data, ip_address)
-- VALUES (42, 'erased', 'lead', 1234, '{"name":"John Doe","email":"john@example.com","reason":"GDPR Article 17 request"}', '192.168.1.1');

-- Security Considerations:
-- 1. This table should be append-only (no UPDATE or DELETE operations)
-- 2. Implement database-level triggers to prevent tampering
-- 3. Regular backups to prevent data loss
-- 4. Restricted access (only admins should query this table)
-- 5. Consider table partitioning for high-volume environments

-- ============================================================================
-- ROLLBACK SCRIPT (DOWN MIGRATION)
-- ============================================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- ============================================================================
