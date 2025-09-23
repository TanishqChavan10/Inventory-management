import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Package,
  Calendar,
  TrendingDown,
  Truck,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import type { InventoryInsightsProps } from '@/types';

// Mock data based on ER diagram
const mockInventoryData = {
  overview: {
    totalProducts: 1247,
    lowStockItems: 23,
    expiringItems: 8,
    expiredItems: 3,
    overstockItems: 15,
  },
  alerts: [
    {
      type: 'low_stock' as const,
      product_id: 'LAP-003',
      product_name: 'MacBook Air M2',
      current_stock: 2,
      threshold: 10,
      severity: 'high' as const,
    },
    {
      type: 'expiring_soon' as const,
      product_id: 'FOOD-001',
      product_name: 'Organic Milk 1L',
      current_stock: 15,
      threshold: 20,
      days_until_expiry: 3,
      severity: 'high' as const,
    },
    {
      type: 'expired' as const,
      product_id: 'FOOD-002',
      product_name: 'Fresh Bread',
      current_stock: 8,
      threshold: 0,
      days_until_expiry: -2,
      severity: 'high' as const,
    },
    {
      type: 'low_stock' as const,
      product_id: 'MOU-001',
      product_name: 'Wireless Mouse',
      current_stock: 5,
      threshold: 15,
      severity: 'medium' as const,
    },
    {
      type: 'overstock' as const,
      product_id: 'KEY-002',
      product_name: 'USB Keyboard',
      current_stock: 150,
      threshold: 50,
      severity: 'low' as const,
    },
  ],
  categoryInsights: [
    {
      category: 'Electronics',
      total_products: 456,
      low_stock: 12,
      avg_turnover: 8.5,
      value: 145670.8,
    },
    {
      category: 'Food & Beverage',
      total_products: 234,
      low_stock: 6,
      avg_turnover: 15.2,
      value: 34567.9,
    },
    {
      category: 'Clothing',
      total_products: 189,
      low_stock: 3,
      avg_turnover: 12.8,
      value: 78934.5,
    },
    {
      category: 'Home & Garden',
      total_products: 198,
      low_stock: 2,
      avg_turnover: 6.7,
      value: 56789.2,
    },
  ],
  recentShipments: [
    {
      shipment_id: 'SHP-001',
      supplier_name: 'TechCorp Solutions',
      received_date: '2024-01-15',
      total_items: 45,
      payment_status: 'Paid',
      products_count: 12,
    },
    {
      shipment_id: 'SHP-002',
      supplier_name: 'Fresh Foods Ltd',
      received_date: '2024-01-14',
      total_items: 78,
      payment_status: 'Pending',
      products_count: 23,
    },
    {
      shipment_id: 'SHP-003',
      supplier_name: 'Office Supplies Inc',
      received_date: '2024-01-13',
      total_items: 156,
      payment_status: 'Paid',
      products_count: 34,
    },
  ],
};

export function InventoryInsights({ alerts }: InventoryInsightsProps) {
  const { overview, categoryInsights, recentShipments } = mockInventoryData;
  const allAlerts = alerts.length > 0 ? alerts : mockInventoryData.alerts;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <TrendingDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      case 'expiring_soon':
        return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      case 'overstock':
        return <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700';
      case 'medium':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleViewProduct = (productId: string) => {
    toast.info(`Viewing product details for ${productId}`);
  };

  const handleReorderProduct = (productId: string) => {
    toast.success(`Reorder initiated for ${productId}`);
  };

  return (
    <div className="space-y-6">
      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {overview.totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Low Stock
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {overview.lowStockItems}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Need reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Expiring Soon
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {overview.expiringItems}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Within 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Expired
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {overview.expiredItems}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Need removal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Overstock
            </CardTitle>
            <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {overview.overstockItems}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Excess inventory</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {allAlerts.map((alert, index) => (
                <div
                  key={`${alert.product_id}-${index}`}
                  className={`p-4 border rounded-lg ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <div>
                        <h3 className="font-medium">{alert.product_name}</h3>
                        <p className="text-sm opacity-75">ID: {alert.product_id}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {alert.type.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>
                      Current Stock: <span className="font-medium">{alert.current_stock}</span>
                    </p>
                    {alert.threshold > 0 && (
                      <p>
                        Threshold: <span className="font-medium">{alert.threshold}</span>
                      </p>
                    )}
                    {alert.days_until_expiry !== undefined && (
                      <p>
                        {alert.days_until_expiry < 0
                          ? `Expired ${Math.abs(alert.days_until_expiry)} days ago`
                          : `Expires in ${alert.days_until_expiry} days`}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewProduct(alert.product_id)}
                      className="text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {alert.type === 'low_stock' && (
                      <Button
                        size="sm"
                        onClick={() => handleReorderProduct(alert.product_id)}
                        className="text-xs"
                      >
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryInsights.map((category) => (
                <div
                  key={category.category}
                  className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                    <Badge
                      variant={category.low_stock > 5 ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {category.low_stock} low stock
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Products</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {category.total_products}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Turnover (days)</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {category.avg_turnover}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600 dark:text-gray-400">Inventory Value</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${category.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentShipments.map((shipment) => (
              <div
                key={shipment.shipment_id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {shipment.supplier_name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {shipment.received_date}
                      <span>•</span>
                      <span>{shipment.total_items} items</span>
                      <span>•</span>
                      <span>{shipment.products_count} products</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(shipment.payment_status)}>
                    {shipment.payment_status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
