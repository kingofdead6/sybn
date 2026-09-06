import puppeteer from 'puppeteer';
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
const r = await p.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const slateEls = [...document.querySelectorAll('.bg-accent-slate')];
  return {
    tokenSlate: cs.getPropertyValue('--c-accent-slate').trim(),
    tokenGreen: cs.getPropertyValue('--c-accent-green').trim(),
    slateCount: slateEls.length,
    slateBg: slateEls.map(e => getComputedStyle(e).backgroundColor),
    slateH2: slateEls.map(e => { const h = e.querySelector('h2'); return h ? { text: h.textContent.trim().slice(0,40), color: getComputedStyle(h).color } : null; }),
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
