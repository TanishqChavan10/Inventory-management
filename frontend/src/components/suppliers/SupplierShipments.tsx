import { Button } from '@/components/ui/button';
import { Eye, Truck, DollarSign } from 'lucide-react';
import Link from 'next/link';
import type { SupplierShipmentsProps } from '@/types/suppliers';
import { formatDate, formatNumber } from '@/lib/utils';

export function SupplierShipments({ shipments, supplierId }: SupplierShipmentsProps) {
  const cellStyles = "py-3 px-4 text-gray-600 dark:text-gray-300";
  const headerStyles = "text-left py-3 px-4 font-medium text-gray-900 dark:text-white";
  
  const headers = ["Shipment ID", "Reference No", "Date Received", "Items", "Invoice Amount", "Payment Method", "Actions"];

  if (shipments.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipment History</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Truck className="w-4 h-4" />
            <span>0 shipments</span>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No shipments found for this supplier.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipment History</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Truck className="w-4 h-4" />
          <span>{shipments.length} shipments</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-neutral-700">
              {headers.map((header) => (
                <th key={header} className={headerStyles}>{header}</th>
              ))}
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
                <td className={cellStyles}>{shipment.ref_no}</td>
                <td className={cellStyles}>{formatDate(shipment.received_date)}</td>
                <td className={cellStyles}>{shipment.total_items} items</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatNumber(shipment.invoice_amt)}
                  </div>
                </td>
                <td className={cellStyles}>{shipment.payment_mthd}</td>
                <td className="py-3 px-4">
                  <Link href={`/suppliers/${supplierId}/shipments/${shipment.shipment_id}`}>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
