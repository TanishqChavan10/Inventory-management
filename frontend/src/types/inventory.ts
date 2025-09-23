// Inventory page specific types and interfaces

export interface InventoryStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStock: number;
  totalValue: string;
}

export interface MockInventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  status: string;
}

export interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}