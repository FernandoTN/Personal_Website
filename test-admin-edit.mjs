import puppeteer from 'puppeteer';
const delay = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('1. Navigate to admin...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  console.log('URL:', page.url());

  console.log('2. Check if login page...');
  const isLoginPage = page.url().includes('login');
  console.log('Is login page:', isLoginPage);

  if (isLoginPage) {
    console.log('3. Filling login form...');
    await page.type('input[type="email"]', 'admin@fernandotorres.dev');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await delay(3000);
    console.log('After login URL:', page.url());
  }

  console.log('4. Navigate to blog admin...');
  await page.goto('http://localhost:3000/admin/blog', { waitUntil: 'networkidle0' });
  await delay(2000);
  console.log('Blog admin URL:', page.url());

  const content = await page.content();
  console.log('Has table:', content.includes('<table'));
  console.log('Has posts:', content.includes('/edit'));

  await page.screenshot({ path: '/Users/fernandotn/Projects/PersonalWebsite/test-screenshots/admin-blog.png' });

  // Find edit links
  const editLinks = await page.$$eval('a[href*="/edit"]', links => links.map(l => l.href));
  console.log('Edit links found:', editLinks.length);
  if (editLinks.length > 0) console.log('First edit link:', editLinks[0]);

  // Click first edit link if found
  if (editLinks.length > 0) {
    console.log('5. Clicking first edit link...');
    await page.goto(editLinks[0], { waitUntil: 'networkidle0' });
    await delay(2000);
    console.log('Edit page URL:', page.url());
    await page.screenshot({ path: '/Users/fernandotn/Projects/PersonalWebsite/test-screenshots/admin-edit.png' });

    // Check form fields
    const titleValue = await page.$eval('input#title', el => el.value).catch(() => '');
    console.log('Title value:', titleValue.substring(0, 50));

    const slugValue = await page.$eval('input#slug', el => el.value).catch(() => '');
    console.log('Slug value:', slugValue);

    const contentValue = await page.$eval('textarea#content', el => el.value.substring(0, 100)).catch(() => '');
    console.log('Content preview:', contentValue.substring(0, 50));
  }

  await browser.close();
  console.log('Test complete!');
})();
