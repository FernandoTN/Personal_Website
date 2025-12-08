import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/linkedin-db/by-post/[postId]
 * Returns a LinkedIn post by its associated blog post ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { postId } = await params

    const linkedinPost = await prisma.linkedInPost.findUnique({
      where: { postId },
      include: {
        post: {
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            featuredImage: true,
            ogImage: true,
            status: true,
            category: true,
            publishedAt: true,
          },
        },
      },
    })

    if (!linkedinPost) {
      return NextResponse.json({
        success: true,
        linkedinPost: null,
        exists: false,
      })
    }

    return NextResponse.json({
      success: true,
      linkedinPost,
      exists: true,
    })
  } catch (error) {
    console.error('Error fetching LinkedIn post by blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch LinkedIn post' },
      { status: 500 }
    )
  }
}
