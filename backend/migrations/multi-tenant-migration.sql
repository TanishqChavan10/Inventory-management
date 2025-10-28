-- Multi-Tenant Migration Script for Inventory Management System
-- This script adds userId columns to all relevant tables for multi-tenant support

-- =============================================
-- STEP 1: Add userId columns (already done via TypeORM sync)
-- =============================================
-- These columns should already exist as nullable via TypeORM entity changes
-- If not, uncomment and run these:

-- ALTER TABLE product ADD COLUMN IF NOT EXISTS "userId" VARCHAR;
-- ALTER TABLE category ADD COLUMN IF NOT EXISTS "userId" VARCHAR;
-- ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS "userId" VARCHAR;
-- ALTER TABLE shipments ADD COLUMN IF NOT EXISTS "userId" VARCHAR;
-- ALTER TABLE transactions ADD COLUMN IF NOT EXISTS "userId" VARCHAR;

-- =============================================
-- STEP 2: Assign existing data to a default user
-- =============================================
-- Replace 'YOUR_ADMIN_USER_ID' with an actual user ID from the users table

-- Option A: Assign to a specific existing user
DO $$
DECLARE
    admin_user_id VARCHAR;
BEGIN
    -- Get the first admin user or create one
    SELECT id INTO admin_user_id FROM users WHERE role = 'admin' LIMIT 1;
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'No admin user found. Please create an admin user first.';
    ELSE
        -- Assign all existing products to the admin user
        UPDATE product SET "userId" = admin_user_id WHERE "userId" IS NULL;
        RAISE NOTICE 'Updated % products', (SELECT COUNT(*) FROM product WHERE "userId" = admin_user_id);
        
        -- Assign all existing categories to the admin user
        UPDATE category SET "userId" = admin_user_id WHERE "userId" IS NULL;
        RAISE NOTICE 'Updated % categories', (SELECT COUNT(*) FROM category WHERE "userId" = admin_user_id);
        
        -- Assign all existing suppliers to the admin user
        UPDATE suppliers SET "userId" = admin_user_id WHERE "userId" IS NULL;
        RAISE NOTICE 'Updated % suppliers', (SELECT COUNT(*) FROM suppliers WHERE "userId" = admin_user_id);
        
        -- Assign all existing shipments to the admin user
        UPDATE shipments SET "userId" = admin_user_id WHERE "userId" IS NULL;
        RAISE NOTICE 'Updated % shipments', (SELECT COUNT(*) FROM shipments WHERE "userId" = admin_user_id);
        
        -- Assign all existing transactions to the admin user
        UPDATE transactions SET "userId" = admin_user_id WHERE "userId" IS NULL;
        RAISE NOTICE 'Updated % transactions', (SELECT COUNT(*) FROM transactions WHERE "userId" = admin_user_id);
        
        RAISE NOTICE 'Migration completed successfully!';
    END IF;
END $$;

-- Option B: Manual assignment (if you want to specify the user ID directly)
-- UPDATE product SET "userId" = 'YOUR_ADMIN_USER_ID' WHERE "userId" IS NULL;
-- UPDATE category SET "userId" = 'YOUR_ADMIN_USER_ID' WHERE "userId" IS NULL;
-- UPDATE suppliers SET "userId" = 'YOUR_ADMIN_USER_ID' WHERE "userId" IS NULL;
-- UPDATE shipments SET "userId" = 'YOUR_ADMIN_USER_ID' WHERE "userId" IS NULL;
-- UPDATE transactions SET "userId" = 'YOUR_ADMIN_USER_ID' WHERE "userId" IS NULL;

-- =============================================
-- STEP 3: Verify data assignment
-- =============================================
-- Check if all records have userId assigned
SELECT 
    'Products with no user' as table_name,
    COUNT(*) as count
FROM product WHERE "userId" IS NULL
UNION ALL
SELECT 
    'Categories with no user',
    COUNT(*)
FROM category WHERE "userId" IS NULL
UNION ALL
SELECT 
    'Suppliers with no user',
    COUNT(*)
FROM suppliers WHERE "userId" IS NULL
UNION ALL
SELECT 
    'Shipments with no user',
    COUNT(*)
FROM shipments WHERE "userId" IS NULL
UNION ALL
SELECT 
    'Transactions with no user',
    COUNT(*)
FROM transactions WHERE "userId" IS NULL;

