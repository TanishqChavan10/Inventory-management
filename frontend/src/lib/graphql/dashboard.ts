import { gql, TypedDocumentNode } from '@apollo/client';

// Dashboard Stats Types
export interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  totalInventoryValue: number;
  activeSuppliers: number;
  recentShipments: number;
  expiringItems: number;
}

// Get total products count
export const GET_TOTAL_PRODUCTS_COUNT: TypedDocumentNode<
  { products: { product_id: number }[] },
  {}
> = gql`
  query GetTotalProductsCount {
    products {
      product_id
    }
  }
`;

// Get low stock products count
export const GET_LOW_STOCK_COUNT: TypedDocumentNode<
  { lowStockProducts: { product_id: number }[] },
  {}
> = gql`
  query GetLowStockCount {
    lowStockProducts {
      product_id
    }
  }
`;

// Get total inventory value for dashboard
export const GET_DASHBOARD_INVENTORY_VALUE: TypedDocumentNode<
  { totalInventoryValue: number },
  {}
> = gql`
  query GetDashboardInventoryValue {
    totalInventoryValue
  }
`;

// Get active suppliers count
export const GET_ACTIVE_SUPPLIERS_COUNT: TypedDocumentNode<
  { suppliers: { supplier_id: string }[] },
  { status?: string }
> = gql`
  query GetActiveSuppliersCount($status: String) {
    suppliers(status: $status, limit: 1000) {
      supplier_id
    }
  }
`;

// Get recent shipments count (last 24 hours)
export const GET_RECENT_SHIPMENTS_COUNT: TypedDocumentNode<
  { shipments: { shipment_id: string; received_date: string }[] },
  { limit?: number }
> = gql`
  query GetRecentShipmentsCount($limit: Int) {
    shipments(limit: $limit) {
      shipment_id
      received_date
    }
  }
`;

// Get expiring items count (next 30 days)
export const GET_EXPIRING_ITEMS_COUNT: TypedDocumentNode<
  { expiringShipmentItems: { id: string }[] },
  { days?: number }
> = gql`
  query GetExpiringItemsCount($days: Int) {
    expiringShipmentItems(days: $days) {
      id
    }
  }
`;

// Combined dashboard stats query for efficiency
export const GET_DASHBOARD_STATS: TypedDocumentNode<
  {
    products: { product_id: number }[];
    lowStockProducts: { product_id: number }[];
    totalInventoryValue: number;
    suppliers: { supplier_id: string }[];
    shipments: { shipment_id: string; received_date: string }[];
    expiringShipmentItems: { id: string }[];
  },
  {
    supplierStatus?: string;
    shipmentLimit?: number;
    expiringDays?: number;
  }
> = gql`
  query GetDashboardStats(
    $supplierStatus: String
    $shipmentLimit: Int
    $expiringDays: Int
  ) {
    products {
      product_id
    }
    lowStockProducts {
      product_id
    }
    totalInventoryValue
    suppliers(status: $supplierStatus, limit: 1000) {
      supplier_id
    }
    shipments(limit: $shipmentLimit) {
      shipment_id
      received_date
    }
    expiringShipmentItems(days: $expiringDays) {
      id
    }
  }
`;