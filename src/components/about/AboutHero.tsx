'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

/**
 * AboutHero Component
 *
 * Displays the main hero section of the About page with:
 * - Large author name
 * - Subtitle showing current education/position
 * - Profile photo (Real image)
 * - Detailed bio text
 * - Newsletter CTA
 *
 * Uses Framer Motion for entrance animations with fade-in and slide-up effects.
 * Fully responsive and accessible.
 */
export default function AboutHero() {
  return (
    <section
      className="relative py-12 md:py-20"
      aria-labelledby="about-heading"
    >
      {/* Background gradient accent */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-accent-primary/5 blur-3xl dark:bg-accent-primary/10" />
        <div className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-accent-secondary/5 blur-3xl dark:bg-accent-secondary/10" />
      </div>

      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero content - two column layout on larger screens */}
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
          {/* Photo column */}
          <div className="flex-shrink-0">
            <div className="relative h-64 w-64 md:h-72 md:w-72 lg:h-80 lg:w-80">
              {/* Back glow effect */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary opacity-30 blur-2xl dark:opacity-20 animate-pulse" />

              {/* Image Container */}
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-light-base shadow-xl dark:border-dark-panel">
                <Image
                  src="/images/profile-photo.jpg"
                  alt="Fernando Torres"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="flex-1 text-center lg:text-left">
            {/* Main Heading - Author Name */}
            <motion.h1
              id="about-heading"
              className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-text-dark-primary sm:text-5xl lg:text-6xl"
              variants={itemVariants}
            >
              Fernando Torres
            </motion.h1>

            {/* Subtitle - Education */}
            <motion.p
              className="mt-3 text-xl font-medium text-accent-primary sm:text-2xl"
              variants={itemVariants}
            >
              MSx &apos;26, Stanford Graduate School of Business
            </motion.p>

            {/* Short Positioning Statement */}
            <motion.p
              className="mt-6 text-lg font-medium leading-relaxed text-text-primary dark:text-text-dark-primary"
              variants={itemVariants}
            >
              Founder and builder (industrial engineer) at the intersection of artificial intelligence and enterprise systems, focused on solving the missing piece of AI adoption: durable, user‑owned context. Currently prototyping tools such as a context infrastructure platform that enables AI agents to deliver deeply personalized, high‑accuracy outputs.
            </motion.p>

            {/* Bio text */}
            <motion.div
              className="mt-6 space-y-4 text-base leading-relaxed text-text-secondary dark:text-text-dark-secondary sm:text-lg"
              variants={itemVariants}
            >
              <p>
                My work centers on the architecture of agentic workflows, long‑lived AI systems, and the data foundations required to make them reliable in real‑world environments. At Stanford’s MSx program, I am conducting research on how autonomous AI agents coordinate, manage memory, and operate across complex enterprise workflows. This research directly informs the development of Memori.
              </p>
              <p>
                Before Stanford, I spent several years in the pharmaceutical industry, ultimately becoming the youngest director at Chinoin, a 2,000‑employee company operating across Mexico, the U.S., and Latin America. I led major licensing negotiations, established scalable business development processes, and drove cross‑country operational improvements in supply chain and market execution.
              </p>
              <p>
                My background also includes hands‑on software engineering, ML experimentation, and building early products. I began coding before the age of 10 and have since created projects ranging from AI systems for medical imaging (lung nodule detection using CNN ensembles) to platform prototypes for wellness and therapy.
              </p>
              <p>
                Today, I’m focused on building Memori: a secure, user‑centric context platform that structures and retrieves personal and enterprise data for AI systems. I believe AI adoption will be defined not only by better models but by better context, and Memori aims to solve that foundational challenge.
              </p>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div
              className="mt-10 rounded-xl bg-accent-primary/5 p-6 border border-accent-primary/10 dark:bg-accent-primary/10"
              variants={itemVariants}
            >
              <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-2">
                Stay Updated
              </h3>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
                Stay updated on my research into agentic AI, context infrastructure, and the development of Memori. Subscribe to receive new articles, insights, and project updates.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-dark-base focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-primary/90 transition-colors shadow-sm"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>

            {/* Personal Section */}
            <motion.div
              className="mt-8 pt-8 border-t border-border-light dark:border-border-dark"
              variants={itemVariants}
            >
              <p className="text-sm text-text-muted dark:text-text-dark-muted italic">
                Born in Mexico City, now living in Palo Alto with my wife and son. I am a recreational triathlete training toward Ironman distance events, have completed a couple, but I really want to do my first trail‑running ultramarathon. Continually exploring the intersection of performance, learning, and technology. My long‑standing interests include new technologies, videogames and endurance sports.
              </p>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  )
}
