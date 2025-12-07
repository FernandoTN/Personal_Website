'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'

/**
 * Extended project data structure for detail page
 */
interface ProjectDetail {
  slug: string
  title: string
  description: string
  fullDescription: string
  image: string
  imageAlt?: string
  techStack: string[]
  category: 'pharma' | 'coding' | 'research'
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
}

/**
 * Mock projects data - will be replaced with database queries
 * Contains full project details for the detail page
 */
const projectsData: Record<string, ProjectDetail> = {
  'ai-agents-research': {
    slug: 'ai-agents-research',
    title: 'AI Agents Research',
    description:
      'Stanford GSB research exploring how enterprise AI agents can transform business workflows.',
    fullDescription: `This research project, conducted at Stanford Graduate School of Business, investigates the emerging field of enterprise AI agents and their potential to revolutionize business operations.

The study explores several key areas:

- **Autonomous Decision-Making**: How AI agents can make complex business decisions while maintaining human oversight and accountability.

- **Human-AI Collaboration**: Patterns and best practices for effective collaboration between human workers and AI agents in enterprise settings.

- **Organizational Adoption**: Strategies and frameworks for successfully implementing AI agent technology across different organizational structures.

- **Risk Management**: Identifying and mitigating potential risks associated with autonomous AI systems in business-critical applications.

The research synthesizes insights from over 50 practitioner interviews, analysis of 100+ enterprise AI implementations, and collaboration with leading technology companies.`,
    image: '/images/projects/ai-agents-placeholder.svg',
    imageAlt: 'AI Agents Research visualization showing neural network patterns',
    techStack: ['Python', 'LangChain', 'GPT-4', 'Research Methods', 'Data Analysis'],
    category: 'research',
    liveUrl: '/research',
    featured: true,
  },
  'personal-website': {
    slug: 'personal-website',
    title: 'Personal Website',
    description:
      'This portfolio site built with Next.js 14, featuring a modern design system and optimized performance.',
    fullDescription: `A comprehensive personal portfolio and blog platform built with modern web technologies. This project showcases best practices in frontend development, accessibility, and performance optimization.

Key features include:

- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS for type-safe, maintainable code.

- **Dark Mode Support**: Seamless theme switching with system preference detection and persistence.

- **MDX Blog Platform**: Full-featured blog with MDX support, syntax highlighting, and custom components.

- **Performance Optimized**: Achieving 90+ Lighthouse scores across all metrics with optimized images and code splitting.

- **Responsive Design**: Mobile-first approach ensuring great experience across all device sizes.

- **Animation System**: Smooth, GPU-accelerated animations using Framer Motion that respect reduced motion preferences.`,
    image: '/images/projects/website-placeholder.svg',
    imageAlt: 'Personal website preview showing the homepage design',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Prisma', 'MDX'],
    category: 'coding',
    githubUrl: 'https://github.com/FernandoTN/personal-website',
    liveUrl: '/',
    featured: true,
  },
  'healthcare-analytics': {
    slug: 'healthcare-analytics',
    title: 'Healthcare Analytics Platform',
    description:
      'Data-driven healthcare insights platform analyzing patient outcomes and treatment efficacy.',
    fullDescription: `A comprehensive healthcare analytics platform designed to improve patient outcomes through data-driven insights. Built with privacy-first principles and full HIPAA compliance.

The platform provides:

- **Patient Outcome Analysis**: Advanced statistical models to track and predict patient outcomes across different treatment protocols.

- **Treatment Efficacy Studies**: Tools for comparing treatment effectiveness using real-world evidence and clinical trial data.

- **Operational Efficiency**: Dashboards and reports to optimize hospital operations, resource allocation, and staff scheduling.

- **Predictive Analytics**: Machine learning models for early intervention, readmission risk, and resource demand forecasting.

- **Privacy & Compliance**: End-to-end encryption, audit logging, and role-based access control ensuring HIPAA compliance.

The system processes millions of patient records while maintaining strict data governance and privacy standards.`,
    image: '/images/projects/healthcare-placeholder.svg',
    imageAlt: 'Healthcare analytics dashboard showing data visualizations',
    techStack: ['Python', 'SQL', 'Tableau', 'Machine Learning', 'AWS', 'HIPAA Compliance'],
    category: 'pharma',
    featured: true,
  },
}

/**
 * Get category badge styling based on project category
 */
function getCategoryStyles(category: string) {
  switch (category) {
    case 'pharma':
      return {
        badge: 'bg-accent-success/10 text-accent-success dark:bg-accent-success-dark/10 dark:text-accent-success-dark border-accent-success/20',
        gradient: 'from-accent-success/20 to-transparent',
      }
    case 'research':
      return {
        badge: 'bg-category-research/10 text-category-research border-category-research/20',
        gradient: 'from-category-research/20 to-transparent',
      }
    case 'coding':
    default:
      return {
        badge: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
        gradient: 'from-accent-primary/20 to-transparent',
      }
  }
}

/**
 * External link icon component
 */
function ExternalLinkIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}

/**
 * GitHub icon component
 */
function GitHubIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/**
 * Arrow left icon for back navigation
 */
function ArrowLeftIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
    </svg>
  )
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

/**
 * ProjectDetailPage displays complete project information including:
 * - Large featured image/hero section
 * - Project title and full description
 * - Tech stack tags
 * - External links (Live URL, GitHub)
 * - Back to projects navigation
 *
 * Accessibility:
 * - Semantic HTML structure with proper heading hierarchy
 * - External links announce new window opening
 * - Focus states visible on all interactive elements
 * - Images have descriptive alt text
 * - Respects reduced motion preferences
 */
