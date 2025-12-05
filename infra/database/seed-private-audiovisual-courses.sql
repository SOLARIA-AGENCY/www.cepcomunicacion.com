-- =====================================================
-- Seed Script: 4 Private Audiovisual Courses
-- =====================================================
-- This script adds 4 new private courses in the audiovisual
-- and technology areas to the CEP Formación database.
--
-- Courses:
-- 1. Piloto de Drones Profesional (Tecnología)
-- 2. Streaming en Vivo Profesional (Audiovisual)
-- 3. Producción de Video para Redes Sociales (Marketing)
-- 4. Producción Audiovisual Profesional (Audiovisual)
-- =====================================================

-- First, we need to get the cycle_id for a generic professional course cycle
-- If no cycles exist, we'll need to create one first

-- Check if we have a cycle for professional courses
DO $$
DECLARE
  v_cycle_id INTEGER;
  v_campus_id INTEGER;
BEGIN
  -- Try to find a generic professional cycle
  SELECT id INTO v_cycle_id
  FROM cycles
  WHERE code = 'PROF'
  LIMIT 1;

  -- If no professional cycle exists, create one
  IF v_cycle_id IS NULL THEN
    INSERT INTO cycles (slug, name, code, level, description, active, "createdAt", "updatedAt")
    VALUES (
      'cursos-profesionales',
      'Cursos Profesionales',
      'PROF',
      'certificado_profesionalidad',
      'Cursos profesionales especializados',
      true,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_cycle_id;

    RAISE NOTICE 'Created cycle with ID: %', v_cycle_id;
  END IF;

  -- Get a campus (preferably CEP NORTE or first available)
  SELECT id INTO v_campus_id
  FROM campuses
  WHERE active = true
  LIMIT 1;

  -- If no campus exists, create a default one
  IF v_campus_id IS NULL THEN
    INSERT INTO campuses (slug, name, code, city, active, is_main, "createdAt", "updatedAt")
    VALUES (
      'cep-norte',
      'CEP NORTE',
      'NORTE',
      'Tenerife',
      true,
      true,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_campus_id;

    RAISE NOTICE 'Created campus with ID: %', v_campus_id;
  END IF;

  -- =====================================================
  -- COURSE 1: Piloto de Drones Profesional
  -- =====================================================
  INSERT INTO courses (
    slug,
    name,
    short_description,
    cycle,
    modality,
    course_type,
    area,
    duration_hours,
    active,
    featured,
    "createdAt",
    "updatedAt"
  )
  VALUES (
    'piloto-drones-profesional',
    'PILOTO DE DRONES PROFESIONAL',
    'Conviértete en piloto profesional de drones. Certificación oficial, normativa vigente, técnicas de vuelo avanzadas y postproducción de contenido aéreo.',
    v_cycle_id,
    'presencial',
    'privado',
    'tecnologia',
    60,
    true,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    course_type = EXCLUDED.course_type,
    area = EXCLUDED.area,
    duration_hours = EXCLUDED.duration_hours,
    "updatedAt" = NOW();

  RAISE NOTICE 'Inserted/Updated: Piloto de Drones Profesional';

  -- =====================================================
  -- COURSE 2: Streaming en Vivo Profesional
  -- =====================================================
  INSERT INTO courses (
    slug,
    name,
    short_description,
    cycle,
    modality,
    course_type,
    area,
    duration_hours,
    active,
    featured,
    "createdAt",
    "updatedAt"
  )
  VALUES (
    'streaming-vivo-profesional',
    'STREAMING EN VIVO PROFESIONAL',
    'Domina las técnicas de streaming profesional. OBS Studio, configuración multi-cámara, iluminación, audio profesional y plataformas de transmisión.',
    v_cycle_id,
    'hibrido',
    'privado',
    'audiovisual',
    80,
    true,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    course_type = EXCLUDED.course_type,
    area = EXCLUDED.area,
    duration_hours = EXCLUDED.duration_hours,
    "updatedAt" = NOW();

  RAISE NOTICE 'Inserted/Updated: Streaming en Vivo Profesional';

  -- =====================================================
  -- COURSE 3: Producción de Video para Redes Sociales
  -- =====================================================
  INSERT INTO courses (
    slug,
    name,
    short_description,
    cycle,
    modality,
    course_type,
    area,
    duration_hours,
    active,
    featured,
    "createdAt",
    "updatedAt"
  )
  VALUES (
    'video-redes-sociales',
    'PRODUCCIÓN DE VIDEO PARA REDES SOCIALES',
    'Crea contenido viral para redes sociales. Grabación móvil, edición rápida, storytelling, reels, TikTok, YouTube Shorts y estrategias de engagement.',
    v_cycle_id,
    'online',
    'privado',
    'marketing',
    100,
    true,
    true,  -- Featured
    NOW(),
    NOW()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    course_type = EXCLUDED.course_type,
    area = EXCLUDED.area,
    duration_hours = EXCLUDED.duration_hours,
    featured = EXCLUDED.featured,
    "updatedAt" = NOW();

  RAISE NOTICE 'Inserted/Updated: Producción de Video para Redes Sociales';

  -- =====================================================
  -- COURSE 4: Producción Audiovisual Profesional
  -- =====================================================
  INSERT INTO courses (
    slug,
    name,
    short_description,
    cycle,
    modality,
    course_type,
    area,
    duration_hours,
    active,
    featured,
    "createdAt",
    "updatedAt"
  )
  VALUES (
    'produccion-audiovisual-profesional',
    'PRODUCCIÓN AUDIOVISUAL PROFESIONAL',
    'Formación completa en producción audiovisual. Preproducción, rodaje, dirección, iluminación, sonido, edición con Premiere Pro y postproducción.',
    v_cycle_id,
    'presencial',
    'privado',
    'audiovisual',
    200,
    true,
    true,  -- Featured
    NOW(),
    NOW()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    course_type = EXCLUDED.course_type,
    area = EXCLUDED.area,
    duration_hours = EXCLUDED.duration_hours,
    featured = EXCLUDED.featured,
    "updatedAt" = NOW();

  RAISE NOTICE 'Inserted/Updated: Producción Audiovisual Profesional';

END $$;

-- Verification query
SELECT
  id,
  slug,
  name,
  course_type,
  area,
  modality,
  duration_hours,
  active,
  featured
FROM courses
WHERE slug IN (
  'piloto-drones-profesional',
  'streaming-vivo-profesional',
  'video-redes-sociales',
  'produccion-audiovisual-profesional'
)
ORDER BY name;
