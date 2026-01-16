-- Quick diagnostic script to check if tables exist and RLS is properly configured
-- Run this in your Supabase SQL Editor

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'units', 'tenants', 'managers', 'payments', 'profiles');

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('properties', 'units', 'tenants', 'managers', 'payments');

-- Check if we can insert (this will show any constraint violations)
-- Try inserting a test property
INSERT INTO public.properties (name, address, type) 
VALUES ('Test Property', '123 Test St', 'Apartment Block')
RETURNING *;
