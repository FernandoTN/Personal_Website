import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/posts
 * Returns all posts for admin dashboard (includes drafts and scheduled)
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)))
    const skip = (page - 1) * limit

    // Filter parameters
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build where clause (admin sees all posts)
    const where: Record<string, unknown> = {}

    // Add status filter
    if (status && status !== 'ALL') {
      where.status = status.toUpperCase()
    }

    // Add category filter
    if (category) {
      where.category = category.toUpperCase()
    }

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch posts with pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { createdAt: 'desc' },
        ],
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          status: true,
          category: true,
          author: true,
          publishedAt: true,
          scheduledFor: true,
          createdAt: true,
          updatedAt: true,
          readingTimeMinutes: true,
          viewCount: true,
          seriesId: true,
          seriesOrder: true,
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
      }),
      prisma.post.count({ where }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error('Admin posts fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching posts.',
      },
      { status: 500 }
    )
  }
}
