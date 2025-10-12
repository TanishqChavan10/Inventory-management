'use client';

import { AppHeader } from '@/components/app-header';
import Navbar from '@/components/landing/navbar/Navbar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAppPage = !isLandingPage && !isAuthPage;

  return (
    <>
      {isLandingPage && <Navbar />}
      {isAppPage && <AppHeader />}
      <main className={cn((isLandingPage || isAppPage) && 'pt-16')}>{children}</main>
    </>
  );
}
