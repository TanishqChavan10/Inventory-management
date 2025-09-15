'use client';

import { useMemo } from 'react';
import { TransactionDetailHeader } from '@/components/transactions/TransactionDetailHeader';
import { TransactionStats } from '@/components/transactions/TransactionStats';
import { TransactionItems } from '@/components/transactions/TransactionItems';
import { TransactionPayment } from '@/components/transactions/TransactionPayment';
import type { TransactionDetail, Customer, Employee, OrderItem } from '@/types';

// Enhanced mock data based on ER diagram
const mockTransactionData = {
  transaction: {
    transaction_id: 'TXN-001',
    customer_id: 'CUST-001',
    cashier_id: 'EMP-002',
    transaction_date: '2024-01-15T14:30:00Z',
    payment_method: 'Credit Card' as const,
    total_amt: 1416.90,
    payment_refno: 'REF-CC-12345',
    status: 'Completed' as const,
    tax_amount: 127.53,
    discount_amount: 75.50,
    subtotal: 1364.87,
    notes: 'Customer requested separate bags for frozen items.',
  } as TransactionDetail,
  customer: {
    customer_id: 'CUST-001',
    name: 'Alice Brown',
    phone_no: '+1-555-0123',
    email: 'alice.brown@email.com',
    address: '123 Main St, Anytown, AT 12345',
    loyalty_points: 1250,
    total_purchases: 15,
    created_date: '2023-06-15T10:00:00Z',
  } as Customer,
  cashier: {
    employee_id: 'EMP-002',
    name: 'John Smith',
    role: 'Cashier',
    contact: '+1-555-0198',
    department: 'Sales',
    hire_date: '2023-01-15T09:00:00Z',
  } as Employee,
  order_items: [
    {
      transaction_id: 'TXN-001',
      product_id: 'LAP-001',
      product_name: 'Dell XPS 13 Laptop',
      quantity: 1,
      unit_price: 1200.00,
      total_price: 1200.00,
      discount_applied: 50.00,
      category_name: 'Electronics',
    },
    {
      transaction_id: 'TXN-001',
      product_id: 'MOU-001',
      product_name: 'Wireless Mouse',
      quantity: 2,
      unit_price: 25.00,
      total_price: 50.00,
      discount_applied: 5.00,
      category_name: 'Electronics',
    },
    {
      transaction_id: 'TXN-001',
      product_id: 'LAP-002',
      product_name: 'HP Pavilion Laptop',
      quantity: 1,
      unit_price: 950.00,
      total_price: 950.00,
      discount_applied: 20.50,
      category_name: 'Electronics',
    },
    {
      transaction_id: 'TXN-001',
      product_id: 'MOU-002',
      product_name: 'Gaming Mouse',
      quantity: 1,
      unit_price: 45.00,
      total_price: 45.00,
      discount_applied: 0,
      category_name: 'Electronics',
    },
    {
      transaction_id: 'TXN-001',
      product_id: 'KEY-001',
      product_name: 'Mechanical Keyboard',
      quantity: 1,
      unit_price: 120.00,
      total_price: 120.00,
      discount_applied: 0,
      category_name: 'Electronics',
    },
  ] as OrderItem[],
  refundHistory: [
    {
      refund_id: 'REF-001',
      amount: 70.93,
      date: '2024-01-16T10:00:00Z',
      reason: 'Product defect - Gaming Mouse',
      processed_by: 'Lisa Wilson',
    },
  ],
};

export default function TransactionDetailsPage() {
  const { transaction, customer, cashier, order_items, refundHistory } = mockTransactionData;

  const stats = useMemo(() => {
    const totalItems = order_items.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueProducts = order_items.length;
    
    return {
      totalItems,
      uniqueProducts,
    };
  }, [order_items]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <TransactionDetailHeader 
          transaction={transaction}
          customer={customer}
          cashier={cashier}
        />

        {/* Stats */}
        <TransactionStats 
          transaction={transaction}
          totalItems={stats.totalItems}
          uniqueProducts={stats.uniqueProducts}
        />

        {/* Order Items */}
        <TransactionItems orderItems={order_items} />

        {/* Payment & Refund Information */}
        <TransactionPayment 
          transaction={transaction}
          refundHistory={refundHistory}
        />
      </div>
    </div>
  );
}
