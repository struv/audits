-- Create audits table
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  audit_type TEXT NOT NULL CHECK (audit_type IN ('MRR', 'FSR')),
  scheduled_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'complete')),
  checklist_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on scheduled_date for efficient queries
CREATE INDEX IF NOT EXISTS idx_audits_scheduled_date ON audits(scheduled_date);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);

-- Create index on location for filtering
CREATE INDEX IF NOT EXISTS idx_audits_location ON audits(location);

-- Enable Row Level Security (RLS)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
-- For a simple app, we'll allow all operations
CREATE POLICY "Allow all operations on audits" ON audits
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_audits_updated_at
  BEFORE UPDATE ON audits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
