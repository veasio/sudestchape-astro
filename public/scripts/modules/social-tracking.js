/**
 * Module Social Tracking - sudestchape
 * =====================================
 * Tracking unifié pour les réseaux sociaux :
 * - Facebook Pixel (Meta)
 * - LinkedIn Insight Tag
 * - Intégration Mautic
 *
 * Ce module synchronise les événements entre toutes les plateformes
 * pour une attribution cross-channel cohérente.
 *
 * @module social-tracking
 */

/* ==================================================================
   Configuration
   ================================================================== */

/** Événements Facebook Pixel standards */
const FB_STANDARD_EVENTS = [
    'AddPaymentInfo', 'AddToCart', 'AddToWishlist', 'CompleteRegistration',
    'Contact', 'CustomizeProduct', 'Donate', 'FindLocation', 'InitiateCheckout',
    'Lead', 'Purchase', 'Schedule', 'Search', 'StartTrial', 'SubmitApplication',
    'Subscribe', 'ViewContent'
];

/** Mapping des événements internes vers Facebook */
const FB_EVENT_MAP = {
    'form_submit': 'Lead',
    'phone_click': 'Contact',
    'email_click': 'Contact',
    'cta_click': 'ViewContent',
    'quote_request': 'Lead',
    'callback_request': 'Lead',
    'newsletter_signup': 'CompleteRegistration',
    'download': 'ViewContent',
};

/** Mapping des événements internes vers LinkedIn */
const LI_EVENT_MAP = {
    'form_submit': 'lead',
    'quote_request': 'lead',
    'callback_request': 'lead',
    // LinkedIn utilise des conversion_id spécifiques configurés dans l'interface
};

/* ==================================================================
   Helpers
   ================================================================== */

/**
 * Vérifie si Facebook Pixel est disponible et activé.
 * @returns {boolean}
 */
function isFacebookAvailable() {
    return window.sudestchapeFacebook?.enabled && typeof fbq === 'function';
}

/**
 * Vérifie si LinkedIn Insight est disponible et activé.
 * @returns {boolean}
 */
function isLinkedInAvailable() {
    return window.sudestchapeLinkedIn?.enabled && typeof lintrk === 'function';
}

/**
 * Vérifie si Mautic est disponible.
 * @returns {boolean}
 */
function isMauticAvailable() {
    return typeof window.mt === 'function';
}

/* ==================================================================
   API Publique
   ================================================================== */

/**
 * Envoie un événement à toutes les plateformes configurées.
 *
 * @param {string} eventName - Nom de l'événement interne
 * @param {Object} [params] - Paramètres de l'événement
 * @param {Object} [options] - Options de tracking
 * @param {string} [options.fbEvent] - Nom d'événement Facebook spécifique
 * @param {string} [options.liConversionId] - ID de conversion LinkedIn
 */
export function trackEvent(eventName, params = {}, options = {}) {
    // Mautic
    if (isMauticAvailable()) {
        window.mt('send', 'event', {
            action: eventName,
            ...params,
        });
    }

    // Facebook Pixel
    if (isFacebookAvailable()) {
        const fbEvent = options.fbEvent || FB_EVENT_MAP[eventName];
        if (fbEvent && FB_STANDARD_EVENTS.includes(fbEvent)) {
            fbq('track', fbEvent, params);
        } else {
            fbq('trackCustom', eventName, params);
        }
    }

    // LinkedIn
    if (isLinkedInAvailable() && options.liConversionId) {
        lintrk('track', { conversion_id: options.liConversionId });
    }

    // Google Analytics 4
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
}

/**
 * Track une conversion de lead (formulaire soumis).
 *
 * @param {string} formType - Type de formulaire (contact, devis, newsletter, callback)
 * @param {Object} [data] - Données additionnelles
 * @param {string} [liConversionId] - ID de conversion LinkedIn (optionnel)
 */
export function trackLead(formType, data = {}, liConversionId = null) {
    const params = {
        content_name: formType,
        content_category: 'lead',
        ...data,
    };

    // Mautic
    if (isMauticAvailable()) {
        window.mt('send', 'event', {
            action: 'form_submit',
            label: formType,
            category: 'conversion',
            ...data,
        });
    }

    // Facebook - Lead event
    if (isFacebookAvailable()) {
        fbq('track', 'Lead', params);
    }

    // LinkedIn
    if (isLinkedInAvailable() && liConversionId) {
        lintrk('track', { conversion_id: liConversionId });
    }

    // GA4
    if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
            event_category: 'conversion',
            event_label: formType,
            ...data,
        });
    }
}

/**
 * Track une demande de devis.
 *
 * @param {Object} [data] - Données du devis
 * @param {string} [liConversionId] - ID de conversion LinkedIn
 */
export function trackQuoteRequest(data = {}, liConversionId = null) {
    trackLead('devis', data, liConversionId);

    // Event spécifique pour remarketing
    if (isFacebookAvailable()) {
        fbq('trackCustom', 'QuoteRequest', data);
    }
}

/**
 * Track un clic sur un bouton de contact (téléphone, email).
 *
 * @param {string} contactType - 'phone' ou 'email'
 * @param {string} value - Numéro ou adresse
 */
