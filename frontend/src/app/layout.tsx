import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import PageWrapper from '@/components/landing/PageWrapper';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'MyWebsite - Modern Inventory Management',
  description: 'Our modern inventory platform helps you understand your audience and drive meaningful interactions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} text-gray-800`}>
        <PageWrapper>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </PageWrapper>
      </body>
    </html>
  );
}
