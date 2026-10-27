import { collections as defaultCollections, type Collection } from '@/data/collections';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getStoreCollections(): Promise<Collection[]> {
  try {
    const response = await fetch(`${API_URL}/collections`, { cache: 'no-store' });
    if (!response.ok) return defaultCollections;
    return await response.json() as Collection[];
  } catch {
    return defaultCollections;
  }
}