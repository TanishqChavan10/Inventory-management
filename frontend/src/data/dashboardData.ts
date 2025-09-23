// Dashboard data based on ER Diagram entities

// Types
export interface StatDetails {
  title: string;
  columns: string[];
  data: (string | number)[][];
}

export interface StatData {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
  details: StatDetails;
}

export interface CategoryRenvenue {
  category: string;
  revenue: number;
  percentage: number;
}

export interface LowStockItem {
  name: string;
  category: string;
  stock: number;
  total: number;
  daysLeft: number;
}

// Inventory page specific stats
export interface InventoryStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStock: number;
  totalValue: string;
}

export const inventoryStats: InventoryStats = {
  totalProducts: 8,
  lowStockItems: 3,
  outOfStock: 0,
  totalValue: '$42,420.6',
};

// Mock inventory data that matches the screenshot for display purposes
export const mockInventoryData = [
  {
    id: '1',
    name: 'Laptop Computer',
    category: 'Electronics',
    price: 999.99,
    stock: 25,
    minStock: 10,
    status: 'In Stock',
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 29.99,
    stock: 5,
    minStock: 20,
    status: 'Low Stock',
  },
  {
    id: '3',
    name: 'Office Chair',
    category: 'Office Supplies',
    price: 199.99,
    stock: 45,
    minStock: 15,
    status: 'In Stock',
  },
  {
    id: '4',
    name: 'Coffee Beans 1kg',
    category: 'Food & Beverages',
    price: 24.99,
    stock: 8,
    minStock: 30,
    status: 'Low Stock',
  },
  {
    id: '5',
    name: 'Printer Paper A4',
    category: 'Office Supplies',
    price: 12.99,
    stock: 12,
    minStock: 50,
    status: 'Low Stock',
  },
  {
    id: '6',
    name: 'Desk Lamp',
    category: 'Electronics',
    price: 49.99,
    stock: 75,
    minStock: 20,
    status: 'In Stock',
  },
  {
    id: '7',
    name: 'Water Bottle',
    category: 'Home & Garden',
    price: 15.99,
    stock: 120,
    minStock: 30,
    status: 'In Stock',
  },
  {
    id: '8',
    name: 'Notebook Set',
    category: 'Office Supplies',
    price: 8.99,
    stock: 250,
    minStock: 50,
    status: 'In Stock',
  },
];

// Dashboard stats following ER diagram structure
export const statsData: StatData[] = [
  {
    title: 'Total Products',
    value: 1247,
    icon: 'box',
    description: 'from last month',
    details: {
      title: 'Product Inventory',
      columns: ['product_ID', 'name', 'default_price', 'category_id'],
      data: [
        ['1', 'Sunflower Oil', '120.00', '1'],
        ['2', 'Toothpaste', '8.50', '2'],
        ['3', 'Bread - Whole Wheat', '3.50', '1'],
        ['4', 'Bottled Water', '48.00', '3'],
        ['5', 'Shampoo', '15.00', '2'],
      ],
    },
  },
  {
    title: 'Near Expiry Products',
    value: 15,
    icon: 'clock',
    description: 'Products expiring soon',
    details: {
      title: 'Products Near Expiry Date',
      columns: ['product_ID', 'name', 'expiry_date', 'days_left', 'quantity'],
      data: [
        ['2', 'Milk - Fresh', '2025-09-26', '3', '12'],
        ['3', 'Bread - Whole Wheat', '2025-09-25', '2', '8'],
        ['15', 'Yogurt - Greek', '2025-09-28', '5', '15'],
        ['22', 'Fresh Cheese', '2025-09-27', '4', '6'],
        ['18', 'Organic Salad', '2025-09-24', '1', '10'],
      ],
    },
  },
  {
    title: 'Total Revenue',
    value: '$45,678.90',
    icon: 'dollar-sign',
    description: 'from last month',
    details: {
      title: 'Sales Revenue',
      columns: ['transaction_id', 'transaction_date', 'total_amt', 'payment_method'],
      data: [
        ['1001', '2025-09-15', '1800.00', 'Credit Card'],
        ['1002', '2025-09-15', '450.50', 'Cash'],
        ['1003', '2025-09-14', '320.75', 'Debit Card'],
        ['1004', '2025-09-14', '180.25', 'Credit Card'],
      ],
    },
  },
  {
    title: 'Expired Products',
    value: 8,
    icon: 'x-circle',
    description: 'Items past expiry date',
    details: {
      title: 'Expired Inventory',
      columns: ['product_ID', 'name', 'expiry_date', 'quantity', 'batch_no'],
      data: [
        ['6', 'Milk', '2025-09-10', '5', 'BATCH001'],
        ['7', 'Yogurt', '2025-09-12', '3', 'BATCH002'],
        ['8', 'Fresh Bread', '2025-09-14', '2', 'BATCH003'],
        ['9', 'Cheese', '2025-09-11', '1', 'BATCH004'],
      ],
    },
  },
];

// Recent activity with proper entity references
export const revenueByCategory: CategoryRenvenue[] = [
  { category: 'Electronics', revenue: 89450.75, percentage: 35.2 },
  { category: 'Food & Beverages', revenue: 45780.30, percentage: 18.0 },
  { category: 'Office Supplies', revenue: 34580.20, percentage: 13.6 },
  { category: 'Clothing', revenue: 28340.55, percentage: 11.1 },
  { category: 'Health & Beauty', revenue: 22150.40, percentage: 8.7 },
  { category: 'Home & Garden', revenue: 18960.25, percentage: 7.5 },
  { category: 'Sports & Outdoors', revenue: 8720.15, percentage: 3.4 },
  { category: 'Automotive', revenue: 5630.40, percentage: 2.2 },
  { category: 'Books & Media', revenue: 835.00, percentage: 0.3 },
];

// Low stock items matching ER diagram
export const lowStockItems: LowStockItem[] = [
  {
    name: 'Wireless Mouse',
    category: 'Electronics',
    stock: 5,
    total: 20,
    daysLeft: 3,
  },
  {
    name: 'Printer Paper A4',
    category: 'Office Supplies',
    stock: 12,
    total: 50,
    daysLeft: 7,
  },
  {
    name: 'Coffee Beans 1kg',
    category: 'Food & Beverages',
    stock: 8,
    total: 30,
    daysLeft: 5,
  },
  {
    name: 'USB Cables',
    category: 'Electronics',
    stock: 3,
    total: 25,
    daysLeft: 2,
  },
  {
    name: 'Notebook A5',
    category: 'Office Supplies',
    stock: 7,
    total: 40,
    daysLeft: 4,
  },
  {
    name: 'Hand Sanitizer',
    category: 'Health & Safety',
    stock: 4,
    total: 20,
    daysLeft: 3,
  },
];
