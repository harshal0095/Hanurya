import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import ProductClientParams from './ProductClientParams';

// In Next.js 15, params is a Promise
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = products.find(p => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductClientParams product={product} relatedProducts={relatedProducts} />;
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}
