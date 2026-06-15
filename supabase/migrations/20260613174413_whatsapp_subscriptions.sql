-- WhatsApp Subscriptions Table
CREATE TABLE whatsapp_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  capacity_kw DOUBLE PRECISION NOT NULL,
  efficiency DOUBLE PRECISION DEFAULT 20,
  performance_ratio DOUBLE PRECISION DEFAULT 80,
  monthly_bill DOUBLE PRECISION DEFAULT 5000,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'premium')),
  is_active BOOLEAN DEFAULT true,
  subscription_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_end TIMESTAMP WITH TIME ZONE,
  last_alert_sent TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE whatsapp_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own subscriptions" ON whatsapp_subscriptions
  FOR ALL USING (true);

-- Index for active subscriptions lookup
CREATE INDEX idx_active_subscriptions ON whatsapp_subscriptions (is_active, plan_type) WHERE is_active = true;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_whatsapp_subscriptions_updated_at
    BEFORE UPDATE ON whatsapp_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();