import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/cron/publish-scheduled
 *
 * Cron job endpoint that auto-publishes scheduled posts.
 * Finds all posts where status='SCHEDULED' AND scheduledFor <= now,
 * then updates their status to 'PUBLISHED' and sets publishedAt.
 *
 * Authentication: Requires CRON_SECRET header for security.
 * Vercel Cron automatically includes this header when configured.
 *
 * Schedule: Runs every hour (configured in vercel.json)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify CRON_SECRET for authentication
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // In production, require CRON_SECRET authentication
    // In development, allow requests without secret for testing
    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret) {
        console.error('CRON_SECRET environment variable is not set')
        return NextResponse.json(
          { success: false, error: 'Server configuration error' },
          { status: 500 }
        )
      }

      if (authHeader !== `Bearer ${cronSecret}`) {
        console.warn('Unauthorized cron job attempt')
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        )
      }
    } else {
      // In development, check for CRON_SECRET if provided
      if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        console.warn('Invalid CRON_SECRET in development mode')
        return NextResponse.json(
          { success: false, error: 'Unauthorized - Invalid CRON_SECRET' },
          { status: 401 }
        )
      }
    }

    const now = new Date()
    console.log(`[Cron] Running publish-scheduled at ${now.toISOString()}`)

    // Find all posts that are scheduled and due for publication
    const scheduledPosts = await prisma.post.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledFor: {
          lte: now,
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        scheduledFor: true,
      },
    })

    if (scheduledPosts.length === 0) {
      console.log('[Cron] No scheduled posts due for publication')
      return NextResponse.json({
        success: true,
        message: 'No scheduled posts due for publication',
        publishedCount: 0,
        posts: [],
      })
    }

    console.log(`[Cron] Found ${scheduledPosts.length} posts to publish`)

    // Publish all due posts
    const publishedPosts = await Promise.all(
      scheduledPosts.map(async (post) => {
        try {
          const updatedPost = await prisma.post.update({
            where: { id: post.id },
            data: {
              status: 'PUBLISHED',
              publishedAt: new Date(),
              // Keep scheduledFor for reference
            },
            select: {
              id: true,
              slug: true,
              title: true,
              status: true,
              publishedAt: true,
              scheduledFor: true,
            },
          })

          console.log(`[Cron] Published post: "${post.title}" (${post.slug})`)
          return {
            success: true,
            post: updatedPost,
          }
        } catch (error) {
          console.error(`[Cron] Failed to publish post ${post.id}:`, error)
          return {
            success: false,
            postId: post.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      })
    )

    const successfulPublishes = publishedPosts.filter((p) => p.success)
    const failedPublishes = publishedPosts.filter((p) => !p.success)

    console.log(
      `[Cron] Completed: ${successfulPublishes.length} published, ${failedPublishes.length} failed`
    )

    return NextResponse.json({
      success: true,
      message: `Published ${successfulPublishes.length} posts`,
      publishedCount: successfulPublishes.length,
      failedCount: failedPublishes.length,
      posts: successfulPublishes.map((p) => (p as { success: true; post: object }).post),
      errors: failedPublishes.length > 0 ? failedPublishes : undefined,
    })
  } catch (error) {
    console.error('[Cron] Error in publish-scheduled:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing scheduled posts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cron/publish-scheduled
 *
 * Alternative method for Vercel Cron (some configurations use GET)
 * Delegates to POST handler
 */
export async function GET(request: NextRequest) {
  return POST(request)
}
