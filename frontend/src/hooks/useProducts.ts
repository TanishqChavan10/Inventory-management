import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/graphql/products';

export function useProducts() {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    products: data?.products || [],
    loading,
    error,
    refetch,
  };
}