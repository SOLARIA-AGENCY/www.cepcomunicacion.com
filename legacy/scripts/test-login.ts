#!/usr/bin/env tsx
/**
 * Test Login - Programmatic Authentication
 *
 * Tests the created superadmin account by logging in programmatically
 */

import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function testLogin() {
  console.log('═══════════════════════════════════════════')
  console.log('  CEP Formación - Login Test')
  console.log('═══════════════════════════════════════════\n')

  try {
    console.log('🚀 Initializing Payload CMS...')
    const payload = await getPayload({
      config: await configPromise,
    })
    console.log('✅ Payload initialized\n')

    console.log('🔐 Attempting login...')
    console.log('Email: admin@cepformacion.com')

    const result = await payload.login({
      collection: 'users',
      data: {
        email: 'admin@cepformacion.com',
        password: 'CEPAdmin2025!Secure',
      },
    })

    console.log('\n✅ Login Successful!')
    console.log('\n📄 Session Details:')
    console.log('─────────────────────────────────────')
    console.log('User ID:', result.user.id)
    console.log('Email:', result.user.email)
    console.log('Name:', result.user.name)
    console.log('Role:', result.user.role)
    console.log('Active:', result.user.is_active)
    console.log('Login Count:', result.user.login_count)
    console.log('Token:', result.token ? `${result.token.substring(0, 40)}...` : 'N/A')
    console.log('Expires:', result.exp ? new Date(result.exp * 1000).toISOString() : 'N/A')
    console.log('─────────────────────────────────────')

    console.log('\n🎉 Authentication verified successfully!')
    console.log('✅ Superadmin account is fully functional')

    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Login failed:', error.message)
    console.error('Error details:', error)
    process.exit(1)
  }
}

testLogin()
