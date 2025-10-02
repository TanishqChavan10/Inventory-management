'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';

// --- Component Imports ---
import {
  SupplierDetailHeader,
  SupplierStats,
  SupplierShipments,
  CreateShipmentModal,
  ShipmentItemsTable,
} from '@/components/suppliers';

// --- Custom Hook ---
import { useSupplierDetail } from '@/hooks/useSuppliers';

// --- Types ---
import type { SupplierDetail, Shipment, ShipmentItem } from '@/types';

type Params = {
  params: Promise<{ id: string }>;
};

export default function SupplierDetailsPage({ params }: Params) {
  const { id } = use(params);
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedShipmentItems, setSelectedShipmentItems] = useState<ShipmentItem[]>([]);

  // Use the custom hook to fetch supplier details from database
  const { supplierDetail, shipments, shipmentItems, loading, error, refetchAll } =
    useSupplierDetail(id);

  // Add debugging logs
  console.log('🔍 Supplier Detail Page Debug:', {
    supplierId: id,
    supplierDetail,
    shipmentsCount: shipments.length,
    shipmentItemsCount: shipmentItems.length,
    loading,
    error: error?.message,
  });

  const handleCreateShipment = () => {
    setIsCreateShipmentOpen(true);
  };

  const handleShipmentCreated = async () => {
    toast.success('Shipment order created successfully!');
    // Refresh the data after creating a shipment
    await refetchAll();
  };

  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    // Filter items for this shipment
    const items = shipmentItems.filter((item) => item.shipment_id === shipment.shipment_id);
    setSelectedShipmentItems(items);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full px-32 py-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading supplier details...
          </div>
        </div>
      </div>
    );
  }

  // Show not found if supplier doesn't exist
  if (!supplierDetail) {
    // For now, let's show a fallback page instead of 404 to debug
    return (
      <div className="w-full px-32 py-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Supplier Details (ID: {id})
            </h1>
            <div className="text-yellow-600 dark:text-yellow-400 mb-4">
              ⚠️ Unable to load supplier from database. This might be because:
            </div>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>The backend server is not running</li>
              <li>Database connection issues</li>
              <li>Supplier with ID "{id}" doesn't exist in database</li>
              <li>GraphQL query is failing</li>
            </ul>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-neutral-700 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Debug info: supplierDetail = {JSON.stringify(supplierDetail)}, loading ={' '}
                {String(loading)}
              </p>
              {error && (
                <div className="mt-2">
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold">Error:</p>
                  <p className="text-xs text-red-600 dark:text-red-400">{error.message}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => (window.location.href = '/suppliers')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ← Back to Suppliers
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalValue = shipments.reduce((sum, shipment) => sum + shipment.invoice_amt, 0);
  const totalProducts = Array.from(new Set(shipmentItems.map((item) => item.product_id))).length;
  const avgOrderValue = shipments.length > 0 ? totalValue / shipments.length : 0;
  const lastOrderDate =
    shipments.length > 0
      ? shipments.sort(
          (a, b) => new Date(b.received_date).getTime() - new Date(a.received_date).getTime(),
        )[0].received_date
      : supplierDetail.created_date;

  return (
    <div className="w-full px-32 py-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      <div className="space-y-6">
        <SupplierDetailHeader
          supplier={supplierDetail}
          onCreateShipment={handleCreateShipment}
          onRefresh={refetchAll}
        />

        <SupplierStats
          totalShipments={shipments.length}
          totalValue={totalValue}
          totalProducts={totalProducts}
          avgOrderValue={avgOrderValue}
          lastOrderDate={lastOrderDate}
        />

        <SupplierShipments shipments={shipments} onViewShipment={handleViewShipment} />

        {/* Show shipment details when selected */}
        {selectedShipment && selectedShipmentItems.length > 0 && (
          <ShipmentItemsTable shipment={selectedShipment} items={selectedShipmentItems} />
        )}

        {/* Create Shipment Modal */}
        <CreateShipmentModal
          isOpen={isCreateShipmentOpen}
          onClose={() => setIsCreateShipmentOpen(false)}
          supplier={supplierDetail}
          onShipmentCreated={handleShipmentCreated}
        />
      </div>
    </div>
  );
}
