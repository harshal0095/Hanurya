import { collections } from '@/data/collections';
import type { Product } from '@/data/products';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  collectionSlug: string | null;
  collection?: { name: string } | null;
  stock: number;
}

export async function getStoreProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Store product request failed with status ${response.status}.`);
      return [];
    }

    const products = await response.json() as ApiProduct[];
    return products.map(mapApiProduct);
  } catch (error) {
    console.error('Could not load store products for the homepage.', error);
    return [];
  }
}

export function mapApiProduct(product: ApiProduct): Product {
  const collection = collections.find((item) => item.slug === product.collectionSlug);

  return {
    id: product.id,
    slug: `db-${product.id}`,
    name: product.name,
    category: product.collection?.name ?? collection?.name ?? 'Candles',
    collection: product.collectionSlug ?? '',
    description: product.description,
    price: Number(product.price) || 0,
    images: [product.imageUrl || '/h1-featured.png'],
    scent: 'Hand-poured',
    fragranceNotes: {
      top: 'Not specified',
      heart: 'Not specified',
      base: 'Not specified',
    },
    size: 'Standard',
    burnTime: 'Not specified',
    rating: 0,
    reviewCount: 0,
    featured: false,
    bestSeller: false,
    newArrival: false,
    stock: Number(product.stock) || 0,
  };
}