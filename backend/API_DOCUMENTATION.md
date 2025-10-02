# Inventory Management Backend API

This backend provides GraphQL APIs for Dashboard, Inventory, and Supplier management features.

## Features Implemented

### 🏠 Dashboard
- **Stats Overview**: Get comprehensive dashboard statistics
- **Recent Activities**: Track recent transactions and system activities  
- **Low Stock Alerts**: Monitor products with low inventory levels

### 📦 Inventory Management
- **Product Management**: Full CRUD operations for products
- **Category Management**: Organize products by categories
- **Low Stock Monitoring**: Track products below minimum stock levels
- **Advanced Filtering**: Filter products by category, search, pagination

### 🏢 Supplier Management
- **Supplier Directory**: Complete supplier information management
- **Supplier Statistics**: Track orders, total value, last order dates
- **Shipment Tracking**: Monitor incoming shipments and payments
- **Active/Inactive Status**: Manage supplier statuses

## Database Schema

The backend implements a comprehensive ER diagram with the following entities:

### Core Entities
- **Products**: Main inventory items with categories and stock levels
- **Categories**: Product categorization system
- **Suppliers**: Supplier information and contact details
- **Customers**: Customer information for transactions
- **Employees**: Staff management (cashiers, managers, admins)

### Transaction Entities  
- **Transactions**: Sales transactions with payment details
- **Order Items**: Individual items in each transaction
- **Shipments**: Incoming inventory from suppliers
- **Shipment Items**: Individual items in each shipment

## GraphQL API Endpoints

### Dashboard Queries
```graphql
# Get dashboard statistics
query {
  dashboardStats {
    totalProducts
    lowStockAlerts
    totalRevenue
    activeSuppliers
    recentTransactions
    expiredProducts
  }
}

# Get recent activities
query {
  recentActivities {
    id
    type
    message
    time
    badge
  }
}

# Get low stock items
query {
  lowStockItems {
    product_id
    name
    category
    current_stock
    min_stock
    days_left
  }
}
```

### Product Queries
```graphql
# Get all products with filtering
query {
  products(category_id: "1", page: 1, limit: 10) {
    product_ID
    sku
    name
    category_id
    quantity
    min_stock_level
    default_price
    description
    status
    category {
      name
    }
  }
}

# Get low stock products
query {
  lowStockProducts {
    product_ID
    name
    quantity
    min_stock_level
  }
}

# Get products by category
query {
  productsByCategory(category_id: "1") {
    product_ID
    name
    quantity
    default_price
  }
}
```

### Supplier Queries
```graphql
# Get all suppliers with statistics
query {
  suppliers {
    supplier_id
    name
    email
    phone_no
    status
    total_orders
    total_value
    last_order_date
  }
}

# Get specific supplier details
query {
  supplier(id: "1") {
    supplier_id
    name
    email
    phone_no
    address
    contact_person
    total_orders
    total_value
  }
}
```

### Category Queries
```graphql
# Get all categories
query {
  categories {
    category_id
    name
    description
  }
}
```

### Mutations

#### Product Mutations
```graphql
# Create product
mutation {
  addProduct(createProductInput: {
    sku: "LAPTOP002"
    name: "Gaming Laptop"
    category_id: "1"
    quantity: 15
    min_stock_level: 5
    default_price: 1299.99
    description: "High-end gaming laptop"
    status: "Active"
  }) {
    product_ID
    name
  }
}

# Update product
mutation {
  updateProduct(updateProductInput: {
    product_ID: "1"
    quantity: 30
    default_price: 999.99
  }) {
    product_ID
    name
    quantity
  }
}
```

#### Supplier Mutations
```graphql
# Create supplier
mutation {
  createSupplier(createSupplierInput: {
    name: "New Tech Supplier"
    email: "contact@newtech.com"
    phone_no: "+1-555-0199"
    address: "999 Innovation Dr"
    status: "Active"
  }) {
    supplier_id
    name
  }
}

# Update supplier
mutation {
  updateSupplier(updateSupplierInput: {
    supplier_id: "1"
    name: "Updated Supplier Name"
    status: "Inactive"
  }) {
    supplier_id
    name
    status
  }
}
```

## Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup
Make sure PostgreSQL is running with these settings:
- Host: localhost
- Port: 5432
- Username: postgres
- Password: root
- Database: inventory

### 3. Seed Database
```bash
# Start the server first
npm run start:dev

# Then seed the database via HTTP POST
curl -X POST http://localhost:3000/seed
```

### 4. Access GraphQL Playground
Visit: `http://localhost:3000/api/graphql`

## Sample Data

The seed script creates:
- **5 Categories**: Electronics, Office Supplies, Food & Beverages, Home & Garden, Personal Care
- **8 Products**: Including laptops, office supplies, consumables with realistic stock levels
- **3 Suppliers**: With complete contact information and different specialties
- **3 Employees**: Manager, Cashier, and Admin roles
- **3 Customers**: Sample customer data for testing transactions

## Key Features for Frontend Integration

### Dashboard Integration
- Real-time statistics for dashboard cards
- Recent activity feed for notifications
- Low stock alerts for inventory management

### Inventory Management
- Complete product CRUD with category relationships
- Stock level monitoring and alerts
- Pagination and filtering support

### Supplier Management  
- Comprehensive supplier directory
- Supplier performance metrics
- Shipment and payment tracking

The backend is now ready to support the frontend Dashboard, Inventory, and Supplier sections with full functionality matching the ER diagram requirements.