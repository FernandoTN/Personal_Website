'use client'

import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { ProjectCard, type Project } from '@/components/ui/ProjectCard'

/**
 * Sample project data with different categories
 * In production, this would come from the database or CMS
 */
const PROJECTS: Project[] = [
  {
    slug: 'ai-agents-research',
    title: 'AI Agents Research',
    description:
      'Stanford GSB research exploring what is needed to unlock the full potential of AI agents in enterprise environments. Identifies the Eight Pillars framework for production-ready AI.',
    image: '/images/projects/ai-agents-placeholder.svg',
    techStack: ['Python', 'LLM', 'Research', 'Stanford GSB'],
    category: 'research',
    featured: true,
  },
  {
    slug: 'pharma-supply-chain',
    title: 'Pharmaceutical Supply Chain Optimization',
    description:
      'End-to-end supply chain optimization platform for pharmaceutical manufacturing, reducing lead times by 35% and improving inventory turnover.',
    image: '/images/projects/healthcare-placeholder.svg',
    techStack: ['SAP', 'Python', 'Analytics', 'Supply Chain'],
    category: 'pharma',
    featured: true,
  },
  {
    slug: 'drug-serialization',
    title: 'Drug Serialization & Track-and-Trace',
    description:
      'Implemented FDA-compliant drug serialization system for pharmaceutical products, ensuring complete traceability across the supply chain.',
    image: '/images/projects/healthcare-placeholder.svg',
    techStack: ['SAP ATTP', 'GS1', 'Compliance', 'IoT'],
    category: 'pharma',
  },
  {
    slug: 'personal-website',
    title: 'Personal Website & Blog',
    description:
      'This website! Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features a blog with MDX support and an admin dashboard.',
    image: '/images/projects/website-placeholder.svg',
    techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma'],
    category: 'coding',
    featured: true,
  },
  {
    slug: 'inventory-optimization',
    title: 'Inventory Optimization Engine',
    description:
      'Machine learning-based inventory optimization system for pharmaceutical distribution, reducing stockouts by 42% while minimizing holding costs.',
    image: '/images/projects/healthcare-placeholder.svg',
    techStack: ['Python', 'ML', 'Forecasting', 'Analytics'],
    category: 'pharma',
  },
  {
    slug: 'eight-pillars-framework',
    title: 'Eight Pillars AI Framework',
    description:
      'Comprehensive framework for evaluating and implementing AI agents in enterprise settings, covering LLM selection to monitoring and telemetry.',
    image: '/images/projects/ai-agents-placeholder.svg',
    techStack: ['AI Architecture', 'Framework', 'Research'],
    category: 'research',
  },
  {
    slug: 'react-component-library',
    title: 'React Component Library',
    description:
      'Reusable React component library with TypeScript, Storybook documentation, and comprehensive test coverage for enterprise applications.',
    image: '/images/projects/website-placeholder.svg',
    techStack: ['React', 'TypeScript', 'Storybook', 'Testing'],
    category: 'coding',
  },
  {
    slug: 'api-integration-platform',
    title: 'API Integration Platform',
    description:
      'Microservices-based platform for integrating pharmaceutical ERP systems with external partners, handling 100K+ transactions daily.',
    image: '/images/projects/website-placeholder.svg',
    techStack: ['Node.js', 'REST', 'GraphQL', 'Docker'],
    category: 'coding',
  },
  {
    slug: 'clinical-trial-analytics',
    title: 'Clinical Trial Analytics Dashboard',
    description:
      'Real-time analytics dashboard for clinical trial data, providing insights into patient enrollment, site performance, and study progress.',
    image: '/images/projects/healthcare-placeholder.svg',
    techStack: ['React', 'D3.js', 'Python', 'Healthcare'],
    category: 'pharma',
  },
]

/**
 * Category filter options
 */
const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'pharma', label: 'Pharma' },
  { id: 'coding', label: 'Coding' },
  { id: 'research', label: 'Research' },
] as const

type CategoryId = (typeof CATEGORIES)[number]['id']

/**
 * Projects page displays all projects with category filtering.
 * Features:
 * - Category filter buttons (All, Pharma, Coding, Research)
 * - Responsive grid layout
 * - Smooth animations with Framer Motion for filter transitions
 * - Staggered card animations
 *
 * Accessibility:
 * - Filter buttons have proper ARIA attributes
 * - Grid uses semantic list structure
 * - Respects reduced motion preferences
 */
export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all')

  // Filter projects based on selected category
  const filteredProjects =
    selectedCategory === 'all'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === selectedCategory)

  return (
    <main className="container-wide py-16">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
          Projects
        </h1>
        <p className="text-lg text-text-secondary dark:text-text-dark-secondary max-w-2xl">
          Explore my work across pharmaceutical operations, software development, and AI research.
          Each project represents a unique challenge and learning experience.
        </p>
      </motion.div>

      {/* Category Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-wrap gap-3 mb-10"
        role="group"
        aria-label="Filter projects by category"
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
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
                aria-label={`${category.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.category === category.id).length} projects`}
              >
                {category.id === 'all'
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.category === category.id).length}
              </span>
            </button>
          )
        })}
      </motion.div>

      {/* Projects Grid */}
      <LayoutGroup>
        <motion.ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Projects list"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.li
                key={project.slug}
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
                <ProjectCard project={project} animationDelay={0} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      {/* Empty State */}
      <AnimatePresence>
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <p className="text-text-secondary dark:text-text-dark-secondary text-lg">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
