'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/lib/apiClient';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await apiClient.post('/auth/login', { email, password });

      if (response.data.token) {
        // Check if the user is actually an admin
        if (response.data.role !== 'ADMIN') {
          setErrorMsg('Access Denied. You do not have administrator privileges.');
          setIsLoading(false);
          return;
        }

        localStorage.setItem('token', response.data.token);
        window.dispatchEvent(new Event('auth-change'));

        // Redirect to admin dashboard
        router.push('/admin');
      }
    } catch (error: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      setErrorMsg(responseMessage || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] bg-white p-8 sm:p-12 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-serif text-dark mb-2">Admin Portal</h1>
          <p className="text-sm text-dark/60">Secure login for Hanurya administrators</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-6 rounded-lg bg-red-50 text-red-500 text-sm font-medium border border-red-100 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@hanurya.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary/30 border-dark/10 pl-11 focus:bg-white"
            />
            <Mail className="absolute left-4 top-[38px] w-4 h-4 text-dark/40 group-focus-within:text-accent" />
          </div>

          <div className="relative group">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-primary/30 border-dark/10 pl-11 focus:bg-white"
            />
            <Lock className="absolute left-4 top-[38px] w-4 h-4 text-dark/40 group-focus-within:text-accent" />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full h-12 rounded-xl mt-4 bg-dark text-white hover:bg-dark/90">
            Secure Login <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
