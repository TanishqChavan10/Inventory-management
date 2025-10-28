'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExportDropdown } from '@/components/ui/export-dropdown';
import {
  AlertTriangle,
  Package,
  Calendar,
  Truck,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatIndianRupee } from '@/lib/formatters';
import { GET_INVENTORY_ANALYTICS } from '@/app/graphql/products';
import { GET_SHIPMENTS } from '@/app/graphql/suppliers';
import { transformInventoryDataForExport } from '@/hooks/useExportData';
import type { InventoryInsightsProps } from '@/types';

interface Product {
  product_id: number;
  product_name: string;
  default_price: number;
  stock: number;
  min_stock: number;
  categories: Array<{
    category_id: number;
    name: string;
  }>;
}

interface Shipment {
  shipment_id: string;
  supplier_id: string;
  ref_no: string;
  received_date: string;
  payment_status: string;
  payment_mthd: string;
  invoice_amt: number;
  total_items: number;
}

interface InventoryAnalyticsData {
  products: Product[];
  lowStockProducts: Product[];
  totalInventoryValue: number;
}

interface ShipmentsData {
  shipments: Shipment[];
}

interface InventoryAlert {
  type: 'low_stock' | 'expiring_soon' | 'expired';
  product_id: number;
  product_name: string;
  current_stock: number;
  threshold: number;
  severity: 'high' | 'medium' | 'low';
  days_until_expiry?: number;
  category_id?: number;
  category_name?: string;
}

interface CategoryInsight {
  category: string;
  total_products: number;
  low_stock: number;
  avg_turnover: number;
  value: number;
}

export function InventoryInsights({ alerts: propsAlerts = [] }: InventoryInsightsProps) {
  // Router for navigation
  const router = useRouter();

  // Pagination state for alerts
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 5;

  const {
    data: inventoryData,
    loading: inventoryLoading,
    error: inventoryError,
  } = useQuery<InventoryAnalyticsData>(GET_INVENTORY_ANALYTICS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const {
    data: shipmentsData,
    loading: shipmentsLoading,
    error: shipmentsError,
  } = useQuery<ShipmentsData>(GET_SHIPMENTS, {
    variables: { page: 1, limit: 5 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Calculate inventory insights from real data
  const products = inventoryData?.products || [];
  const lowStockProducts = inventoryData?.lowStockProducts || [];
  // Calculate total inventory value from products (stock * price)
  const totalInventoryValue = products.reduce((total, product) => {
    return total + product.stock * product.default_price;
  }, 0);
  const shipments = shipmentsData?.shipments || [];

  // Generate alerts from real data
  const alerts: InventoryAlert[] = [
    ...lowStockProducts.map((product) => ({
      type: 'low_stock' as const,
      product_id: product.product_id,
      product_name: product.product_name,
      current_stock: product.stock,
      threshold: product.min_stock,
      severity: (product.stock === 0
        ? 'high'
        : product.stock < product.min_stock / 2
          ? 'medium'
          : 'low') as 'high' | 'medium' | 'low',
      category_id: product.categories?.[0]?.category_id,
      category_name: product.categories?.[0]?.name,
    })),
  ];

  // Reset pagination when alerts change
  useEffect(() => {
    setCurrentPage(1);
  }, [alerts.length]);

  if (inventoryLoading || shipmentsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading inventory insights...</span>
      </div>
    );
  }

  if (inventoryError) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500 mr-2" />
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">
            Failed to load inventory data
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{inventoryError.message}</p>
        </div>
      </div>
    );
  }

  // Calculate overview metrics
  const overview = {
    totalProducts: products.length,
    lowStockItems: lowStockProducts.length,
    expiringItems: 0, // TODO: Add expiry date logic when available
    expiredItems: 0, // TODO: Add expired items logic when available
  };

  // Pagination calculations
  const totalPages = Math.ceil(alerts.length / alertsPerPage);
  const startIndex = (currentPage - 1) * alertsPerPage;
  const endIndex = startIndex + alertsPerPage;
  const paginatedAlerts = alerts.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Calculate category insights
  const categoryMap = new Map<
    string,
    { products: Product[]; low_stock: number; total_value: number }
  >();

  products.forEach((product) => {
    const categoryName = product.categories?.[0]?.name || 'Uncategorized';
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, { products: [], low_stock: 0, total_value: 0 });
    }
    const categoryData = categoryMap.get(categoryName)!;
    categoryData.products.push(product);
    categoryData.total_value += product.stock * product.default_price;
    if (lowStockProducts.some((lsp) => lsp.product_id === product.product_id)) {
      categoryData.low_stock += 1;
    }
  });

  const categoryInsights: CategoryInsight[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      total_products: data.products.length,
      low_stock: data.low_stock,
      avg_turnover: 0, // TODO: Calculate when transaction data is linked
      value: data.total_value,
    }),
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Package className="w-4 h-4" />;
      case 'expiring_soon':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleResolveAlert = (alert: InventoryAlert) => {
    if (alert.category_id) {
      // Redirect to suppliers page with category filter
      router.push(`/suppliers?category=${alert.category_id}`);
      toast.info(`Redirecting to ${alert.category_name || 'category'} suppliers...`);
    } else {
      // If no category, just go to suppliers page
      router.push('/suppliers');
      toast.info('Redirecting to suppliers page...');
    }
  };

  const handleViewShipment = (shipmentId: string) => {
    toast.info(`Viewing shipment ${shipmentId}...`);
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="flex justify-end">
        <ExportDropdown
          data={transformInventoryDataForExport(inventoryData?.products || [])}
          filename="inventory-insights"
          title="Inventory Analytics Report"
          variant="outline"
        />
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
            <p className="text-xs text-gray-600 dark:text-gray-400">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {overview.lowStockItems}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Require attention</p>
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
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {overview.expiringItems}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Within 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Value
            </CardTitle>
            <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatIndianRupee(totalInventoryValue)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Inventory Alerts
            {alerts.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {alerts.length} active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length > 0 ? (
              <>
                {paginatedAlerts.map((alert) => (
                  <div
                    key={`${alert.type}-${alert.product_id}`}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {alert.product_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {alert.type === 'low_stock' &&
                            `Stock: ${alert.current_stock} / Min: ${alert.threshold}`}
                          {alert.type === 'expiring_soon' &&
                            `Expires in ${alert.days_until_expiry} days`}
                          {alert.type === 'expired' &&
                            `Expired ${Math.abs(alert.days_until_expiry || 0)} days ago`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleResolveAlert(alert)}>
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages} ({alerts.length} total alerts)
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No inventory alerts at this time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Insights and Recent Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryInsights.length > 0 ? (
                categoryInsights.map((category) => (
                  <div
                    key={category.category}
                    className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {category.category}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{category.total_products} products</span>
                        <span>{category.low_stock} low stock</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatIndianRupee(category.value)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">No category data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Shipments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Recent Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shipments.length > 0 ? (
                shipments.map((shipment) => (
                  <div
                    key={shipment.shipment_id}
                    className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {shipment.shipment_id}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(shipment.received_date).toLocaleDateString()}
                        </span>
                        <span>{shipment.total_items} items</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(shipment.payment_status)}>
                        {shipment.payment_status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewShipment(shipment.shipment_id)}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {shipmentsError ? 'Failed to load shipments' : 'No recent shipments'}
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
