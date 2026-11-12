-- Seed Data for THE TOYZ DEPT.

-- 1. Users (Admin and Test Customer)
INSERT OR REPLACE INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified)
VALUES 
(
  'usr_admin_001',
  'admin@thetoyzdept.in',
  'toyz_salt_admin:bb3ae1275372a80cdefecff8244c9679cafca6b609f762a42307ec61a7ab583d',
  'Abhishek',
  'H',
  '+91 90194 65897',
  'admin',
  1,
  1
),
(
  'usr_admin_owner',
  'thetoyzdept@gmail.com',
  'toyz_salt_admin:bb3ae1275372a80cdefecff8244c9679cafca6b609f762a42307ec61a7ab583d',
  'Abhishek',
  'H',
  '+91 90194 65897',
  'admin',
  1,
  1
),
(
  'usr_cust_001',
  'customer@thetoyzdept.in',
  'toyz_salt_customer:00cc393251a9770092dc5ee7e61c4e12cef975a83f99a8f8717fc94cb4bf7fd5',
  'Rohan',
  'Verma',
  '+91 91234 56789',
  'customer',
  1,
  1
);

-- Addresses for Customer
INSERT OR REPLACE INTO addresses (id, user_id, label, full_name, phone, address_line_1, address_line_2, city, state, postal_code, country, is_default)
VALUES (
  'addr_001',
  'usr_cust_001',
  'Home',
  'Rohan Verma',
  '+91 91234 56789',
  'Flat 402, Skyline Residency, Indiranagar',
  '12th Main Road',
  'Bengaluru',
  'Karnataka',
  '560038',
  'India',
  1
);

-- 2. Categories
INSERT OR REPLACE INTO categories (id, name, slug, description, sort_order, is_visible)
VALUES 
('cat_collectibles', 'Collectibles', 'collectibles', 'Articulated toys, mythical creatures & display-grade figurines with fluid interlocking mechanics.', 1, 1),
('cat_desk', 'Desk Objects', 'desk-objects', 'Tactile organizers, cable conduits, kinetic fidgets & brutalist desktop sculptures.', 2, 1),
('cat_home', 'Home Stuff', 'home-stuff', 'Architectural planters, parametric wall mounts & sculptural home accents.', 3, 1),
('cat_custom', 'Custom Creations', 'custom-creations', 'Submit your proprietary 3D CAD/STL models for industrial FDM precision printing.', 4, 1);

