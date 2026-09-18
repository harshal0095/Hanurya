"use client";

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { products } from '@/data/products';

export default function BestSellers() {
  // Use first 8 best sellers
  const filteredProducts = products.filter(p => p.bestSeller).slice(0, 8);
  // Pad with regular products if less than 8
  if (filteredProducts.length < 8) {
     filteredProducts.push(...products.filter(p => !p.bestSeller).slice(0, 8 - filteredProducts.length));
  }

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
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
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
