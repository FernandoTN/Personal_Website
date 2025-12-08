import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Fernando Torres. Connect on LinkedIn, GitHub, or send a message.',
  openGraph: {
    title: 'Contact | Fernando Torres',
    description:
      'Get in touch with Fernando Torres. Connect on LinkedIn, GitHub, or send a message.',
    type: 'website',
    url: 'https://fernandotorres.dev/contact',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Contact Fernando Torres',
      },
    ],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
