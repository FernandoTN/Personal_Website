import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { list } from '@vercel/blob'

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------
const BASE_IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface ImageInfo {
  name: string
  url: string
  size: number
  modifiedAt: string
  source: 'local' | 'blob'
}

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------

/**
 * Get images from local directory
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
            source: 'local',
          })
        }
      }
    }
  } catch (error) {
    console.error('Error reading local directory:', error)
  }

  return images
}

/**
 * Get images from Vercel Blob storage
 */
async function getImagesFromBlob(folder: string): Promise<ImageInfo[]> {
  const images: ImageInfo[] = []

  if (!BLOB_TOKEN) {
    return images
  }

  try {
    // List all blobs with the folder prefix
    const { blobs } = await list({
      prefix: `${folder}/`,
      token: BLOB_TOKEN,
    })

    for (const blob of blobs) {
      // Check if it's an image by extension
      const ext = path.extname(blob.pathname).toLowerCase()
      if (ALLOWED_EXTENSIONS.includes(ext)) {
        images.push({
          name: path.basename(blob.pathname),
          url: blob.url,
          size: blob.size,
          modifiedAt: blob.uploadedAt.toISOString(),
          source: 'blob',
        })
      }
    }
  } catch (error) {
    console.error('Error listing Vercel Blob images:', error)
  }

  return images
}

// ------------------------------------------------------------------
// API Route Handlers
// ------------------------------------------------------------------

/**
 * GET /api/images
 * Lists all images from local storage and Vercel Blob
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

    // Build directory path for local images
    const imageDir = path.join(BASE_IMAGES_DIR, sanitizedFolder)
    const baseUrl = `/images/${sanitizedFolder}`

    // Fetch images from both sources in parallel
    const [localImages, blobImages] = await Promise.all([
      // Only fetch local images in development (they won't exist in production serverless)
      !IS_PRODUCTION ? getImagesFromDir(imageDir, baseUrl) : Promise.resolve([]),
      // Fetch from Vercel Blob if token is available
      getImagesFromBlob(sanitizedFolder),
    ])

    // Combine and sort all images by date (newest first)
    const allImages = [...localImages, ...blobImages].sort(
      (a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    )

    return NextResponse.json({
      success: true,
      folder: sanitizedFolder,
      images: allImages,
      count: allImages.length,
      sources: {
        local: localImages.length,
        blob: blobImages.length,
      },
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
