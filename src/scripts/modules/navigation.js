/**
 * Module Navigation - sudestchape
 * Gestion du menu mobile (drawer), sticky header et sous-menus.
 * Accessibilité : focus trap, Escape, aria-expanded.
 *
 * @module navigation
 */

/** Sélecteurs utilisés dans le module */
const SELECTORS = {
    toggle: '.site-header__menu-toggle',
    drawer: '#mobile-navigation',
    close: '.mobile-nav__close',
    overlay: '.mobile-nav__overlay',
    header: '.site-header',
    headerWrapper: '.header-wrapper',
    hero: '.hero--full',
    links: '.mobile-nav__link, .mobile-nav__close, .mobile-nav__phone, .mobile-nav__cta .btn',
};

/** @type {HTMLElement|null} */
let drawerEl = null;

/** @type {HTMLElement|null} */
let toggleEl = null;

/** @type {HTMLElement|null} */
let headerEl = null;

/** @type {HTMLElement|null} */
let headerWrapperEl = null;

/** @type {HTMLElement|null} */
let heroEl = null;

/** Dernier élément ayant le focus avant l'ouverture du drawer */
let lastFocusedElement = null;

/**
 * Initialise le module navigation.
 * Appelé une fois au chargement de la page.
 */
export function init() {
    toggleEl = document.querySelector(SELECTORS.toggle);
    drawerEl = document.querySelector(SELECTORS.drawer);
    headerEl = document.querySelector(SELECTORS.header);
    headerWrapperEl = document.querySelector(SELECTORS.headerWrapper);
    heroEl = document.querySelector(SELECTORS.hero);

    if (toggleEl && drawerEl) {
        initMobileMenu();
        initMobileSubmenus();
    }

    if (headerWrapperEl) {
        initStickyHeader();
    }

    initSmoothScroll();
    initDesktopSubmenus();
}

/* ==========================================================================
   Menu mobile (drawer)
   ========================================================================== */

/**
 * Initialise le menu mobile : bouton toggle, overlay, fermeture.
 */
function initMobileMenu() {
    const closeBtn = drawerEl.querySelector(SELECTORS.close);
    const overlay = drawerEl.querySelector(SELECTORS.overlay);

    // Toggle
    toggleEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = toggleEl.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    // Fermeture via bouton close
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeDrawer();
        });
    }

    // Fermeture via overlay (ne pas propager le clic)
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeDrawer();
        });
    }

    // Fermeture via Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isDrawerOpen()) {
            closeDrawer();
        }
    });

    // S'assurer que les liens du menu fonctionnent et ferment le drawer
    const navLinks = drawerEl.querySelectorAll('.mobile-nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Laisser la navigation se faire normalement
            // Le drawer se fermera automatiquement lors du changement de page
        });
    });
}

/**
 * Ouvre le drawer mobile.
 */
function openDrawer() {
    lastFocusedElement = document.activeElement;
    drawerEl.removeAttribute('hidden');
    toggleEl.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus sur le premier lien après ouverture (animation)
    requestAnimationFrame(() => {
        const firstFocusable = drawerEl.querySelector(SELECTORS.close);
        if (firstFocusable) firstFocusable.focus();
    });

    // Focus trap
    drawerEl.addEventListener('keydown', handleFocusTrap);
}

/**
 * Ferme le drawer mobile.
 */
