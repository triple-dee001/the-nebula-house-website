const { chromium } = require('../../../backend/node_modules/playwright-core');

async function test() {
  console.log('Testing Playwright with Google Chrome...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setContent('<h1>Chapter Room Headless Test</h1>');
  const title = await page.textContent('h1');
  console.log('Page title rendered:', title);
  await browser.close();
  console.log('Playwright Chrome test succeeded!');
}

test().catch(err => {
  console.error('Playwright test failed:', err);
  process.exit(1);
});
