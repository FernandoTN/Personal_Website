import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore projects by Fernando Torres across pharmaceutical, coding, and research domains.',
  openGraph: {
    title: 'Projects | Fernando Torres',
    description:
      'Explore projects by Fernando Torres across pharmaceutical, coding, and research domains.',
    type: 'website',
    url: 'https://fernandotorres.dev/projects',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Fernando Torres - Projects',
      },
    ],
  },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
