import { SupplierRow } from './SupplierRow';
import type { SuppliersTableProps } from '@/types/suppliers';

export function SuppliersTable({
  suppliers,
  onViewSupplier,
}: SuppliersTableProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-neutral-700">
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Supplier Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Contact
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Products
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Orders
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Total Value
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Last Order
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-8">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <SupplierRow
                  key={supplier.id}
                  supplier={supplier}
                  onView={onViewSupplier}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
