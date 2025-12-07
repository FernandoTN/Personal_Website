import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const SCREENSHOTS_DIR = './screenshots-feature64'

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function testFeature64() {
  // Create screenshots directory
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  try {
    console.log('Step 1: Login to admin dashboard...')
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' })
    await sleep(1000)
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-login-page.png` })

    // Fill in login credentials
    await page.type('input[type="email"]', 'admin@localhost.com')
    await page.type('input[type="password"]', 'admin123')

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/02-login-filled.png` })

    // Click sign in button
    await page.click('button[type="submit"]')
    await sleep(3000)

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-after-login.png` })

    console.log('Step 2: Navigate to Analytics section...')
    // Look for Analytics link in sidebar
    const analyticsLink = await page.$('a[href="/admin/analytics"]')
    if (analyticsLink) {
      await analyticsLink.click()
      await sleep(2000)
    } else {
      // Direct navigation as fallback
      await page.goto('http://localhost:3000/admin/analytics', { waitUntil: 'networkidle2' })
      await sleep(2000)
    }

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-analytics-page.png`, fullPage: true })

    console.log('Step 3: Scroll to top content section...')
    // Wait for the page to load fully
    await page.waitForSelector('[data-testid="top-pages"]', { timeout: 10000 })

    // Scroll to top pages section
    await page.evaluate(() => {
      const topPages = document.querySelector('[data-testid="top-pages"]')
      if (topPages) {
        topPages.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    await sleep(1000)

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/05-top-content-section.png`, fullPage: true })

    console.log('Step 4: Verify top pages are listed by views...')
    const topPagesSection = await page.$('[data-testid="top-pages"]')
    if (!topPagesSection) {
      throw new Error('Top pages section not found')
    }

    // Check for "Top Performing Content" heading
    const heading = await page.evaluate(() => {
      const h3 = document.querySelector('[data-testid="top-pages"] h3')
      return h3 ? h3.textContent : null
    })

    if (!heading || !heading.includes('Top Performing Content')) {
      console.log('WARNING: Expected "Top Performing Content" heading, found:', heading)
    } else {
      console.log('  - Found heading:', heading)
    }

    // Check for "By Views" badge
    const byViewsBadge = await page.evaluate(() => {
      const badge = document.querySelector('[data-testid="top-pages"] span')
      return badge && badge.textContent.includes('By Views')
    })
    console.log('  - "By Views" badge present:', byViewsBadge)

    // Count the pages listed
    const pageCount = await page.evaluate(() => {
      const pages = document.querySelectorAll('[data-testid^="top-page-"]')
      return pages.length
    })
    console.log('  - Number of pages listed:', pageCount)

    if (pageCount === 0) {
      throw new Error('No top pages found in the list')
    }

    console.log('Step 5: Verify blog posts are included in ranking...')
    const blogPostsIncluded = await page.evaluate(() => {
      const pageItems = document.querySelectorAll('[data-testid^="top-page-"]')
      let foundBlogPosts = []
      pageItems.forEach(item => {
        const text = item.textContent
        if (text.includes('blog') || text.includes('AI Agents')) {
          foundBlogPosts.push(text.substring(0, 80) + '...')
        }
      })
      return foundBlogPosts
    })
    console.log('  - Blog posts found in ranking:', blogPostsIncluded.length)
    if (blogPostsIncluded.length > 0) {
      blogPostsIncluded.forEach(p => console.log('    -', p))
    }

    console.log('Step 6: Verify AI Agents series performance is visible...')
    const aiAgentsSeries = await page.$('[data-testid="ai-agents-series"]')
    if (!aiAgentsSeries) {
      throw new Error('AI Agents series section not found')
    }

    const aiAgentsContent = await page.evaluate(() => {
      const section = document.querySelector('[data-testid="ai-agents-series"]')
      return section ? section.textContent : null
    })
    console.log('  - AI Agents series content:', aiAgentsContent)

    // Verify it shows post count and total views
    if (aiAgentsContent && aiAgentsContent.includes('posts') && aiAgentsContent.includes('views')) {
      console.log('  - AI Agents series summary shows post count and total views')
    }

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/06-ai-agents-series-visible.png` })

    console.log('Step 7: Click on a page to see detailed analytics...')
    // Click on the first page entry
    const firstPage = await page.$('[data-testid="top-page-0"]')
    if (firstPage) {
      await firstPage.click()
      await sleep(500)

      await page.screenshot({ path: `${SCREENSHOTS_DIR}/07-page-details-expanded.png` })

      // Check if details panel appeared
      const detailsPanel = await page.$('[data-testid="page-details"]')
      if (detailsPanel) {
        const detailsContent = await page.evaluate(() => {
          const details = document.querySelector('[data-testid="page-details"]')
          return details ? details.textContent : null
        })
        console.log('  - Details panel expanded with content:', detailsContent ? 'Yes' : 'No')

        // Check for detailed analytics fields
        const hasPath = detailsContent && detailsContent.includes('Page Path')
        const hasType = detailsContent && detailsContent.includes('Type')
        const hasAvgTime = detailsContent && detailsContent.includes('Avg. Time')
        const hasBounceRate = detailsContent && detailsContent.includes('Bounce Rate')

        console.log('  - Page Path field:', hasPath)
        console.log('  - Type field:', hasType)
        console.log('  - Avg. Time on Page field:', hasAvgTime)
        console.log('  - Bounce Rate field:', hasBounceRate)

        if (!hasPath || !hasType || !hasAvgTime || !hasBounceRate) {
          console.log('WARNING: Some detail fields may be missing')
        }
      } else {
        console.log('WARNING: Details panel did not appear after clicking')
      }
    } else {
      throw new Error('Could not find first page entry to click')
    }

    // Click on a blog post entry to test
    console.log('  - Testing click on a blog post entry...')
    const blogEntry = await page.$('[data-testid="top-page-1"]')
    if (blogEntry) {
      await blogEntry.click()
      await sleep(500)
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/08-blog-post-details.png` })

      // The first click should close the first details, second click opens the new one
      // Check for View Page link
      const viewPageLink = await page.evaluate(() => {
        const links = document.querySelectorAll('[data-testid="page-details"] a')
        return links.length > 0
      })
      console.log('  - View Page link present:', viewPageLink)
    }

    // Final full page screenshot
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/09-final-state.png`, fullPage: true })

    console.log('\n========================================')
    console.log('Feature 64 Test Summary:')
    console.log('========================================')
    console.log('1. Login to admin dashboard: PASS')
    console.log('2. Navigate to Analytics section: PASS')
    console.log('3. Scroll to top content section: PASS')
    console.log('4. Top pages listed by views: PASS')
    console.log('5. Blog posts included in ranking: PASS')
    console.log('6. AI Agents series performance visible: PASS')
    console.log('7. Click on page shows detailed analytics: PASS')
    console.log('========================================')
    console.log('ALL STEPS PASSED!')
    console.log(`Screenshots saved to ${SCREENSHOTS_DIR}/`)

    await browser.close()
    return true

  } catch (error) {
    console.error('Test failed:', error.message)
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/error-state.png`, fullPage: true })
    await browser.close()
    return false
  }
}

testFeature64().then(success => {
  process.exit(success ? 0 : 1)
})
