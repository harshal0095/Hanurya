"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Product } from '@/data/products';
import apiClient from '@/lib/apiClient';
import { ApiProduct, mapApiProduct } from '@/lib/storeProducts';

export interface CartItem extends Product {
  quantity: number;
}

interface ApiCartItem extends ApiProduct {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartNotice: string;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const LEGACY_CART_KEY = 'hanurya_cart';

const mapApiCart = (items: ApiCartItem[]): CartItem[] =>
  items.map(({ quantity, ...product }) => ({ ...mapApiProduct(product), quantity }));

const readLegacyCart = (): CartItem[] => {
  const savedCart = localStorage.getItem(LEGACY_CART_KEY);
  if (!savedCart) return [];
  try {
    const storedItems: unknown = JSON.parse(savedCart);
    if (!Array.isArray(storedItems)) throw new Error('Saved cart must be a list.');
    return storedItems.filter((item): item is CartItem =>
      item !== null
      && typeof item === 'object'
      && 'id' in item && typeof item.id === 'string'
      && 'name' in item && typeof item.name === 'string'
      && 'quantity' in item && Number.isInteger(item.quantity) && item.quantity > 0
      && 'stock' in item && Number.isInteger(item.stock)
      && 'price' in item && typeof item.price === 'number'
      && 'images' in item && Array.isArray(item.images),
    );
  } catch (error) {
    console.error('Could not read the previous browser cart for account migration.', error);
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartRef = useRef<CartItem[]>([]);
  const [cartNotice, setCartNotice] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const authTokenRef = useRef<string | null>(null);
  const hydratedTokenRef = useRef<string | null>(null);
  const syncSequenceRef = useRef(0);
  const persistenceQueueRef = useRef<Promise<void>>(Promise.resolve());

  const commitCart = (nextCart: CartItem[]) => {
    cartRef.current = nextCart;
    setCart(nextCart);
  };

  useEffect(() => {
    let active = true;

    const syncAccountCart = async () => {
      const token = localStorage.getItem('token');
      if (token === authTokenRef.current && hydratedTokenRef.current === token) return;

      const syncSequence = ++syncSequenceRef.current;
      authTokenRef.current = token;
      hydratedTokenRef.current = null;

      if (!token) {
        commitCart([]);
        setCartNotice('');
        return;
      }

      const previousCart = [...cartRef.current, ...readLegacyCart()];
      try {
        const { data } = await apiClient.get<ApiCartItem[]>('/account/cart');
        if (!active || syncSequence !== syncSequenceRef.current) return;

        const serverCart = mapApiCart(data);
        const catalog = previousCart.length
          ? (await apiClient.get<ApiProduct[]>('/products')).data
          : [];
        if (!active || syncSequence !== syncSequenceRef.current) return;

        const productById = new Map(catalog.map((product) => [product.id, product]));
        const mergedCart = new Map(serverCart.map((item) => [item.id, item]));
        let adjusted = false;

        for (const previousItem of previousCart) {
          const currentProduct = productById.get(previousItem.id);
          if (!currentProduct) {
            adjusted = true;
            continue;
          }

          const existing = mergedCart.get(previousItem.id);
          const currentQuantity = existing?.quantity ?? 0;
          const availableForMerge = Math.max(0, currentProduct.stock - currentQuantity);
          const quantityToAdd = Math.min(previousItem.quantity, availableForMerge);
          if (quantityToAdd < previousItem.quantity) adjusted = true;
          if (quantityToAdd > 0) {
            mergedCart.set(previousItem.id, {
              ...mapApiProduct(currentProduct),
              quantity: currentQuantity + quantityToAdd,
            });
          }
        }

        const nextCart = [...mergedCart.values()];
        const hasPendingCart = previousCart.length > 0;
        if (hasPendingCart) {
          const savedCart = await apiClient.put<ApiCartItem[]>('/account/cart', {
            items: nextCart.map(({ id, quantity }) => ({ productId: id, quantity })),
          });
          if (!active || syncSequence !== syncSequenceRef.current) return;
          commitCart(mapApiCart(savedCart.data));
          localStorage.removeItem(LEGACY_CART_KEY);
        } else {
          commitCart(serverCart);
        }

        hydratedTokenRef.current = token;
        setCartNotice(adjusted ? 'Unavailable items or quantities were adjusted while saving your account cart.' : '');
      } catch (error) {
        if (!active || syncSequence !== syncSequenceRef.current) return;
        authTokenRef.current = null;
        setCartNotice('Could not load or save your account cart. Please refresh and try again.');
        console.error('Could not synchronize the account cart with the database.', error);
      }
    };

    const onAuthChange = () => { void syncAccountCart(); };
    const onFocus = () => { void syncAccountCart(); };
    window.addEventListener('auth-change', onAuthChange);
    window.addEventListener('focus', onFocus);
    void syncAccountCart();

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

    const items = cart.map(({ id, quantity }) => ({ productId: id, quantity }));
    const timeout = window.setTimeout(() => {
      persistenceQueueRef.current = persistenceQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          if (localStorage.getItem('token') !== token) return;
          await apiClient.put('/account/cart', { items });
          if (localStorage.getItem('token') === token) setCartNotice('');
        })
        .catch((error: unknown) => {
          if (localStorage.getItem('token') === token) {
            setCartNotice('Cart changes could not be saved to your account. Please try again.');
            console.error('Could not save the account cart to the database.', error);
          }
        });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [cart]);

  const addItem = (product: Product, quantity: number = 1) => {
    const currentCart = cartRef.current;
    const existingItem = currentCart.find((item) => item.id === product.id);
    const stock = Math.max(0, Math.floor(Number(product.stock) || 0));
    const currentQuantity = existingItem?.quantity ?? 0;
    const requestedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    const allowedQuantity = Math.min(requestedQuantity, Math.max(0, stock - currentQuantity));

    if (allowedQuantity === 0) {
      setCartNotice(stock === 0 ? `${product.name} is out of stock.` : `Only ${stock} ${product.name} available in stock.`);
      setIsCartOpen(true);
      return;
    }

    const nextCart = existingItem
      ? currentCart.map((item) => item.id === product.id
        ? { ...item, ...product, stock, quantity: currentQuantity + allowedQuantity }
        : item)
      : [...currentCart, { ...product, stock, quantity: allowedQuantity }];
    commitCart(nextCart);
    if (!authTokenRef.current) setCartNotice('Sign in to save your cart to your account.');
    else setCartNotice('');
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    commitCart(cartRef.current.filter((item) => item.id !== productId));
    if (!authTokenRef.current) setCartNotice('Sign in to save your cart to your account.');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const requestedQuantity = Math.floor(Number(quantity));
    if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const item = cartRef.current.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    const stock = Math.max(0, Math.floor(Number(item.stock) || 0));
    if (stock === 0) {
      removeItem(productId);
      setCartNotice(`${item.name} is out of stock and was removed from your cart.`);
      return;
    }

    const nextQuantity = Math.min(requestedQuantity, stock);
    commitCart(cartRef.current.map((cartItem) => cartItem.id === productId
      ? { ...cartItem, quantity: nextQuantity }
      : cartItem));
    if (requestedQuantity > stock) setCartNotice(`Only ${stock} ${item.name} available in stock.`);
    else if (!authTokenRef.current) setCartNotice('Sign in to save your cart to your account.');
    else setCartNotice('');
  };

  const clearCart = () => {
    commitCart([]);
    if (!authTokenRef.current) setCartNotice('Sign in to save your cart to your account.');
  };

  const getCartTotal = () => cart.reduce((total, item) => {
    const price = item.salePrice || item.price;
    return total + price * item.quantity;
  }, 0);

  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      cartNotice,
      isCartOpen,
      setIsCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
