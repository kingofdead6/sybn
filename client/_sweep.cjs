const puppeteer = require('puppeteer');
const PAGES = ['/store', '/about', '/worldwide'];
const WIDTHS = [375, 768, 1024, 1440, 1920];

(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  for (const theme of ['light', 'dark']) {
    for (const path of PAGES) {
      for (const w of WIDTHS) {
        const p = await b.newPage();
        let err = null;
        p.on('pageerror', (e) => { err = e.message; });
        await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
        await p.setViewport({ width: w, height: 900 });
        await p.goto('http://localhost:5173' + path, { waitUntil: 'networkidle0', timeout: 60000 });
        await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
        await new Promise((r) => setTimeout(r, 900));
        await p.evaluate(async () => {
          await new Promise((res) => { let y = 0; const t = setInterval(() => { y += 500; window.scrollTo(0, y);
            if (y >= document.body.scrollHeight) { clearInterval(t); res(); } }, 60); });
        });
        await new Promise((r) => setTimeout(r, 1100));
        const r = await p.evaluate((vw) => {
          const bad = [];
          document.querySelectorAll('*').forEach((el) => {
            const b = el.getBoundingClientRect(); if (b.width === 0) return;
            if (b.right > vw + 1 || b.left < -1) {
              const c = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString();
              if (!c.includes('skip-link')) bad.push(c.slice(0, 40));
            }
          });
          let faded = 0;
          document.querySelectorAll('section *').forEach((el) => {
            if (el.getBoundingClientRect().width > 0 && +getComputedStyle(el).opacity < 0.99) faded++;
          });
          return { docW: document.documentElement.scrollWidth, vw, bad: bad.slice(0, 2), faded };
        }, w);
        const ok = r.docW <= r.vw && r.bad.length === 0 && r.faded === 0 && !err;
        console.log(`${ok ? 'OK  ' : 'FAIL'} ${theme.padEnd(5)} ${path.padEnd(11)} ${String(w).padEnd(5)}` +
          (ok ? '' : ` docW=${r.docW} bad=${JSON.stringify(r.bad)} faded=${r.faded}${err ? ' ERR=' + err : ''}`));
        await p.close();
      }
    }
  }
  await b.close();
})();
