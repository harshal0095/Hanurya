"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useQuickView } from '@/context/QuickViewContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { openQuickView } = useQuickView();
  
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    openQuickView(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    addToCart(product, 1);
  };

  return (
    <div className="group flex flex-col cursor-pointer text-center">
      <div className="relative aspect-square bg-cream overflow-hidden mb-6 rounded-sm flex items-center justify-center p-8">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>
        
        {/* Hover Actions (Right Edge) */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0 z-10">
          <button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            aria-label={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
            className="w-10 h-10 bg-white shadow-sm text-dark flex items-center justify-center rounded-full hover:bg-dark hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button 
            onClick={toggleWishlist}
            className="w-10 h-10 bg-white shadow-sm text-dark flex items-center justify-center rounded-full hover:bg-dark hover:text-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent text-accent' : ''}`} />
          </button>
          <button 
            onClick={handleQuickView}
            className="w-10 h-10 bg-white shadow-sm text-dark flex items-center justify-center rounded-full hover:bg-dark hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 px-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg text-dark group-hover:text-accent transition-colors">{product.name}</h3>
        </Link>
        <p className="text-[10px] uppercase tracking-widest text-dark/50 mt-2 mb-2 font-bold">{product.scent}</p>
        <p className={`mb-2 text-xs ${product.stock > 0 ? 'text-dark/50' : 'font-medium text-red-600'}`}>
          {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
        </p>
        <div className="mt-auto flex items-center justify-center space-x-3 text-sm font-bold text-dark">
          {product.salePrice ? (
            <>
              <span className="text-dark/40 line-through">₹{product.price}</span>
              <span className="text-dark">₹{product.salePrice}</span>
            </>
          ) : (
            <span>₹{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
