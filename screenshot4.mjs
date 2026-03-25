import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

const scrollAndCapture = async (url, name) => {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  for (let y = 0; y <= 5000; y += 300) {
    await page.evaluate(sy => window.scrollTo(0, sy), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `ss-${name}-full.png`, fullPage: true });
  // Jonction hero → 1ère section
  await page.screenshot({ path: `ss-${name}-junction.png`, clip: { x: 0, y: 550, width: 1440, height: 400 } });
};

const base = 'https://sudestchape.projets-3b6.workers.dev';
await scrollAndCapture(`${base}/`, 'home');
await scrollAndCapture(`${base}/services/`, 'services');
await scrollAndCapture(`${base}/a-propos/`, 'apropos');
await scrollAndCapture(`${base}/contact/`, 'contact');
await scrollAndCapture(`${base}/realisations/`, 'realisations');

// Inspecter les données du hero home
await page.goto(`${base}/`);
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const hw = document.querySelector('.hero-wrapper');
  const s1 = document.querySelector('.section--rounded');
  return {
    heroWrapper: hw ? { class: hw.className, bg: getComputedStyle(hw).background, height: hw.offsetHeight } : null,
    firstSection: s1 ? { class: s1.className, bg: getComputedStyle(s1).backgroundColor, marginTop: getComputedStyle(s1).marginTop, top: s1.getBoundingClientRect().top } : null,
  };
});
console.log(JSON.stringify(info, null, 2));

await browser.close();
console.log('OK');
