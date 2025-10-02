import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useLowStockData, LowStockItem } from '@/hooks/useLowStockData';

interface LowStockAlertProps {
  // No props needed - component will fetch its own data
}

export default function LowStockAlert({}: LowStockAlertProps) {
  const { lowStockItems, loading, error, refetch } = useLowStockData();

  if (loading) {
    return (
      <Card className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Low Stock Alert
            </CardTitle>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Items that need immediate attention
          </p>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <div className="space-y-4 flex-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-800 flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg font-semibold text-red-700 dark:text-red-400">
              Low Stock Alert - Error
            </CardTitle>
          </div>
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <div className="flex-1"></div>
          <div className="mt-6 pt-4">
            <Button
              onClick={refetch}
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Low Stock Alert
          </CardTitle>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {lowStockItems.length > 0
            ? 'Items that need immediate attention'
            : 'All items are well stocked!'}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="space-y-4 flex-1">
          {lowStockItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No low stock items found. Great job managing your inventory!
              </p>
            </div>
          ) : (
            lowStockItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-800 last:border-b-0"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge
                    variant={
                      item.urgency === 'high'
                        ? 'destructive'
                        : item.urgency === 'medium'
                          ? 'secondary'
                          : 'default'
                    }
                    className="text-xs"
                  >
                    {item.stock}/{item.minStock}
                  </Badge>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(item.stockPercentage)}% of min stock
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800">
          <Link href="/inventory">
            <Button className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              View All Inventory
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
