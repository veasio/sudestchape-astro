import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://sudestchape.projets-3b6.workers.dev/');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1500);
// Zone exacte de la jonction (y=880 à y=950)
await page.screenshot({ path: 'ss-junction-exact.png', clip: { x: 0, y: 880, width: 1440, height: 80 } });
await page.screenshot({ path: 'ss-topbar-now.png', clip: { x: 0, y: 0, width: 600, height: 55 } });
await browser.close();
console.log('OK');
