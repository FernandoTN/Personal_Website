import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

/**
 * POST /api/posts/[id]/schedule
 * Schedules a post for future publication by setting status to SCHEDULED and scheduledFor date
 * Requires admin authentication
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: postId } = params

    // Validate post ID
    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Parse request body
    let body: { scheduledFor?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate scheduledFor date
    if (!body.scheduledFor) {
      return NextResponse.json(
        { success: false, error: 'scheduledFor date is required' },
        { status: 400 }
      )
    }

    const scheduledDate = new Date(body.scheduledFor)
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format for scheduledFor' },
        { status: 400 }
      )
    }

    // Ensure scheduled date is in the future
    const now = new Date()
    if (scheduledDate <= now) {
      return NextResponse.json(
        { success: false, error: 'Scheduled date must be in the future' },
        { status: 400 }
      )
    }

    // Find the post
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if post is already published
    if (existingPost.status === 'PUBLISHED') {
      return NextResponse.json(
        { success: false, error: 'Cannot schedule an already published post' },
        { status: 400 }
      )
    }

    // Schedule the post
    const scheduledPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'SCHEDULED',
        scheduledFor: scheduledDate,
        publishedAt: null, // Clear any previous published date
      },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        scheduledFor: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Post scheduled successfully',
        post: scheduledPost,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error scheduling post:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while scheduling the post',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/posts/[id]/schedule
 * Alternative method for scheduling - same functionality as POST
 */
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Delegate to POST handler
  return POST(request, context)
}
