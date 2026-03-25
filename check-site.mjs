import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://sudestchape.projets-3b6.workers.dev/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'ss-after-zindex.png', clip: { x: 0, y: 840, width: 1440, height: 60 } });
const el = await page.evaluate(() => {
  const rect = document.querySelector('#services').getBoundingClientRect();
  return document.elementFromPoint(window.innerWidth/2, rect.top + 5)?.className;
});
console.log('Element at junction:', el);
await browser.close();
