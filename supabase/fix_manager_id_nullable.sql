-- Fix the properties table to allow NULL manager_id
-- This allows properties to be created without assigning a manager
-- Run this in your Supabase SQL Editor

-- Make manager_id nullable
ALTER TABLE public.properties ALTER COLUMN manager_id DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name = 'manager_id';

-- Test insert without manager_id
INSERT INTO public.properties (name, address, type) 
VALUES ('Test Property Without Manager', '456 Test Ave', 'Compound')
RETURNING *;

-- Clean up test data
DELETE FROM public.properties WHERE name = 'Test Property Without Manager';
