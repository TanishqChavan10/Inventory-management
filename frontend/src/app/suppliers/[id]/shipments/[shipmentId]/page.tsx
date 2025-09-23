'use client';

import { useParams } from 'next/navigation';
import { ShipmentDetailHeader, ShipmentItemsTable } from '@/components/suppliers';
import type { Shipment, ShipmentItem } from '@/types';

// Mock data - replace with actual API calls
const mockShipment: Shipment = {
  shipment_id: 'SH-2024-001',
  supplier_id: 'TC-2024',
  ref_no: 'REF-TC-001',
  received_date: '2024-01-10',
  payment_mthd: 'Bank Transfer',
  invoice_amt: 45500,
  total_items: 25,
};

const mockShipmentItems: ShipmentItem[] = [
  {
    shipment_id: 'SH-2024-001',
    product_id: 'LAP-001',
    product_name: 'Dell XPS 13 Laptop',
    quantity_received: 10,
    unit_price: 1200.00,
    mfg_date: '2024-01-01',
    expiry_date: undefined,
  },
  {
    shipment_id: 'SH-2024-001',
    product_id: 'MOU-001',
    product_name: 'Wireless Mouse',
    quantity_received: 15,
    unit_price: 25.00,
    mfg_date: '2024-01-05',
    expiry_date: undefined,
  },
];

const mockSupplierName = 'TechCorp Solutions';

export default function ShipmentDetailPage() {
  const params = useParams();
  const supplierId = params.id as string;
  const shipmentId = params.shipmentId as string;

  // In a real app, you would fetch data based on supplierId and shipmentId
  // const { shipment, shipmentItems, supplierName } = useShipmentData(supplierId, shipmentId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ShipmentDetailHeader 
          shipment={mockShipment}
          supplierName={mockSupplierName}
          supplierId={supplierId}
        />
        
        <ShipmentItemsTable 
          shipmentItems={mockShipmentItems}
          shipmentId={shipmentId}
        />
      </div>
    </div>
  );
}