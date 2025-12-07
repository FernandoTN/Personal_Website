import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCronPublish() {
  // Step 1: Create a scheduled post with scheduledFor in the past (5 minutes ago)
  const scheduledFor = new Date(Date.now() - 5 * 60 * 1000);
  const slug = 'test-scheduled-post-cron-' + Date.now();

  console.log('=== Step 1: Create a test post scheduled for a past time ===');
  const post = await prisma.post.create({
    data: {
      slug,
      title: 'Test Scheduled Post for Cron Job',
      excerpt: 'This post tests the cron job auto-publish functionality.',
      content: '# Test Content\n\nThis is a test post to verify the cron job works correctly.',
      status: 'SCHEDULED',
      scheduledFor: scheduledFor,
      category: 'THEME',
      author: 'Fernando Torres',
    },
  });

  console.log('Created post:', {
    id: post.id,
    slug: post.slug,
    title: post.title,
    status: post.status,
    scheduledFor: post.scheduledFor,
    publishedAt: post.publishedAt,
  });

  // Step 2: Verify post status is 'SCHEDULED'
  console.log('\n=== Step 2: Verify post status is SCHEDULED ===');
  const verifyScheduled = await prisma.post.findUnique({
    where: { id: post.id },
    select: { status: true, scheduledFor: true, publishedAt: true },
  });
  console.log('Post status verification:', verifyScheduled);

  if (verifyScheduled.status !== 'SCHEDULED') {
    throw new Error('Post is not in SCHEDULED status');
  }
  console.log('PASS: Post is correctly in SCHEDULED status');

  // Step 3: Trigger the cron endpoint
  console.log('\n=== Step 3: Trigger /api/cron/publish-scheduled ===');
  const cronResponse = await fetch('http://localhost:3000/api/cron/publish-scheduled', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const cronResult = await cronResponse.json();
  console.log('Cron response:', JSON.stringify(cronResult, null, 2));

  // Step 4: Verify cron job executed successfully
  console.log('\n=== Step 4: Verify cron job executed successfully ===');
  if (!cronResult.success) {
    throw new Error('Cron job failed: ' + cronResult.error);
  }
  console.log('PASS: Cron job executed successfully');
  console.log('Published count:', cronResult.publishedCount);

  // Step 5: Verify post status changes to 'PUBLISHED'
  console.log('\n=== Step 5: Verify post status changes to PUBLISHED ===');
  const verifyPublished = await prisma.post.findUnique({
    where: { id: post.id },
    select: { status: true, publishedAt: true, scheduledFor: true },
  });
  console.log('Post after cron:', verifyPublished);

  if (verifyPublished.status !== 'PUBLISHED') {
    throw new Error('Post was not published by cron job');
  }
  console.log('PASS: Post status is now PUBLISHED');

  // Step 6: Verify published_at is set correctly
  console.log('\n=== Step 6: Verify published_at is set correctly ===');
  if (!verifyPublished.publishedAt) {
    throw new Error('publishedAt is not set');
  }
  console.log('publishedAt:', verifyPublished.publishedAt);
  console.log('PASS: publishedAt is set correctly');

  // Step 7: Verify post is now visible in public API
  console.log('\n=== Step 7: Verify post is visible in public API ===');
  const publicApiResponse = await fetch(`http://localhost:3000/api/posts?limit=10`);
  const publicApiResult = await publicApiResponse.json();
  const foundPost = publicApiResult.posts.find(p => p.slug === slug);

  if (!foundPost) {
    throw new Error('Post not found in public API');
  }
  console.log('Found post in public API:', { slug: foundPost.slug, title: foundPost.title });
  console.log('PASS: Post is visible in public API');

  // Cleanup: Delete the test post
  console.log('\n=== Cleanup: Deleting test post ===');
  await prisma.post.delete({ where: { id: post.id } });
  console.log('Test post deleted');

  console.log('\n=== ALL TESTS PASSED ===');
}

testCronPublish()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error('Test failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
