"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchOverlay from '@/components/shop/SearchOverlay';
import CartDrawer from '@/components/shop/CartDrawer';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();
  const { getCartCount, isCartOpen, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    checkAuth();

    window.addEventListener('auth-change', checkAuth);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Blog', href: '/journal' },
    { name: 'Pages', href: '/about' },
    { name: 'Contacts', href: '/contact' },
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? 'bg-primary/95 backdrop-blur-sm shadow-sm py-2' : 'bg-primary py-3'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex justify-between lg:grid lg:grid-cols-3 items-center h-16 relative">
          
          {/* Navigation - Desktop (Left) */}
          <nav className="hidden lg:flex items-center space-x-10 h-full lg:col-start-1 lg:row-start-1">
            {navLinks.map((link) => (
              <div key={link.name} className={`h-full flex items-center group ${link.name !== 'Shop' ? 'relative' : ''}`}>
                <Link 
                  href={link.href}
                  className="text-xs font-semibold tracking-widest hover:text-accent transition-colors uppercase text-dark/90 flex items-center h-full"
                >
                  {link.name}
                  {['Shop', 'Blog', 'Pages'].includes(link.name) && (
                    <svg className="w-3 h-3 ml-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  )}
                </Link>

                {/* Dropdown for Blog */}
                {link.name === 'Blog' && (
                  <div className="absolute top-full left-0 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[220px] py-6 border-t border-dark/5">
                    <ul className="space-y-4 text-[13px] text-dark/80 font-medium px-8">
                      <li><Link href="/journal" className="hover:text-accent transition-colors block">Blog – Grid Style</Link></li>
                      <li><Link href="/journal" className="hover:text-accent transition-colors block">Blog – Grid Small Style</Link></li>
                      <li><Link href="/journal" className="hover:text-accent transition-colors block">Blog – Standard</Link></li>
                      <li><Link href="/journal" className="hover:text-accent transition-colors block">Blog – Modern</Link></li>
                      <li><Link href="/journal" className="hover:text-accent transition-colors block">Single Post</Link></li>
                    </ul>
                  </div>
                )}

                {/* Mega Menu for Shop */}
                {link.name === 'Shop' && (
                  <div className="absolute top-full left-4 sm:left-6 lg:left-12 right-4 sm:right-6 lg:right-12 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t border-dark/5">
                    <div className="w-full p-12 flex justify-between">
                      
                      <div className="flex gap-16 w-3/4 pr-12">
                        {/* Column 1 */}
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-dark mb-6">Shop Layouts</h4>
                          <ul className="space-y-4 text-[13px] text-dark/70 font-normal">
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Default</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Grid Small</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Grid Medium</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Grid Large</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Shop List</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Categories</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Three Columns</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Four Columns</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Five Columns Wide</Link></li>
                          </ul>
                        </div>
                        
                        {/* Column 2 */}
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-dark mb-6">Filter Style</h4>
                          <ul className="space-y-4 text-[13px] text-dark/70 font-normal mb-10">
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Sidebar Filter</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Offcanvas</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Dropdown</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Drawing Filter</Link></li>
                          </ul>
                          
                          <h4 className="text-sm font-bold uppercase tracking-widest text-dark mb-6">Page Loading</h4>
                          <ul className="space-y-4 text-[13px] text-dark/70 font-normal">
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Pagination</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Infinity Scroll</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Load More</Link></li>
                          </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-dark mb-6">Product Layouts</h4>
                          <ul className="space-y-4 text-[13px] text-dark/70 font-normal">
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Simple Product</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Simple Slider</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Grouped Product</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Variable Product</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Count Down Timer</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Variable Image Product</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">External & Affiliate</Link></li>
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Out of stock</Link></li>
                          </ul>
                        </div>

                        {/* Column 4 */}
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-dark mb-6">Shop Pages</h4>
                          <ul className="space-y-4 text-[13px] text-dark/70 font-normal">
                            <li><Link href="/account" className="hover:text-accent transition-colors">My account</Link></li>
                            <li><button onClick={() => setIsCartOpen(true)} className="hover:text-accent transition-colors">Cart</button></li>
                            <li><Link href="/checkout" className="hover:text-accent transition-colors">Checkout</Link></li>
                            <li><Link href="/wishlist" className="hover:text-accent transition-colors">Wishlist</Link></li>
                            <li><Link href="/order-tracking" className="hover:text-accent transition-colors">Order Tracking</Link></li>
                            <li><Link href={isLoggedIn ? "/profile" : "/login"} className="hover:text-accent transition-colors">{isLoggedIn ? "My Profile" : "Login & register"}</Link></li>
                          </ul>
                        </div>
                      </div>

                      {/* Right Banner Image */}
                      <div className="w-1/4 relative overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=400&auto=format&fit=crop" 
                          alt="Sale" 
                          className="w-full h-full object-cover rounded-sm absolute inset-0 brightness-75"
                        />
                        <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                           <h3 className="text-[2.75rem] font-serif italic leading-tight mb-2">Sale 40%<br/>off</h3>
                           <p className="text-sm font-semibold mb-6">Home decor accessories</p>
                           <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest flex items-center hover:bg-white hover:text-dark transition-colors border border-white px-5 py-2.5 self-start">
                             See All →
                           </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Logo (Left on mobile, Center on desktop) */}
          <div className="flex justify-start lg:justify-center h-full items-center lg:col-start-2 lg:row-start-1">
            <Link href="/" className="flex-shrink-0 relative w-[220px] h-[60px]">
              <Image 
                src="/logo.png" 
                alt="Hanurya Candle" 
                fill 
                className="object-contain object-left lg:object-center" 
                priority
              />
            </Link>
          </div>

          {/* Icons & Menu Toggle (Right) */}
          <div className="flex items-center justify-end space-x-5 lg:col-start-3 lg:row-start-1">
            
            {/* Desktop Icons - Hidden on mobile */}
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-dark hover:text-accent transition-colors hidden lg:block">
              <Search className="w-5 h-5" />
            </button>
            <Link href={isLoggedIn ? "/profile" : "/login"} className="p-2 text-dark hover:text-accent transition-colors hidden lg:block">
              <User className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="p-2 text-dark hover:text-accent transition-colors relative hidden lg:block"
            >
              <ShoppingBag className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute bottom-1 -right-1 w-[18px] h-[18px] bg-dark text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="p-2 -mr-2 text-dark lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

          </div>
        </div>
      </header>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-dark/5 z-40 grid grid-cols-4">
        {/* Search */}
        <button 
          onClick={() => setIsSearchOpen(true)} 
          className="flex flex-col items-center justify-center border-r border-dark/5 hover:bg-primary/30 transition-colors"
        >
          <Search className="w-[22px] h-[22px] text-dark mb-1" strokeWidth={1.5} />
        </button>
        
        {/* Account */}
        <Link
          href={isLoggedIn ? "/profile" : "/login"}
          className="flex flex-col items-center justify-center border-r border-dark/5 hover:bg-primary/30 transition-colors"
        >
          <User className="w-[22px] h-[22px] text-dark mb-1" strokeWidth={1.5} />
        </Link>
        
        {/* Wishlist */}
        <Link 
          href="/wishlist" 
          className="flex flex-col items-center justify-center border-r border-dark/5 hover:bg-primary/30 transition-colors relative"
        >
          <div className="relative">
            <Heart className="w-[22px] h-[22px] text-dark mb-1" strokeWidth={1.5} />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 w-4 h-4 bg-dark text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </div>
        </Link>
        
        {/* Cart */}
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="flex flex-col items-center justify-center hover:bg-primary/30 transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-[22px] h-[22px] text-dark mb-1" strokeWidth={1.5} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-3 w-4 h-4 bg-dark text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-dark/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary h-full shadow-xl animate-in slide-in-from-left">
            <div className="px-4 pt-5 pb-4 flex items-center justify-between">
              <span className="text-2xl font-serif tracking-widest">HANURYA</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-dark"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="mt-8 px-4 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-lg font-medium tracking-wide hover:text-accent uppercase"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
