'use client';

import Navbar from '@/components/landing/navbar/Navbar';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login';
  const showNavbar = !isAuthPage;

  return (
    <>
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
}
