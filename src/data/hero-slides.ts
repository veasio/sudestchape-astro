export interface HeroSlide {
  image: string;
  imageAlt: string;
  overline: string;
  title: string;
  description: string;
  ctaPrimary: { label: string; url: string };
  ctaSecondary?: { label: string; url: string };
  contentAlign?: 'left' | 'right';
}

export const heroSlides: HeroSlide[] = [
  {
    image: '/images/optimized/hero-chape.webp',
    imageAlt: 'Réalisation de chape fluide par Sud Est Chape',
    overline: 'Spécialiste chape dans le Sud-Est',
    title: 'Des chapes fluides adaptées à tous vos projets !',
    description: 'Quelque soit la problématique, Sud Est Chape apporte la solution. Rapidité, propreté et planéité, nous intervenons avec précision dans toute la région PACA.',
    ctaPrimary: { label: 'Devis gratuit', url: '/devis' },
    ctaSecondary: { label: 'Nos Chapes', url: '/services' },
    contentAlign: 'left',
  },
    {
    image: '/images/optimized/hero-services.webp',
    imageAlt: 'Coulage de chape fluide sur plancher chauffant',
    overline: 'Plancher chauffant',
    title: 'Six équipes de chapistes qualifiés à votre service !',
    description: "Expérimentés et diplômés du CQP Chef d’Équipe Chapiste, nos équipes ...",
    ctaPrimary: { label: ‘Demander un devis’, url: ‘/devis’ },
    ctaSecondary: { label: ‘Nos équipes’, url: ‘/a-propos’ },
    contentAlign: 'right',
  },
  {
    image: '/images/optimized/hero-services.webp',
    imageAlt: 'Coulage de chape fluide sur plancher chauffant',
    overline: 'Plancher chauffant',
    title: 'La chape fluide idéale pour votre plancher chauffant',
    description: 'Planéité parfaite, séchage rapide et répartition homogène de la chaleur. Jusqu\'à 200 m² coulés par jour.',
    ctaPrimary: { label: 'Demander un devis', url: '/devis' },
    ctaSecondary: { label: 'Nos réalisations', url: '/realisations' },
    contentAlign: 'right',
  },
  {
    image: '/images/optimized/hero-a-propos.webp',
    imageAlt: 'Équipe Sud Est Chape sur un chantier',
    overline: '15 ans d\'expérience',
    title: 'Plus de 1 000 chantiers réalisés dans le Sud-Est',
    description: 'Une équipe qualifiée, des matériaux certifiés et un engagement qualité reconnu par nos clients depuis 15 ans.',
    ctaPrimary: { label: 'Découvrir notre équipe', url: '/a-propos' },
    ctaSecondary: { label: 'Nous contacter', url: '/contact' },
    contentAlign: 'left',
  },
];
