import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Analyser toute la chaîne d'éléments entre hero-wrapper et section
const analysis = await page.evaluate(() => {
    const results = {};

    // hero-wrapper
    const hw = document.querySelector('.hero-wrapper');
    const hwBox = hw.getBoundingClientRect();
    const hwCS = getComputedStyle(hw);
    results.heroWrapper = {
        top: Math.round(hwBox.top),
        bottom: Math.round(hwBox.bottom),
        height: Math.round(hwBox.height),
        marginBottom: hwCS.marginBottom,
        paddingBottom: hwCS.paddingBottom,
        borderRadius: hwCS.borderRadius,
        display: hwCS.display,
    };

    // Premier sibling après hero-wrapper
    const section = hw.nextElementSibling;
    const sBox = section.getBoundingClientRect();
    const sCS = getComputedStyle(section);
    results.firstSection = {
        tagName: section.tagName,
        className: section.className.substring(0, 80),
        top: Math.round(sBox.top * 10) / 10,  // plus précis
        marginTop: sCS.marginTop,
        paddingTop: sCS.paddingTop,
    };

    // <main>
    const main = document.querySelector('main');
    const mainBox = main.getBoundingClientRect();
    const mainCS = getComputedStyle(main);
    results.main = {
        top: Math.round(mainBox.top),
        display: mainCS.display,
        gap: mainCS.gap,
        padding: mainCS.padding,
        margin: mainCS.margin,
        flexDirection: mainCS.flexDirection,
        gridAutoRows: mainCS.gridAutoRows,
    };

    // body
    const bodyCS = getComputedStyle(document.body);
    results.body = {
        margin: bodyCS.margin,
        padding: bodyCS.padding,
    };

    // Gap sans margin : quelle serait la position naturelle ?
    // On calcule via offsetTop et offsetParent
    const sectionOffsetTop = section.offsetTop;
    const hwOffsetTop = hw.offsetTop;
    const hwOffsetHeight = hw.offsetHeight;
    results.offsets = {
        hwOffsetTop,
        hwOffsetHeight,
        hwNaturalBottom: hwOffsetTop + hwOffsetHeight,
        sectionOffsetTop,
        naturalGap: sectionOffsetTop - (hwOffsetTop + hwOffsetHeight),
    };

    // Vérifier si hero-wrapper a un ::after ou ::before
    const hwAfterCS = getComputedStyle(hw, '::after');
    results.heroWrapperAfter = {
        content: hwAfterCS.content,
        height: hwAfterCS.height,
        display: hwAfterCS.display,
    };

    // Vérifier le parent direct de hero-wrapper
    const hwParent = hw.parentElement;
    const hwParentCS = getComputedStyle(hwParent);
    results.hwParent = {
        tagName: hwParent.tagName,
        id: hwParent.id,
        className: hwParent.className.substring(0, 60),
        display: hwParentCS.display,
        gap: hwParentCS.gap,
        padding: hwParentCS.padding,
        flexDirection: hwParentCS.flexDirection,
    };

    // Taille réelle du hero-wrapper sans margin
    // En manipulant temporairement les marges
    const origSectionMargin = section.style.marginTop;
    section.style.marginTop = '0px';
    const sBoxNoMargin = section.getBoundingClientRect();
    results.sectionWithoutMargin = { top: Math.round(sBoxNoMargin.top * 10) / 10 };
    section.style.marginTop = origSectionMargin;

    return results;
});

console.log(JSON.stringify(analysis, null, 2));

await browser.close();
