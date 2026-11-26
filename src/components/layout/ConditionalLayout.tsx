'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import FirstEntryLoader from './FirstEntryLoader';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/admin-login');

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <FirstEntryLoader />
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
