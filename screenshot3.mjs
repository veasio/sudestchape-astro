import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

// Home - scroll partiel puis capturer la jonction hero/section 1
await page.goto('https://sudestchape.projets-3b6.workers.dev/');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1500);
// Déclencher les animations
for (let y = 0; y <= 3000; y += 200) {
  await page.evaluate((sy) => window.scrollTo(0, sy), y);
  await page.waitForTimeout(100);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

// Viewport screenshot au chargement (ce que l'utilisateur voit)
await page.screenshot({ path: 'ss-viewport-load.png' });

// Faire défiler lentement et capturer la jonction
await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(400);
await page.screenshot({ path: 'ss-after-hero.png' });

await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(400);
await page.screenshot({ path: 'ss-sections-mid.png' });

// Inspecter les sections - obtenir leurs positions et backgrounds
const sectionsInfo = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.section, .hero-wrapper')).map(el => ({
    class: el.className.split(' ').filter(c => c.startsWith('section') || c.startsWith('hero')).join(' '),
    top: el.getBoundingClientRect().top + window.scrollY,
    height: el.offsetHeight,
    bg: window.getComputedStyle(el).backgroundColor,
    marginTop: window.getComputedStyle(el).marginTop,
    borderRadius: window.getComputedStyle(el).borderRadius,
  }));
});
console.log(JSON.stringify(sectionsInfo, null, 2));

await browser.close();
