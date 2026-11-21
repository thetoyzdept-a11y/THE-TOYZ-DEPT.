CREATE TABLE IF NOT EXISTS customer_surveys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  instagram TEXT,
  favorite_category TEXT,
  favorite_product TEXT,
  desired_colors TEXT,
  price_preference TEXT,
  product_ideas TEXT,
  rating INTEGER DEFAULT 5,
  feedback TEXT,
  raffle_code TEXT NOT NULL UNIQUE,
  winner_selected INTEGER DEFAULT 0,
  ip_address TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_customer_surveys_email ON customer_surveys(email);
CREATE INDEX IF NOT EXISTS idx_customer_surveys_raffle ON customer_surveys(raffle_code);
