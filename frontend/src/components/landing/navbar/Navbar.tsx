'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Warehouse, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/context/auth-context';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

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

          {/* User Authentication Section */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
        <button
          className="md:hidden ml-2"
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
      <MobileMenu open={open} closeMenu={() => setOpen(false)} />
    </header>
  );
}
