import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MobileMenu({ open, closeMenu }: { open: boolean; closeMenu: () => void }) {
  return (
    <div
      className={`md:hidden bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-all duration-300 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}
    >
      <div className="flex flex-col px-6 py-3">
        <NavLinks onClick={closeMenu} />
        <ThemeToggle outline fullWidth />
        <Link href="/login" onClick={closeMenu} className="pt-2 pb-3">
          <Button className="w-full bg-black text-white border border-white dark:bg-white dark:text-black dark:border-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-lg py-2 transition-colors">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}