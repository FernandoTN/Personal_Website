import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: { slug: string }
}

/**
 * GET /api/posts/[slug]
 * Returns a single post by slug
 * - For PUBLISHED posts: Returns full post data
 * - For SCHEDULED/DRAFT posts: Returns limited data with isScheduled flag
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Fetch the post by slug
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
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
            description: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if post is published
    const isPublished = post.status === 'PUBLISHED'
    const isScheduled = post.status === 'SCHEDULED'

    // For scheduled posts, return limited data with scheduled info
    if (isScheduled) {
      return NextResponse.json({
        success: true,
        isScheduled: true,
        post: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          scheduledFor: post.scheduledFor,
          series: post.series,
        },
      })
    }

    // For draft posts, return not found
    if (!isPublished) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment view count for published posts
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    })

    // Get series navigation info (only published posts)
    let seriesNavigation = null
    if (post.seriesId) {
      const seriesPosts = await prisma.post.findMany({
        where: {
          seriesId: post.seriesId,
          status: 'PUBLISHED',
        },
        orderBy: { seriesOrder: 'asc' },
        select: {
          slug: true,
          title: true,
          category: true,
          seriesOrder: true,
        },
      })

      const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug)
      const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null
      const nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null

      seriesNavigation = {
        name: post.series?.name || 'Series',
        current: currentIndex + 1,
        total: seriesPosts.length,
        prevSlug: prevPost?.slug || null,
        prevTitle: prevPost?.title || null,
        prevCategory: prevPost?.category || null,
        nextSlug: nextPost?.slug || null,
        nextTitle: nextPost?.title || null,
        nextCategory: nextPost?.category || null,
      }
    }

    return NextResponse.json({
      success: true,
      isScheduled: false,
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        ogImage: post.ogImage,
        category: post.category,
        author: post.author,
        publishedAt: post.publishedAt,
        readingTimeMinutes: post.readingTimeMinutes,
        viewCount: post.viewCount,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        tags: post.tags,
        series: post.series,
        seriesNavigation,
      },
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}
