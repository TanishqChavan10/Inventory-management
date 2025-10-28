-- Sample data for testing sales analytics

-- Insert sample categories
INSERT INTO category (name) VALUES 
  ('Electronics'),
  ('Books'),
  ('Clothing'),
  ('Home & Garden')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample products
INSERT INTO product (product_name, default_price, stock, min_stock) VALUES 
  ('Dell XPS 13 Laptop', 1200.00, 25, 5),
  ('HP Pavilion Laptop', 950.00, 30, 5),
  ('Wireless Mouse', 25.00, 100, 20),
  ('Mechanical Keyboard', 120.00, 50, 10),
  ('Gaming Mouse', 60.00, 75, 15),
  ('Programming Book', 45.00, 40, 10),
  ('T-Shirt', 20.00, 80, 20),
  ('Garden Tools', 35.00, 25, 5)
ON DUPLICATE KEY UPDATE 
  product_name = VALUES(product_name),
  default_price = VALUES(default_price);

-- Link products to categories
INSERT INTO product_category (product_id, category_id) 
SELECT p.product_id, c.category_id 
FROM product p, category c 
WHERE (p.product_name IN ('Dell XPS 13 Laptop', 'HP Pavilion Laptop', 'Wireless Mouse', 'Mechanical Keyboard', 'Gaming Mouse') AND c.name = 'Electronics')
   OR (p.product_name = 'Programming Book' AND c.name = 'Books')
   OR (p.product_name = 'T-Shirt' AND c.name = 'Clothing')
   OR (p.product_name = 'Garden Tools' AND c.name = 'Home & Garden')
ON DUPLICATE KEY UPDATE product_id = VALUES(product_id);

-- Insert sample employees
INSERT INTO employee (employee_id, name) VALUES 
  ('EMP001', 'John Doe'),
  ('EMP002', 'Jane Smith')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample customers
INSERT INTO customers (customer_id, name, phone_number) VALUES 
  ('CUST001', 'Alice Johnson', '1234567890'),
  ('CUST002', 'Bob Wilson', '0987654321'),
  ('CUST003', 'Carol Brown', '1122334455')
ON CONFLICT (customer_id) DO UPDATE SET 
  name = EXCLUDED.name,
  phone_number = EXCLUDED.phone_number;

-- Insert sample transactions
INSERT INTO transaction (transaction_id, employee_id, customer_id, payment_method, subtotal, discount_amount, tax_amount, total_amount, status, transaction_date) VALUES 
  ('TXN001', 'EMP001', 'CUST001', 'Credit Card', 1200.00, 120.00, 194.40, 1274.40, 'Completed', NOW() - INTERVAL 1 DAY),
  ('TXN002', 'EMP002', 'CUST002', 'Cash', 25.00, 2.50, 4.05, 26.55, 'Completed', NOW() - INTERVAL 2 DAY),
  ('TXN003', 'EMP001', 'CUST003', 'Debit Card', 120.00, 12.00, 19.44, 127.44, 'Completed', NOW() - INTERVAL 3 DAY),
  ('TXN004', 'EMP002', 'CUST001', 'Credit Card', 950.00, 95.00, 153.90, 1008.90, 'Completed', NOW() - INTERVAL 4 DAY),
  ('TXN005', 'EMP001', 'CUST002', 'Cash', 85.00, 8.50, 13.77, 90.27, 'Completed', NOW() - INTERVAL 5 DAY)
ON DUPLICATE KEY UPDATE 
  total_amount = VALUES(total_amount),
  status = VALUES(status);

-- Insert sample transaction items
INSERT INTO transaction_item (transaction_id, product_id, quantity, unit_price, discount) 
SELECT 'TXN001', p.product_id, 1, 1200.00, 0.00
FROM product p WHERE p.product_name = 'Dell XPS 13 Laptop'
UNION ALL
SELECT 'TXN002', p.product_id, 1, 25.00, 0.00, 25.00
FROM product p WHERE p.product_name = 'Wireless Mouse'
UNION ALL
SELECT 'TXN003', p.product_id, 1, 120.00, 0.00
FROM product p WHERE p.product_name = 'Mechanical Keyboard'
UNION ALL
SELECT 'TXN004', p.product_id, 1, 950.00, 0.00
FROM product p WHERE p.product_name = 'HP Pavilion Laptop'
UNION ALL
SELECT 'TXN005', p.product_id, 1, 60.00, 0.00
FROM product p WHERE p.product_name = 'Gaming Mouse'
UNION ALL
SELECT 'TXN005', p.product_id, 1, 25.00, 0.00
FROM product p WHERE p.product_name = 'Wireless Mouse'
ON DUPLICATE KEY UPDATE 
  quantity = VALUES(quantity),
  discount = VALUES(discount);