"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Product } from '@/data/products';
import apiClient from '@/lib/apiClient';
import { ApiProduct, mapApiProduct } from '@/lib/storeProducts';

interface WishlistContextType {
  wishlist: Product[];
  wishlistNotice: string;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const LEGACY_WISHLIST_KEY = 'hanurya_wishlist';

const readLegacyWishlist = (): Product[] => {
  const saved = localStorage.getItem(LEGACY_WISHLIST_KEY);
  if (!saved) return [];
  try {
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error('Saved wishlist must be a list.');
    return parsed.filter((item): item is Product =>
      item !== null
      && typeof item === 'object'
      && 'id' in item && typeof item.id === 'string'
      && 'name' in item && typeof item.name === 'string',
    );
  } catch (error) {
    console.error('Could not read the previous browser wishlist for account migration.', error);
    return [];
  }
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistNotice, setWishlistNotice] = useState('');
  const wishlistRef = useRef<Product[]>([]);
  const authTokenRef = useRef<string | null>(null);
  const hydratedTokenRef = useRef<string | null>(null);
  const syncSequenceRef = useRef(0);
  const persistenceQueueRef = useRef<Promise<void>>(Promise.resolve());

  const commitWishlist = (nextWishlist: Product[]) => {
    wishlistRef.current = nextWishlist;
    setWishlist(nextWishlist);
  };

  useEffect(() => {
    let active = true;

    const syncAccountWishlist = async () => {
      const token = localStorage.getItem('token');
      if (token === authTokenRef.current && hydratedTokenRef.current === token) return;

      const syncSequence = ++syncSequenceRef.current;
      authTokenRef.current = token;
      hydratedTokenRef.current = null;

      if (!token) {
        commitWishlist([]);
        setWishlistNotice('');
        return;
      }

      const previousWishlist = [...wishlistRef.current, ...readLegacyWishlist()];
      try {
        const { data } = await apiClient.get<ApiProduct[]>('/account/wishlist');
        if (!active || syncSequence !== syncSequenceRef.current) return;

        const serverWishlist = data.map(mapApiProduct);
        const catalog = previousWishlist.length
          ? (await apiClient.get<ApiProduct[]>('/products')).data
          : [];
        if (!active || syncSequence !== syncSequenceRef.current) return;

        const catalogById = new Map(catalog.map((product) => [product.id, mapApiProduct(product)]));
        const mergedWishlist = new Map(serverWishlist.map((product) => [product.id, product]));
        let adjusted = false;
        for (const previousProduct of previousWishlist) {
          const currentProduct = catalogById.get(previousProduct.id);
          if (currentProduct) mergedWishlist.set(currentProduct.id, currentProduct);
          else adjusted = true;
        }

        const nextWishlist = [...mergedWishlist.values()];
        if (previousWishlist.length) {
          const savedWishlist = await apiClient.put<ApiProduct[]>('/account/wishlist', {
            items: nextWishlist.map(({ id }) => ({ productId: id })),
          });
          if (!active || syncSequence !== syncSequenceRef.current) return;
          commitWishlist(savedWishlist.data.map(mapApiProduct));
          localStorage.removeItem(LEGACY_WISHLIST_KEY);
        } else {
          commitWishlist(serverWishlist);
        }

        hydratedTokenRef.current = token;
        setWishlistNotice(adjusted ? 'Unavailable wishlist items were removed while saving your account.' : '');
      } catch (error) {
        if (!active || syncSequence !== syncSequenceRef.current) return;
        authTokenRef.current = null;
        setWishlistNotice('Could not load or save your account wishlist. Please refresh and try again.');
        console.error('Could not synchronize the account wishlist with the database.', error);
      }
    };

    const onAuthChange = () => { void syncAccountWishlist(); };
    const onFocus = () => { void syncAccountWishlist(); };
    window.addEventListener('auth-change', onAuthChange);
    window.addEventListener('focus', onFocus);
    void syncAccountWishlist();

    return () => {
      active = false;
      syncSequenceRef.current += 1;
      window.removeEventListener('auth-change', onAuthChange);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  useEffect(() => {
    const token = authTokenRef.current;
    if (!token || hydratedTokenRef.current !== token) return;

    const items = wishlist.map(({ id }) => ({ productId: id }));
    const timeout = window.setTimeout(() => {
      persistenceQueueRef.current = persistenceQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          if (localStorage.getItem('token') !== token) return;
          await apiClient.put('/account/wishlist', { items });
          if (localStorage.getItem('token') === token) setWishlistNotice('');
        })
        .catch((error: unknown) => {
          if (localStorage.getItem('token') === token) {
            setWishlistNotice('Wishlist changes could not be saved to your account. Please try again.');
            console.error('Could not save the account wishlist to the database.', error);
          }
        });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [wishlist]);

  const addItem = (product: Product) => {
    const nextWishlist = wishlistRef.current.some((item) => item.id === product.id)
      ? wishlistRef.current
      : [...wishlistRef.current, product];
    commitWishlist(nextWishlist);
    setWishlistNotice(authTokenRef.current ? '' : 'Sign in to save your wishlist to your account.');
  };

  const removeItem = (productId: string) => {
    commitWishlist(wishlistRef.current.filter((product) => product.id !== productId));
    if (!authTokenRef.current) setWishlistNotice('Sign in to save your wishlist to your account.');
  };

  const isInWishlist = (productId: string) => wishlist.some((product) => product.id === productId);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistNotice,
      addItem,
      removeItem,
      isInWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
