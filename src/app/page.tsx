import Image from 'next/image';
import Hero from '@/components/home/Hero';
import DiscoverIntro from '@/components/home/DiscoverIntro';
import Collections from '@/components/home/Collections';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BestSellers from '@/components/home/BestSellers';
import BrandValues from '@/components/home/BrandValues';
import AboutCraft from '@/components/home/AboutCraft';
import Instagram from '@/components/home/Instagram';
import Newsletter from '@/components/home/Newsletter';
import MarqueeBanner from '@/components/home/MarqueeBanner';

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeBanner />
      <DiscoverIntro />
      <FeaturedProducts />
      <Collections />
      <BestSellers />
      <BrandValues />
      <AboutCraft />
      <Instagram />
      <Newsletter />
    </>
  );
}
