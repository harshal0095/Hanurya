import type { PrismaClient } from '@prisma/client';

export const defaultCollections = [
  {
    slug: 'signature-candles',
    name: 'Signature Candles',
    description: 'Our core collection of timeless, everyday scents.',
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=1000&auto=format&fit=crop',
  },
  {
    slug: 'aromatherapy',
    name: 'Aromatherapy',
    description: 'Essential oil blends designed to restore balance.',
    image: '/h1-featured.png',
  },
  {
    slug: 'seasonal-collection',
    name: 'Seasonal Collection',
    description: 'Limited edition fragrances inspired by the changing seasons.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop',
  },
  {
    slug: 'gift-sets',
    name: 'Gift Sets',
    description: 'Thoughtfully curated sets for the perfect gift.',
    image: 'https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=1000&auto=format&fit=crop',
  },
];

let defaultCollectionsSeed: Promise<void> | null = null;

export function ensureDefaultCollections(prisma: PrismaClient): Promise<void> {
  if (!defaultCollectionsSeed) {
    defaultCollectionsSeed = prisma.collection.createMany({
      data: defaultCollections,
      skipDuplicates: true,
    }).then(() => undefined).catch((error: unknown) => {
      defaultCollectionsSeed = null;
      throw error;
    });
  }

  return defaultCollectionsSeed;
}