"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Collection } from '@/data/collections';

export default function Collections({ collections }: { collections: Collection[] }) {
  const [imagesWithErrors, setImagesWithErrors] = useState<Record<string, boolean>>({});

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-primary">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif text-dark mb-4">Shop by Collection</h2>
        <div className="w-16 h-px bg-accent mx-auto"></div>
      </div>
      
      {collections.length === 0 ? (
        <p className="py-12 text-center text-dark/60">Collections will appear here as soon as they are available in the shop.</p>
      ) : <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        {collections.map((collection) => (
          <Link 
            key={collection.id} 
            href={`/collections/${collection.slug}`}
            className="group block relative h-[400px] overflow-hidden rounded-sm"
          >
            <Image
              src={imagesWithErrors[collection.id] || !collection.image ? '/h1-featured.png' : collection.image}
              alt={collection.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => {
                if (!imagesWithErrors[collection.id]) {
                  setImagesWithErrors((current) => ({ ...current, [collection.id]: true }));
                }
              }}
            />
            <div className="absolute inset-0 bg-dark/20 transition-colors duration-300 group-hover:bg-dark/30"></div>
            
            <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
              <h3 className="text-3xl font-serif mb-2">{collection.name}</h3>
              <p className="max-w-xs text-white/80 mb-6">{collection.description}</p>
              
              <div className="flex items-center text-sm font-bold uppercase tracking-widest group-hover:text-accent transition-colors w-max">
                Explore Collection
                <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>}
    </section>
  );
}
