"use client";

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { wishlist, wishlistNotice } = useWishlist();

  return (
    <div className="bg-primary min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16 border-b border-dark/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4">Your Wishlist</h1>
          <p className="text-dark/70">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
          {wishlistNotice && <p role="status" className="mt-3 text-sm text-amber-800">{wishlistNotice}</p>}
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
            {wishlist.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="w-16 h-16 text-dark/20 mb-6" />
            <h2 className="text-2xl font-serif text-dark mb-4">Your wishlist is empty</h2>
            <p className="text-dark/60 max-w-md mx-auto mb-8">
              Save your favorite candles here so you don't lose track of them.
            </p>
            <Link href="/shop">
              <Button size="lg" className="uppercase tracking-widest text-sm">
                Explore Products
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
