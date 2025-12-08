import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/tags
 * Returns all tags with their post counts
 * Used for tag selection dropdown in post editor
 */
export async function GET() {
  try {
    // Get all tags, ordered by usage count
    const tags = await prisma.tag.findMany({
      orderBy: [
        { postCount: 'desc' },
        { name: 'asc' },
      ],
      select: {
        id: true,
        slug: true,
        name: true,
        postCount: true,
      },
    })

    return NextResponse.json({
      success: true,
      tags,
    })
  } catch (error) {
    console.error('Tags fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching tags.',
      },
      { status: 500 }
    )
  }
}
