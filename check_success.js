const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  let hasError = false;
  page.on('console', msg => {
    if (msg.type() === 'error') {
      hasError = true;
      console.log('STILL_ERROR:', msg.text());
    }
  });

  await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
  
  const bodyContent = await page.evaluate(() => document.body.innerText);
  console.log("PAGE LOADED WITH TEXT LENGTH:", bodyContent.length);
  console.log("FIRST 100 CHARS:", bodyContent.substring(0, 100).replace(/\n/g, ' '));
  
  await browser.close();
})();