-- =============================================
-- STEP 4: Make userId NOT NULL (OPTIONAL - after verification)
-- =============================================
-- Only run this after confirming all data has been assigned
-- IMPORTANT: This is a one-way operation!

-- ALTER TABLE product ALTER COLUMN "userId" SET NOT NULL;
-- ALTER TABLE category ALTER COLUMN "userId" SET NOT NULL;
-- ALTER TABLE suppliers ALTER COLUMN "userId" SET NOT NULL;
-- ALTER TABLE shipments ALTER COLUMN "userId" SET NOT NULL;
-- ALTER TABLE transactions ALTER COLUMN "userId" SET NOT NULL;

-- =============================================
-- STEP 5: Add indexes for performance (RECOMMENDED)
-- =============================================
-- These indexes will improve query performance for user-scoped queries

CREATE INDEX IF NOT EXISTS idx_product_userId ON product("userId");
CREATE INDEX IF NOT EXISTS idx_category_userId ON category("userId");
CREATE INDEX IF NOT EXISTS idx_suppliers_userId ON suppliers("userId");
CREATE INDEX IF NOT EXISTS idx_shipments_userId ON shipments("userId");
CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions("userId");

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_product_userId_name ON product("userId", product_name);
CREATE INDEX IF NOT EXISTS idx_category_userId_name ON category("userId", name);
CREATE INDEX IF NOT EXISTS idx_transactions_userId_date ON transactions("userId", transaction_date);

-- =============================================
-- STEP 6: Add foreign key constraints (OPTIONAL)
-- =============================================
-- These ensure referential integrity with the users table

-- ALTER TABLE product 
--     ADD CONSTRAINT fk_product_user 
--     FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- ALTER TABLE category 
--     ADD CONSTRAINT fk_category_user 
--     FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- ALTER TABLE suppliers 
--     ADD CONSTRAINT fk_supplier_user 
--     FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- ALTER TABLE shipments 
--     ADD CONSTRAINT fk_shipment_user 
--     FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- ALTER TABLE transactions 
--     ADD CONSTRAINT fk_transaction_user 
--     FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- =============================================
-- Rollback Script (in case you need to revert)
-- =============================================
-- WARNING: This will remove all userId data!

/*
-- Drop indexes
DROP INDEX IF EXISTS idx_product_userId;
DROP INDEX IF EXISTS idx_category_userId;
DROP INDEX IF EXISTS idx_suppliers_userId;
DROP INDEX IF EXISTS idx_shipments_userId;
DROP INDEX IF EXISTS idx_transactions_userId;
DROP INDEX IF EXISTS idx_product_userId_name;
DROP INDEX IF EXISTS idx_category_userId_name;
DROP INDEX IF EXISTS idx_transactions_userId_date;

-- Drop foreign key constraints (if added)
ALTER TABLE product DROP CONSTRAINT IF EXISTS fk_product_user;
ALTER TABLE category DROP CONSTRAINT IF EXISTS fk_category_user;
ALTER TABLE suppliers DROP CONSTRAINT IF EXISTS fk_supplier_user;
ALTER TABLE shipments DROP CONSTRAINT IF EXISTS fk_shipment_user;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS fk_transaction_user;

-- Remove userId columns
ALTER TABLE product DROP COLUMN IF EXISTS "userId";
ALTER TABLE category DROP COLUMN IF EXISTS "userId";
ALTER TABLE suppliers DROP COLUMN IF EXISTS "userId";
ALTER TABLE shipments DROP COLUMN IF EXISTS "userId";
ALTER TABLE transactions DROP COLUMN IF EXISTS "userId";
*/

-- =============================================
-- Verification Queries
-- =============================================

-- Show data distribution per user
SELECT 
    u.username,
    u.email,
    (SELECT COUNT(*) FROM product WHERE "userId" = u.id) as products,
    (SELECT COUNT(*) FROM category WHERE "userId" = u.id) as categories,
    (SELECT COUNT(*) FROM suppliers WHERE "userId" = u.id) as suppliers,
    (SELECT COUNT(*) FROM shipments WHERE "userId" = u.id) as shipments,
    (SELECT COUNT(*) FROM transactions WHERE "userId" = u.id) as transactions
FROM users u
ORDER BY u.created_at;

-- =============================================
-- END OF MIGRATION SCRIPT
-- =============================================
