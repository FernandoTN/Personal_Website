import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * LinkedIn Post interface for the API response
 */
interface LinkedInPostData {
  id: string
  filename: string
  publicationNumber: number
  title: string
  type: string
  content: string
  contentPreview: string
  characterCount: number
  hashtags: string[]
  status: 'pending' | 'manually_scheduled' | 'posted'
  linkedBlogPostSlug: string | null
  imageUrl: string | null
  createdAt: string
}

/**
 * Status storage file path
 */
const STATUS_FILE_PATH = path.join(process.cwd(), 'content', 'linkedin-post-statuses.json')

/**
 * Load persisted statuses from JSON file
 */
async function loadStatuses(): Promise<Record<string, 'pending' | 'manually_scheduled' | 'posted'>> {
  try {
    const content = await fs.readFile(STATUS_FILE_PATH, 'utf-8')
    const data = JSON.parse(content)
    return data.statuses || {}
  } catch {
    return {}
  }
}

/**
 * Save statuses to JSON file
 */
async function saveStatuses(statuses: Record<string, 'pending' | 'manually_scheduled' | 'posted'>): Promise<void> {
  const data = { statuses, lastUpdated: new Date().toISOString() }
  await fs.writeFile(STATUS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Parse LinkedIn markdown file and extract post data
 */
function parseLinkedInMarkdown(content: string, filename: string): Omit<LinkedInPostData, 'id' | 'createdAt'> {
  // Extract publication number from filename (e.g., "01-anchor-post.md" -> 1)
  const pubNumMatch = filename.match(/^(\d+)-/)
  const publicationNumber = pubNumMatch ? parseInt(pubNumMatch[1], 10) : 0

  // Extract title from the first heading
  const titleMatch = content.match(/^#\s+LinkedIn Post[:\s-]*(?:Publication\s+\d+\s*[:\s-]*)?(.+?)$/m)
  const title = titleMatch ? titleMatch[1].trim() : filename.replace(/^\d+-/, '').replace('.md', '')

  // Extract type from metadata or heading
  const typeMatch = content.match(/\*\*(?:Type|Publication)\*\*:\s*(.+?)$/m) ||
                    content.match(/Type:\s*(.+?)$/m) ||
                    content.match(/Publication:\s*\d+\s*-\s*(.+?)$/m)
  const type = typeMatch ? typeMatch[1].trim() : 'Unknown'

  // Extract the main post content - look for content between --- markers or after ## Post Content
  let postContent = ''

  // Try to find content between --- markers (first format)
  const dashContentMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n\s*\*\*Post Metadata\*\*/m)
  if (dashContentMatch) {
    postContent = dashContentMatch[1].trim()
  } else {
    // Try to find content after ## Post Content heading (second format)
    const postContentMatch = content.match(/##\s*Post Content\s*\n([\s\S]*?)(?:\n---|\n##\s*Post Metadata)/m)
    if (postContentMatch) {
      postContent = postContentMatch[1].trim()
    } else {
      // Fallback: get content between first --- pair
      const fallbackMatch = content.match(/^---\s*\n([\s\S]*?)\n---/m)
      if (fallbackMatch) {
        postContent = fallbackMatch[1].trim()
      } else {
        // Last resort: extract everything that looks like post content
        const lines = content.split('\n')
        const contentLines: string[] = []
        let inContent = false
        for (const line of lines) {
          if (line.startsWith('#') && !inContent) continue
          if (line.includes('Post Metadata') || line.includes('Publishing Notes')) break
          if (line.trim() && !line.startsWith('**') && !line.startsWith('#')) {
            inContent = true
            contentLines.push(line)
          }
        }
        postContent = contentLines.join('\n').trim()
      }
    }
  }

  // Clean up content - remove markdown links placeholder
  postContent = postContent.replace(/\[LINK\]/g, '[Link to blog post]')

  // Extract hashtags
  const hashtagMatch = postContent.match(/#\w+/g)
  const hashtags = hashtagMatch ? Array.from(new Set(hashtagMatch)) : []

  // Calculate character count (excluding hashtags line for accuracy)
  const contentWithoutHashtags = postContent.replace(/#\w+/g, '').trim()
  const characterCount = contentWithoutHashtags.length

  // Create content preview (first 150 chars)
  const contentPreview = postContent.substring(0, 150).replace(/\n/g, ' ').trim() + (postContent.length > 150 ? '...' : '')

  // Try to extract linked blog post slug from the file
  const blogSlugMatch = content.match(/Blog Post:\s*(\S+\.mdx?)/m) ||
                        content.match(/fernandotorres\.io\/blog\/([^\s\n]+)/m)
  const linkedBlogPostSlug = blogSlugMatch ? blogSlugMatch[1].replace('.mdx', '').replace('.md', '') : null

  // Try to extract image reference from the file
  const imageMatch = content.match(/[Ii]mage:\s*(\S+)/m) ||
                     content.match(/[Cc]over[Ii]mage:\s*(\S+)/m)
  const imageUrl = imageMatch ? imageMatch[1] : null

  return {
    filename,
    publicationNumber,
    title,
    type,
    content: postContent,
    contentPreview,
    characterCount,
    hashtags,
    status: 'pending',
    linkedBlogPostSlug,
    imageUrl,
  }
}

/**
 * GET /api/admin/linkedin
 * Returns all LinkedIn posts from the content/deliverables/linkedin-posts directory
 */
export async function GET() {
  try {
    const linkedinPostsDir = path.join(process.cwd(), 'content', 'deliverables', 'linkedin-posts')

    // Check if directory exists
    try {
      await fs.access(linkedinPostsDir)
    } catch {
      return NextResponse.json(
        { error: 'LinkedIn posts directory not found', posts: [] },
        { status: 200 }
      )
    }

    // Load persisted statuses
    const persistedStatuses = await loadStatuses()

    // Read all markdown files from the directory
    const files = await fs.readdir(linkedinPostsDir)
    const mdFiles = files.filter(file => file.endsWith('.md') && !file.toLowerCase().includes('readme'))

    // Parse each file
    const posts: LinkedInPostData[] = []

    for (const file of mdFiles) {
      const filePath = path.join(linkedinPostsDir, file)
      const content = await fs.readFile(filePath, 'utf-8')

      const parsedPost = parseLinkedInMarkdown(content, file)
      const postId = `linkedin-${parsedPost.publicationNumber}`

      // Use persisted status if available, otherwise default to 'pending'
      const status = persistedStatuses[postId] || 'pending'

      posts.push({
        id: postId,
        createdAt: new Date().toISOString(),
        ...parsedPost,
        status,
      })
    }

    // Sort by publication number
    posts.sort((a, b) => a.publicationNumber - b.publicationNumber)

    return NextResponse.json({
      posts,
      total: posts.length,
    })
  } catch (error) {
    console.error('Error loading LinkedIn posts:', error)
    return NextResponse.json(
      { error: 'Failed to load LinkedIn posts', posts: [] },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/linkedin
 * Update the status of a LinkedIn post
 * Body: { id: string, status: 'pending' | 'manually_scheduled' | 'posted' }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    // Validate input
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing post ID' },
        { status: 400 }
      )
    }

    if (!status || !['pending', 'manually_scheduled', 'posted'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, manually_scheduled, posted' },
        { status: 400 }
      )
    }

    // Load existing statuses
    const statuses = await loadStatuses()

    // Update status
    statuses[id] = status

    // Save statuses
    await saveStatuses(statuses)

    return NextResponse.json({
      success: true,
      id,
      status,
      message: `LinkedIn post status updated to '${status}'`,
    })
  } catch (error) {
    console.error('Error updating LinkedIn post status:', error)
    return NextResponse.json(
      { error: 'Failed to update LinkedIn post status' },
      { status: 500 }
    )
  }
}
