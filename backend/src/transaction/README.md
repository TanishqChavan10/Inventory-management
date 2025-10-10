# Transaction Module

This module handles all transaction-related functionality including transactions, customers, employees, and transaction items.

## Entities

### Transaction
- `transaction_id` (Primary Key)
- `transaction_date` (Created timestamp)
- `payment_method` (Enum: Cash, Credit Card, Debit Card, Mobile Payment)
- `total_amount` (Decimal)
- `customer_id` (Foreign Key, nullable)
- `employee_id` (Foreign Key)
- `payment_refno` (Optional payment reference)
- `status` (Enum: Pending, Completed, Failed)
- `tax_amount` (Decimal, default 0)
- `discount_amount` (Decimal, default 0)
- `subtotal` (Decimal)
- `notes` (Text, optional)

### Customer
- `customer_id` (Primary Key)
- `name` (String)
- `phone_number` (String, optional)
- `email` (String, optional)
- `address` (String, optional)
- `loyalty_points` (Integer, default 0)
- `total_purchases` (Integer, default 0)
- `created_date` (Timestamp)

### Employee
- `employee_id` (Primary Key)
- `name` (String)

### TransactionItem
- `transaction_id` (Primary Key, Foreign Key)
- `product_id` (Primary Key, Foreign Key)
- `quantity` (Integer)
- `unit_price` (Decimal)
- `discount` (Decimal, default 0)

## GraphQL Operations

### Queries
- `transactions(page, limit, status, customer_id)` - Get all transactions with pagination and filters
- `transaction(transaction_id)` - Get a specific transaction with all details
- `transactionsByCustomer(customer_id)` - Get all transactions for a customer
- `transactionsByEmployee(employee_id)` - Get all transactions handled by an employee
- `customers` - Get all customers
- `customer(customer_id)` - Get a specific customer
- `employees` - Get all employees
- `employee(employee_id)` - Get a specific employee

### Mutations
- `createTransaction(createTransactionInput)` - Create a new transaction
- `createCustomer(createCustomerInput)` - Create a new customer
- `createEmployee(createEmployeeInput)` - Create a new employee

## Features

### Transaction Management
- Complete transaction processing with inventory updates
- Stock validation before transaction completion
- Automatic calculation of totals (subtotal, tax, discount, total)
- Support for multiple transaction items
- Transaction status management

### Customer Management
- Customer creation and retrieval
- Loyalty points tracking
- Purchase history tracking
- Optional customer information (walk-in customers supported)

### Employee Management
- Employee creation and retrieval
- Transaction history per employee
- Simple employee tracking with just ID and name

### Business Logic
- Automatic stock deduction on completed transactions
- Customer purchase count increment
- Transaction rollback on errors
- Comprehensive validation (stock availability, entity existence)

## Integration

The transaction module integrates with:
- **Inventory Module**: For product information and stock management
- **Database**: PostgreSQL with TypeORM
- **GraphQL**: Apollo Server for API endpoints

## Frontend Integration

The frontend uses GraphQL hooks to:
- Create transactions with real-time validation
- Display transaction lists with pagination
- Manage customers and employees
- Handle transaction form submissions with proper error handling

## Usage Example

```typescript
// Create a transaction
const transactionInput = {
  transaction_id: "TXN-123",
  employee_id: "EMP-001",
  customer_id: "CUST-001", // Optional
  payment_method: "Credit Card",
  items: [
    {
      product_id: 1,
      quantity: 2,
      unit_price: 100.00,
      discount: 5.00
    }
  ],
  tax_amount: 10.00,
  discount_amount: 0.00,
  notes: "Customer requested gift wrap"
};
```