-- 3. Products
INSERT OR REPLACE INTO products (id, name, slug, description, short_description, category_id, base_price, compare_price, material, dimensions, weight, status, is_featured, meta_title, meta_description)
VALUES
(
  'prod_001',
  'Articulated Cyber Dragon',
  'articulated-cyber-dragon',
  'The flagship print of THE TOYZ DEPT. Engineered with 48 interlocking micro-segments that bend and coil with liquid smoothness. Printed in dual-tone Silk PLA with crisp angular scales and an articulated jaw.',
  '48-segment fully fluid articulated dragon in dual-tone Silk PLA.',
  'cat_collectibles',
  129900,
  159900,
  'Dual-Color Silk PLA+',
  '45cm length x 6cm width',
  180,
  'active',
  1,
  'Articulated Cyber Dragon | THE TOYZ DEPT.',
  'Liquid-smooth 48 segment articulated dragon printed in high-grade Silk PLA.'
),
(
  'prod_002',
  'Mecha Flexi Rex',
  'mecha-flexi-rex',
  'A hardened, neo-industrial reimagining of the iconic desk dinosaur. Features reinforced ball-socket vertebrae, mechanical armor plates, and weighted feet for stable desktop posing.',
  'Reinforced articulated mecha dinosaur with weighted stance.',
  'cat_collectibles',
  89900,
  109900,
  'Matte Industrial PLA',
  '18cm x 8cm x 12cm',
  140,
  'active',
  1,
  'Mecha Flexi Rex | Desk Dinosaur | THE TOYZ DEPT.',
  'Industrial articulated mecha dinosaur designed for tactile desk interaction.'
),
(
  'prod_003',
  'Articulated Crystal Serpent',
  'articulated-crystal-serpent',
  'Geometric crystal facets cascade down a 60cm spine. Interlocking flex-joints allow it to wrap naturally around monitors, mic arms, or desk risers.',
  '60cm faceted serpentine desktop companion with wrap-around capability.',
  'cat_collectibles',
  149900,
  179900,
  'Iridescent Silk PLA',
  '60cm length x 4.5cm width',
  210,
  'active',
  1,
  'Articulated Crystal Serpent | THE TOYZ DEPT.',
  'Faceted geometric serpent with natural wrap-around flexibility.'
),
(
  'prod_004',
  'Brutalist Concrete Desk Planter',
  'brutalist-concrete-desk-planter',
  'Raw architectural geometry inspired by brutalist public monoliths. Features an integrated drainage reservoir and removable inner pot for small succulents and cacti.',
  'Architectural brutalist geometric planter with hidden drainage.',
  'cat_home',
  74900,
  89900,
  'Stone-Infused Matte PLA',
  '11cm x 11cm x 10cm',
  165,
  'active',
  1,
  'Brutalist Desk Planter | THE TOYZ DEPT.',
  'Brutalist architecture inspired planter for desk greenery.'
),
(
  'prod_005',
  'Cyberpunk Cable Management Dock',
  'cyberpunk-cable-management-dock',
  'Heavyweight desk conduit for 5 standard charging & peripheral cables. Magnetic top cover keeps cables seated without pinching or scraping.',
  'Heavyweight cable routing hub with magnetic clamp lid.',
  'cat_desk',
  59900,
  74900,
  'High-Density PETG',
  '14cm x 4cm x 3cm',
  110,
  'active',
  1,
  'Cyberpunk Cable Dock | THE TOYZ DEPT.',
  'Heavyweight cable organizer dock for clean workspaces.'
),
(
  'prod_006',
  'Isometric Headphone Rest & Stand',
  'isometric-headphone-rest-stand',
  'A counter-balanced geometric apex stand that supports oversized over-ear headphones without deforming headbands. Subtle cable trough integrated into base.',
  'Counter-balanced geometric stand for studio & gaming cans.',
  'cat_desk',
  119900,
  139900,
  'Carbon Fiber Enhanced PLA',
  '26cm height x 14cm footprint',
  280,
  'active',
  1,
  'Isometric Headphone Stand | THE TOYZ DEPT.',
  'Geometric headphone stand designed to preserve headband cushion.'
),
(
  'prod_007',
  'Modular Magnetic Wall Mount Trio',
  'modular-magnetic-wall-mount-trio',
  'Three modular hexagonal hooks with integrated neodymium magnets for keychains, tech pouches, and lightweight everyday carry accessories.',
  'Trio of modular hexagonal wall hooks with magnetic core.',
  'cat_home',
  84900,
  99900,
  'Impact-Resistant PLA+',
  '8cm x 7cm per tile',
  150,
  'active',
  0,
  'Modular Magnetic Wall Mounts | THE TOYZ DEPT.',
  'Geometric hexagonal modular wall hooks with neodymium cores.'
),
(
  'prod_008',
  'Kinetic Fidget Gear Cube',
  'kinetic-fidget-gear-cube',
  'Six interlocking helical bevel gears that spin synchronously in infinite loop rotation. Satisfying mechanical resistance tuned for focus and stress relief.',
  'Synchronous helical gear cube with zero-play tactile motion.',
  'cat_desk',
  49900,
  59900,
  'Precision Tough Resin PLA',
  '5.5cm x 5.5cm x 5.5cm',
  85,
  'active',
  1,
  'Kinetic Fidget Gear Cube | THE TOYZ DEPT.',
  'Precision interlocking helical gear cube for tactile focus.'
),
(
  'prod_009',
  'Low-Poly Geometric Wolf Bust',
  'low-poly-geometric-wolf-bust',
  'Sculptural geometric trophy piece. 182 individual planar polygons catch light at dramatic angles. Flat base sits flush on shelves or display cases.',
  '182-polygon faceted wolf sculpture with dramatic light play.',
  'cat_collectibles',
  99900,
  119900,
  'Matte Obsidian Black PLA',
  '16cm x 12cm x 18cm',
  195,
  'active',
  0,
  'Low-Poly Wolf Bust | THE TOYZ DEPT.',
  'Low-poly architectural wolf bust for shelves and display cabinets.'
),
(
  'prod_010',
  'Bauhaus Architectural Pen Caddy',
  'bauhaus-architectural-pen-caddy',
  'Inspired by German industrial design. Staggered vertical tubes of varying depths accommodate styluses, fountain pens, calipers, and craft knives in an intentional display.',
  'Staggered multi-depth desktop vessel for instruments & pens.',
  'cat_desk',
  69900,
  79900,
  'Matte Cream & Lime Dual PLA',
  '12cm x 9cm x 11cm',
  130,
  'active',
  1,
  'Bauhaus Pen Caddy | THE TOYZ DEPT.',
  'Architectural staggered desktop vessel for pens, tools, and styluses.'
);

