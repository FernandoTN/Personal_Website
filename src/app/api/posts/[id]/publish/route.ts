import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

/**
 * POST /api/posts/[id]/publish
 * Publishes a post immediately by setting status to PUBLISHED and publishedAt to current time
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
        { success: false, error: 'Post is already published' },
        { status: 400 }
      )
    }

    // Publish the post
    const publishedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        scheduledFor: null, // Clear any scheduled date
      },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Post published successfully',
        post: publishedPost,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error publishing post:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while publishing the post',
      },
      { status: 500 }
    )
  }
}
