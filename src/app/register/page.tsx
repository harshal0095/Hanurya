'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const response = await apiClient.post('/auth/register', { name: fullName, email, password });
      if (response.data.token) {
        // Redirect to login or auto-login and go to profile
        // Since user wants to redirect to login explicitly:
        router.push('/login');
      }
    } catch (error: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      setErrorMsg(responseMessage || 'Registration failed. Please try again.');
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
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-dark/5 blur-[100px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[500px] bg-white/80 backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-2xl border border-white/50 my-8"
      >
        <motion.div
          className="text-center mb-10 flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >


          <motion.h1 variants={itemVariants} className="text-2xl font-serif tracking-tight text-dark mb-2">
            Create an Account
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm text-dark/60">
            Join us for an exclusive shopping experience
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-2 gap-4">
            {errorMsg && (
              <motion.div variants={itemVariants} className="col-span-2 p-3 rounded-lg bg-red-50 text-red-500 text-sm font-medium border border-red-100">
                {errorMsg}
              </motion.div>
            )}
            <motion.div variants={itemVariants} className="relative group">
              <Input
                label="First Name"
                type="text"
                placeholder="John"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-primary/30 border-dark/10 focus:bg-white transition-all pl-10"
              />
              <User className="absolute left-3.5 top-[38px] w-4 h-4 text-dark/40 group-focus-within:text-accent transition-colors" />
            </motion.div>
            <motion.div variants={itemVariants} className="relative group">
              <Input
                label="Last Name"
                type="text"
                placeholder="Doe"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-primary/30 border-dark/10 focus:bg-white transition-all pl-10"
              />
              <User className="absolute left-3.5 top-[38px] w-4 h-4 text-dark/40 group-focus-within:text-accent transition-colors" />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative group">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary/30 border-dark/10 focus:bg-white transition-all pl-11"
            />
            <Mail className="absolute left-4 top-[38px] w-4 h-4 text-dark/40 group-focus-within:text-accent transition-colors" />
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <Input
              label="Password"
              type="password"
              placeholder="Create a secure password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-primary/30 border-dark/10 focus:bg-white transition-all pl-11"
            />
            <Lock className="absolute left-4 top-[38px] w-4 h-4 text-dark/40 group-focus-within:text-accent transition-colors" />
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-start pt-2">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 border border-dark/20 rounded bg-primary/50 focus:ring-2 focus:ring-accent accent-dark cursor-pointer transition-colors"
                required
              />
            </div>
            <label htmlFor="terms" className="ml-3 text-sm text-dark/70 leading-relaxed pt-0.5 cursor-pointer">
              I agree to the{' '}
              <Link href="#" className="font-medium text-dark hover:text-accent transition-colors underline decoration-dark/30 underline-offset-4">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="#" className="font-medium text-dark hover:text-accent transition-colors underline decoration-dark/30 underline-offset-4">
                Privacy Policy
              </Link>
            </label>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button type="submit" className="w-full h-12 text-[15px] rounded-xl group" isLoading={isLoading}>
              Create Account <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-8 text-center text-sm text-dark/60"
        >
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-dark hover:text-accent transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-accent hover:after:w-full after:transition-all after:duration-300">
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
