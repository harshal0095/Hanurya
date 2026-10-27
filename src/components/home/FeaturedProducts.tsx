"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/data/products';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products.slice(0, 2);

  if (featuredProducts.length === 0) {
    return (
      <section className="flex min-h-[420px] items-center justify-center bg-[#FAFAFA] px-8 py-20 text-center">
        <div>
          <h2 className="mb-4 font-serif text-4xl italic text-[#222]">Featured products</h2>
          <p className="mb-6 text-sm text-gray-500">Products added to the shop will appear here.</p>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-[#222] underline underline-offset-4">Explore the shop</Link>
        </div>
      </section>
    );
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };
  const product = featuredProducts[currentSlide];

  return (
    <section className="flex flex-col lg:flex-row w-full min-h-[800px] bg-[#FAFAFA]">
      
      {/* Left Column - Product Slider */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-20 px-8 relative">
        <h2 className="text-4xl lg:text-[2.8rem] font-serif text-[#222] mb-20 italic">Featured products</h2>
        
        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full px-8 md:px-24 flex items-center justify-between pointer-events-none z-20">
           <button 
             onClick={prevSlide}
             className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center pointer-events-auto hover:border-gray-400 transition-colors text-gray-400 bg-transparent cursor-pointer"
           >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
               <path d="M15 18l-6-6 6-6"/>
             </svg>
           </button>
           <button 
             onClick={nextSlide}
             className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center pointer-events-auto hover:border-gray-400 transition-colors text-gray-400 bg-transparent cursor-pointer"
           >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
               <path d="M9 18l6-6-6-6"/>
             </svg>
           </button>
        </div>

        {/* Product Display */}
        <div className="w-full flex flex-col items-center relative z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              {/* Product Image */}
              <div className="relative mb-12 h-[340px] w-[280px] cursor-pointer transition-transform duration-500 hover:scale-105">
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="280px"
                    className="object-contain"
                  />
                </Link>
              </div>
              
              {/* Product Details */}
              <div className="text-center">
                <Link href={`/product/${product.slug}`} className="text-[17px] font-serif text-[#222] hover:opacity-70 transition-opacity">
                  {product.name}
                </Link>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">{product.scent}</p>
                <p className="text-[15px] font-semibold text-[#222] mt-3">₹{product.salePrice || product.price}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Right Column - Large Lifestyle Image */}
      <div className="w-full lg:w-1/2 relative h-[500px] lg:h-auto overflow-hidden">
        <Image
          src="/h1-featured.png"
          alt="Featured Lifestyle"
          fill
          className="object-cover hover:scale-105 transition-transform duration-1000"
        />
      </div>
      
    </section>
  );
}
