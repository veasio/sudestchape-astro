# SEO/GEO/AEO Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Optimiser le site Sud Est Chape pour le SEO/GEO/AEO : redirections 301, correction du contenu existant, création des 6 pages services avec FAQ intégrée et Schema.org enrichi.

**Architecture:** Astro statique déployé sur Cloudflare Pages. Pages services individuelles dans `src/pages/services/`. Composant FAQ réutilisable avec Schema FAQPage JSON-LD. Redirections via `public/_redirects`.

**Tech Stack:** Astro 4.x, Cloudflare Pages, CSS BEM existant, Schema.org JSON-LD, composants existants (Default layout, CtaRandom, TestimonialsCompact, Stats, Hero, Breadcrumb)

**Référence design:** `docs/plans/2026-03-25-seo-geo-aeo-design.md`

---

## Task 1 : Redirections 301

**Files:**
- Create: `public/_redirects`

**Step 1 : Créer le fichier `_redirects`**

```
/prestations-solutions/ /services 301
/prestations-solutions /services 301
/prestations-solutions/chape-plancher-chauffant/ /services/chape-anhydrite 301
/prestations-solutions/chape-plancher-chauffant /services/chape-anhydrite 301
/prestations-solutions/chape-isolation-acoustique/ /services/isolation-phonique 301
/prestations-solutions/chape-isolation-acoustique /services/isolation-phonique 301
/prestations-solutions/chape-isolation-thermique/ /services/isolation-thermique 301
/prestations-solutions/chape-isolation-thermique /services/isolation-thermique 301
/prestations-solutions/chape-hors-plancher-chauffant/ /services/chape-ciment 301
/prestations-solutions/chape-hors-plancher-chauffant /services/chape-ciment 301
/prestations-solutions/chape-mise-niveau-sols/ /services/chape-reagreage-ravoirage 301
/prestations-solutions/chape-mise-niveau-sols /services/chape-reagreage-ravoirage 301
/type_chape/mise-niveau-sols/ /services/chape-reagreage-ravoirage 301
/type_chape/mise-niveau-sols /services/chape-reagreage-ravoirage 301
/type_chape/isolation-accoustique/ /services/isolation-phonique 301
/type_chape/isolation-accoustique /services/isolation-phonique 301
/type_chape/isolation-thermique/ /services/isolation-thermique 301
/type_chape/isolation-thermique /services/isolation-thermique 301
/specialiste-chape-liquide/ /a-propos 301
/specialiste-chape-liquide /a-propos 301
/nos-realisations-chapes-fluides/ /realisations 301
/nos-realisations-chapes-fluides /realisations 301
/realisations-chapes-fluides/ /realisations 301
/realisations-chapes-fluides /realisations 301
/informations-devis-chape-liquide/ /devis 301
/informations-devis-chape-liquide /devis 301
/blog-actualites/ / 301
/blog-actualites / 301
/partenariats/* / 301
```

**Step 2 : Vérifier que le fichier existe bien**

```bash
cat public/_redirects | wc -l
# Doit afficher ~30 lignes
```

**Step 3 : Commit**

```bash
git add public/_redirects
git commit -m "feat: redirections 301 ancien site → nouveau (SEO)"
```

---

## Task 2 : Composant FAQ réutilisable

**Files:**
- Create: `src/components/ui/Faq.astro`

Ce composant est réutilisé sur toutes les pages services. Il génère le HTML visible + le Schema FAQPage JSON-LD automatiquement.

**Step 1 : Créer `src/components/ui/Faq.astro`**

```astro
---
interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  items: FaqItem[];
  title?: string;
}

const { items, title = 'Questions fréquentes' } = Astro.props;

const schemaFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": items.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};
---

<section class="faq section section--white" aria-labelledby="faq-title">
  <div class="container">
    <div class="section__header">
      <p class="section__overline">On répond à vos questions</p>
      <h2 class="section__title" id="faq-title">{title}</h2>
    </div>
    <div class="faq__list">
      {items.map((item, i) => (
        <details class="faq__item" name="faq-group">
          <summary class="faq__question">
            <span>{item.question}</span>
            <svg class="faq__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </summary>
          <div class="faq__answer">
            <p set:html={item.answer} />
          </div>
        </details>
      ))}
    </div>
  </div>
</section>

<script type="application/ld+json" set:html={JSON.stringify(schemaFaq)} />
```

**Step 2 : Créer le CSS du composant FAQ dans `src/styles/components/faq.css`**

```css
/* ==========================================================================
   FAQ accordion - sudestchape
   BEM : .faq
   ========================================================================== */

.faq__list {
    max-width: 800px;
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
}

.faq__item {
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius);
    overflow: hidden;
    background: var(--color-white);
}

.faq__item[open] {
    border-color: var(--color-primary);
}

.faq__question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-4);
    padding: var(--spacing-4) var(--spacing-5);
    font-size: var(--fs-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-900);
    cursor: pointer;
    list-style: none;
    user-select: none;
    transition: color var(--transition-base), background var(--transition-base);
}

.faq__question::-webkit-details-marker {
    display: none;
}

.faq__question:hover {
    color: var(--color-primary);
    background: var(--color-accent-light);
}

.faq__item[open] .faq__question {
    color: var(--color-primary);
    background: var(--color-accent-light);
    border-bottom: var(--border-width) solid var(--border-color);
}

.faq__icon {
    flex-shrink: 0;
    transition: transform var(--transition-base);
}

.faq__item[open] .faq__icon {
    transform: rotate(180deg);
}

.faq__answer {
    padding: var(--spacing-4) var(--spacing-5);
    font-size: var(--fs-sm);
    color: var(--color-gray-600);
    line-height: var(--line-height-relaxed);
}

.faq__answer p {
    margin: 0;
}

@media (prefers-reduced-motion: reduce) {
    .faq__icon {
        transition: none;
    }
}
```

