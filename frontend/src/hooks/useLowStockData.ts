import { useQuery } from '@apollo/client';
import { GET_LOW_STOCK_PRODUCTS } from '@/lib/graphql/products';
import { Product } from '@/types';

export interface LowStockItem {
  name: string;
  category: string;
  stock: number;
  minStock: number;
  stockPercentage: number;
  urgency: 'high' | 'medium' | 'low';
}

interface UseLowStockDataReturn {
  lowStockItems: LowStockItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLowStockData = (): UseLowStockDataReturn => {
  const { data, loading, error, refetch } = useQuery(GET_LOW_STOCK_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // Process the raw GraphQL data into the format needed by the component
  const processedItems: LowStockItem[] = data?.lowStockProducts?.map((product: Product) => {
    const stockPercentage = (product.stock / product.min_stock) * 100;
    let urgency: 'high' | 'medium' | 'low' = 'low';
    
    if (stockPercentage <= 25) {
      urgency = 'high';
    } else if (stockPercentage <= 50) {
      urgency = 'medium';
    }

    return {
      name: product.product_name,
      category: product.categories?.[0]?.name || 'Uncategorized',
      stock: product.stock,
      minStock: product.min_stock,
      stockPercentage,
      urgency
    };
  }) || [];

  return {
    lowStockItems: processedItems,
    loading,
    error: error?.message || null,
    refetch: () => {
      refetch();
    }
  };
};