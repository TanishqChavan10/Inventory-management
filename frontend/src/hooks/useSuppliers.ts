// src/hooks/useSuppliers.ts

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { toast } from 'sonner';
import {
  GET_SUPPLIERS,
  GET_SUPPLIER,
  GET_SHIPMENTS_BY_SUPPLIER,
  GET_SHIPMENT_ITEMS_BY_SUPPLIER,
  ADD_SUPPLIER,
  UPDATE_SUPPLIER,
  DELETE_SUPPLIER,
} from '@/app/graphql/suppliers';
import {
  transformSupplierForTable,
  transformSupplierDetail,
  transformShipment,
  transformShipmentItem,
} from '@/types';
import type {
  Supplier,
  SupplierDetail,
  Shipment,
  ShipmentItem,
  SupplierGraphQL,
  ShipmentGraphQL,
  ShipmentItemGraphQL,
} from '@/types';

export function useSuppliers(page: number = 1, limit: number = 10, status?: string) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const apolloClient = useApolloClient();

  const { data, loading: queryLoading, error, refetch } = useQuery(GET_SUPPLIERS, {
    variables: { page, limit, status },
    errorPolicy: 'all',
    fetchPolicy: 'network-only', // Always fetch from network, ignore cache
    notifyOnNetworkStatusChange: true, // Update loading state during refetch
  });

  const [addSupplierMutation] = useMutation(ADD_SUPPLIER);
  const [updateSupplierMutation] = useMutation(UPDATE_SUPPLIER);
  const [deleteSupplierMutation] = useMutation(DELETE_SUPPLIER);

  useEffect(() => {
    const loadSuppliersWithShipments = async () => {
      if (data?.suppliers) {
        console.log('📊 Suppliers data updated:', data.suppliers.length, 'suppliers');
        setLoading(true);
        
        try {
          // Fetch shipments for each supplier
          const suppliersWithShipments = await Promise.all(
            data.suppliers.map(async (supplier: SupplierGraphQL) => {
              try {
                const { data: shipmentsData } = await apolloClient.query({
                  query: GET_SHIPMENTS_BY_SUPPLIER,
                  variables: { supplier_id: supplier.supplier_id },
                  errorPolicy: 'all',
                });
                
                const shipments = shipmentsData?.shipmentsBySupplier || [];
                return transformSupplierForTable(supplier, shipments, []);
              } catch (error) {
                console.error(`Error fetching shipments for supplier ${supplier.supplier_id}:`, error);
                // Return supplier with empty shipments data if fetch fails
                return transformSupplierForTable(supplier, [], []);
              }
            })
          );
          
          setSuppliers(suppliersWithShipments);
          console.log('✅ Transformed suppliers with shipments set:', suppliersWithShipments.length);
        } catch (error) {
          console.error('Error loading suppliers with shipments:', error);
          // Fallback to suppliers without shipments data
          const transformedSuppliers = data.suppliers.map((supplier: SupplierGraphQL) =>
            transformSupplierForTable(supplier, [], [])
          );
          setSuppliers(transformedSuppliers);
        }
      }
      setLoading(queryLoading);
    };

    loadSuppliersWithShipments();
  }, [data, queryLoading, apolloClient]);

  const addSupplier = async (supplierData: Omit<SupplierGraphQL, 'supplier_id' | 'created_date' | 'updated_date'>) => {
    console.log('🔄 addSupplier called with:', supplierData);
    try {
      const { data } = await addSupplierMutation({
        variables: {
          createSupplierInput: supplierData,
        },
      });

      if (data?.addSupplier) {
        console.log('✅ Add supplier success, refetching...');
        await refetch();
        console.log('🔄 Refetch completed');
        return data.addSupplier;
      }
    } catch (error) {
      toast.error('Failed to add supplier');
      console.error('Error adding supplier:', error);
      throw error;
    }
  };

  const updateSupplier = async (supplierData: Partial<SupplierGraphQL> & { supplier_id: string }) => {
    console.log('🔄 updateSupplier called with:', supplierData);
    try {
      // Ensure category_id is valid before sending to backend
      const updateData = { ...supplierData };
      if (!updateData.category_id || updateData.category_id <= 0) {
        // Remove invalid category_id to avoid NOT NULL constraint violation
        delete updateData.category_id;
      }

      const { data } = await updateSupplierMutation({
        variables: {
          updateSupplierInput: updateData,
        },
      });

      if (data?.updateSupplier) {
        console.log('✅ Update supplier success');
        console.log('Updated supplier data:', data.updateSupplier);
        
        // Nuclear option: completely reset Apollo cache
        await apolloClient.resetStore();
        
        console.log('🔄 Apollo store reset completed');
        return data.updateSupplier;
      }
    } catch (error) {
      toast.error('Failed to update supplier');
      console.error('Error updating supplier:', error);
      throw error;
    }
  };

  const deleteSupplier = async (supplier_id: string) => {
    try {
      const { data } = await deleteSupplierMutation({
        variables: { supplier_id },
      });

      if (data?.deleteSupplier) {
        // Success handled by refetchQueries
        return data.deleteSupplier;
      }
    } catch (error) {
      toast.error('Failed to delete supplier');
      console.error('Error deleting supplier:', error);
      throw error;
    }
  };

  return {
    suppliers,
    loading,
    error,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refetch,
  };
}

