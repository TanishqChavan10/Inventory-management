# Supplier Management Module

This module handles all supplier-related operations including supplier management, shipment tracking, and shipment item management.

## Features

### 1. Supplier Management
- ✅ CRUD operations for suppliers
- ✅ Supplier status tracking (Active/Inactive)
- ✅ Contact information management
- ✅ Registration and tax ID tracking
- ✅ Supplier performance statistics

### 2. Shipment Management
- ✅ Shipment creation and tracking
- ✅ Payment status management
- ✅ Reference number tracking
- ✅ Invoice amount management
- ✅ Supplier-specific shipment queries

### 3. Shipment Item Management
- ✅ Individual product tracking within shipments
- ✅ Batch number and expiry date tracking
- ✅ Manufacturing date management
- ✅ Quantity and pricing per item
- ✅ Expiring items monitoring

## Database Schema

### Entities

#### Supplier
```typescript
{
  supplier_id: uuid (Primary Key)
  name: string
  email: string
  phone_no: string
  address?: string
  contact_person?: string
  registration_number?: string (Unique)
  tax_id?: string
  status: 'Active' | 'Inactive'
  created_date: Date
  updated_date: Date
}
```

#### Shipment
```typescript
{
  shipment_id: uuid (Primary Key)
  supplier_id: uuid (Foreign Key)
  ref_no: string
  received_date: Date
  payment_status: 'Pending' | 'Paid' | 'Failed'
  payment_mthd: string
  invoice_amt: decimal
  total_items: integer
}
```

#### ShipmentItem
```typescript
{
  id: uuid (Primary Key)
  shipment_id: uuid (Foreign Key)
  product_id: string
  product_name: string
  quantity_received: integer
  unit_price: decimal
  mfg_date?: Date
  expiry_date?: Date
  batch_number?: string
}
```

## GraphQL Operations

### Supplier Operations

#### Queries
- `suppliers(page, limit, status)` - Get suppliers with pagination and filtering
- `supplier(supplier_id)` - Get single supplier details
- `supplierStats(supplier_id)` - Get supplier performance statistics

#### Mutations
- `addSupplier(createSupplierInput)` - Create new supplier
- `updateSupplier(updateSupplierInput)` - Update supplier information
- `deleteSupplier(supplier_id)` - Delete supplier

### Shipment Operations

#### Queries
- `shipments(page, limit, supplier_id)` - Get shipments with pagination and filtering
- `shipment(shipment_id)` - Get single shipment details
- `shipmentsBySupplier(supplier_id)` - Get all shipments for a supplier

#### Mutations
- `addShipment(createShipmentInput)` - Create new shipment
- `updateShipmentPaymentStatus(shipment_id, payment_status)` - Update payment status
- `deleteShipment(shipment_id)` - Delete shipment

### Shipment Item Operations

#### Queries
- `shipmentItems(page, limit)` - Get shipment items with pagination
- `shipmentItem(id)` - Get single shipment item
- `shipmentItemsByShipment(shipment_id)` - Get items for specific shipment
- `shipmentItemsBySupplier(supplier_id)` - Get all items from a supplier
- `expiringShipmentItems(days)` - Get items expiring within specified days

#### Mutations
- `addShipmentItem(createShipmentItemInput)` - Add single shipment item
- `addShipmentItems(createShipmentItemsInput)` - Add multiple shipment items
- `deleteShipmentItem(id)` - Delete shipment item

## Example Usage

### Create a Supplier
```graphql
mutation {
  addSupplier(createSupplierInput: {
    name: "TechCorp Solutions"
    email: "contact@techcorp.com"
    phone_no: "+1-555-0101"
    address: "123 Tech Street, Silicon Valley"
    contact_person: "John Smith"
    registration_number: "REG-TC-2020-001"
    status: Active
  }) {
    supplier_id
    name
    email
    created_date
  }
}
```

### Create a Shipment
```graphql
mutation {
  addShipment(createShipmentInput: {
    supplier_id: "uuid-here"
    ref_no: "REF-TC-001"
    payment_mthd: "Bank Transfer"
    invoice_amt: 45000.00
    total_items: 25
  }) {
    shipment_id
    ref_no
    received_date
    payment_status
  }
}
```

### Add Shipment Items
```graphql
mutation {
  addShipmentItems(createShipmentItemsInput: [
    {
      shipment_id: "shipment-uuid"
      product_id: "LAP-001"
      product_name: "Dell XPS 13 Laptop"
      quantity_received: 10
      unit_price: 1200.00
      batch_number: "BATCH-LAP-001"
      mfg_date: "2024-01-01"
    }
  ]) {
    id
    product_name
    quantity_received
    unit_price
  }
}
```

### Query Supplier Statistics
```graphql
query {
  supplierStats(supplier_id: "uuid-here")
}
```

## Business Logic

### Supplier Performance Tracking
The system tracks:
- Total number of shipments
- Total value of all shipments
- Average order value
- Last order date

### Expiry Management
- Automatic tracking of product expiry dates
- Query for items expiring within a specified timeframe
- Batch number tracking for quality control

### Payment Tracking
- Payment status management (Pending, Paid, Failed)
- Payment method tracking
- Invoice amount management

## File Structure
```
src/supplier/
├── dto/
│   ├── create-supplier.input.ts
│   ├── update-supplier.input.ts
│   ├── create-shipment.input.ts
│   └── create-shipment-item.input.ts
├── models/
│   ├── supplier.model.ts
│   ├── shipment.model.ts
│   └── shipment-item.model.ts
├── supplier.entity.ts
├── shipment.entity.ts
├── shipment-item.entity.ts
├── supplier.service.ts
├── shipment.service.ts
├── shipment-item.service.ts
├── supplier.resolver.ts
├── shipment.resolver.ts
├── shipment-item.resolver.ts
├── supplier.module.ts
├── index.ts
└── README.md
```

## Integration

The supplier module is integrated into the main application module (`app.module.ts`) and uses:
- TypeORM for database operations
- GraphQL for API endpoints
- Class-validator for input validation
- NestJS dependency injection

This module provides a complete supplier management system with full CRUD operations, relationship management, and business intelligence capabilities.