import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

// Email validation regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface SubscribeFormData {
  email: string
  source?: string
}

interface ValidationError {
  field: string
  message: string
}

/**
 * Validates subscription form data
 * Returns array of validation errors (empty if valid)
 */
function validateSubscribeForm(data: unknown): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    errors.push({ field: 'form', message: 'Invalid form data' })
    return errors
  }

  const formData = data as Record<string, unknown>

  // Validate email
  if (!formData.email || typeof formData.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!formData.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  // Source is optional, but validate if provided
  if (formData.source !== undefined && typeof formData.source !== 'string') {
    errors.push({ field: 'source', message: 'Source must be a string' })
  }

  return errors
}

/**
 * POST /api/subscribe
 * Creates a new newsletter subscription
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
    const validationErrors = validateSubscribeForm(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: validationErrors[0].message,
          errors: validationErrors,
        },
        { status: 400 }
      )
    }

    const formData = body as SubscribeFormData
    const email = formData.email.trim().toLowerCase()

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      // If already subscribed and active, return already subscribed
      if (existingSubscriber.status === 'ACTIVE') {
        return NextResponse.json(
          {
            success: false,
            alreadySubscribed: true,
            message: 'This email is already subscribed to our newsletter.',
          },
          { status: 409 }
        )
      }

      // If previously unsubscribed, reactivate subscription
      await prisma.subscriber.update({
        where: { email },
        data: {
          status: 'ACTIVE',
          subscribedAt: new Date(),
          unsubscribedAt: null,
          source: formData.source || existingSubscriber.source,
        },
      })

      // Send welcome email for reactivation (non-blocking)
      sendWelcomeEmail({ to: email }).catch((err) => {
        console.error('Failed to send welcome email:', err)
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          reactivated: true,
        },
        { status: 200 }
      )
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        source: formData.source || null,
        status: 'ACTIVE',
      },
    })

    // Send welcome email (non-blocking, don't fail subscription if email fails)
    sendWelcomeEmail({ to: email }).catch((err) => {
      console.error('Failed to send welcome email:', err)
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing! You will receive updates soon.',
        id: subscriber.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)

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
 * GET /api/subscribe
 * Returns method not allowed (subscription is POST only for public)
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
