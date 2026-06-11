const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', error => console.log('PAGE ERROR STACK:', error.stack));
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
  await browser.close();
})();