**Step 3 : Importer le CSS dans `src/styles/main.css`**

Trouver la ligne des imports de composants dans `src/styles/main.css` et ajouter :
```css
@import './components/faq.css';
```

**Step 4 : Commit**

```bash
git add src/components/ui/Faq.astro src/styles/components/faq.css src/styles/main.css
git commit -m "feat: composant FAQ réutilisable avec Schema FAQPage JSON-LD"
```

---

## Task 3 : Corriger les pages existantes

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/services.astro`
- Modify: `src/pages/a-propos.astro`

### 3a — Corriger `src/pages/index.astro`

**Step 1 : Corriger le title, meta description et Schema.org**

Remplacer :
```astro
<Default
  title="Sud Est Chape – Chape fluide et traditionnelle dans le Sud-Est"
  description="Sud Est Chape, spécialiste de la chape fluide et traditionnelle dans le Sud-Est de la France. Devis gratuit, intervention rapide, qualité certifiée."
  schema={schema}
>
```

Par :
```astro
<Default
  title="Chape Liquide PACA – Applicateur Agréé | Sud Est Chape"
  description="Applicateur agréé de chape liquide depuis 15 ans. 6 équipes disponibles sur Var, Bouches-du-Rhône et Alpes-Maritimes. Devis gratuit sous 24h."
  schema={schema}
>
```

**Step 2 : Corriger le Schema.org de la homepage**

Remplacer la description Organization :
```js
"description": "Spécialiste de la chape fluide et traditionnelle dans le Sud-Est de la France depuis plus de 15 ans.",
```
Par :
```js
"description": "Applicateur agréé de chape liquide dans le Sud-Est de la France depuis plus de 15 ans. 6 équipes disponibles sur Var, Bouches-du-Rhône et Alpes-Maritimes.",
```

**Step 3 : Remplacer la carte "Chape traditionnelle" dans la grille collage**

Remplacer le bloc `{/* Chape traditionnelle */}` (lignes ~91-116) par :
```astro
{/* Chape anhydrite */}
<div class="grid-collage__item">
  <div class="grid-collage__media">
    <img src="/images/optimized/service-chape-anhydrite.webp"
         alt="Chape anhydrite pour plancher chauffant"
         class="grid-collage__img--default"
         width="600" height="400"
         loading="lazy" />
  </div>
  <a href="/services/chape-anhydrite">
    <div class="grid-collage__content">
      <h3 class="grid-collage__title">Chape Anhydrite</h3>
      <p class="grid-collage__subtitle">Idéale plancher chauffant</p>
    </div>
    <span class="grid-collage__arrow" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </span>
  </a>
</div>
```

**Step 4 : Mettre à jour les liens de la grille collage**

- `href="/services#chape-fluide"` → `href="/services/chape-anhydrite"`
- `href="/services#chape-traditionnelle"` → supprimé (remplacé step 3)

**Step 5 : Corriger la section Features (6 équipes)**

Remplacer :
```astro
<p class="card-feature__text">Maîtrise des techniques de chape fluide et traditionnelle depuis 15 ans.</p>
```
Par :
```astro
<p class="card-feature__text">Maîtrise des techniques de chape liquide depuis 15 ans. 6 équipes qualifiées disponibles sur tout le Sud-Est.</p>
```

**Step 6 : Corriger la section Engagements**

Remplacer :
```astro
<p class="engagement__text">Nous utilisons exclusivement des matériaux NF et certifiés, issus de nos partenaires de confiance Lafarge et Weber.</p>
```
Par :
```astro
<p class="engagement__text">Nous utilisons exclusivement des matériaux certifiés CTB-P, issus de nos partenaires agréés Lafarge, Cemex et Vicat.</p>
```

**Step 7 : Corriger les mentions "traditionnelle" dans les textes du feed réalisations**

- `alt="Chape traditionnelle entrepôt Marseille"` → `alt="Chape liquide entrepôt logistique Marseille"`

### 3b — Corriger `src/pages/services.astro`

**Step 1 : Corriger title, meta, Schema**

```astro
const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `Chape liquide et isolation – ${SITE_NAME}`,
  "description": "Applicateur agréé de chape liquide (anhydrite, ciment), ravoirage, isolation phonique et thermique, mousse polyuréthane. Var, Bouches-du-Rhône, Alpes-Maritimes.",
  ...
};
```

```astro
<Default
  title="Nos Services Chape Liquide – Chapiste Agréé PACA | Sud Est Chape"
  description="Chape anhydrite, ciment, ravoirage, isolation phonique et thermique, mousse polyuréthane. Applicateur agréé dans le Var, BdR et Alpes-Maritimes."
  schema={schema}
