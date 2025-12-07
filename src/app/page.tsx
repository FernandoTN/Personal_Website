'use client'

import Hero from '@/components/sections/Hero'
import { ResearchHighlight, LatestPosts, FeaturedProjects } from '@/components/home'
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal'
import Link from 'next/link'

/**
 * Homepage with scroll-triggered animations
 *
 * Features:
 * - Hero section with initial entrance animation
 * - Featured projects with staggered card animations
 * - Latest blog posts with reveal animations
 * - Research highlight with animated statistics
 * - Focus areas section with ScrollReveal
 * - Contact CTA with ScrollReveal
 *
 * Animation behavior:
 * - Sections below the fold start hidden/faded
 * - Each section animates into view when 20% visible
 * - Animations only trigger once per element
 * - Staggered children support for lists/grids
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Has its own entrance animations */}
      <Hero />

      {/* Featured Projects - Has its own scroll animations */}
      <FeaturedProjects />

      {/* Latest Blog Posts - Has its own scroll animations */}
      <LatestPosts />

      {/* Research Highlight - Has its own scroll animations */}
      <ResearchHighlight />

      {/* Focus Areas Section - Using ScrollReveal with staggered children */}
      <ScrollReveal
        as="section"
        variant="fadeUp"
        className="py-16 md:py-24"
      >
        <div className="container-wide">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
              Focus Areas
            </h2>
            <p className="text-lg text-text-secondary dark:text-text-dark-secondary max-w-2xl mx-auto">
              Exploring the intersection of technology, healthcare, and enterprise innovation.
            </p>
          </div>

          {/* Staggered grid items */}
          <ScrollReveal
            staggerChildren
            staggerDelay={0.12}
            variant="fadeUp"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            <ScrollRevealItem className="p-6 rounded-xl bg-light-base dark:bg-dark-panel border border-border-light dark:border-border-dark shadow-light dark:shadow-none hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 mb-4 rounded-full bg-accent-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold text-text-primary dark:text-text-dark-primary mb-2">
                AI Agents
              </h3>
              <p className="text-text-secondary dark:text-text-dark-secondary">
                Exploring how autonomous AI systems can augment human capabilities and
                transform enterprise workflows through intelligent automation.
              </p>
            </ScrollRevealItem>

            <ScrollRevealItem className="p-6 rounded-xl bg-light-base dark:bg-dark-panel border border-border-light dark:border-border-dark shadow-light dark:shadow-none hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 mb-4 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold text-text-primary dark:text-text-dark-primary mb-2">
                Healthcare Tech
              </h3>
              <p className="text-text-secondary dark:text-text-dark-secondary">
                Building technology solutions that improve patient outcomes and healthcare
                delivery at scale while maintaining privacy and compliance.
              </p>
            </ScrollRevealItem>

            <ScrollRevealItem className="p-6 rounded-xl bg-light-base dark:bg-dark-panel border border-border-light dark:border-border-dark shadow-light dark:shadow-none hover:shadow-glow transition-shadow duration-300">
              <div className="w-12 h-12 mb-4 rounded-full bg-accent-tertiary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold text-text-primary dark:text-text-dark-primary mb-2">
                Enterprise Solutions
              </h3>
              <p className="text-text-secondary dark:text-text-dark-secondary">
                Designing and implementing systems that drive efficiency and innovation in
                large organizations through strategic technology adoption.
              </p>
            </ScrollRevealItem>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* Contact CTA Section - Using ScrollReveal slideInRight variant */}
      <ScrollReveal
        as="section"
        variant="slideInRight"
        className="py-16 md:py-24 bg-accent-primary/5 dark:bg-accent-primary/10"
      >
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
                Let&apos;s Connect
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.2}>
              <p className="text-lg text-text-secondary dark:text-text-dark-secondary mb-8 max-w-xl mx-auto">
                Interested in collaborating on AI, healthcare tech, or enterprise solutions?
                I&apos;d love to hear from you.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="scaleUp" delay={0.3}>
              <Link
                href="/contact"
                className="
                  inline-flex items-center gap-2 px-8 py-3
                  text-base font-semibold
                  rounded-lg
                  bg-accent-primary hover:bg-accent-primary/90
                  text-white
                  shadow-light hover:shadow-glow
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-accent-primary focus-visible:ring-offset-2
                "
              >
                Get in Touch
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>
    </main>
  )
}
