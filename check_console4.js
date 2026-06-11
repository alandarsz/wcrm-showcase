const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Tangkap error langsung dari window.onerror dan window.addEventListener('error')
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('error', e => {
      console.log('BROWSER_ERROR_EVENT:', e.message, e.filename, e.lineno, e.colno);
    });
    window.addEventListener('unhandledrejection', e => {
      console.log('UNHANDLED_REJECTION:', e.reason);
    });
  });

  page.on('console', msg => {
    if(msg.text().includes('BROWSER_ERROR') || msg.text().includes('UNHANDLED')) {
      console.log(msg.text());
    } else if (msg.type() === 'error') {
      console.log('CON_ERROR:', msg.text());
    }
  });

  await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
  await browser.close();
})();
