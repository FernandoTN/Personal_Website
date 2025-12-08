import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------
const BASE_IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface ImageInfo {
  name: string
  url: string
  size: number
  modifiedAt: string
}

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------

/**
 * Recursively get all images from a directory
 */
async function getImagesFromDir(dir: string, baseUrl: string): Promise<ImageInfo[]> {
  const images: ImageInfo[] = []

  if (!existsSync(dir)) {
    return images
  }

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          const fileStat = await stat(fullPath)
          images.push({
            name: entry.name,
            url: `${baseUrl}/${entry.name}`,
            size: fileStat.size,
            modifiedAt: fileStat.mtime.toISOString(),
          })
        }
      }
    }

    // Sort by modification date (newest first)
    images.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
  } catch (error) {
    console.error('Error reading directory:', error)
  }

  return images
}

// ------------------------------------------------------------------
// API Route Handlers
// ------------------------------------------------------------------

/**
 * GET /api/images
 * Lists all images from a specified folder
 * Requires authentication
 * Query params:
 *   - folder: the subfolder to list (defaults to 'blog')
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

    // Get folder from query params
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder') || 'blog'

    // Sanitize folder name
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase()

    // Build directory path
    const imageDir = path.join(BASE_IMAGES_DIR, sanitizedFolder)
    const baseUrl = `/images/${sanitizedFolder}`

    // Get all images
    const images = await getImagesFromDir(imageDir, baseUrl)

    return NextResponse.json({
      success: true,
      folder: sanitizedFolder,
      images,
      count: images.length,
    })
  } catch (error) {
    console.error('Images list error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while listing images.',
      },
      { status: 500 }
    )
  }
}
