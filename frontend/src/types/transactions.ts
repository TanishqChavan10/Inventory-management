// Transactions page specific types and interfaces

// Import dependent types
import type { 
  TransactionDetail, 
  Customer, 
  Employee, 
  OrderItem 
} from './index';

// Transaction component props
export interface TransactionDetailHeaderProps {
  transaction: TransactionDetail;
  customer?: Customer;
  cashier: Employee;
}

export interface TransactionStatsProps {
  transaction: TransactionDetail;
  totalItems: number;
  uniqueProducts: number;
}

export interface TransactionItemsProps {
  orderItems: OrderItem[];
}

export interface TransactionPaymentProps {
  transaction: TransactionDetail;
  refundHistory?: Array<{
    refund_id: string;
    amount: number;
    date: string;
    reason: string;
    processed_by: string;
  }>;
}

// Re-export for convenience
export type { 
  TransactionDetail, 
  Customer, 
  Employee, 
  OrderItem 
};