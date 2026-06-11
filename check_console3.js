const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('ERROR:', msg.text());
      msg.args().forEach(async (arg) => {
        console.log(await arg.jsonValue());
      });
    }
  });
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
  await browser.close();
})();
