/**
 * Module Hero Slider - sudestchape
 * Carousel hero avec auto-play, flèches, dots, pause au hover/focus.
 * Accessibilité : ARIA carousel, prefers-reduced-motion.
 *
 * @module hero-slider
 */

const SELECTORS = {
    slider: '.hero-slider',
    slide: '.hero-slider__slide',
    prev: '.hero-slider__arrow--prev',
    next: '.hero-slider__arrow--next',
    dots: '.hero-slider__dots',
    dot: '.hero-slider__dot',
};

const AUTOPLAY_INTERVAL = 6000;

/** @type {HTMLElement|null} */
let sliderEl = null;

/** @type {NodeListOf<HTMLElement>} */
let slides = [];

/** @type {NodeListOf<HTMLElement>} */
let dots = [];

/** @type {number} */
let currentIndex = 0;

/** @type {number|null} */
let autoplayTimer = null;

/** @type {boolean} */
let isPaused = false;

/** @type {boolean} */
let prefersReducedMotion = false;

/**
 * Initialise le hero slider.
 */
export function init() {
    sliderEl = document.querySelector(SELECTORS.slider);
    if (!sliderEl) return;

    slides = sliderEl.querySelectorAll(SELECTORS.slide);
    dots = sliderEl.querySelectorAll(SELECTORS.dot);

    if (slides.length <= 1) return;

    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set initial state
    slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');
        if (i !== 0) slide.classList.remove('hero-slider__slide--active');
        else slide.classList.add('hero-slider__slide--active');
    });

    // Arrows
    const prevBtn = sliderEl.querySelector(SELECTORS.prev);
    const nextBtn = sliderEl.querySelector(SELECTORS.next);

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    // Pause on hover and focus
    sliderEl.addEventListener('mouseenter', pause);
    sliderEl.addEventListener('mouseleave', resume);
    sliderEl.addEventListener('focusin', pause);
    sliderEl.addEventListener('focusout', resume);

    // Keyboard
    sliderEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goTo(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(currentIndex + 1);
        }
    });

    // Touch swipe
    let touchStartX = 0;
    sliderEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
        }
    }, { passive: true });

    // Start autoplay
    if (!prefersReducedMotion) {
        startAutoplay();
    }
}

/**
 * Navigate to a specific slide.
 * @param {number} index
 */
function goTo(index) {
    const total = slides.length;
    const newIndex = ((index % total) + total) % total;

    if (newIndex === currentIndex) return;

    // Update slides
    slides[currentIndex].classList.remove('hero-slider__slide--active');
    slides[currentIndex].setAttribute('aria-hidden', 'true');

    slides[newIndex].classList.add('hero-slider__slide--active');
    slides[newIndex].setAttribute('aria-hidden', 'false');

    // Update dots
    if (dots.length) {
        dots[currentIndex].classList.remove('hero-slider__dot--active');
        dots[currentIndex].setAttribute('aria-selected', 'false');
        dots[newIndex].classList.add('hero-slider__dot--active');
        dots[newIndex].setAttribute('aria-selected', 'true');
    }

    currentIndex = newIndex;

    // Restart autoplay timer
    if (!isPaused && !prefersReducedMotion) {
        startAutoplay();
    }
}

function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
        goTo(currentIndex + 1);
    }, AUTOPLAY_INTERVAL);
}

function stopAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

function pause() {
    isPaused = true;
    stopAutoplay();
}

function resume() {
    isPaused = false;
    if (!prefersReducedMotion) {
        startAutoplay();
    }
}
