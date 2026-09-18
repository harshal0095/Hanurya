"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, Share2, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-dark/10 py-4">
      <button 
        className="w-full flex items-center justify-between text-left font-serif text-lg text-dark hover:text-accent transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp className="w-5 h-5 text-dark/50" /> : <ChevronDown className="w-5 h-5 text-dark/50" />}
      </button>
      <div className={`mt-4 text-dark/70 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

export default function ProductClientParams({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="bg-primary min-h-screen pt-8 pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex text-xs uppercase tracking-widest text-dark/50">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-accent">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-dark">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Images */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[3/4] bg-cream mb-4 sticky top-24">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover animate-in fade-in duration-500"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-2xl font-medium">
                  {product.salePrice ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-accent">₹{product.salePrice}</span>
                      <span className="text-dark/40 line-through text-lg">₹{product.price}</span>
                    </div>
                  ) : (
                    <span>₹{product.price}</span>
                  )}
                </div>
                
                <div className="w-px h-6 bg-dark/20"></div>
                
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-dark/20'}`} 
                    />
                  ))}
                  <span className="text-xs text-dark/60 ml-2">({product.reviewCount})</span>
                </div>
              </div>

              <p className="text-dark/70 text-lg leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            {/* Selection */}
            <div className="space-y-6 mb-10 pb-10 border-b border-dark/10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-dark/50 mb-3">Size</p>
                <div className="inline-block border border-dark text-dark px-6 py-3 font-medium">
                  {product.size}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-dark/50 mb-3">Quantity</p>
                <div className="flex items-center border border-dark/20 w-max">
                  <button 
                    className="px-4 py-3 text-dark/60 hover:text-dark transition-colors"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <button 
                    className="px-4 py-3 text-dark/60 hover:text-dark transition-colors"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mb-12">
              <Button onClick={handleAddToCart} size="lg" className="flex-1 uppercase tracking-widest text-sm">
                Add to Cart
              </Button>
              <button 
                onClick={toggleWishlist}
                className="w-14 h-14 border border-dark/20 flex items-center justify-center text-dark hover:border-accent hover:text-accent transition-colors"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-accent text-accent' : ''}`} />
              </button>
            </div>

            {/* Accordions */}
            <div className="mt-auto">
              <AccordionItem title="Fragrance Notes" defaultOpen>
                <ul className="space-y-2">
                  <li><strong>Top:</strong> {product.fragranceNotes.top}</li>
                  <li><strong>Heart:</strong> {product.fragranceNotes.heart}</li>
                  <li><strong>Base:</strong> {product.fragranceNotes.base}</li>
                </ul>
              </AccordionItem>
              <AccordionItem title="Burn Time & Care">
                <p>Expected burn time is {product.burnTime}. For best results, trim wick to 1/4" before each use. Allow the melt pool to reach the edges of the jar to prevent tunneling. Do not burn for more than 4 hours at a time.</p>
              </AccordionItem>
              <AccordionItem title="Shipping & Returns">
                <p>Free standard shipping on all orders over ₹100. We offer a 30-day return policy for unused candles in their original packaging.</p>
              </AccordionItem>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-dark mb-4">Pairs beautifully with...</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
