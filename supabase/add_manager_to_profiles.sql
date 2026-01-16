-- Fix: Add the current manager to the profiles table
-- Run this in your Supabase SQL Editor

-- First, check if this manager exists in the managers table
SELECT * FROM public.managers WHERE id = 'ea9a1ca7-3709-4c2d-b5c9-ac0c60b4f7e6';

-- Insert this manager into the profiles table so foreign key works
INSERT INTO public.profiles (id, email, full_name, role, created_at)
VALUES (
    'ea9a1ca7-3709-4c2d-b5c9-ac0c60b4f7e6',
    'manager@chartahome.com', -- Replace with actual email if known
    'Property Manager',
    'MANAGER',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify it was added
SELECT * FROM public.profiles WHERE id = 'ea9a1ca7-3709-4c2d-b5c9-ac0c60b4f7e6';

-- Alternative: If you want to just allow NULL manager_id for all properties
-- Uncomment and run this instead:
-- UPDATE public.properties SET manager_id = NULL WHERE manager_id IS NOT NULL;
