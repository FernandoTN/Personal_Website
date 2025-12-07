import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/calendar
 * Returns posts organized for calendar display
 * Includes published, scheduled, and draft posts with their dates
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get date range from query params (default to AI Agents series: Dec 8, 2025 - Feb 13, 2026)
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    // Default date range for AI Agents series
    const defaultStartDate = new Date('2025-12-08')
    const defaultEndDate = new Date('2026-02-13')

    const startDate = startDateParam ? new Date(startDateParam) : defaultStartDate
    const endDate = endDateParam ? new Date(endDateParam) : defaultEndDate

    // Fetch all posts within the date range (or with scheduledFor in range)
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          // Published posts with publishedAt in range
          {
            status: 'PUBLISHED',
            publishedAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          // Scheduled posts with scheduledFor in range
          {
            status: 'SCHEDULED',
            scheduledFor: {
              gte: startDate,
              lte: endDate,
            },
          },
          // Draft posts - show all drafts (they don't have dates yet)
          {
            status: 'DRAFT',
          },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        status: true,
        publishedAt: true,
        scheduledFor: true,
        category: true,
        seriesOrder: true,
        series: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { scheduledFor: 'asc' },
        { publishedAt: 'asc' },
        { seriesOrder: 'asc' },
      ],
    })

    // Organize posts by date for calendar view
    const calendarData: Record<string, typeof posts> = {}
    const unscheduledDrafts: typeof posts = []

    for (const post of posts) {
      // Use scheduledFor for scheduled posts, publishedAt for published
      const date = post.status === 'SCHEDULED'
        ? post.scheduledFor
        : post.status === 'PUBLISHED'
          ? post.publishedAt
          : null

      if (date) {
        const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
        if (!calendarData[dateKey]) {
          calendarData[dateKey] = []
        }
        calendarData[dateKey].push(post)
      } else if (post.status === 'DRAFT') {
        unscheduledDrafts.push(post)
      }
    }

    // Calculate week-by-week schedule info
    const weeks = calculateWeeks(startDate, endDate, calendarData)

    return NextResponse.json({
      success: true,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      calendarData,
      unscheduledDrafts,
      weeks,
      totalPosts: posts.length,
      publishedCount: posts.filter(p => p.status === 'PUBLISHED').length,
      scheduledCount: posts.filter(p => p.status === 'SCHEDULED').length,
      draftCount: posts.filter(p => p.status === 'DRAFT').length,
    })
  } catch (error) {
    console.error('Calendar fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching calendar data.',
      },
      { status: 500 }
    )
  }
}

/**
 * Calculate week information for the date range
 */
function calculateWeeks(startDate: Date, endDate: Date, calendarData: Record<string, unknown[]>) {
  const weeks: Array<{
    weekNumber: number
    startDate: string
    endDate: string
    theme: string
    postCount: number
    dates: string[]
  }> = []

  // AI Agents series week themes based on spec
  const weekThemes = [
    'Launch Week',        // Week 1
    'Framework Week',     // Week 2
    'Enterprise Week',    // Week 3
    'Insights Week',      // Week 4
    'Evaluation Week',    // Week 5
    'Practitioner Week 1', // Week 6
    'Practitioner Week 2', // Week 7
    'Prototype Week',     // Week 8
    'Conference Week',    // Week 9
    'Closing Week',       // Week 10
  ]

  const currentDate = new Date(startDate)

  for (let weekNum = 1; weekNum <= 10 && currentDate <= endDate; weekNum++) {
    // Get Monday of the current week
    const weekStart = new Date(currentDate)

    // Get Friday of the current week (5 days later from Monday, but show full week)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6) // Sunday

    // Calculate dates in this week
    const dates: string[] = []
    let postCount = 0
    const tempDate = new Date(weekStart)

    for (let i = 0; i < 7; i++) {
      const dateKey = tempDate.toISOString().split('T')[0]
      dates.push(dateKey)

      if (calendarData[dateKey]) {
        postCount += calendarData[dateKey].length
      }

      tempDate.setDate(tempDate.getDate() + 1)
    }

    weeks.push({
      weekNumber: weekNum,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      theme: weekThemes[weekNum - 1] || `Week ${weekNum}`,
      postCount,
      dates,
    })

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7)
  }

  return weeks
}

/**
 * PATCH /api/admin/calendar
 * Reschedules a post by updating its scheduledFor date
 * Used for calendar drag-and-drop functionality
 * Requires admin authentication
 */
export async function PATCH(request: NextRequest) {
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
    let body: { postId?: string; newDate?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.postId) {
      return NextResponse.json(
        { success: false, error: 'postId is required' },
        { status: 400 }
      )
    }

    if (!body.newDate) {
      return NextResponse.json(
        { success: false, error: 'newDate is required' },
        { status: 400 }
      )
    }

    // Parse and validate date
    const newScheduledDate = new Date(body.newDate)
    if (isNaN(newScheduledDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format for newDate' },
        { status: 400 }
      )
    }

    // Find the post
    const existingPost = await prisma.post.findUnique({
      where: { id: body.postId },
      select: {
        id: true,
        title: true,
        status: true,
        scheduledFor: true,
        publishedAt: true,
      },
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Determine what date field to update based on status
    // For SCHEDULED posts: update scheduledFor
    // For PUBLISHED posts: update publishedAt
    // For DRAFT posts: set scheduledFor and change status to SCHEDULED
    const updateData: Record<string, unknown> = {}

    if (existingPost.status === 'SCHEDULED') {
      updateData.scheduledFor = newScheduledDate
    } else if (existingPost.status === 'PUBLISHED') {
      // Allow rescheduling published posts by updating publishedAt
      updateData.publishedAt = newScheduledDate
    } else if (existingPost.status === 'DRAFT') {
      // Schedule the draft
      updateData.scheduledFor = newScheduledDate
      updateData.status = 'SCHEDULED'
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: body.postId },
      data: updateData,
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        scheduledFor: true,
        publishedAt: true,
        category: true,
        seriesOrder: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Post rescheduled successfully',
      post: updatedPost,
      previousDate: existingPost.status === 'SCHEDULED'
        ? existingPost.scheduledFor
        : existingPost.publishedAt,
      newDate: newScheduledDate.toISOString(),
    })
  } catch (error) {
    console.error('Calendar reschedule error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while rescheduling the post.',
      },
      { status: 500 }
    )
  }
}
