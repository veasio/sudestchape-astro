import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://sudestchape.projets-3b6.workers.dev/');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1500);

await page.screenshot({ path: 'ss-home-full.png', fullPage: true });
await page.screenshot({ path: 'ss-topbar.png', clip: { x: 0, y: 0, width: 1440, height: 60 } });
await page.screenshot({ path: 'ss-hero-junction.png', clip: { x: 0, y: 500, width: 1440, height: 400 } });

const info = await page.evaluate(() => {
  const getStyle = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      bg: cs.backgroundColor,
      color: cs.color,
      borderRadius: cs.borderRadius,
      marginTop: cs.marginTop,
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      height: el.offsetHeight,
    };
  };
  return {
    topbar: getStyle('.top-bar') || getStyle('.topbar') || getStyle('[class*="top-bar"]'),
    heroWrapper: getStyle('.hero-wrapper'),
    hero: getStyle('.hero'),
    firstSection: getStyle('.section--rounded'),
    body: { bg: getComputedStyle(document.body).backgroundColor },
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
