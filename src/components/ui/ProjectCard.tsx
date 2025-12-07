'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

/**
 * Project data structure for the ProjectCard component
 */
export interface Project {
  /** Unique identifier/slug for the project URL */
  slug: string
  /** Project title */
  title: string
  /** Short description of the project */
  description: string
  /** Path to the project image (relative to public folder) or null for gradient placeholder */
  image?: string | null
  /** Alt text for the image */
  imageAlt?: string
  /** Array of technology/skill tags */
  techStack: string[]
  /** Category for styling: 'pharma', 'coding', or 'research' */
  category?: 'pharma' | 'coding' | 'research'
  /** Whether the project is featured */
  featured?: boolean
}

interface ProjectCardProps {
  /** Project data to display */
  project: Project
  /** Optional additional CSS classes */
  className?: string
  /** Animation delay for staggered animations (in seconds) */
  animationDelay?: number
}

/**
 * Gets the gradient background based on project category
 */
function getCategoryGradient(category: 'pharma' | 'coding' | 'research'): string {
  switch (category) {
    case 'pharma':
      return 'from-emerald-500/80 via-teal-500/70 to-cyan-500/60'
    case 'research':
      return 'from-violet-500/80 via-purple-500/70 to-fuchsia-500/60'
    case 'coding':
    default:
      return 'from-blue-500/80 via-indigo-500/70 to-purple-500/60'
  }
}

/**
 * Gets the category-specific badge/pill class
 */
function getCategoryBadgeClass(category: 'pharma' | 'coding' | 'research'): string {
  switch (category) {
    case 'pharma':
      return 'bg-category-pharma/15 text-category-pharma dark:bg-category-pharma/20 dark:text-emerald-400'
    case 'research':
      return 'bg-category-research/15 text-category-research dark:bg-category-research/20 dark:text-violet-400'
    case 'coding':
    default:
      return 'bg-category-coding/15 text-category-coding dark:bg-category-coding/20 dark:text-blue-400'
  }
}

/**
 * ProjectCard displays a project with image, title, description, and tech stack.
 * Features hover animations using Framer Motion for enhanced interactivity.
 *
 * Features:
 * - Project title prominently displayed
 * - Project description/excerpt (2-line truncation)
 * - Featured image with gradient placeholder fallback
 * - Tech stack tags displayed as pills
 * - Hover animation (scale, shadow increase)
 * - Link wrapper to /projects/[slug] detail page
 * - Fully responsive design
 *
 * Usage:
 * ```tsx
 * <ProjectCard
 *   project={{
 *     slug: 'my-project',
 *     title: 'My Project',
 *     description: 'A cool project description',
 *     image: '/images/projects/my-project.jpg',
 *     techStack: ['React', 'TypeScript'],
 *     category: 'coding'
 *   }}
 * />
 * ```
 *
 * Accessibility:
 * - Uses semantic article element
 * - Image has proper alt text
 * - Link wraps entire card for better click targets
 * - Focus states are visible
 * - Respects reduced motion preferences
 * - Tech stack has aria-label for screen readers
 */
export function ProjectCard({
  project,
  className = '',
  animationDelay = 0,
}: ProjectCardProps) {
  const {
    slug,
    title,
    description,
    image,
    imageAlt,
    techStack,
    category = 'coding',
  } = project

  const hasImage = image && image.length > 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: animationDelay,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.02 }}
      className={`group relative h-full ${className}`}
    >
      <Link
        href={`/projects/${slug}`}
        className="
          block h-full
          rounded-xl overflow-hidden
          border border-border-light dark:border-border-dark
          bg-light-base dark:bg-dark-panel
          shadow-sm
          transition-all duration-300 ease-out
          hover:shadow-xl hover:shadow-accent-primary/10
          hover:border-accent-primary/40
          dark:hover:shadow-glow dark:hover:border-accent-primary/50
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-accent-primary focus-visible:ring-offset-2
          focus-visible:ring-offset-light-base dark:focus-visible:ring-offset-dark-base
        "
        aria-label={`View project: ${title}`}
      >
        {/* Image Container with Gradient Placeholder Fallback */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {hasImage ? (
            <>
              <Image
                src={image}
                alt={imageAlt || `${title} project preview`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="
                  object-cover
                  transition-transform duration-500 ease-out
                  group-hover:scale-110
                "
                priority={false}
              />
              {/* Gradient overlay on hover */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-t from-dark-base/70 via-dark-base/20 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                "
                aria-hidden="true"
              />
            </>
          ) : (
            /* Gradient Placeholder when no image */
            <div
              className={`
                absolute inset-0
                bg-gradient-to-br ${getCategoryGradient(category)}
                flex items-center justify-center
              `}
              aria-hidden="true"
            >
              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 opacity-30">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern
                      id={`grid-${slug}`}
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="1" cy="1" r="1" fill="white" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill={`url(#grid-${slug})`} />
                </svg>
              </div>
              {/* Category icon */}
              <div className="relative z-10 text-white/80">
                {category === 'pharma' && (
                  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                )}
                {category === 'research' && (
                  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                )}
                {category === 'coding' && (
                  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5">
          {/* Title */}
          <h3
            className="
              font-heading text-base sm:text-lg font-semibold
              text-text-primary dark:text-text-dark-primary
              group-hover:text-accent-primary dark:group-hover:text-accent-primary
              transition-colors duration-200
              mb-2
              line-clamp-1
            "
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className="
              text-sm text-text-secondary dark:text-text-dark-secondary
              line-clamp-2 mb-4
              leading-relaxed
            "
          >
            {description}
          </p>

          {/* Tech Stack Tags as Pills */}
          <div
            className="flex flex-wrap gap-1.5 sm:gap-2"
            role="list"
            aria-label="Technologies used"
          >
            {techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                role="listitem"
                className={`
                  inline-flex items-center
                  px-2 sm:px-2.5 py-0.5 sm:py-1
                  text-xs font-medium
                  rounded-full
                  transition-colors duration-200
                  ${getCategoryBadgeClass(category)}
                `}
              >
                {tech}
              </span>
            ))}
            {techStack.length > 4 && (
              <span
                className="
                  inline-flex items-center
                  px-2 sm:px-2.5 py-0.5 sm:py-1
                  text-xs font-medium
                  rounded-full
                  bg-light-neutral-grey/80 text-text-muted
                  dark:bg-dark-deep-blue dark:text-text-dark-muted
                "
                aria-label={`${techStack.length - 4} more technologies`}
              >
                +{techStack.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Hover indicator arrow */}
        <div
          className="
            absolute bottom-4 right-4
            opacity-0 group-hover:opacity-100
            transform translate-x-2 group-hover:translate-x-0
            transition-all duration-300
          "
          aria-hidden="true"
        >
          <div className="
            w-8 h-8 sm:w-9 sm:h-9
            rounded-full
            bg-accent-primary/10 dark:bg-accent-primary/20
            flex items-center justify-center
          ">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default ProjectCard
