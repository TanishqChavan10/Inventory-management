// Reports and Analytics page specific types and interfaces

// Import dependent types
import type { SupplierMetrics, EmployeeMetrics } from './index';

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

// Re-export for convenience
export type { SupplierMetrics, EmployeeMetrics };