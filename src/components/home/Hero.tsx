"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen md:h-[85vh] md:min-h-[700px] flex flex-col md:flex-row md:items-center md:justify-center overflow-hidden bg-primary pt-0 md:pt-0">
      
      {/* Mobile Image (Left Arch) - Stacked on mobile, absolute on desktop */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative w-full h-[55vh] min-h-[400px] md:absolute md:left-0 md:bottom-0 md:w-[45%] md:h-[95%] z-0"
      >
        <Image
          src="/h1-slide-1.png"
          alt="Traditional Candle"
          fill
          priority
          className="object-cover object-bottom md:object-contain md:object-left"
        />
      </motion.div>
      
      {/* Center Text */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left px-6 py-12 md:py-0 w-full md:w-[450px] md:absolute md:left-[45%] lg:left-[48%]"
      >
        {/* Mobile Heading */}
        <h1 className="md:hidden text-[2.75rem] font-serif text-dark leading-[1.2] tracking-tight mb-6">
          Traditional <span className="italic text-dark/90">handmade</span><br/>
          candles
        </h1>
        {/* Desktop Heading */}
        <h1 className="hidden md:block text-6xl md:text-[5rem] lg:text-[5.5rem] font-serif text-dark leading-[1.05] tracking-tight mb-6">
          Traditional<br/>
          <span className="italic text-dark/90">handmade</span><br/>
          candles
        </h1>
        <p className="text-[15px] text-dark/80 mb-10 max-w-[320px] leading-relaxed font-medium">
          Candlea is accessibility ready multi-purpose website builder. Create beautiful websites for everyone.
        </p>
        <Link href="/shop" className="group flex items-center bg-dark text-white px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-dark/80 transition-colors">
          Shop Now <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>

      {/* Right Arch Image - Hidden on mobile, absolute on desktop */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="hidden md:block absolute right-[2%] bottom-[15%] w-[26%] h-[65%] z-0 pointer-events-none"
      >
        <Image
          src="/h1-slide-2.png"
          alt="Decorative Arch"
          fill
          priority
          className="object-contain object-top md:object-center"
        />
      </motion.div>
      
    </section>
  );
}
