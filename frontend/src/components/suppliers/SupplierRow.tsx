import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SupplierRowProps } from '@/types';

export function SupplierRow({ supplier, onEdit, onDelete }: SupplierRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/suppliers/${supplier.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    onEdit(supplier);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    onDelete(supplier);
  };

  return (
    <tr
      className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
      onClick={handleRowClick}
    >
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
        <Badge
          variant={supplier.status === 'Active' ? 'default' : 'secondary'}
          className={
            supplier.status === 'Active'
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300'
          }
        >
          {supplier.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleEditClick} className="p-1 h-8 w-8">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
