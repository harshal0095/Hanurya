'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Download, Printer } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { formatOrderDate, orderStatusLabels, type StoreOrder } from '@/lib/orders';

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toFixed(2)}`;
}

export default function OrderInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
      return;
    }

    let active = true;
    apiClient.get<StoreOrder>(`/orders/mine/${encodeURIComponent(id)}`)
      .then(({ data }) => {
        if (active) setOrder(data);
      })
      .catch(() => {
        if (active) setErrorMessage('We could not load this bill. Please check your account and try again.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, [id, router]);

  const downloadBill = () => window.print();

  return (
    <main className="min-h-[70vh] bg-primary px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div data-print-hidden className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/orders/${encodeURIComponent(id)}`} className="text-sm font-medium text-accent hover:text-dark">
            ← Back to order
          </Link>
          {order && (
            <button
              type="button"
              onClick={downloadBill}
              className="inline-flex items-center gap-2 rounded-md bg-dark px-4 py-2.5 text-sm font-semibold text-white hover:bg-dark/85"
            >
              <Download className="h-4 w-4" /> Download bill / Print
            </button>
          )}
        </div>

        {isLoading ? (
          <p role="status" className="bg-white p-8 text-center text-dark/60">Loading your bill…</p>
        ) : errorMessage ? (
          <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>
        ) : order ? (
          <>
            <article data-print-invoice className="border border-dark/10 bg-white p-6 shadow-sm sm:p-10">
              <header className="flex flex-wrap items-start justify-between gap-6 border-b border-dark/15 pb-6">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Hanurya</p>
                  <h1 className="mt-2 font-serif text-3xl text-dark">Order bill</h1>
                  <p className="mt-1 text-sm text-dark/55">Order summary and payment record</p>
                </div>
                <div className="text-sm sm:text-right">
                  <p className="font-semibold text-dark">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="mt-1 text-dark/60">Placed {formatOrderDate(order.createdAt)}</p>
                  <p className="mt-1 text-dark/60">{orderStatusLabels[order.status as keyof typeof orderStatusLabels] || order.status}</p>
                </div>
              </header>

              <section className="grid gap-6 border-b border-dark/10 py-6 sm:grid-cols-2">
                <div>
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark/50">Bill to</h2>
                  <p className="font-semibold text-dark">{order.customerName || 'Customer'}</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-dark/70">
                    {[order.phone, order.shippingAddress, [order.city, order.state, order.postalCode].filter(Boolean).join(', ')].filter(Boolean).join('\n')}
                  </p>
                </div>
                <div>
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark/50">Payment</h2>
                  <p className="text-sm text-dark/70">Method: QR payment</p>
                  <p className="mt-1 text-sm text-dark/70">
                    Status: {order.status === 'REJECTED'
                      ? 'Payment not verified'
                      : ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)
                        ? 'Payment verified'
                        : 'Admin is checking your payment'}
                  </p>
                </div>
              </section>

              <section className="py-6">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-dark/15 text-xs uppercase tracking-wider text-dark/50">
                      <th scope="col" className="pb-3 pr-3 font-semibold">Item</th>
                      <th scope="col" className="px-2 pb-3 text-right font-semibold">Qty</th>
                      <th scope="col" className="px-2 pb-3 text-right font-semibold">Price</th>
                      <th scope="col" className="pb-3 pl-2 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item) => (
                      <tr key={item.id} className="border-b border-dark/10">
                        <td className="py-4 pr-3 font-medium text-dark">{item.name || 'Product'}</td>
                        <td className="px-2 py-4 text-right text-dark/70">{item.quantity}</td>
                        <td className="px-2 py-4 text-right text-dark/70">{formatCurrency(item.price)}</td>
                        <td className="py-4 pl-2 text-right font-medium text-dark">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="ml-auto mt-5 flex max-w-xs justify-between border-t-2 border-dark pt-4 text-lg font-bold text-dark">
                  <span>Order total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </section>

              <footer className="border-t border-dark/10 pt-5 text-xs leading-relaxed text-dark/55">
                This is an order bill, not a tax invoice. The order is confirmed only after the admin verifies the payment.
              </footer>
            </article>
            <p data-print-hidden className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-dark/50">
              <Printer className="h-4 w-4" /> In the print dialog, choose “Save as PDF” to download this bill.
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
