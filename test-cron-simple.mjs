import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a test post scheduled for the past
  console.log('Creating test scheduled post...')
  const pastDate = new Date(Date.now() - 3600000) // 1 hour ago

  const post = await prisma.post.create({
    data: {
      slug: `cron-test-${Date.now()}`,
      title: 'Cron Test Post - Should Auto-Publish',
      excerpt: 'Test post for cron job auto-publish.',
      content: '# Cron Test\n\nThis post should be auto-published by the cron job.',
      status: 'SCHEDULED',
      scheduledFor: pastDate,
      author: 'Test Author',
    },
  })

  console.log('Created post with ID:', post.id)
  console.log('Status:', post.status)
  console.log('Scheduled for:', post.scheduledFor)
  console.log('')

  // Now trigger the cron endpoint
  console.log('Triggering cron endpoint...')
  const response = await fetch('http://localhost:3000/api/cron/publish-scheduled', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer dev-cron-secret-for-testing-12345',
      'Content-Type': 'application/json',
    },
  })

  const result = await response.json()
  console.log('Cron response:', JSON.stringify(result, null, 2))
  console.log('')

  // Check the post status after cron
  const updatedPost = await prisma.post.findUnique({
    where: { id: post.id },
    select: { id: true, status: true, publishedAt: true },
  })

  console.log('Post after cron:')
  console.log('Status:', updatedPost.status)
  console.log('Published at:', updatedPost.publishedAt)
  console.log('')

  if (updatedPost.status === 'PUBLISHED' && updatedPost.publishedAt) {
    console.log('SUCCESS! Post was auto-published!')
  } else {
    console.log('FAILED! Post was not auto-published.')
  }

  // Cleanup
  await prisma.post.delete({ where: { id: post.id } })
  console.log('Cleaned up test post.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