>
```

**Step 2 : Corriger le H1 et la description hero**

```astro
<h1 class="hero__title">Nos services de chape liquide dans le Sud-Est</h1>
<p class="hero__description">
  Chape anhydrite, ciment, ravoirage, isolation phonique et thermique :
  6 équipes agréées interviennent pour les particuliers et professionnels dans tout le Sud-Est.
</p>
```

**Step 3 : Remplacer tout le contenu de la grille (grid--2)**

Remplacer les 4 cards existantes (chape fluide, chape traditionnelle, devis, qualité) par les 6 services réels :

```astro
<div class="grid grid--3">
  {/* Chape Anhydrite */}
  <a href="/services/chape-anhydrite" class="card-service card-service--link" itemscope itemtype="https://schema.org/Service">
    <div class="card-service__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    </div>
    <h2 class="card-service__title" itemprop="name">Chape Anhydrite</h2>
    <p class="card-service__text" itemprop="description">
      Solution de référence pour les planchers chauffants. Autonivelante, planéité parfaite,
      séchage rapide. Agréé Lafarge, Cemex et Vicat.
    </p>
    <ul class="card-service__features">
      <li>Planéité &lt; 3 mm sous règle de 2 m</li>
      <li>Compatible plancher chauffant/rafraîchissant</li>
      <li>Jusqu'à 1 000 m²/jour</li>
      <li>Séchage en 24-48h</li>
    </ul>
    <span class="card-service__cta">En savoir plus →</span>
  </a>

  {/* Chape Ciment */}
  <a href="/services/chape-ciment" class="card-service card-service--link" itemscope itemtype="https://schema.org/Service">
    <div class="card-service__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    </div>
    <h2 class="card-service__title" itemprop="name">Chape Ciment</h2>
    <p class="card-service__text" itemprop="description">
      Robuste et polyvalente, la chape ciment s'adapte à toutes les configurations.
      Neuf ou rénovation, intérieur ou extérieur, milieux humides.
    </p>
    <ul class="card-service__features">
      <li>Neuf et rénovation</li>
      <li>Milieux humides (salle de bain, terrasse)</li>
      <li>Résistance mécanique élevée</li>
      <li>Conforme DTU 26.2</li>
    </ul>
    <span class="card-service__cta">En savoir plus →</span>
  </a>

  {/* Ravoirage / Réagréage */}
  <a href="/services/chape-reagreage-ravoirage" class="card-service card-service--link" itemscope itemtype="https://schema.org/Service">
    <div class="card-service__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 17l4-8 4 5 3-3 5 6"/>
        <line x1="3" y1="21" x2="21" y2="21"/>
      </svg>
    </div>
    <h2 class="card-service__title" itemprop="name">Ravoirage &amp; Réagréage</h2>
    <p class="card-service__text" itemprop="description">
      Remise à niveau de sol avant pose de revêtement. Rattrapage de niveaux,
      comblement de dénivelés, préparation de chantier.
    </p>
    <ul class="card-service__features">
      <li>Rattrapage de niveaux</li>
      <li>Avant carrelage, parquet, résine</li>
      <li>Rénovation et neuf</li>
      <li>Compatible plancher chauffant</li>
    </ul>
    <span class="card-service__cta">En savoir plus →</span>
  </a>

  {/* Isolation Phonique */}
  <a href="/services/isolation-phonique" class="card-service card-service--link" itemscope itemtype="https://schema.org/Service">
    <div class="card-service__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M15.54 8.46a5 5 0 010 7.07"/>
        <path d="M19.07 4.93a10 10 0 010 14.14"/>
      </svg>
    </div>
    <h2 class="card-service__title" itemprop="name">Isolation Phonique</h2>
    <p class="card-service__text" itemprop="description">
      Réduction des bruits de choc et d'impact entre étages.
      Sous-couches acoustiques + chape liquide pour une conformité optimale.
    </p>
    <ul class="card-service__features">
      <li>Bruits de choc réduits</li>
      <li>Norme NF DTU 26.2</li>
      <li>Copropriété et collectif</li>
      <li>Maisons individuelles</li>
    </ul>
    <span class="card-service__cta">En savoir plus →</span>
  </a>

  {/* Isolation Thermique */}
  <a href="/services/isolation-thermique" class="card-service card-service--link" itemscope itemtype="https://schema.org/Service">
    <div class="card-service__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    </div>
    <h2 class="card-service__title" itemprop="name">Isolation Thermique</h2>
    <p class="card-service__text" itemprop="description">
      Réduction des déperditions thermiques par le sol.
      Compatible plancher chauffant, conforme RE 2020.
    </p>
    <ul class="card-service__features">
      <li>Économies d'énergie</li>
      <li>Compatible plancher chauffant</li>
      <li>Conforme RE 2020</li>
      <li>Neuf et rénovation</li>
    </ul>
    <span class="card-service__cta">En savoir plus →</span>
  </a>

  {/* Mousse Polyuréthane */}
  <a href="/services/mousse-polyurethane-projetee" class="card-service card-service--link" itemscope itemtype="https://schema.org/Service">
    <div class="card-service__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </div>
    <h2 class="card-service__title" itemprop="name">Mousse Polyuréthane Projetée</h2>
    <p class="card-service__text" itemprop="description">
      Isolation par projection de mousse polyuréthane pour vides sanitaires,
      sous-sols et toitures-terrasses.
    </p>
    <ul class="card-service__features">
      <li>Vide sanitaire</li>
      <li>Étanchéité à l'air</li>
      <li>Isolation haute performance</li>
      <li>Toiture-terrasse</li>
    </ul>
    <span class="card-service__cta">En savoir plus →</span>
  </a>
