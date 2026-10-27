"use client";

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/data/products';

export default function BestSellers({ products }: { products: Product[] }) {
  const featuredProducts = products.slice(0, 8);
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto bg-primary">
      <div className="flex items-center justify-between mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-dark">
          Our <span className="italic">best seller</span>
        </h2>
        
        <Link 
          href="/shop" 
          className="hidden md:flex border border-dark text-dark px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-dark hover:text-white transition-colors"
        >
          See All →
        </Link>
      </div>
      
      {featuredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-dark/60">Products added to the shop will appear here.</p>
      )}
      
      <div className="mt-12 md:hidden flex justify-center">
        <Link 
          href="/shop" 
          className="border border-dark text-dark px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-dark hover:text-white transition-colors"
        >
          See All →
        </Link>
      </div>
    </section>
  );
}
