export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  scent: string;
  fragranceNotes: {
    top: string;
    heart: string;
    base: string;
  };
  size: string;
  burnTime: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  stock: number;
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "amber-sandalwood",
    name: "Amber & Sandalwood Candle",
    category: "Candles",
    collection: "signature-candles",
    description: "Warm amber blended with creamy sandalwood and soft vanilla. A comforting and sophisticated fragrance that transforms any room into a cozy retreat.",
    price: 38,
    images: ["https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=800&auto=format&fit=crop"],
    scent: "Woody",
    fragranceNotes: {
      top: "Bergamot",
      heart: "Amber",
      base: "Sandalwood + Vanilla"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.8,
    reviewCount: 124,
    featured: true,
    bestSeller: true,
    newArrival: false,
    stock: 50
  },
  {
    id: "p2",
    slug: "fresh-linen",
    name: "Fresh Linen Candle",
    category: "Candles",
    collection: "signature-candles",
    description: "Crisp and clean, like sun-dried laundry on a breezy summer day. Refreshing notes of cotton, white musk, and delicate citrus.",
    price: 34,
    images: ["https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=800&auto=format&fit=crop"],
    scent: "Clean",
    fragranceNotes: {
      top: "Lemon Zest",
      heart: "Cotton Blossom",
      base: "White Musk"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.5,
    reviewCount: 89,
    featured: true,
    bestSeller: false,
    newArrival: false,
    stock: 30
  },
  {
    id: "p3",
    slug: "vanilla-woods",
    name: "Vanilla Woods Candle",
    category: "Candles",
    collection: "signature-candles",
    description: "A decadent blend of Madagascar vanilla, smoked woods, and a hint of dark chocolate. Rich, indulgent, and perfectly balanced.",
    price: 36,
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop"],
    scent: "Sweet & Woody",
    fragranceNotes: {
      top: "Smoked Cedar",
      heart: "Madagascar Vanilla",
      base: "Dark Chocolate"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.9,
    reviewCount: 210,
    featured: true,
    bestSeller: true,
    newArrival: false,
    stock: 15
  },
  {
    id: "p4",
    slug: "rose-oud",
    name: "Rose & Oud Candle",
    category: "Candles",
    collection: "signature-candles",
    description: "An elegant, mysterious fragrance pairing velvety damask rose with deep, smoky oud wood. Opulent and captivating.",
    price: 42,
    salePrice: 38,
    images: ["https://images.unsplash.com/photo-1572252516491-0391696081da?q=80&w=800&auto=format&fit=crop"],
    scent: "Floral & Woody",
    fragranceNotes: {
      top: "Pink Pepper",
      heart: "Damask Rose",
      base: "Oud Wood + Patchouli"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.7,
    reviewCount: 56,
    featured: true,
    bestSeller: false,
    newArrival: true,
    stock: 20
  },
  {
    id: "p5",
    slug: "cedar-fig",
    name: "Cedar & Fig Candle",
    category: "Candles",
    collection: "seasonal-collection",
    description: "Earthy cedarwood meets the sweet nectar of ripe figs. A grounding, natural scent perfect for the changing seasons.",
    price: 40,
    images: ["https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=800&auto=format&fit=crop"],
    scent: "Earthy",
    fragranceNotes: {
      top: "Fig Leaves",
      heart: "Ripe Fig",
      base: "Cedarwood"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.6,
    reviewCount: 78,
    featured: true,
    bestSeller: false,
    newArrival: true,
    stock: 45
  },
  {
    id: "p6",
    slug: "white-tea",
    name: "White Tea Candle",
    category: "Candles",
    collection: "aromatherapy",
    description: "A soothing, spa-like fragrance. Delicate white tea leaves infused with subtle hints of jasmine and fresh thyme.",
    price: 35,
    images: ["https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=800&auto=format&fit=crop"],
    scent: "Fresh & Herbal",
    fragranceNotes: {
      top: "Mandarin",
      heart: "White Tea + Thyme",
      base: "Jasmine"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.8,
    reviewCount: 112,
    featured: true,
    bestSeller: true,
    newArrival: false,
    stock: 60
  },
  {
    id: "p7",
    slug: "lavender-mist",
    name: "Lavender Mist Candle",
    category: "Candles",
    collection: "aromatherapy",
    description: "Pure French lavender combined with fresh sage and a touch of eucalyptus. Designed to promote deep relaxation and restful sleep.",
    price: 32,
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop"],
    scent: "Herbal",
    fragranceNotes: {
      top: "Eucalyptus",
      heart: "French Lavender",
      base: "Clary Sage"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.4,
    reviewCount: 95,
    featured: true,
    bestSeller: false,
    newArrival: false,
    stock: 40
  },
  {
    id: "p8",
    slug: "coconut-vanilla",
    name: "Coconut Vanilla Candle",
    category: "Candles",
    collection: "signature-candles",
    description: "A tropical escape. Creamy coconut milk blended seamlessly with warm vanilla bean and a hint of toasted almond.",
    price: 36,
    images: ["https://images.unsplash.com/photo-1572252516491-0391696081da?q=80&w=800&auto=format&fit=crop"],
    scent: "Sweet",
    fragranceNotes: {
      top: "Toasted Almond",
      heart: "Coconut Milk",
      base: "Vanilla Bean"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.7,
    reviewCount: 156,
    featured: true,
    bestSeller: true,
    newArrival: false,
    stock: 25
  },
  {
    id: "p9",
    slug: "eucalyptus-mint",
    name: "Eucalyptus & Mint Candle",
    category: "Candles",
    collection: "aromatherapy",
    description: "Invigorating and awakening. Cool peppermint and fresh eucalyptus clear the mind and uplift the spirit.",
    price: 32,
    images: ["https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=800&auto=format&fit=crop"],
    scent: "Fresh & Herbal",
    fragranceNotes: {
      top: "Peppermint",
      heart: "Spearmint",
      base: "Eucalyptus"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.5,
    reviewCount: 64,
    featured: false,
    bestSeller: false,
    newArrival: true,
    stock: 35
  },
  {
    id: "p10",
    slug: "bergamot-vetiver",
    name: "Bergamot & Vetiver Candle",
    category: "Candles",
    collection: "signature-candles",
    description: "A bright, citrusy opening that settles into the deep, earthy richness of vetiver. A complex and modern scent.",
    price: 38,
    images: ["https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=800&auto=format&fit=crop"],
    scent: "Citrus & Woody",
    fragranceNotes: {
      top: "Bergamot",
      heart: "Lemon",
      base: "Vetiver"
    },
    size: "8 oz",
    burnTime: "40-50 hours",
    rating: 4.6,
    reviewCount: 42,
    featured: false,
    bestSeller: false,
    newArrival: false,
    stock: 20
  },
  {
    id: "p11",
    slug: "mini-discovery-set",
    name: "Mini Discovery Set",
    category: "Gift Sets",
    collection: "gift-sets",
    description: "Discover our three best-selling fragrances in convenient 2oz mini tins. The perfect introduction to our collection.",
    price: 45,
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop"],
    scent: "Assorted",
    fragranceNotes: {
      top: "Various",
      heart: "Various",
      base: "Various"
    },
    size: "3 x 2 oz",
    burnTime: "15 hours each",
    rating: 4.9,
    reviewCount: 88,
    featured: true,
    bestSeller: true,
    newArrival: false,
    stock: 100
  },
  {
    id: "p12",
    slug: "luxury-gift-box",
    name: "Luxury Gift Box",
    category: "Gift Sets",
    collection: "gift-sets",
    description: "The ultimate gift. Includes two 8oz candles of your choice, a wick trimmer, and matches, beautifully packaged in our signature linen box.",
    price: 85,
    images: ["https://images.unsplash.com/photo-1572252516491-0391696081da?q=80&w=800&auto=format&fit=crop"],
    scent: "Assorted",
    fragranceNotes: {
      top: "Various",
      heart: "Various",
      base: "Various"
    },
    size: "Various",
    burnTime: "Various",
    rating: 5.0,
    reviewCount: 34,
    featured: false,
    bestSeller: false,
    newArrival: true,
    stock: 15
  }
];
