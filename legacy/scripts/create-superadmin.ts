#!/usr/bin/env tsx
/**
 * Create First Superadmin - Programmatic User Creation
 *
 * Usage: NODE_ENV=production tsx scripts/create-superadmin.ts
 */

import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function createSuperadmin() {
  console.log('🚀 Initializing Payload CMS...')

  // Initialize Payload
  const payload = await getPayload({
    config: await configPromise,
  })

  console.log('✅ Payload initialized successfully')

  // Superadmin credentials
  const superadminData = {
    email: 'admin@cepformacion.com',
    password: 'CEPAdmin2025!Secure',
    name: 'Administrador Principal',
    role: 'admin',
  }

  try {
    // Check if user already exists
    console.log(`\n📋 Checking if user ${superadminData.email} exists...`)
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: superadminData.email,
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      console.log('⚠️  User already exists!')
      console.log('📧 Email:', existingUsers.docs[0].email)
      console.log('👤 Name:', existingUsers.docs[0].name)
      console.log('🔐 Role:', existingUsers.docs[0].role)
      return existingUsers.docs[0]
    }

    // Create superadmin user with overrideAccess to bypass access control
    console.log('\n🔨 Creating superadmin user...')
    const user = await payload.create({
      collection: 'users',
      data: superadminData,
      overrideAccess: true, // Bypass access control for first user creation
    })

    console.log('✅ Superadmin user created successfully!')
    console.log('\n📄 User Details:')
    console.log('─────────────────────────────────────')
    console.log('ID:', user.id)
    console.log('Email:', user.email)
    console.log('Name:', user.name)
    console.log('Role:', user.role)
    console.log('Created:', user.createdAt)
    console.log('─────────────────────────────────────')

    return user
  } catch (error) {
    console.error('❌ Error creating superadmin:', error)
    throw error
  }
}

async function loginSuperadmin() {
  console.log('\n🔐 Authenticating superadmin...')

  const payload = await getPayload({
    config: await configPromise,
  })

  try {
    const result = await payload.login({
      collection: 'users',
      data: {
        email: 'admin@cepformacion.com',
        password: 'CEPAdmin2025!Secure',
      },
    })

    console.log('✅ Authentication successful!')
    console.log('\n🎫 Session Details:')
    console.log('─────────────────────────────────────')
    console.log('User ID:', result.user.id)
    console.log('Email:', result.user.email)
    console.log('Token:', result.token ? `${result.token.substring(0, 30)}...` : 'N/A')
    console.log('Expires:', result.exp ? new Date(result.exp * 1000).toISOString() : 'N/A')
    console.log('─────────────────────────────────────')

    return result
  } catch (error) {
    console.error('❌ Authentication failed:', error)
    throw error
  }
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  CEP Formación - Superadmin Setup')
  console.log('═══════════════════════════════════════════\n')

  try {
    // Step 1: Create superadmin
    const user = await createSuperadmin()

    // Step 2: Authenticate
    const session = await loginSuperadmin()

    console.log('\n✅ Setup Complete!')
    console.log('\n📝 Access Credentials:')
    console.log('─────────────────────────────────────')
    console.log('URL:', process.env.PAYLOAD_PUBLIC_SERVER_URL + '/admin')
    console.log('Email: admin@cepformacion.com')
    console.log('Password: CEPAdmin2025!Secure')
    console.log('─────────────────────────────────────')
    console.log('\n🎉 You can now login to the admin dashboard!')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

main()
