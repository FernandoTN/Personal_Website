import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/subscribers
 * Returns all subscribers for admin management
 * Supports CSV export with ?export=csv query parameter
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

    // Check for CSV export request
    const { searchParams } = new URL(request.url)
    const exportFormat = searchParams.get('export')
    const search = searchParams.get('search') || ''

    // Build query conditions
    const whereCondition = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    // Fetch subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: whereCondition,
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        subscribedAt: true,
        unsubscribedAt: true,
        source: true,
      },
      orderBy: {
        subscribedAt: 'desc',
      },
    })

    // Handle CSV export
    if (exportFormat === 'csv') {
      const csvHeaders = ['Email', 'Name', 'Status', 'Subscribed At', 'Unsubscribed At', 'Source']
      const csvRows = subscribers.map((sub) => [
        `"${sub.email}"`,
        `"${sub.name || ''}"`,
        sub.status,
        sub.subscribedAt.toISOString(),
        sub.unsubscribedAt ? sub.unsubscribedAt.toISOString() : '',
        `"${sub.source || ''}"`,
      ])

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map((row) => row.join(',')),
      ].join('\n')

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    // Return JSON response
    return NextResponse.json({
      success: true,
      subscribers,
      count: subscribers.length,
      activeCount: subscribers.filter((s) => s.status === 'ACTIVE').length,
      unsubscribedCount: subscribers.filter((s) => s.status === 'UNSUBSCRIBED').length,
    })
  } catch (error) {
    console.error('Error fetching admin subscribers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}
