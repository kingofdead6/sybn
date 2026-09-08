const puppeteer = require('puppeteer');

/* The dev client points at the deployed API, which CORS-blocks localhost, so
   the nav renders empty here. Stub the endpoints to exercise the real length. */
const PROGRAMS = [
  'أوجد فكرة عمل ناجح', 'إبدأ أعمالك', 'حسن تسيير أعمالك IYB', 'وسع أعمالك EYB',
  'رقمن أعمالك DYB', 'قد برامج التنمية بخبرتك', 'إعداد مدربين ومستشارين TOT',
  'ضع مهاراتك في خدمة الشركات PTOT', 'طور غيرك SPTOT',
].map((ar, i) => ({ slug: `p${i}`, code: `P${i}`, title: { ar, en: `Program ${i + 1}` } }));

const CATEGORIES = [
  'الإدارة العامة و الحديثة', 'التخصصات', 'الجودة و التميز المؤسسي',
  'الريادة و الذكاء الاصطناعي', 'تنمية المهارات البشرية', 'التربية و التعليم',
].map((ar, i) => ({ slug: `c${i}`, title: { ar, en: `Category ${i + 1}` } }));

const STORE = {
  categories: ['كتب نادرة', 'براءات اختراع', 'طاقات بشرية', 'منتجات مميزة', 'تحف فنية', 'منوعات']
    .map((ar, i) => ({ ar, en: `Dept ${i + 1}` })),
};

const BRAND = { guidePdf: 'https://example.com/guide.pdf', phone: '+213 699 067 381' };

(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.setRequestInterception(true);
  p.on('request', (req) => {
    const u = req.url();
    const CORS = {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    };
    if (req.method() === 'OPTIONS') return req.respond({ status: 204, headers: CORS, body: '' });
    const json = (body) => req.respond({
      status: 200, contentType: 'application/json', headers: CORS,
      body: JSON.stringify({ success: true, data: body, error: null }),
    });
    if (u.includes('/api/v1/programs')) return json(PROGRAMS);
    if (u.includes('/api/v1/categories')) return json(CATEGORIES);
    if (u.includes('/api/v1/settings/store.content')) return json(STORE);
    if (u.includes('/api/v1/settings/brand')) return json(BRAND);
    if (u.includes('/api/v1/')) return json(null);
    return req.continue();
  });

  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2200));

  await p.click('header button[aria-controls="mobile-nav"]');
  await new Promise((r) => setTimeout(r, 500));

  const FIND = `() => [...document.querySelectorAll('header nav[aria-label="Primary"]')]
    .find((n) => n.getBoundingClientRect().height > 0)`;

  const collapsed = await p.evaluate((f) => {
    const nav = eval(f)();
    const r = nav.getBoundingClientRect();
    const tappable = [...nav.querySelectorAll('a,button')];
    return {
      visibleRows: tappable.length,
      groups: [...nav.querySelectorAll('button[aria-expanded]')].map((b) => b.textContent.trim().replace(/\s+/g, ' ')),
      navHeight: Math.round(r.height),
      fitsViewport: r.bottom <= window.innerHeight + 1,
      needsScroll: nav.scrollHeight > nav.clientHeight,
      under44: tappable.filter((e) => e.getBoundingClientRect().height < 44).length,
      smallOnes: tappable.filter((e) => e.getBoundingClientRect().height < 44)
        .map((e) => ({ t: e.textContent.trim().slice(0, 14), h: Math.round(e.getBoundingClientRect().height) })),
    };
  }, FIND);
  console.log('collapsed:', JSON.stringify(collapsed, null, 1));

  await p.screenshot({ path: process.env.OUT_COLLAPSED });

  // Expand the first group and confirm it reveals its items.
  await p.evaluate((f) => eval(f)().querySelector('button[aria-expanded]').click(), FIND);
  await new Promise((r) => setTimeout(r, 400));
  console.log('after expand:', JSON.stringify(await p.evaluate((f) => {
    const nav = eval(f)();
    return {
      visibleRows: nav.querySelectorAll('a,button').length,
      needsScroll: nav.scrollHeight > nav.clientHeight,
      under44: [...nav.querySelectorAll('a,button')].filter((e) => e.getBoundingClientRect().height < 44).length,
    };
  }, FIND)));

  await p.screenshot({ path: process.env.OUT_EXPANDED });
  await b.close();
})();
