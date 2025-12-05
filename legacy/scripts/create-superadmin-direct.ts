#!/usr/bin/env tsx
/**
 * Create First Superadmin - Direct Database Insertion
 *
 * Bypasses Payload API and inserts directly into PostgreSQL
 * Uses bcrypt for password hashing to match Payload's auth system
 */

import { Client } from 'pg'
import * as bcrypt from 'bcryptjs'

async function createSuperadminDirect() {
  console.log('═══════════════════════════════════════════')
  console.log('  CEP Formación - Direct Superadmin Setup')
  console.log('═══════════════════════════════════════════\n')

  const client = new Client({
    connectionString: process.env.DATABASE_URL ||
      'postgresql://cepcomunicacion:cepcomunicacion_2025@localhost:5432/cepcomunicacion'
  })

  try {
    await client.connect()
    console.log('✅ Connected to PostgreSQL')

    // Check if user already exists
    const checkResult = await client.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@cepformacion.com']
    )

    if (checkResult.rows.length > 0) {
      console.log('\n⚠️  User already exists!')
      console.log('📧 Email:', checkResult.rows[0].email)
      console.log('👤 Name:', checkResult.rows[0].name)
      console.log('🔐 Role:', checkResult.rows[0].role)
      await client.end()
      return
    }

    // Generate salt and hash password using bcryptjs (Payload's default)
    const password = 'CEPAdmin2025!Secure'
    console.log('\n🔐 Hashing password with bcrypt...')

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)

    console.log('✅ Password hashed successfully')
    console.log('Salt length:', salt.length)
    console.log('Hash length:', hash.length)

    // Insert user with hashed password
    console.log('\n🔨 Inserting superadmin user...')

    const insertResult = await client.query(`
      INSERT INTO users (
        email,
        password,
        name,
        role,
        salt,
        hash,
        is_active,
        login_count,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, email, name, role, is_active, created_at
    `, [
      'admin@cepformacion.com',
      hash, // Store hash in password field (Payload standard)
      'Administrador Principal',
      'admin',
      salt,
      hash,
      true,
      0
    ])

    const user = insertResult.rows[0]

    console.log('\n✅ Superadmin user created successfully!')
    console.log('\n📄 User Details:')
    console.log('─────────────────────────────────────')
    console.log('ID:', user.id)
    console.log('Email:', user.email)
    console.log('Name:', user.name)
    console.log('Role:', user.role)
    console.log('Active:', user.is_active)
    console.log('Created:', user.created_at)
    console.log('─────────────────────────────────────')

    console.log('\n✅ Setup Complete!')
    console.log('\n📝 Access Credentials:')
    console.log('─────────────────────────────────────')
    console.log('URL: http://46.62.222.138/admin')
    console.log('Email: admin@cepformacion.com')
    console.log('Password: CEPAdmin2025!Secure')
    console.log('─────────────────────────────────────')
    console.log('\n🎉 You can now login to the admin dashboard!')

    await client.end()
    console.log('\n✅ Database connection closed')

  } catch (error) {
    console.error('\n❌ Error:', error)
    await client.end()
    process.exit(1)
  }
}

createSuperadminDirect()
