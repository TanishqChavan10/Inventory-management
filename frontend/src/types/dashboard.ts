// Dashboard page specific types and interfaces

export interface StatDetails {
  title: string;
  columns: string[];
  data: (string | number)[][];
}

export interface StatData {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
  details: StatDetails;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
}

export interface LowStockItem {
  name: string;
  category: string;
  stock: number;
  total: number;
  daysLeft: number;
}