</div>
```

**Step 4 : Ajouter le CSS pour `card-service--link` dans `src/styles/components/cards.css`**

```css
/* Variante cliquable de card-service */
.card-service--link {
    display: block;
    text-decoration: none;
    color: inherit;
    transition: transform var(--transition-base), box-shadow var(--transition-base);
    cursor: pointer;
}

.card-service--link:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.card-service__cta {
    display: inline-block;
    margin-top: var(--spacing-4);
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
    font-size: var(--fs-sm);
}
```

### 3c — Corriger `src/pages/a-propos.astro`

**Step 1 : Corriger title et meta**

```astro
<Default
  title="À propos – Applicateur Agréé Chape Liquide depuis 15 ans | Sud Est Chape"
  description="Sud Est Chape : 15 ans d'expérience, 6 équipes agréées, certifié CTB-P. Applicateur chape liquide dans le Var, Bouches-du-Rhône et Alpes-Maritimes."
>
```

**Step 2 : Corriger les mentions "chape traditionnelle" dans le texte**

Remplacer :
```
"en chape fluide et traditionnelle"
```
Par :
```
"en chape liquide (anhydrite, ciment, ravoirage) et isolation"
```

**Step 3 : Corriger les Stats (6 équipes)**

```astro
<Stats
  stat1Count={500} stat1Suffix="+" stat1Label="Chantiers réalisés"
  stat2Count={15} stat2Suffix=" ans" stat2Label="D'expérience"
  stat3Count={6} stat3Suffix="" stat3Label="Équipes disponibles"
  stat4Count={3} stat4Suffix="" stat4Label="Départements couverts"
  titleId="about-stats-title"
/>
```

**Step 4 : Corriger la section certifications — ajouter les agréments**

Ajouter une 4e card dans la section certifications :
```astro
<div class="card-feature">
  <h3 class="card-feature__title">Agréments fabricants</h3>
  <p class="card-feature__text">
    Applicateur agréé par les principaux fabricants : Lafarge, Cemex, Vicat, Bonifay, Point P.
    Qualité des matériaux garantie.
  </p>
</div>
```

**Step 5 : Commit**

```bash
git add src/pages/index.astro src/pages/services.astro src/pages/a-propos.astro
git commit -m "fix: corriger contenu existant — supprimer chape traditionnelle, 6 équipes, metas SEO"
```

---

## Task 4 : Page service — Chape Anhydrite

**Files:**
- Create: `src/pages/services/chape-anhydrite.astro`

**Step 1 : Créer la page**

```astro
---
import Default from '../../layouts/Default.astro';
import Faq from '../../components/ui/Faq.astro';
import CtaRandom from '../../components/ui/CtaRandom.astro';
import TestimonialsCompact from '../../components/ui/TestimonialsCompact.astro';
import { SITE_NAME, SITE_URL, SITE_PHONE, SCHEMA_ORG_SAME_AS } from '../../config';

const faqItems = [
  {
    question: "Quelle épaisseur pour une chape anhydrite sur plancher chauffant ?",
    answer: "L'épaisseur minimale d'une chape anhydrite sur plancher chauffant est de 40 mm au-dessus des tubes. Cette épaisseur garantit une diffusion homogène de la chaleur et une résistance mécanique suffisante. Pour des planchers rayonnants à eau, on recommande 45 à 55 mm pour optimiser les performances thermiques."
  },
  {
    question: "Quel est le temps de séchage d'une chape anhydrite ?",
    answer: "Une chape anhydrite est praticable à pied en 24 à 48h. Le séchage complet avant pose de revêtement prend environ 1 semaine par centimètre d'épaisseur dans de bonnes conditions (20°C, humidité < 65%). Une mesure d'humidité résiduelle (CM test) est recommandée avant tout revêtement sensible à l'humidité."
  },
  {
    question: "Comment faire la mise en chauffe d'une chape anhydrite ?",
    answer: "La mise en chauffe d'une chape anhydrite doit commencer au plus tôt 7 jours après la pose, une fois la chape suffisamment sèche. Démarrer à 25°C pendant 3 jours, puis monter progressivement jusqu'à la température d'utilisation sur 7 jours. Cette procédure est obligatoire pour éviter les fissures et préparer la chape à la dilatation thermique."
  },
  {
    question: "Chape anhydrite ou chape ciment : laquelle choisir ?",
    answer: "La chape anhydrite est préférée pour les planchers chauffants car elle conduit mieux la chaleur et se fissure moins. La chape ciment est recommandée dans les pièces humides (salle de bain, terrasse) car l'anhydrite y est déconseillée. Pour une construction neuve avec plancher chauffant, l'anhydrite est le choix optimal."
  },
  {
    question: "La chape anhydrite est-elle compatible avec tous les revêtements ?",
    answer: "La chape anhydrite est compatible avec carrelage, parquet (collé ou flottant), résine et moquette. Elle est incompatible avec les pièces humides. Avant la pose de carrelage, un primaire d'accrochage est nécessaire. Pour le parquet, une humidité résiduelle inférieure à 0,5% CM est requise."
  }
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${SITE_URL}/services/chape-anhydrite#service`,
      "name": "Pose de chape anhydrite",
      "description": "Application de chape anhydrite autonivelante pour plancher chauffant dans le Var, Bouches-du-Rhône et Alpes-Maritimes. Applicateur agréé Lafarge, Cemex et Vicat.",
      "provider": {
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "telephone": SITE_PHONE,
        "sameAs": SCHEMA_ORG_SAME_AS
      },
      "areaServed": ["Var", "Bouches-du-Rhône", "Alpes-Maritimes"],
      "serviceType": "Chape anhydrite",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Chape anhydrite"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Nos services", "item": `${SITE_URL}/services` },
        { "@type": "ListItem", "position": 3, "name": "Chape anhydrite", "item": `${SITE_URL}/services/chape-anhydrite` }
      ]
    }
  ]
};
---