export function useSupplierDetail(supplier_id: string) {
  // Ensure supplier_id is a string and not empty
  const sanitizedSupplierId = supplier_id?.toString().trim();
  console.log('🔍 useSupplierDetail called with supplier_id:', sanitizedSupplierId, 'original:', supplier_id);
  
  const [supplierDetail, setSupplierDetail] = useState<SupplierDetail | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shipmentItems, setShipmentItems] = useState<ShipmentItem[]>([]);

  const { data: supplierData, loading: supplierLoading, error: supplierError } = useQuery(GET_SUPPLIER, {
    variables: { supplier_id: sanitizedSupplierId },
    errorPolicy: 'all',
    skip: !sanitizedSupplierId, // Skip if no valid supplier_id
  });

  const { data: shipmentsData, loading: shipmentsLoading, error: shipmentsError, refetch: refetchShipments } = useQuery(GET_SHIPMENTS_BY_SUPPLIER, {
    variables: { supplier_id: sanitizedSupplierId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network', // Try to get fresh data
    skip: !sanitizedSupplierId, // Skip if no valid supplier_id
    onCompleted: (data) => {
      console.log('📦 Shipments query completed for supplier_id:', sanitizedSupplierId, 'data:', data);
    },
    onError: (error) => {
      console.error('📦 Shipments query error for supplier_id:', sanitizedSupplierId, 'error:', error);
    }
  });

  const { data: shipmentItemsData, loading: shipmentItemsLoading, error: shipmentItemsError, refetch: refetchShipmentItems } = useQuery(GET_SHIPMENT_ITEMS_BY_SUPPLIER, {
    variables: { supplier_id: sanitizedSupplierId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network', // Try to get fresh data
    skip: !sanitizedSupplierId, // Skip if no valid supplier_id
    onCompleted: (data) => {
      console.log('📋 Shipment items query completed for supplier_id:', sanitizedSupplierId, 'data:', data);
    },
    onError: (error) => {
      console.error('📋 Shipment items query error for supplier_id:', sanitizedSupplierId, 'error:', error);
    }
  });

  // Log errors for debugging
  useEffect(() => {
    if (supplierError) {
      console.error('Supplier query error:', supplierError);
    }
    if (shipmentsError) {
      console.error('Shipments query error:', shipmentsError);
    }
    if (shipmentItemsError) {
      console.error('Shipment items query error:', shipmentItemsError);
    }
  }, [supplierError, shipmentsError, shipmentItemsError]);

  useEffect(() => {
    if (supplierData?.supplier) {
      setSupplierDetail(transformSupplierDetail(supplierData.supplier));
    }
  }, [supplierData]);

  useEffect(() => {
    if (shipmentsData?.shipmentsBySupplier) {
      console.log('🚚 Raw shipments data:', shipmentsData.shipmentsBySupplier);
      const transformedShipments = shipmentsData.shipmentsBySupplier.map((shipment: ShipmentGraphQL) =>
        transformShipment(shipment)
      );
      console.log('🚚 Transformed shipments:', transformedShipments);
      setShipments(transformedShipments);
    } else {
      console.log('🚚 No shipments data received:', shipmentsData);
    }
  }, [shipmentsData]);

  useEffect(() => {
    if (shipmentItemsData?.shipmentItemsBySupplier) {
      console.log('📦 Raw shipment items data:', shipmentItemsData.shipmentItemsBySupplier);
      const transformedItems = shipmentItemsData.shipmentItemsBySupplier.map((item: ShipmentItemGraphQL) =>
        transformShipmentItem(item)
      );
      console.log('📦 Transformed shipment items:', transformedItems);
      setShipmentItems(transformedItems);
    } else {
      console.log('📦 No shipment items data received:', shipmentItemsData);
    }
  }, [shipmentItemsData]);

  const loading = supplierLoading || shipmentsLoading || shipmentItemsLoading;
  const error = supplierError || shipmentsError || shipmentItemsError;

  const refetchAll = async () => {
    console.log('🔄 Manually refetching all data for supplier:', sanitizedSupplierId);
    if (!sanitizedSupplierId) {
      console.error('❌ Cannot refetch: invalid supplier_id');
      return;
    }
    try {
      await Promise.all([
        refetchShipments(),
        refetchShipmentItems()
      ]);
      console.log('✅ Manual refetch completed');
    } catch (error) {
      console.error('❌ Manual refetch failed:', error);
    }
  };

  return {
    supplierDetail,
    shipments,
    shipmentItems,
    loading,
    error,
    refetchAll
  };
}

export function useSupplierForEdit() {
  const fetchSupplierById = async (supplier_id: string, client: any) => {
    try {
      console.log('🔍 Fetching supplier by ID:', supplier_id);
      const result = await client.query({
        query: GET_SUPPLIER,
        variables: { supplier_id },
        fetchPolicy: 'network-only', // Force fresh fetch to ensure we get latest data
      });
      console.log('📥 Supplier fetch result:', result.data?.supplier);
      return result.data?.supplier || null;
    } catch (error) {
      console.error('Error fetching supplier for edit:', error);
      throw error;
    }
  };

  return {
    fetchSupplierById,
  };
}