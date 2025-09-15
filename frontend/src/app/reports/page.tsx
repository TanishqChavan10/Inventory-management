'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Download, 
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

// Import our report components
import { SalesAnalytics } from '@/components/reports/SalesAnalytics';
import { InventoryInsights } from '@/components/reports/InventoryInsights';
import { SupplierPerformance } from '@/components/reports/SupplierPerformance';
import { FinancialOverview } from '@/components/reports/FinancialOverview';
import { EmployeePerformance } from '@/components/reports/EmployeePerformance';
import { ReportsCharts } from '@/components/reports/ReportsCharts';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleExportReport = (reportType: string) => {
    toast.success(`Exporting ${reportType} report...`);
  };

  const handleScheduleReport = () => {
    toast.info('Report scheduling feature coming soon');
  };

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
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleScheduleReport}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button onClick={() => handleExportReport('overview')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Report Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  This comprehensive dashboard provides real-time insights into your business performance across all key areas.
                  Use the tabs above to explore detailed analytics for sales, inventory, suppliers, and financial metrics.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Key Highlights</h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Revenue up 12.5% this quarter</li>
                      <li>• 96.8% supplier on-time delivery rate</li>
                      <li>• Profit margin above industry average</li>
                      <li>• Inventory turnover improved by 8%</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Action Items</h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Address 23 low stock alerts</li>
                      <li>• Review 3 expired products</li>
                      <li>• Follow up on overdue payments</li>
                      <li>• Optimize underperforming categories</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Charts */}
            <ReportsCharts 
              title="Interactive Business Analytics" 
              defaultType="bar" 
              showControls={true} 
            />
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Analytics</h2>
              <Button onClick={() => handleExportReport('sales')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Sales Report
              </Button>
            </div>
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Insights</h2>
              <Button onClick={() => handleExportReport('inventory')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Inventory Report
              </Button>
            </div>
            <InventoryInsights alerts={[]} />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Supplier Performance</h2>
              <Button onClick={() => handleExportReport('suppliers')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Supplier Report
              </Button>
            </div>
            <SupplierPerformance suppliers={[]} />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Overview</h2>
              <Button onClick={() => handleExportReport('financial')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Financial Report
              </Button>
            </div>
            <FinancialOverview metrics={[]} period="monthly" />
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Performance</h2>
              <Button onClick={() => handleExportReport('employees')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Employee Report
              </Button>
            </div>
            <EmployeePerformance employees={[]} period="monthly" departmentFilter="All" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
