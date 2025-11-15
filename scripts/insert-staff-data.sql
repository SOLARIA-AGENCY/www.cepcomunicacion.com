-- Insert test staff data
-- 7 professors + 3 administrativos across 3 campuses

-- PROFESORES - CEP Norte (campus_id = 1)
INSERT INTO staff (staff_type, full_name, email, phone, bio, specialties, campus, is_active)
VALUES
('profesor', 'Prof. María García López', 'maria.garcia@cepcomunicacion.com', '+34 912 345 001',
 'Experta en Marketing Digital con más de 15 años de experiencia en estrategias de contenido y redes sociales para marcas internacionales.',
 ARRAY['marketing-digital', 'redes-sociales', 'seo-sem'], 1, TRUE),

('profesor', 'Prof. Carlos Rodríguez Martín', 'carlos.rodriguez@cepcomunicacion.com', '+34 912 345 002',
 'Desarrollador Full Stack con amplia experiencia en formación técnica. Especializado en JavaScript, React y Node.js.',
 ARRAY['desarrollo-web'], 1, TRUE),

('profesor', 'Prof. Ana Martínez Sánchez', 'ana.martinez@cepcomunicacion.com', '+34 912 345 003',
 'Diseñadora gráfica y directora de arte con experiencia en branding corporativo y diseño editorial.',
 ARRAY['diseno-grafico', 'fotografia'], 1, TRUE);

-- PROFESORES - CEP Santa Cruz (campus_id = 2)
INSERT INTO staff (staff_type, full_name, email, phone, bio, specialties, campus, is_active)
VALUES
('profesor', 'Prof. Juan López Fernández', 'juan.lopez@cepcomunicacion.com', '+34 922 345 001',
 'Especialista en producción audiovisual y edición de video. Ha trabajado en proyectos para televisión y cine.',
 ARRAY['audiovisual', 'video', 'fotografia'], 2, TRUE),

('profesor', 'Prof. Laura González Pérez', 'laura.gonzalez@cepcomunicacion.com', '+34 922 345 002',
 'Consultora en gestión empresarial y transformación digital. MBA con enfoque en startups tecnológicas.',
 ARRAY['gestion-empresarial', 'ecommerce'], 2, TRUE);

-- PROFESORES - CEP Sur (campus_id = 3)
INSERT INTO staff (staff_type, full_name, email, phone, bio, specialties, campus, is_active)
VALUES
('profesor', 'Prof. Miguel Ángel Torres', 'miguel.torres@cepcomunicacion.com', '+34 922 445 001',
 'Experto en SEO/SEM y analítica web. Google Partner certificado con más de 10 años gestionando campañas digitales.',
 ARRAY['seo-sem', 'marketing-digital'], 3, TRUE),

('profesor', 'Prof. Isabel Ramírez Castro', 'isabel.ramirez@cepcomunicacion.com', '+34 922 445 002',
 'Especialista en e-commerce y estrategias de venta online. Ha ayudado a +50 empresas a digitalizar sus ventas.',
 ARRAY['ecommerce', 'marketing-digital'], 3, TRUE);

-- ADMINISTRATIVOS - Uno por sede
INSERT INTO staff (staff_type, full_name, email, phone, bio, campus, is_active)
VALUES
('administrativo', 'Carmen Suárez Díaz', 'carmen.suarez@cepcomunicacion.com', '+34 912 345 100',
 'Responsable administrativa con experiencia en gestión de centros formativos.', 1, TRUE),

('administrativo', 'Francisco Morales Gil', 'francisco.morales@cepcomunicacion.com', '+34 922 345 100',
 'Coordinador administrativo y de servicios generales.', 2, TRUE),

('administrativo', 'Rosa María Hernández', 'rosamaria.hernandez@cepcomunicacion.com', '+34 922 445 100',
 'Gestora administrativa y atención al alumno.', 3, TRUE);

-- Assign all staff members to their respective campuses in the junction table
INSERT INTO campuses_staff (campus_id, staff_id)
SELECT campus, id FROM staff;

-- Verify insertions
SELECT
  s.id,
  s.staff_type,
  s.full_name,
  c.name AS campus_name,
  s.email
FROM staff s
LEFT JOIN campuses c ON s.campus = c.id
ORDER BY s.staff_type, s.campus, s.full_name;
