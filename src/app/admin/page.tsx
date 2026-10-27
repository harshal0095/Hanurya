'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import { collections } from '@/data/collections';
import type { Collection } from '@/data/collections';
import { Users, Package, ShoppingCart, Plus, CheckCircle, Upload, LayoutDashboard, LogOut, Settings, Tag, Pencil, Trash2, X } from 'lucide-react';
import type { ApiProduct } from '@/lib/storeProducts';
import { motion, AnimatePresence } from 'framer-motion';
import OrdersPanel from '@/components/admin/OrdersPanel';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingPaymentReviews: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'products' | 'manageProducts' | 'categories' | 'users' | 'orders' | 'settings'>('dashboard');
  const [availableCollections, setAvailableCollections] = useState<Collection[]>(collections);
  const [editingCollectionSlug, setEditingCollectionSlug] = useState<string | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productManagementMessage, setProductManagementMessage] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [collectionSlug, setCollectionSlug] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [collectionMessage, setCollectionMessage] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchStats = async () => {
    if (!localStorage.getItem('token')) {
      router.replace('/admin-login');
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.get<DashboardStats>('/admin/stats');
      setStats(res.data);
      setDashboardError('');
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        router.replace('/admin-login');
        return;
      }
      setDashboardError('Could not load the admin dashboard. Please refresh and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (showLoading = true) => {
    if (showLoading) setIsLoadingProducts(true);
    try {
      const { data } = await apiClient.get<ApiProduct[]>('/products');
      setProducts(data);
      setProductManagementMessage('');
    } catch {
      if (showLoading) setProductManagementMessage('Could not load products. Please try again.');
    } finally {
      if (showLoading) setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    void fetchStats();
    const interval = window.setInterval(() => { void fetchStats(); }, 15000);
    return () => window.clearInterval(interval);
  }, [router]);

  useEffect(() => {
    let isActive = true;
    apiClient.get<Collection[]>('/collections')
      .then(({ data }) => {
        if (isActive) setAvailableCollections(data);
      })
      .catch(() => { });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    void fetchProducts();
    const interval = window.setInterval(() => { void fetchProducts(false); }, 15000);
    const refreshProducts = () => { void fetchProducts(false); };
    window.addEventListener('focus', refreshProducts);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshProducts);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/admin-login');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingCollection(true);
    setCollectionMessage('');

    try {
      const payload = {
        name: newCollectionName,
        description: newCollectionDescription,
      };
      const { data } = editingCollectionSlug
        ? await apiClient.put<Collection>(`/collections/${editingCollectionSlug}`, payload)
        : await apiClient.post<Collection>('/collections', payload);
      setAvailableCollections((current) => [
        ...current.filter((collection) => collection.slug !== data.slug),
        data,
      ]);
      setCollectionSlug(data.slug);
      setNewCollectionName('');
      setNewCollectionDescription('');
      setCollectionMessage(`"${data.name}" ${editingCollectionSlug ? 'updated' : 'added'}.`);
      setEditingCollectionSlug(null);
    } catch (error: unknown) {
      const responseMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      setCollectionMessage(responseMessage || 'Could not add the category. Please try again.');
    } finally {
      setIsCreatingCollection(false);
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollectionSlug(collection.slug);
    setNewCollectionName(collection.name);
    setNewCollectionDescription(collection.description);
    setCollectionMessage('');
  };

  const handleDeleteCollection = async (collection: Collection) => {
    if (!window.confirm(`Delete category "${collection.name}"?`)) return;
    setCollectionMessage('');
    try {
      await apiClient.delete(`/collections/${collection.slug}`);
      setAvailableCollections((current) => current.filter((item) => item.slug !== collection.slug));
      if (collectionSlug === collection.slug) setCollectionSlug('');
      setCollectionMessage(`"${collection.name}" deleted.`);
    } catch (error: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      setCollectionMessage(responseMessage || 'Could not delete category. Please try again.');
    }
  };

  const handleEditProduct = (product: ApiProduct) => {
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description);
    setCollectionSlug(product.collectionSlug || '');
    setPrice(String(product.price));
    setStock(String(product.stock));
    setImage(null);
    setImagePreview(product.imageUrl);
    setMessage('');
    setActiveMenu('products');
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setName('');
    setDescription('');
    setCollectionSlug('');
    setPrice('');
    setStock('');
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteProduct = async (product: ApiProduct) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    setProductManagementMessage('');
    try {
      await apiClient.delete(`/products/${product.id}`);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setProductManagementMessage(`"${product.name}" deleted.`);
    } catch (error: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      setProductManagementMessage(responseMessage || 'Could not delete product. Please try again.');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('collectionSlug', collectionSlug);
      formData.append('price', price);
      formData.append('stock', stock);
      if (image) {
        formData.append('image', image);
      }

      const productRequest = editingProductId
        ? apiClient.put(`/products/${editingProductId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        : apiClient.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      await productRequest;

      const wasEditing = Boolean(editingProductId);
      setMessage(`Product ${wasEditing ? 'updated' : 'added'} successfully!`);
      resetProductForm();
      void fetchProducts();
      if (wasEditing) {
        setProductManagementMessage('Product updated successfully.');
        setActiveMenu('manageProducts');
      }

      // Refresh stats
      fetchStats();

      // Switch back to dashboard after 2 seconds
      setTimeout(() => setActiveMenu('dashboard'), 2000);
    } catch (error: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      setMessage(responseMessage || 'Failed to add product. Please check your image size.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Add Product', icon: Plus },
    { id: 'manageProducts', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'users', label: 'Users List', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-dark/10 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-dark/10">
          <h1 className="text-2xl font-serif text-dark tracking-widest uppercase">Admin</h1>
          <p className="text-xs text-dark/50 mt-1">Hanurya Control Panel</p>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${activeMenu === item.id
                ? 'bg-accent text-white shadow-md shadow-accent/20'
                : 'text-dark/70 hover:bg-dark/5 hover:text-dark'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.id === 'orders' && Boolean(stats?.pendingPaymentReviews) && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {stats?.pendingPaymentReviews}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-dark/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-dark/10 p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-serif text-dark uppercase tracking-widest">Admin</h1>
          <div className="flex items-center gap-2">
            <select
              aria-label="Admin section"
              value={activeMenu}
              onChange={(event) => setActiveMenu(event.target.value as typeof activeMenu)}
              className="max-w-36 rounded-md border border-dark/15 bg-white px-2 py-2 text-xs"
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id === 'orders' && stats?.pendingPaymentReviews
                    ? `${item.label} (${stats.pendingPaymentReviews} pending)`
                    : item.label}
                </option>
              ))}
            </select>
            <button onClick={handleLogout} aria-label="Sign out" className="p-2 text-red-600 rounded-full hover:bg-red-50">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
          {/* Header Area */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-dark mb-2">
              {menuItems.find(m => m.id === activeMenu)?.label}
            </h2>
            <p className="text-dark/60">
              {activeMenu === 'dashboard' && 'Welcome back, manage your store from here.'}
              {activeMenu === 'products' && 'Add new inventory items to your catalog.'}
              {activeMenu === 'manageProducts' && 'Edit or remove products in your catalog.'}
              {activeMenu === 'categories' && 'Create categories for your store collections.'}
              {activeMenu === 'users' && 'View and manage registered customers.'}
              {activeMenu === 'orders' && 'Verify manual UPI payments and manage customer orders.'}
              {activeMenu === 'settings' && 'Configure store preferences.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {activeMenu === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <OrdersPanel />
              </motion.div>
            )}
            {activeMenu === 'dashboard' && stats && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark/5 flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark/50 uppercase tracking-widest mb-1">Total Users</p>
                      <h3 className="text-3xl font-serif text-dark">{stats.totalUsers}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark/5 flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark/50 uppercase tracking-widest mb-1">Total Products</p>
                      <h3 className="text-3xl font-serif text-dark">{stats.totalProducts}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-dark/5 flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark/50 uppercase tracking-widest mb-1">Total Orders</p>
                      <h3 className="text-3xl font-serif text-dark">{stats.totalOrders}</h3>
                    </div>
                  </div>
                </div>

                {/* Dashboard Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div
                    onClick={() => setActiveMenu('products')}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-dark/5 cursor-pointer hover:border-accent/50 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-serif text-xl text-dark mb-1">Add New Product</h4>
                        <p className="text-sm text-dark/60">Upload new candles to your store</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setActiveMenu('users')}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-dark/5 cursor-pointer hover:border-accent/50 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-serif text-xl text-dark mb-1">View All Users</h4>
                        <p className="text-sm text-dark/60">Manage your customer database</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMenu === 'dashboard' && dashboardError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {dashboardError}
              </p>
            )}

            {activeMenu === 'users' && stats && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="bg-white rounded-2xl shadow-sm border border-dark/5 overflow-hidden">
                  <div className="p-6 border-b border-dark/5 flex justify-between items-center">
                    <h3 className="text-lg font-serif text-dark">Registered Users</h3>
                    <span className="text-sm bg-primary px-3 py-1 rounded-full text-dark/60 font-medium">{stats.totalUsers} Total</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-primary/20 text-xs uppercase tracking-wider text-dark/50">
                          <th className="p-4 font-medium">Name</th>
                          <th className="p-4 font-medium">Email</th>
                          <th className="p-4 font-medium">Role</th>
                          <th className="p-4 font-medium">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentUsers.map((user) => (
                          <tr key={user.id} className="border-b border-dark/5 last:border-0 hover:bg-primary/10 transition-colors">
                            <td className="p-4 font-medium text-dark">{user.name}</td>
                            <td className="p-4 text-dark/70">{user.email}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${user.role === 'ADMIN' ? 'bg-accent/10 text-accent' : 'bg-dark/5 text-dark/60'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4 text-dark/60 text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {stats.recentUsers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-dark/50">No users found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMenu === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl"
              >
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-dark/5">
                  <h3 className="font-serif text-xl text-dark mb-1">{editingCollectionSlug ? 'Edit Category' : 'Add a Category'}</h3>
                  <p className="text-sm text-dark/60 mb-5">New categories appear under Collections and can be selected when adding products.</p>
                  {collectionMessage && (
                    <p className={`mb-4 text-sm ${collectionMessage.startsWith('Could not') || collectionMessage.includes('already exists') ? 'text-red-600' : 'text-green-700'}`}>
                      {collectionMessage}
                    </p>
                  )}
                  <form onSubmit={handleAddCollection} className="space-y-4">
                    <Input
                      label="Category Name"
                      placeholder="E.g., Relaxation"
                      required
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="bg-primary/30 border-dark/10"
                    />
                    <Input
                      label="Description"
                      placeholder="A short collection description"
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                      className="bg-primary/30 border-dark/10"
                    />
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" isLoading={isCreatingCollection} className="h-11">
                        {editingCollectionSlug ? 'Save Category' : <><Plus className="mr-2 h-4 w-4" /> Add Category</>}
                      </Button>
                      {editingCollectionSlug && (
                        <Button type="button" variant="outline" className="h-11" onClick={() => { setEditingCollectionSlug(null); setNewCollectionName(''); setNewCollectionDescription(''); }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>

                  <div className="mt-8 border-t border-dark/10 pt-5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-dark/50 mb-3">Available Categories</h4>
                    <ul className="divide-y divide-dark/5">
                      {availableCollections.map((collection) => (
                        <li key={collection.slug} className="py-3 flex items-center justify-between gap-4">
                          <span className="font-medium text-dark">{collection.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="hidden sm:inline text-xs text-dark/50">{collection.slug}</span>
                            <button type="button" title={`Edit ${collection.name}`} aria-label={`Edit ${collection.name}`} onClick={() => handleEditCollection(collection)} className="p-2 text-dark/60 hover:text-accent">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button type="button" title={`Delete ${collection.name}`} aria-label={`Delete ${collection.name}`} onClick={() => void handleDeleteCollection(collection)} className="p-2 text-dark/60 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMenu === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl"
              >
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-dark/5">
                  {message && (
                    <div className={`p-4 mb-6 rounded-xl border flex items-center space-x-3 ${message.includes('successfully') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      {message.includes('successfully') ? <CheckCircle className="w-5 h-5" /> : null}
                      <span className="font-medium text-sm">{message}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddProduct} className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-serif text-xl text-dark">{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
                      {editingProductId && (
                        <Button type="button" variant="outline" onClick={() => { resetProductForm(); setMessage(''); }}>
                          <X className="mr-2 h-4 w-4" /> Cancel Edit
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        label="Product Name"
                        placeholder="E.g., Rose Scented Candle"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-primary/30 border-dark/10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Description</label>
                      <textarea
                        placeholder="Describe the product..."
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-dark/10 bg-primary/30 px-4 py-3 text-sm text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="product-collection" className="block text-sm font-medium text-dark mb-1.5">Collection</label>
                      <select
                        id="product-collection"
                        value={collectionSlug}
                        onChange={(e) => setCollectionSlug(e.target.value)}
                        required
                        className="w-full rounded-xl border border-dark/10 bg-primary/30 px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      >
                        <option value="" disabled>Select a collection</option>
                        {availableCollections.map((collection) => (
                          <option key={collection.id} value={collection.slug}>{collection.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Price (₹)"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="29.99"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-primary/30 border-dark/10"
                      />
                      <Input
                        label="Stock Quantity"
                        type="number"
                        min="0"
                        placeholder="100"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="bg-primary/30 border-dark/10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Product Image (Required)</label>
                      <div
                        className={`relative w-full h-48 border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center transition-colors cursor-pointer ${imagePreview ? 'border-accent bg-accent/5' : 'border-dark/20 bg-primary/30 hover:bg-primary/50'}`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {imagePreview ? (
                          <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-dark/30 mb-2" />
                            <span className="text-sm text-dark/60 font-medium">Click to upload an image</span>
                            <span className="text-xs text-dark/40 mt-1">PNG, JPG up to 5MB</span>
                          </>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                          required={!imagePreview && !editingProductId}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" isLoading={isSubmitting} className="w-full h-12 rounded-xl">
                        {editingProductId ? 'Save Product' : 'Publish Product'}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeMenu === 'manageProducts' && (
              <motion.div key="manage-products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-dark/5 overflow-hidden">
                  <div className="p-6 border-b border-dark/5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-serif text-dark">Products</h3>
                      <p className="text-sm text-dark/50">{products.length} products</p>
                    </div>
                    <Button onClick={() => { resetProductForm(); setActiveMenu('products'); }} className="h-10">
                      <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                  </div>
                  {productManagementMessage && <p role="status" className="px-6 pt-4 text-sm text-dark/70">{productManagementMessage}</p>}
                  {isLoadingProducts ? (
                    <p className="p-8 text-center text-dark/50">Loading products...</p>
                  ) : products.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead><tr className="bg-primary/20 text-xs uppercase tracking-wider text-dark/50"><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4 text-right">Actions</th></tr></thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="border-t border-dark/5">
                              <td className="p-4 font-medium text-dark">{product.name}</td>
                              <td className="p-4 text-sm text-dark/60">{product.collection?.name || availableCollections.find((collection) => collection.slug === product.collectionSlug)?.name || 'Uncategorized'}</td>
                              <td className="p-4 text-sm">₹{product.price}</td>
                              <td className="p-4 text-sm">{product.stock}</td>
                              <td className="p-4">
                                <div className="flex justify-end gap-2">
                                  <button type="button" title={`Edit ${product.name}`} aria-label={`Edit ${product.name}`} onClick={() => handleEditProduct(product)} className="p-2 text-dark/60 hover:text-accent"><Pencil className="h-4 w-4" /></button>
                                  <button type="button" title={`Delete ${product.name}`} aria-label={`Delete ${product.name}`} onClick={() => void handleDeleteProduct(product)} className="p-2 text-dark/60 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="p-8 text-center text-dark/50">No products yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeMenu === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-dark/5 flex flex-col items-center justify-center min-h-[40vh] text-center">
                  <Settings className="w-16 h-16 text-dark/20 mb-4 animate-spin-slow" />
                  <h3 className="text-xl font-serif text-dark mb-2">Settings Coming Soon</h3>
                  <p className="text-dark/60 max-w-md">The store configuration and payment gateway settings will be available in the next update.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
