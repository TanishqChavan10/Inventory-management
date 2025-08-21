import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, UserPlus, ActivitySquare } from "lucide-react";

function getActivityIcon(text: string) {
  if (text.toLowerCase().includes("purchase order"))
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (text.toLowerCase().includes("low stock") || text.toLowerCase().includes("alert"))
    return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  if (text.toLowerCase().includes("expired"))
    return <XCircle className="w-4 h-4 text-red-500" />;
  if (text.toLowerCase().includes("supplier"))
    return <UserPlus className="w-4 h-4 text-blue-500" />;
  return <ActivitySquare className="w-4 h-4 text-gray-400 dark:text-gray-300" />;
}

export default function RecentActivity({ activity }: { activity: { id: number; text: string; time: string }[] }) {
  return (
    <Card className="lg:col-span-2 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-auto divide-y flex-grow">
        {activity.map((event) => (
          <div key={event.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md">
            {getActivityIcon(event.text)}
            <div className="flex flex-col">
              <p className="text-sm">{event.text}</p>
              <span className="text-xs text-gray-400 italic">{event.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