-- 4. Product Images
INSERT OR REPLACE INTO product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES
('img_001_1', 'prod_001', '/images/products/dragon-1.jpg', 'Articulated Cyber Dragon - Coiled Stance', 0, 1),
('img_001_2', 'prod_001', '/images/products/dragon-1.jpg', 'Articulated Cyber Dragon - Close-up Scales', 1, 0),
('img_002_1', 'prod_002', '/images/products/rex-1.jpg', 'Mecha Flexi Rex - Standing Profile', 0, 1),
('img_003_1', 'prod_003', '/images/products/serpent-1.jpg', 'Articulated Crystal Serpent - Coiled', 0, 1),
('img_004_1', 'prod_004', '/images/products/planter-1.jpg', 'Brutalist Concrete Planter on Oak Desk', 0, 1),
('img_005_1', 'prod_005', '/images/products/dock-1.jpg', 'Cyberpunk Cable Dock with USB-C Cables', 0, 1),
('img_006_1', 'prod_006', '/images/products/stand-1.jpg', 'Isometric Headphone Stand Front View', 0, 1),
('img_007_1', 'prod_007', '/images/products/mount-1.jpg', 'Modular Magnetic Wall Mounts Installed', 0, 1),
('img_008_1', 'prod_008', '/images/products/cube-1.jpg', 'Kinetic Fidget Gear Cube in Hand', 0, 1),
('img_009_1', 'prod_009', '/images/products/wolf-1.jpg', 'Low-Poly Geometric Wolf Bust Angle', 0, 1),
('img_010_1', 'prod_010', '/images/products/caddy-1.jpg', 'Bauhaus Architectural Pen Caddy Filled', 0, 1);

-- 5. Product Variants & Inventory
INSERT OR REPLACE INTO product_variants (id, product_id, name, sku, color, size, price_modifier, stock, low_stock_threshold, is_active)
VALUES
('var_001_lime', 'prod_001', 'Acid Lime / Obsidian', 'DRG-CYB-LIME', 'Acid Lime & Black', 'Standard (45cm)', 0, 14, 5, 1),
('var_001_coral', 'prod_001', 'Coral Flame / Cream', 'DRG-CYB-CORAL', 'Coral & Cream', 'Standard (45cm)', 10000, 8, 3, 1),
('var_001_xl', 'prod_001', 'Obsidian Monolith (XL)', 'DRG-CYB-XL', 'Matte Obsidian', 'Titan (65cm)', 40000, 4, 2, 1),

('var_002_ink', 'prod_002', 'Industrial Ink Black', 'REX-MEC-INK', 'Ink Black', 'Standard (18cm)', 0, 22, 5, 1),
('var_002_lime', 'prod_002', 'Toxic Lime Hazard', 'REX-MEC-LIME', 'Acid Lime', 'Standard (18cm)', 0, 18, 5, 1),

('var_003_iris', 'prod_003', 'Iridescent Opal', 'SERP-CRY-OPAL', 'Iridescent Opal', 'Standard (60cm)', 0, 11, 4, 1),
('var_003_smoke', 'prod_003', 'Smoky Quartz', 'SERP-CRY-SMK', 'Translucent Smoke', 'Standard (60cm)', 0, 6, 3, 1),

('var_004_stone', 'prod_004', 'Raw Granite Gray', 'PLT-BRU-GRY', 'Granite Gray', 'Medium', 0, 16, 5, 1),
('var_004_sand', 'prod_004', 'Dune Sandstone', 'PLT-BRU-SND', 'Dune Sand', 'Medium', 0, 12, 4, 1),