function closeDrawer() {
    drawerEl.setAttribute('hidden', '');
    toggleEl.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    drawerEl.removeEventListener('keydown', handleFocusTrap);

    // Restaurer le focus
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

/**
 * Vérifie si le drawer est ouvert.
 *
 * @returns {boolean}
 */
function isDrawerOpen() {
    return drawerEl && !drawerEl.hasAttribute('hidden');
}

/**
 * Gère le piège de focus à l'intérieur du drawer.
 * Tab et Shift+Tab restent dans le drawer.
 *
 * @param {KeyboardEvent} e
 */
function handleFocusTrap(e) {
    if (e.key !== 'Tab') return;

    const focusableElements = drawerEl.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

/* ==========================================================================
   Sticky header
   ========================================================================== */

/**
 * Initialise le comportement de header avec seuils de scroll :
 * Mode transparent :
 * - 0% : top-bar visible, nav transparent, fond hero = couleur top-bar (orange)
 * - 10% : top-bar disparaît (CSS gère le sticky)
 * - 30% : nav devient blanche, fond hero = blanc (coins arrondis visibles)
 * Mode non-transparent :
 * - 1px : ajoute ombre au header
 * - 100px : top-bar disparaît (CSS gère le sticky)
 */
function initStickyHeader() {
    let ticking = false;

    // Wrapper du hero (pour changer la couleur de fond)
    const heroWrapperEl = document.querySelector('.hero-wrapper');

    // Vérifier si le mode transparent est activé
    const isTransparentMode = headerWrapperEl.classList.contains('header-wrapper--transparent');

    // Initialiser immédiatement selon la position de scroll actuelle (évite le flash au refresh)
    headerWrapperEl.classList.add('no-transition');
    handleStickyHeader();
    requestAnimationFrame(() => {
        headerWrapperEl.classList.remove('no-transition');
    });

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleStickyHeader();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    function handleStickyHeader() {
        const currentScrollY = window.scrollY;

        if (isTransparentMode) {
            // Mode transparent : seuils basés sur la hauteur du hero
            const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
            const threshold10 = heroHeight * 0.10; // 10% du hero
            const threshold30 = heroHeight * 0.30; // 30% du hero

            // Gestion de la top-bar (le CSS décide si elle se cache ou reste via sticky)
            if (currentScrollY > threshold10) {
                headerWrapperEl.classList.add('topbar-hidden');
            } else {
                headerWrapperEl.classList.remove('topbar-hidden');
            }

            // Gestion du mode sticky (nav blanche à 30%) et fond hero
            if (currentScrollY > threshold30) {
                headerWrapperEl.classList.add('is-scrolled');
                if (heroWrapperEl) heroWrapperEl.classList.add('hero-wrapper--scrolled');
            } else {
                headerWrapperEl.classList.remove('is-scrolled');
                if (heroWrapperEl) heroWrapperEl.classList.remove('hero-wrapper--scrolled');
            }
        } else {
            // Mode non-transparent
            // Ombre dès 1px de scroll
            if (currentScrollY > 1) {
                headerWrapperEl.classList.add('is-scrolled');
            } else {
                headerWrapperEl.classList.remove('is-scrolled');
            }

            // Gestion de la top-bar (le CSS décide si elle se cache ou reste via sticky)
            if (currentScrollY > 100) {
                headerWrapperEl.classList.add('topbar-hidden');
            } else {
                headerWrapperEl.classList.remove('topbar-hidden');
            }
        }
    }
}

/* ==========================================================================
   Smooth scroll
   ========================================================================== */

/**
 * Ajoute un smooth scroll aux ancres internes (href="#...").
 * Respecte prefers-reduced-motion.
 */
function initSmoothScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href').slice(1);
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();

        const headerOffset = headerEl ? headerEl.offsetHeight : 0;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });

        // Mettre le focus sur la cible (accessibilité)
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
    });
}

/* ==========================================================================
   Sous-menus desktop (clavier)
   ========================================================================== */

/**
 * Ajoute la gestion clavier pour les sous-menus desktop :
 * - Enter/Space ouvre le sous-menu
 * - Escape ferme le sous-menu
 */
function initDesktopSubmenus() {
    const submenuToggles = document.querySelectorAll('.main-nav__link[aria-haspopup="true"]');

    submenuToggles.forEach((toggle) => {
        toggle.addEventListener('keydown', (e) => {
            const parent = toggle.closest('.main-nav__item');
            const submenu = parent?.querySelector('.main-nav__submenu');
            if (!submenu) return;

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isOpen = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
            }

            if (e.key === 'Escape') {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });
    });
}

/* ==========================================================================
   Sous-menus mobile (accordéon)
   ========================================================================== */

/**
 * Initialise les sous-menus mobiles en mode accordéon.
 * Clic sur un item parent ouvre/ferme son sous-menu.
 */
function initMobileSubmenus() {
    const itemsWithSubmenu = drawerEl.querySelectorAll('.mobile-nav__item.has-submenu');

    itemsWithSubmenu.forEach((item) => {
        const link = item.querySelector('.mobile-nav__link');
        const toggle = item.querySelector('.mobile-nav__toggle');
        const submenu = item.querySelector('.mobile-nav__submenu');

        if (!submenu) return;

        // Si un bouton toggle existe, l'utiliser
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileSubmenu(item);
            });
        }

        // Si le lien parent n'a pas de href ou est "#", toggle au clic
        if (link && (!link.getAttribute('href') || link.getAttribute('href') === '#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                toggleMobileSubmenu(item);
            });
        }
    });
}

/**
 * Ouvre ou ferme un sous-menu mobile.
 * Ferme les autres sous-menus ouverts (accordéon exclusif).
 *
 * @param {HTMLElement} item - L'élément .mobile-nav__item à toggle
 */
function toggleMobileSubmenu(item) {
    const isOpen = item.classList.contains('is-open');
    const link = item.querySelector('.mobile-nav__link');
    const submenu = item.querySelector('.mobile-nav__submenu');

    // Fermer tous les autres sous-menus
    const allItems = drawerEl.querySelectorAll('.mobile-nav__item.has-submenu');
    allItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('is-open')) {
            otherItem.classList.remove('is-open');
            const otherLink = otherItem.querySelector('.mobile-nav__link');
            if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
        }
    });

    // Toggle l'item courant
    if (isOpen) {
        item.classList.remove('is-open');
        if (link) link.setAttribute('aria-expanded', 'false');
    } else {
        item.classList.add('is-open');
        if (link) link.setAttribute('aria-expanded', 'true');
        // Focus sur le premier lien du sous-menu
        if (submenu) {
            const firstSublink = submenu.querySelector('.mobile-nav__sublink');
            if (firstSublink) {
                setTimeout(() => firstSublink.focus(), 100);
            }
        }
    }
}
