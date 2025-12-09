import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

/**
 * POST /api/upload/client-token
 * Generates a client token for direct uploads to Vercel Blob
 * This bypasses the 4.5MB server limit and allows uploads up to 500MB
 * Requires authentication
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in to upload images.' },
      { status: 401 }
    )
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validate file type from pathname
        const extension = pathname.split('.').pop()?.toLowerCase()
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']

        if (!extension || !allowedExtensions.includes(extension)) {
          throw new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`)
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml',
          ],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB max for images
          tokenPayload: JSON.stringify({
            userId: session.user?.email || 'anonymous',
          }),
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // Log successful upload
        console.log('Client upload completed:', {
          url: blob.url,
          pathname: blob.pathname,
        })
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Client upload token error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate upload token' },
      { status: 500 }
    )
  }
}
