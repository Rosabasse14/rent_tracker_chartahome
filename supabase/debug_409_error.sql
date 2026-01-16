-- Check for constraints and indexes on the properties table
-- Run this in Supabase SQL Editor to diagnose the 409 error

-- 1. Check all constraints on properties table
SELECT
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.properties'::regclass;

-- 2. Check all indexes
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'properties'
AND schemaname = 'public';

-- 3. Check for any unique constraints that might cause 409
SELECT
    a.attname AS column_name,
    i.indisunique AS is_unique,
    i.indisprimary AS is_primary
FROM pg_index i
JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
WHERE i.indrelid = 'public.properties'::regclass;

-- 4. Try a test insert to see the exact error
INSERT INTO public.properties (name, address, type, manager_id)
VALUES ('Debug Test Property', '999 Debug St', 'Test Type', NULL)
RETURNING *;

-- Clean up
DELETE FROM public.properties WHERE name = 'Debug Test Property';
