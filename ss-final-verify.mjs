import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Screenshots ciblés
const heroWrapper = await page.$('.hero-wrapper');
const heroBox = await heroWrapper.boundingBox();

// Top du hero
await page.screenshot({ path: 'ss-final-top.png', clip: { x: 0, y: 100, width: 1440, height: 200 } });

// Jonction bas hero / section
await page.screenshot({ path: 'ss-final-junction.png', clip: { x: 0, y: heroBox.y + heroBox.height - 40, width: 1440, height: 100 } });

// Vue complète hero + début section
await page.screenshot({ path: 'ss-final-full.png', clip: { x: 0, y: 100, width: 1440, height: heroBox.height + 80 } });

const sectionInfo = await page.evaluate(() => {
    const hw = document.querySelector('.hero-wrapper');
    const section = hw.nextElementSibling;
    const hwBox = hw.getBoundingClientRect();
    const sBox = section.getBoundingClientRect();
    const cs = getComputedStyle(section);
    return {
        hwBottom: Math.round(hwBox.bottom * 10) / 10,
        sectionTop: Math.round(sBox.top * 10) / 10,
        overlap: Math.round((hwBox.bottom - sBox.top) * 10) / 10,
        sectionMarginTop: cs.marginTop,
        hwBorderRadius: getComputedStyle(hw).borderRadius,
        sectionBorderRadius: cs.borderRadius,
    };
});
console.log(JSON.stringify(sectionInfo, null, 2));

await browser.close();
