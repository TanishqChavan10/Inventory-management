import { Package, TrendingUp, DollarSign, Calendar, ShoppingCart } from 'lucide-react';
import type { SupplierStatsProps } from '@/types';

export function SupplierStats({
  totalShipments,
  totalValue,
  totalProducts,
  avgOrderValue,
  lastOrderDate,
}: SupplierStatsProps) {
  const stats = [
    {
      label: 'Total Shipments',
      value: totalShipments.toString(),
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Products Supplied',
      value: totalProducts.toString(),
      icon: ShoppingCart,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Avg Order Value',
      value: `$${avgOrderValue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Last Order',
      value: new Date(lastOrderDate).toLocaleDateString(),
      icon: Calendar,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    },
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Supplier Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg"
            >
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
