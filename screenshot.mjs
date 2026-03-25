import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://sudestchape.projets-3b6.workers.dev/');
await page.waitForTimeout(3000);

await page.screenshot({ path: 'screenshot-home-desktop.png', fullPage: true });

// Zoom sur la zone hero → section (jonction)
await page.screenshot({ path: 'screenshot-hero-section-junction.png', clip: { x: 0, y: 400, width: 1440, height: 400 } });

// Mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.reload();
await page.waitForTimeout(3000);
await page.screenshot({ path: 'screenshot-home-mobile.png', fullPage: true });

// Page services
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://sudestchape.projets-3b6.workers.dev/services/');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'screenshot-services-desktop.png', fullPage: true });

await browser.close();
console.log('Screenshots OK');
