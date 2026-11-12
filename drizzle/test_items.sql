-- Insert 1 Rupee and 5 Rupee test products
INSERT OR REPLACE INTO products (id, name, slug, description, short_description, category_id, base_price, compare_price, material, dimensions, weight, status, is_featured, meta_title, meta_description)
VALUES
(
  'prod_test_001',
  '3D Printed Test Token (₹1)',
  '3d-printed-test-token',
  'Official ₹1 test object for instant payment and checkout verification. Precision 3D printed with tactile ridges.',
  '₹1 live payment test token.',
  'cat_collectibles',
  100,
  1000,
  'Neon PLA',
  '3cm x 3cm x 0.5cm',
  5,
  'active',
  1,
  '3D Printed Test Token (₹1) | THE TOYZ DEPT.',
  '₹1 test object for testing live payments and checkout.'
),
(
  'prod_test_002',
  'Mini Tactile Keychain (₹5)',
  'mini-tactile-keychain',
  'Compact 5-rupee desktop and keychain accessory with satisfying mechanical click action.',
  '₹5 mini tactile desktop accessory.',
  'cat_desk',
  500,
  2500,
  'Matte PLA',
  '4cm x 2cm x 1cm',
  10,
  'active',
  1,
  'Mini Tactile Keychain (₹5) | THE TOYZ DEPT.',
  '₹5 mini tactile keychain for checkout testing.'
);

-- Variants
INSERT OR REPLACE INTO product_variants (id, product_id, name, sku, price_modifier, stock, is_active)
VALUES 
('var_test_001', 'prod_test_001', 'Standard (₹1)', 'TTD-TEST-1INR', 0, 9999, 1),
('var_test_002', 'prod_test_002', 'Neon Lime (₹5)', 'TTD-TEST-5INR', 0, 9999, 1);

-- Images
INSERT OR REPLACE INTO product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES 
('img_test_001', 'prod_test_001', '/images/products/token-1.jpg', '3D Printed Test Token ₹1', 0, 1),
('img_test_002', 'prod_test_002', '/images/products/keychain-1.jpg', 'Mini Tactile Keychain ₹5', 0, 1);
