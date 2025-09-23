import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart } from 'lucide-react';
import type { TransactionItemsProps } from '@/types/transactions';

export function TransactionItems({ orderItems }: TransactionItemsProps) {
  if (orderItems.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No items found for this transaction.</p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Electronics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Clothing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      Food: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Books: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      Home: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      Sports: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return (
      colors[category as keyof typeof colors] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Order Items ({orderItems.length} items)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-neutral-700">
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Product
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Category
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                Quantity
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                Unit Price
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                Discount
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr
                key={`${item.transaction_id}-${item.product_id}-${index}`}
                className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-neutral-600 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ID: {item.product_id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {item.category_name && (
                    <Badge className={getCategoryColor(item.category_name)}>
                      {item.category_name}
                    </Badge>
                  )}
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                  {item.quantity}
                </td>
                <td className="py-4 px-4 text-right text-gray-900 dark:text-white">
                  ${item.unit_price.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right">
                  {item.discount_applied && item.discount_applied > 0 ? (
                    <span className="text-red-600 dark:text-red-400">
                      -${item.discount_applied.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                  ${item.total_price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Row */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {orderItems.length} item{orderItems.length !== 1 ? 's' : ''} •
            {orderItems.reduce((sum, item) => sum + item.quantity, 0)} total quantity
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Subtotal: ${orderItems.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
