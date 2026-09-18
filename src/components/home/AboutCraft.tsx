import React from 'react';
import Image from 'next/image';

export default function AboutCraft() {
  const icons = [
    {
      title: 'Refillable',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
      )
    },
    {
      title: 'Mouth blown glass',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
      )
    },
    {
      title: '100% Vegan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
      )
    }
  ];

  return (
    <section className="bg-[#FAF9F5] py-24">
      <div className="flex flex-col md:flex-row max-w-[1440px] mx-auto min-h-[500px]">
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-serif text-dark mb-4">
            The <span className="italic">candle story</span>
          </h2>
          <p className="text-dark/70 mb-16">
            We like to think of our wares as full sensory experiences!
          </p>
          
          <div className="flex gap-16 mb-16">
             <div>
                <h3 className="text-5xl font-serif text-accent mb-2">5M+</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-dark mb-4">Product sold last month</p>
                <p className="text-xs text-dark/60 leading-relaxed max-w-[200px]">Lorem ipsum dolor sit amet tincidunt ut eget in sit. Viverra maecenas iaculis.</p>
             </div>
             <div>
                <h3 className="text-5xl font-serif text-accent mb-2">90%</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-dark mb-4">Happy customer</p>
                <p className="text-xs text-dark/60 leading-relaxed max-w-[200px]">Lorem ipsum dolor sit amet tincidunt ut eget in sit. Viverra maecenas iaculis.</p>
             </div>
          </div>
          
          <a href="/shop" className="bg-dark text-white self-start px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-dark/80 transition-colors flex items-center">
             Shop Now <span className="ml-2">→</span>
          </a>
        </div>
        
        {/* Right Side */}
        <div className="w-full md:w-1/2 relative h-[400px] md:h-auto">
          <Image 
            src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop"
            alt="Candle making"
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      {/* Icons Section */}
      <div className="max-w-5xl mx-auto mt-24 px-4 flex flex-col md:flex-row justify-between items-center gap-12 text-center border-t border-dark/10 pt-24">
        {icons.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-accent text-accent flex items-center justify-center mb-6">
               {item.icon}
            </div>
            <h4 className="font-serif text-xl text-dark mb-2">{item.title}</h4>
            <p className="text-xs text-dark/50">Excepteur sint occaecat cupidatat non proident</p>
          </div>
        ))}
      </div>
    </section>
  );
}
