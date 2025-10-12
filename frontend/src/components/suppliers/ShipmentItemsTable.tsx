import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { useSupplierCalculations } from '@/hooks/useSupplierCalculations';
import type { ShipmentItemsTableProps } from '@/types';

export function ShipmentItemsTable({ shipment, items }: ShipmentItemsTableProps) {
  const { formatTotal, calculateItemSubtotal } = useSupplierCalculations();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Shipment Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Reference: {shipment.ref_no} • Received: {formatDate(shipment.received_date)}
            </p>
          </div>
        </div>

        {/* Shipment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Method</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{shipment.payment_mthd}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Total Items</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{shipment.total_items}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Received Date</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {formatDate(shipment.received_date)}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
            <Badge variant="secondary" className={getStatusColor(shipment.payment_status)}>
              {shipment.payment_status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Items in Shipment ({items.length})
        </h3>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No items found in this shipment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-700">
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
                    Subtotal
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Batch Info
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Dates
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.product_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {item.product_id}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {item.quantity_received}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {calculateItemSubtotal(1, item.unit_price)}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {calculateItemSubtotal(item.quantity_received, item.unit_price)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {item.batch_number && (
                          <Badge variant="outline" className="text-xs">
                            {item.batch_number}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        {item.mfg_date && (
                          <div>
                            <span className="font-medium">Mfg:</span> {formatDate(item.mfg_date)}
                          </div>
                        )}
                        {item.expiry_date && (
                          <div>
                            <span className="font-medium">Exp:</span> {formatDate(item.expiry_date)}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Row */}
        {items.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total: {items.length} items •{' '}
                {items.reduce((sum, item) => sum + item.quantity_received, 0)} units
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Grand Total</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatTotal(items)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
