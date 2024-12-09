-- Add analysis columns to contracts table
ALTER TABLE contracts 
ADD COLUMN analysis jsonb,
ADD COLUMN key_terms jsonb,
ADD COLUMN risk_score integer,
ADD COLUMN last_analyzed_at timestamp with time zone;

-- Create index for faster searches
CREATE INDEX idx_contracts_status ON contracts(status); 