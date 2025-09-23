import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package } from 'lucide-react';
import Link from 'next/link';
import { LowStockItem } from '@/types/dashboard';

interface LowStockAlertProps {
  items: LowStockItem[];
}

export default function LowStockAlert({ items }: LowStockAlertProps) {
  const handleRestock = (itemName: string) => {
    // Handle restock logic here
    console.log(`Restocking ${itemName}`);
    // You can implement actual restock functionality here
  };
  return (
    <Card className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
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
      <CardContent className="space-y-4">
        <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
          {items.map((item, index) => {
            const stockPercentage = (item.stock / item.total) * 100;
            const urgency = stockPercentage < 30 ? 'high' : 'medium';

            return (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-800 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right space-y-1">
                    <Badge
                      variant={urgency === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {item.stock}/{item.total}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestock(item.name)}
                    className="flex items-center gap-1 text-xs px-2 py-1 h-7 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                  >
                    <Package className="w-3 h-3" />
                    Restock
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <Link href="/inventory">
          <Button className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 mt-4">
            View All Inventory
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
