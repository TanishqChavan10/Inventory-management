export type TransactionItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  available_stock: number;
};

export type CreateTransactionInput = {
  transaction_id: string;
  payment_method: string;
  customer_name?: string;
  customer_phone?: string;
  employee_id: string;
  payment_refno?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amt: number;
  items: {
    product_id: number;
    quantity: number;
    unit_price: number;
    discount: number;
  }[];
  new_customer?: {
    name: string;
    phone_no?: string;
  };
};