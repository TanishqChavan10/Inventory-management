import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Download,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface InteractiveChartsProps {
  title?: string;
  defaultType?: 'line' | 'bar' | 'pie' | 'area';
  showControls?: boolean;
}

// Mock chart data
const salesData = [
  { month: 'Jan', revenue: 45000, transactions: 120, customers: 89 },
  { month: 'Feb', revenue: 52000, transactions: 145, customers: 102 },
  { month: 'Mar', revenue: 48000, transactions: 132, customers: 94 },
  { month: 'Apr', revenue: 61000, transactions: 167, customers: 118 },
  { month: 'May', revenue: 55000, transactions: 154, customers: 106 },
  { month: 'Jun', revenue: 67000, transactions: 189, customers: 134 },
];

const categoryData = [
  { name: 'Dairy', value: 35, sales: 45000, color: '#6b7280' },
  { name: 'Beverages', value: 25, sales: 32000, color: '#9ca3af' },
  { name: 'Grocery', value: 20, sales: 28000, color: '#4b5563' },
  { name: 'Personal Care', value: 12, sales: 16000, color: '#374151' },
  { name: 'Household', value: 8, sales: 11000, color: '#1f2937' },
];

const inventoryData = [
  { category: 'Dairy', inStock: 1200, lowStock: 45, expired: 8 },
  { category: 'Beverages', inStock: 890, lowStock: 23, expired: 3 },
  { category: 'Grocery', inStock: 1450, lowStock: 67, expired: 12 },
  { category: 'Personal Care', inStock: 670, lowStock: 12, expired: 2 },
  { category: 'Household', inStock: 340, lowStock: 8, expired: 1 },
];

const supplierData = [
  { supplier: 'FreshCorp', onTime: 96, quality: 4.8, orders: 24 },
  { supplier: 'GlobalSupply', onTime: 89, quality: 4.5, orders: 18 },
  { supplier: 'QuickDeliver', onTime: 93, quality: 4.6, orders: 21 },
  { supplier: 'ReliableGoods', onTime: 98, quality: 4.9, orders: 15 },
  { supplier: 'ValuePartner', onTime: 87, quality: 4.3, orders: 12 },
];

export const ReportsCharts: React.FC<InteractiveChartsProps> = ({
  title = "Interactive Charts",
  defaultType = 'bar',
  showControls = true
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'area'>(defaultType);
  const [dataSet, setDataSet] = useState<'sales' | 'inventory' | 'suppliers' | 'categories'>('sales');
  const [timeRange, setTimeRange] = useState<'6months' | '1year' | 'ytd'>('6months');

  const getCurrentData = () => {
    switch (dataSet) {
      case 'sales':
        return salesData;
      case 'inventory':
        return inventoryData;
      case 'suppliers':
        return supplierData;
      case 'categories':
        return categoryData;
      default:
        return salesData;
    }
  };

  const getDataKeys = () => {
    switch (dataSet) {
      case 'sales':
        return { x: 'month', y: ['revenue', 'transactions', 'customers'] };
      case 'inventory':
        return { x: 'category', y: ['inStock', 'lowStock', 'expired'] };
      case 'suppliers':
        return { x: 'supplier', y: ['onTime', 'quality', 'orders'] };
      case 'categories':
        return { x: 'name', y: ['value', 'sales'] };
      default:
        return { x: 'month', y: ['revenue'] };
    }
  };

  const handleExport = () => {
    console.log('Exporting chart data...');
  };

  const handleRefresh = () => {
    console.log('Refreshing chart data...');
  };

  const renderChart = () => {
    const data = getCurrentData();
    const keys = getDataKeys();
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={keys.x} />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.y.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={keys.x} />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.y.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={keys.x} />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.y.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={colors[index]}
                  fill={colors[index]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = dataSet === 'categories' ? categoryData : 
          data.map((item, index) => ({
            name: item[keys.x as keyof typeof item] as string,
            value: item[keys.y[0] as keyof typeof item] as number,
            color: colors[index % colors.length]
          }));
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#6b7280"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {title}
          </CardTitle>
          {showControls && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          )}
        </div>

        {showControls && (
          <div className="flex items-center gap-4 mt-4">
            {/* Chart Type Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Chart Type:</label>
              <Select value={chartType} onValueChange={(value: 'line' | 'bar' | 'pie' | 'area') => setChartType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Bar
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChartIcon className="w-4 h-4" />
                      Line
                    </div>
                  </SelectItem>
                  <SelectItem value="area">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Area
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center gap-2">
                      <PieChartIcon className="w-4 h-4" />
                      Pie
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Set Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Data:</label>
              <Select value={dataSet} onValueChange={(value: 'sales' | 'inventory' | 'suppliers' | 'categories') => setDataSet(value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Data</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="suppliers">Suppliers</SelectItem>
                  <SelectItem value="categories">Categories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Period:</label>
              <Select value={timeRange} onValueChange={(value: '6months' | '1year' | 'ytd') => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="ytd">YTD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Chart Data Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {getCurrentData().length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Chart Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {dataSet.charAt(0).toUpperCase() + dataSet.slice(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Dataset</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full">
          {renderChart()}
        </div>

        {/* Legend/Data Summary */}
        <div className="mt-6 flex flex-wrap gap-2">
          {getDataKeys().y.map((key, index) => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'][index] }}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};