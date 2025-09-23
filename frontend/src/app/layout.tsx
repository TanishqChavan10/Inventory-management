// src/app/layout.tsx

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/landing/navbar/Navbar';
import Footer from '@/components/landing/footer';
import PageWrapper from '@/components/landing/PageWrapper';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/context/theme-context';

// --- NEW --- Import the Apollo Provider
import { ApolloAppProvider } from '@/components/ApolloAppProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'MyWebsite - Modern Inventory Management',
  description:
    'Our modern inventory platform helps you understand your audience and drive meaningful interactions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} bg-white text-gray-800 dark:bg-black dark:text-gray-100 transition-colors duration-300 min-h-screen flex flex-col`}
      >
        {/* --- WRAP EVERYTHING IN THE APOLLO PROVIDER --- */}
        <ApolloAppProvider>
          <ThemeProvider>
            <PageWrapper>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster richColors position="top-center" />
            </PageWrapper>
          </ThemeProvider>
        </ApolloAppProvider>
      </body>
    </html>
  );
}
