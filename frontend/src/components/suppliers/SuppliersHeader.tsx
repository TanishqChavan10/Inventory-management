import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SuppliersHeaderProps {
  onAddSupplier?: () => void;
}

export function SuppliersHeader({ onAddSupplier }: SuppliersHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Supplier Directory
        </h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage all your suppliers</p>
      </div>
      {onAddSupplier && (
        <Button
          onClick={onAddSupplier}
          className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      )}
    </div>
  );
}
