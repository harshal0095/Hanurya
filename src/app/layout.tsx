import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { QuickViewProvider } from "@/context/QuickViewContext";
import QuickViewModal from "@/components/shop/QuickViewModal";

const cormorant = Cormorant_Garamond({
  variable: "--font-playfair", // keep the same CSS variable name for simplicity
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hanurya | Traditional Handmade Candles",
  description: "Discover beautifully crafted candles made to bring warmth, calm and character into your everyday spaces.",
};

export const dynamic = "force-dynamic";

import ConditionalLayout from "@/components/layout/ConditionalLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-primary text-text-main font-sans" suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <QuickViewProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
              <QuickViewModal />
            </QuickViewProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
