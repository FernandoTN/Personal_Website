import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendContactNotification } from '@/lib/email'

// Email validation regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

interface ValidationError {
  field: string
  message: string
}

/**
 * Validates contact form data
 * Returns array of validation errors (empty if valid)
 */
function validateContactForm(data: unknown): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    errors.push({ field: 'form', message: 'Invalid form data' })
    return errors
  }

  const formData = data as Record<string, unknown>

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

  // Validate message
  if (!formData.message || typeof formData.message !== 'string') {
    errors.push({ field: 'message', message: 'Message is required' })
  } else if (formData.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' })
  }

  // Subject is optional, but validate if provided
  if (formData.subject !== undefined && typeof formData.subject !== 'string') {
    errors.push({ field: 'subject', message: 'Subject must be a string' })
  }

  return errors
}

/**
 * POST /api/contact
 * Creates a new contact form submission
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
    const validationErrors = validateContactForm(body)
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

    const formData = body as ContactFormData

    // Create contact submission in database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject?.trim() || null,
        message: formData.message.trim(),
      },
    })

    // Send email notification (non-blocking, don't fail the request if email fails)
    sendContactNotification({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject?.trim() || null,
      message: formData.message.trim(),
      timestamp: submission.createdAt,
    }).catch((error) => {
      console.error('Failed to send contact notification email:', error)
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. I will get back to you soon.',
        id: submission.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your request. Please try again later.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/contact
 * Returns method not allowed (contact form is POST only for public)
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
