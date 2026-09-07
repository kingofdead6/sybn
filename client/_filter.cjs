const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await p.setViewport({ width: 1440, height: 1000 });
  p.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));
  await p.goto('http://localhost:5173/store', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1300));

  const btns = await p.$$('button[aria-pressed]');
  console.log('facet buttons:', btns.length);
  const pressed = () =>
    p.evaluate(() =>
      [...document.querySelectorAll('button[aria-pressed="true"]')].map((b) => b.textContent.trim())
    );
  console.log('pressed before:', await pressed());

  await btns[2].click();
  await new Promise((r) => setTimeout(r, 900));
  console.log('url after click:', p.url());
  console.log('pressed after :', await pressed());

  await p.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));
  console.log('pressed after reload:', await pressed());
  await b.close();
})();
