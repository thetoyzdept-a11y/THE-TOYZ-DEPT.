-- Seed verified customer reviews
INSERT OR REPLACE INTO reviews (id, product_id, user_id, order_id, rating, title, body, is_verified, is_approved)
VALUES
(
  'rev_003',
  'prod_002',
  'usr_cust_001',
  'ord_demo_001',
  5,
  'Sturdy joints and weighted feet',
  'The dinosaur stands firmly on its feet while the tail and neck articulated spine move smoothly. Love the matte slate industrial finish.',
  1,
  1
),
(
  'rev_004',
  'prod_003',
  'usr_cust_001',
  'ord_demo_001',
  5,
  'Incredible iridescent color shift',
  'Wrapped it around my monitor riser. The silk crystal scales shimmer in the studio lighting. Build quality is 10/10.',
  1,
  1
),
(
  'rev_005',
  'prod_004',
  'usr_cust_001',
  'ord_demo_002',
  5,
  'Looks like authentic cast concrete',
  'Has a subtle weight and geometric brutalist angles. My jade succulent fits inside like a glove. Packed very securely.',
  1,
  1
),
(
  'rev_006',
  'prod_005',
  'usr_cust_001',
  'ord_demo_002',
  5,
  'Tamed all my mechanical keyboard cables',
  'Keeps my coiled aviator USB-C cable routed cleanly across the desk. The neon lime accent is a great cyberpunk touch.',
  1,
  1
),
(
  'rev_007',
  'prod_008',
  'usr_cust_001',
  'ord_demo_001',
  5,
  'Addicting mechanical gear rotation',
  'All gears rotate simultaneously with a quiet tactile click. The tolerances are tight with no sloppy backlash.',
  1,
  1
),
(
  'rev_008',
  'prod_009',
  'usr_cust_001',
  'ord_demo_002',
  5,
  'Stunning metallic bronze sheen',
  'Catches the desk lamp light along every facet. Clean layer lines and very solid structural infill.',
  1,
  1
),
(
  'rev_009',
  'prod_010',
  'usr_cust_001',
  'ord_demo_002',
  5,
  'Architectural desk centerpiece',
  'Holds all my Micron drafting pens and metal calipers neatly. Heavy base prevents tipping over.',
  1,
  1
),
(
  'rev_test_001',
  'prod_test_001',
  'usr_cust_001',
  'ord_demo_001',
  5,
  'Instant ₹1 payment test passed',
  'Smooth checkout and verified Razorpay payment. Received token cleanly packed.',
  1,
  1
),
(
  'rev_test_002',
  'prod_test_002',
  'usr_cust_001',
  'ord_demo_001',
  5,
  'Satisfying tactile click switch',
  'Fun little desk clicker on my keychain. High quality PLA and strong split ring.',
  1,
  1
);
