export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

export const collections: Collection[] = [
  {
    id: "c1",
    slug: "signature-candles",
    name: "Signature Candles",
    description: "Our core collection of timeless, everyday scents.",
    image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "c2",
    slug: "aromatherapy",
    name: "Aromatherapy",
    description: "Essential oil blends designed to restore balance.",
    image: "https://images.unsplash.com/photo-1572252516491-0391696081da?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "c3",
    slug: "seasonal-collection",
    name: "Seasonal Collection",
    description: "Limited edition fragrances inspired by the changing seasons.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "c4",
    slug: "gift-sets",
    name: "Gift Sets",
    description: "Thoughtfully curated sets for the perfect gift.",
    image: "https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=1000&auto=format&fit=crop"
  }
];
