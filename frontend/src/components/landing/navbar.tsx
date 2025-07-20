'use client';

<<<<<<< HEAD
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";
=======
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Warehouse } from 'lucide-react';
>>>>>>> 600a76657cc0fa7f6e8e82b45e477d00a169d147

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { darkMode, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Inventory', href: '/inventory' },
    { label: 'Suppliers', href: '/suppliers' },
    { label: 'Reports', href: '/reports' },
  ];

  return (
    <header className="bg-white dark:bg-black text-black dark:text-white sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
<<<<<<< HEAD
          <span className="inline-block w-7 h-7 bg-black dark:bg-white rounded-sm"></span>
          <span className="text-2xl font-extrabold tracking-tight text-black dark:text-white">
            InventoryMS
          </span>
=======
          {/* Black minimalist icon or placeholder */}
          <Warehouse className="h-7 w-7" />
          <span className="text-2xl font-extrabold tracking-tight text-black">InventoryMS</span>
>>>>>>> 600a76657cc0fa7f6e8e82b45e477d00a169d147
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-lg font-medium transition-colors px-1 ${
                pathname === item.href
<<<<<<< HEAD
                  ? "text-black dark:text-white underline underline-offset-4 font-semibold"
                  : "text-neutral-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
=======
                  ? 'text-black font-semibold underline underline-offset-4'
                  : 'text-neutral-700 hover:text-black'
>>>>>>> 600a76657cc0fa7f6e8e82b45e477d00a169d147
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side: Theme toggle + Login */}
        <div className="flex items-center gap-2">
          {/* 🌗 Dark Mode Toggle */}
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </Button>

          {/* ✅ Fixed Login Button (desktop) */}
          <Link href="/login">
            <Button className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 text-base font-semibold rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-none transition-colorsbg-black text-white border border-white dark:bg-white dark:text-black dark:border-white px-6 py-2 text-base font-semibold rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-none transition-colors">
              Login
            </Button>
          </Link>
        </div>

        {/* Hamburger (mobile toggle) */}
        <button
          className="md:hidden ml-2 text-black dark:text-white"
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
<<<<<<< HEAD
              d={
                open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16"
              }
=======
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16'}
>>>>>>> 600a76657cc0fa7f6e8e82b45e477d00a169d147
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>

<<<<<<< HEAD
      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-all duration-300 overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
=======
      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t border-neutral-200 transition-all duration-300 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}
>>>>>>> 600a76657cc0fa7f6e8e82b45e477d00a169d147
      >
        <div className="flex flex-col px-6 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`py-3 text-lg font-semibold transition-colors ${
<<<<<<< HEAD
                pathname === item.href
                  ? "text-black dark:text-white"
                  : "text-neutral-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
=======
                pathname === item.href ? 'text-black' : 'text-neutral-700 hover:text-black'
>>>>>>> 600a76657cc0fa7f6e8e82b45e477d00a169d147
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* 🌗 Toggle in Mobile Menu */}
          <Button
            variant="outline"
            className="w-full my-2"
            onClick={toggleTheme}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </Button>

          {/* ✅ Fixed Login Button (mobile) */}
          <Link href="/login" onClick={() => setOpen(false)} className="pt-2 pb-3">
            <Button className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 text-lg py-2 transition-colors">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
