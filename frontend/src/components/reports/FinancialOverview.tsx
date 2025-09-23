import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, CreditCard } from 'lucide-react';
import type { FinancialOverviewProps } from '@/types';

// Mock financial data
const mockFinancialData = {
  currentPeriod: {
    revenue: 156780.5,
    costs: 98456.3,
    profit: 58324.2,
    profit_margin: 37.2,
    tax_collected: 15678.05,
    refunds: 3456.78,
  },
  previousPeriod: {
    revenue: 142356.8,
    costs: 89234.5,
    profit: 53122.3,
    profit_margin: 37.3,
    tax_collected: 14235.68,
    refunds: 2987.45,
  },
  cashflow: {
    incoming: 178456.9,
    outgoing: 125678.4,
    net: 52778.5,
  },
  breakdown: [
    { category: 'Product Sales', amount: 134567.8, percentage: 85.8 },
    { category: 'Service Revenue', amount: 15678.9, percentage: 10.0 },
    { category: 'Other Income', amount: 6533.8, percentage: 4.2 },
  ],
};

export function FinancialOverview({ period }: FinancialOverviewProps) {
  const { currentPeriod, previousPeriod, cashflow, breakdown } = mockFinancialData;

  const getGrowthPercentage = (current: number, previous: number) => {
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600 dark:text-gray-400';
  };

  const revenueGrowth = parseFloat(
    getGrowthPercentage(currentPeriod.revenue, previousPeriod.revenue),
  );
  const profitGrowth = parseFloat(getGrowthPercentage(currentPeriod.profit, previousPeriod.profit));

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
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
              ${currentPeriod.revenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(revenueGrowth)}
              <p className={`text-xs ${getGrowthColor(revenueGrowth)}`}>
                {revenueGrowth > 0 ? '+' : ''}
                {revenueGrowth}% from last {period}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Net Profit
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${currentPeriod.profit.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(profitGrowth)}
              <p className={`text-xs ${getGrowthColor(profitGrowth)}`}>
                {profitGrowth > 0 ? '+' : ''}
                {profitGrowth}% from last {period}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Profit Margin
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentPeriod.profit_margin.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Industry avg: 25%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Net Cashflow
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${cashflow.net.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">This {period}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breakdown.map((item, index) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-gray-500' : index === 1 ? 'bg-gray-500' : 'bg-gray-500'
                      }`}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${item.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cashflow Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Cashflow Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Cash Inflow</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Revenue & Collections
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    +${cashflow.incoming.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Cash Outflow</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expenses & Payments</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    -${cashflow.outgoing.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Net Cashflow</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Available Cash</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    ${cashflow.net.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Financial Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Financial Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Revenue & Costs</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gross Revenue:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${currentPeriod.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Costs:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${currentPeriod.costs.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-neutral-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Net Profit:</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    ${currentPeriod.profit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Tax & Compliance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax Collected:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${currentPeriod.tax_collected.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax Rate:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {((currentPeriod.tax_collected / currentPeriod.revenue) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Refunds Issued:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    ${currentPeriod.refunds.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Performance Ratios</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Profit Margin:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentPeriod.profit_margin.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cost Ratio:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {((currentPeriod.costs / currentPeriod.revenue) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Refund Rate:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {((currentPeriod.refunds / currentPeriod.revenue) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
