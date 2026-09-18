"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { cart, removeItem, updateQuantity, getCartTotal } = useCart();
  const [checkoutMsg, setCheckoutMsg] = useState('');

  const handleCheckout = () => {
    setCheckoutMsg("Checkout will be available soon.");
    setTimeout(() => setCheckoutMsg(''), 4000);
  };

  const freeShippingThreshold = 100;
  const total = getCartTotal();
  const awayFromFreeShipping = Math.max(0, freeShippingThreshold - total);
  const progressPercent = Math.min(100, (total / freeShippingThreshold) * 100);

  return (
    <div className="bg-primary min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-dark mb-12 text-center">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-dark/5">
            <ShoppingBag className="w-16 h-16 text-dark/20 mb-6" />
            <h2 className="text-2xl font-serif text-dark mb-4">Your cart is currently empty</h2>
            <p className="text-dark/60 max-w-md mx-auto mb-8">
              Looks like you haven't added any handmade candles to your cart yet.
            </p>
            <Link href="/shop">
              <Button size="lg" className="uppercase tracking-widest text-sm">
                Return to Shop
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white p-6 border border-dark/10 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  {awayFromFreeShipping > 0 ? (
                    <p className="text-sm font-medium">
                      You are <span className="font-bold text-accent">₹{awayFromFreeShipping.toFixed(2)}</span> away from free shipping.
                    </p>
                  ) : (
                    <p className="text-sm font-bold text-accent">
                      Congratulations! You've unlocked free shipping.
                    </p>
                  )}
                  <div className="w-full h-2 bg-dark/10 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="h-full bg-dark transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-dark/10 text-xs font-bold uppercase tracking-widest text-dark/50">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="space-y-6 md:space-y-0">
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-dark/10">
                    
                    {/* Mobile layout */}
                    <div className="flex md:hidden justify-between w-full mb-4">
                      <Link href={`/product/${item.slug}`} className="flex space-x-4">
                        <div className="relative w-20 h-24 bg-cream flex-shrink-0">
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg">{item.name}</h3>
                          <p className="text-sm text-dark/60">{item.size}</p>
                          <p className="mt-2 font-medium">₹{item.salePrice || item.price}</p>
                        </div>
                      </Link>
                      <button onClick={() => removeItem(item.id)} className="self-start text-dark/40 hover:text-dark">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex md:hidden justify-between items-center w-full">
                      <div className="flex items-center border border-dark/20">
                        <button className="px-3 py-2 text-dark/60" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-4 h-4" /></button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button className="px-3 py-2 text-dark/60" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-4 h-4" /></button>
                      </div>
                      <span className="font-bold">₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:flex col-span-6 items-center space-x-6">
                      <Link href={`/product/${item.slug}`} className="relative w-24 h-32 bg-cream flex-shrink-0 group block">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </Link>
                      <div>
                        <Link href={`/product/${item.slug}`} className="font-serif text-xl hover:text-accent transition-colors block mb-1">
                          {item.name}
                        </Link>
                        <p className="text-sm text-dark/60 mb-3">{item.size}</p>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-xs uppercase tracking-widest text-dark/50 hover:text-dark border-b border-dark/50 hover:border-dark transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="hidden md:block col-span-2 text-center font-medium">
                      ₹{(item.salePrice || item.price).toFixed(2)}
                    </div>
                    
                    <div className="hidden md:flex col-span-2 justify-center">
                      <div className="flex items-center border border-dark/20">
                        <button className="px-3 py-2 text-dark/60 hover:text-dark" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-3 h-3" /></button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button className="px-3 py-2 text-dark/60 hover:text-dark" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    
                    <div className="hidden md:block col-span-2 text-right font-bold text-lg">
                      ₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-8 border border-dark/10 sticky top-32">
                <h2 className="text-2xl font-serif text-dark mb-6 pb-4 border-b border-dark/10">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-dark/70">Subtotal</span>
                    <span className="font-medium">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark/70">Shipping</span>
                    <span>{awayFromFreeShipping > 0 ? 'Calculated at checkout' : 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark/70">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xl font-bold border-t border-dark/10 pt-6 mb-8">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                
                {checkoutMsg && (
                  <div className="bg-accent/10 text-accent p-3 mb-6 text-sm text-center font-medium rounded-sm">
                    {checkoutMsg}
                  </div>
                )}
                
                <Button 
                  size="lg" 
                  className="w-full uppercase tracking-widest text-sm mb-4"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <p className="text-xs text-center text-dark/50 flex items-center justify-center">
                  <span className="inline-block w-4 h-4 mr-2">🔒</span> Secure Checkout
                </p>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
