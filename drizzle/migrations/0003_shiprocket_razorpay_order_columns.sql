-- Migration 0003: Add Shiprocket logistics, Razorpay mapping, and customer email columns to orders table
ALTER TABLE orders ADD COLUMN shipping_email TEXT;
ALTER TABLE orders ADD COLUMN shiprocket_order_id TEXT;
ALTER TABLE orders ADD COLUMN shiprocket_shipment_id TEXT;
ALTER TABLE orders ADD COLUMN courier_name TEXT;
ALTER TABLE orders ADD COLUMN awb_code TEXT;
ALTER TABLE orders ADD COLUMN pickup_scheduled_date TEXT;
ALTER TABLE orders ADD COLUMN pickup_token_number TEXT;
ALTER TABLE orders ADD COLUMN label_url TEXT;
ALTER TABLE orders ADD COLUMN manifest_url TEXT;
ALTER TABLE orders ADD COLUMN invoice_url TEXT;
ALTER TABLE orders ADD COLUMN razorpay_order_id TEXT;
ALTER TABLE orders ADD COLUMN razorpay_payment_id TEXT;
ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'created';
ALTER TABLE orders ADD COLUMN payment_method TEXT;
