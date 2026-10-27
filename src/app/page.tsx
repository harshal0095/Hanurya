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
import { getStoreCollections } from '@/lib/storeCollections';
import { getStoreProducts } from '@/lib/storeProducts';

export default async function Home() {
  const [collections, products] = await Promise.all([
    getStoreCollections(),
    getStoreProducts(),
  ]);
  const defaultCollectionImages: Record<string, string> = {
    'signature-candles': '/h1-discover-2.png',
    aromatherapy: '/h1-discover-1.png',
    'seasonal-collection': '/h1-discover-3.png',
    'gift-sets': '/h1-discover-4.png',
  };
  const collectionsWithProductImages = collections.map((collection) => {
    const productImage = products.find(
      (product) => product.collection === collection.slug && product.images[0],
    )?.images[0];

    return {
      ...collection,
      image: productImage ?? defaultCollectionImages[collection.slug] ?? collection.image,
    };
  });

  return (
    <>
      <Hero />
      <MarqueeBanner />
      <DiscoverIntro />
      <FeaturedProducts products={products} />
      <Collections collections={collectionsWithProductImages} />
      <BestSellers products={products} />
      <BrandValues />
      <AboutCraft />
      <Instagram />
      <Newsletter />
    </>
  );
}
