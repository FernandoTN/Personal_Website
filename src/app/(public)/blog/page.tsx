'use client'

import { useState, useMemo, useCallback, Suspense, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { ChevronLeft, ChevronRight, BookOpen, X, Tag, Search } from 'lucide-react'
import { BlogPostCard, type BlogPost } from '@/components/ui/BlogPostCard'

/**
 * Interface for API response
 */
interface ApiPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  featuredImage: string | null
  category: string | null
  author: string
  publishedAt: string
  readingTimeMinutes: number
  viewCount: number
  tags: Array<{
    tag: {
      slug: string
      name: string
    }
  }>
  series: {
    slug: string
    name: string
  } | null
}

/**
 * Map API category to BlogPost category format
 */
function mapCategory(apiCategory: string | null): 'Anchor' | 'Theme' | 'Emergent' | 'Practitioner' | 'Prototype' | 'Conference' | 'Meta' | 'General' {
  const categoryMap: Record<string, 'Anchor' | 'Theme' | 'Emergent' | 'Practitioner' | 'Prototype' | 'Conference' | 'Meta' | 'General'> = {
    'ANCHOR': 'Anchor',
    'THEME': 'Theme',
    'EMERGENT': 'Emergent',
    'PRACTITIONER': 'Practitioner',
    'PROTOTYPE': 'Prototype',
    'CONFERENCE': 'Conference',
    'METHODOLOGY': 'Theme', // Map methodology to Theme
    'META': 'Meta',
    'GENERAL': 'General',
  }
  return categoryMap[apiCategory?.toUpperCase() || ''] || 'General'
}

/**
 * Transform API post to BlogPost format
 */
function transformApiPost(apiPost: ApiPost): BlogPost {
  return {
    slug: apiPost.slug,
    title: apiPost.title,
    excerpt: apiPost.excerpt || '',
    publishedAt: apiPost.publishedAt,
    category: mapCategory(apiPost.category),
    readingTime: apiPost.readingTimeMinutes,
    featured: apiPost.category === 'ANCHOR',
    tags: apiPost.tags.map(t => t.tag.name),
  }
}

/**
 * Helper function to convert tag to URL-safe slug
 */
function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Helper function to convert slug back to tag display name
 */
function slugToTagFromList(slug: string, allTags: string[]): string | undefined {
  return allTags.find((tag) => tagToSlug(tag) === slug)
}

/**
 * Get all unique tags from posts
 */
function getAllTagsFromPosts(posts: BlogPost[]): string[] {
  const tagSet = new Set<string>()
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}

/**
 * Get tag count (number of posts with this tag)
 */
function getTagCountFromPosts(tag: string, posts: BlogPost[]): number {
  return posts.filter((post) => post.tags?.includes(tag)).length
}

/**
 * Category filter options for the blog page
 * Based on Feature 34 requirements
 */
const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Theme', label: 'Theme' },
  { id: 'Emergent', label: 'Emergent' },
  { id: 'Practitioner', label: 'Practitioner' },
  { id: 'Prototype', label: 'Prototype' },
  { id: 'Conference', label: 'Conference' },
] as const

type CategoryId = (typeof CATEGORIES)[number]['id']

/** Posts per page for pagination */
const POSTS_PER_PAGE = 6

