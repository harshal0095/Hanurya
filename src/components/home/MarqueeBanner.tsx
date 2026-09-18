"use client";

import React from 'react';
import Image from 'next/image';

export default function MarqueeBanner() {
  return (
    <div className="w-full bg-[#A77B46] text-white py-10 overflow-hidden whitespace-nowrap flex relative">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
      `}</style>
      
      {/* We need enough content to fill the screen twice to loop smoothly */}
      <div className="animate-marquee flex items-center font-serif text-[24px] tracking-wide shrink-0">
        {[...Array(10)].map((_, i) => (
          <span key={`first-${i}`} className="flex items-center">
            Ready to ignite a fresh experience?
            <div className="relative w-10 h-10 mx-16 shrink-0">
              <Image src="/candle icon.png" alt="Candle" fill className="object-contain" />
            </div>
          </span>
        ))}
        {[...Array(10)].map((_, i) => (
          <span key={`second-${i}`} className="flex items-center">
            Ready to ignite a fresh experience?
            <div className="relative w-10 h-10 mx-16 shrink-0">
              <Image src="/candle icon.png" alt="Candle" fill className="object-contain" />
            </div>
          </span>
        ))}
      </div>
    </div>
  );
}
