'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { formatOrderDate, orderStatusLabels, type StoreOrder } from '@/lib/orders';
import { FileText } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await apiClient.get<StoreOrder[]>('/orders/mine');
      setOrders(data);
      setErrorMessage('');
    } catch {
      setErrorMessage('We could not load your orders. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
      return;
    }
    void fetchOrders();
    const interval = window.setInterval(() => { void fetchOrders(); }, 15000);
    return () => window.clearInterval(interval);
  }, [fetchOrders, router]);

  return (
    <main className="min-h-[70vh] bg-primary px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Your account</p>
            <h1 className="font-serif text-3xl text-dark">My orders</h1>
            <p className="mt-2 text-sm text-dark/60">Order updates refresh automatically while this page is open.</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-accent hover:text-dark">Continue shopping</Link>
        </div>

        {errorMessage && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}
        {isLoading ? (
          <p role="status" className="bg-white p-8 text-center text-dark/60">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 text-center shadow-sm">
            <p className="mb-4 text-dark/60">You have not placed any orders yet.</p>
            <Link href="/shop" className="font-semibold text-accent">Browse the shop</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-dark/50">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <h2 className="mt-1 font-serif text-xl text-dark">{orderStatusLabels[order.status as keyof typeof orderStatusLabels] || order.status}</h2>
                    <p className="mt-1 text-sm text-dark/60">Placed {formatOrderDate(order.createdAt)} · {order.orderItems.length} item(s)</p>
                  </div>
                  <p className="font-semibold text-dark">₹{order.totalAmount.toFixed(2)}</p>
                </div>
                <p className="mt-4 border-t border-dark/10 pt-4 text-sm text-dark/60">
                  {order.status === 'PAYMENT_REVIEW' && 'Admin is checking your payment. Your order will be confirmed once it is verified.'}
                  {order.status === 'CONFIRMED' && 'Your order is confirmed. Delivery is expected within 7 days.'}
                  {order.status === 'PROCESSING' && 'Your order is being prepared for delivery.'}
                  {order.status === 'SHIPPED' && 'Your order is on its way.'}
                  {order.status === 'DELIVERED' && 'Your order has been delivered.'}
                  {order.status === 'REJECTED' && `Payment was not verified${order.rejectionReason ? `: ${order.rejectionReason}` : '.'}`}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 border-t border-dark/10 pt-4 text-sm">
                  <Link href={`/orders/${order.id}`} className="font-semibold text-accent hover:text-dark">View order details</Link>
                  <Link href={`/orders/${order.id}/invoice`} className="inline-flex items-center gap-2 font-semibold text-accent hover:text-dark">
                    <FileText className="h-4 w-4" /> View / download bill
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
