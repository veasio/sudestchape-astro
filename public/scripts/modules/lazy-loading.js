/**
 * Module Lazy Loading - sudestchape
 * Chargement différé des images et iframes via IntersectionObserver.
 * Fallback pour les navigateurs ne supportant pas l'API.
 *
 * Attributs HTML supportés :
 * - data-src        → src
 * - data-srcset     → srcset
 * - data-sizes      → sizes
 * - data-background → style.backgroundImage
 *
 * @module lazy-loading
 *
 * @example
 * <img data-src="/images/photo.webp"
 *      data-srcset="/images/photo-400.webp 400w, /images/photo-800.webp 800w"
 *      data-sizes="(max-width: 768px) 100vw, 50vw"
 *      alt="Description"
 *      class="lazy"
 *      width="800" height="600">
 *
 * <iframe data-src="https://www.youtube.com/embed/xxx"
 *         class="lazy"
 *         title="Vidéo"></iframe>
 */

/** @type {IntersectionObserver|null} */
let observer = null;

/** Classe CSS ajoutée sur les éléments en cours de chargement */
const LOADING_CLASS = 'lazy--loading';

/** Classe CSS ajoutée une fois chargé */
const LOADED_CLASS = 'lazy--loaded';

/** Sélecteur des éléments à lazy-loader */
const SELECTOR = '.lazy, [data-src], [data-srcset], [data-background]';

/**
 * Initialise le lazy loading.
 * Détecte le support IntersectionObserver et applique la stratégie adaptée.
 */
export function init() {
    const elements = document.querySelectorAll(SELECTOR);

    if (elements.length === 0) return;

    if ('IntersectionObserver' in window) {
        initObserver(elements);
    } else {
        // Fallback : tout charger immédiatement
        loadAllImmediately(elements);
    }
}

/**
 * Crée un IntersectionObserver et observe les éléments.
 *
 * @param {NodeListOf<Element>} elements - Éléments à observer
 */
function initObserver(elements) {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            rootMargin: '200px 0px',  // Charger 200px avant l'écran
            threshold: 0.01,
        }
    );

    elements.forEach((el) => observer.observe(el));
}

/**
 * Charge un élément unique : déplace data-* vers les attributs réels.
 *
 * @param {Element} el - Élément à charger
 */
function loadElement(el) {
    el.classList.add(LOADING_CLASS);

    const tagName = el.tagName.toLowerCase();

    // Image ou iframe
    if (tagName === 'img' || tagName === 'iframe' || tagName === 'video' || tagName === 'source') {
        if (el.dataset.src) {
            el.src = el.dataset.src;
            delete el.dataset.src;
        }

        if (el.dataset.srcset) {
            el.srcset = el.dataset.srcset;
            delete el.dataset.srcset;
        }

        if (el.dataset.sizes) {
            el.sizes = el.dataset.sizes;
            delete el.dataset.sizes;
        }

        // Écouter le chargement
        if (tagName === 'img') {
            el.addEventListener('load', () => handleLoaded(el), { once: true });
            el.addEventListener('error', () => handleError(el), { once: true });
        } else {
            handleLoaded(el);
        }
    }

    // Background image
    if (el.dataset.background) {
        el.style.backgroundImage = `url('${el.dataset.background}')`;
        delete el.dataset.background;
        handleLoaded(el);
    }

    // Éléments <picture> : charger les <source> enfants
    if (tagName === 'picture') {
        const sources = el.querySelectorAll('source[data-srcset]');
        sources.forEach((source) => {
            if (source.dataset.srcset) {
                source.srcset = source.dataset.srcset;
                delete source.dataset.srcset;
            }
        });

        const img = el.querySelector('img');
        if (img) loadElement(img);
    }
}

/**
 * Marque un élément comme chargé.
 *
 * @param {Element} el
 */
function handleLoaded(el) {
    el.classList.remove(LOADING_CLASS);
    el.classList.add(LOADED_CLASS);
}

/**
 * Gère une erreur de chargement d'image.
 *
 * @param {Element} el
 */
function handleError(el) {
    el.classList.remove(LOADING_CLASS);
    el.classList.add('lazy--error');
}

/**
 * Fallback : charge immédiatement tous les éléments.
 * Utilisé si IntersectionObserver n'est pas supporté.
 *
 * @param {NodeListOf<Element>} elements
 */
function loadAllImmediately(elements) {
    elements.forEach((el) => loadElement(el));
}

/**
 * Observe dynamiquement un nouvel élément ajouté au DOM.
 * Utile pour le contenu injecté par Mautic ou AJAX.
 *
 * @param {Element} el - Nouvel élément à observer
 */
export function observe(el) {
    if (observer) {
        observer.observe(el);
    } else {
        loadElement(el);
    }
}

/**
 * Détruit l'observer et libère les ressources.
 */
export function destroy() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}
