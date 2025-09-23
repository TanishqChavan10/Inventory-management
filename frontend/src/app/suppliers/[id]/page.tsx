'use client';

import { notFound } from 'next/navigation';
import { toast } from 'sonner';

// --- Component Imports ---
import {
  SupplierDetailHeader,
  SupplierStats,
  SupplierShipments,
  SupplierProducts,
} from '@/components/suppliers';

// --- Types ---
import type { SupplierDetail, Shipment, ShipmentItem } from '@/types';

// Enhanced sample data based on ER diagram
const supplierDetails: Record<string, SupplierDetail> = {
  '1': {
    supplier_id: '1',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone_no: '+1-555-0101',
    address: '123 Tech Street, Silicon Valley, CA 94301',
    contact_person: 'John Smith',
    registration_number: 'REG-TC-2020-001',
    tax_id: 'TAX-TC-789123',
    created_date: '2020-01-15',
    status: 'Active',
  },
  '2': {
    supplier_id: '2',
    name: 'Fashion Forward Ltd',
    email: 'orders@fashionforward.com',
    phone_no: '+1-555-0102',
    address: '456 Fashion Ave, New York, NY 10001',
    contact_person: 'Sarah Johnson',
    registration_number: 'REG-FF-2019-002',
    tax_id: 'TAX-FF-456789',
    created_date: '2019-06-10',
    status: 'Active',
  },
  '3': {
    supplier_id: '3',
    name: 'Fresh Foods Inc',
    email: 'supply@freshfoods.com',
    phone_no: '+1-555-0103',
    address: '789 Fresh Market St, Portland, OR 97201',
    contact_person: 'Mike Wilson',
    registration_number: 'REG-FF-2021-003',
    tax_id: 'TAX-FF-123456',
    created_date: '2021-03-22',
    status: 'Active',
  },
  '4': {
    supplier_id: '4',
    name: 'Office Pro Supply',
    email: 'sales@officepro.com',
    phone_no: '+1-555-0104',
    address: '321 Office Plaza, Dallas, TX 75201',
    contact_person: 'Lisa Brown',
    registration_number: 'REG-OP-2018-004',
    tax_id: 'TAX-OP-987654',
    created_date: '2018-11-05',
    status: 'Inactive',
  },
};

const shipmentsBySupplier: Record<string, Shipment[]> = {
  '1': [
    {
      shipment_id: 'SH-2024-001',
      supplier_id: '1',
      ref_no: 'REF-TC-001',
      received_date: '2024-01-10',
      payment_status: 'Paid',
      payment_mthd: 'Bank Transfer',
      invoice_amt: 45500,
      total_items: 25,
    },
    {
      shipment_id: 'SH-2024-002',
      supplier_id: '1',
      ref_no: 'REF-TC-002',
      received_date: '2024-01-25',
      payment_status: 'Paid',
      payment_mthd: 'Credit Card',
      invoice_amt: 32500,
      total_items: 18,
    },
    {
      shipment_id: 'SH-2024-003',
      supplier_id: '1',
      ref_no: 'REF-TC-003',
      received_date: '2024-02-08',
      payment_status: 'Pending',
      payment_mthd: 'Bank Transfer',
      invoice_amt: 47500,
      total_items: 22,
    },
  ],
  '2': [
    {
      shipment_id: 'SH-2024-004',
      supplier_id: '2',
      ref_no: 'REF-FF-001',
      received_date: '2024-01-12',
      payment_status: 'Paid',
      payment_mthd: 'Credit Card',
      invoice_amt: 25200,
      total_items: 15,
    },
    {
      shipment_id: 'SH-2024-005',
      supplier_id: '2',
      ref_no: 'REF-FF-002',
      received_date: '2024-01-28',
      payment_status: 'Paid',
      payment_mthd: 'PayPal',
      invoice_amt: 34800,
      total_items: 20,
    },
  ],
};

const shipmentItemsBySupplier: Record<string, ShipmentItem[]> = {
  '1': [
    {
      shipment_id: 'SH-2024-001',
      product_id: 'LAP-001',
      product_name: 'Dell XPS 13 Laptop',
      quantity_received: 10,
      unit_price: 1200,
      batch_number: 'BATCH-LAP-001',
      mfg_date: '2024-01-01',
    },
    {
      shipment_id: 'SH-2024-001',
      product_id: 'MOU-001',
      product_name: 'Wireless Mouse',
      quantity_received: 15,
      unit_price: 25,
      batch_number: 'BATCH-MOU-001',
      mfg_date: '2024-01-05',
    },
    {
      shipment_id: 'SH-2024-002',
      product_id: 'LAP-002',
      product_name: 'HP Pavilion Laptop',
      quantity_received: 8,
      unit_price: 950,
      batch_number: 'BATCH-LAP-002',
      mfg_date: '2024-01-20',
    },
    {
      shipment_id: 'SH-2024-002',
      product_id: 'MOU-002',
      product_name: 'Gaming Mouse',
      quantity_received: 10,
      unit_price: 45,
      batch_number: 'BATCH-MOU-002',
      mfg_date: '2024-01-22',
    },
  ],
  '2': [
    {
      shipment_id: 'SH-2024-004',
      product_id: 'CLO-001',
      product_name: 'Cotton T-Shirt',
      quantity_received: 50,
      unit_price: 25,
      batch_number: 'BATCH-CLO-001',
      mfg_date: '2024-01-10',
    },
    {
      shipment_id: 'SH-2024-004',
      product_id: 'ACC-001',
      product_name: 'Leather Belt',
      quantity_received: 20,
      unit_price: 35,
      batch_number: 'BATCH-ACC-001',
      mfg_date: '2024-01-08',
    },
  ],
};

type Params = {
  params: { id: string };
};

export default function SupplierDetailsPage({ params }: Params) {
  const { id } = params;

  const supplier = supplierDetails[id];
  if (!supplier) return notFound();

  const shipments = shipmentsBySupplier[id] || [];
  const shipmentItems = shipmentItemsBySupplier[id] || [];

  // Calculate statistics
  const totalValue = shipments.reduce((sum, shipment) => sum + shipment.invoice_amt, 0);
  const totalProducts = Array.from(new Set(shipmentItems.map((item) => item.product_id))).length;
  const avgOrderValue = shipments.length > 0 ? totalValue / shipments.length : 0;
  const lastOrderDate =
    shipments.length > 0
      ? shipments.sort(
          (a, b) => new Date(b.received_date).getTime() - new Date(a.received_date).getTime(),
        )[0].received_date
      : supplier.created_date;

  const handleViewShipment = (shipment: Shipment) => {
    toast.info(`Viewing details for shipment: ${shipment.shipment_id}`);
    // In a real app, this would navigate to a shipment detail page
  };

  return (
    <div className="w-full px-32 py-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      <div className="space-y-6">
        <SupplierDetailHeader supplier={supplier} />

        <SupplierStats
          totalShipments={shipments.length}
          totalValue={totalValue}
          totalProducts={totalProducts}
          avgOrderValue={avgOrderValue}
          lastOrderDate={lastOrderDate}
        />

        <SupplierShipments shipments={shipments} onViewShipment={handleViewShipment} />

        <SupplierProducts shipmentItems={shipmentItems} />
      </div>
    </div>
  );
}
