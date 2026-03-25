import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Desktop 1440
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Screenshot complet du haut de page (hero top)
await page.screenshot({ path: 'ss-inv-hero-top.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });

// Screenshot de la jonction bas hero / haut section
const heroWrapper = await page.$('.hero-wrapper');
const heroBox = await heroWrapper.boundingBox();
const sectionEl = await page.$('main > .section, main > section, main > div:not(.hero-wrapper)');
const sectionBox = sectionEl ? await sectionEl.boundingBox() : null;

console.log('Hero wrapper box:', JSON.stringify(heroBox));
console.log('First section after hero box:', JSON.stringify(sectionBox));

// Zone de jonction : 60px avant/après la limite hero-wrapper/section
const junctionY = heroBox.y + heroBox.height - 80;
await page.screenshot({ path: 'ss-inv-junction.png', clip: { x: 0, y: Math.max(0, junctionY), width: 1440, height: 160 } });

// Screenshot de toute la zone hero
await page.screenshot({ path: 'ss-inv-hero-full.png', clip: { x: 0, y: 0, width: 1440, height: heroBox.height + 100 } });

// Computed styles sur les éléments clés
const heroWrapperStyles = await page.evaluate(() => {
  const el = document.querySelector('.hero-wrapper');
  const cs = getComputedStyle(el);
  return {
    background: cs.background,
    backgroundColor: cs.backgroundColor,
    overflow: cs.overflow,
    marginBottom: cs.marginBottom,
    borderRadius: cs.borderRadius,
    height: cs.height,
    padding: cs.padding,
  };
});
console.log('hero-wrapper computed:', JSON.stringify(heroWrapperStyles, null, 2));

const heroFullStyles = await page.evaluate(() => {
  const el = document.querySelector('.hero--full');
  if (!el) return null;
  const cs = getComputedStyle(el);
  return {
    borderRadius: cs.borderRadius,
    overflow: cs.overflow,
    height: cs.height,
    marginBottom: cs.marginBottom,
  };
});
console.log('hero--full computed:', JSON.stringify(heroFullStyles, null, 2));

// Premier enfant de main qui N'EST PAS hero-wrapper
const firstSectionStyles = await page.evaluate(() => {
  const main = document.querySelector('main');
  const children = Array.from(main.children);
  const afterHero = children.find(c => !c.classList.contains('hero-wrapper'));
  if (!afterHero) return null;
  const cs = getComputedStyle(afterHero);
  return {
    tagName: afterHero.tagName,
    className: afterHero.className.substring(0, 100),
    borderRadius: cs.borderRadius,
    marginTop: cs.marginTop,
    paddingTop: cs.paddingTop,
    backgroundColor: cs.backgroundColor,
    position: cs.position,
    zIndex: cs.zIndex,
    boundingBox: afterHero.getBoundingClientRect().top,
  };
});
console.log('First section after hero:', JSON.stringify(firstSectionStyles, null, 2));

// Layout de <main>
const mainStyles = await page.evaluate(() => {
  const el = document.querySelector('main');
  const cs = getComputedStyle(el);
  return {
    display: cs.display,
    flexDirection: cs.flexDirection,
    gap: cs.gap,
    padding: cs.padding,
    margin: cs.margin,
  };
});
console.log('main computed:', JSON.stringify(mainStyles, null, 2));

// Mobile 375
await page.setViewportSize({ width: 375, height: 812 });
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const heroWrapperMobile = await page.$('.hero-wrapper');
const heroBoxMobile = await heroWrapperMobile.boundingBox();
const clipY = Math.max(0, heroBoxMobile.y + heroBoxMobile.height - 80);
await page.screenshot({ path: 'ss-inv-mobile-junction.png', clip: { x: 0, y: clipY, width: 375, height: 140 } });
console.log('Mobile hero-wrapper box:', JSON.stringify(heroBoxMobile));

await browser.close();
