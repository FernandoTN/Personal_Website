import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { ArticleJsonLd } from '@/components/seo'

interface BlogPostLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

/**
 * Generate dynamic metadata for blog posts
 * This provides proper OpenGraph tags for social sharing
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  // Try to fetch the post from the database
  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        status: 'PUBLISHED',
      },
      select: {
        title: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        author: true,
      },
    })

    if (post) {
      const title = post.title
      const description = post.excerpt || `Read "${post.title}" by ${post.author || 'Fernando Torres'}`
      const image = post.featuredImage || '/og-image.svg'

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'article',
          url: `https://fernandotorres.io/blog/${slug}`,
          publishedTime: post.publishedAt?.toISOString(),
          authors: [post.author || 'Fernando Torres'],
          images: [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [image],
        },
      }
    }
  } catch (error) {
    console.error('Failed to fetch post metadata:', error)
  }

  // Default metadata for mock posts or when database fetch fails
  // This handles the client-side mock data posts
  const defaultTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: defaultTitle,
    description: `Read "${defaultTitle}" on Fernando Torres's blog about AI agents, pharmaceutical innovation, and technology.`,
    openGraph: {
      title: `${defaultTitle} | Fernando Torres`,
      description: `Read "${defaultTitle}" on Fernando Torres's blog about AI agents, pharmaceutical innovation, and technology.`,
      type: 'article',
      url: `https://fernandotorres.io/blog/${slug}`,
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: defaultTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: `Read "${defaultTitle}" on Fernando Torres's blog.`,
      images: ['/og-image.svg'],
    },
  }
}

export default async function BlogPostLayout({ children, params }: BlogPostLayoutProps) {
  const { slug } = await params

  // Fetch post data for JSON-LD
  let articleJsonLd = null
  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        status: 'PUBLISHED',
      },
      select: {
        title: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        updatedAt: true,
        author: true,
      },
    })

    if (post && post.publishedAt) {
      articleJsonLd = (
        <ArticleJsonLd
          headline={post.title}
          description={post.excerpt || `Read "${post.title}" by ${post.author || 'Fernando Torres'}`}
          author={{
            name: post.author || 'Fernando Torres',
            url: 'https://fernandotorres.io',
          }}
          datePublished={post.publishedAt.toISOString()}
          dateModified={post.updatedAt?.toISOString()}
          image={post.featuredImage || 'https://fernandotorres.io/og-image.svg'}
          url={`https://fernandotorres.io/blog/${slug}`}
          publisher={{
            name: 'Fernando Torres',
            logo: 'https://fernandotorres.io/og-image.svg',
          }}
        />
      )
    }
  } catch (error) {
    console.error('Failed to fetch post for JSON-LD:', error)
  }

  return (
    <>
      {articleJsonLd}
      {children}
    </>
  )
}
