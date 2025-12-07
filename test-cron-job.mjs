// Test script for cron job auto-publish functionality
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestScheduledPost() {
  console.log('Creating test scheduled post with past scheduled date...')

  // Create a post scheduled for 1 hour ago
  const pastDate = new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago

  const post = await prisma.post.create({
    data: {
      slug: `cron-test-post-${Date.now()}`,
      title: 'Cron Job Test Post - Auto-Publish',
      excerpt: 'This is a test post to verify the cron job auto-publish functionality.',
      content: '# Cron Job Test\n\nThis post was created to test the automatic publishing cron job.',
      status: 'SCHEDULED',
      scheduledFor: pastDate,
      author: 'Test Author',
    },
  })

  console.log('Created test post:')
  console.log('  ID:', post.id)
  console.log('  Slug:', post.slug)
  console.log('  Status:', post.status)
  console.log('  Scheduled For:', post.scheduledFor)
  console.log('')

  return post
}

async function verifyPostStatus(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      scheduledFor: true,
      publishedAt: true,
    },
  })

  console.log('Current post status:')
  console.log('  ID:', post.id)
  console.log('  Status:', post.status)
  console.log('  Scheduled For:', post.scheduledFor)
  console.log('  Published At:', post.publishedAt)

  return post
}

async function listScheduledPosts() {
  const posts = await prisma.post.findMany({
    where: { status: 'SCHEDULED' },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      scheduledFor: true,
    },
  })

  console.log(`Found ${posts.length} scheduled posts:`)
  for (const post of posts) {
    console.log(`  - ${post.title} (scheduled for: ${post.scheduledFor})`)
  }

  return posts
}

async function triggerCronEndpoint() {
  console.log('Triggering cron endpoint...')

  const response = await fetch('http://localhost:3000/api/cron/publish-scheduled', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer dev-cron-secret-for-testing-12345',
      'Content-Type': 'application/json',
    },
  })

  const result = await response.json()
  console.log('Cron endpoint response:')
  console.log(JSON.stringify(result, null, 2))

  return result
}

async function cleanupTestPosts() {
  // Delete test posts created by this script
  const deleted = await prisma.post.deleteMany({
    where: {
      slug: {
        startsWith: 'cron-test-post-',
      },
    },
  })

  console.log(`Cleaned up ${deleted.count} test posts`)
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'full-test'

  try {
    switch (command) {
      case 'create':
        await createTestScheduledPost()
        break

      case 'list':
        await listScheduledPosts()
        break

      case 'trigger':
        await triggerCronEndpoint()
        break

      case 'cleanup':
        await cleanupTestPosts()
        break

      case 'full-test':
        console.log('=== Running Full Cron Job Test ===\n')

        // Step 1: List existing scheduled posts
        console.log('Step 1: Checking existing scheduled posts...')
        await listScheduledPosts()
        console.log('')

        // Step 2: Create a test scheduled post
        console.log('Step 2: Creating test scheduled post...')
        const post = await createTestScheduledPost()
        console.log('')

        // Step 3: Verify post is scheduled
        console.log('Step 3: Verifying post status is SCHEDULED...')
        await verifyPostStatus(post.id)
        console.log('')

        // Step 4: Trigger the cron endpoint
        console.log('Step 4: Triggering cron endpoint...')
        await triggerCronEndpoint()
        console.log('')

        // Step 5: Verify post is now published
        console.log('Step 5: Verifying post status is now PUBLISHED...')
        const updatedPost = await verifyPostStatus(post.id)
        console.log('')

        // Step 6: Verify success
        if (updatedPost.status === 'PUBLISHED' && updatedPost.publishedAt) {
          console.log('SUCCESS! Cron job auto-publish is working correctly.')
          console.log('Post was auto-published at:', updatedPost.publishedAt)
        } else {
          console.log('FAILED! Post was not auto-published.')
          console.log('Expected status: PUBLISHED, Got:', updatedPost.status)
        }
        console.log('')

        // Step 7: Cleanup (optional)
        console.log('Step 7: Cleaning up test posts...')
        await cleanupTestPosts()
        break

      default:
        console.log('Usage: node test-cron-job.mjs [command]')
        console.log('Commands:')
        console.log('  create    - Create a test scheduled post')
        console.log('  list      - List all scheduled posts')
        console.log('  trigger   - Trigger the cron endpoint')
        console.log('  cleanup   - Delete test posts')
        console.log('  full-test - Run full test (default)')
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
