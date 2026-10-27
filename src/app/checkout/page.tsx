'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import apiClient from '@/lib/apiClient';
import type { OrderQuote } from '@/lib/orders';

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID?.trim() || '';
const PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME?.trim() || '';

interface DeliveryDetails {
  customerName: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  postalCode: string;
}

const emptyDeliveryDetails: DeliveryDetails = {
  customerName: '',
  phone: '',
  shippingAddress: '',
  city: '',
  state: '',
  postalCode: '',
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [delivery, setDelivery] = useState(emptyDeliveryDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();
  const upiLink = quote && UPI_ID && PAYEE_NAME
    ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${quote.total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Hanurya order')}`
    : '';

  useEffect(() => {
    setIsSignedIn(Boolean(localStorage.getItem('token')));
  }, []);

  useEffect(() => {
    let active = true;
    const items = cart.map(({ id, quantity }) => ({ productId: id, quantity }));
    if (items.length === 0) {
      setQuote(null);
      setQuoteError('');
      return () => { active = false; };
    }

    setQuote(null);
    setQuoteError('');
    apiClient.post<OrderQuote>('/orders/quote', { items })
      .then(({ data }) => {
        if (active) setQuote(data);
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message = axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined;
        setQuoteError(message || 'Could not verify current prices and stock. Please try again.');
      });

    return () => { active = false; };
  }, [cart]);

  const updateDelivery = (field: keyof DeliveryDetails, value: string) => {
    setDelivery((current) => ({ ...current, [field]: value }));
  };

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!quote) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const { data } = await apiClient.post<{ id: string }>('/orders', {
        ...delivery,
        items: cart.map(({ id, quantity }) => ({ productId: id, quantity })),
        expectedTotal: quote.total,
      });
      clearCart();
      router.push(`/orders/${data.id}`);
    } catch (error: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setErrorMessage(responseMessage || 'Could not submit your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link href="/cart" className="mb-8 inline-flex items-center gap-2 text-sm text-dark/60 hover:text-dark">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>
        <h1 className="mb-8 font-serif text-3xl text-dark">Checkout</h1>

        {cart.length === 0 ? (
          <section className="bg-white p-8 text-center shadow-sm">
            <p className="mb-5 text-dark/60">Your cart is empty.</p>
            <Link href="/shop"><Button>Return to shop</Button></Link>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <section className="space-y-8">
              <div className="bg-white p-6 shadow-sm sm:p-9">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Step 1 · Manual UPI payment</p>
                <h2 className="mb-2 font-serif text-2xl text-dark">Scan the QR code to pay</h2>
                <p className="mb-7 text-sm text-dark/60">The order amount is included in the QR code and will be prefilled in your UPI app. The admin will check your payment before confirming the order.</p>

                {quoteError && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{quoteError}</p>}
                {!quote && !quoteError && <p role="status" className="py-6 text-sm text-dark/60">Checking current product prices and availability…</p>}

                {quote && (!UPI_ID || !PAYEE_NAME) && (
                  <p role="alert" className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                    UPI payments are temporarily unavailable. Please contact the store before placing your order.
                  </p>
                )}
                {quote && UPI_ID && PAYEE_NAME && (
                  <div className="flex flex-col items-center border-t border-dark/10 pt-7">
                    <div className="mb-5 bg-white p-3 ring-1 ring-dark/10">
                      <QRCodeSVG value={upiLink} size={220} level="M" includeMargin />
                    </div>
                    <p className="mb-1 text-3xl font-semibold text-dark">₹{quote.total.toFixed(2)}</p>
                    <p className="mb-2 text-sm text-dark/60">Pay to {PAYEE_NAME}</p>
                    <p className="mb-5 text-xs text-dark/50">Scan with any UPI app. The amount is prefilled automatically.</p>
                    <a href={upiLink} className="inline-flex h-11 items-center justify-center gap-2 bg-dark px-5 text-sm font-medium text-white hover:bg-dark/90 sm:hidden">
                      <Smartphone className="h-4 w-4" /> Open UPI app
                    </a>
                    <p className="mt-5 max-w-sm text-center text-xs leading-relaxed text-dark/50">
                      After you submit the order, an administrator will check your payment and confirm the order.
                    </p>
                  </div>
                )}
              </div>

              <form onSubmit={submitOrder} className="space-y-6 bg-white p-6 shadow-sm sm:p-9">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Step 2 · Delivery details</p>
                  <h2 className="font-serif text-2xl text-dark">Where should we deliver?</h2>
                  <p className="mt-2 text-sm text-dark/60">After you submit, your order appears in your account while the admin checks your payment.</p>
                </div>

                {!isSignedIn && (
                  <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                    Please <Link href="/login" className="font-semibold underline">sign in</Link> or <Link href="/register" className="font-semibold underline">create an account</Link> before submitting your order.
                  </p>
                )}
                {errorMessage && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Full name" required minLength={2} maxLength={100} autoComplete="name" value={delivery.customerName} onChange={(event) => updateDelivery('customerName', event.target.value)} />
                  <Input label="Phone number" required type="tel" autoComplete="tel" value={delivery.phone} onChange={(event) => updateDelivery('phone', event.target.value)} />
                </div>
                <Input label="Delivery address" required minLength={5} maxLength={250} autoComplete="street-address" value={delivery.shippingAddress} onChange={(event) => updateDelivery('shippingAddress', event.target.value)} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="City" required maxLength={100} autoComplete="address-level2" value={delivery.city} onChange={(event) => updateDelivery('city', event.target.value)} />
                  <Input label="State" required maxLength={100} autoComplete="address-level1" value={delivery.state} onChange={(event) => updateDelivery('state', event.target.value)} />
                  <Input label="Postal code" required maxLength={12} autoComplete="postal-code" value={delivery.postalCode} onChange={(event) => updateDelivery('postalCode', event.target.value)} />
                </div>
                <Button type="submit" isLoading={isSubmitting} disabled={!quote || !isSignedIn || !UPI_ID || !PAYEE_NAME} className="w-full">
                  I have paid — submit for admin verification
                </Button>
              </form>
            </section>

            <aside className="h-fit bg-white p-6 shadow-sm sm:p-7">
              <h2 className="mb-5 border-b border-dark/10 pb-4 font-serif text-xl text-dark">Order summary</h2>
              {quote ? (
                <div className="mb-5 space-y-3">
                  {quote.items.map((item) => (
                    <div key={item.productId} className="flex justify-between gap-4 text-sm">
                      <span className="text-dark/70">{item.name} × {item.quantity}</span>
                      <span className="shrink-0 text-dark">₹{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="mb-5 text-sm text-dark/50">Verifying current prices…</p>}
              <div className="flex justify-between border-t border-dark/10 pt-4 font-semibold text-dark">
                <span>Total</span>
                <span>{quote ? `₹${quote.total.toFixed(2)}` : '—'}</span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-dark/50">Delivery is estimated within 7 days after the admin confirms your payment.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
