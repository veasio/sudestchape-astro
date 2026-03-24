# SEO / GEO / AEO — Plan stratégique Sud Est Chape

> **Statut :** Validé par le client — 25 mars 2026
> **Objectif :** Remplacer sudestchape.fr avec un site optimisé SEO/GEO/AEO, préserver l'historique, conquérir de nouvelles positions.

---

## 1. Contexte & contraintes

- **Société :** Sud Est Chape SARL — Six-Fours-les-Plages (83)
- **Spécialité :** Chape **liquide uniquement** (anhydrite, ciment, réagréage) + isolations — ❌ jamais "chape traditionnelle"
- **Zone :** Var (base historique) + Bouches-du-Rhône + Alpes-Maritimes
- **Différenciateurs :** 6 équipes, 15 ans d'expérience, certifié CTB-P, agréé (Cemex, Lafarge, Vicat, Bonifay, Point P), réputation locale forte
- **Cibles :** Particuliers ET professionnels — discours accessible à tous
- **Stratégie :** Conquête de marché, pas de blog, contenu informatif intégré dans les pages
- **Migration :** Remplacement du site actuel → redirections 301 obligatoires

---

## 2. Architecture des pages

### Pages existantes (à optimiser)

| Page | URL | Priorité |
|------|-----|----------|
| Accueil | `/` | 🔴 Urgente |
| Services (hub) | `/services` | 🔴 Urgente |
| Réalisations | `/realisations` | 🟡 Moyenne |
| À propos | `/a-propos` | 🟡 Moyenne |
| Devis | `/devis` | 🟡 Moyenne |
| Contact | `/contact` | 🟠 Standard |

### Pages services à créer

| Page | URL | Statut |
|------|-----|--------|
| Chape Anhydrite | `/services/chape-anhydrite` | ❌ À créer |
| Chape Ciment | `/services/chape-ciment` | ❌ À créer |
| Réagréage / Ravoirage | `/services/chape-reagreage-ravoirage` | ❌ À créer |
| Isolation Phonique | `/services/isolation-phonique` | ❌ À créer |
| Isolation Thermique | `/services/isolation-thermique` | ❌ À créer |
| Mousse Polyuréthane Projetée | `/services/mousse-polyurethane-projetee` | ❌ À créer |

---

## 3. Redirections 301 (ancien site → nouveau)

**Critiques — à implémenter avant mise en production**

| Ancienne URL | → Nouvelle URL | Impressions GSC |
|---|---|---|
| `/prestations-solutions/` | `/services` | 526 |
| `/prestations-solutions/chape-plancher-chauffant/` | `/services/chape-anhydrite` | 510 |
| `/specialiste-chape-liquide/` | `/a-propos` | 370 |
| `/nos-realisations-chapes-fluides/` | `/realisations` | 231 |
| `/informations-devis-chape-liquide/` | `/devis` | 229 |
| `/prestations-solutions/chape-isolation-acoustique/` | `/services/isolation-phonique` | 205 |
| `/prestations-solutions/chape-isolation-thermique/` | `/services/isolation-thermique` | 182 |
| `/realisations-chapes-fluides/` | `/realisations` | 160 |
| `/type_chape/mise-niveau-sols/` | `/services/chape-reagreage-ravoirage` | 137 |
| `/prestations-solutions/chape-mise-niveau-sols/` | `/services/chape-reagreage-ravoirage` | 130 |
| `/prestations-solutions/chape-hors-plancher-chauffant/` | `/services/chape-ciment` | 132 |
| `/type_chape/isolation-accoustique/` | `/services/isolation-phonique` | — |
| `/type_chape/isolation-thermique/` | `/services/isolation-thermique` | — |
| `/blog-actualites/` | `/` | 28 |
| `/partenariats/*` | `/a-propos` | — |

**Implémentation :** fichier `public/_redirects` (Cloudflare Pages) + `astro.config.mjs`

---

## 4. Stratégie mots-clés par page

### Pages existantes

