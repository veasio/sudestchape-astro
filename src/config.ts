/**
 * Configuration centrale du site sudestchape
 * ============================================
 * Équivalent du panneau "Apparence > Thème" d'October CMS.
 * Modifiez ce fichier unique pour mettre à jour les infos du site partout.
 */

// ---------------------------------------------------------------------------
// Identité
// ---------------------------------------------------------------------------
export const SITE_NAME        = 'Sud Est Chape';
export const SITE_URL         = 'https://sudestchape.fr';
export const SITE_TAGLINE     = 'Applicateur de Chape Liquide Agréé | PACA |';
export const SITE_DESCRIPTION = 'Applicateur Agréé de Chape liquide, autonivelante, planchers chauffant (chape anhydrite ou ciment) ou HPC, mise à niveau des sols, Isolation Phonique et Thermique. Chapiste sur Toulon, Var et PACA';
export const SITE_LOGO        = '/images/logo.svg';
export const SITE_LOGO_LIGHT  = '/images/logo-light.svg'; // logo blanc pour fond sombre
export const SITE_FAVICON     = '/favicon.png';

export const SITE_PHONE       = '+33494874041';
export const SITE_PHONE_DISPLAY = '04 94 87 40 41';
export const SITE_EMAIL       = 'contact@sudestchape.fr';
export const SITE_ADDRESS     = '630 Chemin de Bassaquet\n83140 Six-Fours-les-Plages';
export const SITE_ADDRESS_HTML = '630 Chemin de Bassaquet<br />83140 Six-Fours-les-Plages';

// ---------------------------------------------------------------------------
// Réseaux sociaux
// ---------------------------------------------------------------------------
export const SOCIAL_FACEBOOK  = 'https://www.facebook.com/sudestchape';
export const SOCIAL_INSTAGRAM = 'https://www.instagram.com/sudestchape';
export const SOCIAL_LINKEDIN  = 'https://www.linkedin.com/company/sud-est-chape';
export const SOCIAL_YOUTUBE   = '';
export const SOCIAL_TIKTOK    = '';

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export const SEO_TITLE_SUFFIX      = '| Sud Est Chape';
export const SEO_DEFAULT_OG_IMAGE  = '/images/og-default.jpg';
export const SEO_GOOGLE_VERIF      = ''; // meta google-site-verification
export const SEO_BING_VERIF        = '';

// ---------------------------------------------------------------------------
// Schema.org
// ---------------------------------------------------------------------------
export const SCHEMA_ORG_TYPE          = 'HomeAndConstructionBusiness';
export const SCHEMA_ORG_NAME          = 'Sud Est Chape';
export const SCHEMA_ORG_LEGAL_NAME    = 'Sud Est Chape SARL';
export const SCHEMA_ORG_FOUNDING_DATE = '2010';
export const SCHEMA_ORG_AREA_SERVED   = ['Bouches-du-Rhône', 'Var', 'Alpes-Maritimes', 'Vaucluse', 'Gard', 'Hérault'];
export const SCHEMA_ORG_PRICE_RANGE   = '$$';
export const SCHEMA_ORG_LATITUDE      = '43.2965';
export const SCHEMA_ORG_LONGITUDE     = '5.3698';
export const SCHEMA_ORG_OPENING_HOURS = 'Mo-Fr 08:00-18:00';
export const SCHEMA_ORG_SAME_AS: string[] = [
  'https://www.societe.com/societe/sud-est-chape-539885251.html',
  'https://www.pappers.fr/entreprise/sec-sud-est-chape-539885251',
  'https://www.pagesjaunes.fr/pros/52008600',
  'https://annuaire-entreprises.data.gouv.fr/entreprise/sud-est-chape-seca-sec-539885251'
];

// ---------------------------------------------------------------------------
// Mautic
// ---------------------------------------------------------------------------
export const MAUTIC_ENABLED          = true;
export const MAUTIC_BASE_URL         = 'https://m.sudestchape.fr';
export const MAUTIC_TRACKING_ENABLED = true;
export const MAUTIC_FORM_CONTACT_ID  = '2';
export const MAUTIC_FORM_DEVIS_ID    = '4';

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
export const COLOR_PRIMARY = '#ED4830';
export const COLOR_ACCENT  = '#F5E0CF';
export const COLOR_CTA     = '#F27C22';
export const COLOR_SUCCESS = '#4D7C0F';
export const COLOR_ERROR   = '#BE123C';

export const FONT_FAMILY        = 'Inter';
export const FONT_GOOGLE_URL    = `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap`;

export const HEADER_TRANSPARENT = false;

export const TOPBAR_ENABLED     = true;
export const TOPBAR_STICKY      = false;
// Colonne droite de la top bar : 'phone' | 'social' | 'text'
export const TOPBAR_RIGHT_TYPE  = 'social' as 'phone' | 'social' | 'text';
export const TOPBAR_RIGHT_TEXT  = ''; // utilisé si TOPBAR_RIGHT_TYPE = 'text'

// ---------------------------------------------------------------------------
// Top bar / Accroches promotionnelles
// ---------------------------------------------------------------------------
export const TOPBAR_LEFT_TEXT = 'Applicateur de Chape Liquide Agréé | PACA |';

export const PROMO_ENABLED         = true;
export const PROMO_AUTOPLAY        = true;
export const PROMO_INTERVAL_MS     = 4000;
export const PROMO_PAUSE_ON_HOVER  = true;

export const PROMO_MESSAGES = [
  { text: 'Devis gratuit - Réponse rapide garantie',        icon: 'calendar', link: '/devis' },
  { text: 'Intervention dans tout le Sud-Est',                   icon: 'truck',    link: '' },
  { text: '+15 ans d\'expérience en chape fluide',   icon: 'star',     link: '/a-propos' },
  { text: 'Certifié CTB-P - Conformes normes DTU 26.2',   icon: 'shield',   link: '/services' },
];

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export const NAV_ITEMS = [
  {
    title: 'Nos Prestations & Solutions',
    url: '/services',
    items: [
      { title: 'Chape Ciment',          url: '/services/chape-ciment' },
      { title: 'Chape Anhydrite',  url: '/services/chape-anhydrite' },
      { title: 'Chape de Réagréage / Ravoirage',    url: '/services/chape-reagreage-ravoirage' },
	  { title: 'Isolation Phonique',    url: '/services/isolation-phonique' },
	  { title: 'Isolation Thermique',    url: '/services/isolation-thermique' },
	  { title: 'Mousse Polyuréthane Projetée',    url: '/services/mousse-polyurethane-projetee' },
    ],
  },
  { title: 'Qui Sommes Nous',     url: '/a-propos' },
  { title: 'Nos Réalisations', url: '/realisations' },
  { title: 'Contact & Devis',      url: '/devis' },
];

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export const FOOTER_COPYRIGHT          = `© ${new Date().getFullYear()} Sud Est Chape. Tous droits réservés.`;
export const FOOTER_MENTIONS_URL       = '/mentions-legales';
export const FOOTER_CGV_URL            = '';
export const FOOTER_CONFIDENTIALITE_URL = '/politique-de-confidentialite';
