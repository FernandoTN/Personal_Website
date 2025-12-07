/**
 * JSON-LD Structured Data Components
 *
 * Provides SEO-optimized structured data for search engines.
 * Implements Schema.org vocabulary for:
 * - Person (author/site owner)
 * - Article (blog posts)
 * - WebSite (site-level schema)
 */

interface PersonSchemaProps {
  name: string
  url: string
  image?: string
  jobTitle?: string
  worksFor?: {
    name: string
    url?: string
  }
  sameAs?: string[]
  description?: string
}

interface ArticleSchemaProps {
  headline: string
  description: string
  author: {
    name: string
    url?: string
  }
  datePublished: string
  dateModified?: string
  image?: string
  url: string
  publisher?: {
    name: string
    logo?: string
  }
}

interface WebSiteSchemaProps {
  name: string
  url: string
  description?: string
  author?: {
    name: string
    url?: string
  }
}

/**
 * Person Schema - Used for author/profile pages
 */
export function PersonJsonLd({
  name,
  url,
  image,
  jobTitle,
  worksFor,
  sameAs,
  description,
}: PersonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    ...(image && { image }),
    ...(jobTitle && { jobTitle }),
    ...(description && { description }),
    ...(worksFor && {
      worksFor: {
        '@type': 'Organization',
        name: worksFor.name,
        ...(worksFor.url && { url: worksFor.url }),
      },
    }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Article Schema - Used for blog posts
 */
export function ArticleJsonLd({
  headline,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
  publisher,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    },
    datePublished,
    ...(dateModified && { dateModified }),
    ...(image && { image }),
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(publisher && {
      publisher: {
        '@type': 'Organization',
        name: publisher.name,
        ...(publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: publisher.logo,
          },
        }),
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * WebSite Schema - Used for site-level structured data
 */
export function WebSiteJsonLd({ name, url, description, author }: WebSiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(description && { description }),
    ...(author && {
      author: {
        '@type': 'Person',
        name: author.name,
        ...(author.url && { url: author.url }),
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Named exports are preferred - use import { PersonJsonLd, ArticleJsonLd, WebSiteJsonLd } from '@/components/seo'
