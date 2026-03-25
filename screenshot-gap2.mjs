import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://sudestchape.projets-3b6.workers.dev/');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  // Trouver tous les enfants directs de #main-content
  const main = document.querySelector('#main-content');
  const children = [...main.children].map(el => {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      class: el.className.slice(0, 60),
      top: Math.round((rect.top + scrollY) * 10) / 10,
      bottom: Math.round((rect.bottom + scrollY) * 10) / 10,
      height: el.offsetHeight,
      marginTop: cs.marginTop,
      marginBottom: cs.marginBottom,
    };
  });
  
  // Vérifier les propriétés CSS computed de hero-wrapper (pas juste les inline)
  const hw = document.querySelector('.hero-wrapper');
  const hwRect = hw.getBoundingClientRect();
  const hwCS = getComputedStyle(hw);
  const hwInfo = {
    top: Math.round((hwRect.top + scrollY) * 10) / 10,
    bottom: Math.round((hwRect.bottom + scrollY) * 10) / 10,
    height: hw.offsetHeight,
    paddingBottom: hwCS.paddingBottom,
    marginBottom: hwCS.marginBottom,
    display: hwCS.display,
  };

  // Hero slider itself
  const slider = document.querySelector('.hero-slider');
  const sliderRect = slider.getBoundingClientRect();
  const sliderCS = getComputedStyle(slider);
  return {
    mainChildren: children,
    heroWrapper: hwInfo,
    heroSlider: {
      bottom: Math.round((sliderRect.bottom + scrollY) * 10) / 10,
      height: slider.offsetHeight,
      marginBottom: sliderCS.marginBottom,
    }
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
