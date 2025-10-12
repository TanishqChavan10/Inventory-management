'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/landing/navbar/ThemeToggle';

const navigationLinks = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Inventory', href: '/inventory' },
  { title: 'Transactions', href: '/transactions' },
  { title: 'Suppliers', href: '/suppliers' },
  { title: 'Reports', href: '/reports' },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!user) return null; // Don't show header if not logged in

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-md py-2'
          : 'bg-white dark:bg-gray-900 py-4',
      )}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <span className="font-bold text-lg md:text-xl">Inventory MS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href || pathname?.startsWith(`${link.href}/`)
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-300',
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* User menu and theme toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

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
                    <p className="text-sm font-medium">{user.fullName || user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
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

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  pathname === link.href || pathname?.startsWith(`${link.href}/`)
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary'
                    : 'text-gray-600 dark:text-gray-300',
                )}
              >
                {link.title}
              </Link>
            ))}
            <div
              className="block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 cursor-pointer"
              onClick={logout}
            >
              Log out
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
