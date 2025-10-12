'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExportDropdown } from '@/components/ui/export-dropdown';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingCart,
  CreditCard,
  Banknote,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { formatIndianRupee } from '@/lib/formatters';
import { GET_SALES_ANALYTICS } from '@/app/graphql/transactions';
import { transformSalesDataForExport } from '@/hooks/useExportData';

interface SalesOverview {
  totalRevenue: number;
  totalTransactions: number;
  avgOrderValue: number;
  growthRate: number;
}

interface TopProduct {
  product_id: number;
  product_name: string;
  category_name: string;
  total_sold: number;
  revenue: number;
  avg_price: number;
  trend: string;
}

interface PaymentMethod {
  method: string;
  count: number;
  total_amount: number;
  percentage: number;
}

interface RevenueByCategory {
  category: string;
  revenue: number;
  percentage: number;
}

interface SalesAnalyticsData {
  salesAnalytics: {
    overview: SalesOverview;
    topProducts: TopProduct[];
    paymentMethods: PaymentMethod[];
    revenueByCategory: RevenueByCategory[];
  };
}

export function SalesAnalytics() {
  const { data, loading, error } = useQuery<SalesAnalyticsData>(GET_SALES_ANALYTICS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading sales analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500 mr-2" />
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">
            Failed to load sales analytics
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  const { overview, topProducts, paymentMethods, revenueByCategory } = data?.salesAnalytics || {
    overview: { totalRevenue: 0, totalTransactions: 0, avgOrderValue: 0, growthRate: 0 },
    topProducts: [],
    paymentMethods: [],
    revenueByCategory: [],
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
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
        return <IndianRupee className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="flex justify-end">
        <ExportDropdown
          data={transformSalesDataForExport(data)}
          filename="sales-analytics"
          title="Sales Analytics Report"
          variant="outline"
        />
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((product, index) => (
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No product sales data available</p>
              </div>
            )}
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
              {paymentMethods && paymentMethods.length > 0 ? (
                paymentMethods.map((payment) => (
                  <div key={payment.method} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getPaymentIcon(payment.method)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payment.method}
                        </p>
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
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    No payment method data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByCategory && revenueByCategory.length > 0 ? (
                revenueByCategory.map((category) => (
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
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    No category revenue data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