<Default
  title="Chape Anhydrite – Plancher Chauffant | Applicateur Agréé PACA | Sud Est Chape"
  description="Pose de chape anhydrite autonivelante pour plancher chauffant dans le Var et PACA. Applicateur agréé Lafarge. Épaisseur, séchage, mise en chauffe. Devis gratuit."
  schema={schema}
>

  {/* Hero */}
  <section class="hero hero--small" aria-label="Chape anhydrite">
    <div class="hero__background">
      <img src="/images/optimized/hero-chape-anhydrite.webp"
           alt="Application de chape anhydrite sur plancher chauffant"
           width="1920" height="600"
           loading="eager"
           fetchpriority="high" />
    </div>
    <div class="container">
      <div class="hero__content">
        <p class="hero__overline">Nos services</p>
        <h1 class="hero__title">Chape Anhydrite — Plancher Chauffant</h1>
        <p class="hero__description">
          Applicateur agréé de chape anhydrite autonivelante dans le Var, les Bouches-du-Rhône
          et les Alpes-Maritimes. La solution de référence pour vos planchers chauffants.
        </p>
        <a href="/devis" class="btn btn--cta btn--lg">
          Devis gratuit sous 24h
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </section>

  {/* Contenu principal */}
  <section class="section section--rounded section--white" aria-labelledby="anhydrite-intro-title">
    <div class="container">
      <div class="grid grid--2" style="align-items: start; gap: var(--spacing-12);">
        <div>
          <p class="section__overline">Expertise chape liquide</p>
          <h2 class="section__title" id="anhydrite-intro-title" style="text-align:left;">
            La chape anhydrite : pourquoi c'est la meilleure solution pour votre plancher chauffant
          </h2>
          <p>
            La chape anhydrite (ou chape fluide au sulfate de calcium) est aujourd'hui la référence
            pour tous les planchers chauffants. Autonivelante, elle se répand naturellement
            pour former une surface parfaitement plane sans intervention manuelle.
          </p>
          <p>
            Grâce à sa conductivité thermique supérieure à celle du ciment, elle optimise
            les performances de votre plancher chauffant et réduit la consommation d'énergie.
          </p>
          <p>
            <strong>Sud Est Chape est applicateur agréé</strong> par les principaux fabricants
            (Lafarge, Cemex, Vicat) — garantie de qualité des matériaux et de mise en œuvre
            conforme aux normes DTU 26.2.
          </p>
        </div>
        <div>
          <div class="card-feature" style="background: var(--color-accent-light);">
            <h3 class="card-feature__title">Les atouts de la chape anhydrite</h3>
            <ul class="card-service__features" style="margin-top: var(--spacing-3);">
              <li>Planéité parfaite &lt; 3 mm sous règle de 2 m</li>
              <li>Jusqu'à 1 000 m² coulés par jour</li>
              <li>Compatible plancher chauffant et rafraîchissant</li>
              <li>Praticable en 24-48h</li>
              <li>Moins de fissures que le ciment</li>
              <li>Meilleure conductivité thermique</li>
              <li>Agréé Lafarge, Cemex, Vicat</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Zone d'intervention */}
  <section class="section section--accent section--rounded animate-on-scroll" aria-labelledby="zone-anhydrite-title">
    <div class="container">
      <div class="section__header">
        <p class="section__overline">Intervention rapide</p>
        <h2 class="section__title" id="zone-anhydrite-title">
          Applicateur chape anhydrite dans tout le Sud-Est
        </h2>
      </div>
      <div class="grid grid--3">
        <div class="card-feature">
          <h3 class="card-feature__title">Var (83)</h3>
          <p class="card-feature__text">
            Toulon, Six-Fours-les-Plages, La Seyne-sur-Mer, Hyères,
            Fréjus, Saint-Raphaël, Sainte-Maxime, Saint-Tropez, Draguignan
          </p>
        </div>
        <div class="card-feature">
          <h3 class="card-feature__title">Bouches-du-Rhône (13)</h3>
          <p class="card-feature__text">
            Marseille, Aix-en-Provence, Aubagne, La Ciotat,
            Martigues, Salon-de-Provence
          </p>
        </div>
        <div class="card-feature">
          <h3 class="card-feature__title">Alpes-Maritimes (06)</h3>
          <p class="card-feature__text">
            Nice, Cannes, Antibes, Mougins,
            Sophia Antipolis, Grasse, Cagnes-sur-Mer
          </p>
        </div>
      </div>
    </div>
  </section>

  {/* FAQ */}
  <Faq
    title="Tout savoir sur la chape anhydrite"
    items={faqItems}
  />

  {/* Témoignages */}
  <TestimonialsCompact title="Ils nous ont fait confiance pour leur plancher chauffant" />

  {/* CTA */}
  <CtaRandom />

