'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportDropdown } from '@/components/ui/export-dropdown';
import { Calendar, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Import our report components
import { SalesAnalytics } from '@/components/reports/SalesAnalytics';
import { InventoryInsights } from '@/components/reports/InventoryInsights';
import { ReportsCharts } from '@/components/reports/ReportsCharts';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleExportReport = (reportType: string) => {
    toast.success(`Exporting ${reportType} report...`);
  };

  const handleScheduleReport = () => {
    toast.info('Report scheduling feature coming soon');
  };

  // Mock overview data for export
  const overviewData = [
    { Metric: 'Total Revenue', Value: '₹4,50,000', Period: 'Last 30 days' },
    { Metric: 'Total Transactions', Value: '1,284', Period: 'Last 30 days' },
    { Metric: 'Active Products', Value: '145', Period: 'Current' },
    { Metric: 'Low Stock Items', Value: '23', Period: 'Current' },
    { Metric: 'Average Order Value', Value: '₹351', Period: 'Last 30 days' },
    { Metric: 'Customer Growth', Value: '+12%', Period: 'Month over Month' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-32 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Business Intelligence Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive analytics and insights for data-driven decisions
            </p>
          </div>
          
        </div>

        {/* Report Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Business Overview
              </h2>
              <ExportDropdown
                data={overviewData}
                filename="business-overview"
                title="Business Overview Report"
                variant="outline"
              />
            </div>
            {/* Interactive Charts */}
            <ReportsCharts title="Business Analytics" defaultType="bar" showControls={true} />
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Analytics</h2>
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Insights</h2>
            <InventoryInsights alerts={[]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
