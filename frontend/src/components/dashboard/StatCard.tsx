import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatCard({
  label,
  value,
  Icon,
  onClick,
}: {
  label: string;
  value: string | number;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={`View details for ${label}`}
      className="text-left focus:outline-none"
      onClick={onClick}
    >
      <Card className="group border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-200 focus:ring-2 focus:ring-indigo-500">
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-300">
            {label}
          </CardTitle>
          <Icon className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight">{value}</div>
          <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            +3% vs last period
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