| Page | Mot-clé principal | Mots-clés secondaires | Position actuelle | Objectif |
|------|------------------|-----------------------|-------------------|----------|
| Accueil | `chape liquide` | chapiste Var, entreprise chape liquide, applicateur chape agréé PACA | 10.9 | Top 3 |
| Services (hub) | `chapiste` | chape fluide PACA, pose chape, spécialiste chape | 10.31 | Top 5 |
| À propos | `applicateur chape agréé` | certifié CTB-P, 6 équipes, 15 ans expérience | — | — |
| Réalisations | `réalisations chape fluide` | chantiers chape Var, photos chape Toulon | 23.62 | Top 10 |
| Devis | `devis chape liquide` | devis chape gratuit, tarif chape fluide | 26.8 | Top 5 |

### Pages services à créer

| Page | Mot-clé principal | Mots-clés secondaires | Position actuelle | Objectif |
|------|------------------|-----------------------|-------------------|----------|
| Chape Anhydrite | `chape anhydrite` | chape anhydrite plancher chauffant, épaisseur chape anhydrite, temps séchage, mise en chauffe | Faible | Top 3 |
| Chape Ciment | `chape ciment` | chape ciment plancher chauffant, chape béton PACA, chapiste ciment Toulon | — | Top 5 |
| Réagréage/Ravoirage | `mise à niveau sols` | ravoirage plancher chauffant, ragréage sol Var, remise à niveau | 16.13 | Top 5 |
| Isolation Phonique | `isolation acoustique sol` | chape acoustique, isolation phonique sous chape, bruit de choc | 36.99 | Top 5 |
| Isolation Thermique | `isolation thermique sol` | chape isolante thermique, isolation sol PACA, résistance thermique | 23.94 | Top 5 |
| Mousse Polyuréthane | `mousse polyuréthane projetée PACA` | isolation mousse projetée Var, chape polyuréthane | 4.09 | Top 3 |

### Mots-clés géolocalisés transversaux

Intégrés dans **toutes les pages** — mentions naturelles dans le contenu et Schema.org :

- **Var (83) :** Toulon, Six-Fours-les-Plages, La Seyne-sur-Mer, Draguignan, Fréjus, Hyères, Saint-Raphaël, Sainte-Maxime, Saint-Tropez
- **Bouches-du-Rhône (13) :** Marseille, Aix-en-Provence, Aubagne, La Ciotat
- **Alpes-Maritimes (06) :** Nice, Cannes, Antibes, Mougins, Sophia Antipolis

---

## 5. Structure de contenu par page

### Règles générales (toutes les pages)
- ❌ Supprimer toute mention de "chape traditionnelle"
- ✅ Toujours "chape liquide" ou "chape fluide" (jamais "traditionnelle")
- ✅ Mentionner les 6 équipes (pas 3)
- ✅ Zone d'intervention : Var, Bouches-du-Rhône, Alpes-Maritimes
- ✅ Certifications en évidence : CTB-P, agréments fabricants
- ✅ Discours double registre : accessible particuliers + professionnel BTP
- ✅ CTA devis gratuit sur chaque page

---

### Accueil `/`

**Objectif :** Convertir les 2 360 impressions en clics (CTR actuel 2.29% → objectif 5%+)

**Title (nouveau) :** `Chape Liquide PACA – Applicateur Agréé | Sud Est Chape`
**Meta description :** `Applicateur agréé de chape liquide depuis 15 ans. 6 équipes disponibles sur Var, Bouches-du-Rhône et Alpes-Maritimes. Devis gratuit sous 24h.`

**Contenu à retravailler :**
- H1 : "Applicateur agréé de chape liquide dans le Sud-Est"
- Hero : insister sur les 6 équipes, la disponibilité, la certification
- Section services : pointer vers les 6 pages services individuelles
- Chiffres clés : 15 ans, 6 équipes, X m² coulés, X chantiers
- Zone d'intervention : carte ou liste des départements/villes
- FAQ intégrée : 3-5 questions (qu'est-ce que la chape liquide, délai d'intervention, devis gratuit...)
- Témoignages : avec localisation ville + type de chantier

---

### Page services hub `/services`

**Objectif :** Hub de navigation vers les 6 pages services + positionnement "chapiste PACA"

