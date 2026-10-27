'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { formatOrderDate, orderStatusLabels, type StoreOrder } from '@/lib/orders';

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchOrder = useCallback(async () => {
    try {
      const { data } = await apiClient.get<StoreOrder>(`/orders/mine/${encodeURIComponent(orderId)}`);
      setOrder(data);
      setErrorMessage('');
    } catch {
      setErrorMessage('We could not load this order. Please refresh or check your account.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
      return;
    }
    void fetchOrder();
    const interval = window.setInterval(() => { void fetchOrder(); }, 15000);
    return () => window.clearInterval(interval);
  }, [fetchOrder, router]);

  return (
    <main className="min-h-[70vh] bg-primary px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/orders" className="mb-7 inline-block text-sm font-medium text-accent hover:text-dark">← Back to my orders</Link>
        {errorMessage && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}
        {isLoading ? (
          <p role="status" className="bg-white p-8 text-center text-dark/60">Loading order…</p>
        ) : order ? (
          <article className="space-y-6">
            <div className="flex justify-end">
              <Link href={`/orders/${order.id}/invoice`} className="inline-flex items-center gap-2 rounded-md bg-dark px-4 py-2 text-sm font-semibold text-white hover:bg-dark/85">
                <FileText className="h-4 w-4" /> View / download bill
              </Link>
            </div>
            <section className="bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs text-dark/50">Order #{order.id.slice(0, 8).toUpperCase()}</p>
              <h1 className="mt-2 font-serif text-3xl text-dark">{orderStatusLabels[order.status as keyof typeof orderStatusLabels] || order.status}</h1>
              <p className="mt-2 text-sm text-dark/60">Placed {formatOrderDate(order.createdAt)}</p>
              {order.status === 'PAYMENT_REVIEW' && (
                <div role="status" className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Admin is checking your payment. Your order will be confirmed here as soon as the payment is verified.
                </div>
              )}
              {order.status === 'CONFIRMED' && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                  Your payment has been verified and your order is confirmed.
                  {order.estimatedDeliveryAt && <p className="mt-1 font-semibold">Expected delivery by {formatOrderDate(order.estimatedDeliveryAt)} (within 7 days of confirmation).</p>}
                </div>
              )}
              {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                  Your order is confirmed and {orderStatusLabels[order.status as keyof typeof orderStatusLabels]?.toLowerCase()}.
                  {order.estimatedDeliveryAt && order.status !== 'DELIVERED' && <p className="mt-1 font-semibold">Expected delivery by {formatOrderDate(order.estimatedDeliveryAt)}.</p>}
                </div>
              )}
              {order.status === 'REJECTED' && (
                <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  We could not verify the payment. {order.rejectionReason || 'Please contact the store with your order number.'}
                </div>
              )}
            </section>

            <section className="bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 font-serif text-xl text-dark">Items and payment</h2>
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 border-b border-dark/10 pb-3 text-sm">
                    <span>{item.name || 'Product'} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between font-semibold text-dark">
                <span>Total</span><span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <p className="mt-3 text-xs text-dark/50">Payment method: QR payment</p>
            </section>

            <section className="bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-3 font-serif text-xl text-dark">Delivery address</h2>
              <p className="text-sm text-dark/70">{order.customerName}<br />{order.phone}<br />{order.shippingAddress}<br />{order.city}, {order.state} {order.postalCode}</p>
            </section>
          </article>
        ) : null}
      </div>
    </main>
  );
}
