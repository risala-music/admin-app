-- Create tables for Risala Music Management

-- Commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Districts table
CREATE TABLE IF NOT EXISTS districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  commission_id UUID NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(code, commission_id)
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  district_id UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(code, district_id)
);

-- Bands table
CREATE TABLE IF NOT EXISTS bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(code, group_id)
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  civil_id TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Band memberships junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS band_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  band_id UUID NOT NULL REFERENCES bands(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, band_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_districts_commission_id ON districts(commission_id);
CREATE INDEX IF NOT EXISTS idx_groups_district_id ON groups(district_id);
CREATE INDEX IF NOT EXISTS idx_bands_group_id ON bands(group_id);
CREATE INDEX IF NOT EXISTS idx_band_memberships_member_id ON band_memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_band_memberships_band_id ON band_memberships(band_id);
