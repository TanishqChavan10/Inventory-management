import { notFound } from 'next/navigation';

type Supplier = {
  id: string;
  company: string;
  email: string;
  phone: string;
  category: string;
};

type ShipmentItem = {
  shipment_id: string;
  product_id: string;
  product_name: string;
  quantity_received: number;
  unit_price: number;
  mfg_date?: string;
  expiry_date?: string;
};

type Shipment = {
  shipment_id: string;
  supplier_id: string;
  ref_no: string;
  payment_status: 'Pending' | 'Paid' | 'Failed';
  payment_method: string;
  invoice_amt: number;
  received_date: string;
};

const suppliers: Supplier[] = [
  {
    id: 'S001',
    company: 'FreshFarms Pvt Ltd',
    email: 'aarav@freshfarms.com',
    phone: '+91 99876 12345',
    category: 'Groceries',
  },
  {
    id: 'S002',
    company: 'DairyCo',
    email: 'meera@dairyco.in',
    phone: '+91 88990 56744',
    category: 'Dairy',
  },
  {
    id: 'S003',
    company: 'CleanPro Suppliers',
    email: 'sonal@cleanpro.com',
    phone: '+91 90221 44567',
    category: 'Cleaning Supplies',
  },
];

const shipmentItemsBySupplier: Record<string, ShipmentItem[]> = {
  S001: [
    {
      shipment_id: 'SH1001',
      product_id: 'P101',
      product_name: 'Organic Tomatoes',
      quantity_received: 120,
      unit_price: 18,
      mfg_date: '2025-07-10',
      expiry_date: '2025-09-10',
    },
    {
      shipment_id: 'SH1002',
      product_id: 'P102',
      product_name: 'Alphonso Mangoes',
      quantity_received: 80,
      unit_price: 25,
      mfg_date: '2025-07-15',
      expiry_date: '2025-09-20',
    },
  ],
  S002: [
    {
      shipment_id: 'SH2001',
      product_id: 'P201',
      product_name: 'Whole Milk 1L',
      quantity_received: 60,
      unit_price: 42,
      mfg_date: '2025-07-05',
      expiry_date: '2025-08-15',
    },
  ],
};

const shipmentsBySupplier: Record<string, Shipment[]> = {
  S001: [
    {
      shipment_id: 'SH1001',
      supplier_id: 'S001',
      ref_no: 'RF-8765',
      payment_status: 'Paid',
      payment_method: 'UPI',
      invoice_amt: 2160,
      received_date: '2025-07-18',
    },
    {
      shipment_id: 'SH1002',
      supplier_id: 'S001',
      ref_no: 'RF-8821',
      payment_status: 'Pending',
      payment_method: 'Bank Transfer',
      invoice_amt: 2000,
      received_date: '2025-07-25',
    },
  ],
  S002: [
    {
      shipment_id: 'SH2001',
      supplier_id: 'S002',
      ref_no: 'RF-9051',
      payment_status: 'Paid',
      payment_method: 'Card',
      invoice_amt: 2520,
      received_date: '2025-07-20',
    },
  ],
};

type Params = {
  params: { id: string };
};

export default function SupplierDetailsPage({ params }: Params) {
  const { id } = params;

  const supplier = suppliers.find((s) => s.id === id);
  if (!supplier) return notFound();

  const items = shipmentItemsBySupplier[id] ?? [];
  const shipments = shipmentsBySupplier[id] ?? [];

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-neutral-900 text-black dark:text-white min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight">Supplier Details</h1>
        </div>

        {/* Supplier core info */}
        <section className="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Supplier</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <Info label="Supplier ID" value={supplier.id} />
            <Info label="Company/Name" value={supplier.company} />
            <Info label="Email" value={supplier.email} />
            <Info label="Phone" value={supplier.phone} />
            <Info label="Category" value={supplier.category} />
          </div>
        </section>

        {/* Shipment Items */}
        <section className="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Shipment Items</h2>
          {items.length === 0 ? (
            <Empty text="No shipment items found." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full text-sm border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-neutral-800">
                  <tr>
                    <Th>Shipment ID</Th>
                    <Th>Product ID</Th>
                    <Th>Product Name</Th>
                    <Th>Quantity</Th>
                    <Th>Unit Price</Th>
                    <Th>Mfg Date</Th>
                    <Th>Expiry Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr
                      key={`${it.shipment_id}-${it.product_id}`}
                      className="border-t border-gray-200 dark:border-neutral-700"
                    >
                      <Td>{it.shipment_id}</Td>
                      <Td>{it.product_id}</Td>
                      <Td>{it.product_name}</Td>
                      <Td>{it.quantity_received}</Td>
                      <Td>₹{it.unit_price.toLocaleString()}</Td>
                      <Td>{it.mfg_date ?? '-'}</Td>
                      <Td>{it.expiry_date ?? '-'}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Shipments */}
        <section className="rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Shipments</h2>
          {shipments.length === 0 ? (
            <Empty text="No shipments found." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full text-sm border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-neutral-800">
                  <tr>
                    <Th>Shipment ID</Th>
                    <Th>Supplier ID</Th>
                    <Th>Ref No</Th>
                    <Th>Payment Status</Th>
                    <Th>Payment Method</Th>
                    <Th>Invoice Amt</Th>
                    <Th>Received Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((sh) => (
                    <tr
                      key={sh.shipment_id}
                      className="border-t border-gray-200 dark:border-neutral-700"
                    >
                      <Td>{sh.shipment_id}</Td>
                      <Td>{sh.supplier_id}</Td>
                      <Td>{sh.ref_no}</Td>
                      <Td>
                        <span
                          className={
                            sh.payment_status === 'Paid'
                              ? 'text-green-600'
                              : sh.payment_status === 'Pending'
                                ? 'text-amber-600'
                                : 'text-red-600'
                          }
                        >
                          {sh.payment_status}
                        </span>
                      </Td>
                      <Td>{sh.payment_method}</Td>
                      <Td>₹{sh.invoice_amt.toLocaleString()}</Td>
                      <Td>{sh.received_date}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
      <div className="text-xs uppercase text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-gray-500 dark:text-gray-400 text-sm">{text}</div>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 text-left font-semibold">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2">{children}</td>;
}
