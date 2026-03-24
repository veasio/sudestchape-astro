/**
 * Module Testimonials Carousel - sudestchape
 * Carrousel de témoignages avec défilement automatique.
 * Respecte prefers-reduced-motion.
 *
 * @module testimonials-carousel
 */

const SELECTORS = {
    carousel: '.testimonials-carousel',
    track: '.testimonials-carousel__track',
    slide: '.testimonials-carousel__slide',
    prevBtn: '.testimonials-carousel__prev',
    nextBtn: '.testimonials-carousel__next',
    dots: '.testimonials-carousel__dots',
    dot: '.testimonials-carousel__dot',
};

const AUTO_PLAY_INTERVAL = 5000; // 5 secondes
const TRANSITION_DURATION = 500; // ms

/** @type {Map<HTMLElement, CarouselState>} */
const carousels = new Map();

/**
 * @typedef {Object} CarouselState
 * @property {number} currentIndex
 * @property {number} totalSlides
 * @property {number|null} autoPlayTimer
 * @property {boolean} isPaused
 * @property {HTMLElement[]} slides
 * @property {HTMLElement[]} dots
 */

/**
 * Initialise le module carrousel témoignages.
 */
export function init() {
    const carouselElements = document.querySelectorAll(SELECTORS.carousel);
    if (carouselElements.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    carouselElements.forEach(carousel => {
        initCarousel(carousel, prefersReducedMotion);
    });
}

/**
 * Initialise un carrousel individuel.
 * @param {HTMLElement} carousel
 * @param {boolean} prefersReducedMotion
 */
function initCarousel(carousel, prefersReducedMotion) {
    const track = carousel.querySelector(SELECTORS.track);
    const slides = Array.from(carousel.querySelectorAll(SELECTORS.slide));
    const prevBtn = carousel.querySelector(SELECTORS.prevBtn);
    const nextBtn = carousel.querySelector(SELECTORS.nextBtn);
    const dotsContainer = carousel.querySelector(SELECTORS.dots);

    if (!track || slides.length === 0) return;

    // Créer les dots
    const dots = createDots(dotsContainer, slides.length);

    // État initial
    const state = {
        currentIndex: 0,
        totalSlides: slides.length,
        autoPlayTimer: null,
        isPaused: false,
        slides,
        dots,
    };

    carousels.set(carousel, state);

    // Afficher le premier slide
    updateCarousel(carousel, state, false);

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToPrev(carousel, state);
            resetAutoPlay(carousel, state, prefersReducedMotion);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToNext(carousel, state);
            resetAutoPlay(carousel, state, prefersReducedMotion);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(carousel, state, index);
            resetAutoPlay(carousel, state, prefersReducedMotion);
        });
    });

    // Pause au hover/focus
    carousel.addEventListener('mouseenter', () => {
        state.isPaused = true;
        stopAutoPlay(state);
    });

    carousel.addEventListener('mouseleave', () => {
        state.isPaused = false;
        if (!prefersReducedMotion) {
            startAutoPlay(carousel, state);
        }
    });

    carousel.addEventListener('focusin', () => {
        state.isPaused = true;
        stopAutoPlay(state);
    });

    carousel.addEventListener('focusout', (e) => {
        if (!carousel.contains(e.relatedTarget)) {
            state.isPaused = false;
            if (!prefersReducedMotion) {
                startAutoPlay(carousel, state);
            }
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(carousel, state, touchStartX, touchEndX, prefersReducedMotion);
    }, { passive: true });

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrev(carousel, state);
            resetAutoPlay(carousel, state, prefersReducedMotion);
        } else if (e.key === 'ArrowRight') {
            goToNext(carousel, state);
            resetAutoPlay(carousel, state, prefersReducedMotion);
        }
    });

    // Démarrer l'autoplay si pas de reduced motion
    if (!prefersReducedMotion) {
        startAutoPlay(carousel, state);
    }
}

/**
 * Crée les indicateurs (dots).
 * @param {HTMLElement|null} container
 * @param {number} count
 * @returns {HTMLElement[]}
 */
function createDots(container, count) {
    if (!container) return [];

    container.innerHTML = '';
    const dots = [];

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials-carousel__dot';
        dot.setAttribute('aria-label', `Aller au témoignage ${i + 1}`);
        dot.setAttribute('type', 'button');
        container.appendChild(dot);
        dots.push(dot);
    }

    return dots;
}

/**
 * Met à jour l'affichage du carrousel.
 * @param {HTMLElement} carousel
 * @param {CarouselState} state
 * @param {boolean} animate
 */
function updateCarousel(carousel, state, animate = true) {
    const { currentIndex, slides, dots } = state;

    // Mettre à jour les slides
    slides.forEach((slide, index) => {
        const isActive = index === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', !isActive);

        if (animate) {
            slide.style.transition = `opacity ${TRANSITION_DURATION}ms ease, transform ${TRANSITION_DURATION}ms ease`;
        } else {
            slide.style.transition = 'none';
        }
    });

    // Mettre à jour les dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === currentIndex);
        dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
    });

    // Annoncer pour les lecteurs d'écran
    const liveRegion = carousel.querySelector('.testimonials-carousel__live');
    if (liveRegion) {
        liveRegion.textContent = `Témoignage ${currentIndex + 1} sur ${state.totalSlides}`;
    }
}

/**
 * Va au slide suivant.
 * @param {HTMLElement} carousel
 * @param {CarouselState} state
 */
function goToNext(carousel, state) {
    state.currentIndex = (state.currentIndex + 1) % state.totalSlides;
    updateCarousel(carousel, state);
}

/**
 * Va au slide précédent.
 * @param {HTMLElement} carousel
 * @param {CarouselState} state
 */
function goToPrev(carousel, state) {
    state.currentIndex = (state.currentIndex - 1 + state.totalSlides) % state.totalSlides;
    updateCarousel(carousel, state);
}

/**
 * Va à un slide spécifique.
 * @param {HTMLElement} carousel
 * @param {CarouselState} state
 * @param {number} index
 */
function goToSlide(carousel, state, index) {
    state.currentIndex = index;
    updateCarousel(carousel, state);
}

/**
 * Gère le swipe tactile.
 * @param {HTMLElement} carousel
 * @param {CarouselState} state
 * @param {number} startX
 * @param {number} endX
 * @param {boolean} prefersReducedMotion
 */
function handleSwipe(carousel, state, startX, endX, prefersReducedMotion) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            goToNext(carousel, state);
        } else {
            goToPrev(carousel, state);
        }
        resetAutoPlay(carousel, state, prefersReducedMotion);
    }
}

/**
 * Démarre l'autoplay.
 * @param {HTMLElement} carousel
 * @param {CarouselState} state
 */
function startAutoPlay(carousel, state) {
    if (state.autoPlayTimer) return;

    state.autoPlayTimer = setInterval(() => {
        if (!state.isPaused) {
            goToNext(carousel, state);
        }
    }, AUTO_PLAY_INTERVAL);
}

/**
 * Arrête l'autoplay.
 * @param {CarouselState} state
 */
function stopAutoPlay(state) {
    if (state.autoPlayTimer) {
        clearInterval(state.autoPlayTimer);
        state.autoPlayTimer = null;
    }
}

/**
 * Reset l'autoplay.
 * @param {HTMLElement} carousel
 * @param {CarouselState} state
 * @param {boolean} prefersReducedMotion
 */
function resetAutoPlay(carousel, state, prefersReducedMotion) {
    stopAutoPlay(state);
    if (!prefersReducedMotion && !state.isPaused) {
        startAutoPlay(carousel, state);
    }
}
