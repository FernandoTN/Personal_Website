import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------
// Vercel Functions have a 4.5MB limit for server uploads
const MAX_FILE_SIZE = 4.5 * 1024 * 1024 // 4.5MB for Vercel Blob
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

// Check if we're in development or if Blob token is available
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

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
 * Upload to local filesystem (development fallback)
 */
async function uploadToLocal(file: File, pathname: string): Promise<string> {
  // pathname is like "blog/filename-123-abc.jpg"
  const publicDir = path.join(process.cwd(), 'public', 'images')
  const fullPath = path.join(publicDir, pathname)
  const dir = path.dirname(fullPath)

  // Ensure directory exists
  await mkdir(dir, { recursive: true })

  // Convert File to Buffer and write
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  await writeFile(fullPath, buffer)

  // Return public URL
  return `/images/${pathname}`
}

/**
 * POST /api/upload
 * Handles image file uploads
 * - Uses Vercel Blob in production (when BLOB_READ_WRITE_TOKEN is set)
 * - Falls back to local filesystem in development
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

    let url: string

    // Check if Blob token is available for production uploads
    if (BLOB_TOKEN) {
      try {
        // Upload to Vercel Blob
        const blob = await put(pathname, file, {
          access: 'public',
          addRandomSuffix: false, // We already add our own unique suffix
          token: BLOB_TOKEN, // Explicitly pass the token
        })
        url = blob.url
      } catch (blobError) {
        console.error('Vercel Blob upload error:', blobError)

        // If blob fails in development, fall back to local
        if (!IS_PRODUCTION) {
          console.log('Falling back to local storage...')
          url = await uploadToLocal(file, pathname)
        } else {
          throw blobError
        }
      }
    } else if (!IS_PRODUCTION) {
      // Development: use local filesystem
      console.log('No BLOB_READ_WRITE_TOKEN found, using local storage')
      url = await uploadToLocal(file, pathname)
    } else {
      // Production without token - error
      return NextResponse.json(
        {
          success: false,
          error: 'Image storage is not configured. Please set up Vercel Blob storage.',
        },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        url,
        filename: pathname.split('/').pop(),
        size: file.size,
        type: file.type,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)

    // Provide more specific error messages
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()

      if (errorMessage.includes('blob_read_write_token') || errorMessage.includes('token')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Blob storage token is invalid or missing. Please check your BLOB_READ_WRITE_TOKEN configuration.',
          },
          { status: 500 }
        )
      }

      if (errorMessage.includes('payload too large') || errorMessage.includes('413')) {
        return NextResponse.json(
          {
            success: false,
            error: 'File is too large. Maximum size is 4.5MB for server uploads.',
          },
          { status: 413 }
        )
      }

      if (errorMessage.includes('pattern') || errorMessage.includes('syntax')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid file name or storage configuration. Please try with a different file.',
          },
          { status: 400 }
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
