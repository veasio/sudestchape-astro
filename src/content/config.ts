import { defineCollection, z } from 'astro:content';

const realisations = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'Chape fluide',
      'Chape anhydrite',
      'Chape ciment',
      'Ravoirage',
      'Isolation phonique',
      'Isolation thermique',
      'Mousse polyuréthane',
    ]),
    secondaryCategory: z.enum([
      'Chape fluide',
      'Chape anhydrite',
      'Chape ciment',
      'Ravoirage',
      'Isolation phonique',
      'Isolation thermique',
      'Mousse polyuréthane',
    ]).optional(),
    surface: z.string(),
    thickness: z.string().optional(),
    volume: z.string().optional(),
    supplier: z.string().optional(),
    duration: z.string().optional(),
    heatedFloor: z.boolean().default(false),
    heatedFloorType: z.string().optional(),
    insulation: z.string().optional(),
    city: z.string(),
    department: z.string(),
    departmentCode: z.string(),
    region: z.string().default('Provence-Alpes-Côte d\'Azur'),
    date: z.string(),
    featured: z.boolean().default(false),
    clientType: z.string().optional(),
    clientName: z.string().optional(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
    })),
    lat: z.number().optional(),
    lng: z.number().optional(),
    testimonial: z.string().optional(),
    testimonialAuthor: z.string().optional(),
  }),
});

export const collections = { realisations };
