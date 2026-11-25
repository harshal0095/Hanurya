"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Minus, ChevronDown, ChevronUp, Maximize2, X } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';
import apiClient from '@/lib/apiClient';
import type { ApiProduct } from '@/lib/storeProducts';

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
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [availableStock, setAvailableStock] = useState(Math.max(0, product.stock));
  const [stockRefreshFailed, setStockRefreshFailed] = useState(false);

  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  useEffect(() => {
    let isActive = true;
    let isFetching = false;

    const refreshStock = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const { data } = await apiClient.get<ApiProduct>(`/products/${product.id}`);
        if (isActive) {
          setAvailableStock(Math.max(0, data.stock));
          setStockRefreshFailed(false);
        }
      } catch {
        if (isActive) setStockRefreshFailed(true);
      } finally {
        isFetching = false;
      }
    };

    void refreshStock();
    const interval = window.setInterval(() => {
      if (!document.hidden) void refreshStock();
    }, 15000);
    window.addEventListener('focus', refreshStock);

    return () => {
      isActive = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshStock);
    };
  }, [product.id]);

  useEffect(() => {
    if (!isImageViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsImageViewerOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageViewerOpen]);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, stock: availableStock }, quantity);
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
            <div className="mx-auto w-full max-w-[470px]">
              <button
                type="button"
                onClick={() => setIsImageViewerOpen(true)}
                aria-label={`Open ${product.name} image in full screen`}
                className="relative mb-4 block aspect-square w-full overflow-hidden rounded-sm bg-cream cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 470px"
                  className="object-contain animate-in fade-in duration-500"
                />
                <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-dark shadow-sm">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </button>
              {product.images.length > 1 && (
                <div
                  role="group"
                  aria-label="Product images"
                  className="flex gap-3 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory"
                >
                  {product.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1} of ${product.images.length} for ${product.name}`}
                      aria-pressed={activeImage === index}
                      className={`relative aspect-square w-16 shrink-0 snap-start overflow-hidden rounded-sm border-2 bg-cream transition-colors sm:w-20 ${
                        activeImage === index ? 'border-dark' : 'border-dark/10 hover:border-dark/40'
                      }`}
                    >
                      <Image src={image} alt={`${product.name} image ${index + 1}`} fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <div className="mb-8">
              <h1 className="mb-5 max-w-2xl font-serif text-[1.75rem] font-bold leading-tight tracking-[-0.015em] text-dark sm:text-[2rem] lg:text-[2.25rem]">
                {product.name}
              </h1>

              <div className="mb-5 flex items-center gap-3 text-[1.6rem] font-bold tracking-tight">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-dark/50">Price</span>
                {product.salePrice ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-accent">₹{product.salePrice}</span>
                    <span className="text-dark/40 line-through text-lg">₹{product.price}</span>
                  </div>
                ) : (
                  <span className="text-dark">₹{product.price}</span>
                )}
              </div>

              <div className="mb-8 border-l-2 border-accent/60 pl-5">
                <p className="max-w-xl whitespace-pre-line text-[15px] leading-7 text-dark/75 antialiased sm:text-base">
                  {product.description}
                </p>
              </div>
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
                    className="px-4 py-3 text-dark/60 hover:text-dark transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                    disabled={quantity >= availableStock}
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-dark/50">{availableStock} available</p>
                {stockRefreshFailed && (
                  <p role="status" className="mt-1 text-xs text-dark/50">
                    Stock may have changed. Checkout will verify availability.
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mb-12">
              <Button onClick={handleAddToCart} disabled={availableStock === 0} size="lg" className="flex-1 uppercase tracking-widest text-sm">
                {availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
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

      {isImageViewerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} image viewer`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setIsImageViewerOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsImageViewerOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-dark shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative h-[88vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}

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
