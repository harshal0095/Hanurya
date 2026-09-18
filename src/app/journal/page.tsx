import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function JournalPage() {
  const articles = [
    {
      id: 1,
      title: "The Art of Layering Home Fragrances",
      excerpt: "Discover how to blend different scents throughout your home to create a cohesive and welcoming atmosphere.",
      category: "Guide",
      date: "September 12, 2026",
      image: "https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Behind the Scent: Amber & Sandalwood",
      excerpt: "An inside look at how we developed our best-selling signature fragrance.",
      category: "Behind the Scenes",
      date: "August 28, 2026",
      image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Candle Care 101: Maximizing Burn Time",
      excerpt: "Simple tips to ensure your candles burn evenly, safely, and last as long as possible.",
      category: "Education",
      date: "July 15, 2026",
      image: "https://images.unsplash.com/photo-1572252516491-0391696081da?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Transitioning Your Space for Autumn",
      excerpt: "How to use our seasonal scents to bring the coziness of fall indoors.",
      category: "Seasonal",
      date: "September 01, 2026",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "The Benefits of Aromatherapy",
      excerpt: "Why incorporating essential oil candles into your evening routine can improve your sleep.",
      category: "Wellness",
      date: "June 22, 2026",
      image: "https://images.unsplash.com/photo-1544321683-162788e0b6b2?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "A Guide to Natural Waxes",
      excerpt: "Understanding the difference between soy, coconut, beeswax, and paraffin.",
      category: "Education",
      date: "May 10, 2026",
      image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-primary min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4">Journal</h1>
          <p className="text-dark/70 max-w-2xl mx-auto">
            Thoughts on slow living, home design, and the craft of candle making.
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-20">
          <Link href="#" className="group flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
            <div className="w-full md:w-2/3 relative aspect-[16/9] md:aspect-[4/3] bg-cream overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop"
                alt="Featured article"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="w-full md:w-1/3">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Featured • Slow Living</p>
              <h2 className="text-3xl lg:text-4xl font-serif text-dark mb-6 group-hover:text-accent transition-colors">
                Creating Rituals in a Fast-Paced World
              </h2>
              <p className="text-dark/70 mb-8 leading-relaxed">
                Why carving out small moments of intentionality can transform your daily experience and bring peace to your home.
              </p>
              <span className="inline-block border-b border-dark text-sm font-bold uppercase tracking-widest pb-1 group-hover:text-accent group-hover:border-accent transition-colors">
                Read Article
              </span>
            </div>
          </Link>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 justify-center mb-16 border-y border-dark/10 py-6">
          {['All', 'Education', 'Wellness', 'Behind the Scenes', 'Guide', 'Seasonal'].map(cat => (
            <button key={cat} className="text-sm font-bold uppercase tracking-widest text-dark/50 hover:text-dark transition-colors">
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {articles.map(article => (
            <Link key={article.id} href="#" className="group">
              <div className="relative aspect-[4/3] bg-cream mb-6 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-dark/50 mb-3">
                <span>{article.category}</span>
                <span>{article.date}</span>
              </div>
              <h3 className="text-2xl font-serif text-dark mb-3 group-hover:text-accent transition-colors leading-tight">
                {article.title}
              </h3>
              <p className="text-dark/70 text-sm leading-relaxed mb-4">
                {article.excerpt}
              </p>
              <span className="text-sm font-bold uppercase tracking-widest text-accent">
                Read More →
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
