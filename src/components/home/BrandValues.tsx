import React from 'react';
import { Sparkles, Leaf, Timer, Gift } from 'lucide-react';

export default function BrandValues() {
  const values = [
    {
      icon: <Sparkles className="w-8 h-8 stroke-1" />,
      title: 'Handcrafted',
      description: 'Every candle is carefully poured by hand.'
    },
    {
      icon: <Leaf className="w-8 h-8 stroke-1" />,
      title: 'Natural Ingredients',
      description: 'Thoughtfully selected waxes and fragrance oils.'
    },
    {
      icon: <Timer className="w-8 h-8 stroke-1" />,
      title: 'Long Lasting',
      description: 'Made to burn beautifully and evenly.'
    },
    {
      icon: <Gift className="w-8 h-8 stroke-1" />,
      title: 'Thoughtful Packaging',
      description: 'Beautifully packaged and ready to gift.'
    }
  ];

  return (
    <section className="bg-cream py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {values.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-dark/20 flex items-center justify-center text-accent mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-serif text-dark mb-3">{value.title}</h3>
              <p className="text-dark/70 text-sm max-w-[200px]">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