**Title :** `Nos Services Chape Liquide – Chapiste Agréé PACA | Sud Est Chape`
**Meta description :** `Chape anhydrite, ciment, réagréage, isolation phonique et thermique, mousse polyuréthane. Applicateur agréé dans le Var, BdR et Alpes-Maritimes.`

**Contenu :**
- Intro : positionnement global, 6 équipes, zone PACA
- Grille 6 services avec lien vers page dédiée + accroche courte
- Avantages transversaux (certifications, délais, devis gratuit)

---

### Page Chape Anhydrite `/services/chape-anhydrite`

**Title :** `Chape Anhydrite – Plancher Chauffant | Applicateur Agréé PACA`
**Meta description :** `Pose de chape anhydrite autonivelante pour plancher chauffant dans le Var et PACA. Applicateur agréé Lafarge. Épaisseur, séchage, mise en chauffe. Devis gratuit.`

**Structure de contenu :**
1. **H1 :** Chape Anhydrite — Applicateur Agréé dans le Sud-Est
2. **Intro :** qu'est-ce que la chape anhydrite, pourquoi c'est la référence plancher chauffant (accessible)
3. **Avantages :** planéité parfaite, séchage rapide, compatible plancher chauffant/rafraîchissant
4. **Nos agréments :** Lafarge, Cemex, Vicat (social proof technique)
5. **Zone d'intervention :** Var, BdR, AM — villes clés mentionnées
6. **FAQ intégrée (Schema FAQPage) :**
   - Quelle épaisseur pour une chape anhydrite sur plancher chauffant ?
   - Quel est le temps de séchage d'une chape anhydrite ?
   - Comment faire la mise en chauffe d'une chape anhydrite ?
   - Chape anhydrite ou chape ciment : laquelle choisir ?
   - La chape anhydrite est-elle compatible avec tous les revêtements ?
7. **CTA :** Demander un devis gratuit

---

### Page Chape Ciment `/services/chape-ciment`

**Title :** `Chape Ciment – Pose et Application | Chapiste PACA | Sud Est Chape`
**Meta description :** `Application de chape ciment pour particuliers et professionnels dans le Var et PACA. Chapiste certifié CTB-P. Plancher chauffant, rénovation, neuf. Devis gratuit.`

**Structure de contenu :**
1. H1 : Chape Ciment — Chapiste Certifié dans le Var et PACA
2. Présentation : usage, avantages vs anhydrite selon contexte
3. Cas d'usage : rénovation, neuf, extérieur, milieux humides
4. Certifications + agréments
5. Zone d'intervention
6. FAQ intégrée :
   - Quelle différence entre chape ciment et chape anhydrite ?
   - La chape ciment est-elle compatible avec le plancher chauffant ?
   - Quel délai pour poser du carrelage sur chape ciment ?
7. CTA devis

---

### Page Réagréage/Ravoirage `/services/chape-reagreage-ravoirage`

**Title :** `Ravoirage et Réagréage Sol – Mise à Niveau | Sud Est Chape PACA`
**Meta description :** `Remise à niveau de sol par ravoirage ou réagréage dans le Var, BdR et Alpes-Maritimes. Chapiste agréé. Rattrapage de niveaux, rénovation. Devis gratuit.`

**Structure de contenu :**
1. H1 : Ravoirage et Réagréage — Remise à Niveau de Sol dans le Sud-Est
2. Différence ravoirage / réagréage (contenu AEO : les gens cherchent cette distinction)
3. Cas d'usage : rattrapage de niveaux, rénovation avant carrelage/parquet
4. Zone d'intervention
5. FAQ intégrée :
   - Quelle différence entre ravoirage et réagréage ?
   - Quand faut-il faire un ravoirage ?
   - Peut-on faire un ravoirage sur plancher chauffant ?
6. CTA devis

---

### Page Isolation Phonique `/services/isolation-phonique`

**Title :** `Isolation Phonique Sol – Chape Acoustique | Var & PACA | Sud Est Chape`
**Meta description :** `Isolation phonique sous chape pour réduire les bruits de choc et d'impact. Applicateur agréé dans le Var, Marseille et Alpes-Maritimes. Norme NF DTU 26.2. Devis gratuit.`

