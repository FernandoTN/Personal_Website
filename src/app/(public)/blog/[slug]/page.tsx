import BlogPostClient from './BlogPostClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Blog post detail page
 *
 * Server component wrapper that renders the BlogPostClient for interactive functionality.
 * Metadata (including Twitter Card and Open Graph tags) is handled by layout.tsx
 */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  return <BlogPostClient slug={slug} />
}
