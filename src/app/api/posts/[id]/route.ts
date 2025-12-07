import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/posts/[id]
 * Returns a single published post by ID or slug (public endpoint)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to find by ID first, then by slug - only published posts
    let post = await prisma.post.findFirst({
      where: {
        id,
        status: 'PUBLISHED',
        publishedAt: {
          lte: new Date(),
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        ogImage: true,
        category: true,
        author: true,
        publishedAt: true,
        readingTimeMinutes: true,
        viewCount: true,
        metaTitle: true,
        metaDescription: true,
        seriesId: true,
        seriesOrder: true,
        tags: {
          include: {
            tag: {
              select: {
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
      post = await prisma.post.findFirst({
        where: {
          slug: id,
          status: 'PUBLISHED',
          publishedAt: {
            lte: new Date(),
          },
        },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          content: true,
          featuredImage: true,
          ogImage: true,
          category: true,
          author: true,
          publishedAt: true,
          readingTimeMinutes: true,
          viewCount: true,
          metaTitle: true,
          metaDescription: true,
          seriesId: true,
          seriesOrder: true,
          tags: {
            include: {
              tag: {
                select: {
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

    // Increment view count (fire and forget)
    prisma.post
      .update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {
        // Ignore view count errors
      })

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('Post fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching the post.',
      },
      { status: 500 }
    )
  }
}
