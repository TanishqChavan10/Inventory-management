import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_TRANSACTIONS, 
  GET_TRANSACTION, 
  CREATE_TRANSACTION
} from '@/app/graphql/transactions';
import { GET_EMPLOYEES, GET_CUSTOMERS } from '@/app/graphql/users';

interface Transaction {
  transaction_id: string;
  transaction_date: string;
  total_amount: number;
  payment_method: string;
  payment_refno?: string;
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
    discount: number;
    total_price: number;
    product_name: string;
  }>;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: string;
  customer_id?: string;
}

export function useTransactions(filters: TransactionFilters = {}) {
  const { 
    data, 
    loading, 
    error, 
    refetch
  } = useQuery(GET_TRANSACTIONS, {
    variables: { 
      page: filters.page || 1,
      limit: filters.limit || 10,
      status: filters.status || null,
      customer_id: filters.customer_id || null
    },
    fetchPolicy: 'cache-and-network',
  });

  // Pass through the data with minimal transformation
  const transformedTransactions = data?.transactions || [];

  return {
    transactions: transformedTransactions,
    loading,
    error,
    refetch,
  };
}

export function useTransactionDetails(transactionId: string) {
  const { 
    data, 
    loading, 
    error 
  } = useQuery(GET_TRANSACTION, {
    variables: { 
      transaction_id: transactionId,
      includeCustomerDetails: false, // We're using the customer info directly from the transaction
      includeEmployeeDetails: false  // We're using the employee info directly from the transaction
    },
    skip: !transactionId,
  });

  // Process the fetched transaction data to match our expected format
  const transaction = data?.transaction 
    ? {
        transaction_id: data.transaction.transaction_id,
        transaction_date: data.transaction.transaction_date,
        payment_method: data.transaction.payment_method,
        total_amt: data.transaction.total_amount,
        payment_refno: data.transaction.payment_refno,
        status: data.transaction.status || 'Completed',
        customer_id: data.transaction.customer_id,
        cashier_id: data.transaction.employee_id,
        tax_amount: data.transaction.tax_amount || 0,
        discount_amount: data.transaction.discount_amount || 0,
        subtotal: data.transaction.total_amount - (data.transaction.tax_amount || 0),
      }
    : null;

  // Transform customer data
  const customer = data?.customer 
    ? {
        customer_id: data.customer.customer_id,
        name: data.customer.name,
        phone_number: data.customer.phone_number,
        created_date: data.customer.created_date,
      }
    : data?.transaction?.customer_id
      ? {
          customer_id: data.transaction.customer_id,
          name: data.transaction.customer_name || 'Customer',
          created_date: data.transaction.transaction_date,
        }
      : null;

  // Transform employee/cashier data
  const cashier = data?.employee 
    ? {
        employee_id: data.employee.employee_id,
        name: data.employee.name,
        role: 'Cashier',
      }
    : data?.transaction?.employee_id
      ? {
          employee_id: data.transaction.employee_id,
          name: data.transaction.employee_name || 'Employee',
          role: 'Cashier',
        }
      : null;

  // Transform order items
  const orderItems = data?.transaction?.items?.map((item: any) => ({
    transaction_id: item.transaction_id,
    product_id: item.product_id.toString(),
    product_name: item.product_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    discount: item.discount,
    category_name: item.category_name || 'Uncategorized',
  })) || [];

  return {
    transaction,
    customer,
    cashier,
    orderItems,
    loading,
    error,
  };
}

export function useCreateTransaction() {
  const [createTransaction, { data, loading, error }] = useMutation(CREATE_TRANSACTION);

  return {
    createTransaction,
    createdTransaction: data?.createTransaction,
    loading,
    error,
  };
}

export function useEmployees() {
  const { 
    data, 
    loading, 
    error 
  } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'network-only', // Force network request to ensure fresh data
    notifyOnNetworkStatusChange: true, // Get loading status on refetch
    onCompleted: (data) => {
      console.log("Successfully fetched employees:", data?.employees || []);
    },
    onError: (error) => {
      console.error("Error fetching employees:", error.message);
      console.error("GraphQL error details:", error.graphQLErrors);
      console.error("Network error details:", error.networkError);
    }
  });

  // Return the actual employees from the database
  return {
    employees: data?.employees || [],
    loading,
    error,
  };
}

export function useCustomers() {
  const { 
    data, 
    loading, 
    error 
  } = useQuery(GET_CUSTOMERS);

  return {
    customers: data?.customers || [],
    loading,
    error,
  };
}