export interface Realisation {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: 'Chape fluide' | 'Chape anhydrite' | 'Chape ciment' | 'Ravoirage' | 'Isolation phonique' | 'Isolation thermique' | 'Mousse polyuréthane';
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
    slug: 'chape-ciment-local-commercial',
    title: 'Chape ciment — Local commercial',
    description: 'Chape ciment sur isolant pour un local commercial en rénovation. Épaisseur 6 cm, surface parfaitement plane avant pose de carrelage grand format.',
    image: '/images/optimized/realisation-2.webp',
    category: 'Chape ciment',
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
    slug: 'chape-anhydrite-maison-individuelle',
    title: 'Chape anhydrite — Maison individuelle',
    description: 'Chape anhydrite autonivelante sur plancher chauffant hydraulique. Rénovation complète des sols d\'une maison de 150 m². Planéité < 3 mm.',
    image: '/images/optimized/realisation-4.webp',
    category: 'Chape anhydrite',
    surface: '150 m²',
    location: 'Var (83)',
    date: '2025-08',
  },
];
