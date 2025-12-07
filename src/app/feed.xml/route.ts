import prisma from '@/lib/prisma'

const SITE_URL = 'https://fernandotorres.io'
const SITE_TITLE = 'Fernando Torres | Stanford GSB MSx'
const SITE_DESCRIPTION = "Personal portfolio and blog of Fernando Torres, MSx '26 at Stanford GSB. Exploring AI agents, pharmaceutical innovation, and digital transformation."

/**
 * Escapes special XML characters to prevent injection
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Formats a Date object to RFC 822 format for RSS pubDate
 */
function formatRfc822Date(date: Date): string {
  return date.toUTCString()
}

/**
 * GET /feed.xml
 * Returns RSS 2.0 feed of published blog posts
 */
export async function GET() {
  try {
    // Fetch published posts ordered by publication date (newest first)
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          lte: new Date(),
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        author: true,
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: 50, // Limit to most recent 50 posts
    })

    // Build RSS XML
    const rssItems = posts
      .map((post) => {
        const postUrl = `${SITE_URL}/blog/${post.slug}`
        const pubDate = post.publishedAt
          ? formatRfc822Date(post.publishedAt)
          : formatRfc822Date(new Date())
        const categories = post.tags
          .map((pt) => `<category>${escapeXml(pt.tag.name)}</category>`)
          .join('\n        ')

        return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt || '')}</description>
      <author>${escapeXml(post.author)}</author>
      ${categories}
    </item>`
      })
      .join('\n')

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${formatRfc822Date(new Date())}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    <managingEditor>fertorresnavarrete@gmail.com (Fernando Torres)</managingEditor>
    <webMaster>fertorresnavarrete@gmail.com (Fernando Torres)</webMaster>
${rssItems}
  </channel>
</rss>`

    return new Response(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('RSS feed generation error:', error)

    // Return a minimal valid RSS feed on error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${formatRfc822Date(new Date())}</lastBuildDate>
  </channel>
</rss>`

    return new Response(errorXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  }
}
