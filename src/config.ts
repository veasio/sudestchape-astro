/**
 * Configuration centrale du site sudestchape
 * ============================================
 * Équivalent du panneau "Apparence > Thème" d'October CMS.
 * Modifiez ce fichier unique pour mettre à jour les infos du site partout.
 */

// ---------------------------------------------------------------------------
// Identité
// ---------------------------------------------------------------------------
export const SITE_NAME        = 'Sudest Chape';
export const SITE_URL         = 'https://sudestchape.fr';
export const SITE_TAGLINE     = 'Spécialiste de la chape fluide et traditionnelle dans le Sud-Est';
export const SITE_DESCRIPTION = 'Sudest Chape, spécialiste de la chape fluide et traditionnelle dans le Sud-Est de la France. Devis gratuit, intervention rapide, qualité certifiée.';
export const SITE_LOGO        = '/images/logo.png';
export const SITE_LOGO_LIGHT  = '/images/logo-light.png'; // logo blanc pour fond sombre
export const SITE_FAVICON     = '/favicon.png';

export const SITE_PHONE       = '+33491000000';
export const SITE_PHONE_DISPLAY = '04 91 00 00 00';
export const SITE_EMAIL       = 'contact@sudestchape.fr';
export const SITE_ADDRESS     = '123 Avenue du Prado\n13008 Marseille';
export const SITE_ADDRESS_HTML = '123 Avenue du Prado<br />13008 Marseille';

// ---------------------------------------------------------------------------
// Réseaux sociaux
// ---------------------------------------------------------------------------
export const SOCIAL_FACEBOOK  = 'https://www.facebook.com/sudestchape';
export const SOCIAL_INSTAGRAM = 'https://www.instagram.com/sudestchape';
export const SOCIAL_LINKEDIN  = 'https://www.linkedin.com/company/sudestchape';
export const SOCIAL_YOUTUBE   = '';
export const SOCIAL_TIKTOK    = '';

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export const SEO_TITLE_SUFFIX      = '| Sudest Chape';
export const SEO_DEFAULT_OG_IMAGE  = '/images/og-default.jpg';
export const SEO_GOOGLE_VERIF      = ''; // meta google-site-verification
export const SEO_BING_VERIF        = '';

// ---------------------------------------------------------------------------
// Schema.org
// ---------------------------------------------------------------------------
export const SCHEMA_ORG_TYPE          = 'HomeAndConstructionBusiness';
export const SCHEMA_ORG_NAME          = 'Sudest Chape';
export const SCHEMA_ORG_LEGAL_NAME    = 'Sudest Chape SARL';
export const SCHEMA_ORG_FOUNDING_DATE = '2010';
export const SCHEMA_ORG_AREA_SERVED   = ['Bouches-du-Rhône', 'Var', 'Alpes-Maritimes', 'Vaucluse', 'Gard', 'Hérault'];
export const SCHEMA_ORG_PRICE_RANGE   = '$$';
export const SCHEMA_ORG_LATITUDE      = '43.2965';
export const SCHEMA_ORG_LONGITUDE     = '5.3698';
export const SCHEMA_ORG_OPENING_HOURS = 'Mo-Fr 08:00-18:00';
export const SCHEMA_ORG_SAME_AS: string[] = [
  // 'https://www.pagesjaunes.fr/...',
];

// ---------------------------------------------------------------------------
// Mautic
// ---------------------------------------------------------------------------
export const MAUTIC_ENABLED          = true;
export const MAUTIC_BASE_URL         = 'https://m.sudestchape.fr';
export const MAUTIC_TRACKING_ENABLED = true;
export const MAUTIC_FORM_CONTACT_ID  = '1';
export const MAUTIC_FORM_DEVIS_ID    = '2';
export const MAUTIC_FORM_NEWSLETTER_ID = '3';
export const MAUTIC_FORM_CALLBACK_ID   = '4';

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------
export const GA4_MEASUREMENT_ID = ''; // ex: G-XXXXXXXXXX
export const GTM_CONTAINER_ID   = ''; // ex: GTM-XXXXXXX

// ---------------------------------------------------------------------------
// Tracking social
// ---------------------------------------------------------------------------
export const FACEBOOK_PIXEL_ID      = '';
export const FACEBOOK_PIXEL_ENABLED = false;
export const LINKEDIN_PARTNER_ID    = '';
export const LINKEDIN_PIXEL_ENABLED = false;

// ---------------------------------------------------------------------------
// Apparence
// ---------------------------------------------------------------------------
export const COLOR_PRIMARY = '#CB6015';
export const COLOR_ACCENT  = '#F5E0CF';
export const COLOR_CTA     = '#F27C22';
export const COLOR_SUCCESS = '#4D7C0F';
export const COLOR_ERROR   = '#BE123C';

export const FONT_FAMILY        = 'Inter';
export const FONT_GOOGLE_URL    = `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap`;

export const HEADER_TRANSPARENT = true;
export const TOPBAR_STICKY      = false;

// ---------------------------------------------------------------------------
// Top bar / Accroches promotionnelles
// ---------------------------------------------------------------------------
export const TOPBAR_LEFT_TEXT = 'Spécialiste chape fluide & traditionnelle — Sud-Est PACA';

export const PROMO_ENABLED         = true;
export const PROMO_AUTOPLAY        = true;
export const PROMO_INTERVAL_MS     = 4000;
export const PROMO_PAUSE_ON_HOVER  = true;

export const PROMO_MESSAGES = [
  { text: 'Devis gratuit sous 24h — Réponse rapide garantie',        icon: 'calendar', link: '/contact' },
  { text: 'Intervention dans tout le Sud-Est PACA',                   icon: 'truck',    link: '' },
  { text: '+15 ans d\'expérience en chape fluide et traditionnelle',   icon: 'star',     link: '/a-propos' },
  { text: 'Certifié CTB-P — Travaux conformes aux normes DTU 26.2',   icon: 'shield',   link: '/services' },
];

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export const FOOTER_COPYRIGHT          = `© ${new Date().getFullYear()} Sudest Chape. Tous droits réservés.`;
export const FOOTER_MENTIONS_URL       = '/mentions-legales';
export const FOOTER_CGV_URL            = '';
export const FOOTER_CONFIDENTIALITE_URL = '/politique-de-confidentialite';
