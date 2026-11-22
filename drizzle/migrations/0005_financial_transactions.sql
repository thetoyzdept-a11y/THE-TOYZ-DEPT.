CREATE TABLE IF NOT EXISTS financial_transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  order_number TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  type TEXT NOT NULL CHECK(type IN ('credit_order', 'debit_refund')),
  amount INTEGER NOT NULL, -- in paise
  gateway TEXT DEFAULT 'razorpay',
  gateway_payment_id TEXT,
  gateway_refund_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_fin_tx_order ON financial_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_fin_tx_created ON financial_transactions(created_at);
