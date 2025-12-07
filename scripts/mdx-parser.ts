import * as fs from 'fs'
import * as path from 'path'
import { SLUG_TO_MDX_MAP } from './slug-mapping'

export interface MDXFrontmatter {
  title: string
  summary: string
  publishedAt: string
  tags: string[]
  featured?: boolean
  author: string
  image?: string
}

export interface ParsedMDX {
  frontmatter: MDXFrontmatter
  content: string
  rawContent: string
}

/**
 * Parse MDX frontmatter from file content
 */
function parseFrontmatter(fileContent: string): { frontmatter: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = fileContent.match(frontmatterRegex)

  if (!match) {
    throw new Error('Invalid MDX file: no frontmatter found')
  }

  const frontmatterStr = match[1]
  const content = match[2].trim()

  // Simple YAML-like parsing
  const frontmatter: Record<string, unknown> = {}
  const lines = frontmatterStr.split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value: string | string[] | boolean = line.slice(colonIndex + 1).trim()

    // Handle quoted strings
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1)
    } else if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    // Handle arrays
    else if (value.startsWith('[') && value.endsWith(']')) {
      // Parse array like ['tag1', 'tag2']
      const arrayContent = value.slice(1, -1)
      value = arrayContent.split(',').map(item => {
        const trimmed = item.trim()
        if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
          return trimmed.slice(1, -1)
        }
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          return trimmed.slice(1, -1)
        }
        return trimmed
      })
    }
    // Handle booleans
    else if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    }

    frontmatter[key] = value
  }

  return { frontmatter, content }
}

/**
 * Parse a single MDX file
 */
export function parseMDXFile(filePath: string): ParsedMDX {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { frontmatter, content } = parseFrontmatter(fileContent)

  return {
    frontmatter: {
      title: frontmatter.title as string,
      summary: frontmatter.summary as string,
      publishedAt: frontmatter.publishedAt as string,
      tags: frontmatter.tags as string[],
      featured: frontmatter.featured as boolean | undefined,
      author: frontmatter.author as string,
      image: frontmatter.image as string | undefined,
    },
    content,
    rawContent: fileContent,
  }
}

/**
 * Get all MDX files from the blog posts directory
 */
export function getAllMDXFiles(directory: string): string[] {
  return fs.readdirSync(directory)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(directory, file))
}

/**
 * Get MDX content for a specific database slug
 */
export function getMDXContentBySlug(slug: string, mdxDirectory: string): ParsedMDX | null {
  const mdxFilename = SLUG_TO_MDX_MAP[slug]
  if (!mdxFilename) {
    console.warn(`No MDX mapping found for slug: ${slug}`)
    return null
  }

  const filePath = path.join(mdxDirectory, `${mdxFilename}.mdx`)
  if (!fs.existsSync(filePath)) {
    console.warn(`MDX file not found: ${filePath}`)
    return null
  }

  return parseMDXFile(filePath)
}

/**
 * Load all MDX content indexed by database slug
 */
export function loadAllMDXContent(mdxDirectory: string): Map<string, ParsedMDX> {
  const contentMap = new Map<string, ParsedMDX>()

  for (const [slug, mdxFilename] of Object.entries(SLUG_TO_MDX_MAP)) {
    const filePath = path.join(mdxDirectory, `${mdxFilename}.mdx`)
    if (fs.existsSync(filePath)) {
      try {
        const parsed = parseMDXFile(filePath)
        contentMap.set(slug, parsed)
      } catch (error) {
        console.error(`Error parsing ${filePath}:`, error)
      }
    } else {
      console.warn(`MDX file not found for slug ${slug}: ${filePath}`)
    }
  }

  return contentMap
}

// CLI test (commented out for production build)
// if (require.main === module) {
//   const mdxDir = path.join(__dirname, '../content/deliverables/blog-posts')
//   console.log('Loading MDX content from:', mdxDir)
//   const content = loadAllMDXContent(mdxDir)
//   console.log(`\nLoaded ${content.size} MDX files:`)
//   content.forEach((parsed, slug) => {
//     console.log(`\n- ${slug}:`)
//     console.log(`  Title: ${parsed.frontmatter.title}`)
//     console.log(`  Content length: ${parsed.content.length} chars`)
//   })
// }
