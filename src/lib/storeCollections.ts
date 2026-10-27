import { collections as defaultCollections, type Collection } from '@/data/collections';
import { API_URL } from '@/lib/apiConfig';

export async function getStoreCollections(): Promise<Collection[]> {
  try {
    const response = await fetch(`${API_URL}/collections`, { cache: 'no-store' });
    if (!response.ok) return defaultCollections;
    return await response.json() as Collection[];
  } catch {
    return defaultCollections;
  }
}