('var_005_blk', 'prod_005', 'Stealth Matte Black', 'DCK-CBL-BLK', 'Matte Black', '5-Slot', 0, 35, 8, 1),
('var_005_lme', 'prod_005', 'High-Vis Acid Lime', 'DCK-CBL-LME', 'Acid Lime', '5-Slot', 0, 20, 5, 1),

('var_006_cf', 'prod_006', 'Carbon Fiber Black', 'HDP-ISO-CF', 'Carbon Fiber Black', 'Standard (26cm)', 0, 9, 3, 1),
('var_006_crm', 'prod_006', 'Architectural Cream', 'HDP-ISO-CRM', 'Warm Cream', 'Standard (26cm)', 0, 7, 3, 1),

('var_007_set', 'prod_007', 'Monochrome Trio', 'WLL-HEX-TRIO', 'Black/Cream/Lime', '3-Pack', 0, 25, 5, 1),

('var_008_blk', 'prod_008', 'Stealth Carbon Black', 'CUB-GEAR-BLK', 'Carbon Black', '55mm Cube', 0, 42, 10, 1),
('var_008_crl', 'prod_008', 'Hyper Coral', 'CUB-GEAR-CRL', 'Hyper Coral', '55mm Cube', 0, 28, 8, 1),

('var_009_obs', 'prod_009', 'Obsidian Matte', 'WLF-PLY-OBS', 'Obsidian Black', '18cm Trophy', 0, 15, 4, 1),

('var_010_bau', 'prod_010', 'Bauhaus Cream & Lime', 'CDY-BAU-CRM', 'Cream & Lime', 'Standard', 0, 19, 5, 1);

-- 6. Sample Order & Order Items (For realistic admin overview stats)
INSERT OR REPLACE INTO orders (
  id, order_number, user_id, status, subtotal, shipping_cost, tax_amount, discount_amount, total_amount,
  coupon_code, shipping_name, shipping_phone, shipping_address_1, shipping_address_2, shipping_city, shipping_state, shipping_postal_code, shipping_country,
  tracking_number, tracking_url, shipped_at, internal_notes, created_at
)
VALUES
(
  'ord_demo_001',
  'TTD-2026-8912',
  'usr_cust_001',
  'printing',
  219800,
  0,
  0,
  0,
  219800,
  NULL,
  'Rohan Verma',
  '+91 91234 56789',
  'Flat 402, Skyline Residency, Indiranagar',
  '12th Main Road',
  'Bengaluru',
  'Karnataka',
  '560038',
  'India',
  'BLR-DTDC-77491',
  'https://www.dtdc.in/tracking/shipment-tracking.asp',
  NULL,
  'Layer height 0.12mm for high detail dragon body.',
  datetime('now', '-2 days')
),
(
  'ord_demo_002',
  'TTD-2026-8904',
  'usr_cust_001',
  'delivered',
  119900,
  0,
  0,
  10000,
  109900,
  'WELCOME10',
  'Rohan Verma',
  '+91 91234 56789',
  'Flat 402, Skyline Residency, Indiranagar',
  '12th Main Road',
  'Bengaluru',
  'Karnataka',
  '560038',
  'India',
  'BLR-BLUEDART-9921',
  'https://www.bluedart.com',
  datetime('now', '-7 days'),
  'Completed smoothly with blue carbon finish.',
  datetime('now', '-10 days')
);

INSERT OR REPLACE INTO order_items (id, order_id, product_id, variant_id, product_name, variant_name, unit_price, quantity, total_price)
VALUES
('oit_001', 'ord_demo_001', 'prod_001', 'var_001_lime', 'Articulated Cyber Dragon', 'Acid Lime / Obsidian', 129900, 1, 129900),
('oit_002', 'ord_demo_001', 'prod_002', 'var_002_ink', 'Mecha Flexi Rex', 'Industrial Ink Black', 89900, 1, 89900),
('oit_003', 'ord_demo_002', 'prod_006', 'var_006_cf', 'Isometric Headphone Rest & Stand', 'Carbon Fiber Black', 119900, 1, 119900);

