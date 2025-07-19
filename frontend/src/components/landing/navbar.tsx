'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Warehouse } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Inventory', href: '/inventory' },
    { label: 'Suppliers', href: '/suppliers' },
    { label: 'Reports', href: '/reports' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-neutral-200">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Black minimalist icon or placeholder */}
          <Warehouse className="h-7 w-7" />
          <span className="text-2xl font-extrabold tracking-tight text-black">InventoryMS</span>
        </Link>

        {/* Navigation links (large, spaced) */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-lg font-medium transition-colors px-1 ${
                pathname === item.href
                  ? 'text-black font-semibold underline underline-offset-4'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Login Button */}
        <div>
          <Link href="/login">
            <Button className="bg-black text-white px-6 py-2 text-base font-semibold rounded hover:bg-neutral-800 shadow-none">
              Login
            </Button>
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden ml-2 text-black"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Mobile Menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t border-neutral-200 transition-all duration-300 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="flex flex-col px-6 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`py-3 text-lg font-semibold transition-colors ${
                pathname === item.href ? 'text-black' : 'text-neutral-700 hover:text-black'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="pt-2 pb-3">
            <Button className="w-full bg-black text-white hover:bg-neutral-800 text-lg py-2">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
