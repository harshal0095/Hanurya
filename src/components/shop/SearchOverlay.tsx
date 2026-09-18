"use client";

import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { products, Product } from '@/data/products';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.scent.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-300">
      <div className="max-w-4xl w-full mx-auto px-4 pt-12 sm:pt-24 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8 border-b border-dark/20 pb-4">
          <div className="flex-1 flex items-center">
            <Search className="w-6 h-6 text-dark/50 mr-4" />
            <input
              type="text"
              autoFocus
              placeholder="Search candles, scents, collections..."
              className="w-full bg-transparent text-2xl md:text-4xl font-serif text-dark outline-none placeholder:text-dark/30"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button onClick={onClose} className="p-2 ml-4">
            <X className="w-8 h-8 text-dark hover:text-accent transition-colors" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-12">
          {query.trim().length > 1 && results.length === 0 && (
            <p className="text-dark/50 text-lg">No results found for "{query}".</p>
          )}

          {results.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-dark/50">Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center group"
                  >
                    <div className="relative w-20 h-24 bg-cream overflow-hidden rounded-sm mr-4 flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-dark group-hover:text-accent transition-colors">{product.name}</h4>
                      <p className="text-dark/50 text-xs uppercase tracking-widest mt-1">{product.scent}</p>
                      <p className="text-dark font-medium mt-1">₹{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link 
                href={`/shop?q=${query}`}
                onClick={onClose}
                className="inline-block mt-8 border-b border-dark text-dark hover:text-accent hover:border-accent transition-colors"
              >
                View all results
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
