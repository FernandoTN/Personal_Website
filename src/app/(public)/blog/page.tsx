'use client'

import { useState, useMemo, useCallback, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { ChevronLeft, ChevronRight, BookOpen, X, Tag, Search } from 'lucide-react'
import { BlogPostCard, type BlogPost } from '@/components/ui/BlogPostCard'

/**
 * Mock blog post data for the AI Agents series and other posts
 * In production, this would come from the database/CMS
 */
const mockBlogPosts: BlogPost[] = [
  {
    slug: 'what-is-needed-to-unlock-ai-agents',
    title: "What's Needed to Unlock the Full Potential of AI Agents?",
    excerpt: 'The anchor post for our AI Agents research series. Discover the Eight Pillars framework and why 90% of enterprise AI agent pilots fail to reach production.',
    publishedAt: '2024-12-08',
    category: 'Anchor',
    readingTime: 12,
    featured: true,
    tags: ['AI Agents', 'Enterprise', 'Research', 'Stanford'],
  },
  // Theme Deep-Dives (6)
  {
    slug: 'llm-cognitive-engine-deep-dive',
    title: 'The LLM as Cognitive Engine: Beyond Chat Completions',
    excerpt: 'Exploring how large language models serve as the reasoning core of AI agents, and why model capability alone accounts for only 30-40% of agent success.',
    publishedAt: '2024-12-10',
    category: 'Theme',
    readingTime: 8,
    tags: ['AI Agents', 'LLM', 'Machine Learning'],
  },
  {
    slug: 'context-memory-management',
    title: 'Context and Memory Management: The Agent\'s Working Memory',
    excerpt: 'How AI agents maintain context across long-running tasks and why the 40% context utilization rule is critical for production systems.',
    publishedAt: '2024-12-12',
    category: 'Theme',
    readingTime: 10,
    tags: ['AI Agents', 'Memory', 'Architecture'],
  },
  {
    slug: 'system-integration-challenges',
    title: 'System Integration: The 92% Blocker',
    excerpt: 'Deep dive into why system integration is the primary reason enterprise AI agent pilots fail, and practical strategies to overcome these challenges.',
    publishedAt: '2024-12-15',
    category: 'Theme',
    readingTime: 9,
    tags: ['AI Agents', 'Enterprise', 'Integration'],
  },
  {
    slug: 'authentication-identity-agents',
    title: 'Authentication and Identity for AI Agents',
    excerpt: 'Exploring the unique challenges of managing credentials, permissions, and identity when AI agents act on behalf of users and systems.',
    publishedAt: '2024-12-17',
    category: 'Theme',
    readingTime: 7,
    tags: ['AI Agents', 'Security', 'Authentication'],
  },
  {
    slug: 'trust-governance-guardrails',
    title: 'Trust, Governance, and Guardrails: Keeping Agents Safe',
    excerpt: 'How organizations can build trust in AI agents through proper governance frameworks, safety guardrails, and human-in-the-loop controls.',
    publishedAt: '2024-12-19',
    category: 'Theme',
    readingTime: 11,
    tags: ['AI Agents', 'Safety', 'Governance'],
  },
  {
    slug: 'cost-management-strategies',
    title: 'Cost Management Strategies for Production AI Agents',
    excerpt: 'Practical approaches to managing the operational costs of AI agents, from token optimization to intelligent caching strategies.',
    publishedAt: '2024-12-22',
    category: 'Theme',
    readingTime: 8,
    tags: ['AI Agents', 'Cost', 'Production'],
  },
  // Emergent Insights (6)
  {
    slug: 'framework-abandonment-crisis',
    title: 'The Framework Abandonment Crisis: Why 80-90% Fail',
    excerpt: 'An emergent insight from our research on why most AI agent frameworks get abandoned and what the surviving frameworks have in common.',
    publishedAt: '2024-12-24',
    category: 'Emergent',
    readingTime: 7,
    tags: ['AI Agents', 'Frameworks', 'Research'],
  },
  {
    slug: 'multi-agent-orchestration',
    title: 'Multi-Agent Orchestration Patterns',
    excerpt: 'Emergent patterns for coordinating multiple AI agents, including supervisor models, swarm intelligence, and hierarchical delegation.',
    publishedAt: '2025-01-02',
    category: 'Emergent',
    readingTime: 10,
    tags: ['AI Agents', 'Multi-Agent', 'Architecture'],
  },
  {
    slug: 'emergent-agent-behaviors',
    title: 'Emergent Behaviors in Complex Agent Systems',
    excerpt: 'How AI agents develop unexpected capabilities and behaviors when operating in complex environments.',
    publishedAt: '2025-01-05',
    category: 'Emergent',
    readingTime: 9,
    tags: ['AI Agents', 'Research', 'Behavior'],
  },
  {
    slug: 'agent-failure-patterns',
    title: 'Common Failure Patterns in Production Agents',
    excerpt: 'Lessons learned from analyzing failed agent deployments and how to avoid the most common pitfalls.',
    publishedAt: '2025-01-08',
    category: 'Emergent',
    readingTime: 8,
    tags: ['AI Agents', 'Production', 'Debugging'],
  },
  {
    slug: 'context-collapse-prevention',
    title: 'Preventing Context Collapse in Long-Running Agents',
    excerpt: 'Strategies for maintaining coherent context in agents that run for extended periods.',
    publishedAt: '2025-01-12',
    category: 'Emergent',
    readingTime: 7,
    tags: ['AI Agents', 'Memory', 'Production'],
  },
  {
    slug: 'agent-self-correction',
    title: 'Self-Correction Mechanisms in AI Agents',
    excerpt: 'How agents can detect and recover from their own mistakes without human intervention.',
    publishedAt: '2025-01-15',
    category: 'Emergent',
    readingTime: 9,
    tags: ['AI Agents', 'Safety', 'Architecture'],
  },
  // Practitioner Perspectives (5)
  {
    slug: 'practitioner-enterprise-readiness',
    title: 'Enterprise AI Agent Adoption Playbook',
    excerpt: 'A practical guide for enterprises looking to move from AI agent experiments to production deployments.',
    publishedAt: '2025-01-18',
    category: 'Practitioner',
    readingTime: 14,
    tags: ['AI Agents', 'Enterprise', 'Production'],
  },
  {
    slug: 'practitioner-team-structure',
    title: 'Building Effective Agent Development Teams',
    excerpt: 'How to structure and staff teams for successful AI agent development and deployment.',
    publishedAt: '2025-01-21',
    category: 'Practitioner',
    readingTime: 10,
    tags: ['AI Agents', 'Teams', 'Management'],
  },
  {
    slug: 'practitioner-testing-strategies',
    title: 'Testing Strategies for AI Agent Systems',
    excerpt: 'Moving beyond unit tests to comprehensive evaluation strategies for agent systems.',
    publishedAt: '2025-01-24',
    category: 'Practitioner',
    readingTime: 11,
    tags: ['AI Agents', 'Testing', 'Quality'],
  },
  {
    slug: 'practitioner-monitoring',
    title: 'Production Monitoring for AI Agents',
    excerpt: 'Setting up effective monitoring and alerting for agent systems in production.',
    publishedAt: '2025-01-27',
    category: 'Practitioner',
    readingTime: 9,
    tags: ['AI Agents', 'Monitoring', 'DevOps'],
  },
  {
    slug: 'practitioner-cost-optimization',
    title: 'Real-World Cost Optimization Techniques',
    excerpt: 'Practical strategies for reducing AI agent operational costs without sacrificing quality.',
    publishedAt: '2025-01-30',
    category: 'Practitioner',
    readingTime: 8,
    tags: ['AI Agents', 'Cost', 'Optimization'],
  },
  // Prototype Learnings (3)
  {
    slug: 'prototype-customer-service',
    title: 'Building a Customer Service AI Agent',
    excerpt: 'Lessons from building and deploying a customer service agent that handles 10,000 queries daily.',
    publishedAt: '2025-02-02',
    category: 'Prototype',
    readingTime: 12,
    tags: ['AI Agents', 'Customer Service', 'Case Study'],
  },
  {
    slug: 'prototype-code-review',
    title: 'Automated Code Review Agent Implementation',
    excerpt: 'How we built an agent that performs code reviews with context-aware suggestions.',
    publishedAt: '2025-02-05',
    category: 'Prototype',
    readingTime: 11,
    tags: ['AI Agents', 'Developer Tools', 'Automation'],
  },
  {
    slug: 'prototype-data-pipeline',
    title: 'Data Pipeline Automation with AI Agents',
    excerpt: 'Using agents to automate complex data transformation and quality assurance workflows.',
    publishedAt: '2025-02-08',
    category: 'Prototype',
    readingTime: 10,
    tags: ['AI Agents', 'Data Engineering', 'Automation'],
  },
  // Conference Insights (3)
  {
    slug: 'conference-neurips-2024',
    title: 'NeurIPS 2024: AI Agent Research Highlights',
    excerpt: 'Key takeaways from the latest academic research on AI agents presented at NeurIPS.',
    publishedAt: '2025-02-11',
    category: 'Conference',
    readingTime: 8,
    tags: ['AI Agents', 'Research', 'Conference'],
    status: 'published',
  },
  {
    slug: 'conference-enterprise-summit',
    title: 'Enterprise AI Summit: Industry Perspectives',
    excerpt: 'Insights from Fortune 500 companies on their AI agent deployment experiences.',
    publishedAt: '2025-02-13',
    category: 'Conference',
    readingTime: 9,
    tags: ['AI Agents', 'Enterprise', 'Conference'],
    status: 'published',
  },
  {
    slug: 'conference-safety-workshop',
    title: 'AI Agent Safety Workshop Findings',
    excerpt: 'Emerging best practices for safe AI agent deployment from the safety research community.',
    publishedAt: '2025-02-15',
    category: 'Conference',
    readingTime: 7,
    tags: ['AI Agents', 'Safety', 'Conference'],
    status: 'published',
  },
  // Scheduled posts - should NOT appear in listing (Feature 41)
  {
    slug: 'upcoming-agent-frameworks-2026',
    title: 'Agent Frameworks to Watch in 2026',
    excerpt: 'A preview of emerging AI agent frameworks that are set to revolutionize the space in 2026.',
    publishedAt: '2026-03-01',
    category: 'Emergent',
    readingTime: 10,
    tags: ['AI Agents', 'Frameworks', 'Future'],
    status: 'scheduled',
  },
  {
    slug: 'advanced-memory-patterns',
    title: 'Advanced Memory Patterns for Long-Running Agents',
    excerpt: 'Deep dive into cutting-edge memory architectures for agents that run for weeks or months.',
    publishedAt: '2026-03-15',
    category: 'Theme',
    readingTime: 12,
    tags: ['AI Agents', 'Memory', 'Architecture'],
    status: 'scheduled',
  },
  // Draft posts - should NOT appear in listing (Feature 41)
  {
    slug: 'draft-agent-security-audit',
    title: '[DRAFT] Conducting Security Audits for AI Agent Systems',
    excerpt: 'Work in progress: Guidelines for security auditing AI agent deployments.',
    publishedAt: '2026-04-01',
    category: 'Practitioner',
    readingTime: 15,
    tags: ['AI Agents', 'Security', 'Audit'],
    status: 'draft',
  },
]

/**
 * Helper function to convert tag to URL-safe slug
 */
function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Helper function to convert slug back to tag display name
 */
function slugToTag(slug: string): string | undefined {
  const allTags = getAllTags()
  return allTags.find((tag) => tagToSlug(tag) === slug)
}

/**
 * Filter to get only published posts (Feature 41)
 * Posts without a status are treated as published for backward compatibility
 */
function getPublishedPosts(): BlogPost[] {
  return mockBlogPosts.filter((post) => !post.status || post.status === 'published')
}

/**
 * Get all unique tags from published posts only
 */
function getAllTags(): string[] {
  const tagSet = new Set<string>()
  const publishedPosts = getPublishedPosts()
  publishedPosts.forEach((post) => {
    post.tags?.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}

/**
 * Get tag count (number of published posts with this tag)
 */
function getTagCount(tag: string): number {
  const publishedPosts = getPublishedPosts()
  return publishedPosts.filter((post) => post.tags?.includes(tag)).length
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
 * Tag Cloud component for filtering posts by tags
 */
interface TagCloudProps {
  allTags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
}

function TagCloud({ allTags, selectedTag, onTagSelect }: TagCloudProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-4 w-4 text-accent-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
          Filter by Tag
        </h2>
        {selectedTag && (
          <button
            onClick={() => onTagSelect(null)}
            className="
              ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full
              text-xs font-medium
              bg-accent-primary/10 text-accent-primary
              hover:bg-accent-primary/20
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-accent-primary focus-visible:ring-offset-2
            "
            aria-label="Clear tag filter"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Clear filter
          </button>
        )}
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter blog posts by tag"
      >
        {allTags.map((tag) => {
          const isSelected = selectedTag === tag
          const count = getTagCount(tag)
          return (
            <button
              key={tag}
              onClick={() => onTagSelect(isSelected ? null : tag)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-xs font-medium
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-accent-primary focus-visible:ring-offset-2
                ${isSelected
                  ? 'bg-accent-primary text-white shadow-sm'
                  : 'bg-light-neutral-grey dark:bg-dark-panel text-text-secondary dark:text-text-dark-secondary border border-border-light dark:border-border-dark hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue hover:text-accent-primary hover:border-accent-primary/30'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Filter by ${tag} tag (${count} posts)${isSelected ? ' - currently selected' : ''}`}
            >
              {tag}
              <span
                className={`
                  px-1.5 py-0.5 rounded-full text-[10px]
                  ${isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-light-base dark:bg-dark-deep-blue text-text-muted dark:text-text-dark-muted'
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
  )
}

/**
 * Inner component that uses searchParams
 */
function BlogPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Get tag from URL query parameter
  const tagSlug = searchParams.get('tag')
  const selectedTag = tagSlug ? (slugToTag(tagSlug) ?? null) : null

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Get all unique tags
  const allTags = useMemo(() => getAllTags(), [])

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
  // Feature 41: Only show published posts (filter out scheduled/draft)
  const filteredPosts = useMemo(() => {
    const publishedPosts = getPublishedPosts()
    let posts = selectedCategory === 'all'
      ? publishedPosts
      : publishedPosts.filter((post) => post.category === selectedCategory)

    // Apply tag filter if selected
    if (selectedTag) {
      posts = posts.filter((post) => post.tags?.includes(selectedTag))
    }

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
      )
    }

    return posts
  }, [selectedCategory, selectedTag, searchQuery])

  // Calculate pagination based on filtered posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  // Get count for each category (only published posts - Feature 41)
  const getCategoryCount = (categoryId: CategoryId): number => {
    const publishedPosts = getPublishedPosts()
    if (categoryId === 'all') return publishedPosts.length
    return publishedPosts.filter((post) => post.category === categoryId).length
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

            {/* Stats - only count published posts (Feature 41) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-6 mt-8 text-sm text-text-muted dark:text-text-dark-muted"
            >
              <span>{getPublishedPosts().length} articles</span>
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

          {/* Tag Cloud Filter */}
          <TagCloud
            allTags={allTags}
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
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
