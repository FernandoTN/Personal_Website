import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// Using Plus Jakarta Sans as heading font (similar to Cal Sans)
// TODO: Replace with local Cal Sans font when available
const headingFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-cal-sans',
  weight: ['600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://fernandotorres.io'),
  title: {
    default: 'Fernando Torres | Stanford GSB MSx',
    template: '%s | Fernando Torres',
  },
  description:
    'Personal portfolio and blog of Fernando Torres, MSx \'26 at Stanford GSB. Exploring AI agents, pharmaceutical innovation, and digital transformation.',
  keywords: [
    'Fernando Torres',
    'Stanford GSB',
    'MSx',
    'AI Agents',
    'Pharmaceutical',
    'Digital Transformation',
    'Portfolio',
    'Blog',
  ],
  authors: [{ name: 'Fernando Torres', url: 'https://fernandotorres.io' }],
  creator: 'Fernando Torres',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fernandotorres.io',
    siteName: 'Fernando Torres',
    title: 'Fernando Torres | Stanford GSB MSx',
    description:
      'Personal portfolio and blog of Fernando Torres, MSx \'26 at Stanford GSB.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fernando Torres - Stanford GSB MSx',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fernando Torres | Stanford GSB MSx',
    description:
      'Personal portfolio and blog of Fernando Torres, MSx \'26 at Stanford GSB.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${headingFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme detection script - must run before body renders */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getThemePreference() {
                  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
                    return localStorage.getItem('theme');
                  }
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                const theme = getThemePreference();
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
