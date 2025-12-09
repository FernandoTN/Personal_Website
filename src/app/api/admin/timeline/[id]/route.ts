import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * PUT /api/admin/timeline/[id]
 * Updates an existing timeline event
 * Requires authentication
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params

    // Parse request body
    let body: {
      title?: string
      description?: string
      date?: string
      endDate?: string | null
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

    // Check if event exists
    const existingEvent = await prisma.timelineEvent.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Timeline event not found' },
        { status: 404 }
      )
    }

    // Validate type if provided
    if (body.type) {
      const validTypes = ['work', 'education', 'achievement']
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          { success: false, error: 'Type must be work, education, or achievement' },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: {
      title?: string
      description?: string | null
      date?: Date
      endDate?: Date | null
      type?: string
      company?: string | null
      location?: string | null
      icon?: string | null
      color?: string | null
      displayOrder?: number
    } = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description || null
    if (body.date !== undefined) updateData.date = new Date(body.date)
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null
    if (body.type !== undefined) updateData.type = body.type
    if (body.company !== undefined) updateData.company = body.company || null
    if (body.location !== undefined) updateData.location = body.location || null
    if (body.icon !== undefined) updateData.icon = body.icon || null
    if (body.color !== undefined) updateData.color = body.color || null
    if (body.displayOrder !== undefined) updateData.displayOrder = body.displayOrder

    // Update the event
    const updatedEvent = await prisma.timelineEvent.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Timeline event updated successfully',
      event: updatedEvent,
    })
  } catch (error) {
    console.error('Error updating timeline event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update timeline event' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/timeline/[id]
 * Deletes a timeline event
 * Requires authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params

    // Check if event exists
    const existingEvent = await prisma.timelineEvent.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Timeline event not found' },
        { status: 404 }
      )
    }

    // Delete the event
    await prisma.timelineEvent.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Timeline event deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting timeline event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete timeline event' },
      { status: 500 }
    )
  }
}
