-- ⚠️ CRITICAL FIX - Run this immediately in Supabase SQL Editor ⚠️
-- This fixes the foreign key constraint error for properties

-- Step 1: Make manager_id nullable (it might already be, but this ensures it)
ALTER TABLE public.properties ALTER COLUMN manager_id DROP NOT NULL;

-- Step 2: Verify the column is now nullable
SELECT 
    column_name, 
    is_nullable, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'properties' 
  AND column_name = 'manager_id';

-- Step 3: Test that we can now insert properties without a manager
-- This should succeed
INSERT INTO public.properties (name, address, type, manager_id) 
VALUES ('Test Property', '123 Test St', 'Apartment Block', NULL)
RETURNING *;

-- Step 4: Clean up the test
DELETE FROM public.properties WHERE name = 'Test Property';

-- Success message
SELECT 'manager_id is now nullable - you can create properties without a manager!' as status;
