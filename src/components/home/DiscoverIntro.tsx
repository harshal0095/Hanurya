"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function DiscoverIntro() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (windowSize.w === 0) return;
    // Map mouse position to range [-1, 1]
    const x = (e.clientX / windowSize.w - 0.5) * 2;
    const y = (e.clientY / windowSize.h - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Define different movement ranges for a layered parallax effect
  const img1X = useTransform(springX, [-1, 1], [-25, 25]);
  const img1Y = useTransform(springY, [-1, 1], [-25, 25]);

  const img2X = useTransform(springX, [-1, 1], [20, -20]);
  const img2Y = useTransform(springY, [-1, 1], [20, -20]);

  const img3X = useTransform(springX, [-1, 1], [-15, 15]);
  const img3Y = useTransform(springY, [-1, 1], [15, -15]);

  const img4X = useTransform(springX, [-1, 1], [30, -30]);
  const img4Y = useTransform(springY, [-1, 1], [-10, 10]);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[700px] lg:min-h-[750px] bg-white overflow-hidden py-16 flex items-center justify-center"
    >
      
      {/* Left Large U-Shape Image Container */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute left-0 md:left-[5%] lg:left-[5%] top-[5%] lg:top-[10%] w-[80%] md:w-[350px] lg:w-[400px] h-[480px] lg:h-[520px] rounded-b-[500px] z-0 group"
      >
        <motion.div style={{ x: img1X, y: img1Y }} className="w-full h-full relative rounded-b-[500px] overflow-hidden">
          <Image 
            src="/h1-discover-1.png" 
            alt="Discover our base notes"
            fill
            className="object-cover scale-110"
          />
        </motion.div>
      </motion.div>

      {/* Right Top Arch Image Container */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="hidden md:block absolute right-[5%] lg:right-[8%] top-[10%] w-[260px] h-[340px] z-0"
      >
        <motion.div style={{ x: img2X, y: img2Y }} className="w-full h-full relative rounded-t-[300px] overflow-hidden">
          <Image 
            src="/h1-discover-2.png" 
            alt="Base note candle"
            fill
            className="object-cover scale-110"
          />
        </motion.div>
        
        {/* Overlapping Flower (h1-discover-4) */}
        <motion.div 
          style={{ x: img4X, y: img4Y }} 
          className="absolute -right-16 -bottom-16 w-[180px] h-[180px] z-10 drop-shadow-xl"
        >
          <Image 
            src="/h1-discover-4.png" 
            alt="Flower decoration"
            fill
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Right Bottom Curved Image Container */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="hidden md:block absolute right-[10%] lg:right-[15%] bottom-[8%] w-[180px] h-[180px] rounded-br-[60px] z-0"
      >
        <motion.div style={{ x: img3X, y: img3Y }} className="w-full h-full relative rounded-br-[60px] overflow-hidden">
          <Image 
            src="/h1-discover-3.png" 
            alt="Lighting Candle"
            fill
            className="object-cover scale-110"
          />
        </motion.div>
      </motion.div>

      {/* Scroll to Top Button (Positioned at bottom right) */}
      <div className="hidden md:flex absolute right-6 bottom-6 w-12 h-12 bg-black rounded-full items-center justify-center cursor-pointer hover:bg-black/80 hover:-translate-y-2 transition-all duration-300 z-20">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </div>

      {/* Center Text Block */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center mt-20 md:mt-0 pointer-events-none"
      >
        <h2 className="text-3xl md:text-4xl lg:text-[3.5rem] font-serif font-normal text-[#222] leading-[1.15] tracking-tight mb-10">
          Discover the first scent in our base<br className="hidden md:block" />
          notes <span className="italic">collection simple</span>, grounding<br className="hidden md:block" />
          scents to calm candles
        </h2>
        
        <Link 
          href="/about" 
          className="pointer-events-auto inline-flex items-center justify-center border border-[#222] text-[#222] px-10 py-4 text-[11px] uppercase tracking-[0.25em] hover:bg-[#222] hover:text-white transition-colors bg-transparent"
        >
          About Us <span className="ml-2 font-normal text-lg leading-none">→</span>
        </Link>
      </motion.div>

    </section>
  );
}