/**
 * Pagination component for navigating between pages of blog posts
 */
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Show limited page numbers on mobile
  const visiblePages = pages.filter(page => {
    if (totalPages <= 5) return true
    if (page === 1 || page === totalPages) return true
    if (Math.abs(page - currentPage) <= 1) return true
    return false
  })

  // Add ellipsis markers
  const pagesWithEllipsis: (number | 'ellipsis-start' | 'ellipsis-end')[] = []
  visiblePages.forEach((page, index) => {
    if (index > 0 && page - visiblePages[index - 1] > 1) {
      pagesWithEllipsis.push(page < currentPage ? 'ellipsis-start' : 'ellipsis-end')
    }
    pagesWithEllipsis.push(page)
  })

  if (totalPages <= 1) return null

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center justify-center gap-2 mt-12"
      aria-label="Blog pagination"
    >
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          flex items-center gap-1 px-3 py-2 rounded-lg
          text-sm font-medium
          text-text-secondary dark:text-text-dark-secondary
          bg-light-neutral-grey dark:bg-dark-panel
          border border-border-light dark:border-border-dark
          transition-all duration-200
          hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue
          hover:text-accent-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:bg-light-neutral-grey dark:disabled:hover:bg-dark-panel
          disabled:hover:text-text-secondary dark:disabled:hover:text-text-dark-secondary
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-accent-primary focus-visible:ring-offset-2
        "
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pagesWithEllipsis.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span
                key={`${page}-${index}`}
                className="px-2 text-text-muted dark:text-text-dark-muted"
                aria-hidden="true"
              >
                ...
              </span>
            )
          }

          const isActive = page === currentPage
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                w-10 h-10 rounded-lg text-sm font-medium
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-accent-primary focus-visible:ring-offset-2
                ${isActive
                  ? 'bg-accent-primary text-white shadow-md'
                  : `
                    text-text-secondary dark:text-text-dark-secondary
                    bg-light-neutral-grey dark:bg-dark-panel
                    border border-border-light dark:border-border-dark
                    hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue
                    hover:text-accent-primary
                  `
                }
              `}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          flex items-center gap-1 px-3 py-2 rounded-lg
          text-sm font-medium
          text-text-secondary dark:text-text-dark-secondary
          bg-light-neutral-grey dark:bg-dark-panel
          border border-border-light dark:border-border-dark
          transition-all duration-200
          hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue
          hover:text-accent-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:bg-light-neutral-grey dark:disabled:hover:bg-dark-panel
          disabled:hover:text-text-secondary dark:disabled:hover:text-text-dark-secondary
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-accent-primary focus-visible:ring-offset-2
        "
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </motion.nav>
  )
}

/**
 * Tag Filter Dropdown component for filtering posts by tags
 */
interface TagFilterProps {
  allTags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
  posts: BlogPost[]
}

function TagFilter({ allTags, selectedTag, onTagSelect, posts }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mb-8 flex justify-center"
    >
      <div className="relative inline-block" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          {/* Dropdown Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
              text-sm font-medium
              border transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-accent-primary focus-visible:ring-offset-2
              ${selectedTag
                ? 'bg-accent-primary text-white border-accent-primary'
                : 'bg-light-neutral-grey dark:bg-dark-panel text-text-secondary dark:text-text-dark-secondary border-border-light dark:border-border-dark hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue hover:text-accent-primary'
              }
            `}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={selectedTag ? `Filtered by tag: ${selectedTag}` : 'Filter by tag'}
          >
            <Tag className="h-4 w-4" aria-hidden="true" />
            {selectedTag ? selectedTag : 'Filter by Tag'}
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Clear Button */}
          {selectedTag && (
            <button
              onClick={() => onTagSelect(null)}
              className="
                flex items-center gap-1 px-3 py-2.5 rounded-lg
                text-sm font-medium
                bg-accent-primary/10 text-accent-primary
                hover:bg-accent-primary/20
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-accent-primary focus-visible:ring-offset-2
              "
              aria-label="Clear tag filter"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="
                absolute z-50 mt-2 left-0 min-w-[220px] max-h-[300px] overflow-auto
                bg-white dark:bg-dark-panel
                border border-border-light dark:border-border-dark
                rounded-xl shadow-lg
                scrollbar-thin
              "
              role="listbox"
              aria-label="Select a tag to filter"
            >
              <div className="p-2">
                {allTags.map((tag) => {
                  const isSelected = selectedTag === tag
                  const count = getTagCountFromPosts(tag, posts)
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        onTagSelect(isSelected ? null : tag)
                        setIsOpen(false)
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg
                        text-sm text-left
                        transition-colors duration-150
                        focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-accent-primary focus-visible:ring-inset
                        ${isSelected
                          ? 'bg-accent-primary text-white'
                          : 'text-text-primary dark:text-text-dark-primary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue'
                        }
                      `}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span>{tag}</span>
                      <span
                        className={`
                          px-2 py-0.5 rounded-full text-xs
                          ${isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-muted dark:text-text-dark-muted'
                          }
                        `}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/**
 * Inner component that uses searchParams
 */
function BlogPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // State for API-fetched posts
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch posts from API on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true)
        setError(null)
        // Fetch all published posts (API filters by status=PUBLISHED)
        const response = await fetch('/api/posts?limit=100')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await response.json()
        if (data.success && data.posts) {
          const transformedPosts = data.posts.map(transformApiPost)
          setPosts(transformedPosts)
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError('Failed to load posts')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Get all unique tags from fetched posts
  const allTags = useMemo(() => getAllTagsFromPosts(posts), [posts])

  // Get tag from URL query parameter
  const tagSlug = searchParams.get('tag')
  const selectedTag = tagSlug ? (slugToTagFromList(tagSlug, allTags) ?? null) : null

  // Handle tag selection and update URL
  const handleTagSelect = useCallback((tag: string | null) => {
    setCurrentPage(1) // Reset to first page when changing tag
    if (tag) {
      router.push(`/blog?tag=${tagToSlug(tag)}`, { scroll: false })
    } else {
      router.push('/blog', { scroll: false })
    }
  }, [router])

  // Filter posts based on selected category, tag, and search query
  const filteredPosts = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? posts
      : posts.filter((post) => post.category?.toUpperCase() === selectedCategory.toUpperCase())

    // Apply tag filter if selected
    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags?.includes(selectedTag))
    }

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [posts, selectedCategory, selectedTag, searchQuery])

  // Calculate pagination based on filtered posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  // Get count for each category
  const getCategoryCount = (categoryId: CategoryId): number => {
    if (categoryId === 'all') return posts.length
    return posts.filter((post) => post.category?.toUpperCase() === categoryId.toUpperCase()).length
  }

  // Handle page change with scroll to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of posts grid smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle category change - reset to page 1
  const handleCategoryChange = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
    searchInputRef.current?.focus()
  }

  // Determine if search is active
  const isSearchActive = searchQuery.trim().length > 0

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-light-base dark:bg-dark-base flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-accent-primary" aria-hidden="true" />
          </div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Loading posts...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-light-base dark:bg-dark-base flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-light-base dark:bg-dark-base">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-b from-light-icy-blue to-light-base dark:from-dark-deep-blue dark:to-dark-base">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 mb-6"
            >
              <BookOpen className="w-8 h-8 text-accent-primary" aria-hidden="true" />
            </motion.div>

            {/* Title */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
              Blog
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-text-secondary dark:text-text-dark-secondary max-w-2xl mx-auto">
              Insights on AI agents, pharmaceutical innovation, and technology.
              Explore the AI Agents research series and practical guides for building production systems.
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-6 mt-8 text-sm text-text-muted dark:text-text-dark-muted"
            >
              <span>{posts.length} articles</span>
              <span className="w-1 h-1 rounded-full bg-text-muted dark:bg-text-dark-muted" aria-hidden="true" />
              <span>AI Agents Series</span>
            </motion.div>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 max-w-md mx-auto"
            >
              <div className="relative">
                <label htmlFor="blog-search" className="sr-only">
                  Search blog posts
                </label>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search
                    className="h-5 w-5 text-text-muted dark:text-text-dark-muted"
                    aria-hidden="true"
                  />
                </div>
                <input
                  ref={searchInputRef}
                  id="blog-search"
                  type="search"
                  placeholder="Search posts by title or content..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="
                    w-full pl-12 pr-12 py-3.5 rounded-xl
                    bg-white dark:bg-dark-panel
                    border border-border-light dark:border-border-dark
                    text-text-primary dark:text-text-dark-primary
                    placeholder:text-text-muted dark:placeholder:text-text-dark-muted
                    shadow-sm
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                    focus:shadow-md
                  "
                  aria-describedby="search-results-count"
                />
                {/* Clear button */}
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      onClick={handleClearSearch}
                      className="
                        absolute inset-y-0 right-0 pr-4 flex items-center
                        text-text-muted dark:text-text-dark-muted
                        hover:text-text-secondary dark:hover:text-text-dark-secondary
                        transition-colors duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2
                      "
                      type="button"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              {/* Search results count (announced to screen readers) */}
              <div
                id="search-results-count"
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
              >
                {searchQuery.trim() && (
                  filteredPosts.length === 0
                    ? 'No results found'
                    : `${filteredPosts.length} result${filteredPosts.length === 1 ? '' : 's'} found`
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter & Blog Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container-wide">
          {/* Category Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-8 justify-center"
            role="group"
            aria-label="Filter blog posts by category"
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`
                    px-5 py-2.5 rounded-full font-medium text-sm
                    transition-all duration-300 ease-out
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-accent-primary focus-visible:ring-offset-2
                    focus-visible:ring-offset-light-base dark:focus-visible:ring-offset-dark-base
                    ${
                      isSelected
                        ? 'bg-accent-primary text-white shadow-md'
                        : 'bg-light-panel dark:bg-dark-panel text-text-secondary dark:text-text-dark-secondary border border-border-light dark:border-border-dark hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue hover:text-text-primary dark:hover:text-text-dark-primary'
                    }
                  `}
                  aria-pressed={isSelected}
                  aria-label={`Filter by ${category.label} category${isSelected ? ' (currently selected)' : ''}`}
                >
                  {category.label}
                  {/* Badge showing count */}
                  <span
                    className={`
                      ml-2 px-2 py-0.5 text-xs rounded-full
                      ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-muted dark:text-text-dark-muted'
                      }
                    `}
                    aria-label={`${getCategoryCount(category.id)} posts`}
                  >
                    {getCategoryCount(category.id)}
                  </span>
                </button>
              )
            })}
          </motion.div>

          {/* Tag Filter Dropdown */}
          <TagFilter
            allTags={allTags}
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
            posts={posts}
          />

          {/* Active Filter Indicator */}
          <AnimatePresence>
            {selectedTag && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-center justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
                  <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
                    Showing posts tagged:
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-primary text-white text-sm font-medium">
                    {selectedTag}
                    <button
                      onClick={() => handleTagSelect(null)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${selectedTag} tag filter`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Blog Posts Grid with animation */}
          <LayoutGroup>
            <motion.ul
              className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
              aria-label="Blog posts list"
              layout
            >
              <AnimatePresence mode="popLayout">
                {currentPosts.map((post, index) => (
                  <motion.li
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      layout: { duration: 0.4, type: 'spring', stiffness: 300, damping: 30 },
                    }}
                  >
                    <BlogPostCard post={post} animationDelay={0} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>

          {/* Empty State */}
          <AnimatePresence>
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-light-neutral-grey dark:bg-dark-panel mb-4">
                  <Search className="w-8 h-8 text-text-muted dark:text-text-dark-muted" aria-hidden="true" />
                </div>
                <p className="text-text-secondary dark:text-text-dark-secondary text-lg mb-2">
                  {isSearchActive
                    ? `No results found for "${searchQuery}"`
                    : selectedTag
                      ? `No blog posts found with tag "${selectedTag}"`
                      : 'No blog posts found in this category.'
                  }
                </p>
                {isSearchActive && (
                  <p className="text-text-muted dark:text-text-dark-muted text-sm mb-4">
                    Try adjusting your search terms or browse by category
                  </p>
                )}
                <div className="flex items-center justify-center gap-3">
                  {isSearchActive && (
                    <button
                      onClick={handleClearSearch}
                      className="
                        inline-flex items-center gap-2 px-4 py-2 rounded-lg
                        text-sm font-medium
                        text-accent-primary
                        bg-accent-primary/10
                        hover:bg-accent-primary/20
                        transition-colors duration-200
                        focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-accent-primary focus-visible:ring-offset-2
                      "
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      Clear search
                    </button>
                  )}
                  {selectedTag && (
                    <button
                      onClick={() => handleTagSelect(null)}
                      className="
                        inline-flex items-center gap-2 px-4 py-2 rounded-lg
                        text-sm font-medium
                        bg-accent-primary text-white
                        hover:bg-accent-primary/90
                        transition-colors duration-200
                        focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-accent-primary focus-visible:ring-offset-2
                      "
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      Clear tag filter
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Page indicator */}
          {filteredPosts.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center text-sm text-text-muted dark:text-text-dark-muted mt-4"
            >
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} articles
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {selectedTag && ` tagged "${selectedTag}"`}
              {isSearchActive && ` matching "${searchQuery}"`}
            </motion.p>
          )}
        </div>
      </section>
    </main>
  )
}

/**
 * Blog listing page displays all blog posts with category and tag filtering, plus pagination
 *
 * Features:
 * - Category filter buttons (All, Theme, Emergent, Practitioner, Prototype, Conference)
 * - Tag cloud for filtering by tags with URL query parameter support (?tag=xxx)
 * - Responsive grid layout (1/2/3 columns)
 * - Pagination with 6 posts per page
 * - Smooth animations with Framer Motion for filter transitions
 * - Accessible navigation
 *
 * Accessibility:
 * - Filter buttons have proper ARIA attributes
 * - Grid uses semantic list structure
 * - Respects reduced motion preferences
 */
export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-light-base dark:bg-dark-base flex items-center justify-center">
        <div className="text-text-secondary dark:text-text-dark-secondary">Loading...</div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  )
}
