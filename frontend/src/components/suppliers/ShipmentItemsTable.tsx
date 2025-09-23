import { Package, Calendar, DollarSign, Hash } from 'lucide-react';
import type { ShipmentItemsTableProps } from '@/types/suppliers';

export function ShipmentItemsTable({ shipmentItems }: ShipmentItemsTableProps) {
  const calculateTotal = (quantity: number, unitPrice: number) => {
    return (quantity * unitPrice).toFixed(2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Shipment Items Details
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Package className="w-4 h-4" />
          <span>{shipmentItems.length} items</span>
        </div>
      </div>

      {/* Empty state */}
      {shipmentItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No items found for this shipment.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-700/50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Mfg Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {shipmentItems.map((item, index) => (
                  <tr
                    key={`${item.product_id}-${index}`}
                    className="border-t border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {/* Product */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.product_name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {item.product_id}
                        </span>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.quantity_received}
                        </span>
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {item.unit_price.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {calculateTotal(item.quantity_received, item.unit_price)}
                        </span>
                      </div>
                    </td>

                    {/* Manufacturing Date */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.mfg_date)}
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td className="py-4 px-4">
                      {item.expiry_date ? (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.expiry_date)}
                        </div>
                      ) : ('N/A')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Shipment Value */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">
                Total Shipment Value:
              </span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                $
                {shipmentItems
                  .reduce((total, item) => total + item.quantity_received * item.unit_price, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
