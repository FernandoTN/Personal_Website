import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/linkedin-db/[id]
 * Returns a single LinkedIn post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const linkedinPost = await prisma.linkedInPost.findUnique({
      where: { id },
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
      return NextResponse.json(
        { success: false, error: 'LinkedIn post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      linkedinPost,
    })
  } catch (error) {
    console.error('Error fetching LinkedIn post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch LinkedIn post' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/linkedin-db/[id]
 * Updates a LinkedIn post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const existingPost = await prisma.linkedInPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'LinkedIn post not found' },
        { status: 404 }
      )
    }

    // Validate status if provided
    const validStatuses = ['PENDING', 'MANUALLY_SCHEDULED', 'POSTED']
    const status = body.status && validStatuses.includes(body.status)
      ? body.status
      : existingPost.status

    const updatedPost = await prisma.linkedInPost.update({
      where: { id },
      data: {
        content: body.content !== undefined ? body.content : existingPost.content,
        hashtags: body.hashtags !== undefined ? body.hashtags : existingPost.hashtags,
        scheduledDate: body.scheduledDate !== undefined
          ? (body.scheduledDate ? new Date(body.scheduledDate) : null)
          : existingPost.scheduledDate,
        scheduledTime: body.scheduledTime !== undefined
          ? body.scheduledTime
          : existingPost.scheduledTime,
        imageFile: body.imageFile !== undefined
          ? body.imageFile
          : existingPost.imageFile,
        status,
        manuallyScheduled: body.manuallyScheduled !== undefined
          ? body.manuallyScheduled
          : existingPost.manuallyScheduled,
        linkedinPostUrl: body.linkedinPostUrl !== undefined
          ? body.linkedinPostUrl
          : existingPost.linkedinPostUrl,
        postedAt: body.postedAt !== undefined
          ? (body.postedAt ? new Date(body.postedAt) : null)
          : existingPost.postedAt,
      },
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
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      linkedinPost: updatedPost,
    })
  } catch (error) {
    console.error('Error updating LinkedIn post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update LinkedIn post' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/linkedin-db/[id]
 * Deletes a LinkedIn post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const existingPost = await prisma.linkedInPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'LinkedIn post not found' },
        { status: 404 }
      )
    }

    await prisma.linkedInPost.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'LinkedIn post deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting LinkedIn post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete LinkedIn post' },
      { status: 500 }
    )
  }
}
