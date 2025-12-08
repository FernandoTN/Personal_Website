import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const BASE_UPLOAD_DIR = path.join(process.cwd(), 'public', 'images')

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------

/**
 * Generates a unique filename to prevent collisions
 */
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = path.extname(originalName).toLowerCase()
  const baseName = path.basename(originalName, extension)
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Sanitize filename
    .substring(0, 50) // Limit length
  return `${baseName}-${timestamp}-${randomString}${extension}`
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

/**
 * Ensures the upload directory exists
 */
async function ensureUploadDir(folder: string): Promise<string> {
  const uploadDir = path.join(BASE_UPLOAD_DIR, folder)
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }
  return uploadDir
}

// ------------------------------------------------------------------
// API Route Handlers
// ------------------------------------------------------------------

/**
 * POST /api/upload
 * Handles image file uploads
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
        { success: false, error: 'Unauthorized' },
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

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir(sanitizedFolder)

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name)
    const filePath = path.join(uploadDir, uniqueFilename)

    // Convert File to Buffer and write to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Generate the public URL
    const publicUrl = `/images/${sanitizedFolder}/${uniqueFilename}`

    // Return success response
    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: uniqueFilename,
        size: file.size,
        type: file.type,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)

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
