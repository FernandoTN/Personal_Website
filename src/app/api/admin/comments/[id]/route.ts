import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * PUT /api/admin/comments/[id]
 * Updates comment status (approve, reject, spam)
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
    let body: { status?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'SPAM']
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be PENDING, APPROVED, or SPAM' },
        { status: 400 }
      )
    }

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!existingComment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Update comment status
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        status: body.status as 'PENDING' | 'APPROVED' | 'SPAM',
      },
      select: {
        id: true,
        status: true,
        authorName: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Comment ${body.status.toLowerCase()}`,
      comment: updatedComment,
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/comments/[id]
 * Permanently deletes a comment
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

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!existingComment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Comment deleted permanently',
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
