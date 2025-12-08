import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/linkedin-db
 * Returns all database-backed LinkedIn posts
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const linkedinPosts = await prisma.linkedInPost.findMany({
      include: {
        post: {
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            featuredImage: true,
            status: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      posts: linkedinPosts,
    })
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch LinkedIn posts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/linkedin-db
 * Create a new LinkedIn post linked to a blog post
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { postId, content, hashtags } = body

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Check if blog post exists
    const blogPost = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!blogPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Check if LinkedIn post already exists for this blog post
    const existingLinkedInPost = await prisma.linkedInPost.findUnique({
      where: { postId },
    })

    if (existingLinkedInPost) {
      return NextResponse.json(
        { success: false, error: 'A LinkedIn post already exists for this blog post' },
        { status: 409 }
      )
    }

    // Create the LinkedIn post
    const linkedinPost = await prisma.linkedInPost.create({
      data: {
        postId,
        content: content || '',
        hashtags: hashtags || [],
        status: 'PENDING',
      },
      include: {
        post: {
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            featuredImage: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      linkedinPost,
    })
  } catch (error) {
    console.error('Error creating LinkedIn post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create LinkedIn post' },
      { status: 500 }
    )
  }
}
