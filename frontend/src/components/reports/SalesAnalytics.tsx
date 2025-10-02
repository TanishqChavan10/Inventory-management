import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { formatIndianRupee } from '@/lib/formatters';

// Mock data based on ER diagram
const mockSalesData = {
  overview: {
    totalRevenue: 156780.5,
    totalTransactions: 1247,
    avgOrderValue: 125.75,
    growthRate: 12.5,
  },
  topProducts: [
    {
      product_id: 'LAP-001',
      product_name: 'Dell XPS 13 Laptop',
      category_name: 'Electronics',
      total_sold: 45,
      revenue: 54000.0,
      avg_price: 1200.0,
      trend: 'up' as const,
    },
    {
      product_id: 'LAP-002',
      product_name: 'HP Pavilion Laptop',
      category_name: 'Electronics',
      total_sold: 38,
      revenue: 36100.0,
      avg_price: 950.0,
      trend: 'up' as const,
    },
    {
      product_id: 'MOU-001',
      product_name: 'Wireless Mouse',
      category_name: 'Electronics',
      total_sold: 156,
      revenue: 3900.0,
      avg_price: 25.0,
      trend: 'stable' as const,
    },
    {
      product_id: 'KEY-001',
      product_name: 'Mechanical Keyboard',
      category_name: 'Electronics',
      total_sold: 67,
      revenue: 8040.0,
      avg_price: 120.0,
      trend: 'down' as const,
    },
    {
      product_id: 'MOU-002',
      product_name: 'Gaming Mouse',
      category_name: 'Electronics',
      total_sold: 89,
      revenue: 5340.0,
      avg_price: 60.0,
      trend: 'up' as const,
    },
  ],
  paymentMethods: [
    { method: 'Credit Card', count: 523, total_amount: 67890.25, percentage: 43.3 },
    { method: 'Cash', count: 398, total_amount: 45670.8, percentage: 36.7 },
    { method: 'Debit Card', count: 234, total_amount: 28945.15, percentage: 20.0 },
  ],
  revenueByCategory: [
    { category: 'Electronics', revenue: 89450.75, percentage: 57.1 },
    { category: 'Books', revenue: 34580.2, percentage: 22.1 },
    { category: 'Clothing', revenue: 22340.35, percentage: 14.2 },
    { category: 'Home & Garden', revenue: 10409.2, percentage: 6.6 },
  ],
};

export function SalesAnalytics() {
  const { overview, topProducts, paymentMethods, revenueByCategory } = mockSalesData;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Credit Card':
      case 'Debit Card':
        return <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      case 'Cash':
        return <Banknote className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatIndianRupee(overview.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-gray-600" />
              <p className="text-xs text-gray-600">+{overview.growthRate}% from last period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Transactions
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {overview.totalTransactions.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Sales transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatIndianRupee(overview.avgOrderValue)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Growth Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {overview.growthRate}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Quarter over quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.product_id}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.product_name}
                    </p>
                    <p className="text-sm text-gray-500">{product.category_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.total_sold}
                    </p>
                    <p className="text-xs text-gray-500">Units Sold</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatIndianRupee(product.revenue)}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatIndianRupee(product.avg_price)}
                    </p>
                    <p className="text-xs text-gray-500">Avg Price</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    {getTrendIcon(product.trend)}
                    <Badge variant="secondary" className="text-xs">
                      {product.trend}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((payment) => (
                <div key={payment.method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getPaymentIcon(payment.method)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{payment.method}</p>
                      <p className="text-sm text-gray-500">{payment.count} transactions</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatIndianRupee(payment.total_amount)}
                    </p>
                    <p className="text-sm text-gray-500">{payment.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByCategory.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.category}
                    </span>
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
                      {formatIndianRupee(category.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
