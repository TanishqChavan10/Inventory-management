# Types Organization

This folder contains TypeScript type definitions organized by page/module for better maintainability and structure.

## File Structure

### `index.ts`
- **Purpose**: Core data types and entities based on ER diagram
- **Contains**: Product, Supplier, Customer, Transaction, Employee types and their related entities
- **Use**: Import from here for basic data structures used across the application

### `dashboard.ts`
- **Purpose**: Dashboard page specific types
- **Contains**: StatData, StatDetails, CategoryRevenue, LowStockItem interfaces
- **Use**: Import for dashboard components and dashboard-related functionality

### `inventory.ts`
- **Purpose**: Inventory page specific types
- **Contains**: InventoryStats, MockInventoryItem interfaces
- **Use**: Import for inventory management components

### `suppliers.ts`
- **Purpose**: Suppliers page specific types
- **Contains**: Component props interfaces for supplier-related components
- **Use**: Import for supplier management components and pages

### `transactions.ts`
- **Purpose**: Transactions page specific types
- **Contains**: Component props interfaces for transaction-related components
- **Use**: Import for transaction management components and pages

### `reports.ts`
- **Purpose**: Reports and Analytics page specific types
- **Contains**: Component props interfaces for reports, analytics, and insights
- **Use**: Import for reporting and analytics components

## Usage Examples

```typescript
// For core data types
import type { Product, Supplier } from '@/types';

// For dashboard-specific types
import type { StatData, CategoryRevenue } from '@/types/dashboard';

// For inventory-specific types
import type { InventoryStats } from '@/types/inventory';

// For supplier components
import type { SuppliersHeaderProps } from '@/types/suppliers';

// For transaction components
import type { TransactionDetailHeaderProps } from '@/types/transactions';

// For reports components
import type { FinancialOverviewProps } from '@/types/reports';
```

## Benefits

1. **Better Organization**: Types are grouped by functionality/page
2. **Easier Maintenance**: Changes to specific page types don't affect others
3. **Cleaner Imports**: Import only what you need from specific modules
4. **Better TypeScript Performance**: Smaller type files compile faster
5. **Improved Developer Experience**: Easier to find and manage types