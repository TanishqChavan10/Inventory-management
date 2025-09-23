import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Truck, Calendar, DollarSign, Package, CreditCard } from 'lucide-react';
import Link from 'next/link';
import type { ShipmentDetailHeaderProps } from '@/types/suppliers';

export function ShipmentDetailHeader({ shipment, supplierName, supplierId }: ShipmentDetailHeaderProps) {
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/suppliers/${supplierId}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to {supplierName}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Shipment {shipment.shipment_id}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Reference: {shipment.ref_no}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${shipment.invoice_amt.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Invoice Amount</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Date Received</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {new Date(shipment.received_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Total Items</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {shipment.total_items} items
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Method</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {shipment.payment_mthd}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}