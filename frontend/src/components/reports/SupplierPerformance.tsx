import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { SupplierPerformanceProps } from '@/types';

// Mock data based on ER diagram
const mockSupplierData = {
  overview: {
    totalSuppliers: 24,
    activeSuppliers: 18,
    avgDeliveryTime: 3.2,
    avgPaymentTime: 15.8,
    qualityScore: 8.7,
  },
  topPerformers: [
    {
      supplier_id: 'SUP-001',
      supplier_name: 'TechCorp Solutions',
      total_shipments: 45,
      on_time_delivery: 96.8,
      total_value: 156780.5,
      avg_payment_time: 12.5,
      quality_score: 9.2,
      status: 'Excellent' as const,
    },
    {
      supplier_id: 'SUP-002',
      supplier_name: 'Fresh Foods Ltd',
      total_shipments: 38,
      on_time_delivery: 89.5,
      total_value: 78934.2,
      avg_payment_time: 18.3,
      quality_score: 8.8,
      status: 'Good' as const,
    },
    {
      supplier_id: 'SUP-003',
      supplier_name: 'Office Supplies Inc',
      total_shipments: 52,
      on_time_delivery: 94.2,
      total_value: 89567.8,
      avg_payment_time: 14.7,
      quality_score: 8.9,
      status: 'Excellent' as const,
    },
    {
      supplier_id: 'SUP-004',
      supplier_name: 'Global Electronics',
      total_shipments: 29,
      on_time_delivery: 82.1,
      total_value: 134567.9,
      avg_payment_time: 21.4,
      quality_score: 7.6,
      status: 'Average' as const,
    },
    {
      supplier_id: 'SUP-005',
      supplier_name: 'QuickShip Logistics',
      total_shipments: 16,
      on_time_delivery: 75.0,
      total_value: 45678.3,
      avg_payment_time: 28.9,
      quality_score: 6.8,
      status: 'Poor' as const,
    },
  ],
  paymentAnalysis: [
    { status: 'Paid', count: 156, total_amount: 234567.89, percentage: 68.4 },
    { status: 'Pending', count: 43, total_amount: 67890.45, percentage: 18.9 },
    { status: 'Overdue', count: 12, total_amount: 23456.78, percentage: 5.3 },
    { status: 'Disputed', count: 8, total_amount: 12345.67, percentage: 3.5 },
    { status: 'Processing', count: 9, total_amount: 8765.43, percentage: 3.9 },
  ],
  deliveryMetrics: {
    onTime: 156,
    late: 23,
    veryLate: 8,
    avgDeliveryDays: 3.2,
    improvementRate: 12.5,
  },
};

export function SupplierPerformance({ suppliers }: SupplierPerformanceProps) {
  const { overview, topPerformers, paymentAnalysis, deliveryMetrics } = mockSupplierData;
  const performanceData = suppliers.length > 0 ? suppliers : topPerformers;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Good':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Average':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Poor':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getQualityStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'text-gray-600 fill-gray-600'
                : i === fullStars && hasHalfStar
                  ? 'text-gray-600 fill-gray-400'
                  : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{score.toFixed(1)}</span>
      </div>
    );
  };

  const handleContactSupplier = (supplierId: string) => {
    toast.info(`Contacting supplier ${supplierId}`);
  };

  const handleViewDetails = (supplierId: string) => {
    toast.info(`Viewing details for supplier ${supplierId}`);
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Suppliers
            </CardTitle>
            <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {overview.totalSuppliers}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {overview.activeSuppliers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Delivery
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {overview.avgDeliveryTime}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Payment Time
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {overview.avgPaymentTime}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">days average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Quality Score
            </CardTitle>
            <Star className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {overview.qualityScore}/10
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Overall rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              On-Time Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(
                (deliveryMetrics.onTime /
                  (deliveryMetrics.onTime + deliveryMetrics.late + deliveryMetrics.veryLate)) *
                100
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">deliveries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Suppliers */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Supplier Performance Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {performanceData.map((supplier, index) => (
                <div
                  key={supplier.supplier_id}
                  className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {supplier.supplier_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {supplier.total_shipments} shipments
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(supplier.status)}>{supplier.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">On-Time</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {supplier.on_time_delivery.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Value</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${supplier.total_value.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Payment Time</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {supplier.avg_payment_time.toFixed(1)} days
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Quality</p>
                      {getQualityStars(supplier.quality_score)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(supplier.supplier_id)}
                      className="text-xs"
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleContactSupplier(supplier.supplier_id)}
                      className="text-xs"
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentAnalysis.map((payment) => (
                <div
                  key={payment.status}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {payment.status === 'Paid' ? (
                      <CheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : payment.status === 'Overdue' || payment.status === 'Disputed' ? (
                      <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{payment.status}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.count} invoices
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${payment.total_amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Delivery Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">On Time</h3>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {deliveryMetrics.onTime}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">deliveries</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Late</h3>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {deliveryMetrics.late}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">1-3 days late</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Very Late</h3>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {deliveryMetrics.veryLate}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">3+ days late</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Improvement</h3>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                +{deliveryMetrics.improvementRate}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">vs last quarter</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
