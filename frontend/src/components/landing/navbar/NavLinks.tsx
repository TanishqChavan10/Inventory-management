import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Suppliers', href: '/suppliers' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Reports', href: '/reports' },
];

export default function NavLinks({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div className={className}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={`text-lg font-medium transition-colors px-1 ${
            pathname === item.href
              ? 'text-black dark:text-white font-semibold underline underline-offset-4'
              : 'text-neutral-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
