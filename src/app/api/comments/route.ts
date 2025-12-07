import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Email validation regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface CommentFormData {
  postSlug: string
  name: string
  email: string
  content: string
}

interface ValidationError {
  field: string
  message: string
}

/**
 * Validates comment form data
 * Returns array of validation errors (empty if valid)
 */
function validateCommentForm(data: unknown): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    errors.push({ field: 'form', message: 'Invalid form data' })
    return errors
  }

  const formData = data as Record<string, unknown>

  // Validate postSlug
  if (!formData.postSlug || typeof formData.postSlug !== 'string') {
    errors.push({ field: 'postSlug', message: 'Post identifier is required' })
  }

  // Validate name
  if (!formData.name || typeof formData.name !== 'string') {
    errors.push({ field: 'name', message: 'Name is required' })
  } else if (formData.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' })
  }

  // Validate email
  if (!formData.email || typeof formData.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  // Validate content
  if (!formData.content || typeof formData.content !== 'string') {
    errors.push({ field: 'content', message: 'Comment is required' })
  } else if (formData.content.trim().length < 10) {
    errors.push({ field: 'content', message: 'Comment must be at least 10 characters' })
  }

  return errors
}

/**
 * POST /api/comments
 * Creates a new comment for a blog post
 * Comments are created with PENDING status for moderation
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

    // Validate form data
    const validationErrors = validateCommentForm(body)
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

    const formData = body as CommentFormData

    // Find the post by slug
    const post = await prisma.post.findUnique({
      where: { slug: formData.postSlug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Create comment in database with PENDING status
    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        authorName: formData.name.trim(),
        authorEmail: formData.email.trim().toLowerCase(),
        content: formData.content.trim(),
        status: 'PENDING',
      },
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your comment! It will appear after moderation.',
        id: comment.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Comment submission error:', error)

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your comment. Please try again later.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/comments
 * Returns approved comments for a post
 * Query params: postSlug (required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postSlug = searchParams.get('postSlug')

    if (!postSlug) {
      return NextResponse.json(
        { success: false, error: 'Post slug is required' },
        { status: 400 }
      )
    }

    // Find the post by slug
    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get approved comments for the post
    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
        status: 'APPROVED',
      },
      select: {
        id: true,
        authorName: true,
        content: true,
        createdAt: true,
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
    console.error('Error fetching comments:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching comments.',
      },
      { status: 500 }
    )
  }
}
