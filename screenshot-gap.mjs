import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://sudestchape.projets-3b6.workers.dev/');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  // Trouver tous les éléments dans la zone 895-935px
  const allEls = [...document.querySelectorAll('*')].filter(el => {
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY;
    return top >= 895 && top <= 935 && el.offsetHeight > 0;
  }).map(el => ({
    tag: el.tagName,
    class: el.className.slice(0, 80),
    top: Math.round((el.getBoundingClientRect().top + window.scrollY) * 10) / 10,
    marginTop: getComputedStyle(el).marginTop,
    paddingTop: getComputedStyle(el).paddingTop,
    display: getComputedStyle(el).display,
    position: getComputedStyle(el).position,
  }));
  
  // Tester main element  
  const main = document.querySelector('#main-content');
  const mainStyles = main ? {
    paddingTop: getComputedStyle(main).paddingTop,
    marginTop: getComputedStyle(main).marginTop,
    display: getComputedStyle(main).display,
  } : null;

  // Premier enfant de main
  const firstChild = main?.firstElementChild;
  const firstChildInfo = firstChild ? {
    tag: firstChild.tagName, class: firstChild.className.slice(0,80),
    marginTop: getComputedStyle(firstChild).marginTop,
    marginBottom: getComputedStyle(firstChild).marginBottom,
  } : null;
  
  // Dernier enfant de hero-wrapper
  const hw = document.querySelector('.hero-wrapper');
  const lastChild = hw?.lastElementChild;
  const lastChildInfo = lastChild ? {
    tag: lastChild.tagName, class: lastChild.className.slice(0,80),
    marginBottom: getComputedStyle(lastChild).marginBottom,
    paddingBottom: getComputedStyle(lastChild).paddingBottom,
    bottom: Math.round((lastChild.getBoundingClientRect().bottom + window.scrollY) * 10) / 10,
  } : null;

  return { allEls, mainStyles, firstChildInfo, lastChildInfo };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
