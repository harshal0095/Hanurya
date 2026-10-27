"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/data/products';
import { collections } from '@/data/collections';
import apiClient from '@/lib/apiClient';
import { ApiProduct, mapApiProduct } from '@/lib/storeProducts';
import type { Collection } from '@/data/collections';

export default function Shop() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-primary flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </React.Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState('featured');

  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [catalogRefreshFailed, setCatalogRefreshFailed] = useState(false);
  const [availableCollections, setAvailableCollections] = useState<Collection[]>(collections);

  useEffect(() => {
    let isActive = true;

    apiClient.get<Collection[]>('/collections')
      .then(({ data }) => {
        if (isActive) setAvailableCollections(data);
      })
      .catch(() => { });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    let isFetching = false;

    const fetchCatalogProducts = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const { data } = await apiClient.get<ApiProduct[]>('/products');
        if (isActive) {
          setCatalogProducts(data.map(mapApiProduct));
          setCatalogRefreshFailed(false);
        }
      } catch {
        if (isActive) setCatalogRefreshFailed(true);
      } finally {
        isFetching = false;
        if (isActive) setIsLoadingProducts(false);
      }
    };

    void fetchCatalogProducts();
    const interval = window.setInterval(() => {
      if (!document.hidden) void fetchCatalogProducts();
    }, 15000);
    window.addEventListener('focus', fetchCatalogProducts);

    return () => {
      isActive = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', fetchCatalogProducts);
    };
  }, []);

  useEffect(() => {
    let result = [...catalogProducts];

    // Search
    if (query) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.scent.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Category Filter
    if (activeCategory) {
      result = result.filter(p => p.collection === activeCategory);
    }

    // Sort
    switch (activeSort) {
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'newest':
        result = result.filter(p => p.newArrival).concat(result.filter(p => !p.newArrival));
        break;
      case 'best-selling':
        result = result.filter(p => p.bestSeller).concat(result.filter(p => !p.bestSeller));
        break;
      case 'featured':
      default:
        // Keep default order from data
        break;
    }

    setFilteredProducts(result);
  }, [query, activeCategory, activeSort, catalogProducts]);

  return (
    <div className="bg-primary min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
            {query ? 'Search Results' : 'Our Collection'}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4">
            {query ? `Results for "${query}"` : 'Shop All Candles'}
          </h1>
          <p className="text-dark/70 max-w-2xl mx-auto">
            {query ? `We found ${filteredProducts.length} results matching your search.` : 'Discover our full range of hand-poured, beautifully scented candles designed to elevate your everyday rituals.'}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-y border-dark/10 mb-8">
          <div className="flex items-center space-x-6 mb-4 sm:mb-0 w-full sm:w-auto">
            <button
              className="lg:hidden flex items-center text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors"
              onClick={() => setIsFilterOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </button>
            <span className="text-sm text-dark/60 hidden sm:block">
              Showing {filteredProducts.length} products
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm uppercase tracking-widest text-dark/60 font-bold hidden sm:block">Sort by:</span>
            <div className="relative">
              <select
                className="appearance-none bg-transparent border-none text-sm font-medium pr-8 py-2 focus:ring-0 cursor-pointer"
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar / Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-10">

              {/* Collection Filter */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-dark mb-4 pb-2 border-b border-dark/10">Collections</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`text-sm hover:text-accent transition-colors ${activeCategory === null ? 'text-accent font-medium' : 'text-dark/70'}`}
                    >
                      All Candles
                    </button>
                  </li>
                  {availableCollections.map(col => (
                    <li key={col.id}>
                      <button
                        onClick={() => setActiveCategory(col.slug)}
                        className={`text-sm hover:text-accent transition-colors ${activeCategory === col.slug ? 'text-accent font-medium' : 'text-dark/70'}`}
                      >
                        {col.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {catalogRefreshFailed && (
              <p role="status" className="mb-4 text-center text-sm text-dark/60">
                Inventory could not be refreshed. Checkout will verify product availability.
              </p>
            )}
            {isLoadingProducts ? (
              <p role="status" className="py-24 text-center text-dark/50">Loading products...</p>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-xl text-dark/50">
                  {query || activeCategory ? 'No products found matching your criteria.' : 'No products are available yet.'}
                </p>
                <button
                  onClick={() => { setActiveCategory(null); setActiveSort('featured'); }}
                  className="mt-6 border-b border-dark text-dark hover:text-accent hover:border-accent transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-dark/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
          <div className="relative w-full max-w-xs bg-primary h-full shadow-xl p-6 overflow-y-auto animate-in slide-in-from-left">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-serif">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2">
                <X className="w-5 h-5 text-dark" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-dark mb-4 pb-2 border-b border-dark/10">Collections</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => { setActiveCategory(null); setIsFilterOpen(false); }}
                      className={`text-sm ${activeCategory === null ? 'text-accent font-medium' : 'text-dark/70'}`}
                    >
                      All Candles
                    </button>
                  </li>
                  {availableCollections.map(col => (
                    <li key={col.id}>
                      <button
                        onClick={() => { setActiveCategory(col.slug); setIsFilterOpen(false); }}
                        className={`text-sm ${activeCategory === col.slug ? 'text-accent font-medium' : 'text-dark/70'}`}
                      >
                        {col.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
