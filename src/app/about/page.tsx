import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function About() {
  return (
    <div className="bg-primary min-h-screen pb-24">
      {/* Hero */}
      <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center mb-24">
        <Image
          src="https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=1600&auto=format&fit=crop"
          alt="About Hanurya"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-dark/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-serif">Made with Intention</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Section */}
        <section className="mb-32 text-center md:text-left flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-serif text-dark mb-6">The Beginning</h2>
            <p className="text-dark/70 leading-relaxed mb-4">
              Hanurya was born out of a desire to create something beautiful, simple, and honest. In a world full of noise and synthetic fragrances, we wanted to return to the basics: natural ingredients, thoughtful design, and the slow, deliberate craft of candle making.
            </p>
            <p className="text-dark/70 leading-relaxed">
              Every scent we create is designed to evoke a memory, change a mood, or simply bring a sense of calm to your daily routine. We believe that lighting a candle should be a ritual—a moment to pause, breathe, and center yourself.
            </p>
          </div>
          <div className="md:w-1/2 relative aspect-square bg-cream w-full">
            <Image
              src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=800&auto=format&fit=crop"
              alt="Candle pouring"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-32 flex flex-col md:flex-row-reverse gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-serif text-dark mb-6">Our Process</h2>
            <p className="text-dark/70 leading-relaxed mb-4">
              We hand-pour every single candle in our studio. There is no mass production, no assembly lines. Just a small team of artisans who are passionate about their craft.
            </p>
            <p className="text-dark/70 leading-relaxed">
              From the melting of the wax to the centering of the wick and the final polish of the glass, each step is done by hand. This ensures that every candle meets our exacting standards and carries the human touch that makes handmade goods so special.
            </p>
          </div>
          <div className="md:w-1/2 relative aspect-[4/5] bg-cream w-full">
            <Image
              src="https://images.unsplash.com/photo-1572252516491-0391696081da?q=80&w=800&auto=format&fit=crop"
              alt="Studio process"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Ingredients Section */}
        <section className="text-center mb-32">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">The Elements</p>
          <h2 className="text-4xl font-serif text-dark mb-12">Clean & Natural</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-8 border border-dark/10 bg-white">
              <h3 className="text-xl font-serif text-dark mb-4">The Wax</h3>
              <p className="text-dark/70 text-sm leading-relaxed">
                We use a custom blend of natural soy and coconut waxes. This provides a clean, slow burn without the soot and toxins associated with paraffin wax.
              </p>
            </div>
            <div className="p-8 border border-dark/10 bg-white">
              <h3 className="text-xl font-serif text-dark mb-4">The Scent</h3>
              <p className="text-dark/70 text-sm leading-relaxed">
                Our fragrances are complex and phthalate-free, blending premium essential oils and safe synthetic fragrance oils for a robust, beautiful scent throw.
              </p>
            </div>
            <div className="p-8 border border-dark/10 bg-white">
              <h3 className="text-xl font-serif text-dark mb-4">The Wick</h3>
              <p className="text-dark/70 text-sm leading-relaxed">
                We use 100% cotton wicks that are lead and zinc free, ensuring a consistent flame and preventing soot buildup on your vessels.
              </p>
            </div>
          </div>
        </section>

      </div>
      
      {/* CTA */}
      <section className="bg-dark text-white py-24 text-center px-4">
        <h2 className="text-4xl font-serif mb-6">Experience our craft</h2>
        <p className="text-white/70 mb-10 max-w-md mx-auto">Explore our collection of hand-poured candles and find your signature scent.</p>
        <Link href="/shop">
          <Button variant="secondary" size="lg" className="uppercase tracking-widest text-sm">Shop the Collection</Button>
        </Link>
      </section>
    </div>
  );
}
