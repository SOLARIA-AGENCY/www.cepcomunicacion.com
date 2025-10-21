-- ============================================================================
-- SEED DATA: INITIAL DATABASE SETUP
-- ============================================================================
-- Description: Populates database with initial data for development/testing
-- Dependencies: All migrations (001-011) must be applied first
-- Author: Database Architecture Team
-- Date: 2025-10-21
-- ============================================================================
--
-- Contents:
-- 1. Educational Cycles (3 records)
-- 2. Campuses (2 locations)
-- 3. Users (1 admin user)
-- 4. Courses (5 sample courses)
-- 5. FAQs (3 common questions)
--
-- Usage:
-- psql -U postgres -d cepcomunicacion < seeds/001_initial_data.sql
--
-- IMPORTANT: This script is idempotent (safe to run multiple times)
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. EDUCATIONAL CYCLES
-- ============================================================================

INSERT INTO cycles (slug, name, description, level, order_display) VALUES
('fp-basica', 'Formación Profesional Básica', 'Ciclos formativos de nivel básico para acceso al mundo laboral', 'fp_basica', 1),
('grado-medio', 'Grado Medio', 'Ciclos Formativos de Grado Medio - Título de Técnico', 'grado_medio', 2),
('grado-superior', 'Grado Superior', 'Ciclos Formativos de Grado Superior - Título de Técnico Superior', 'grado_superior', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. CAMPUSES
-- ============================================================================

INSERT INTO campuses (slug, name, city, address, postal_code, phone, email, maps_url) VALUES
(
    'madrid-centro',
    'CEP Comunicación Madrid Centro',
    'Madrid',
    'Calle Gran Vía, 45, 3ª Planta',
    '28013',
    '+34 910 123 456',
    'madrid@cepcomunicacion.com',
    'https://maps.google.com/?q=Calle+Gran+Via+45+Madrid'
),
(
    'barcelona-eixample',
    'CEP Comunicación Barcelona Eixample',
    'Barcelona',
    'Passeig de Gràcia, 78, 2º',
    '08008',
    '+34 930 654 321',
    'barcelona@cepcomunicacion.com',
    'https://maps.google.com/?q=Passeig+de+Gracia+78+Barcelona'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. USERS
-- ============================================================================
-- Password: admin123 (bcrypt hash with cost factor 10)
-- IMPORTANT: Change password immediately in production!

INSERT INTO users (email, password_hash, name, role, is_active) VALUES
(
    'admin@cepcomunicacion.com',
    '$2b$10$rDq3LKWxVlZKX9qPfJZzqO8YJ5jK9YqX7mF1nZ3pQ2vR8sT4uW5vK',
    'Administrador Sistema',
    'admin',
    true
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 4. COURSES
-- ============================================================================

DO $$
DECLARE
    v_cycle_basica_id INTEGER;
    v_cycle_medio_id INTEGER;
    v_cycle_superior_id INTEGER;
    v_campus_madrid_id INTEGER;
    v_campus_barcelona_id INTEGER;
    v_admin_user_id INTEGER;
BEGIN
    -- Get IDs for foreign key references
    SELECT id INTO v_cycle_basica_id FROM cycles WHERE slug = 'fp-basica';
    SELECT id INTO v_cycle_medio_id FROM cycles WHERE slug = 'grado-medio';
    SELECT id INTO v_cycle_superior_id FROM cycles WHERE slug = 'grado-superior';
    SELECT id INTO v_campus_madrid_id FROM campuses WHERE slug = 'madrid-centro';
    SELECT id INTO v_campus_barcelona_id FROM campuses WHERE slug = 'barcelona-eixample';
    SELECT id INTO v_admin_user_id FROM users WHERE email = 'admin@cepcomunicacion.com';

    -- Insert courses
    INSERT INTO courses (
        slug,
        title,
        description,
        duration_hours,
        modality,
        price,
        cycle_id,
        campus_id,
        featured,
        status,
        seo_title,
        seo_description,
        seo_keywords,
        created_by
    ) VALUES
    (
        'fp-grado-medio-gestion-administrativa',
        'Grado Medio en Gestión Administrativa',
        'Aprende a gestionar la administración de empresas, contabilidad, recursos humanos y atención al cliente. Prácticas en empresas garantizadas.',
        2000,
        'presencial',
        4500.00,
        v_cycle_medio_id,
        v_campus_madrid_id,
        true,
        'published',
        'FP Grado Medio en Gestión Administrativa | CEP Comunicación Madrid',
        'Fórmate como Técnico en Gestión Administrativa con nuestro curso de FP Grado Medio. 2000 horas lectivas, prácticas en empresas y titulación oficial.',
        ARRAY['fp grado medio', 'gestión administrativa', 'administración', 'contabilidad', 'madrid'],
        v_admin_user_id
    ),
    (
        'fp-grado-superior-marketing-publicidad',
        'Grado Superior en Marketing y Publicidad',
        'Conviértete en especialista en marketing digital, publicidad, redes sociales y estrategias comerciales. Prácticas en agencias de publicidad.',
        2000,
        'hibrido',
        5200.00,
        v_cycle_superior_id,
        v_campus_madrid_id,
        true,
        'published',
        'FP Grado Superior en Marketing y Publicidad | CEP Comunicación',
        'Especialízate en marketing digital y publicidad con nuestro FP Grado Superior. Modalidad híbrida, prácticas en agencias y titulación oficial.',
        ARRAY['fp grado superior', 'marketing', 'publicidad', 'marketing digital', 'redes sociales'],
        v_admin_user_id
    ),
    (
        'fp-grado-medio-sistemas-microinformaticos',
        'Grado Medio en Sistemas Microinformáticos y Redes',
        'Especialízate en instalación, configuración y mantenimiento de sistemas informáticos y redes. Alta demanda laboral.',
        2000,
        'presencial',
        4800.00,
        v_cycle_medio_id,
        v_campus_barcelona_id,
        true,
        'published',
        'FP Grado Medio en Sistemas Microinformáticos y Redes | Barcelona',
        'Fórmate como técnico en informática con nuestro FP Grado Medio. Aprende redes, sistemas operativos, hardware y ciberseguridad.',
        ARRAY['fp grado medio', 'informática', 'sistemas', 'redes', 'barcelona', 'tecnología'],
        v_admin_user_id
    ),
    (
        'fp-grado-superior-desarrollo-aplicaciones-web',
        'Grado Superior en Desarrollo de Aplicaciones Web',
        'Aprende a desarrollar aplicaciones web con React, Node.js, PostgreSQL y tecnologías modernas. Proyectos reales desde el primer día.',
        2000,
        'online',
        5500.00,
        v_cycle_superior_id,
        v_campus_madrid_id,
        true,
        'published',
        'FP Grado Superior en Desarrollo de Aplicaciones Web | Online',
        'Conviértete en desarrollador web Full Stack con nuestro FP Grado Superior online. React, Node.js, PostgreSQL y más. Titulación oficial.',
        ARRAY['fp grado superior', 'desarrollo web', 'programación', 'react', 'node.js', 'full stack', 'online'],
        v_admin_user_id
    ),
    (
        'fp-basica-servicios-administrativos',
        'FP Básica en Servicios Administrativos',
        'Primer paso hacia el mundo laboral. Aprende tareas administrativas básicas, ofimática y atención al público.',
        2000,
        'presencial',
        3200.00,
        v_cycle_basica_id,
        v_campus_barcelona_id,
        false,
        'published',
        'FP Básica en Servicios Administrativos | Barcelona',
        'Inicia tu carrera profesional con nuestro curso de FP Básica. Aprende ofimática, archivo, atención al cliente y comunicación empresarial.',
        ARRAY['fp básica', 'servicios administrativos', 'ofimática', 'barcelona'],
        v_admin_user_id
    )
    ON CONFLICT (slug) DO NOTHING;
END $$;

-- ============================================================================
-- 5. FAQS (FREQUENTLY ASKED QUESTIONS)
-- ============================================================================

INSERT INTO faqs (question, answer, category, order_display, is_published) VALUES
(
    '¿Cuáles son los requisitos de admisión para FP Grado Medio?',
    'Para acceder a un ciclo de Grado Medio necesitas tener el título de Graduado en ESO o equivalente. También puedes acceder mediante prueba de acceso si tienes 17 años cumplidos o más.',
    'enrollment',
    1,
    true
),
(
    '¿Las prácticas en empresas están incluidas en el curso?',
    'Sí, todos nuestros ciclos formativos incluyen un módulo de Formación en Centros de Trabajo (FCT) con prácticas en empresas del sector. Tenemos convenios con más de 200 empresas colaboradoras.',
    'general',
    2,
    true
),
(
    '¿Qué diferencia hay entre modalidad presencial, online e híbrida?',
    'Modalidad presencial: clases en el campus con horario fijo. Modalidad online: 100% a distancia con clases en directo y grabadas. Modalidad híbrida: combina sesiones presenciales (1-2 días/semana) con clases online.',
    'technical',
    3,
    true
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify seed data was inserted correctly:

-- SELECT COUNT(*) AS total_cycles FROM cycles;
-- -- Expected: 3

-- SELECT COUNT(*) AS total_campuses FROM campuses;
-- -- Expected: 2

-- SELECT COUNT(*) AS total_users FROM users;
-- -- Expected: 1

-- SELECT COUNT(*) AS total_courses FROM courses WHERE status = 'published';
-- -- Expected: 5

-- SELECT COUNT(*) AS total_faqs FROM faqs WHERE is_published = true;
-- -- Expected: 3

COMMIT;

-- ============================================================================
-- POST-SEED INSTRUCTIONS
-- ============================================================================
--
-- 1. Change admin password:
--    UPDATE users SET password_hash = '<new_bcrypt_hash>' WHERE email = 'admin@cepcomunicacion.com';
--
-- 2. Add course images:
--    INSERT INTO media (filename, original_filename, mime_type, size_bytes, storage_path, entity_type, entity_id, uploaded_by)
--    VALUES ('course-123.jpg', 'gestion-administrativa.jpg', 'image/jpeg', 245678, '/media/courses/course-123.jpg', 'course', 1, 1);
--
-- 3. Add SEO metadata:
--    INSERT INTO seo_metadata (entity_type, entity_id, title, description, og_image)
--    VALUES ('course', 1, 'FP Grado Medio en Gestión Administrativa...', '...', '...');
--
-- 4. Create sample campaigns and leads for testing marketing features
--
-- ============================================================================
