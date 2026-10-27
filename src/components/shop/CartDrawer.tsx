"use client";

import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

export default function CartDrawer() {
  const { cart, cartNotice, isCartOpen, setIsCartOpen, removeItem, updateQuantity, getCartTotal } = useCart();
  const freeShippingThreshold = 100;
  const total = getCartTotal();
  const awayFromFreeShipping = Math.max(0, freeShippingThreshold - total);
  const progressPercent = Math.min(100, (total / freeShippingThreshold) * 100);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-dark/20 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="relative w-full max-w-md bg-primary h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-dark/10">
          <h2 className="text-xl font-serif">Your Cart ({cart.length})</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 -mr-2 hover:text-accent transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 bg-cream border-b border-dark/10">
          {awayFromFreeShipping > 0 ? (
            <p className="text-sm text-center mb-2">
              You're <span className="font-bold">₹{awayFromFreeShipping.toFixed(2)}</span> away from free shipping.
            </p>
          ) : (
            <p className="text-sm text-center mb-2 font-bold text-accent">
              You've unlocked free shipping!
            </p>
          )}
          <div className="w-full h-1.5 bg-dark/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-dark transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartNotice && <p role="status" className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{cartNotice}</p>}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-dark/20" />
              <p className="text-dark/60">Your cart is currently empty.</p>
              <Button onClick={() => setIsCartOpen(false)} className="mt-4">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="relative w-24 h-32 bg-cream flex-shrink-0">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-lg hover:text-accent transition-colors pr-4"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-dark/40 hover:text-dark transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-dark/60">{item.size}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-dark/20">
                        <button
                          className="px-3 py-1 text-dark/60 hover:text-dark"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          className="px-3 py-1 text-dark/60 hover:text-dark disabled:cursor-not-allowed disabled:opacity-30"
                          disabled={item.quantity >= item.stock}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-medium">₹{(item.salePrice || item.price) * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-dark/10 bg-primary space-y-4">
            <div className="flex justify-between text-lg font-serif">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-dark/60">Shipping and taxes calculated at checkout.</p>
            <div className="space-y-3">
              <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                <Button variant="outline" className="w-full uppercase tracking-widest text-xs">
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                <Button className="w-full uppercase tracking-widest text-xs">
                  Proceed to Payment
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
