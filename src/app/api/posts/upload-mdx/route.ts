import { NextRequest, NextResponse } from 'next/server'
import { parseMDX, mdxToPostFormData } from '@/lib/utils'

/**
 * POST /api/posts/upload-mdx
 * Parse an uploaded MDX file and return extracted frontmatter and content
 *
 * This endpoint accepts multipart/form-data with an MDX file
 * and returns the parsed frontmatter and content body
 */
export async function POST(request: NextRequest) {
  try {
    // Check content type
    const contentType = request.headers.get('content-type') || ''

    let mdxContent: string

    // Handle multipart/form-data (file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        )
      }

      // Validate file type
      const fileName = file.name.toLowerCase()
      if (!fileName.endsWith('.mdx') && !fileName.endsWith('.md')) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Please upload an .mdx or .md file' },
          { status: 400 }
        )
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'File too large. Maximum size is 5MB' },
          { status: 400 }
        )
      }

      // Read file content
      mdxContent = await file.text()
    }
    // Handle application/json (content passed directly)
    else if (contentType.includes('application/json')) {
      const body = await request.json()

      if (!body.content || typeof body.content !== 'string') {
        return NextResponse.json(
          { success: false, error: 'No content provided' },
          { status: 400 }
        )
      }

      mdxContent = body.content
    }
    // Handle text/plain (raw MDX content)
    else if (contentType.includes('text/plain') || contentType.includes('text/markdown')) {
      mdxContent = await request.text()
    }
    else {
      return NextResponse.json(
        { success: false, error: 'Unsupported content type. Use multipart/form-data, application/json, or text/plain' },
        { status: 400 }
      )
    }

    // Validate content is not empty
    if (!mdxContent.trim()) {
      return NextResponse.json(
        { success: false, error: 'File content is empty' },
        { status: 400 }
      )
    }

    // Parse the MDX content
    const parsed = parseMDX(mdxContent)

    // Convert to form data format for the blog editor
    const formData = mdxToPostFormData(parsed)

    // Return success response with parsed data
    return NextResponse.json({
      success: true,
      message: 'MDX file parsed successfully',
      data: {
        // Raw parsed data
        frontmatter: parsed.frontmatter,
        content: parsed.content,
        rawFrontmatter: parsed.rawFrontmatter,
        // Pre-formatted form data for the editor
        formData,
      },
    })
  } catch (error) {
    console.error('MDX upload/parse error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse MDX file',
      },
      { status: 500 }
    )
  }
}
