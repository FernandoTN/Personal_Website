import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/comments
 * Returns all comments for admin moderation
 * Requires authentication
 */
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all comments with related post info
    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        authorName: true,
        authorEmail: true,
        content: true,
        status: true,
        createdAt: true,
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      comments,
      count: comments.length,
    })
  } catch (error) {
    console.error('Error fetching admin comments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
