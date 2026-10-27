'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import { FileText, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatOrderDate, orderStatusLabels, type StoreOrder } from '@/lib/orders';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [ordersError, setOrdersError] = useState('');
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get('/auth/me');
        setUser(res.data);
        try {
          const { data } = await apiClient.get<StoreOrder[]>('/orders/mine');
          setOrders(data);
        } catch {
          setOrdersError('Could not load your orders. Please refresh the page to try again.');
        } finally {
          setIsOrdersLoading(false);
        }
      } catch {
        // Token invalid or not present
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-[70vh] bg-primary flex items-start justify-center p-4 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white p-8 sm:p-12 shadow-sm rounded-2xl border border-dark/5"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-10 pb-10 border-b border-dark/10">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-dark/40" />
            </div>
            <div>
              <h1 className="text-3xl font-serif text-dark mb-1">{user.name}</h1>
              <p className="text-dark/60">{user.email}</p>
              <div className="mt-3 inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-full">
                {user.role}
              </div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-6 sm:mt-0 flex items-center space-x-2 text-dark border-dark/20 hover:bg-dark hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        <div className="space-y-6">
          <section aria-labelledby="profile-orders-heading" className="border-b border-dark/10 pb-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="profile-orders-heading" className="font-serif text-2xl text-dark">My orders</h2>
                <p className="mt-1 text-sm text-dark/60">Your orders, bills, and delivery updates.</p>
              </div>
              <Link href="/orders" className="text-sm font-semibold text-accent hover:text-dark">View all orders</Link>
            </div>

            {ordersError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{ordersError}</p>}
            {isOrdersLoading ? (
              <p role="status" className="rounded-xl bg-primary/30 p-5 text-sm text-dark/60">Loading your orders…</p>
            ) : orders.length === 0 ? (
              <div className="rounded-xl border border-dark/5 bg-primary/30 p-5">
                <p className="text-sm text-dark/60">You have not placed any orders yet.</p>
                <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-accent hover:text-dark">Browse the shop</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-xl border border-dark/10 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-dark/50">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <h3 className="mt-1 font-semibold text-dark">{orderStatusLabels[order.status as keyof typeof orderStatusLabels] || order.status}</h3>
                        <p className="mt-1 text-sm text-dark/60">{formatOrderDate(order.createdAt)} · {order.orderItems.length} item(s)</p>
                      </div>
                      <p className="font-semibold text-dark">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 border-t border-dark/10 pt-4 text-sm">
                      <Link href={`/orders/${order.id}`} className="inline-flex items-center gap-2 font-semibold text-accent hover:text-dark">
                        <ShoppingBag className="h-4 w-4" /> View order
                      </Link>
                      <Link href={`/orders/${order.id}/invoice`} className="inline-flex items-center gap-2 font-semibold text-accent hover:text-dark">
                        <FileText className="h-4 w-4" /> View / download bill
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <h2 className="text-xl font-serif text-dark mb-4">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-primary/30 rounded-xl border border-dark/5">
              <p className="text-xs text-dark/50 uppercase tracking-wider mb-1">Full Name</p>
              <p className="font-medium text-dark">{user.name}</p>
            </div>
            <div className="p-5 bg-primary/30 rounded-xl border border-dark/5">
              <p className="text-xs text-dark/50 uppercase tracking-wider mb-1">Email</p>
              <p className="font-medium text-dark">{user.email}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
