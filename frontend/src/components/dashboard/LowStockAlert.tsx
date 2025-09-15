import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { LowStockItem } from "@/data/dashboardData";

interface LowStockAlertProps {
  items: LowStockItem[];
}

export default function LowStockAlert({ items }: LowStockAlertProps) {
  return (
    <Card className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alert</CardTitle>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Items that need immediate attention</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const stockPercentage = (item.stock / item.total) * 100;
          const urgency = stockPercentage < 30 ? 'high' : 'medium';
          
          return (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-800 last:border-b-0">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
              </div>
              <div className="text-right space-y-1">
                <Badge variant={urgency === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                  {item.stock}/{item.total}
                </Badge>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.daysLeft} days left</p>
              </div>
            </div>
          );
        })}
        
        <Link href="/inventory">
          <Button className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 mt-4">
            View All Inventory
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}