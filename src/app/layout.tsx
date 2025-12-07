import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import '@/styles/globals.css'
import { Navigation, Footer } from '@/components/ui'
import { PersonJsonLd, WebSiteJsonLd } from '@/components/seo'
import prisma from '@/lib/prisma'

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

// Default values for site settings
const DEFAULT_SITE_TITLE = 'Fernando Torres | Stanford GSB MSx'
const DEFAULT_SITE_DESCRIPTION = "Personal portfolio and blog of Fernando Torres, MSx '26 at Stanford GSB. Exploring AI agents, pharmaceutical innovation, and digital transformation."

// Fetch site settings from database
async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['siteTitle', 'siteDescription']
        }
      }
    })

    const settingsMap: Record<string, string> = {}
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value as string
    }

    return {
      siteTitle: settingsMap.siteTitle || DEFAULT_SITE_TITLE,
      siteDescription: settingsMap.siteDescription || DEFAULT_SITE_DESCRIPTION,
    }
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return {
      siteTitle: DEFAULT_SITE_TITLE,
      siteDescription: DEFAULT_SITE_DESCRIPTION,
    }
  }
}

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const { siteTitle, siteDescription } = await getSiteSettings()

  return {
    metadataBase: new URL('https://fernandotorres.io'),
    title: {
      default: siteTitle,
      template: '%s | Fernando Torres',
    },
    description: siteDescription,
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
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Fernando Torres - Stanford GSB MSx',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: ['/og-image.svg'],
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
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for potential external resources */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />

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
        {/* JSON-LD Structured Data for SEO */}
        <PersonJsonLd
          name="Fernando Torres"
          url="https://fernandotorres.io"
          image="https://fernandotorres.io/og-image.svg"
          jobTitle="MSx '26"
          worksFor={{
            name: "Stanford Graduate School of Business",
            url: "https://www.gsb.stanford.edu"
          }}
          sameAs={[
            "https://github.com/FernandoTN",
            "https://www.linkedin.com/in/fernandotn/"
          ]}
          description="Exploring AI agents, pharmaceutical innovation, and digital transformation at Stanford GSB."
        />
        <WebSiteJsonLd
          name="Fernando Torres"
          url="https://fernandotorres.io"
          description="Personal portfolio and blog of Fernando Torres, MSx '26 at Stanford GSB. Exploring AI agents, pharmaceutical innovation, and digital transformation."
          author={{
            name: "Fernando Torres",
            url: "https://fernandotorres.io"
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased flex flex-col">
        {/* Skip to main content link for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only
            focus:fixed focus:top-4 focus:left-4 focus:z-[100]
            focus:px-4 focus:py-2 focus:rounded-md
            focus:bg-accent-primary focus:text-white
            focus:font-medium focus:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2
          "
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="pt-16 flex-1" role="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
