'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Receipt, User, Package, UserCheck } from 'lucide-react';

// --- Mock Data ---
const mockTransactionData = {
  transaction: {
    transaction_id: 'T001',
    cart_id: 'CART-123',
    transaction_date: '2025-08-15',
    payment_method: 'Credit Card',
    payment_refno: 'REF-CC-12345',
    cashier_id: 'EMP-002',
    customer_id: 'CUST-001',
    subtotal: 0,
    tax_rate: 0.18,
    total_amt: 0,
  },
  customer: {
    customer_id: 'CUST-001',
    name: 'Rohan Sharma',
    phone_no: '+91 98765 43210',
  },
  employee: {
    employee_id: 'EMP-002',
    name: 'Priya Singh',
  },
  order_items: [
    {
      order_item_id: 'OI-004',
      product_id: 'CHPS01',
      product_name: 'Classic Salted Chips',
      product_category: 'Snacks',
      quantity: 5,
      unit_price: 20,
    },
    {
      order_item_id: 'OI-005',
      product_id: 'SODA01',
      product_name: 'Cola 500ml',
      product_category: 'Beverages',
      quantity: 3,
      unit_price: 40,
    },
    {
      order_item_id: 'OI-001',
      product_id: 'OIL001',
      product_name: 'Sunflower Oil',
      product_category: 'Grocery',
      quantity: 1,
      unit_price: 120,
    },
    {
      order_item_id: 'OI-008',
      product_id: 'RICE01',
      product_name: 'Basmati Rice 1kg',
      product_category: 'Grocery',
      quantity: 2,
      unit_price: 150,
    },
    {
      order_item_id: 'OI-002',
      product_id: 'MILK001',
      product_name: 'Milk',
      product_category: 'Dairy',
      quantity: 2,
      unit_price: 45,
    },
    {
      order_item_id: 'OI-003',
      product_id: 'BRW001',
      product_name: 'Bread - Whole Wheat',
      product_category: 'Bakery',
      quantity: 1,
      unit_price: 35.5,
    },
    {
      order_item_id: 'OI-006',
      product_id: 'ICEC01',
      product_name: 'Vanilla Ice Cream',
      product_category: 'Frozen',
      quantity: 1,
      unit_price: 250,
    },
    {
      order_item_id: 'OI-007',
      product_id: 'SOAP01',
      product_name: 'Luxury Bath Soap',
      product_category: 'Personal Care',
      quantity: 4,
      unit_price: 55,
    },
  ],
};

// --- Derived values ---
const subtotal = mockTransactionData.order_items.reduce(
  (acc, item) => acc + item.quantity * item.unit_price,
  0,
);
const taxes = subtotal * mockTransactionData.transaction.tax_rate;
const total_amt = subtotal + taxes;
mockTransactionData.transaction.subtotal = subtotal;
mockTransactionData.transaction.total_amt = total_amt;

export default function TransactionDetailsPage() {
  const sortedOrderItems = useMemo(() => {
    return [...mockTransactionData.order_items].sort((a, b) =>
      a.product_category.localeCompare(b.product_category),
    );
  }, []);

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <header className="mb-10 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Transaction Details</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Detailed record for transaction{' '}
          <span className="font-semibold">{mockTransactionData.transaction.transaction_id}</span>
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" /> Transaction
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <strong>ID:</strong> {mockTransactionData.transaction.transaction_id}
              </p>
              <p>
                <strong>Cart ID:</strong> {mockTransactionData.transaction.cart_id}
              </p>
              <p>
                <strong>Date:</strong> {mockTransactionData.transaction.transaction_date}
              </p>
              <p>
                <strong>Payment Method:</strong> {mockTransactionData.transaction.payment_method}
              </p>
              <p>
                <strong>Reference No:</strong>{' '}
                {mockTransactionData.transaction.payment_refno || 'N/A'}
              </p>
              <hr className="my-2 border-dashed" />
              <p>
                <strong>Subtotal:</strong> ₹{mockTransactionData.transaction.subtotal.toFixed(2)}
              </p>
              <p>
                <strong>Taxes (18%):</strong> ₹{taxes.toFixed(2)}
              </p>
              <p className="font-bold text-lg">
                Grand Total: ₹{mockTransactionData.transaction.total_amt.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <strong>ID:</strong> {mockTransactionData.customer.customer_id}
              </p>
              <p>
                <strong>Name:</strong> {mockTransactionData.customer.name}
              </p>
              <p>
                <strong>Phone:</strong> {mockTransactionData.customer.phone_no}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" /> Employee (Cashier)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <strong>ID:</strong> {mockTransactionData.employee.employee_id}
              </p>
              <p>
                <strong>Name:</strong> {mockTransactionData.employee.name}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Purchased Products Table */}
        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" /> Purchased Products
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              A detailed list of all items included in this transaction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="relative max-h-[320px] overflow-y-auto no-scrollbar">
                <Table className="min-w-full border-collapse">
                  <TableHeader className="sticky top-0 bg-gray-100 dark:bg-neutral-900 z-20 shadow-sm">
                    <TableRow>
                      <TableHead className="font-semibold">Product ID</TableHead>
                      <TableHead className="font-semibold">Product Name</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="text-center font-semibold">Quantity</TableHead>
                      <TableHead className="text-right font-semibold">Unit Price</TableHead>
                      <TableHead className="text-right font-semibold">Line Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedOrderItems.map((item) => (
                      <TableRow
                        key={item.order_item_id}
                        className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                      >
                        <TableCell className="font-medium">{item.product_id}</TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.product_category}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.unit_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{(item.quantity * item.unit_price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-gray-50 dark:bg-neutral-800">
                      <TableCell colSpan={5} className="text-right font-bold">
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ₹{mockTransactionData.transaction.subtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
