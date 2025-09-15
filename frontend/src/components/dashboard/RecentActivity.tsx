import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "@/data/dashboardData";

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function NewRecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">Latest updates from your inventory system</p>
      </CardHeader>
      <CardContent className="max-h-80 overflow-y-auto space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-800 last:border-b-0">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                activity.type === 'sale' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                activity.type === 'alert' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {activity.badge}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}