export default function ProjectDetailPage({ params }: ProjectPageProps) {
  // Await the params promise (Next.js 15+ pattern)
  const { slug } = use(params)

  const project = projectsData[slug]

  if (!project) {
    notFound()
  }

  const categoryStyles = getCategoryStyles(project.category)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  }

  return (
    <main className="min-h-screen">
      {/* Back Navigation */}
      <motion.div
        className="container-wide pt-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/projects"
          className="
            inline-flex items-center gap-2
            text-sm font-medium
            text-text-secondary dark:text-text-dark-secondary
            hover:text-accent-primary dark:hover:text-accent-primary
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-accent-primary focus-visible:rounded-sm
          "
          aria-label="Back to all projects"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Projects
        </Link>
      </motion.div>

      {/* Hero Section with Featured Image */}
      <section className="relative mt-6 mb-12 md:mb-16">
        <motion.div
          className="container-wide"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <div
            className={`
              relative aspect-[21/9] md:aspect-[21/8] lg:aspect-[21/7]
              rounded-xl md:rounded-2xl overflow-hidden
              bg-gradient-to-br ${categoryStyles.gradient}
              border border-border-light dark:border-border-dark
            `}
          >
            <Image
              src={project.image}
              alt={project.imageAlt || `${project.title} featured image`}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-dark-base/50 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </section>

      {/* Content Section */}
      <motion.section
        className="container-wide pb-16 md:pb-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-4xl">
          {/* Category Badge */}
          <motion.div variants={itemVariants}>
            <span
              className={`
                inline-block px-3 py-1
                text-xs font-medium uppercase tracking-wider
                rounded-full border
                ${categoryStyles.badge}
                mb-4
              `}
            >
              {project.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="
              font-heading text-3xl md:text-4xl lg:text-5xl font-bold
              text-text-primary dark:text-text-dark-primary
              mb-6
            "
            variants={itemVariants}
          >
            {project.title}
          </motion.h1>

          {/* Short Description */}
          <motion.p
            className="
              text-lg md:text-xl
              text-text-secondary dark:text-text-dark-secondary
              mb-8
            "
            variants={itemVariants}
          >
            {project.description}
          </motion.p>

          {/* Tech Stack */}
          <motion.div className="mb-10" variants={itemVariants}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-dark-muted mb-3">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  role="listitem"
                  className={`
                    px-3 py-1.5
                    text-sm font-medium
                    rounded-lg border
                    ${categoryStyles.badge}
                    transition-colors duration-200
                  `}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* External Links */}
          {(project.liveUrl || project.githubUrl) && (
            <motion.div className="flex flex-wrap gap-4 mb-12" variants={itemVariants}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target={project.liveUrl.startsWith('/') ? '_self' : '_blank'}
                  rel={project.liveUrl.startsWith('/') ? undefined : 'noopener noreferrer'}
                  className="
                    inline-flex items-center gap-2
                    px-5 py-2.5
                    text-sm font-medium
                    text-light-base
                    bg-accent-primary hover:bg-accent-primary/90
                    rounded-lg
                    transition-colors duration-200
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-accent-primary focus-visible:ring-offset-2
                    focus-visible:ring-offset-light-base dark:focus-visible:ring-offset-dark-base
                  "
                  aria-label={`View live project${project.liveUrl.startsWith('/') ? '' : ' (opens in new tab)'}`}
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  {project.liveUrl.startsWith('/') ? 'View Project' : 'Live Demo'}
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-2
                    px-5 py-2.5
                    text-sm font-medium
                    text-text-primary dark:text-text-dark-primary
                    bg-light-neutral-grey dark:bg-dark-panel
                    hover:bg-border-light dark:hover:bg-dark-deep-blue
                    border border-border-light dark:border-border-dark
                    rounded-lg
                    transition-colors duration-200
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-accent-primary focus-visible:ring-offset-2
                    focus-visible:ring-offset-light-base dark:focus-visible:ring-offset-dark-base
                  "
                  aria-label="View source code on GitHub (opens in new tab)"
                >
                  <GitHubIcon className="w-4 h-4" />
                  View Source
                </a>
              )}
            </motion.div>
          )}

          {/* Full Description */}
          <motion.div variants={itemVariants}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-dark-muted mb-4">
              About This Project
            </h2>
            <div
              className="
                prose prose-lg max-w-none
                prose-headings:font-heading prose-headings:text-text-primary dark:prose-headings:text-text-dark-primary
                prose-p:text-text-secondary dark:prose-p:text-text-dark-secondary
                prose-strong:text-text-primary dark:prose-strong:text-text-dark-primary
                prose-li:text-text-secondary dark:prose-li:text-text-dark-secondary
                prose-a:text-accent-primary hover:prose-a:text-accent-primary/80
              "
            >
              {project.fullDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Bottom Navigation */}
      <motion.section
        className="
          border-t border-border-light dark:border-border-dark
          bg-light-icy-blue dark:bg-dark-deep-blue
          py-8
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/projects"
              className="
                inline-flex items-center gap-2
                text-sm font-medium
                text-text-secondary dark:text-text-dark-secondary
                hover:text-accent-primary dark:hover:text-accent-primary
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-accent-primary focus-visible:rounded-sm
              "
            >
              <ArrowLeftIcon className="w-4 h-4" />
              All Projects
            </Link>
            <p className="text-sm text-text-muted dark:text-text-dark-muted">
              Interested in collaborating?{' '}
              <Link
                href="/contact"
                className="text-accent-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:rounded-sm"
              >
                Get in touch
              </Link>
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
