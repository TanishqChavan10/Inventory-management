import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { InventoryHeaderProps } from '@/types';

export function InventoryHeader({ onAddProduct }: InventoryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Product Inventory</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all products in your inventory
        </p>
      </div>
      <Button
        onClick={onAddProduct}
        className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
      >
        <PlusCircle className="w-4 h-4" />
        Add Product
      </Button>
    </div>
  );
}
