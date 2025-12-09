import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------

/**
 * Generates a unique filename to prevent collisions
 */
function generateUniqueFilename(originalName: string, folder: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = getExtension(originalName)
  const baseName = originalName
    .replace(/\.[^.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Sanitize filename
    .substring(0, 50) // Limit length
  return `${folder}/${baseName}-${timestamp}-${randomString}${extension}`
}

/**
 * Get file extension from filename or mime type
 */
function getExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext && ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
    return `.${ext}`
  }
  return '.jpg' // Default
}

/**
 * Validates the uploaded file
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type "${file.type}". Allowed types: ${ALLOWED_TYPES.join(', ')}`,
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
    }
  }

  return { valid: true }
}

// ------------------------------------------------------------------
// API Route Handlers
// ------------------------------------------------------------------

/**
 * POST /api/upload
 * Handles image file uploads to Vercel Blob storage
 * Requires authentication
 * Optional folder parameter to organize uploads (defaults to 'blog')
 * Returns the URL of the uploaded file
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in to upload images.' },
        { status: 401 }
      )
    }

    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'blog'

    // Sanitize folder name (only allow alphanumeric, dash, underscore)
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase()

    // Validate file presence
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Generate unique filename with folder path
    const pathname = generateUniqueFilename(file.name, sanitizedFolder)

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false, // We already add our own unique suffix
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        url: blob.url,
        filename: pathname.split('/').pop(),
        size: file.size,
        type: file.type,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)

    // Check for specific Vercel Blob errors
    if (error instanceof Error) {
      if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Blob storage is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.',
          },
          { status: 500 }
        )
      }
    }

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while uploading the file. Please try again.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/upload
 * Returns method not allowed (upload is POST only)
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST to upload files.' },
    { status: 405 }
  )
}
