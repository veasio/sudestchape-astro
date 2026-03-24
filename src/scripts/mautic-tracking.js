/**
 * Mautic Tracking Avancé - sudestchape
 * ======================================
 * Tracking comportemental via Mautic : scroll depth, outbound links,
 * downloads, time on page, form views/submissions, CTA clicks,
 * video engagement, phone clicks, and focus/blur tracking.
 *
 * Ce script est chargé en defer et nécessite que mtc.js soit déjà
 * initialisé dans le layout (via le <script> inline du <head>).
 *
 * @requires mt (window.mt) - Mautic tracking object initialisé dans le layout
 */

(function () {
    'use strict';

    /* ==================================================================
       Configuration
       ================================================================== */

    /** Extensions de fichiers considérées comme des téléchargements */
    const DOWNLOAD_EXTENSIONS = [
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
        'zip', 'rar', '7z', 'tar', 'gz',
        'csv', 'txt', 'rtf',
        'mp3', 'mp4', 'avi', 'mov', 'webm',
        'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp',
    ];

    /** Seuils de scroll depth à tracker (%) */
    const SCROLL_THRESHOLDS = [25, 50, 75, 100];

    /** Seuils de temps sur page à tracker (secondes) */
    const TIME_THRESHOLDS = [30, 60, 120, 300];

    /** Host courant (pour détecter les liens sortants) */
    const currentHost = window.location.hostname;

    /** Pages à haute valeur (scoring bonus) */
    const HIGH_VALUE_PAGES = ['/contact', '/devis', '/services'];

    /** Sélecteurs pour les CTA à tracker */
    const CTA_SELECTORS = [
        '.btn--primary',
        '.btn--cta',
        '[data-track-cta]',
        '.hero__actions .btn',
        '.cta-section .btn',
    ];

    /* ==================================================================
       Helpers
       ================================================================== */

    /**
     * Envoie un événement à Mautic si mt() est disponible.
     *
     * @param {string} action - Nom de l'événement
     * @param {Object} [data] - Données associées
     */
    function sendEvent(action, data = {}) {
        if (typeof window.mt === 'function') {
            window.mt('send', 'event', { action, ...data });
        }
    }

    /**
     * Retourne l'extension d'un fichier depuis son URL.
     *
     * @param {string} url
     * @returns {string} Extension en minuscules, ou chaîne vide
     */
    function getFileExtension(url) {
        try {
            const pathname = new URL(url, window.location.origin).pathname;
            const ext = pathname.split('.').pop().toLowerCase();
            return ext || '';
        } catch {
            return '';
        }
    }

    /* ==================================================================
       Scroll Depth Tracking
       ================================================================== */

    /**
     * Initialise le tracking de profondeur de scroll.
     * Émet un événement pour chaque seuil atteint (25%, 50%, 75%, 100%).
     * Chaque seuil n'est tracké qu'une fois par session de page.
     */
    function initScrollDepth() {
        const tracked = new Set();

        function checkScroll() {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight <= 0) return;

            const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

            SCROLL_THRESHOLDS.forEach((threshold) => {
                if (scrollPercent >= threshold && !tracked.has(threshold)) {
                    tracked.add(threshold);
                    sendEvent('scroll_depth', {
                        label: `${threshold}%`,
                        value: threshold,
                        page: window.location.pathname,
                    });
                }
            });
        }

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ==================================================================
       Outbound Links Tracking
       ================================================================== */

    /**
     * Initialise le tracking des clics sur les liens externes.
     * Un lien est considéré externe si son hostname diffère du site courant.
     */
    function initOutboundLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            try {
                const url = new URL(link.href, window.location.origin);

                // Ignorer les liens internes, mailto, tel, javascript
                if (
                    url.hostname === currentHost ||
                    url.protocol === 'mailto:' ||
                    url.protocol === 'tel:' ||
                    url.protocol === 'javascript:'
                ) {
                    return;
                }

                sendEvent('outbound_link', {
                    label: url.href,
                    category: 'engagement',
                });
            } catch {
                // URL invalide, ignorer
            }
        });
    }

    /* ==================================================================
       Downloads Tracking
       ================================================================== */

    /**
     * Initialise le tracking des téléchargements de fichiers.
     * Détecte les clics sur les liens dont l'extension correspond
     * à DOWNLOAD_EXTENSIONS.
     */
    function initDownloads() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const ext = getFileExtension(link.href);

            if (DOWNLOAD_EXTENSIONS.includes(ext)) {
                const filename = link.href.split('/').pop() || link.href;

                sendEvent('file_download', {
                    label: filename,
                    category: 'download',
                    extension: ext,
                    url: link.href,
                });
            }
        });
    }

    /* ==================================================================
       Form Views / Submissions Tracking
       ================================================================== */

    /**
     * Initialise le tracking des formulaires Mautic.
     * Détecte les formulaires via IntersectionObserver (form view)
     * et écoute les soumissions (form submit).
     */
    function initFormTracking() {
        const formContainers = document.querySelectorAll('[data-mautic-form-id]');

        if (formContainers.length === 0) return;

        // Form views via IntersectionObserver
        if ('IntersectionObserver' in window) {
            const viewedForms = new Set();

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        const formId = entry.target.dataset.mauticFormId;
                        if (formId && !viewedForms.has(formId)) {
                            viewedForms.add(formId);
                            sendEvent('form_view', {
                                label: `form-${formId}`,
                                category: 'form',
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            formContainers.forEach((el) => observer.observe(el));
        }

        // Form submissions
        document.addEventListener('submit', (e) => {
            const container = e.target.closest('[data-mautic-form-id]');
            if (!container) return;

            const formId = container.dataset.mauticFormId;
            if (formId) {
                sendEvent('form_submit', {
                    label: `form-${formId}`,
                    category: 'form',
                });
            }
        });
    }

    /* ==================================================================
       Time on Page Tracking
       ================================================================== */

    /**
     * Initialise le tracking du temps passé sur la page.
     * Émet un événement pour chaque seuil atteint (30s, 60s, 120s, 300s).
     * S'arrête si la page est en arrière-plan (Page Visibility API).
     */
    function initTimeOnPage() {
        const tracked = new Set();
        let elapsed = 0;
        let isVisible = !document.hidden;

        // Compteur d'une seconde
        const timer = setInterval(() => {
            if (!isVisible) return;
            elapsed++;

            TIME_THRESHOLDS.forEach((threshold) => {
                if (elapsed >= threshold && !tracked.has(threshold)) {
                    tracked.add(threshold);
                    sendEvent('time_on_page', {
                        label: `${threshold}s`,
                        value: threshold,
                        page: window.location.pathname,
                    });
                }
            });

            // Arrêter après le dernier seuil
            if (tracked.size >= TIME_THRESHOLDS.length) {
                clearInterval(timer);
            }
        }, 1000);

        // Pause quand la page est en arrière-plan
        document.addEventListener('visibilitychange', () => {
            isVisible = !document.hidden;
        });
    }

    /* ==================================================================
       CTA Click Tracking
       ================================================================== */

    /**
     * Initialise le tracking des clics sur les boutons CTA.
     * Permet d'identifier les appels à l'action les plus efficaces.
     */
    function initCtaTracking() {
        const ctaSelector = CTA_SELECTORS.join(', ');

        document.addEventListener('click', (e) => {
            const cta = e.target.closest(ctaSelector);
            if (!cta) return;

            const label = cta.dataset.trackCta
                || cta.textContent.trim().slice(0, 50)
                || 'unknown';

            const href = cta.href || cta.closest('a')?.href || '';

            sendEvent('cta_click', {
                label: label,
                category: 'engagement',
                href: href,
                page: window.location.pathname,
            });
        });
    }

    /* ==================================================================
       Phone Click Tracking
       ================================================================== */

    /**
     * Initialise le tracking des clics sur les liens téléphone.
     * Important pour le suivi des conversions.
     */
    function initPhoneTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="tel:"]');
            if (!link) return;

            const phone = link.href.replace('tel:', '');

            sendEvent('phone_click', {
                label: phone,
                category: 'conversion',
                page: window.location.pathname,
            });
        });
    }

    /* ==================================================================
       Email Click Tracking
       ================================================================== */

    /**
     * Initialise le tracking des clics sur les liens email.
     */
    function initEmailTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="mailto:"]');
            if (!link) return;

            const email = link.href.replace('mailto:', '').split('?')[0];

            sendEvent('email_click', {
                label: email,
                category: 'conversion',
                page: window.location.pathname,
            });
        });
    }

    /* ==================================================================
       High Value Page Tracking
       ================================================================== */

    /**
     * Envoie un événement spécial pour les pages à haute valeur.
     * Utilisé pour le lead scoring dans Mautic.
     */
    function initHighValuePages() {
        const currentPath = window.location.pathname;

        if (HIGH_VALUE_PAGES.some(page => currentPath.startsWith(page))) {
            sendEvent('high_value_page', {
                label: currentPath,
                category: 'intent',
            });
        }
    }

    /* ==================================================================
       Video Engagement Tracking
       ================================================================== */

    /**
     * Initialise le tracking des vidéos HTML5.
     * Track : play, 25%, 50%, 75%, complete
     */
    function initVideoTracking() {
        const videos = document.querySelectorAll('video[data-track], video.track-video');
        if (videos.length === 0) return;

        videos.forEach((video) => {
            const videoId = video.id || video.src?.split('/').pop() || 'unknown';
            const tracked = new Set();

            video.addEventListener('play', () => {
                if (!tracked.has('play')) {
                    tracked.add('play');
                    sendEvent('video_play', {
                        label: videoId,
                        category: 'video',
                    });
                }
            });

            video.addEventListener('timeupdate', () => {
                if (!video.duration) return;

                const percent = Math.round((video.currentTime / video.duration) * 100);
                const thresholds = [25, 50, 75];

                thresholds.forEach((threshold) => {
                    if (percent >= threshold && !tracked.has(threshold)) {
                        tracked.add(threshold);
                        sendEvent('video_progress', {
                            label: videoId,
                            value: threshold,
                            category: 'video',
                        });
                    }
                });
            });

            video.addEventListener('ended', () => {
                if (!tracked.has('complete')) {
                    tracked.add('complete');
                    sendEvent('video_complete', {
                        label: videoId,
                        category: 'video',
                    });
                }
            });
        });
    }

    /* ==================================================================
       Returning Visitor Detection
       ================================================================== */

    /**
     * Détecte si c'est une première visite ou un retour.
     * Stocke un flag en localStorage.
     */
    function initVisitorTracking() {
        const storageKey = 'sudestchape_visited';
        const isReturning = localStorage.getItem(storageKey);

        if (isReturning) {
            sendEvent('returning_visitor', {
                category: 'audience',
                page: window.location.pathname,
            });
        } else {
            localStorage.setItem(storageKey, Date.now().toString());
            sendEvent('new_visitor', {
                category: 'audience',
                page: window.location.pathname,
            });
        }
    }

    /* ==================================================================
       Focus/Blur Tracking (Engagement réel)
       ================================================================== */

    /**
     * Track le temps réel d'engagement (onglet actif).
     * Envoie un événement au départ avec le temps actif total.
     */
    function initEngagementTracking() {
        let activeTime = 0;
        let lastActiveTimestamp = Date.now();
        let isActive = !document.hidden;

        // Compteur quand actif
        setInterval(() => {
            if (isActive) {
                activeTime++;
            }
        }, 1000);

        // Visibilité de l'onglet
        document.addEventListener('visibilitychange', () => {
            isActive = !document.hidden;
            if (isActive) {
                lastActiveTimestamp = Date.now();
            }
        });

        // Envoyer au départ de la page
        window.addEventListener('beforeunload', () => {
            if (activeTime > 10) { // Au moins 10 secondes d'engagement
                sendEvent('engagement_time', {
                    value: activeTime,
                    label: `${activeTime}s`,
                    category: 'engagement',
                    page: window.location.pathname,
                });
            }
        });
    }

    /* ==================================================================
       Initialisation
       ================================================================== */

    /**
     * Initialise tous les modules de tracking.
     * Attend que le DOM soit prêt.
     */
    function init() {
        // Tracking de base
        initScrollDepth();
        initOutboundLinks();
        initDownloads();
        initFormTracking();
        initTimeOnPage();

        // Tracking avancé
        initCtaTracking();
        initPhoneTracking();
        initEmailTracking();
        initHighValuePages();
        initVideoTracking();
        initVisitorTracking();
        initEngagementTracking();
    }

    // Lancer au DOMContentLoaded ou immédiatement si déjà prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
