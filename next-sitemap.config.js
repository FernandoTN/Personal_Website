/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://fernandotorres.dev',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://fernandotorres.dev/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
  },
  transform: async (config, path) => {
    // Exclude scheduled/draft posts from sitemap
    // This would need to check the database in a real implementation
    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: path === '/' ? 1.0 : path.startsWith('/blog/') ? 0.8 : 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}
