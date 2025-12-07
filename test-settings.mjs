/**
 * Test script for admin settings feature
 * Tests both API endpoints and validates database operations
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testSettingsAPI() {
  console.log('=== Testing Admin Settings Feature ===\n')

  try {
    // Step 1: Check current settings in database
    console.log('1. Checking current settings in database...')
    const currentSettings = await prisma.siteSetting.findMany()
    console.log('   Current settings:', JSON.stringify(currentSettings, null, 2))

    // Step 2: Create or update settings directly in database
    console.log('\n2. Creating/updating settings in database...')

    const testTitle = 'Fernando Torres - AI & Healthcare Tech'
    const testDescription = 'Personal website and blog about AI, Healthcare Technology, and Enterprise Solutions'
    const testSocialLinks = {
      github: 'https://github.com/fernandotn',
      linkedin: 'https://linkedin.com/in/fernandotn',
      twitter: 'https://x.com/fernandotn'
    }

    // Upsert site title
    await prisma.siteSetting.upsert({
      where: { key: 'siteTitle' },
      update: { value: testTitle },
      create: { key: 'siteTitle', value: testTitle }
    })
    console.log('   - Site title updated')

    // Upsert site description
    await prisma.siteSetting.upsert({
      where: { key: 'siteDescription' },
      update: { value: testDescription },
      create: { key: 'siteDescription', value: testDescription }
    })
    console.log('   - Site description updated')

    // Upsert social links
    await prisma.siteSetting.upsert({
      where: { key: 'socialLinks' },
      update: { value: testSocialLinks },
      create: { key: 'socialLinks', value: testSocialLinks }
    })
    console.log('   - Social links updated')

    // Step 3: Verify settings were saved
    console.log('\n3. Verifying settings were saved...')
    const savedSettings = await prisma.siteSetting.findMany()

    for (const setting of savedSettings) {
      console.log(`   - ${setting.key}:`, setting.value)
    }

    // Step 4: Test unauthenticated API access
    console.log('\n4. Testing unauthenticated API access...')
    const unauthResponse = await fetch('http://localhost:3000/api/admin/settings')
    const unauthData = await unauthResponse.json()
    console.log('   - Status:', unauthResponse.status)
    console.log('   - Response:', unauthData)

    if (unauthResponse.status === 401) {
      console.log('   - PASS: API correctly rejects unauthenticated requests')
    } else {
      console.log('   - FAIL: API should return 401 for unauthenticated requests')
    }

    console.log('\n=== Test Complete ===')
    console.log('\nTo fully test the feature:')
    console.log('1. Navigate to http://localhost:3000/admin/login')
    console.log('2. Login with admin credentials (from .env)')
    console.log('3. Navigate to http://localhost:3000/admin/settings')
    console.log('4. Verify the form displays current settings')
    console.log('5. Update values and click Save')
    console.log('6. Verify success toast appears')
    console.log('7. Refresh page to confirm values persist')

  } catch (error) {
    console.error('Test error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSettingsAPI()
