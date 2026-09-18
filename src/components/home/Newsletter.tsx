"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1000);
  };

  return (
    <section className="bg-dark text-cream py-32 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Bring warmth home.</h2>
        <p className="text-cream/70 mb-10 text-lg">
          Join our mailing list for new collections, seasonal scents and exclusive offers.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className={`w-full bg-transparent border-b ${status === 'error' ? 'border-red-500' : 'border-cream/30 focus:border-white'} px-2 py-3 text-white outline-none transition-colors placeholder:text-cream/30`}
            />
            {status === 'error' && (
              <span className="absolute left-0 -bottom-6 text-xs text-red-500">Please enter a valid email.</span>
            )}
            {status === 'success' && (
              <span className="absolute left-0 -bottom-6 text-xs text-accent">Thank you for subscribing!</span>
            )}
          </div>
          <Button 
            type="submit" 
            variant="secondary" 
            isLoading={status === 'loading'}
            className="uppercase tracking-widest text-xs px-8"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
