'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import apiClient from '@/lib/apiClient';
import type { OrderStatus, StoreOrder } from '@/lib/orders';
import { formatOrderDate, orderStatusLabels } from '@/lib/orders';
import { Button } from '@/components/ui/Button';

type OrderAction = 'confirm' | 'reject' | 'processing' | 'shipped' | 'delivered';

const nextActions: Partial<Record<OrderStatus, Array<{ action: OrderAction; label: string }>>> = {
  PAYMENT_REVIEW: [
    { action: 'confirm', label: 'Verify payment & confirm' },
    { action: 'reject', label: 'Reject payment' },
  ],
  CONFIRMED: [{ action: 'processing', label: 'Mark processing' }],
  PROCESSING: [{ action: 'shipped', label: 'Mark shipped' }],
  SHIPPED: [{ action: 'delivered', label: 'Mark delivered' }],
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await apiClient.get<StoreOrder[]>('/orders/admin');
      setOrders(data);
      setErrorMessage('');
    } catch {
      setErrorMessage('Could not load orders. Check the connection and refresh.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
    const interval = window.setInterval(() => { void fetchOrders(); }, 15000);
    return () => window.clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (order: StoreOrder, action: OrderAction) => {
    setUpdatingOrderId(order.id);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const rejectionReason = rejectionReasons[order.id]?.trim();
      const { data } = await apiClient.patch<StoreOrder>(`/orders/admin/${encodeURIComponent(order.id)}/status`, {
        action,
        ...(action === 'reject' ? { rejectionReason } : {}),
      });
      setOrders((current) => current.map((currentOrder) => currentOrder.id === data.id ? data : currentOrder));
      setSuccessMessage(
        action === 'confirm'
          ? `Payment verified. Order #${order.id.slice(0, 8).toUpperCase()} confirmed; stock reserved.`
          : action === 'reject'
            ? 'Payment rejected. The customer can see the review result.'
            : 'Order status updated.',
      );
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      setErrorMessage(message || 'Could not update the order status. Please retry.');
      void fetchOrders();
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading) return <p role="status" className="bg-white p-8 text-center text-dark/60">Loading orders…</p>;

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Match each QR payment in your payment account using the order amount, submission time, and customer details before confirming. Confirmation reserves stock and starts the 7-day delivery estimate. Rejected payments are not refunded automatically.
      </div>
      {errorMessage && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}
      {successMessage && <p role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-800">{successMessage}</p>}
      {orders.length === 0 ? (
        <p className="bg-white p-8 text-center text-dark/60">No orders have been submitted yet.</p>
      ) : orders.map((order) => {
        const status = order.status as OrderStatus;
        const actions = nextActions[status] || [];
        return (
          <article key={order.id} className="space-y-5 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-dark/10 pb-4">
              <div>
                <p className="text-xs text-dark/50">Order #{order.id.slice(0, 8).toUpperCase()} · {formatOrderDate(order.createdAt)}</p>
                <h3 className="mt-1 font-serif text-xl text-dark">{orderStatusLabels[status] || order.status}</h3>
                <p className="mt-1 text-sm text-dark/60">{order.user?.name} · {order.user?.email}</p>
              </div>
              <p className="text-lg font-semibold text-dark">₹{order.totalAmount.toFixed(2)}</p>
            </div>

            <div className="grid gap-5 text-sm md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-dark">Items</h4>
                <ul className="space-y-1 text-dark/70">
                  {order.orderItems.map((item) => (
                    <li key={item.id}>{item.name || 'Product'} × {item.quantity} — ₹{(item.price * item.quantity).toFixed(2)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-dark">Payment review</h4>
                <p className="text-dark/70">Payment method: QR payment</p>
                <p className="text-dark/70">Submitted: {order.paymentSubmittedAt ? formatOrderDate(order.paymentSubmittedAt) : '—'}</p>
                {order.paymentReviewedAt && <p className="text-dark/70">Reviewed: {formatOrderDate(order.paymentReviewedAt)}</p>}
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-dark">Deliver to</h4>
                <p className="text-dark/70">{order.customerName}<br />{order.phone}<br />{order.shippingAddress}<br />{order.city}, {order.state} {order.postalCode}</p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-dark">Delivery estimate</h4>
                <p className="text-dark/70">
                  {order.estimatedDeliveryAt
                    ? `By ${formatOrderDate(order.estimatedDeliveryAt)}`
                    : status === 'PAYMENT_REVIEW'
                      ? 'Starts after payment confirmation'
                      : 'Not set'}
                </p>
                {order.rejectionReason && <p className="mt-2 text-red-700">Review note: {order.rejectionReason}</p>}
              </div>
            </div>

            {actions.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-dark/10 pt-4">
                {status === 'PAYMENT_REVIEW' && actions.some(({ action }) => action === 'reject') && (
                  <textarea
                    aria-label={`Rejection reason for order ${order.id.slice(0, 8)}`}
                    value={rejectionReasons[order.id] || ''}
                    onChange={(event) => setRejectionReasons((current) => ({ ...current, [order.id]: event.target.value }))}
                    placeholder="Required if rejecting: explain why the payment could not be verified"
                    maxLength={300}
                    className="min-h-20 w-full rounded-md border border-dark/15 p-3 text-sm"
                  />
                )}
                <div className="flex flex-wrap gap-3">
                  {actions.map(({ action, label }) => (
                    <Button
                      key={action}
                      type="button"
                      variant={action === 'reject' ? 'outline' : 'primary'}
                      disabled={updatingOrderId === order.id || (action === 'reject' && (rejectionReasons[order.id]?.trim().length || 0) < 3)}
                      isLoading={updatingOrderId === order.id}
                      onClick={() => { void updateStatus(order, action); }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
