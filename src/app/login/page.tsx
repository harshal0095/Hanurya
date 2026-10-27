'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Dispatch custom event to update navbar/header
        window.dispatchEvent(new Event('auth-change'));
        // Redirect to profile
        router.push('/profile');
      }
    } catch (error: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      setErrorMsg(responseMessage || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <div className="relative min-h-[90vh] bg-primary flex items-center justify-center p-4 sm:p-8 overflow-hidden">

      {/* Subtle Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/5 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-dark/5 blur-[100px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[460px] bg-white/80 backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-2xl border border-white/50"
      >
        <motion.div
          className="text-center mb-10 flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >


          <motion.h1 variants={itemVariants} className="text-2xl font-serif tracking-tight text-dark mb-2">
            Welcome Back
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm text-dark/60">
            Please enter your details to sign in
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-5">
            {errorMsg && (
              <motion.div variants={itemVariants} className="p-3 rounded-lg bg-red-50 text-red-500 text-sm font-medium border border-red-100">
                {errorMsg}
              </motion.div>
            )}
            <motion.div variants={itemVariants} className="relative group">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary/30 border-dark/10 focus:bg-white transition-all pl-11"
              />
              <Mail className="absolute left-4 top-[38px] w-4 h-4 text-dark/40 group-focus-within:text-accent transition-colors" />
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-dark">
                  Password
                </label>
                <Link href="#" className="text-[13px] font-medium text-accent hover:text-dark transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-primary/30 border-dark/10 focus:bg-white transition-all pl-11"
              />
              <Lock className="absolute left-4 top-[38px] w-4 h-4 text-dark/40 group-focus-within:text-accent transition-colors" />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button type="submit" className="w-full h-12 text-[15px] rounded-xl group" isLoading={isLoading}>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center text-sm text-dark/60"
        >
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-dark hover:text-accent transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-accent hover:after:w-full after:transition-all after:duration-300">
            Create account
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
