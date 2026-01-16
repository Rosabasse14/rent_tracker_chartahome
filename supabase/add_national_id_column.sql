-- Add missing national_id column to tenants table
-- Run this in your Supabase SQL Editor

-- Add the national_id column
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS national_id text;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'tenants' 
  AND column_name = 'national_id';

-- Reload the schema cache (this is important!)
NOTIFY pgrst, 'reload schema';

-- Test that we can now insert a tenant with national_id
INSERT INTO public.tenants (name, email, phone, national_id, is_active, rent_due_day)
VALUES ('Test Tenant', 'test@example.com', '+237123456789', 'ID123456', true, 5)
RETURNING *;

-- Clean up test data
DELETE FROM public.tenants WHERE email = 'test@example.com';

SELECT 'national_id column added successfully!' as status;