</Default>
```

**Step 2 : Commit**

```bash
git add src/pages/services/chape-anhydrite.astro
git commit -m "feat: page service chape anhydrite — contenu SEO + FAQ + Schema"
```

---

## Task 5 : Page service — Chape Ciment

**Files:**
- Create: `src/pages/services/chape-ciment.astro`

Structure identique à la page chape-anhydrite. Contenu spécifique :

**Title :** `Chape Ciment – Pose et Application | Chapiste PACA | Sud Est Chape`
**Meta :** `Application de chape ciment pour particuliers et professionnels dans le Var et PACA. Chapiste certifié CTB-P. Plancher chauffant, rénovation, neuf. Devis gratuit.`
**H1 :** `Chape Ciment — Chapiste Certifié dans le Var et PACA`

**FAQ items :**
```js
const faqItems = [
  {
    question: "Quelle différence entre chape ciment et chape anhydrite ?",
    answer: "La chape ciment est à base de Portland, robuste, adaptée aux milieux humides et extérieurs. La chape anhydrite est à base de sulfate de calcium, autonivelante, idéale pour planchers chauffants mais déconseillée dans les pièces humides. Pour un plancher chauffant en zone sèche, l'anhydrite est préférable. Pour une terrasse ou salle de bain, la chape ciment est obligatoire."
  },
  {
    question: "La chape ciment est-elle compatible avec le plancher chauffant ?",
    answer: "Oui, la chape ciment est compatible avec les planchers chauffants, avec quelques précautions. L'épaisseur minimale est de 65 mm sur les tubes (contre 40 mm pour l'anhydrite). Des joints de dilatation sont obligatoires. La montée en température doit être progressive. L'anhydrite reste cependant plus performante thermiquement pour cet usage."
  },
  {
    question: "Quel délai avant de poser du carrelage sur chape ciment ?",
    answer: "Il faut attendre que la chape ciment soit suffisamment sèche avant de poser du carrelage : minimum 28 jours pour une chape standard de 5 cm dans de bonnes conditions (20°C, 65% HR). Le taux d'humidité résiduel doit être inférieur à 3% (mesure CM). En cas d'utilisation d'un primaire d'accrochage, respecter le délai indiqué par le fabricant."
  },
  {
    question: "Peut-on faire une chape ciment en extérieur ?",
    answer: "Oui, la chape ciment est adaptée aux applications extérieures (terrasses, allées, garages). Elle résiste à l'humidité et aux cycles gel/dégel contrairement à la chape anhydrite. Pour les extérieurs, on recommande une épaisseur de 80 à 100 mm avec un treillis soudé et des joints de dilatation tous les 3 à 5 m."
  },
  {
    question: "Quel est le coût d'une chape ciment au m² ?",
    answer: "Le coût d'une chape ciment varie selon l'épaisseur, la surface et la préparation du support. Pour une estimation précise et gratuite, contactez-nous : notre technicien se déplace sur votre chantier pour un relevé de mesures et un devis détaillé sans engagement."
  }
];
```

**Commit :**
```bash
git add src/pages/services/chape-ciment.astro
git commit -m "feat: page service chape ciment — contenu SEO + FAQ + Schema"
```

---

## Task 6 : Page service — Ravoirage & Réagréage

**Files:**
- Create: `src/pages/services/chape-reagreage-ravoirage.astro`

**Title :** `Ravoirage et Réagréage Sol – Mise à Niveau | Sud Est Chape PACA`
**Meta :** `Remise à niveau de sol par ravoirage ou réagréage dans le Var, BdR et Alpes-Maritimes. Chapiste agréé. Rattrapage de niveaux, rénovation. Devis gratuit.`
**H1 :** `Ravoirage & Réagréage — Remise à Niveau de Sol dans le Sud-Est`

**FAQ items :**
```js
const faqItems = [
  {
    question: "Quelle différence entre ravoirage et réagréage ?",
    answer: "Le ravoirage est une couche de forme épaisse (3 à 15 cm) qui permet de rattraper des niveaux importants, d'enrober des réseaux (tubes, câbles) ou de créer une pente. Le réagréage est une fine couche (2 à 10 mm) destinée à lisser et parfaire une surface avant pose de revêtement. On fait d'abord le ravoirage si nécessaire, puis le réagréage en finition."
  },
  {
    question: "Quand faut-il faire un ravoirage ?",
    answer: "Un ravoirage est nécessaire quand le sol présente des dénivelés supérieurs à 20 mm, lors de la rénovation d'un ancien plancher, pour enrober un plancher chauffant, ou pour créer une pente d'écoulement (douche à l'italienne, terrasse). C'est aussi utilisé pour rehausser un niveau ou combler un vide technique."
  },
  {
    question: "Peut-on faire un ravoirage sur plancher chauffant ?",
    answer: "Oui, le ravoirage sur plancher chauffant est une technique courante. Elle permet d'enrober les tubes du plancher chauffant tout en remettant le sol à niveau. Dans ce cas, on utilise une chape liquide (anhydrite ou ciment) pour une mise en œuvre optimale. L'épaisseur au-dessus des tubes doit respecter les préconisations du fabricant (minimum 40 mm pour l'anhydrite)."
  },
  {
    question: "Combien de temps faut-il pour sécher après un ravoirage ?",
    answer: "Le temps de séchage d'un ravoirage dépend du produit utilisé et de l'épaisseur. Pour une chape ciment de 5 cm, comptez 4 semaines dans de bonnes conditions. Pour une chape anhydrite, le séchage est plus rapide : 1 semaine par cm d'épaisseur. Dans tous les cas, une mesure d'humidité résiduelle est recommandée avant pose du revêtement."
  }
];
```

**Commit :**
```bash
git add src/pages/services/chape-reagreage-ravoirage.astro
git commit -m "feat: page service ravoirage réagréage — contenu SEO + FAQ + Schema"
```

---

## Task 7 : Page service — Isolation Phonique

**Files:**
- Create: `src/pages/services/isolation-phonique.astro`

**Title :** `Isolation Phonique Sol – Chape Acoustique | Var & PACA | Sud Est Chape`
**Meta :** `Isolation phonique sous chape pour réduire les bruits de choc et d'impact. Applicateur agréé dans le Var, Marseille et Alpes-Maritimes. Norme NF DTU 26.2. Devis gratuit.`
**H1 :** `Isolation Phonique Sous Chape — Spécialiste PACA`

