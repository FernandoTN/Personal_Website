import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Agents Research | Stanford GSB',
  description:
    "Stanford GSB research on what's needed to unlock the full potential of AI agents. 90% of enterprise pilots fail - discover why and learn about the Eight Pillars framework for successful deployment.",
  openGraph: {
    title: "What's Needed to Unlock the Full Potential of AI Agents?",
    description:
      'Stanford GSB research revealing why 90% of enterprise AI agent pilots fail and the eight critical infrastructure pillars for success.',
    type: 'article',
    url: 'https://fernandotorres.io/research',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'AI Agents Research - Stanford GSB',
      },
    ],
  },
}

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