-- Payment records for the demo orders
INSERT OR REPLACE INTO payments (id, order_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, method, created_at)
VALUES
('pay_001', 'ord_demo_001', 'order_mock_demo_001', 'pay_mock_771892', 219800, 'INR', 'captured', 'upi', datetime('now', '-2 days')),
('pay_002', 'ord_demo_002', 'order_mock_demo_002', 'pay_mock_331908', 109900, 'INR', 'captured', 'card', datetime('now', '-10 days'));

-- 7. Sample Custom 3D Printing Request & Quotation
INSERT OR REPLACE INTO custom_requests (
  id, request_number, user_id, description, material, color, quantity, additional_notes, status, admin_notes, created_at
)
VALUES
(
  'req_demo_001',
  'CST-2026-0042',
  'usr_cust_001',
  'Custom mechanical keyboard artisan keycap set modeled in Fusion360. MX stem compatibility required.',
  'Tough Resin (SLA) / High Detail PLA',
  'Acid Lime + Matte Black',
  4,
  'Please inspect wall thickness on the MX cross-stem. Needs tight tolerance to avoid stem wobble.',
  'quoted',
  'Sliced in Bambu Studio. Estimated print time 3h 40m. Requires 0.08mm layer height for stem fit.',
  datetime('now', '-1 day')
);

INSERT OR REPLACE INTO custom_request_files (id, request_id, file_name, file_type, file_size, r2_key)
VALUES
('file_demo_001', 'req_demo_001', 'cyber_artisan_keycap_v3.stl', 'stl', 4821094, 'custom-models/usr_cust_001/cyber_artisan_keycap_v3.stl');

INSERT OR REPLACE INTO quotations (id, request_id, amount, breakdown, valid_until, notes, status, created_at)
VALUES
(
  'quot_demo_001',
  'req_demo_001',
  165000,
  '{"material": 60000, "machine_time": 75000, "post_processing": 30000, "total": 165000}',
  datetime('now', '+14 days'),
  'Includes ultrasonic resin wash, UV cure, and individual MX switch tolerance fit testing.',
  'sent',
  datetime('now', '-6 hours')
);

-- 8. Genuine Initial Product Reviews
INSERT OR REPLACE INTO reviews (id, product_id, user_id, order_id, rating, title, body, is_verified, is_approved)
VALUES
(
  'rev_001',
  'prod_006',
  'usr_cust_001',
  'ord_demo_002',
  5,
  'Exceptional stability & clean brutalist look',
  'Holds my heavy planar magnetic headphones with zero sag. The matte carbon fiber finish looks insanely good on my walnut desk setup.',
  1,
  1
),
(
  'rev_002',
  'prod_001',
  'usr_cust_001',
  'ord_demo_001',
  5,
  'Mesmerizing articulation',
  'The tolerance on each dragon segment is unbelievable. Completely fluid right out of the box with zero stiff joints.',
  1,
  1
);

-- 9. Coupons
INSERT OR REPLACE INTO coupons (id, code, description, discount_type, discount_value, minimum_order_amount, is_active)
VALUES
('cpn_welcome10', 'WELCOME10', '10% off your initial order above ₹999', 'percentage', 10, 99900, 1),
('cpn_toyz20', 'TOYZ20', '₹200 flat discount on orders above ₹1,999', 'fixed', 20000, 199900, 1);

-- 10. Store Settings
INSERT OR REPLACE INTO store_settings (key, value)
VALUES
('store_name', 'THE TOYZ DEPT.'),
('store_tagline', 'THINGS YOU DIDN''T KNOW YOU NEEDED.'),
('currency', 'INR'),
('currency_symbol', '₹'),
('timezone', 'Asia/Kolkata'),
('free_shipping_threshold', '99900'), -- Free shipping above ₹999
('standard_shipping_rate', '9900'),   -- Standard shipping ₹99
('tax_rate_percent', '0'),             -- GST Exempt (Turnover below ₹20L under Sec 22 CGST Act)
('contact_email', 'thetoyzdept@gmail.com'),
('contact_phone', '+91 90194 65897'),
('address', 'MIG 146, KHB Colony, Rajiv Gandhi Nagar, Gadag, Karnataka 582101, India'),
('social_instagram', 'https://instagram.com/thetoyzdept'),
('social_twitter', 'https://twitter.com/thetoyzdept');
