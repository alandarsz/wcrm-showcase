const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', async msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(msg.type().toUpperCase() + ':', msg.text());
      const args = msg.args();
      for (let i = 0; i < args.length; i++) {
        try {
          const val = await args[i].executionContext().evaluate(obj => {
            if (obj instanceof Error) return obj.stack;
            return typeof obj === 'object' ? JSON.stringify(obj) : obj;
          }, args[i]);
          console.log(`ARG ${i}:`, val);
        } catch(e) {}
      }
    }
  });

  await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
  await browser.close();
})();
