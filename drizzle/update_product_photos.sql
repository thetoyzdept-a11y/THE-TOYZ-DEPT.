UPDATE product_images SET url = '/images/products/dragon-1.jpg' WHERE product_id = 'prod_001' AND is_primary = 1;
UPDATE product_images SET url = '/images/products/rex-1.jpg' WHERE product_id = 'prod_002' AND is_primary = 1;
UPDATE product_images SET url = '/images/products/serpent-1.jpg' WHERE product_id = 'prod_003' AND is_primary = 1;
UPDATE product_images SET url = '/images/products/planter-1.jpg' WHERE product_id = 'prod_004' AND is_primary = 1;
UPDATE product_images SET url = '/images/products/dock-1.jpg' WHERE product_id = 'prod_005' AND is_primary = 1;
UPDATE product_images SET url = '/images/products/stand-1.jpg' WHERE product_id = 'prod_006' AND is_primary = 1;
UPDATE product_images SET url = '/images/products/mount-1.jpg' WHERE product_id = 'prod_007' AND is_primary = 1;
UPDATE product_images SET url = '/images/products/cube-1.jpg' WHERE product_id = 'prod_008' AND is_primary = 1;
UPDATE product_images SET url = '/images/products/wolf-1.jpg' WHERE product_id = 'prod_009' AND is_primary = 1;
UPDATE product_images SET url = '/images/products/caddy-1.jpg' WHERE product_id = 'prod_010' AND is_primary = 1;

-- Also update test items
UPDATE product_images SET url = '/images/products/token-1.jpg' WHERE product_id = 'prod_test_001';
UPDATE product_images SET url = '/images/products/keychain-1.jpg' WHERE product_id = 'prod_test_002';

-- If test token or keychain has no row in product_images, insert them:
INSERT OR REPLACE INTO product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES 
  ('img_test_001', 'prod_test_001', '/images/products/token-1.jpg', '3D Printed Test Token ₹1', 0, 1),
  ('img_test_002', 'prod_test_002', '/images/products/keychain-1.jpg', 'Mini Tactile Keychain ₹5', 0, 1);
