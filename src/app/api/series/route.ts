import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/series
 * Returns all series for selection dropdowns
 */
export async function GET() {
  try {
    const series = await prisma.series.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        postCount: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      series,
    })
  } catch (error) {
    console.error('Series fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch series',
      },
      { status: 500 }
    )
  }
}
