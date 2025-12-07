import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { slugify, calculateReadingTime, extractExcerpt } from '@/lib/utils'

/**
 * GET /api/admin/posts/[id]
 * Returns a single post by ID or slug for editing
 * Requires authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Try to find by ID first, then by slug
    let post = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                slug: true,
                name: true,
              },
            },
          },
        },
        series: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    })

    // If not found by ID, try by slug
    if (!post) {
      post = await prisma.post.findUnique({
        where: { slug: id },
        include: {
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                },
              },
            },
          },
          series: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },
        },
      })
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('Admin post fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching the post.',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/posts/[id]
 * Updates an existing post
 * Requires authentication
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Parse request body
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Find the post first (by ID or slug)
    let existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    })

    if (!existingPost) {
      existingPost = await prisma.post.findUnique({
        where: { slug: id },
        include: {
          tags: true,
        },
      })
    }

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Title is required and must be at least 3 characters' },
        { status: 400 }
      )
    }

    // Handle slug changes
    let newSlug = existingPost.slug
    if (body.slug && body.slug !== existingPost.slug) {
      // Check if new slug is already taken
      const slugExists = await prisma.post.findFirst({
        where: {
          slug: body.slug as string,
          id: { not: existingPost.id },
        },
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A post with this slug already exists' },
          { status: 409 }
        )
      }
      newSlug = body.slug as string
    }

    // Calculate reading time if content changed
    let readingTimeMinutes = existingPost.readingTimeMinutes
    if (body.content && body.content !== existingPost.content) {
      readingTimeMinutes = calculateReadingTime(body.content as string)
    }

    // Generate excerpt if not provided
    const excerpt = body.excerpt
      ? (body.excerpt as string).trim()
      : body.content
        ? extractExcerpt(body.content as string, 160)
        : existingPost.excerpt

    // Validate category if provided
    const validCategories = ['ANCHOR', 'THEME', 'EMERGENT', 'PRACTITIONER', 'PROTOTYPE', 'CONFERENCE', 'METHODOLOGY']
    const category = body.category
      ? (validCategories.includes(body.category as string) ? body.category as string : null)
      : existingPost.category

    // Validate status
    const validStatuses = ['DRAFT', 'SCHEDULED', 'PUBLISHED']
    const status = body.status && validStatuses.includes(body.status as string)
      ? (body.status as 'DRAFT' | 'SCHEDULED' | 'PUBLISHED')
      : existingPost.status

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        slug: newSlug,
        title: (body.title as string).trim(),
        excerpt,
        content: body.content ? (body.content as string) : existingPost.content,
        featuredImage: body.featuredImage !== undefined
          ? (body.featuredImage as string | null)
          : existingPost.featuredImage,
        ogImage: body.ogImage !== undefined
          ? (body.ogImage as string | null)
          : existingPost.ogImage,
        status,
        publishedAt: body.publishedAt
          ? new Date(body.publishedAt as string)
          : existingPost.publishedAt,
        scheduledFor: body.scheduledFor
          ? new Date(body.scheduledFor as string)
          : existingPost.scheduledFor,
        seriesId: body.seriesId !== undefined
          ? (body.seriesId as string | null)
          : existingPost.seriesId,
        seriesOrder: body.seriesOrder !== undefined
          ? (body.seriesOrder as number | null)
          : existingPost.seriesOrder,
        category: category as 'ANCHOR' | 'THEME' | 'EMERGENT' | 'PRACTITIONER' | 'PROTOTYPE' | 'CONFERENCE' | 'METHODOLOGY' | null,
        metaTitle: body.metaTitle !== undefined
          ? ((body.metaTitle as string)?.trim() || null)
          : existingPost.metaTitle,
        metaDescription: body.metaDescription !== undefined
          ? ((body.metaDescription as string)?.trim() || null)
          : existingPost.metaDescription,
        readingTimeMinutes,
      },
    })

    // Handle tags update if provided
    if (Array.isArray(body.tags)) {
      // Delete existing post-tag relationships
      await prisma.postTag.deleteMany({
        where: { postId: existingPost.id },
      })

      // Decrement old tag counts
      for (const oldTag of existingPost.tags) {
        await prisma.tag.update({
          where: { id: oldTag.tagId },
          data: { postCount: { decrement: 1 } },
        })
      }

      // Add new tags
      for (const tagName of body.tags as string[]) {
        const tagSlug = slugify(tagName)

        // Find or create tag
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {
            postCount: { increment: 1 },
          },
          create: {
            slug: tagSlug,
            name: tagName.trim(),
            postCount: 1,
          },
        })

        // Create post-tag relationship
        await prisma.postTag.create({
          data: {
            postId: existingPost.id,
            tagId: tag.id,
          },
        })
      }
    }

    // Fetch the updated post with all relations
    const finalPost = await prisma.post.findUnique({
      where: { id: existingPost.id },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                slug: true,
                name: true,
              },
            },
          },
        },
        series: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      post: finalPost,
    })
  } catch (error) {
    console.error('Admin post update error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while updating the post.',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/posts/[id]
 * Deletes a post
 * Requires authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Find the post first (by ID or slug)
    let existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    })

    if (!existingPost) {
      existingPost = await prisma.post.findUnique({
        where: { slug: id },
        include: {
          tags: true,
        },
      })
    }

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Decrement tag counts before deletion
    for (const postTag of existingPost.tags) {
      await prisma.tag.update({
        where: { id: postTag.tagId },
        data: { postCount: { decrement: 1 } },
      })
    }

    // Delete the post (cascade will handle related records)
    await prisma.post.delete({
      where: { id: existingPost.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    console.error('Admin post delete error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while deleting the post.',
      },
      { status: 500 }
    )
  }
}
