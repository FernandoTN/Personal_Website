import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/dashboard
 * Returns real dashboard stats from the database
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

    // Fetch all stats in parallel
    const [
      totalPosts,
      publishedPosts,
      scheduledPosts,
      draftPosts,
      totalSubscribers,
      activeSubscribers,
      totalComments,
      pendingComments,
      recentActivity,
      upcomingPosts,
      aiAgentsSeries,
      categoryBreakdown,
    ] = await Promise.all([
      // Post counts
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'SCHEDULED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),

      // Subscriber counts
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { status: 'ACTIVE' } }),

      // Comment counts
      prisma.comment.count(),
      prisma.comment.count({ where: { status: 'PENDING' } }),

      // Recent activity (last 10 events)
      getRecentActivity(),

      // Upcoming scheduled posts (next 5)
      prisma.post.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledFor: { gte: new Date() },
        },
        orderBy: { scheduledFor: 'asc' },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          scheduledFor: true,
        },
      }),

      // AI Agents series stats
      prisma.series.findFirst({
        where: { slug: 'ai-agents-research' },
        select: {
          id: true,
          name: true,
          postCount: true,
          _count: {
            select: {
              posts: {
                where: { status: 'PUBLISHED' },
              },
            },
          },
        },
      }),

      // Category breakdown for AI Agents series
      prisma.post.groupBy({
        by: ['category'],
        _count: { category: true },
        where: {
          series: { slug: 'ai-agents-research' },
        },
      }),
    ])

    // Format category breakdown
    const categories = categoryBreakdown.map((cat) => ({
      category: cat.category,
      count: cat._count.category,
    }))

    return NextResponse.json({
      success: true,
      stats: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
          scheduled: scheduledPosts,
          draft: draftPosts,
        },
        subscribers: {
          total: totalSubscribers,
          active: activeSubscribers,
        },
        comments: {
          total: totalComments,
          pending: pendingComments,
        },
        aiAgentsSeries: {
          total: aiAgentsSeries?.postCount || 25,
          published: aiAgentsSeries?._count.posts || 0,
        },
      },
      recentActivity,
      upcomingPosts: upcomingPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        scheduledFor: post.scheduledFor,
      })),
      categoryBreakdown: categories,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

/**
 * Get recent activity combining posts, comments, and subscribers
 */
async function getRecentActivity() {
  const [recentPosts, recentComments, recentSubscribers] = await Promise.all([
    // Recent published posts
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        publishedAt: true,
        series: { select: { name: true } },
      },
    }),

    // Recent scheduled posts
    prisma.post.findMany({
      where: { status: 'SCHEDULED' },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        scheduledFor: true,
        createdAt: true,
      },
    }),

    // Recent subscribers
    prisma.subscriber.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { subscribedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        email: true,
        subscribedAt: true,
      },
    }),
  ])

  // Combine and sort by timestamp
  const activities: Array<{
    id: string
    type: 'post_published' | 'post_scheduled' | 'subscriber_added' | 'comment_received'
    title: string
    timestamp: Date
    metadata?: string
  }> = []

  // Add published posts
  recentPosts.forEach((post) => {
    if (post.publishedAt) {
      activities.push({
        id: `post-${post.id}`,
        type: 'post_published',
        title: post.title,
        timestamp: post.publishedAt,
        metadata: post.series?.name || undefined,
      })
    }
  })

  // Add scheduled posts
  recentComments.forEach((post) => {
    activities.push({
      id: `scheduled-${post.id}`,
      type: 'post_scheduled',
      title: post.title,
      timestamp: post.createdAt,
      metadata: post.scheduledFor
        ? `Scheduled for ${post.scheduledFor.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : undefined,
    })
  })

  // Add subscribers
  recentSubscribers.forEach((sub) => {
    activities.push({
      id: `sub-${sub.id}`,
      type: 'subscriber_added',
      title: 'New subscriber joined',
      timestamp: sub.subscribedAt,
      metadata: sub.email,
    })
  })

  // Sort by timestamp descending and take the 8 most recent
  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 8)
    .map((activity) => ({
      ...activity,
      timestamp: getRelativeTime(activity.timestamp),
    }))
}

/**
 * Convert a date to a relative time string
 */
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
