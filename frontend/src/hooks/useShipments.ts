import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  GET_SHIPMENTS_BY_SUPPLIER,
  ADD_SHIPMENT,
} from '@/app/graphql/suppliers';
import type { ShipmentGraphQL, CreateShipmentInput } from '@/types';

export function useShipments(supplierId?: string) {
  const [loading, setLoading] = useState(false);

  // Query for fetching shipments
  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery(GET_SHIPMENTS_BY_SUPPLIER, {
    variables: { supplier_id: supplierId },
    skip: !supplierId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  // Mutation for creating shipment
  const [createShipmentMutation] = useMutation(ADD_SHIPMENT, {
    onCompleted: (data) => {
      console.log('✅ Shipment created successfully:', data.addShipment);
      toast.success('Shipment order created successfully!');
      // Refetch shipments to update the list
      refetch();
    },
    onError: (error) => {
      console.error('❌ Error creating shipment:', error);
      toast.error(error.message || 'Failed to create shipment order');
    },
  });

  const shipments: ShipmentGraphQL[] = data?.shipmentsBySupplier || [];

  const createShipment = async (shipmentInput: CreateShipmentInput) => {
    setLoading(true);
    try {
      console.log('🔄 Creating shipment with input:', shipmentInput);
      
      const result = await createShipmentMutation({
        variables: {
          createShipmentInput: shipmentInput,
        },
      });

      return result.data?.addShipment;
    } catch (error) {
      console.error('❌ Error in createShipment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    shipments,
    loading: queryLoading || loading,
    error,
    createShipment,
    refetch,
  };
}

export function useShipmentCreation() {
  const [loading, setLoading] = useState(false);

  const [createShipmentMutation] = useMutation(ADD_SHIPMENT);

  const createShipment = async (shipmentInput: CreateShipmentInput) => {
    setLoading(true);
    try {
      console.log('🔄 Creating shipment with input:', shipmentInput);
      
      const result = await createShipmentMutation({
        variables: {
          createShipmentInput: shipmentInput,
        },
      });

      console.log('✅ Shipment created successfully:', result.data?.addShipment);
      toast.success('Shipment order created successfully!');
      
      return result.data?.addShipment;
    } catch (error) {
      console.error('❌ Error creating shipment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create shipment order';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createShipment,
    loading,
  };
}