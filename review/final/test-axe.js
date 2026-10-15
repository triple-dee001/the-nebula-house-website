const { chromium } = require('../../../backend/node_modules/playwright-core');
const AxeBuilder = require('../../../backend/node_modules/@axe-core/playwright').default;

async function testAxe() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setContent('<html lang="en"><head><title>Test</title></head><body><main><h1>Hello</h1><button>Click</button></main></body></html>');
  const results = await new AxeBuilder({ page }).analyze();
  console.log('Axe violations count on dummy page:', results.violations.length);
  await browser.close();
  console.log('Axe-core test succeeded!');
}

testAxe().catch(err => {
  console.error('Axe test failed:', err);
  process.exit(1);
});
