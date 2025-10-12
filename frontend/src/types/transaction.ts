export type OrderItem = {
  transaction_id: string;
  product_id: string | number;
  product_name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  discount_applied?: number;
  category_name?: string;
};

export type Transaction = {
  id: string;
  date: string;
  customer: string;
  total_amt: number;
  payment_method: string;
  status: string;
  items: OrderItem[];
  employee_id: string;
  payment_refno?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
};

export type TransactionItemsProps = {
  orderItems: OrderItem[];
};

export type TransactionStatsProps = {
  transaction: Transaction;
  totalItems: number;
  uniqueProducts: number;
};