import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-cream pt-16 pb-8 border-t border-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-serif tracking-widest text-white inline-block">
              HANURYA
            </Link>
            <p className="text-cream/70 text-sm max-w-xs leading-relaxed">
              Crafted slowly. Made beautifully. Discover our collection of handmade natural candles designed to bring warmth and character to your everyday spaces.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-cream/70">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Candles</Link></li>
              <li><Link href="/collections/signature-candles" className="hover:text-white transition-colors">Signature Collection</Link></li>
              <li><Link href="/shop?filter=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/gift-sets" className="hover:text-white transition-colors">Gift Sets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Information</h4>
            <ul className="space-y-4 text-sm text-cream/70">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/journal" className="hover:text-white transition-colors">Journal</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-cream/70">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Hanurya. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
