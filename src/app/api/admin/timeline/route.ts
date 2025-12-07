import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/timeline
 * Returns all timeline events for admin management
 * Requires authentication
 */
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all timeline events ordered by date descending
    const events = await prisma.timelineEvent.findMany({
      orderBy: [
        { date: 'desc' },
        { displayOrder: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
    })
  } catch (error) {
    console.error('Error fetching timeline events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch timeline events' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/timeline
 * Creates a new timeline event
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    let body: {
      title?: string
      description?: string
      date?: string
      endDate?: string
      type?: string
      company?: string
      location?: string
      icon?: string
      color?: string
      displayOrder?: number
    }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.title || !body.date || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Title, date, and type are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['work', 'education', 'achievement']
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be work, education, or achievement' },
        { status: 400 }
      )
    }

    // Create new timeline event
    const event = await prisma.timelineEvent.create({
      data: {
        title: body.title,
        description: body.description || null,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
        type: body.type,
        company: body.company || null,
        location: body.location || null,
        icon: body.icon || null,
        color: body.color || null,
        displayOrder: body.displayOrder || 0,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Timeline event created successfully',
      event,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating timeline event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create timeline event' },
      { status: 500 }
    )
  }
}
