# Quick Start Guide: Multi-Tenant Setup

## Prerequisites
✅ Backend TypeScript compilation successful  
✅ All entity relationships configured  
✅ All services and resolvers updated  

## Step-by-Step Setup

### 1. Database Synchronization
First, let TypeORM create the new columns:

```bash
cd Inventory-management/backend
npm run start:dev
```

This will automatically add `userId` columns to all tables (as nullable).

### 2. Create Test Users
Use the GraphQL playground or frontend to create test users:

```graphql
# User 1 (Shop Owner A)
mutation {
  register(registerInput: {
    username: "shop_owner_a"
    email: "ownera@example.com"
    password: "password123"
    fullName: "Shop Owner A"
  }) {
    accessToken
    user {
      id
      username
      email
    }
  }
}

# User 2 (Shop Owner B)
mutation {
  register(registerInput: {
    username: "shop_owner_b"
    email: "ownerb@example.com"
    password: "password123"
    fullName: "Shop Owner B"
  }) {
    accessToken
    user {
      id
      username
      email
    }
  }
}
```

### 3. Migrate Existing Data (Optional)
If you have existing data, run the migration script:

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database_name

# Run the migration script
\i backend/migrations/multi-tenant-migration.sql
```

### 4. Test Multi-Tenant Functionality

#### Test 1: Create Products as User A
```graphql
# Login as User A first
mutation {
  login(loginInput: {
    username: "shop_owner_a"
    password: "password123"
  }) {
    accessToken
  }
}

# Use the accessToken in Authorization header: Bearer <token>

# Create a category
mutation {
  createCategory(createCategoryInput: {
    name: "User A Electronics"
  }) {
    category_id
    name
  }
}

# Create a product
mutation {
  createProduct(createProductInput: {
    product_name: "User A Laptop"
    default_price: 1000
    stock: 10
    min_stock: 2
    categoryIds: [1]
  }) {
    product_id
    product_name
    stock
  }
}
```

#### Test 2: Create Products as User B
```graphql
# Login as User B
mutation {
  login(loginInput: {
    username: "shop_owner_b"
    password: "password123"
  }) {
    accessToken
  }
}

# Use User B's accessToken

# Create a category
mutation {
  createCategory(createCategoryInput: {
    name: "User B Electronics"
  }) {
    category_id
    name
  }
}

# Create a product
mutation {
  createProduct(createProductInput: {
    product_name: "User B Laptop"
    default_price: 1200
    stock: 5
    min_stock: 1
    categoryIds: [2]
  }) {
    product_id
    product_name
    stock
  }
}
```

#### Test 3: Verify Data Isolation
```graphql
# As User A - should only see User A's products
query {
  products {
    product_id
    product_name
    stock
  }
}
# Expected: Only "User A Laptop"

# As User B - should only see User B's products
query {
  products {
    product_id
    product_name
    stock
  }
}
# Expected: Only "User B Laptop"
```

### 5. Verify All Features Work

#### Products
- [ ] Create product → Auto-assigned to logged-in user
- [ ] List products → Shows only current user's products
- [ ] Update product → Can only update own products
- [ ] Delete product → Can only delete own products

#### Categories
- [ ] Create category → Auto-assigned to logged-in user
- [ ] List categories → Shows only current user's categories

#### Suppliers
- [ ] Create supplier → Auto-assigned to logged-in user
- [ ] List suppliers → Shows only current user's suppliers

#### Shipments
- [ ] Create shipment → Updates only user's product stock
- [ ] List shipments → Shows only current user's shipments

#### Transactions
- [ ] Create transaction → Uses only user's products
- [ ] List transactions → Shows only current user's transactions
- [ ] View analytics → Shows only user's sales data

### 6. Frontend Integration

#### Update Apollo Client Setup
Ensure JWT token is included in all requests:

```typescript
// In your Apollo Client setup
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

#### No GraphQL Query Changes Needed!
All existing queries work as-is. The backend automatically:
- Filters results by logged-in user
- Prevents cross-user data access
- Assigns userId on create operations

### 7. Common Issues & Solutions

#### Issue: "Transaction not found" or "Product not found"
**Cause:** Trying to access another user's data  
**Solution:** Ensure you're logged in as the correct user

#### Issue: Products have no userId
**Cause:** Created before multi-tenant setup  
**Solution:** Run the migration script (Step 3)

#### Issue: Can still see other users' data
**Cause:** Using old code or missing JWT token  
**Solution:** Rebuild backend and ensure token in requests

### 8. Performance Optimization

Add indexes for better performance:

```sql
-- Already included in migration script, but can be run separately
CREATE INDEX idx_product_userId ON product("userId");
CREATE INDEX idx_category_userId ON category("userId");
CREATE INDEX idx_suppliers_userId ON suppliers("userId");
CREATE INDEX idx_shipments_userId ON shipments("userId");
CREATE INDEX idx_transactions_userId ON transactions("userId");
```

## Success Criteria

✅ Each user can create their own products  
✅ Users cannot see other users' products  
✅ Users cannot modify other users' data  
✅ Analytics show only user-specific data  
✅ Stock updates only affect user's products  
✅ Frontend works without code changes  

## Troubleshooting

### Check Data Isolation
```sql
-- Run this query to verify data distribution
SELECT 
    u.username,
    (SELECT COUNT(*) FROM product WHERE "userId" = u.id) as products,
    (SELECT COUNT(*) FROM category WHERE "userId" = u.id) as categories,
    (SELECT COUNT(*) FROM suppliers WHERE "userId" = u.id) as suppliers
FROM users u;
```

### Reset Test Data
```sql
-- Delete all test data (BE CAREFUL!)
DELETE FROM transactions WHERE "userId" IN (SELECT id FROM users WHERE username LIKE 'shop_owner%');
DELETE FROM shipments WHERE "userId" IN (SELECT id FROM users WHERE username LIKE 'shop_owner%');
DELETE FROM product WHERE "userId" IN (SELECT id FROM users WHERE username LIKE 'shop_owner%');
DELETE FROM category WHERE "userId" IN (SELECT id FROM users WHERE username LIKE 'shop_owner%');
DELETE FROM suppliers WHERE "userId" IN (SELECT id FROM users WHERE username LIKE 'shop_owner%');
```

## Next Steps

1. **Test thoroughly** with multiple users
2. **Monitor performance** with production data
3. **Update documentation** for end users
4. **Train users** on multi-tenant features
5. **Set up monitoring** for cross-user access attempts

---

**Need Help?**  
Refer to `MULTI_TENANT_IMPLEMENTATION.md` for detailed technical documentation.
