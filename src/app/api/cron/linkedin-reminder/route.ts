import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/cron/linkedin-reminder
 *
 * Cron job endpoint that sends daily reminders for LinkedIn posts that need to be scheduled.
 * Checks for blog posts that are scheduled to be published soon and have associated
 * LinkedIn posts that haven't been marked as scheduled yet.
 *
 * Authentication: Requires CRON_SECRET header for security.
 * Vercel Cron automatically includes this header when configured.
 *
 * Schedule: Runs daily at 4pm UTC (configured in vercel.json)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify CRON_SECRET for authentication
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // In production, require CRON_SECRET authentication
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
    console.log(`[Cron] Running linkedin-reminder at ${now.toISOString()}`)

    // Find posts scheduled for the next 3 days that have LinkedIn posts not yet scheduled
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    const upcomingPosts = await prisma.post.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledFor: {
          gte: now,
          lte: threeDaysFromNow,
        },
      },
      include: {
        linkedinPost: true,
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    })

    // Filter posts that have LinkedIn posts that haven't been marked as scheduled
    const postsNeedingLinkedIn = upcomingPosts.filter((post) => {
      // Check if the post has a LinkedIn post that is still in PENDING status (not scheduled)
      return post.linkedinPost && post.linkedinPost.status === 'PENDING'
    })

    if (postsNeedingLinkedIn.length === 0) {
      console.log('[Cron] No LinkedIn posts need scheduling reminders')
      return NextResponse.json({
        success: true,
        message: 'No LinkedIn posts need scheduling reminders',
        reminderCount: 0,
        posts: [],
      })
    }

    console.log(`[Cron] Found ${postsNeedingLinkedIn.length} posts needing LinkedIn scheduling`)

    // Prepare reminder data
    const reminders = postsNeedingLinkedIn.map((post) => ({
      postId: post.id,
      postTitle: post.title,
      postSlug: post.slug,
      scheduledFor: post.scheduledFor,
      linkedInPostId: post.linkedinPost?.id,
      daysUntilPublish: Math.ceil(
        ((post.scheduledFor?.getTime() || now.getTime()) - now.getTime()) / (24 * 60 * 60 * 1000)
      ),
    }))

    // Log reminders (in production, this could send an email notification)
    for (const reminder of reminders) {
      console.log(
        `[Cron] Reminder: "${reminder.postTitle}" publishes in ${reminder.daysUntilPublish} day(s) - LinkedIn post not scheduled`
      )
    }

    // Optionally send email notification if CONTACT_EMAIL and Resend are configured
    const contactEmail = process.env.CONTACT_EMAIL
    const resendApiKey = process.env.RESEND_API_KEY

    if (contactEmail && resendApiKey && reminders.length > 0) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(resendApiKey)

        const reminderList = reminders
          .map(
            (r) =>
              `- "${r.postTitle}" (publishes in ${r.daysUntilPublish} day${r.daysUntilPublish !== 1 ? 's' : ''})`
          )
          .join('\n')

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'noreply@fernandotorres.dev',
          to: contactEmail,
          subject: `LinkedIn Reminder: ${reminders.length} post${reminders.length !== 1 ? 's' : ''} need scheduling`,
          text: `The following blog posts are scheduled to publish soon but their LinkedIn posts haven't been scheduled yet:\n\n${reminderList}\n\nPlease visit the admin dashboard to schedule these LinkedIn posts.`,
        })

        console.log('[Cron] Sent LinkedIn reminder email')
      } catch (emailError) {
        console.error('[Cron] Failed to send reminder email:', emailError)
        // Continue even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Found ${reminders.length} posts needing LinkedIn scheduling`,
      reminderCount: reminders.length,
      posts: reminders,
    })
  } catch (error) {
    console.error('[Cron] Error in linkedin-reminder:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing LinkedIn reminders',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cron/linkedin-reminder
 *
 * Alternative method for Vercel Cron (some configurations use GET)
 * Delegates to POST handler
 */
export async function GET(request: NextRequest) {
  return POST(request)
}
