"use client";

import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuickView } from '@/context/QuickViewContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

export default function QuickViewModal() {
  const { isOpen, product, closeQuickView } = useQuickView();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-dark/40 backdrop-blur-sm transition-opacity"
        onClick={closeQuickView}
      ></div>
      
      <div className="relative w-full max-w-4xl bg-primary shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
        <button 
          onClick={closeQuickView} 
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-dark" />
        </button>

        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-cream">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-dark/20'}`} 
              />
            ))}
            <span className="text-xs text-dark/60 ml-2">({product.reviewCount} reviews)</span>
          </div>
          
          <h2 className="text-3xl font-serif mb-2">{product.name}</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-xl font-medium">
              {product.salePrice ? (
                <div className="flex items-center space-x-3">
                  <span className="text-accent">₹{product.salePrice}</span>
                  <span className="text-dark/40 line-through">₹{product.price}</span>
                </div>
              ) : (
                <span>₹{product.price}</span>
              )}
            </div>
          </div>
          
          <p className="text-dark/70 mb-8">{product.description}</p>
          
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-dark/50 mb-2">Quantity</p>
              <div className="flex items-center border border-dark/20 w-max">
                <button 
                  className="px-4 py-2 text-dark/60 hover:text-dark"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <button 
                  className="px-4 py-2 text-dark/60 hover:text-dark"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button onClick={handleAddToCart} className="w-full">
              Add to Cart - ${(product.salePrice || product.price) * quantity}
            </Button>
            <Link href={`/product/${product.slug}`} onClick={closeQuickView} className="w-full">
              <Button variant="outline" className="w-full">
                View Full Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
