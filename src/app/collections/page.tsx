import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collections } from '@/data/collections';

export default function CollectionsPage() {
  return (
    <div className="bg-primary min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-dark mb-6">Our Collections</h1>
          <p className="text-dark/70 max-w-2xl mx-auto text-lg leading-relaxed">
            Thoughtfully curated groups of scents designed to set a specific mood, transition between seasons, or serve as the perfect gift.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {collections.map(col => (
            <Link key={col.id} href={`/collections/${col.slug}`} className="group block">
              <div className="relative aspect-[4/3] bg-cream mb-6 overflow-hidden rounded-sm">
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <h2 className="text-3xl font-serif text-dark group-hover:text-accent transition-colors mb-3">
                {col.name}
              </h2>
              <p className="text-dark/70 mb-4">{col.description}</p>
              <span className="text-sm font-bold uppercase tracking-widest text-dark group-hover:text-accent transition-colors flex items-center">
                Explore Collection
                <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
