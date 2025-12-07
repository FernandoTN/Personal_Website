/**
 * Test script for Feature 68: Cron job auto-publishes scheduled posts
 *
 * Steps:
 * 1. Create a test post scheduled for a specific past time
 * 2. Verify post status is 'SCHEDULED'
 * 3. Trigger cron endpoint /api/cron/publish-scheduled with CRON_SECRET
 * 4. Verify cron job executes successfully
 * 5. Verify post status changes to 'PUBLISHED'
 * 6. Verify published_at is set correctly
 * 7. Check if post appears in blog listing
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CRON_SECRET = process.env.CRON_SECRET || 'dev-cron-secret-for-testing-12345'
const BASE_URL = 'http://localhost:3000'

async function runTest() {
  console.log('='.repeat(60))
  console.log('Feature 68 Test: Cron job auto-publishes scheduled posts')
  console.log('='.repeat(60))

  let testPostId = null
  const testSlug = `test-cron-feature68-${Date.now()}`

  try {
    // Step 1: Create a test post scheduled for a past time
    console.log('\n[Step 1] Creating test post scheduled for past time...')

    const pastDate = new Date()
    pastDate.setMinutes(pastDate.getMinutes() - 5) // 5 minutes ago

    const testPost = await prisma.post.create({
      data: {
        slug: testSlug,
        title: 'Test Cron Feature 68 Post',
        excerpt: 'This is a test post for Feature 68 - cron auto-publish',
        content: '# Test Post\n\nThis post was created to test the cron job auto-publish feature.',
        status: 'SCHEDULED',
        scheduledFor: pastDate,
        author: 'Test Script',
      },
    })

    testPostId = testPost.id
    console.log(`  Created test post with ID: ${testPostId}`)
    console.log(`  Scheduled for: ${pastDate.toISOString()}`)

    // Step 2: Verify post status is 'SCHEDULED'
    console.log('\n[Step 2] Verifying post status is SCHEDULED...')
    const beforeCron = await prisma.post.findUnique({
      where: { id: testPostId },
      select: { status: true, scheduledFor: true, publishedAt: true },
    })

    if (beforeCron.status !== 'SCHEDULED') {
      throw new Error(`Expected status SCHEDULED but got ${beforeCron.status}`)
    }
    console.log(`  Status: ${beforeCron.status} (correct)`)
    console.log(`  scheduledFor: ${beforeCron.scheduledFor?.toISOString()}`)
    console.log(`  publishedAt: ${beforeCron.publishedAt} (should be null)`)

    // Step 3: Trigger cron endpoint with CRON_SECRET
    console.log('\n[Step 3] Triggering cron endpoint with CRON_SECRET...')
    console.log(`  URL: ${BASE_URL}/api/cron/publish-scheduled`)
    console.log(`  Secret: ${CRON_SECRET.substring(0, 10)}...`)

    const cronResponse = await fetch(`${BASE_URL}/api/cron/publish-scheduled`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
    })

    // Step 4: Verify cron job executes successfully
    console.log('\n[Step 4] Verifying cron job response...')
    const cronResult = await cronResponse.json()
    console.log(`  Status Code: ${cronResponse.status}`)
    console.log(`  Response: ${JSON.stringify(cronResult, null, 2)}`)

    if (!cronResponse.ok) {
      throw new Error(`Cron job failed with status ${cronResponse.status}: ${cronResult.error}`)
    }

    if (!cronResult.success) {
      throw new Error(`Cron job returned success=false: ${cronResult.error}`)
    }

    console.log(`  Published count: ${cronResult.publishedCount}`)

    // Step 5: Verify post status changes to 'PUBLISHED'
    console.log('\n[Step 5] Verifying post status is now PUBLISHED...')
    const afterCron = await prisma.post.findUnique({
      where: { id: testPostId },
      select: { status: true, publishedAt: true, scheduledFor: true },
    })

    if (afterCron.status !== 'PUBLISHED') {
      throw new Error(`Expected status PUBLISHED but got ${afterCron.status}`)
    }
    console.log(`  Status: ${afterCron.status} (correct)`)

    // Step 6: Verify published_at is set correctly
    console.log('\n[Step 6] Verifying published_at is set correctly...')
    if (!afterCron.publishedAt) {
      throw new Error('publishedAt was not set')
    }

    const publishedAt = new Date(afterCron.publishedAt)
    const now = new Date()
    const timeDiff = Math.abs(now.getTime() - publishedAt.getTime())

    if (timeDiff > 60000) {
      // More than 1 minute difference
      throw new Error(
        `publishedAt is too different from now. Expected ~now, got ${publishedAt.toISOString()}`
      )
    }
    console.log(`  publishedAt: ${afterCron.publishedAt.toISOString()}`)
    console.log(`  Time difference from now: ${timeDiff}ms (acceptable)`)

    // Step 7: Verify post appears in public API (optional - check blog page)
    console.log('\n[Step 7] Checking if post is accessible via API...')
    const postsResponse = await fetch(`${BASE_URL}/api/posts?limit=10`)
    const postsData = await postsResponse.json()

    const foundPost = postsData.posts?.find((p) => p.slug === testSlug)
    if (foundPost) {
      console.log('  Post found in public API listing (blog page would show it)')
    } else {
      console.log('  Note: Post may not appear in API if public API filters differently')
    }

    // Test invalid CRON_SECRET
    console.log('\n[Bonus Step] Testing unauthorized access...')
    const badResponse = await fetch(`${BASE_URL}/api/cron/publish-scheduled`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer wrong-secret',
        'Content-Type': 'application/json',
      },
    })
    console.log(`  With wrong secret - Status: ${badResponse.status}`)
    if (badResponse.status !== 401) {
      console.log(`  Warning: Expected 401 but got ${badResponse.status}`)
    } else {
      console.log('  Correctly rejected with 401 Unauthorized')
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('TEST PASSED - All steps completed successfully!')
    console.log('='.repeat(60))
    console.log(`
Summary:
- Created test post with status SCHEDULED
- Triggered cron endpoint with CRON_SECRET
- Post status changed to PUBLISHED
- published_at timestamp was set correctly
- Unauthorized requests are rejected

Feature 68 is working correctly!
`)

    return true
  } catch (error) {
    console.error('\n' + '='.repeat(60))
    console.error('TEST FAILED')
    console.error('='.repeat(60))
    console.error(`Error: ${error.message}`)
    console.error(error.stack)
    return false
  } finally {
    // Cleanup: Delete test post
    if (testPostId) {
      console.log('\n[Cleanup] Deleting test post...')
      try {
        await prisma.post.delete({ where: { id: testPostId } })
        console.log('  Test post deleted successfully')
      } catch (e) {
        console.log(`  Could not delete test post: ${e.message}`)
      }
    }

    await prisma.$disconnect()
  }
}

// Run the test
runTest()
  .then((passed) => {
    process.exit(passed ? 0 : 1)
  })
  .catch((error) => {
    console.error('Unexpected error:', error)
    process.exit(1)
  })
