'use client';

import Navbar from '@/components/landing/navbar/Navbar';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login';
  const isLandingPage = pathname === '/';
  const isOnboardingPage = pathname.startsWith('/onboarding') || pathname.startsWith('/invite');
  const isCompanySwitcherPage = pathname.startsWith('/company-switcher');
  const showNavbar = !isAuthPage && !isLandingPage && !isOnboardingPage && !isCompanySwitcherPage;

  return (
    <>
      {showNavbar && <Navbar />}
      <AuthGuard>
        <main>{children}</main>
      </AuthGuard>
    </>
  );
}
