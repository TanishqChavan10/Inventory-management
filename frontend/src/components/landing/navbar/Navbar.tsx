'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Warehouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-black text-black dark:text-white sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Warehouse className="h-7 w-7" />
          <span className="text-2xl font-extrabold tracking-tight">InventoryMS</span>
        </Link>
        <NavLinks className="hidden md:flex items-center gap-8 flex-1 justify-center" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button className="bg-black text-white border border-white dark:bg-white dark:text-black dark:border-white px-6 py-2 text-base font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-none transition-colors">
              Login
            </Button>
          </Link>
        </div>
        <button
          className="md:hidden ml-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Mobile Menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
      <MobileMenu open={open} closeMenu={() => setOpen(false)} />
    </header>
  );
}
