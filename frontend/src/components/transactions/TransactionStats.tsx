import { TrendingUp, Package, ShoppingCart, Receipt, DollarSign, Percent } from 'lucide-react';
import type { TransactionStatsProps } from '@/types';

export function TransactionStats({
  transaction,
  totalItems,
  uniqueProducts,
}: TransactionStatsProps) {
  const totalSavings = transaction.discount_amount || 0;
  const savingsPercentage =
    transaction.total_amt > 0 ? (totalSavings / (transaction.total_amt + totalSavings)) * 100 : 0;
  const averageItemPrice = totalItems > 0 ? transaction.subtotal / totalItems : 0;

  const stats = [
    {
      label: 'Total Items',
      value: totalItems.toString(),
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Unique Products',
      value: uniqueProducts.toString(),
      icon: ShoppingCart,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      label: 'Subtotal',
      value: `$${transaction.subtotal.toFixed(2)}`,
      icon: Receipt,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      label: 'Tax Amount',
      value: `$${(transaction.tax_amount || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      label: 'Discount',
      value: `$${totalSavings.toFixed(2)}`,
      icon: Percent,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      label: 'Avg Item Price',
      value: `$${averageItemPrice.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900',
    },
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Transaction Analytics
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-3`}
              >
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Financial Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Financial Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${transaction.subtotal.toFixed(2)}
            </span>
          </div>

          {transaction.discount_amount && transaction.discount_amount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Discount ({savingsPercentage.toFixed(1)}%):
              </span>
              <span className="font-medium text-red-600 dark:text-red-400">
                -${transaction.discount_amount.toFixed(2)}
              </span>
            </div>
          )}

          {transaction.tax_amount && transaction.tax_amount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tax:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${transaction.tax_amount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-neutral-700">
            <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              ${transaction.total_amt.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
