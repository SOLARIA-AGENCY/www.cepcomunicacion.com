#!/usr/bin/env tsx
/**
 * Database Seeding Script for CEPComunicacion v2
 *
 * Populates Payload CMS with realistic test data:
 * - 1 Admin user
 * - 3 Cycles (Ciclos Formativos)
 * - 4 Campuses (Sedes)
 * - 12 Courses (with relationships)
 *
 * Usage:
 *   npm run seed
 */

import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  console.log('🌱 Starting database seeding...\n')

  const payload = await getPayload({ config })

  try {
    // ============================================================
    // 1. CREATE ADMIN USER
    // ============================================================
    console.log('👤 Creating admin user...')

    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@cepcomunicacion.com',
        password: 'admin123',
        role: 'admin',
        name: 'Administrador CEP',
        active: true,
      },
    })
    console.log('   ✓ Admin user created:', adminUser.email)

    // ============================================================
    // 2. CREATE CYCLES (Ciclos Formativos)
    // ============================================================
    console.log('\n📚 Creating cycles...')

    const cycles = await Promise.all([
      payload.create({
        collection: 'cycles',
        data: {
          name: 'Ciclo Superior en Administración y Finanzas',
          code: 'CSAF',
          level: 'ciclo-superior',
          duration_years: 2,
          description: 'Formación profesional de grado superior en gestión administrativa, contable y financiera.',
          active: true,
        },
      }),
      payload.create({
        collection: 'cycles',
        data: {
          name: 'Ciclo Medio en Gestión Administrativa',
          code: 'CMGA',
          level: 'ciclo-medio',
          duration_years: 2,
          description: 'Técnico en Gestión Administrativa para empresas públicas y privadas.',
          active: true,
        },
      }),
      payload.create({
        collection: 'cycles',
        data: {
          name: 'Ciclo Superior en Marketing y Publicidad',
          code: 'CSMP',
          level: 'ciclo-superior',
          duration_years: 2,
          description: 'Formación en estrategias de marketing digital, publicidad y comunicación empresarial.',
          active: true,
        },
      }),
    ])
    console.log(`   ✓ ${cycles.length} cycles created`)

    // ============================================================
    // 3. CREATE CAMPUSES (Sedes)
    // ============================================================
    console.log('\n🏢 Creating campuses...')

    const campuses = await Promise.all([
      payload.create({
        collection: 'campuses',
        data: {
          name: 'CEP Madrid Centro',
          code: 'MAD-C',
          city: 'Madrid',
          address: 'Calle Gran Vía, 45',
          postal_code: '28013',
          phone: '+34 915 234 567',
          email: 'madrid@cepcomunicacion.com',
          active: true,
        },
      }),
      payload.create({
        collection: 'campuses',
        data: {
          name: 'CEP Barcelona Eixample',
          code: 'BCN-E',
          city: 'Barcelona',
          address: 'Passeig de Gràcia, 123',
          postal_code: '08008',
          phone: '+34 934 567 890',
          email: 'barcelona@cepcomunicacion.com',
          active: true,
        },
      }),
      payload.create({
        collection: 'campuses',
        data: {
          name: 'CEP Valencia Ciudad de las Artes',
          code: 'VLC-CA',
          city: 'Valencia',
          address: 'Avenida del Puerto, 234',
          postal_code: '46023',
          phone: '+34 963 456 789',
          email: 'valencia@cepcomunicacion.com',
          active: true,
        },
      }),
      payload.create({
        collection: 'campuses',
        data: {
          name: 'CEP Online',
          code: 'ONLINE',
          city: 'Online',
          address: 'Campus Virtual',
          postal_code: '00000',
          phone: '+34 900 123 456',
          email: 'online@cepcomunicacion.com',
          active: true,
        },
      }),
    ])
    console.log(`   ✓ ${campuses.length} campuses created`)

    // ============================================================
    // 4. CREATE COURSES
    // ============================================================
    console.log('\n📖 Creating courses...')

    const courses = await Promise.all([
      // Courses for Cycle 1 (Administración y Finanzas)
      payload.create({
        collection: 'courses',
        data: {
          name: 'Contabilidad y Fiscalidad Empresarial',
          slug: 'contabilidad-fiscalidad-empresarial',
          course_type: 'ciclo-superior',
          cycle: cycles[0].id,
          campuses: [campuses[0].id, campuses[1].id],
          duration_hours: 120,
          modality: 'presencial',
          price: 1200,
          description: 'Aprende los fundamentos de la contabilidad empresarial y la normativa fiscal vigente. Incluye prácticas con software profesional.',
          financial_aid_available: true,
          featured: true,
          active: true,
        },
      }),
      payload.create({
        collection: 'courses',
        data: {
          name: 'Gestión de Recursos Humanos',
          slug: 'gestion-recursos-humanos',
          course_type: 'ciclo-superior',
          cycle: cycles[0].id,
          campuses: [campuses[0].id, campuses[2].id],
          duration_hours: 80,
          modality: 'hibrido',
          price: 800,
          description: 'Domina las técnicas de selección, formación y administración de personal.',
          financial_aid_available: true,
          featured: false,
          active: true,
        },
      }),
      payload.create({
        collection: 'courses',
        data: {
          name: 'Excel Avanzado para Finanzas',
          slug: 'excel-avanzado-finanzas',
          course_type: 'privados',
          cycle: cycles[0].id,
          campuses: [campuses[3].id],
          duration_hours: 40,
          modality: 'online',
          price: 350,
          description: 'Curso intensivo de Excel con enfoque en análisis financiero, tablas dinámicas y macros.',
          financial_aid_available: false,
          featured: true,
          active: true,
        },
      }),

      // Courses for Cycle 2 (Gestión Administrativa)
      payload.create({
        collection: 'courses',
        data: {
          name: 'Administrativo de Oficina',
          slug: 'administrativo-oficina',
          course_type: 'ciclo-medio',
          cycle: cycles[1].id,
          campuses: [campuses[0].id, campuses[1].id, campuses[2].id],
          duration_hours: 160,
          modality: 'presencial',
          price: 0,
          description: 'Certificado de profesionalidad para desempleados. Aprende gestión documental, atención al cliente y ofimática.',
          financial_aid_available: false,
          featured: true,
          active: true,
        },
      }),
      payload.create({
        collection: 'courses',
        data: {
          name: 'Comunicación Empresarial y Protocolo',
          slug: 'comunicacion-empresarial-protocolo',
          course_type: 'ocupados',
          cycle: cycles[1].id,
          campuses: [campuses[0].id],
          duration_hours: 60,
          modality: 'hibrido',
          price: 450,
          description: 'Mejora tus habilidades de comunicación interna y externa en el entorno corporativo.',
          financial_aid_available: true,
          featured: false,
          active: true,
        },
      }),

      // Courses for Cycle 3 (Marketing y Publicidad)
      payload.create({
        collection: 'courses',
        data: {
          name: 'Marketing Digital y Redes Sociales',
          slug: 'marketing-digital-redes-sociales',
          course_type: 'ciclo-superior',
          cycle: cycles[2].id,
          campuses: [campuses[0].id, campuses[1].id, campuses[3].id],
          duration_hours: 100,
          modality: 'online',
          price: 900,
          description: 'Domina las estrategias de marketing en Facebook, Instagram, LinkedIn y TikTok. Incluye certificación de Meta Blueprint.',
          financial_aid_available: true,
          featured: true,
          active: true,
        },
      }),
      payload.create({
        collection: 'courses',
        data: {
          name: 'SEO y SEM para E-commerce',
          slug: 'seo-sem-ecommerce',
          course_type: 'privados',
          cycle: cycles[2].id,
          campuses: [campuses[3].id],
          duration_hours: 50,
          modality: 'online',
          price: 600,
          description: 'Optimización en buscadores y campañas de Google Ads para tiendas online.',
          financial_aid_available: false,
          featured: true,
          active: true,
        },
      }),
      payload.create({
        collection: 'courses',
        data: {
          name: 'Diseño Gráfico con Adobe Creative Suite',
          slug: 'diseno-grafico-adobe',
          course_type: 'privados',
          cycle: cycles[2].id,
          campuses: [campuses[0].id, campuses[1].id],
          duration_hours: 80,
          modality: 'presencial',
          price: 1100,
          description: 'Photoshop, Illustrator e InDesign para proyectos publicitarios profesionales.',
          financial_aid_available: false,
          featured: false,
          active: true,
        },
      }),
      payload.create({
        collection: 'courses',
        data: {
          name: 'Content Marketing y Copywriting',
          slug: 'content-marketing-copywriting',
          course_type: 'ocupados',
          cycle: cycles[2].id,
          campuses: [campuses[3].id],
          duration_hours: 40,
          modality: 'online',
          price: 400,
          description: 'Crea contenido persuasivo para blogs, emails y redes sociales.',
          financial_aid_available: true,
          featured: false,
          active: true,
        },
      }),
      payload.create({
        collection: 'courses',
        data: {
          name: 'Analítica Web con Google Analytics 4',
          slug: 'analitica-web-ga4',
          course_type: 'privados',
          cycle: cycles[2].id,
          campuses: [campuses[3].id],
          duration_hours: 30,
          modality: 'online',
          price: 350,
          description: 'Mide y optimiza el rendimiento de tus campañas digitales con GA4.',
          financial_aid_available: false,
          featured: true,
          active: true,
        },
      }),
    ])
    console.log(`   ✓ ${courses.length} courses created`)

    // ============================================================
    // SUMMARY
    // ============================================================
    console.log('\n✅ Database seeding completed successfully!\n')
    console.log('📊 Summary:')
    console.log(`   - ${1} admin user`)
    console.log(`   - ${cycles.length} cycles`)
    console.log(`   - ${campuses.length} campuses`)
    console.log(`   - ${courses.length} courses`)
    console.log('\n🌐 Access the admin panel:')
    console.log('   URL: http://localhost:3001/admin')
    console.log('   Email: admin@cepcomunicacion.com')
    console.log('   Password: admin123')
    console.log('\n🎨 View the frontend:')
    console.log('   Homepage: http://localhost:3001')
    console.log('   Courses: http://localhost:3001/cursos\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
