/*
  # Create leads table for quiz completions

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `company` (text, required)
      - `email` (text, unique, required)
      - `phone` (text, optional)
      - `industry` (text, required)
      - `company_size` (text, required)
      - `quiz_scores` (jsonb, stores the quiz results)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `leads` table
    - Add policy for public insert (anyone can submit leads)
    - Add policy for authenticated users to read all leads (admin access)

  3. Indexes
    - Add index on email for faster lookups
    - Add index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  industry text NOT NULL,
  company_size text NOT NULL,
  quiz_scores jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert leads (for quiz submissions)
CREATE POLICY "Anyone can submit leads"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy to allow authenticated users to read all leads (admin access)
CREATE POLICY "Authenticated users can read all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_industry ON leads(industry);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_leads_updated_at'
  ) THEN
    CREATE TRIGGER update_leads_updated_at
      BEFORE UPDATE ON leads
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;