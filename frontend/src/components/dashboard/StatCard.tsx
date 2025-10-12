import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatData } from '@/data/dashboardData';
import { memo, useMemo } from 'react';
import { Box, AlertTriangle, Users, Activity, Clock, IndianRupee } from 'lucide-react';

interface StatCardProps {
  stat: StatData;
  onClick?: () => void;
}

// Icon mapping with colors - updated for better dark mode contrast
const iconMap = {
  box: { component: Box, color: 'text-blue-500 dark:text-blue-400' },
  'alert-triangle': { component: AlertTriangle, color: 'text-yellow-500 dark:text-yellow-400' },
  'rupee-indian': { component: IndianRupee, color: 'text-green-500 dark:text-green-400' },
  users: { component: Users, color: 'text-purple-500 dark:text-purple-400' },
  activity: { component: Activity, color: 'text-indigo-500 dark:text-indigo-400' },
  clock: { component: Clock, color: 'text-red-500 dark:text-red-400' },
} as const;

function StatCard({ stat, onClick }: StatCardProps) {
  const Component = onClick ? 'button' : 'div';

  const { IconComponent, iconColor, cardClassName } = useMemo(() => {
    const IconComponent = iconMap[stat.icon as keyof typeof iconMap]?.component || Box;
    const iconColor =
      iconMap[stat.icon as keyof typeof iconMap]?.color || 'text-gray-500 dark:text-gray-400';
    const cardClassName = `bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 ${
      onClick
        ? 'hover:shadow-lg hover:scale-[1.01] transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer'
        : ''
    }`;
    return { IconComponent, iconColor, cardClassName };
  }, [stat.icon, onClick]);

  return (
    <Component
      {...(onClick && {
        'aria-label': `View details for ${stat.title}`,
        className: 'text-left focus:outline-none w-full',
        onClick,
      })}
    >
      <Card className={cardClassName}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {stat.title}
          </CardTitle>
          <IconComponent className={`h-5 w-5 ${iconColor}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
        </CardContent>
      </Card>
    </Component>
  );
}

export default memo(StatCard);
