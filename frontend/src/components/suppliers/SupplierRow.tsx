import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import type { SupplierRowProps } from '@/types/suppliers';

export function SupplierRow({ supplier, onView }: SupplierRowProps) {
  return (
    <tr className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{supplier.name}</td>
      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
        <div className="space-y-1">
          <div>{supplier.email}</div>
          <div>{supplier.phone}</div>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
        <div className="flex flex-wrap gap-1">
          {supplier.products.slice(0, 2).map((product, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300"
            >
              {product}
            </Badge>
          ))}
          {supplier.products.length > 2 && (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300"
            >
              +{supplier.products.length - 2}
            </Badge>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-gray-900 dark:text-white">{supplier.orders}</td>
      <td className="py-3 px-4 text-gray-900 dark:text-white">{supplier.totalValue}</td>
      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{supplier.lastOrder}</td>
      <td className="py-3 px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onView(supplier);
          }}
          className="flex items-center gap-2 h-8 px-3"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      </td>
    </tr>
  );
}
