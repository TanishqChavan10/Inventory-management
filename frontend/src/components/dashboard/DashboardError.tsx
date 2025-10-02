import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardErrorProps {
  error: string;
  onRetry: () => void;
}

export default function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to Load Dashboard Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-600 dark:text-red-300 mb-4">
          {error || 'An error occurred while fetching dashboard statistics.'}
        </p>
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