export function trackContactClick(contactType, value) {
    const params = {
        content_name: contactType,
        content_category: 'contact',
        value: value,
    };

    // Mautic
    if (isMauticAvailable()) {
        window.mt('send', 'event', {
            action: `${contactType}_click`,
            label: value,
            category: 'conversion',
        });
    }

    // Facebook - Contact event
    if (isFacebookAvailable()) {
        fbq('track', 'Contact', params);
    }

    // GA4
    if (typeof gtag === 'function') {
        gtag('event', 'contact', {
            method: contactType,
            value: value,
        });
    }
}

/**
 * Track un partage sur les réseaux sociaux.
 *
 * @param {string} network - Nom du réseau (facebook, linkedin, twitter, email)
 * @param {string} [contentUrl] - URL partagée
 * @param {string} [contentTitle] - Titre du contenu
 */
export function trackShare(network, contentUrl = window.location.href, contentTitle = document.title) {
    const params = {
        content_name: contentTitle,
        content_url: contentUrl,
        network: network,
    };

    // Mautic
    if (isMauticAvailable()) {
        window.mt('send', 'event', {
            action: 'social_share',
            label: network,
            category: 'social',
            url: contentUrl,
        });
    }

    // Facebook
    if (isFacebookAvailable()) {
        fbq('trackCustom', 'Share', params);
    }

    // GA4
    if (typeof gtag === 'function') {
        gtag('event', 'share', {
            method: network,
            content_type: 'page',
            item_id: contentUrl,
        });
    }
}

/**
 * Track une vue de contenu importante (page service, réalisation, etc.).
 *
 * @param {string} contentType - Type de contenu
 * @param {string} contentName - Nom du contenu
 * @param {string} [contentId] - ID du contenu
 * @param {number} [value] - Valeur potentielle
 */
export function trackViewContent(contentType, contentName, contentId = null, value = null) {
    const params = {
        content_type: contentType,
        content_name: contentName,
        ...(contentId && { content_ids: [contentId] }),
        ...(value && { value: value, currency: 'EUR' }),
    };

    // Mautic
    if (isMauticAvailable()) {
        window.mt('send', 'event', {
            action: 'view_content',
            label: contentName,
            category: contentType,
        });
    }

    // Facebook
    if (isFacebookAvailable()) {
        fbq('track', 'ViewContent', params);
    }

    // GA4
    if (typeof gtag === 'function') {
        gtag('event', 'view_item', {
            item_name: contentName,
            item_category: contentType,
            ...(value && { value: value, currency: 'EUR' }),
        });
    }
}

/**
 * Track une recherche sur le site.
 *
 * @param {string} searchQuery - Terme de recherche
 */
export function trackSearch(searchQuery) {
    const params = {
        search_string: searchQuery,
    };

    // Mautic
    if (isMauticAvailable()) {
        window.mt('send', 'event', {
            action: 'search',
            label: searchQuery,
            category: 'engagement',
        });
    }

    // Facebook
    if (isFacebookAvailable()) {
        fbq('track', 'Search', params);
    }

    // GA4
    if (typeof gtag === 'function') {
        gtag('event', 'search', {
            search_term: searchQuery,
        });
    }
}

/* ==================================================================
   Auto-tracking des boutons de partage
   ================================================================== */

/**
 * Initialise le tracking automatique des boutons de partage social.
 */
export function initShareTracking() {
    document.addEventListener('click', (e) => {
        const shareBtn = e.target.closest('[data-share], .share-btn, .social-share__link');
        if (!shareBtn) return;

        const network = shareBtn.dataset.share
            || shareBtn.dataset.network
            || extractNetworkFromClass(shareBtn)
            || extractNetworkFromHref(shareBtn.href);

        if (network) {
            trackShare(network);
        }
    });
}

/**
 * Extrait le nom du réseau depuis les classes CSS.
 * @param {HTMLElement} el
 * @returns {string|null}
 */
function extractNetworkFromClass(el) {
    const networks = ['facebook', 'linkedin', 'twitter', 'instagram', 'pinterest', 'whatsapp', 'email'];
    for (const network of networks) {
        if (el.classList.contains(network) || el.classList.contains(`share-${network}`)) {
            return network;
        }
    }
    return null;
}

/**
 * Extrait le nom du réseau depuis l'URL.
 * @param {string} href
 * @returns {string|null}
 */
function extractNetworkFromHref(href) {
    if (!href) return null;
    if (href.includes('facebook.com/sharer')) return 'facebook';
    if (href.includes('linkedin.com/share')) return 'linkedin';
    if (href.includes('twitter.com/intent')) return 'twitter';
    if (href.includes('wa.me') || href.includes('whatsapp.com')) return 'whatsapp';
    if (href.includes('pinterest.com/pin')) return 'pinterest';
    if (href.startsWith('mailto:')) return 'email';
    return null;
}

/* ==================================================================
   Initialisation
   ================================================================== */

/**
 * Initialise le module de tracking social.
 */
export function init() {
    initShareTracking();

    // Log du statut des plateformes (dev only)
    if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
        console.log('[Social Tracking] Facebook:', isFacebookAvailable() ? 'ON' : 'OFF');
        console.log('[Social Tracking] LinkedIn:', isLinkedInAvailable() ? 'ON' : 'OFF');
        console.log('[Social Tracking] Mautic:', isMauticAvailable() ? 'ON' : 'OFF');
    }
}

// Note: Ne pas auto-init ici - app.js gère l'initialisation
