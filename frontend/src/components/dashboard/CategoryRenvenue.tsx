import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryRenvenue } from "@/data/dashboardData";

interface CategoryRenvenueProps {
  activities: CategoryRenvenue[];
}

export default function CategoryRevenue({ activities }: CategoryRenvenueProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-100 overflow-y-auto pr-2 space-y-4">
          {activities.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{category.category}</span>
                <span className="text-sm text-gray-500">{category.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gray-600 dark:bg-gray-400 h-2 rounded-full" 
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${category.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}