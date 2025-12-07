import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function testSubscriberManagement() {
  console.log('Starting Feature 66 test: Admin subscriber management');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // Step 1: Navigate to admin login page
    console.log('Step 1: Navigating to admin login...');
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: '/tmp/feature66-1-login.png', fullPage: true });
    console.log('Screenshot saved: /tmp/feature66-1-login.png');

    // Step 2: Login with admin credentials
    console.log('Step 2: Logging in...');
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await page.type('input[type="email"]', 'admin@fernandotorres.dev');
    await page.type('input[type="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await delay(3000);
    await page.screenshot({ path: '/tmp/feature66-2-dashboard.png', fullPage: true });
    console.log('Screenshot saved: /tmp/feature66-2-dashboard.png');
    console.log('Current URL:', page.url());

    // Step 3: Navigate to Subscribers section
    console.log('Step 3: Navigating to Subscribers section...');
    await page.goto('http://localhost:3000/admin/subscribers', { waitUntil: 'networkidle0' });
    await delay(2000);
    await page.screenshot({ path: '/tmp/feature66-3-subscribers.png', fullPage: true });
    console.log('Screenshot saved: /tmp/feature66-3-subscribers.png');

    // Step 4: Verify subscriber list is displayed
    console.log('Step 4: Verifying subscriber list...');
    const subscribersTitle = await page.$eval('h1', el => el.textContent).catch(() => '');
    console.log('Page title:', subscribersTitle);

    // Check for table or subscriber data
    const tableExists = await page.$('table') !== null;
    console.log('Table exists:', tableExists);

    // Check for email addresses
    const emailCells = await page.$$('td');
    console.log('Number of table cells:', emailCells.length);

    // Step 5: Check for email, subscription date, and source columns
    const headers = await page.$$eval('th', els => els.map(el => el.textContent.trim()));
    console.log('Table headers:', headers);

    // Step 6: Test search functionality
    console.log('Step 6: Testing search...');
    const searchInput = await page.$('input[placeholder*="Search"]');
    if (searchInput) {
      await searchInput.type('test');
      await delay(500);
      await page.screenshot({ path: '/tmp/feature66-4-search.png', fullPage: true });
      console.log('Screenshot saved: /tmp/feature66-4-search.png');
      console.log('Search input found and tested');
    } else {
      console.log('Search input not found');
    }

    // Step 7: Test Export CSV button
    console.log('Step 7: Testing Export CSV button...');

    // Clear search first
    if (searchInput) {
      await searchInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await delay(500);
    }

    const exportButton = await page.$('button:has-text("Export CSV")');
    if (!exportButton) {
      // Try finding by text content
      const buttons = await page.$$('button');
      let foundExport = false;
      for (const btn of buttons) {
        const text = await btn.evaluate(el => el.textContent);
        if (text && text.includes('Export')) {
          console.log('Found Export button with text:', text);
          foundExport = true;

          // Set up download handling
          const downloadPath = '/tmp';
          const client = await page.target().createCDPSession();
          await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath
          });

          await btn.click();
          await delay(2000);

          await page.screenshot({ path: '/tmp/feature66-5-export.png', fullPage: true });
          console.log('Screenshot saved: /tmp/feature66-5-export.png');

          // Check if CSV file was downloaded
          const files = fs.readdirSync(downloadPath).filter(f => f.endsWith('.csv') && f.startsWith('subscribers'));
          console.log('Downloaded CSV files:', files);

          if (files.length > 0) {
            const csvContent = fs.readFileSync(path.join(downloadPath, files[files.length - 1]), 'utf-8');
            console.log('CSV content preview:');
            console.log(csvContent.slice(0, 500));
          }
          break;
        }
      }
      if (!foundExport) {
        console.log('Export button not found');
      }
    }

    console.log('\n=== Feature 66 Test Complete ===');
    console.log('Screenshots saved to /tmp/feature66-*.png');

  } catch (error) {
    console.error('Test error:', error);
    await page.screenshot({ path: '/tmp/feature66-error.png', fullPage: true });
    console.log('Error screenshot saved');
  } finally {
    await browser.close();
  }
}

testSubscriberManagement();