**FAQ items :**
```js
const faqItems = [
  {
    question: "Comment réduire les bruits de choc entre étages ?",
    answer: "La solution la plus efficace pour réduire les bruits de choc (bruit de pas, chutes d'objets) est la pose d'une sous-couche acoustique sous chape. Cette sous-couche désolidarise le sol flottant de la structure du bâtiment. Combinée à une chape liquide, elle offre les meilleures performances acoustiques avec un résultat conforme aux normes NF DTU 26.2."
  },
  {
    question: "Quelle épaisseur de chape pour une bonne isolation phonique ?",
    answer: "Pour une isolation phonique optimale, la chape flottante doit avoir une épaisseur minimale de 40 mm sur la sous-couche acoustique. Cette épaisseur assure la masse nécessaire à l'absorption des vibrations. L'épaisseur totale (sous-couche + chape) est généralement de 45 à 60 mm selon les contraintes du plancher."
  },
  {
    question: "L'isolation phonique est-elle obligatoire en rénovation ?",
    answer: "Dans les logements collectifs en rénovation, l'isolation phonique n'est pas toujours obligatoire légalement, mais elle est fortement recommandée et peut être exigée par le règlement de copropriété. En construction neuve, la réglementation acoustique (NRA) impose des niveaux de performance précis. Nous vous conseillons sur les obligations applicables à votre projet."
  },
  {
    question: "La chape acoustique est-elle compatible avec le plancher chauffant ?",
    answer: "Oui, il est tout à fait possible de combiner isolation phonique et plancher chauffant. Certaines sous-couches acoustiques sont spécifiquement conçues pour cet usage, avec une résistance thermique (Rλ) faible pour ne pas dégrader les performances du plancher chauffant. Nous sélectionnons les produits adaptés à votre configuration."
  }
];
```

**Commit :**
```bash
git add src/pages/services/isolation-phonique.astro
git commit -m "feat: page service isolation phonique — contenu SEO + FAQ + Schema"
```

---

## Task 8 : Page service — Isolation Thermique

**Files:**
- Create: `src/pages/services/isolation-thermique.astro`

**Title :** `Isolation Thermique Sol – Chape Isolante | Var & PACA | Sud Est Chape`
**Meta :** `Isolation thermique de sol par chape isolante dans le Var et PACA. Réduction des déperditions, plancher chauffant, RE 2020. Certifié CTB-P. Devis gratuit.`
**H1 :** `Isolation Thermique de Sol — Applicateur Agréé dans le Sud-Est`

**FAQ items :**
```js
const faqItems = [
  {
    question: "Quel isolant mettre sous une chape liquide ?",
    answer: "Les isolants les plus utilisés sous chape liquide sont le polystyrène expansé (PSE), le polyuréthane (PU) et la laine minérale. Le choix dépend de la résistance thermique recherchée (R), de la compressibilité (le sol doit supporter la charge), et de la compatibilité avec l'éventuel plancher chauffant. Nous vous recommandons le produit adapté à votre projet et aux normes RE 2020."
  },
  {
    question: "La chape liquide est-elle isolante ?",
    answer: "La chape liquide seule n'est pas un isolant thermique efficace. En revanche, combinée à un isolant (polystyrène, polyuréthane), elle forme un complexe sol isolant très performant. L'isolant se pose sur le plancher porteur, puis la chape liquide est coulée par-dessus. Cette solution est conforme aux exigences de la réglementation thermique RE 2020."
  },
  {
    question: "Isolation thermique et plancher chauffant : comment ça fonctionne ?",
    answer: "Dans un système plancher chauffant, l'isolant se place SOUS les tubes pour diriger la chaleur vers le haut (la pièce à chauffer) et non vers le bas (plancher porteur). L'isolant doit avoir une résistance thermique R ≥ 1,2 m².K/W en rénovation et R ≥ 2 m².K/W en construction neuve selon la RE 2020. La chape anhydrite est ensuite coulée au-dessus des tubes."
  },
  {
    question: "Peut-on améliorer l'isolation thermique d'un sol existant ?",
    answer: "Oui, la rénovation thermique d'un sol existant est possible. La solution la plus courante est la dépose du revêtement existant, pose d'un isolant mince haute performance, puis coulage d'une chape liquide. Cette intervention augmente légèrement la hauteur du plancher fini (généralement 5 à 10 cm). Une autre option est l'injection de mousse polyuréthane dans le vide sanitaire si vous en disposez."
  }
];
```

