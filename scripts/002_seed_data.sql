-- Seed sample data for Risala Music Management

-- Insert sample commissions
INSERT INTO commissions (name, code) VALUES
  ('Central Commission', 'CC001'),
  ('Northern Commission', 'NC001'),
  ('Southern Commission', 'SC001')
ON CONFLICT (code) DO NOTHING;

-- Insert sample districts
INSERT INTO districts (name, code, commission_id) 
SELECT 'Capital District', 'CD001', id FROM commissions WHERE code = 'CC001'
ON CONFLICT DO NOTHING;

INSERT INTO districts (name, code, commission_id) 
SELECT 'Eastern District', 'ED001', id FROM commissions WHERE code = 'NC001'
ON CONFLICT DO NOTHING;

-- Insert sample groups
INSERT INTO groups (name, code, district_id)
SELECT 'Youth Group', 'YG001', id FROM districts WHERE code = 'CD001'
ON CONFLICT DO NOTHING;

-- Insert sample bands
INSERT INTO bands (name, code, group_id)
SELECT 'First Band', 'FB001', id FROM groups WHERE code = 'YG001'
ON CONFLICT DO NOTHING;

-- Insert sample members
INSERT INTO members (name, code, civil_id, phone_number) VALUES
  ('Ahmed Ali', 'M001', '123456789', '+96512345678'),
  ('Mohammed Hassan', 'M002', '987654321', '+96587654321')
ON CONFLICT (code) DO NOTHING;
