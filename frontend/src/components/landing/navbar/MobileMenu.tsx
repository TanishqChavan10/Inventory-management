import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { LogOut } from 'lucide-react';

export default function MobileMenu({ open, closeMenu }: { open: boolean; closeMenu: () => void }) {
  const { user, signOut, isAuthenticated } = useAuth();

  const handleLogout = () => {
    signOut();
    closeMenu();
  };

  return (
    <div
      className={`md:hidden bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-all duration-300 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}
    >
      <div className="flex flex-col px-6 py-3">
        <NavLinks onClick={closeMenu} isAuthenticated={isAuthenticated} />
        <ThemeToggle outline fullWidth />

        {/* Mobile Authentication Section */}
        {isAuthenticated ? (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="mb-3">
              <p className="text-sm font-medium">{user?.firstName || user?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <Button variant="outline" className="w-full mb-2" asChild onClick={closeMenu}>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 dark:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
