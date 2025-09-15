import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { SearchFilterBarProps } from '@/types';

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
}: SearchFilterBarProps) {
  return (
    <div className="flex gap-4 mb-6 justify-between">
      <div className="relative flex-1">
        <Search className="absolute flex left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white dark:bg-neutral-800"
        />
      </div>
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-64 bg-white dark:bg-neutral-800">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={String(cat)} value={String(cat)}>
              {String(cat)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}