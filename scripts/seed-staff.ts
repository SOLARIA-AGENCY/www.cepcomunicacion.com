/**
 * Seed Staff Data
 *
 * Populates the database with test staff members (professors and administrativos)
 * for all three campuses.
 *
 * Usage:
 * PAYLOAD_SECRET="xxx" DATABASE_URL="xxx" npx tsx scripts/seed-staff.ts
 */

import { getPayload } from 'payload';
import config from '../apps/cms/src/payload.config';

async function seedStaff() {
  console.log('[SEED] Starting staff data population...');

  try {
    const payload = await getPayload({ config });

    // Fetch campuses for assignment
    const campuses = await payload.find({
      collection: 'campuses',
      limit: 10,
    });

    if (campuses.docs.length === 0) {
      console.error('[SEED] ❌ No campuses found. Please run seed-campuses.ts first.');
      process.exit(1);
    }

    console.log(`[SEED] Found ${campuses.docs.length} campuses`);

    // Define test staff members
    const staffMembers = [
      // PROFESORES - CEP Norte
      {
        staff_type: 'profesor',
        full_name: 'Prof. María García López',
        email: 'maria.garcia@cepcomunicacion.com',
        phone: '+34 912 345 001',
        bio: 'Experta en Marketing Digital con más de 15 años de experiencia en estrategias de contenido y redes sociales para marcas internacionales.',
        specialties: ['marketing-digital', 'redes-sociales', 'seo-sem'],
        campus: campuses.docs[0].id, // CEP Norte
        is_active: true,
      },
      {
        staff_type: 'profesor',
        full_name: 'Prof. Carlos Rodríguez Martín',
        email: 'carlos.rodriguez@cepcomunicacion.com',
        phone: '+34 912 345 002',
        bio: 'Desarrollador Full Stack con amplia experiencia en formación técnica. Especializado en JavaScript, React y Node.js.',
        specialties: ['desarrollo-web'],
        campus: campuses.docs[0].id, // CEP Norte
        is_active: true,
      },
      {
        staff_type: 'profesor',
        full_name: 'Prof. Ana Martínez Sánchez',
        email: 'ana.martinez@cepcomunicacion.com',
        phone: '+34 912 345 003',
        bio: 'Diseñadora gráfica y directora de arte con experiencia en branding corporativo y diseño editorial.',
        specialties: ['diseno-grafico', 'fotografia'],
        campus: campuses.docs[0].id, // CEP Norte
        is_active: true,
      },

      // PROFESORES - CEP Santa Cruz
      {
        staff_type: 'profesor',
        full_name: 'Prof. Juan López Fernández',
        email: 'juan.lopez@cepcomunicacion.com',
        phone: '+34 922 345 001',
        bio: 'Especialista en producción audiovisual y edición de video. Ha trabajado en proyectos para televisión y cine.',
        specialties: ['audiovisual', 'video', 'fotografia'],
        campus: campuses.docs[1].id, // CEP Santa Cruz
        is_active: true,
      },
      {
        staff_type: 'profesor',
        full_name: 'Prof. Laura González Pérez',
        email: 'laura.gonzalez@cepcomunicacion.com',
        phone: '+34 922 345 002',
        bio: 'Consultora en gestión empresarial y transformación digital. MBA con enfoque en startups tecnológicas.',
        specialties: ['gestion-empresarial', 'ecommerce'],
        campus: campuses.docs[1].id, // CEP Santa Cruz
        is_active: true,
      },

      // PROFESORES - CEP Sur
      {
        staff_type: 'profesor',
        full_name: 'Prof. Miguel Ángel Torres',
        email: 'miguel.torres@cepcomunicacion.com',
        phone: '+34 922 445 001',
        bio: 'Experto en SEO/SEM y analítica web. Google Partner certificado con más de 10 años gestionando campañas digitales.',
        specialties: ['seo-sem', 'marketing-digital'],
        campus: campuses.docs[2].id, // CEP Sur
        is_active: true,
      },
      {
        staff_type: 'profesor',
        full_name: 'Prof. Isabel Ramírez Castro',
        email: 'isabel.ramirez@cepcomunicacion.com',
        phone: '+34 922 445 002',
        bio: 'Especialista en e-commerce y estrategias de venta online. Ha ayudado a +50 empresas a digitalizar sus ventas.',
        specialties: ['ecommerce', 'marketing-digital'],
        campus: campuses.docs[2].id, // CEP Sur
        is_active: true,
      },

      // ADMINISTRATIVOS - Uno por sede
      {
        staff_type: 'administrativo',
        full_name: 'Carmen Suárez Díaz',
        email: 'carmen.suarez@cepcomunicacion.com',
        phone: '+34 912 345 100',
        bio: 'Responsable administrativa con experiencia en gestión de centros formativos.',
        campus: campuses.docs[0].id, // CEP Norte
        is_active: true,
      },
      {
        staff_type: 'administrativo',
        full_name: 'Francisco Morales Gil',
        email: 'francisco.morales@cepcomunicacion.com',
        phone: '+34 922 345 100',
        bio: 'Coordinador administrativo y de servicios generales.',
        campus: campuses.docs[1].id, // CEP Santa Cruz
        is_active: true,
      },
      {
        staff_type: 'administrativo',
        full_name: 'Rosa María Hernández',
        email: 'rosamaria.hernandez@cepcomunicacion.com',
        phone: '+34 922 445 100',
        bio: 'Gestora administrativa y atención al alumno.',
        campus: campuses.docs[2].id, // CEP Sur
        is_active: true,
      },
    ];

    // Create all staff members
    console.log(`[SEED] Creating ${staffMembers.length} staff members...`);

    for (const member of staffMembers) {
      try {
        const created = await payload.create({
          collection: 'staff',
          data: member,
        });

        console.log(
          `[SEED] ✅ Created ${created.staff_type}: ${created.full_name} (${created.email})`
        );
      } catch (error: any) {
        console.error(`[SEED] ❌ Error creating ${member.full_name}:`, error.message);
      }
    }

    console.log('[SEED] ✅ Staff data population complete!');
    console.log(`[SEED] Created staff members across ${campuses.docs.length} campuses`);

    // Count by type
    const professors = staffMembers.filter((s) => s.staff_type === 'profesor').length;
    const admins = staffMembers.filter((s) => s.staff_type === 'administrativo').length;

    console.log(`[SEED] - Professors: ${professors}`);
    console.log(`[SEED] - Administrativos: ${admins}`);

    process.exit(0);
  } catch (error) {
    console.error('[SEED] ❌ Fatal error:', error);
    process.exit(1);
  }
}

seedStaff();
