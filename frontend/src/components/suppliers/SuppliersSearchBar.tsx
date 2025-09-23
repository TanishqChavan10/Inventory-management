import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { SuppliersSearchBarProps } from '@/types/suppliers';

export function SuppliersSearchBar({ searchQuery, onSearchChange }: SuppliersSearchBarProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search suppliers, emails, or products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white dark:bg-neutral-800"
        />
      </div>
    </div>
  );
}
