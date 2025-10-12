import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Truck, IndianRupee } from 'lucide-react';
import type { SupplierShipmentsProps } from '@/types';

export function SupplierShipments({ shipments, onViewShipment }: SupplierShipmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipment History</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Truck className="w-4 h-4" />
          <span>{shipments.length} shipments</span>
        </div>
      </div>

      {shipments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No shipments found for this supplier.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Shipment ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Reference No
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Date Received
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Items
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Invoice Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Payment Method
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr
                  key={shipment.shipment_id}
                  className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {shipment.shipment_id}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{shipment.ref_no}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {new Date(shipment.received_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {shipment.total_items} items
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {(shipment.invoice_amt * 10).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {shipment.payment_mthd}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(shipment.payment_status)}>
                      {shipment.payment_status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewShipment?.(shipment)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
