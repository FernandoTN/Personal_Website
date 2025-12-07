'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProjectCard, type Project } from '@/components/ui/ProjectCard'

/**
 * Sample featured projects data
 * In production, this would come from a CMS or database
 */
const featuredProjects: Project[] = [
  {
    slug: 'ai-agents-research',
    title: 'AI Agents Research',
    description:
      'Stanford GSB research exploring how enterprise AI agents can transform business workflows. Investigating autonomous decision-making, human-AI collaboration, and organizational adoption patterns.',
    // Using gradient placeholder - no image needed
    imageAlt: 'AI Agents Research visualization showing neural network patterns',
    techStack: ['Python', 'LangChain', 'GPT-4', 'Research'],
    category: 'research',
    featured: true,
  },
  {
    slug: 'personal-website',
    title: 'Personal Website',
    description:
      'This portfolio site built with Next.js 14, featuring a modern design system, dark mode, MDX blog posts, and optimized performance. Showcases projects and research work.',
    // Using gradient placeholder - no image needed
    imageAlt: 'Personal website preview showing the homepage design',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    category: 'coding',
    featured: true,
  },
  {
    slug: 'healthcare-analytics',
    title: 'Healthcare Analytics',
    description:
      'Data-driven healthcare insights platform analyzing patient outcomes, treatment efficacy, and operational efficiency. Built with privacy-first principles and HIPAA compliance in mind.',
    // Using gradient placeholder - no image needed
    imageAlt: 'Healthcare analytics dashboard showing data visualizations',
    techStack: ['Python', 'SQL', 'Tableau', 'Machine Learning'],
    category: 'pharma',
    featured: true,
  },
]

interface FeaturedProjectsProps {
  /** Optional additional CSS classes */
  className?: string
  /** Optional custom projects array (defaults to sample data) */
  projects?: Project[]
  /** Section heading text */
  heading?: string
  /** Section subheading text */
  subheading?: string
}

/**
 * FeaturedProjects section displays a curated grid of project cards.
 * Uses Framer Motion for entrance animations and staggered card reveals.
 *
 * Usage:
 * ```tsx
 * // With default projects
 * <FeaturedProjects />
 *
 * // With custom projects
 * <FeaturedProjects
 *   projects={myProjects}
 *   heading="My Work"
 *   subheading="Check out what I've been building"
 * />
 * ```
 *
 * Accessibility:
 * - Uses semantic section element with aria-labelledby
 * - Heading hierarchy is maintained
 * - Grid is responsive for all screen sizes
 * - Respects reduced motion preferences via Framer Motion
 */
export function FeaturedProjects({
  className = '',
  projects = featuredProjects,
  heading = 'Featured Projects',
  subheading = 'A selection of my recent work across research, development, and healthcare analytics.',
}: FeaturedProjectsProps) {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section
      className={`py-16 md:py-24 ${className}`}
      aria-labelledby="featured-projects-heading"
    >
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h2
            id="featured-projects-heading"
            className="
              font-heading text-3xl md:text-4xl lg:text-5xl font-bold
              text-text-primary dark:text-text-dark-primary
              mb-4
            "
            variants={headingVariants}
          >
            {heading}
          </motion.h2>
          <motion.p
            className="
              text-lg text-text-secondary dark:text-text-dark-secondary
              max-w-2xl mx-auto
            "
            variants={headingVariants}
          >
            {subheading}
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            gap-6 md:gap-8
          "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          role="list"
          aria-label="Featured projects"
        >
          {projects.map((project, index) => (
            <div key={project.slug} role="listitem">
              <ProjectCard
                project={project}
                animationDelay={index * 0.1}
              />
            </div>
          ))}
        </motion.div>

        {/* View All Projects Link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/projects"
            className="
              inline-flex items-center gap-2
              px-6 py-3
              text-sm font-medium
              text-accent-primary
              border border-accent-primary/30
              rounded-lg
              hover:bg-accent-primary/10
              hover:border-accent-primary/50
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-accent-primary focus-visible:ring-offset-2
              focus-visible:ring-offset-light-base dark:focus-visible:ring-offset-dark-base
            "
          >
            View All Projects
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProjects
