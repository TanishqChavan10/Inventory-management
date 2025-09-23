import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatData } from '@/types/dashboard';
import { memo, useMemo } from 'react';
import { Box, AlertTriangle, DollarSign, Users, Activity, XCircle, Clock } from 'lucide-react';

interface StatCardProps {
  stat: StatData;
  onClick?: () => void;
}

// Icon mapping with colors
const iconMap = {
  box: { component: Box, color: 'text-blue-500' },
  'alert-triangle': { component: AlertTriangle, color: 'text-yellow-500' },
  'dollar-sign': { component: DollarSign, color: 'text-green-500' },
  users: { component: Users, color: 'text-purple-500' },
  activity: { component: Activity, color: 'text-indigo-500' },
  'x-circle': { component: XCircle, color: 'text-red-500' },
  clock: { component: Clock, color: 'text-orange-500' },
} as const;

function StatCard({ stat, onClick }: StatCardProps) {
  const Component = onClick ? 'button' : 'div';

  const { IconComponent, iconColor, cardClassName } = useMemo(() => {
    const IconComponent = iconMap[stat.icon as keyof typeof iconMap]?.component || Box;
    const iconColor = iconMap[stat.icon as keyof typeof iconMap]?.color || 'text-gray-500';
    const cardClassName = `bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 ${
      onClick
        ? 'hover:shadow-lg hover:scale-[1.01] transition-all duration-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer'
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
        </CardContent>
      </Card>
    </Component>
  );
}

export default memo(StatCard);
