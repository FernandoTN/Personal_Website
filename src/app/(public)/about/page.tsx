import type { Metadata } from 'next'
import { AboutHero, Skills, Timeline } from '@/components/about'

export const metadata: Metadata = {
  title: 'About',
  description:
    "Learn about Fernando Torres - MSx '26 at Stanford GSB, exploring AI agents and pharmaceutical innovation.",
  openGraph: {
    title: 'About | Fernando Torres',
    description:
      "Learn about Fernando Torres - MSx '26 at Stanford GSB, exploring AI agents and pharmaceutical innovation.",
    type: 'website',
    url: 'https://fernandotorres.io/about',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Fernando Torres - Stanford GSB MSx',
      },
    ],
  },
}

/**
 * About Page
 *
 * Displays the author's bio, profile photo, skills, and career timeline.
 * Features:
 * - Hero section with name (Fernando Torres), title (MSx '26, Stanford GSB), photo, and bio
 * - Skills organized by category (Technical, Domain, Leadership)
 * - Career timeline with education and work experience
 * - Framer Motion animations throughout
 *
 * The page is fully responsive and accessible.
 */
export default function AboutPage() {
  return (
    <main className="container-narrow py-8 md:py-16">
      {/* Hero section with name, title, profile photo, and bio */}
      <AboutHero />

      {/* Skills section with Technical, Domain, and Leadership categories */}
      <Skills className="mt-4" />

      {/* Career timeline section */}
      <Timeline className="mt-8 mb-16" />
    </main>
  )
}
