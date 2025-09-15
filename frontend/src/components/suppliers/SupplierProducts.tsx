import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle } from 'lucide-react';
import type { SupplierProductsProps, ShipmentItem } from '@/types';

interface GroupedProduct {
  product_id: string;
  product_name: string;
  total_quantity: number;
  avg_price: number;
  shipments: string[];
  latest_shipment: string;
  prices: number[];
}

export function SupplierProducts({ shipmentItems }: SupplierProductsProps) {
  // Group products by product_id to show aggregated data
  const groupedProducts = shipmentItems.reduce((acc, item) => {
    if (!acc[item.product_id]) {
      acc[item.product_id] = {
        product_id: item.product_id,
        product_name: item.product_name,
        total_quantity: 0,
        avg_price: 0,
        shipments: [],
        latest_shipment: '',
        prices: [],
      };
    }
    
    acc[item.product_id].total_quantity += item.quantity_received;
    acc[item.product_id].prices.push(item.unit_price);
    acc[item.product_id].shipments.push(item.shipment_id);
    
    // Update latest shipment date
    if (!acc[item.product_id].latest_shipment || item.shipment_id > acc[item.product_id].latest_shipment) {
      acc[item.product_id].latest_shipment = item.shipment_id;
    }
    
    return acc;
  }, {} as Record<string, GroupedProduct>);

  // Calculate average prices
  Object.values(groupedProducts).forEach((product: GroupedProduct) => {
    product.avg_price = product.prices.reduce((sum: number, price: number) => sum + price, 0) / product.prices.length;
  });

  const getExpiryStatus = (item: ShipmentItem) => {
    if (!item.expiry_date) return null;
    
    const expiryDate = new Date(item.expiry_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    }
    return { status: 'fresh', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
  };

  return (
    <div className="space-y-6">
      {/* Detailed Shipment Items */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Shipment Items Details
        </h2>

        {shipmentItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No shipment items found.</p>
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
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Batch
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
                {shipmentItems.map((item, index) => {
                  const expiryStatus = getExpiryStatus(item);
                  return (
                    <tr
                      key={`${item.shipment_id}-${item.product_id}-${index}`}
                      className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {item.shipment_id}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.product_id}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {item.quantity_received}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        ${item.unit_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {item.batch_number || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {item.mfg_date ? new Date(item.mfg_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        {item.expiry_date ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-300">
                              {new Date(item.expiry_date).toLocaleDateString()}
                            </span>
                            {expiryStatus && expiryStatus.status !== 'fresh' && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <Badge className={expiryStatus.color}>
                                  {expiryStatus.status}
                                </Badge>
                              </div>
                            )}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}