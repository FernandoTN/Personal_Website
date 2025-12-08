import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights on AI agents, pharmaceutical innovation, and technology. Explore the AI Agents research series and practical guides.',
  openGraph: {
    title: 'Blog | Fernando Torres',
    description:
      'Insights on AI agents, pharmaceutical innovation, and technology. Explore the AI Agents research series and practical guides.',
    type: 'website',
    url: 'https://fernandotorres.dev/blog',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fernando Torres Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Fernando Torres',
    description:
      'Insights on AI agents, pharmaceutical innovation, and technology. Explore the AI Agents research series and practical guides.',
    images: ['/og-image.png'],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
