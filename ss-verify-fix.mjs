import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// 1. Top du hero : coins arrondis
await page.screenshot({ path: 'ss-fix-hero-top.png', clip: { x: 0, y: 0, width: 1440, height: 260 } });

// 2. Jonction bas hero / section services
const heroWrapper = await page.$('.hero-wrapper');
const heroBox = await heroWrapper.boundingBox();
const junctionY = heroBox.y + heroBox.height - 80;
await page.screenshot({ path: 'ss-fix-junction.png', clip: { x: 0, y: Math.max(0, junctionY), width: 1440, height: 160 } });

// 3. Vue globale hero + section
await page.screenshot({ path: 'ss-fix-full.png', clip: { x: 0, y: 0, width: 1440, height: heroBox.height + 120 } });

// Styles calculés
const wrapperStyles = await page.evaluate(() => {
    const el = document.querySelector('.hero-wrapper');
    const cs = getComputedStyle(el);
    return {
        background: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        overflow: cs.overflow,
        marginBottom: cs.marginBottom,
    };
});
console.log('hero-wrapper styles:', JSON.stringify(wrapperStyles));

const heroFullStyles = await page.evaluate(() => {
    const el = document.querySelector('.hero--full');
    const cs = getComputedStyle(el);
    return { borderRadius: cs.borderRadius, overflow: cs.overflow };
});
console.log('hero--full styles:', JSON.stringify(heroFullStyles));

const sectionStyles = await page.evaluate(() => {
    const main = document.querySelector('main');
    const section = Array.from(main.children).find(c => !c.classList.contains('hero-wrapper'));
    if (!section) return null;
    const cs = getComputedStyle(section);
    const box = section.getBoundingClientRect();
    return {
        borderRadius: cs.borderRadius,
        marginTop: cs.marginTop,
        backgroundColor: cs.backgroundColor,
        visualTop: Math.round(box.top),
    };
});
console.log('first section styles:', JSON.stringify(sectionStyles));

const heroBottom = Math.round(heroBox.y + heroBox.height);
console.log('hero-wrapper bottom y:', heroBottom);
console.log('section visual top y:', sectionStyles?.visualTop);
console.log('overlap (should equal border-radius ~21.6px):', heroBottom - (sectionStyles?.visualTop ?? 0));

// Mobile 375px
await page.setViewportSize({ width: 375, height: 812 });
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const heroWrapperMob = await page.$('.hero-wrapper');
const heroBoxMob = await heroWrapperMob.boundingBox();
await page.screenshot({ path: 'ss-fix-mobile.png', clip: { x: 0, y: 0, width: 375, height: heroBoxMob.height + 100 } });

await browser.close();
console.log('Done. Check screenshots: ss-fix-hero-top.png, ss-fix-junction.png, ss-fix-full.png, ss-fix-mobile.png');
