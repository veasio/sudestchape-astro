/**
 * Module Analytics - sudestchape
 * Couche d'abstraction pour le tracking d'événements.
 * Compatible Mautic (mt) et Google Analytics 4 (gtag).
 *
 * @module analytics
 */

/**
 * Envoie un événement aux plateformes analytics configurées.
 *
 * @param {string} category - Catégorie de l'événement (ex: 'engagement', 'form', 'download')
 * @param {string} action   - Action (ex: 'click', 'submit', 'scroll')
 * @param {string} [label]  - Libellé optionnel (ex: 'cta-hero', 'form-contact')
 * @param {number} [value]  - Valeur numérique optionnelle
 */
export function trackEvent(category, action, label = '', value = undefined) {
    // Mautic
    if (typeof window.mt === 'function') {
        window.mt('send', 'event', {
            category,
            action,
            label,
            ...(value !== undefined && { value }),
        });
    }

    // Google Analytics 4
    if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            ...(value !== undefined && { value }),
        });
    }
}

/**
 * Envoie un événement de vue de page.
 *
 * @param {string} [url=location.href]  - URL de la page
 * @param {string} [title=document.title] - Titre de la page
 */
export function trackPageView(url = location.href, title = document.title) {
    if (typeof window.mt === 'function') {
        window.mt('send', 'pageview', { page: url, title });
    }

    if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
            page_location: url,
            page_title: title,
        });
    }
}

/**
 * Envoie un événement de vue de formulaire.
 *
 * @param {string} formId - ID du formulaire
 */
export function trackFormView(formId) {
    trackEvent('form', 'view', `form-${formId}`);
}

/**
 * Envoie un événement de soumission de formulaire.
 *
 * @param {string} formId - ID du formulaire
 */
export function trackFormSubmit(formId) {
    trackEvent('form', 'submit', `form-${formId}`);
}

/**
 * Envoie un événement de téléchargement de fichier.
 *
 * @param {string} url      - URL du fichier
 * @param {string} filename - Nom du fichier
 */
export function trackDownload(url, filename) {
    trackEvent('download', 'click', filename || url);
}

/**
 * Envoie un événement de clic sur un lien externe.
 *
 * @param {string} url - URL du lien
 */
export function trackOutboundLink(url) {
    trackEvent('outbound', 'click', url);
}

/**
 * Envoie un événement de profondeur de scroll.
 *
 * @param {number} percentage - Pourcentage scrollé (25, 50, 75, 100)
 */
export function trackScrollDepth(percentage) {
    trackEvent('engagement', 'scroll_depth', `${percentage}%`, percentage);
}

/**
 * Envoie un événement de temps passé sur la page.
 *
 * @param {number} seconds - Secondes passées sur la page
 */
export function trackTimeOnPage(seconds) {
    trackEvent('engagement', 'time_on_page', `${seconds}s`, seconds);
}

/**
 * Récupère les paramètres UTM de l'URL courante.
 *
 * @returns {Object<string, string>} Objet clé/valeur des UTM présents
 */
export function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const result = {};

    utmKeys.forEach((key) => {
        const val = params.get(key);
        if (val) result[key] = val;
    });

    return result;
}

/**
 * Stocke les paramètres UTM en sessionStorage pour persistance.
 * Appelé automatiquement au chargement si UTM présents.
 */
export function persistUtmParams() {
    const utmParams = getUtmParams();

    if (Object.keys(utmParams).length > 0) {
        sessionStorage.setItem('sudestchape_utm', JSON.stringify(utmParams));
    }
}

/**
 * Récupère les paramètres UTM persistés (URL ou sessionStorage).
 *
 * @returns {Object<string, string>}
 */
export function getPersistedUtmParams() {
    // D'abord depuis l'URL actuelle
    const urlParams = getUtmParams();
    if (Object.keys(urlParams).length > 0) {
        return urlParams;
    }

    // Sinon depuis sessionStorage
    try {
        const stored = sessionStorage.getItem('sudestchape_utm');
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

/**
 * Identifie un contact dans Mautic.
 * Utile quand on connaît l'email d'un utilisateur connecté.
 *
 * @param {string} email - Email du contact
 * @param {Object} [data] - Données additionnelles (firstname, lastname, etc.)
 */
export function identifyContact(email, data = {}) {
    if (typeof window.mt === 'function' && email) {
        window.mt('send', 'identify', { email, ...data });
    }
}

/**
 * Envoie un événement de conversion (objectif atteint).
 *
 * @param {string} conversionName - Nom de la conversion
 * @param {number} [value] - Valeur monétaire optionnelle
 */
export function trackConversion(conversionName, value = undefined) {
    trackEvent('conversion', conversionName, window.location.pathname, value);

    // GA4 conversion
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
            send_to: conversionName,
            ...(value !== undefined && { value, currency: 'EUR' }),
        });
    }
}

/**
 * Track un clic sur un CTA avec contexte.
 *
 * @param {string} ctaName - Nom du CTA
 * @param {string} [location] - Emplacement (hero, footer, sidebar, etc.)
 */
export function trackCtaClick(ctaName, location = '') {
    const label = location ? `${ctaName}:${location}` : ctaName;
    trackEvent('cta', 'click', label);
}

/**
 * Track l'ajout d'un produit/service au panier/devis.
 *
 * @param {string} itemName - Nom du produit/service
 * @param {string} [category] - Catégorie
 */
export function trackAddToQuote(itemName, category = '') {
    trackEvent('quote', 'add_item', `${category}:${itemName}`);
}

// Auto-persist UTM params on load
if (typeof window !== 'undefined') {
    persistUtmParams();
}
