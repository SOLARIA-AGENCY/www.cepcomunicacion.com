-- Quick seed: Create users table and admin user for Payload CMS
-- Based on Payload 3.x PostgreSQL schema

-- Create users table (minimal structure for auth)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin user
-- Password: admin123 (hashed with bcrypt, 10 rounds)
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (email, password, role, created_at, updated_at)
VALUES (
    'admin@cepcomunicacion.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Grant select to verify
SELECT id, email, role, created_at FROM users;
