/**
 * Module Stats Counter - sudestchape
 * Animation de comptage des chiffres clés au scroll.
 * Respecte prefers-reduced-motion.
 * Sur mobile (< 768px), pas d'animation pour garantir la visibilité.
 *
 * @module stats-counter
 */

const SELECTORS = {
    section: '.stats',
    item: '.stats__item',
    value: '.stats__value[data-count]',
};

const ANIMATION_DURATION = 2000; // ms
const MOBILE_BREAKPOINT = 768; // px

/** @type {boolean} */
let prefersReducedMotion = false;

/** @type {boolean} */
let isMobile = false;

/** @type {IntersectionObserver|null} */
let observer = null;

/**
 * Vérifie si on est sur mobile.
 * @returns {boolean}
 */
function checkMobile() {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

/**
 * Vérifie si un élément est dans le viewport.
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}

/**
 * Initialise le module de compteurs animés.
 */
export function init() {
    const sections = document.querySelectorAll(SELECTORS.section);
    if (sections.length === 0) return;

    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isMobile = checkMobile();

    // Avec reduced motion uniquement : afficher les valeurs finales directement
    if (prefersReducedMotion) {
        sections.forEach(section => {
            showFinalValues(section);
            section.querySelectorAll(SELECTORS.item).forEach(item => {
                item.classList.add('is-visible');
            });
        });
        return;
    }

    // Animation au scroll (mobile ET desktop)
    observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
    });

    sections.forEach(section => {
        // Ajouter la classe pour préparer les animations CSS
        section.classList.add('stats--animated');

        // Sécurité : forcer la visibilité après 5 secondes si l'animation n'a pas démarré
        const safetyTimeout = setTimeout(() => {
            const items = section.querySelectorAll(SELECTORS.item);
            items.forEach(item => {
                if (!item.classList.contains('is-visible')) {
                    item.classList.add('is-visible');
                    // Afficher les valeurs finales
                    const valueEl = item.querySelector(SELECTORS.value);
                    if (valueEl && valueEl.dataset.count) {
                        const target = parseInt(valueEl.dataset.count, 10);
                        const suffix = valueEl.dataset.suffix || '';
                        valueEl.textContent = formatNumber(target);
                        if (suffix) {
                            const suffixSpan = document.createElement('span');
                            suffixSpan.className = 'stats__suffix';
                            suffixSpan.textContent = suffix;
                            valueEl.appendChild(suffixSpan);
                        }
                    }
                }
            });
        }, 5000);

        // Stocker le timeout pour le nettoyer si l'animation démarre
        section.dataset.safetyTimeout = safetyTimeout;

        // Vérifier si la section est déjà visible au chargement
        if (isInViewport(section)) {
            // Section déjà visible : animer immédiatement
            clearTimeout(safetyTimeout);
            requestAnimationFrame(() => {
                animateSection(section);
            });
        } else {
            // Section hors viewport : observer et animer quand elle entre
            observer.observe(section);
        }
    });
}

/**
 * Affiche les valeurs finales sans animation.
 * @param {HTMLElement} section
 */
function showFinalValues(section) {
    const values = section.querySelectorAll(SELECTORS.value);
    values.forEach(valueEl => {
        const target = parseInt(valueEl.dataset.count, 10);
        const suffix = valueEl.dataset.suffix || '';
        valueEl.textContent = formatNumber(target);
        if (suffix) {
            const suffixSpan = document.createElement('span');
            suffixSpan.className = 'stats__suffix';
            suffixSpan.textContent = suffix;
            valueEl.appendChild(suffixSpan);
        }
    });
}

/**
 * Gère l'intersection des sections avec le viewport.
 * @param {IntersectionObserverEntry[]} entries
 */
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;
            // Annuler le timeout de sécurité
            if (section.dataset.safetyTimeout) {
                clearTimeout(parseInt(section.dataset.safetyTimeout, 10));
            }
            // Petit délai pour permettre à la classe CSS d'être appliquée
            requestAnimationFrame(() => {
                animateSection(section);
            });
            observer.unobserve(section); // N'animer qu'une fois
        }
    });
}

/**
 * Anime une section de stats.
 * @param {HTMLElement} section
 */
function animateSection(section) {
    const items = section.querySelectorAll(SELECTORS.item);
    const values = section.querySelectorAll(SELECTORS.value);

    // Ajouter la classe visible aux items avec délai échelonné
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('is-visible');
        }, index * 150);
    });

    // Animer les compteurs
    values.forEach((valueEl, index) => {
        const target = parseInt(valueEl.dataset.count, 10);
        const suffix = valueEl.dataset.suffix || '';

        if (prefersReducedMotion) {
            // Pas d'animation, afficher directement
            valueEl.textContent = formatNumber(target);
            if (suffix) {
                const suffixSpan = document.createElement('span');
                suffixSpan.className = 'stats__suffix';
                suffixSpan.textContent = suffix;
                valueEl.appendChild(suffixSpan);
            }
        } else {
            // Animation de comptage avec délai échelonné
            setTimeout(() => {
                animateCount(valueEl, 0, target, suffix);
            }, index * 150 + 300);
        }
    });
}

/**
 * Anime le comptage d'une valeur.
 * @param {HTMLElement} element
 * @param {number} start
 * @param {number} end
 * @param {string} suffix
 */
function animateCount(element, start, end, suffix) {
    const startTime = performance.now();

    // Créer le span suffixe une seule fois
    let suffixSpan = null;
    if (suffix) {
        suffixSpan = document.createElement('span');
        suffixSpan.className = 'stats__suffix';
        suffixSpan.textContent = suffix;
    }

    // Créer un text node pour le nombre
    const numberNode = document.createTextNode(formatNumber(start));

    // Vider l'élément et ajouter nos nodes
    element.textContent = '';
    element.appendChild(numberNode);
    if (suffixSpan) {
        element.appendChild(suffixSpan);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
        const easedProgress = easeOutExpo(progress);
        const currentValue = Math.floor(start + (end - start) * easedProgress);

        // Mettre à jour uniquement le text node du nombre
        numberNode.textContent = formatNumber(currentValue);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Formate un nombre avec séparateurs de milliers.
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
    return num.toLocaleString('fr-FR');
}

/**
 * Fonction d'easing exponentiel (sortie).
 * @param {number} t - Progress (0 à 1)
 * @returns {number}
 */
function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
