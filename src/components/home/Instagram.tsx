import React from 'react';
import Image from 'next/image';

const InstaIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Instagram() {
  const images = [

    "https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572252516491-0391696081da?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500&auto=format&fit=crop",
  ];

  return (
    <section className="py-24 bg-primary">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-dark mb-4">Follow our ritual</h2>
        <a href="#" className="text-accent hover:text-dark transition-colors tracking-widest text-sm font-medium uppercase">
          @hanurya
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
        {images.map((img, i) => (
          <a key={i} href="#" className="group relative aspect-square bg-cream block overflow-hidden">
            <Image
              src={img}
              alt={`Instagram post ${i+1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors duration-300 flex items-center justify-center">
              <InstaIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
