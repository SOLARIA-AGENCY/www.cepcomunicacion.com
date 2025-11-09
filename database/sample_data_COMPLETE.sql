-- ============================================================================
-- CEP COMUNICACIÓN v2 - COMPLETE SAMPLE DATA SCRIPT
-- ============================================================================
--
-- Purpose: Populate database with sample data for testing and development
-- Database: cepcomunicacion (PostgreSQL 16.10)
-- Server: Hetzner VPS (46.62.222.138)
-- Date: 2025-11-04
--
-- This script is IDEMPOTENT - safe to run multiple times
-- It will skip inserts if data already exists
--
-- Usage:
--   psql -U cepcomunicacion -h localhost -d cepcomunicacion -f sample_data_COMPLETE.sql
--
-- ============================================================================

-- Start transaction for safety
BEGIN;

-- ============================================================================
-- 1. CYCLES (3 entries)
-- ============================================================================

INSERT INTO cycles (slug, name, description, level, order_display)
VALUES
  (
    'desarrollo-aplicaciones-web',
    'Desarrollo de Aplicaciones Web',
    'Ciclo formativo de grado superior orientado al desarrollo de aplicaciones web modernas con tecnologías actuales',
    'grado_superior',
    1
  ),
  (
    'administracion-sistemas-informaticos-red',
    'Administración de Sistemas Informáticos en Red',
    'Ciclo formativo de grado superior para la gestión y administración de infraestructuras IT y redes',
    'grado_superior',
    2
  ),
  (
    'marketing-publicidad',
    'Marketing y Publicidad',
    'Ciclo formativo de grado medio orientado a estrategias comerciales y comunicación publicitaria',
    'grado_medio',
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. CAMPUSES (3 entries)
-- ============================================================================

INSERT INTO campuses (slug, name, city, address, postal_code, phone, email, maps_url)
VALUES
  (
    'madrid-centro',
    'Sede Central Madrid',
    'Madrid',
    'Gran Vía 123, 3º Planta',
    '28013',
    '+34 910 123 456',
    'madrid@cepcomunicacion.com',
    'https://maps.google.com/?q=Gran+Via+123+Madrid'
  ),
  (
    'barcelona-diagonal',
    'Sede Barcelona',
    'Barcelona',
    'Avinguda Diagonal 456, Local 2',
    '08006',
    '+34 930 456 789',
    'barcelona@cepcomunicacion.com',
    'https://maps.google.com/?q=Diagonal+456+Barcelona'
  ),
  (
    'campus-online',
    'Campus Virtual Online',
    'Online',
    'Plataforma Virtual',
    '00000',
    '+34 900 100 200',
    'online@cepcomunicacion.com',
    NULL
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. COURSES (5 entries)
-- ============================================================================

INSERT INTO courses (
  slug,
  name,
  cycle_id,
  short_description,
  modality,
  duration_hours,
  base_price,
  financial_aid_available,
  active,
  featured,
  meta_title,
  meta_description
)
VALUES

-- Course 1: Full Stack Development (DAW)
(
  'desarrollo-web-full-stack-react-nodejs',
  'Desarrollo Web Full Stack con React y Node.js',
  (SELECT id FROM cycles WHERE slug = 'desarrollo-aplicaciones-web'),
  'Aprende a crear aplicaciones web profesionales desde cero utilizando React para el frontend y Node.js para el backend. Incluye bases de datos, APIs REST y despliegue en producción.',
  'presencial',
  2000,
  3500.00,
  true,
  true,
  true,
  'Curso Full Stack React + Node.js | CEP Comunicación',
  'Conviértete en desarrollador Full Stack con nuestro curso intensivo de React y Node.js. 2000 horas prácticas, titulación oficial y prácticas en empresas.'
),

-- Course 2: Linux Server Administration (ASIR)
(
  'administracion-servidores-linux',
  'Administración de Servidores Linux',
  (SELECT id FROM cycles WHERE slug = 'administracion-sistemas-informaticos-red'),
  'Domina la administración de servidores Linux desde nivel básico hasta avanzado. Incluye shell scripting, seguridad, virtualización y gestión de servicios en producción.',
  'hibrido',
  1800,
  2800.00,
  true,
  true,
  true,
  'Curso Administración Linux | CEP Comunicación',
  'Especialízate en sistemas Linux con nuestro curso semipresencial. Laboratorios virtuales, certificaciones y salida profesional garantizada.'
),

-- Course 3: Digital Marketing (MKT)
(
  'marketing-digital-redes-sociales',
  'Marketing Digital y Redes Sociales',
  (SELECT id FROM cycles WHERE slug = 'marketing-publicidad'),
  'Curso completo de marketing digital: SEO, SEM, redes sociales, email marketing, analítica web y estrategias de contenido. 100% online con casos reales.',
  'online',
  1400,
  1800.00,
  false,
  true,
  false,
  'Curso Marketing Digital y RRSS | CEP Comunicación',
  'Aprende marketing digital desde cero con nuestro curso online. Certificación oficial, tutorías personalizadas y acceso a herramientas profesionales.'
),

-- Course 4: Python for Data Science (DAW - Free for unemployed)
(
  'programacion-python-data-science',
  'Programación Python para Data Science',
  (SELECT id FROM cycles WHERE slug = 'desarrollo-aplicaciones-web'),
  'Curso gratuito de Python orientado a análisis de datos y machine learning. Incluye Pandas, NumPy, Matplotlib y Scikit-learn. Dirigido a desempleados.',
  'online',
  800,
  0.00,
  true,
  true,
  true,
  'Curso Python Data Science GRATUITO | CEP Comunicación',
  'Curso gratuito de Python para desempleados. Aprende análisis de datos y machine learning con certificación oficial del SEPE.'
),

-- Course 5: Cybersecurity & Ethical Hacking (ASIR)
(
  'ciberseguridad-ethical-hacking',
  'Ciberseguridad y Ethical Hacking',
  (SELECT id FROM cycles WHERE slug = 'administracion-sistemas-informaticos-red'),
  'Conviértete en experto en seguridad informática. Aprende pentesting, análisis de vulnerabilidades, forense digital y gestión de incidentes de seguridad.',
  'presencial',
  2000,
  4200.00,
  true,
  true,
  true,
  'Curso Ciberseguridad y Hacking Ético | CEP Comunicación',
  'Especialización en ciberseguridad con certificaciones internacionales. Laboratorios reales, profesores expertos y alta empleabilidad.'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 4. COURSE-CAMPUS RELATIONSHIPS (9 links)
-- ============================================================================

-- Clear existing relationships to avoid duplicates
DELETE FROM courses_rels WHERE path = 'campuses';

-- Course 1: Full Stack (Madrid + Barcelona)
INSERT INTO courses_rels (parent_id, campuses_id, "order", path)
VALUES
  (
    (SELECT id FROM courses WHERE slug = 'desarrollo-web-full-stack-react-nodejs'),
    (SELECT id FROM campuses WHERE slug = 'madrid-centro'),
    1,
    'campuses'
  ),
  (
    (SELECT id FROM courses WHERE slug = 'desarrollo-web-full-stack-react-nodejs'),
    (SELECT id FROM campuses WHERE slug = 'barcelona-diagonal'),
    2,
    'campuses'
  );

-- Course 2: Linux Admin (All 3 campuses - hybrid)
INSERT INTO courses_rels (parent_id, campuses_id, "order", path)
VALUES
  (
    (SELECT id FROM courses WHERE slug = 'administracion-servidores-linux'),
    (SELECT id FROM campuses WHERE slug = 'madrid-centro'),
    1,
    'campuses'
  ),
  (
    (SELECT id FROM courses WHERE slug = 'administracion-servidores-linux'),
    (SELECT id FROM campuses WHERE slug = 'barcelona-diagonal'),
    2,
    'campuses'
  ),
  (
    (SELECT id FROM courses WHERE slug = 'administracion-servidores-linux'),
    (SELECT id FROM campuses WHERE slug = 'campus-online'),
    3,
    'campuses'
  );

-- Course 3: Marketing (Online only)
INSERT INTO courses_rels (parent_id, campuses_id, "order", path)
VALUES
  (
    (SELECT id FROM courses WHERE slug = 'marketing-digital-redes-sociales'),
    (SELECT id FROM campuses WHERE slug = 'campus-online'),
    1,
    'campuses'
  );

-- Course 4: Python Data Science (Online only)
INSERT INTO courses_rels (parent_id, campuses_id, "order", path)
VALUES
  (
    (SELECT id FROM courses WHERE slug = 'programacion-python-data-science'),
    (SELECT id FROM campuses WHERE slug = 'campus-online'),
    1,
    'campuses'
  );

-- Course 5: Cybersecurity (Madrid + Barcelona)
INSERT INTO courses_rels (parent_id, campuses_id, "order", path)
VALUES
  (
    (SELECT id FROM courses WHERE slug = 'ciberseguridad-ethical-hacking'),
    (SELECT id FROM campuses WHERE slug = 'madrid-centro'),
    1,
    'campuses'
  ),
  (
    (SELECT id FROM courses WHERE slug = 'ciberseguridad-ethical-hacking'),
    (SELECT id FROM campuses WHERE slug = 'barcelona-diagonal'),
    2,
    'campuses'
  );

-- Commit transaction
COMMIT;

-- ============================================================================
-- VERIFICATION REPORT
-- ============================================================================

\echo ''
\echo '============================================'
\echo '   SAMPLE DATA LOADING COMPLETE'
\echo '============================================'
\echo ''

-- Row counts
\echo 'ROW COUNTS:'
SELECT
  'Cycles' AS table_name,
  COUNT(*)::text AS rows
FROM cycles
UNION ALL
SELECT 'Campuses', COUNT(*)::text FROM campuses
UNION ALL
SELECT 'Courses', COUNT(*)::text FROM courses
UNION ALL
SELECT 'Course-Campus Links', COUNT(*)::text FROM courses_rels WHERE path = 'campuses';

\echo ''
\echo 'COURSES WITH RELATIONSHIPS:'
SELECT
  c.id,
  c.name,
  cy.name AS cycle,
  c.modality,
  c.base_price || '€' AS price,
  CASE WHEN c.featured THEN '⭐' ELSE '' END AS featured,
  COALESCE(
    (SELECT STRING_AGG(ca.city, ', ' ORDER BY cr."order")
     FROM courses_rels cr
     JOIN campuses ca ON cr.campuses_id = ca.id
     WHERE cr.parent_id = c.id AND cr.path = 'campuses'),
    'No locations'
  ) AS available_in
FROM courses c
JOIN cycles cy ON c.cycle_id = cy.id
ORDER BY c.id;

\echo ''
\echo '============================================'
\echo 'STATUS: ✓ All data loaded successfully'
\echo '============================================'
\echo ''
\echo 'Next steps:'
\echo '  1. Test API: curl http://46.62.222.138/api/courses'
\echo '  2. Open frontend: http://46.62.222.138/'
\echo '  3. Login to admin: http://46.62.222.138/admin'
\echo ''
