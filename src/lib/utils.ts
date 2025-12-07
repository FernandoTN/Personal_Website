import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * Format a date for relative display (e.g., "2 days ago")
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(dateObj)
}

/**
 * Calculate reading time for text content
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

/**
 * Extract excerpt from content (first paragraph or N characters)
 */
export function extractExcerpt(content: string, maxLength = 160): string {
  // Remove MDX/Markdown formatting
  const plainText = content
    .replace(/^#+ .+$/gm, '') // Remove headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
    .replace(/[*_~`]/g, '') // Remove formatting characters
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()

  return truncate(plainText, maxLength)
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj < new Date()
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj > new Date()
}

/**
 * Generate a random ID
 */
export function generateId(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Convert category enum to display name
 */
export function categoryToDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    ANCHOR: 'Anchor',
    THEME: 'Theme Deep Dive',
    EMERGENT: 'Emergent Insight',
    PRACTITIONER: 'Practitioner Perspective',
    PROTOTYPE: 'Prototype Learning',
    CONFERENCE: 'Conference Insight',
    METHODOLOGY: 'Methodology',
  }
  return categoryMap[category] || capitalize(category.toLowerCase())
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Get absolute URL for the site
 */
export function getAbsoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fernandotorres.io'
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * MDX Frontmatter interface
 */
export interface MDXFrontmatter {
  title?: string
  summary?: string
  excerpt?: string
  description?: string
  tags?: string[]
  category?: string
  series?: string
  seriesOrder?: number
  author?: string
  date?: string
  publishedAt?: string
  featuredImage?: string
  image?: string
  ogImage?: string
  metaTitle?: string
  metaDescription?: string
  slug?: string
  draft?: boolean
  [key: string]: unknown
}

/**
 * Parsed MDX result interface
 */
export interface ParsedMDX {
  frontmatter: MDXFrontmatter
  content: string
  rawFrontmatter: string
}

/**
 * Parse MDX file content and extract frontmatter and body
 * Supports YAML frontmatter delimited by ---
 */
export function parseMDX(mdxContent: string): ParsedMDX {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
  const match = mdxContent.match(frontmatterRegex)

  if (!match) {
    // No frontmatter found, return content as is
    return {
      frontmatter: {},
      content: mdxContent.trim(),
      rawFrontmatter: '',
    }
  }

  const rawFrontmatter = match[1]
  const content = mdxContent.slice(match[0].length).trim()
  const frontmatter = parseYAMLFrontmatter(rawFrontmatter)

  return {
    frontmatter,
    content,
    rawFrontmatter,
  }
}

/**
 * Parse simple YAML frontmatter into an object
 * Handles basic YAML syntax: strings, numbers, booleans, arrays
 */
function parseYAMLFrontmatter(yaml: string): MDXFrontmatter {
  const result: MDXFrontmatter = {}
  const lines = yaml.split('\n')
  let currentKey: string | null = null
  let currentArray: string[] | null = null

  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue

    // Check if this is an array item (starts with -)
    if (line.match(/^\s+-\s+/)) {
      if (currentKey && currentArray !== null) {
        const value = line.replace(/^\s+-\s+/, '').trim()
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '')
        currentArray.push(cleanValue)
      }
      continue
    }

    // Check if this is a key-value pair
    const keyValueMatch = line.match(/^(\w+):\s*(.*)$/)
    if (keyValueMatch) {
      // Save previous array if exists
      if (currentKey && currentArray !== null) {
        result[currentKey] = currentArray
        currentArray = null
      }

      const key = keyValueMatch[1]
      let value = keyValueMatch[2].trim()

      // Check if value is empty (might be start of array)
      if (!value) {
        currentKey = key
        currentArray = []
        continue
      }

      // Check if value is an inline array [item1, item2]
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1)
        result[key] = arrayContent
          .split(',')
          .map(item => item.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean)
        currentKey = null
        currentArray = null
        continue
      }

      // Remove quotes from string values
      value = value.replace(/^["']|["']$/g, '')

      // Parse boolean values
      if (value.toLowerCase() === 'true') {
        result[key] = true
      } else if (value.toLowerCase() === 'false') {
        result[key] = false
      }
      // Parse numbers
      else if (!isNaN(Number(value)) && value !== '') {
        result[key] = Number(value)
      }
      // Keep as string
      else {
        result[key] = value
      }

      currentKey = key
      currentArray = null
    }
  }

  // Save final array if exists
  if (currentKey && currentArray !== null && currentArray.length > 0) {
    result[currentKey] = currentArray
  }

  return result
}

/**
 * Convert parsed MDX frontmatter to blog post form data
 */
export function mdxToPostFormData(parsed: ParsedMDX): {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  seriesId: string
  seriesOrder: string
  tags: string
  metaTitle: string
  metaDescription: string
} {
  const { frontmatter, content } = parsed

  // Normalize category to uppercase
  let category = frontmatter.category || ''
  if (category) {
    category = category.toUpperCase()
    // Validate against known categories
    const validCategories = ['ANCHOR', 'THEME', 'EMERGENT', 'PRACTITIONER', 'PROTOTYPE', 'CONFERENCE', 'METHODOLOGY']
    if (!validCategories.includes(category)) {
      category = ''
    }
  }

  // Handle tags - can be array or comma-separated string
  let tagsString = ''
  if (Array.isArray(frontmatter.tags)) {
    tagsString = frontmatter.tags.join(', ')
  } else if (typeof frontmatter.tags === 'string') {
    tagsString = frontmatter.tags
  }

  // Get excerpt from frontmatter or generate from content
  const excerpt = frontmatter.summary || frontmatter.excerpt || frontmatter.description || extractExcerpt(content, 160)

  return {
    title: frontmatter.title || '',
    slug: frontmatter.slug || (frontmatter.title ? slugify(frontmatter.title) : ''),
    excerpt,
    content,
    featuredImage: frontmatter.featuredImage || frontmatter.image || '',
    category,
    seriesId: frontmatter.series || '',
    seriesOrder: frontmatter.seriesOrder ? String(frontmatter.seriesOrder) : '',
    tags: tagsString,
    metaTitle: frontmatter.metaTitle || frontmatter.title || '',
    metaDescription: frontmatter.metaDescription || excerpt,
  }
}
