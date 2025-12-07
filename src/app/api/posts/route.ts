import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { slugify, calculateReadingTime, extractExcerpt } from '@/lib/utils'

/**
 * POST request body interface for creating a new post
 */
interface CreatePostData {
  title: string
  content: string
  slug?: string
  excerpt?: string
  featuredImage?: string
  ogImage?: string
  status?: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
  publishedAt?: string
  scheduledFor?: string
  seriesId?: string
  seriesOrder?: number
  category?: string
  author?: string
  metaTitle?: string
  metaDescription?: string
  tags?: string[]
}

interface ValidationError {
  field: string
  message: string
}

/**
 * Validates post creation data
 * Returns array of validation errors (empty if valid)
 */
function validatePostData(data: unknown): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    errors.push({ field: 'form', message: 'Invalid form data' })
    return errors
  }

  const postData = data as Record<string, unknown>

  // Validate title (required)
  if (!postData.title || typeof postData.title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required' })
  } else if (postData.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters' })
  } else if (postData.title.trim().length > 200) {
    errors.push({ field: 'title', message: 'Title must be less than 200 characters' })
  }

  // Validate content (required)
  if (!postData.content || typeof postData.content !== 'string') {
    errors.push({ field: 'content', message: 'Content is required' })
  } else if (postData.content.trim().length < 10) {
    errors.push({ field: 'content', message: 'Content must be at least 10 characters' })
  }

  // Validate slug (optional, but if provided must be valid)
  if (postData.slug !== undefined && postData.slug !== null && postData.slug !== '') {
    if (typeof postData.slug !== 'string') {
      errors.push({ field: 'slug', message: 'Slug must be a string' })
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(postData.slug)) {
      errors.push({ field: 'slug', message: 'Slug must be URL-friendly (lowercase, hyphens only)' })
    }
  }

  // Validate category (optional, but if provided must be valid enum value)
  const validCategories = ['ANCHOR', 'THEME', 'EMERGENT', 'PRACTITIONER', 'PROTOTYPE', 'CONFERENCE', 'METHODOLOGY']
  if (postData.category !== undefined && postData.category !== null && postData.category !== '') {
    if (typeof postData.category !== 'string' || !validCategories.includes(postData.category)) {
      errors.push({ field: 'category', message: `Category must be one of: ${validCategories.join(', ')}` })
    }
  }

  // Validate status (optional, but if provided must be valid)
  const validStatuses = ['DRAFT', 'SCHEDULED', 'PUBLISHED']
  if (postData.status !== undefined && postData.status !== null) {
    if (typeof postData.status !== 'string' || !validStatuses.includes(postData.status)) {
      errors.push({ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` })
    }
  }

  // Validate seriesOrder (optional, but if provided must be a positive integer)
  if (postData.seriesOrder !== undefined && postData.seriesOrder !== null) {
    if (typeof postData.seriesOrder !== 'number' || !Number.isInteger(postData.seriesOrder) || postData.seriesOrder < 1) {
      errors.push({ field: 'seriesOrder', message: 'Series order must be a positive integer' })
    }
  }

  // Validate tags (optional, but if provided must be an array of strings)
  if (postData.tags !== undefined && postData.tags !== null) {
    if (!Array.isArray(postData.tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array' })
    } else if (postData.tags.some((tag: unknown) => typeof tag !== 'string')) {
      errors.push({ field: 'tags', message: 'All tags must be strings' })
    }
  }

  return errors
}

/**
 * Generates a unique slug from the title
 * If slug already exists, appends a number suffix
 */
async function generateUniqueSlug(title: string, providedSlug?: string): Promise<string> {
  const baseSlug = providedSlug || slugify(title)

  // Check if slug already exists
  const existingPost = await prisma.post.findUnique({
    where: { slug: baseSlug },
    select: { id: true },
  })

  if (!existingPost) {
    return baseSlug
  }

  // Find a unique slug by appending numbers
  let counter = 1
  let newSlug = `${baseSlug}-${counter}`

  while (true) {
    const exists = await prisma.post.findUnique({
      where: { slug: newSlug },
      select: { id: true },
    })

    if (!exists) {
      return newSlug
    }

    counter++
    newSlug = `${baseSlug}-${counter}`

    // Safety limit to prevent infinite loop
    if (counter > 100) {
      throw new Error('Unable to generate unique slug')
    }
  }
}

/**
 * POST /api/posts
 * Creates a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate post data
    const validationErrors = validatePostData(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validationErrors,
        },
        { status: 400 }
      )
    }

    const postData = body as CreatePostData

    // Generate unique slug from title if not provided
    const slug = await generateUniqueSlug(postData.title, postData.slug)

    // Calculate reading time from content
    const readingTimeMinutes = calculateReadingTime(postData.content)

    // Generate excerpt from content if not provided
    const excerpt = postData.excerpt?.trim() || extractExcerpt(postData.content, 160)

    // Determine the status (default to DRAFT for save draft action)
    const status = postData.status || 'DRAFT'

    // Set publishedAt if status is PUBLISHED and not already set
    let publishedAt = postData.publishedAt ? new Date(postData.publishedAt) : null
    if (status === 'PUBLISHED' && !publishedAt) {
      publishedAt = new Date()
    }

    // Set scheduledFor if status is SCHEDULED
    const scheduledFor = postData.scheduledFor ? new Date(postData.scheduledFor) : null

    // Create the post in database
    const post = await prisma.post.create({
      data: {
        slug,
        title: postData.title.trim(),
        excerpt,
        content: postData.content,
        featuredImage: postData.featuredImage?.trim() || null,
        ogImage: postData.ogImage?.trim() || null,
        status,
        publishedAt,
        scheduledFor,
        seriesId: postData.seriesId || null,
        seriesOrder: postData.seriesOrder || null,
        category: postData.category as 'ANCHOR' | 'THEME' | 'EMERGENT' | 'PRACTITIONER' | 'PROTOTYPE' | 'CONFERENCE' | 'METHODOLOGY' | undefined,
        author: postData.author?.trim() || 'Fernando Torres',
        metaTitle: postData.metaTitle?.trim() || null,
        metaDescription: postData.metaDescription?.trim() || null,
        readingTimeMinutes,
      },
    })

    // Handle tags if provided
    if (postData.tags && postData.tags.length > 0) {
      for (const tagName of postData.tags) {
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
            postId: post.id,
            tagId: tag.id,
          },
        })
      }
    }

    // Fetch the created post with tags
    const createdPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        series: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: status === 'DRAFT'
          ? 'Draft saved successfully'
          : status === 'PUBLISHED'
            ? 'Post published successfully'
            : 'Post scheduled successfully',
        post: createdPost,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Post creation error:', error)

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'A post with this slug already exists. Please use a different title or slug.',
        },
        { status: 409 }
      )
    }

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while creating the post. Please try again later.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/posts
 * Returns paginated list of posts (public endpoint - only published posts)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const skip = (page - 1) * limit

    // Filter parameters
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const seriesId = searchParams.get('seriesId')
    const search = searchParams.get('search')

    // Build where clause (only published posts for public endpoint)
    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
      publishedAt: {
        lte: new Date(),
      },
    }

    // Add category filter
    if (category) {
      where.category = category.toUpperCase()
    }

    // Add series filter
    if (seriesId) {
      where.seriesId = seriesId
    }

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Add tag filter
    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag.toLowerCase(),
          },
        },
      }
    }

    // Fetch posts with pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          author: true,
          publishedAt: true,
          readingTimeMinutes: true,
          viewCount: true,
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
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Posts fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching posts.',
      },
      { status: 500 }
    )
  }
}
