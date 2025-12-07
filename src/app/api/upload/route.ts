import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

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
async function ensureUploadDir(): Promise<void> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

// ------------------------------------------------------------------
// API Route Handlers
// ------------------------------------------------------------------

/**
 * POST /api/upload
 * Handles image file uploads
 * Returns the URL of the uploaded file
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

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
    await ensureUploadDir()

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name)
    const filePath = path.join(UPLOAD_DIR, uniqueFilename)

    // Convert File to Buffer and write to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Generate the public URL
    const publicUrl = `/uploads/${uniqueFilename}`

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