**Structure de contenu :**
1. H1 : Isolation Phonique Sous Chape — Spécialiste PACA
2. Présentation : pourquoi isoler phoniquement, normes (RT 2020, DTU)
3. Solutions proposées : sous-couches acoustiques + chape liquide
4. Avantages : bruits de choc, bruits aériens, conformité copropriété
5. FAQ intégrée :
   - Comment réduire les bruits de choc entre étages ?
   - Quelle épaisseur de chape pour une bonne isolation phonique ?
   - L'isolation phonique est-elle obligatoire en rénovation ?
6. CTA devis

---

### Page Isolation Thermique `/services/isolation-thermique`

**Title :** `Isolation Thermique Sol – Chape Isolante | Var & PACA | Sud Est Chape`
**Meta description :** `Isolation thermique de sol par chape isolante dans le Var et PACA. Réduction des déperditions, plancher chauffant. Certifié CTB-P. Devis gratuit.`

**Structure de contenu :**
1. H1 : Isolation Thermique de Sol — Applicateur Agréé dans le Sud-Est
2. Enjeux : déperditions thermiques, économies d'énergie, RE 2020
3. Solutions : isolant sous chape + chape liquide
4. Compatibilité plancher chauffant
5. FAQ intégrée :
   - Quel isolant mettre sous une chape liquide ?
   - La chape liquide est-elle isolante ?
   - Isolation thermique et plancher chauffant : comment ça fonctionne ?
6. CTA devis

---

### Page Mousse Polyuréthane `/services/mousse-polyurethane-projetee`

**Title :** `Mousse Polyuréthane Projetée – Isolation Sol | PACA | Sud Est Chape`
**Meta description :** `Application de mousse polyuréthane projetée pour isolation sol et vide sanitaire dans le Var et PACA. Entreprise agréée. Devis gratuit.`

**Structure de contenu :**
1. H1 : Mousse Polyuréthane Projetée — Isolation Sol dans le Sud-Est
2. Présentation technique accessible : qu'est-ce que la mousse PU projetée
3. Avantages : étanchéité à l'air, isolation thermique, vide sanitaire
4. Cas d'usage : vide sanitaire, sous-sol, toiture terrasse
5. FAQ intégrée :
   - La mousse polyuréthane projetée est-elle durable ?
   - Peut-on couler une chape sur de la mousse polyuréthane ?
   - Quel est le coût de la mousse polyuréthane projetée ?
6. CTA devis

---

### Page À propos `/a-propos`

**Corrections prioritaires :**
- Supprimer toute mention "chape traditionnelle"
- Mettre à jour : 6 équipes (pas 3)
- Insister sur les agréments : Lafarge, Cemex, Vicat, Bonifay, Point P
- Certifications : CTB-P, DTU 26.2
- Zone étendue : Var + BdR + AM
- Histoire locale : fondé dans le Var, ancrage Toulon/Six-Fours

---

### Page Réalisations `/realisations`

**Objectif :** Preuves sociales + contenu géolocalisé

**Chaque réalisation doit inclure :**
- Type de chape (anhydrite, ciment, isolation...)
- Surface en m² coulés
- Ville / département
- Type de chantier (neuf, rénovation, particulier, promoteur, collectif...)
- Photo avant/après si disponible
- Schema.org : `CreativeWork` ou fiche dédiée

**Schema.org :** Ajouter `aggregateRating` si avis disponibles

---

## 6. Stratégie Schema.org / AEO

### Schemas à implémenter par page

| Page | Schema principal | Schemas secondaires |
|------|-----------------|---------------------|
| Accueil | `LocalBusiness` + `HomeAndConstructionBusiness` | `WebSite`, `Organization` |
| Chaque service | `Service` | `FAQPage`, `BreadcrumbList` |
| Réalisations | `ItemList` | `CreativeWork` par réalisation |
| À propos | `Organization` | `Person` (dirigeant si applicable) |
| Devis/Contact | `ContactPage` | `LocalBusiness` |

