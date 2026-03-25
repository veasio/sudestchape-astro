import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://sudestchape.projets-3b6.workers.dev/');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);

// Scroll progressif pour déclencher les animations
for (let i = 0; i <= 10; i++) {
  await page.evaluate((pct) => window.scrollTo(0, document.body.scrollHeight * pct / 10), i);
  await page.waitForTimeout(300);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

// Screenshot full page après scroll (animations déclenchées)
await page.screenshot({ path: 'screenshot-home-scrolled.png', fullPage: true });

// Capture spécifique : jonction hero / 1ere section
await page.screenshot({ path: 'screenshot-junction.png', clip: { x: 0, y: 550, width: 1440, height: 350 } });

// Services
await page.goto('https://sudestchape.projets-3b6.workers.dev/services/');
await page.waitForLoadState('networkidle');
for (let i = 0; i <= 8; i++) {
  await page.evaluate((pct) => window.scrollTo(0, document.body.scrollHeight * pct / 8), i);
  await page.waitForTimeout(300);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: 'screenshot-services-scrolled.png', fullPage: true });

// Capture jonction hero/section services
await page.screenshot({ path: 'screenshot-services-junction.png', clip: { x: 0, y: 350, width: 1440, height: 400 } });

await browser.close();
console.log('OK');