**Commit :**
```bash
git add src/pages/services/isolation-thermique.astro
git commit -m "feat: page service isolation thermique — contenu SEO + FAQ + Schema"
```

---

## Task 9 : Page service — Mousse Polyuréthane Projetée

**Files:**
- Create: `src/pages/services/mousse-polyurethane-projetee.astro`

**Title :** `Mousse Polyuréthane Projetée – Isolation Sol | PACA | Sud Est Chape`
**Meta :** `Application de mousse polyuréthane projetée pour isolation sol et vide sanitaire dans le Var et PACA. Entreprise agréée. Devis gratuit.`
**H1 :** `Mousse Polyuréthane Projetée — Isolation Sol dans le Sud-Est`

**FAQ items :**
```js
const faqItems = [
  {
    question: "La mousse polyuréthane projetée est-elle durable ?",
    answer: "Oui, la mousse polyuréthane projetée a une durée de vie de 30 à 50 ans lorsqu'elle est correctement appliquée et protégée des UV. Elle ne se tasse pas dans le temps contrairement aux isolants en vrac. Sa résistance à l'humidité en fait un choix idéal pour les vides sanitaires et sous-sols."
  },
  {
    question: "Peut-on couler une chape sur de la mousse polyuréthane ?",
    answer: "Oui, il est possible de couler une chape sur de la mousse polyuréthane projetée, à condition que celle-ci soit suffisamment dense (≥ 40 kg/m³) pour supporter la charge de la chape sans se comprimer. Une densité insuffisante entraînerait une déformation de la chape. Nous sélectionnons systématiquement des mousses adaptées à la pose de chape."
  },
  {
    question: "La mousse polyuréthane remplace-t-elle l'isolant sous chape ?",
    answer: "La mousse polyuréthane projetée peut remplacer les isolants classiques (PSE, laine minérale) sous chape, avec certains avantages : pas de découpe, pas de joints, application parfaitement continue sans pont thermique. Elle s'applique en une seule opération et adhère au support. C'est la solution idéale pour les formes complexes et les vides sanitaires."
  },
  {
    question: "Quel est le coût de la mousse polyuréthane projetée ?",
    answer: "Le coût de la mousse polyuréthane projetée varie selon l'épaisseur, la surface et l'accessibilité du chantier. Pour une estimation précise et gratuite, contactez-nous. Notre technicien se déplace sur votre chantier pour évaluer la faisabilité et établir un devis détaillé sans engagement."
  }
];
```

**Commit :**
```bash
git add src/pages/services/mousse-polyurethane-projetee.astro
git commit -m "feat: page service mousse polyuréthane projetée — contenu SEO + FAQ + Schema"
```

---

## Task 10 : Vérification build et déploiement

**Step 1 : Build local**

```bash
cd /c/Users/suppo/projets/sudestchape-astro
npm run build 2>&1 | tail -20
```

Attendu : `dist/` généré sans erreurs

**Step 2 : Vérifier les pages services dans le build**

```bash
ls dist/services/
# Doit afficher : chape-anhydrite/ chape-ciment/ chape-reagreage-ravoirage/ isolation-phonique/ isolation-thermique/ mousse-polyurethane-projetee/
```

**Step 3 : Vérifier que les redirections sont dans le build**

```bash
cat dist/_redirects | head -10
# Doit afficher les lignes de redirections 301
```

**Step 4 : Push et déploiement**

```bash
git push origin master
```

**Step 5 : Vérifier le déploiement**

```bash
gh run list --limit 3
# Attendre le statut "completed success"
```

---

## Notes d'implémentation

### Images manquantes
Les pages services référencent des images hero qui n'existent peut-être pas encore :
- `/images/optimized/hero-chape-anhydrite.webp`
- `/images/optimized/hero-chape-ciment.webp`
- etc.

**En attendant les vraies images :** utiliser `/images/optimized/hero-services.webp` comme fallback sur toutes les pages services.

### CSS cards.css
Vérifier que `src/styles/components/cards.css` existe et importer le CSS `.card-service--link` ajouté en Task 3b Step 4.

### Navigation
Le menu NAV_ITEMS dans `src/config.ts` pointe déjà vers les bonnes URLs — rien à modifier.

### Sitemap
Astro génère automatiquement le sitemap via `@astrojs/sitemap` — les nouvelles pages seront incluses automatiquement si la config `site` est correcte dans `astro.config.mjs`.
