import puppeteer from 'puppeteer';

const url = process.argv[2];
const out = process.argv[3];
const mode = process.argv[4] || 'full';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.evaluate(async () => {
  await new Promise((r) => {
    let y = 0;
    const step = () => {
      window.scrollBy(0, 600);
      y += 600;
      if (y < document.body.scrollHeight) setTimeout(step, 60);
      else { window.scrollTo(0, 0); setTimeout(r, 400); }
    };
    step();
  });
});
await new Promise((r) => setTimeout(r, 800));

if (mode === 'full') {
  await page.screenshot({ path: out, fullPage: true });
} else {
  // mode = "clipY:height" — capture a window of the full page
  const [yStr, hStr] = mode.split(':');
  const y = Number(yStr);
  const h = Number(hStr || 900);
  await page.screenshot({ path: out, clip: { x: 0, y, width: 1280, height: h }, captureBeyondViewport: true });
}
await browser.close();
console.log('saved', out);
