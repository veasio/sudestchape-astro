export interface Realisation {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: 'Chape fluide' | 'Chape traditionnelle';
  surface?: string;
  location?: string;
  date?: string;
}

export const realisations: Realisation[] = [
  {
    slug: 'chape-fluide-villa-var',
    title: 'Chape fluide — Villa particulière',
    description: 'Chape fluide autonivelante sur plancher chauffant hydraulique. Surface de 180 m² réalisée en une journée.',
    image: '/images/optimized/realisation-1.webp',
    category: 'Chape fluide',
    surface: '180 m²',
    location: 'Var (83)',
    date: '2025-11',
  },
  {
    slug: 'chape-traditionnelle-local-commercial',
    title: 'Chape traditionnelle — Local commercial',
    description: 'Chape ciment tirée à la règle pour un local commercial en rénovation. Épaisseur 6 cm sur isolant.',
    image: '/images/optimized/realisation-2.webp',
    category: 'Chape traditionnelle',
    surface: '320 m²',
    location: 'Bouches-du-Rhône (13)',
    date: '2025-10',
  },
  {
    slug: 'chape-fluide-residence-collective',
    title: 'Chape fluide — Résidence collective',
    description: 'Chape fluide pour 12 appartements en construction neuve. Coordination avec les corps de métier.',
    image: '/images/optimized/realisation-3.webp',
    category: 'Chape fluide',
    surface: '1 200 m²',
    location: 'Alpes-Maritimes (06)',
    date: '2025-09',
  },
  {
    slug: 'chape-traditionnelle-maison-individuelle',
    title: 'Chape traditionnelle — Maison individuelle',
    description: "Rénovation complète des sols d'une maison de 150 m². Reprise de niveau et chape sur isolant.",
    image: '/images/optimized/realisation-4.webp',
    category: 'Chape traditionnelle',
    surface: '150 m²',
    location: 'Var (83)',
    date: '2025-08',
  },
];
