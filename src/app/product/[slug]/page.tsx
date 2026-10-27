import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { ApiProduct, mapApiProduct } from '@/lib/storeProducts';
import ProductClientParams from './ProductClientParams';

// In Next.js 15, params is a Promise
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let availableProducts = products;
  let product = products.find(p => p.slug === resolvedParams.slug);

  if (!product && resolvedParams.slug.startsWith('db-')) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
      if (response.ok) {
        const databaseProducts = (await response.json() as ApiProduct[]).map(mapApiProduct);
        availableProducts = [...databaseProducts, ...products];
        product = databaseProducts.find((item) => item.slug === resolvedParams.slug);
      }
    } catch {
      product = undefined;
    }
  }

  if (!product) {
    notFound();
  }

  const relatedProducts = availableProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductClientParams product={product} relatedProducts={relatedProducts} />;
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}