### FAQPage Schema (AEO prioritaire)
Chaque page service doit avoir un bloc `FAQPage` en JSON-LD avec les questions/réponses intégrées visuellement dans la page. C'est le principal levier pour apparaître dans :
- Les "People Also Ask" Google
- Les réponses des IA (ChatGPT, Claude, Perplexity, Gemini)
- Les featured snippets

### Données LocalBusiness enrichies
```json
{
  "@type": "HomeAndConstructionBusiness",
  "name": "Sud Est Chape",
  "areaServed": ["Var", "Bouches-du-Rhône", "Alpes-Maritimes"],
  "hasOfferCatalog": { ... chaque service ... },
  "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 10, "maxValue": 25 },
  "foundingDate": "2010",
  "award": ["Certifié CTB-P", "Agréé Lafarge", "Agréé Cemex"]
}
```

---

## 7. Optimisations techniques

### Titles et metas (règles)
- Title : 50-60 caractères, mot-clé principal en début, ville/région, marque en fin
- Meta description : 140-160 caractères, bénéfice concret + CTA implicite + zone géo
- H1 : 1 seul par page, mot-clé principal naturel
- H2/H3 : mots-clés secondaires + questions longue traîne

### Redirections 301
- Fichier `public/_redirects` pour Cloudflare Pages
- Format : `/ancienne-url /nouvelle-url 301`

### Performances (déjà en place, à vérifier)
- Core Web Vitals : LCP < 2.5s, CLS < 0.1, INP < 200ms
- Images WebP optimisées
- CSS critical inline
- JS defer

### Google Search Console
- Soumettre nouveau sitemap après mise en production
- Surveiller les erreurs 404 les 30 premiers jours
- Demander reindexation des pages clés

---

## 8. Priorités d'implémentation

### Phase 1 — Avant mise en production (critique)
1. ✅ Fichier `_redirects` avec toutes les 301
2. ✅ Corriger title/meta homepage (CTR 2.29% → objectif 5%)
3. ✅ Supprimer "chape traditionnelle" de tout le contenu
4. ✅ Mettre à jour les chiffres (6 équipes, zone étendue)
5. ✅ Créer les 6 pages services avec contenu + FAQ + Schema

### Phase 2 — Semaines 1-2 post-lancement
6. ✅ Enrichir les réalisations avec données (m², ville, type)
7. ✅ Schema.org FAQPage sur toutes les pages services
8. ✅ Optimiser page devis (mot-clé "devis chape liquide" position 26.8)
9. ✅ Soumettre sitemap GSC

### Phase 3 — Mois 1-2 post-lancement
10. ✅ Optimiser Google My Business (photos, catégories, avis)
11. ✅ Vérifier indexation et positions dans GSC
12. ✅ Ajuster contenu selon premières données GSC

---

## 9. KPIs à suivre

| Métrique | Valeur actuelle | Objectif 3 mois | Objectif 6 mois |
|----------|----------------|-----------------|-----------------|
| Position `chape liquide` | 10.9 | Top 5 | Top 3 |
| Position `chape anhydrite` | Faible | Top 5 | Top 3 |
| Position `chapiste Toulon` | 2 | 1 | 1 |
| CTR homepage | 2.29% | 5% | 7% |
| Clics organiques/mois | ~63 | ~200 | ~500 |
| Impressions/mois | ~4 000 | ~8 000 | ~15 000 |

---

## 10. Concurrents à surveiller

| Concurrent | URL | Force | Faiblesse |
|-----------|-----|-------|-----------|
| PSEC | psecchape.fr | Contenu riche, agréé Lafarge | Moins local Var/Toulon |
| DeltaSol | deltasol.pro | Fort SEO régional | Basé Aix, moins Toulon |
| Avenir Sol | avenirsol.fr | Local Var | Site basique, peu de contenu |
| Ecopole | ecopole-btp83.fr | Local Fréjus | Spécialité limitée |

**Avantage concurrentiel de Sud Est Chape :**
- Seul acteur avec 6 équipes disponibles sur Var + PACA étendu
- Ancrage Toulon/Six-Fours = réactivité locale imbattable
- Multi-agréments fabricants = preuve qualité supérieure

---

*Document généré le 25 mars 2026 — à mettre à jour au fil des itérations*
