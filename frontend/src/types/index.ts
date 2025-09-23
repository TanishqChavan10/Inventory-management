// Centralized type definitions for better TypeScript performance
export type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  minCount: number;
};

// Enhanced Supplier types based on ER diagram
export type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  products: string[];
  orders: number;
  totalValue: string;
  lastOrder: string;
  status: 'Active' | 'Inactive';
};

export type SupplierDetail = {
  supplier_id: string;
  name: string;
  email: string;
  phone_no: string;
  address?: string;
  contact_person?: string;
  registration_number?: string;
  tax_id?: string;
  created_date: string;
  status: 'Active' | 'Inactive';
};

export type Shipment = {
  shipment_id: string;
  supplier_id: string;
  ref_no: string;
  received_date: string;
  payment_status: 'Pending' | 'Paid' | 'Failed';
  payment_mthd: string;
  invoice_amt: number;
  total_items: number;
};

export type ShipmentItem = {
  shipment_id: string;
  product_id: string;
  product_name: string;
  quantity_received: number;
  unit_price: number;
  mfg_date?: string;
  expiry_date?: string;
  batch_number?: string;
};

// Enhanced Transaction types based on ER diagram
export type TransactionDetail = {
  transaction_id: string;
  customer_id?: string;
  cashier_id: string;
  transaction_date: string;
  payment_method: 'Cash' | 'Credit Card' | 'Debit Card' | 'Mobile Payment';
  total_amt: number;
  payment_refno?: string;
  status: 'Completed' | 'Pending' | 'Refunded' | 'Failed';
  tax_amount?: number;
  discount_amount?: number;
  subtotal: number;
  notes?: string;
};

export type Customer = {
  customer_id: string;
  name: string;
  phone_no?: string;
  email?: string;
  address?: string;
  loyalty_points?: number;
  total_purchases?: number;
  created_date: string;
};

export type OrderItem = {
  transaction_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_applied?: number;
  category_name?: string;
};

export type Employee = {
  employee_id: string;
  name: string;
  role: string;
  contact?: string;
  department?: string;
  hire_date?: string;
};

export type SupplierMetrics = {
  supplier_id: string;
  supplier_name: string;
  total_shipments: number;
  on_time_delivery: number;
  total_value: number;
  avg_payment_time: number;
  quality_score: number;
  status: 'Excellent' | 'Good' | 'Average' | 'Poor';
};

export type EmployeeMetrics = {
  employee_id: string;
  employee_name: string;
  transactions_handled: number;
  total_sales: number;
  avg_transaction_value: number;
  customer_rating: number;
  efficiency_score: number;
};

// Common props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface InventoryHeaderProps {
  onAddProduct: () => void;
}

// Supplier component props
export interface SuppliersHeaderProps {
  onAddSupplier?: () => void;
}

export interface SuppliersSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface SupplierRowProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export interface SuppliersTableProps {
  suppliers: Supplier[];
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplier: Supplier) => void;
}

// Supplier detail page props
export interface SupplierDetailHeaderProps {
  supplier: SupplierDetail;
}

export interface SupplierStatsProps {
  totalShipments: number;
  totalValue: number;
  totalProducts: number;
  avgOrderValue: number;
  lastOrderDate: string;
}

export interface SupplierShipmentsProps {
  shipments: Shipment[];
  onViewShipment?: (shipment: Shipment) => void;
}

export interface SupplierProductsProps {
  shipmentItems: ShipmentItem[];
}

// Transaction component props
export interface TransactionDetailHeaderProps {
  transaction: TransactionDetail;
  customer?: Customer;
  cashier: Employee;
}

export interface TransactionStatsProps {
  transaction: TransactionDetail;
  totalItems: number;
  uniqueProducts: number;
}

export interface TransactionItemsProps {
  orderItems: OrderItem[];
}

export interface TransactionPaymentProps {
  transaction: TransactionDetail;
  refundHistory?: Array<{
    refund_id: string;
    amount: number;
    date: string;
    reason: string;
    processed_by: string;
  }>;
}

// Reports and Analytics types
export interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export interface InventoryInsightsProps {
  alerts: Array<{
    type: 'low_stock' | 'expiring_soon' | 'expired' | 'overstock';
    product_id: string;
    product_name: string;
    current_stock: number;
    threshold: number;
    days_until_expiry?: number;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export interface SupplierPerformanceProps {
  suppliers: SupplierMetrics[];
}

export interface FinancialOverviewProps {
  metrics: Array<{
    period: string;
    revenue: number;
    costs: number;
    profit: number;
    profit_margin: number;
    tax_collected: number;
    refunds: number;
  }>;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
