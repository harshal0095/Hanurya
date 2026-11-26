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
  const posts = [
    {
      image: "https://res.cloudinary.com/dqabwcbus/image/upload/v1795692103/hanurya_instagram_posts/post_01_ff164f7736.png",
      alt: "Blue soy wax candle decorated with daisies",
      width: 768,
      height: 922,
      link: "https://www.instagram.com/p/Dds1qHkNT-2/?knvt=MWE0eDMyaXhidHJhOQ==",
    },
    {
      image: "https://res.cloudinary.com/dqabwcbus/image/upload/v1795692094/hanurya_instagram_posts/post_02_a4f69a77bf.png",
      alt: "Red flower-shaped handmade candles",
      width: 768,
      height: 1024,
      link: "https://www.instagram.com/p/Dds3DTJta24/?evlk=MWw2OWZvNTh3cmJ1",
    },
    {
      image: "https://res.cloudinary.com/dqabwcbus/image/upload/v1795692092/hanurya_instagram_posts/post_03_4375a5ffd3.png",
      alt: "Handmade white rose candle with a heart-shaped candle",
      width: 1024,
      height: 768,
      link: "https://www.instagram.com/p/DeN_G7IoEPa/?gwpx=MTF5bWRzd2dxNXB3aQ==",
    },
    {
      image: "https://res.cloudinary.com/dqabwcbus/image/upload/v1795692093/hanurya_instagram_posts/post_04_0ab165bf79.png",
      alt: "Handcrafted festive diya candle collection",
      width: 768,
      height: 1024,
      link: "https://www.instagram.com/p/DeTUOdQNnzm/?avpt=MWtuZWp4am12dHhpeg==",
    },
    {
      image: "https://res.cloudinary.com/dqabwcbus/image/upload/v1795692093/hanurya_instagram_posts/post_05_c70789a4b8.png",
      alt: "Colorful flower-shaped candles on a ceramic plate",
      width: 768,
      height: 1024,
      link: "https://www.instagram.com/p/DeYb5X_NKQT/?bqrl=aGJpY285emt1Mmw0",
    },
    {
      image: "https://res.cloudinary.com/dqabwcbus/image/upload/v1795692091/hanurya_instagram_posts/post_06_cb91714c33.png",
      alt: "Rose-shaped candle and handmade floral candles",
      width: 768,
      height: 768,
      link: "https://www.instagram.com/p/DeeqCGUjTJr/?avpt=MWYxMHUwY3Y1d2theQ==",
    },
  ];

  return (
    <section className="py-24 bg-primary">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-dark mb-4">Follow our ritual</h2>
        <a href="https://www.instagram.com/hanuryadecor/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-dark transition-colors tracking-widest text-sm font-medium">
          @hanuryadecor
        </a>
      </div>
      
      <div className="mx-auto max-w-6xl columns-2 gap-3 px-4 sm:gap-4 sm:px-6 md:columns-3">
        {posts.map((post) => (
          <a key={post.link} href={post.link} target="_blank" rel="noopener noreferrer" className="group relative mb-3 block break-inside-avoid overflow-hidden bg-cream sm:mb-4">
            <Image
              src={post.image}
              alt={post.alt}
              width={post.width}
              height={post.height}
              sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 384px"
              className="block h-auto w-full transition-transform duration-700 group-hover:scale-105"
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
