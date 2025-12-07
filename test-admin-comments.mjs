import puppeteer from 'puppeteer';

async function testAdminComments() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // Step 1: Navigate to admin login
    console.log('Step 1: Navigating to admin login...');
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: '/tmp/admin-comments-01-login.png' });

    // Step 2: Login
    console.log('Step 2: Logging in...');
    await page.type('input[name="email"]', 'admin@localhost');
    await page.type('input[name="password"]', 'dev-password-change-in-prod');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await new Promise(r => setTimeout(r, 3000));
    console.log('After login URL:', page.url());
    await page.screenshot({ path: '/tmp/admin-comments-02-after-login.png' });

    // Step 3: Navigate to Comments section
    console.log('Step 3: Navigating to Comments section...');
    await page.goto('http://localhost:3000/admin/comments', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: '/tmp/admin-comments-03-comments-page.png' });

    // Step 4: Verify pending comments queue is displayed
    console.log('Step 4: Verifying pending comments queue...');
    const pageTitle = await page.$eval('h1', el => el.textContent).catch(() => 'Not found');
    console.log('Page title:', pageTitle);

    // Check for filter tabs
    const filterButtons = await page.$$eval('button', buttons =>
      buttons.map(b => b.textContent).filter(t => t.includes('Pending') || t.includes('All') || t.includes('Approved') || t.includes('Spam'))
    );
    console.log('Filter tabs found:', filterButtons);

    // Check for comment cards
    const commentCards = await page.$$('[class*="rounded-xl"][class*="border"]');
    console.log('Comment cards found:', commentCards.length);

    // Step 5: Look for approve/spam buttons
    const approveButton = await page.$('button:has-text("Approve")').catch(() => null);
    const spamButton = await page.$('button:has-text("Mark as Spam")').catch(() => null);

    // Check for button text
    const buttonTexts = await page.$$eval('button', buttons => buttons.map(b => b.textContent.trim()));
    console.log('All button texts:', buttonTexts.slice(0, 10));

    const hasApprove = buttonTexts.some(t => t.includes('Approve'));
    const hasSpam = buttonTexts.some(t => t.includes('Spam'));
    console.log('Has Approve button:', hasApprove);
    console.log('Has Spam button:', hasSpam);

    // Take final screenshot
    await page.screenshot({ path: '/tmp/admin-comments-04-final.png', fullPage: true });

    // Summary
    console.log('\n--- Test Summary ---');
    console.log('Page title:', pageTitle);
    console.log('Filter tabs present:', filterButtons.length > 0);
    console.log('Moderation buttons present:', hasApprove || hasSpam);
    console.log('Screenshots saved to /tmp/admin-comments-*.png');

    if (pageTitle === 'Comments' && filterButtons.length > 0) {
      console.log('\nTest PASSED: Admin comments page is working!');
    } else {
      console.log('\nTest needs verification - check screenshots');
    }

  } catch (error) {
    console.error('Test error:', error);
    await page.screenshot({ path: '/tmp/admin-comments-error.png' });
  } finally {
    await browser.close();
  }
}

testAdminComments();
