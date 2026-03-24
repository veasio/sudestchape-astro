/**
 * Application JavaScript - sudestchape
 * ======================================
 * Point d'entrée principal. Chargé en defer dans le layout.
 * Importe et initialise tous les modules.
 *
 * Architecture :
 * - modules/navigation.js  → Menu mobile, sticky header, smooth scroll
 * - modules/lazy-loading.js → Lazy load images & iframes
 * - modules/forms.js        → Validation, ARIA, UTM injection
 * - modules/analytics.js    → Helpers tracking (Mautic + GA4)
 *
 * Note : mautic-tracking.js est chargé séparément (IIFE autonome).
 */

import { init as initNavigation } from './modules/navigation.js';
import { init as initLazyLoading } from './modules/lazy-loading.js';
import { init as initForms } from './modules/forms.js';
import { init as initScrollAnimations } from './modules/scroll-animations.js';
import { init as initHeroSlider } from './modules/hero-slider.js';
import { init as initStatsCounter } from './modules/stats-counter.js';
import { init as initTestimonialsCarousel } from './modules/testimonials-carousel.js';
import { init as initSocialTracking } from './modules/social-tracking.js';
import { initPromoCarousel } from './modules/promo-carousel.js';
import { initRealisationsFeed } from './modules/realisations-feed.js';

/**
 * Calcule et définit la hauteur réelle du viewport (--vh).
 * Utile pour les navigateurs mobiles qui n'ont pas de support pour dvh.
 * La valeur correspond à 1% de la hauteur visible réelle.
 */
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Initialise l'application.
 * Chaque module est initialisé indépendamment avec gestion d'erreur
 * pour éviter qu'un module en erreur bloque les autres.
 */
function init() {
    // Marquer que JS est activé et fonctionne (pour les animations CSS)
    document.documentElement.classList.add('js-enabled');

    // Définir la hauteur du viewport pour les navigateurs sans support dvh
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    const modules = [
        { name: 'navigation', fn: initNavigation },
        { name: 'lazy-loading', fn: initLazyLoading },
        { name: 'forms', fn: initForms },
        { name: 'scroll-animations', fn: initScrollAnimations },
        { name: 'hero-slider', fn: initHeroSlider },
        { name: 'stats-counter', fn: initStatsCounter },
        { name: 'testimonials-carousel', fn: initTestimonialsCarousel },
        { name: 'social-tracking', fn: initSocialTracking },
        { name: 'promo-carousel', fn: initPromoCarousel },
        { name: 'realisations-feed', fn: initRealisationsFeed },
    ];

    modules.forEach(({ name, fn }) => {
        try {
            fn();
        } catch (error) {
            console.error(`[sudestchape] Erreur initialisation module "${name}":`, error);
        }
    });
}

// Lancer au DOMContentLoaded ou immédiatement si déjà prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
