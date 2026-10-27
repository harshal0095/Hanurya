import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { collections } from '@/data/collections';
import { products, Product } from '@/data/products';
import { ApiProduct, mapApiProduct } from '@/lib/storeProducts';
import { getStoreCollections } from '@/lib/storeCollections';
import ProductCard from '@/components/ui/ProductCard';

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const storeCollections = await getStoreCollections();
  const collection = storeCollections.find(c => c.slug === resolvedParams.slug);

  if (!collection) {
    notFound();
  }

  let databaseProducts: Product[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
    if (response.ok) {
      databaseProducts = (await response.json() as ApiProduct[]).map(mapApiProduct);
    }
  } catch {
    databaseProducts = [];
  }

  const collectionProducts = [...databaseProducts, ...products].filter((product) => product.collection === collection.slug);

  return (
    <div className="bg-primary min-h-screen pb-24">
      {/* Collection Hero */}
      <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center mb-16">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-dark/40"></div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto text-white">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">{collection.name}</h1>
          <p className="text-lg text-white/80">{collection.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark/10">
          <span className="text-sm text-dark/60">{collectionProducts.length} Products</span>
        </div>

        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
            {collectionProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-xl text-dark/50">No products found in this collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return collections.map((col) => ({
    slug: col.slug,
  }));
}
