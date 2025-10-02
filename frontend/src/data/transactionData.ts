import type { Product, Employee, Customer } from '@/types';

// Mock Products Data
export const mockProducts: Product[] = [
  {
    product_id: 1,
    product_name: 'Dell XPS 13 Laptop',
    stock: 15,
    default_price: 89999.99,
    min_stock: 5,
    categories: [{ category_id: 1, name: 'Electronics' }],
  },
  {
    product_id: 2,
    product_name: 'Wireless Mouse',
    stock: 45,
    default_price: 1299.99,
    min_stock: 10,
    categories: [{ category_id: 1, name: 'Electronics' }],
  },
  {
    product_id: 3,
    product_name: 'Mechanical Keyboard',
    stock: 25,
    default_price: 4999.99,
    min_stock: 8,
    categories: [{ category_id: 1, name: 'Electronics' }],
  },
  {
    product_id: 4,
    product_name: 'HP Monitor 24 inch',
    stock: 12,
    default_price: 15999.99,
    min_stock: 3,
    categories: [{ category_id: 1, name: 'Electronics' }],
  },
  {
    product_id: 5,
    product_name: 'Office Chair Ergonomic',
    stock: 8,
    default_price: 12999.99,
    min_stock: 2,
    categories: [{ category_id: 2, name: 'Furniture' }],
  },
  {
    product_id: 6,
    product_name: 'USB-C Hub',
    stock: 30,
    default_price: 2499.99,
    min_stock: 15,
    categories: [{ category_id: 1, name: 'Electronics' }],
  },
  {
    product_id: 7,
    product_name: 'Blue Light Glasses',
    stock: 20,
    default_price: 999.99,
    min_stock: 10,
    categories: [{ category_id: 3, name: 'Accessories' }],
  },
  {
    product_id: 8,
    product_name: 'Notebook A4',
    stock: 100,
    default_price: 199.99,
    min_stock: 50,
    categories: [{ category_id: 4, name: 'Stationery' }],
  },
  {
    product_id: 9,
    product_name: 'Smartphone Stand',
    stock: 35,
    default_price: 799.99,
    min_stock: 15,
    categories: [{ category_id: 3, name: 'Accessories' }],
  },
  {
    product_id: 10,
    product_name: 'Coffee Mug',
    stock: 50,
    default_price: 299.99,
    min_stock: 20,
    categories: [{ category_id: 5, name: 'Home & Kitchen' }],
  },
];

// Mock Employees Data
export const mockEmployees: Employee[] = [
  {
    employee_id: 'EMP-001',
    name: 'John Smith',
    role: 'Cashier',
    contact: '+91 9876543210',
    department: 'Sales',
    hire_date: '2023-01-15',
  },
  {
    employee_id: 'EMP-002',
    name: 'Sarah Johnson',
    role: 'Senior Cashier',
    contact: '+91 9876543211',
    department: 'Sales',
    hire_date: '2022-08-20',
  },
  {
    employee_id: 'EMP-003',
    name: 'Mike Davis',
    role: 'Store Manager',
    contact: '+91 9876543212',
    department: 'Management',
    hire_date: '2021-06-10',
  },
  {
    employee_id: 'EMP-004',
    name: 'Emily Wilson',
    role: 'Sales Associate',
    contact: '+91 9876543213',
    department: 'Sales',
    hire_date: '2023-03-12',
  },
  {
    employee_id: 'EMP-005',
    name: 'David Brown',
    role: 'Cashier',
    contact: '+91 9876543214',
    department: 'Sales',
    hire_date: '2023-05-08',
  },
];

// Mock Customers Data
export const mockCustomers: Customer[] = [
  {
    customer_id: 'CUST-001',
    name: 'Alice Brown',
    phone_no: '+91 9123456789',
    email: 'alice.brown@email.com',
    address: '123 Main Street, Mumbai, MH 400001',
    loyalty_points: 150,
    total_purchases: 5,
    created_date: '2023-12-01T00:00:00Z',
  },
  {
    customer_id: 'CUST-002',
    name: 'Bob Wilson',
    phone_no: '+91 9123456790',
    email: 'bob.wilson@email.com',
    address: '456 Park Avenue, Delhi, DL 110001',
    loyalty_points: 75,
    total_purchases: 3,
    created_date: '2023-11-15T00:00:00Z',
  },
  {
    customer_id: 'CUST-003',
    name: 'Carol Davis',
    phone_no: '+91 9123456791',
    email: 'carol.davis@email.com',
    address: '789 Garden Road, Bangalore, KA 560001',
    loyalty_points: 220,
    total_purchases: 8,
    created_date: '2023-10-20T00:00:00Z',
  },
  {
    customer_id: 'CUST-004',
    name: 'Daniel Miller',
    phone_no: '+91 9123456792',
    email: 'daniel.miller@email.com',
    address: '321 Oak Street, Chennai, TN 600001',
    loyalty_points: 45,
    total_purchases: 2,
    created_date: '2024-01-10T00:00:00Z',
  },
  {
    customer_id: 'CUST-005',
    name: 'Eva Garcia',
    phone_no: '+91 9123456793',
    email: 'eva.garcia@email.com',
    address: '654 Pine Lane, Pune, MH 411001',
    loyalty_points: 180,
    total_purchases: 6,
    created_date: '2023-09-08T00:00:00Z',
  },
];

// Helper function to generate transaction ID
export const generateTransactionId = (): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TXN-${timestamp}-${randomSuffix}`;
};

// Helper function to generate payment reference number
export const generatePaymentRefNo = (paymentMethod: string): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  switch (paymentMethod) {
    case 'Credit Card':
      return `CC-${randomSuffix}`;
    case 'Debit Card':
      return `DC-${randomSuffix}`;
    case 'Mobile Payment':
      return `MP-${randomSuffix}`;
    case 'Cash':
      return `CASH-${randomSuffix}`;
    default:
      return `REF-${randomSuffix}`;
  }
};