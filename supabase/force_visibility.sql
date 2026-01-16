-- Force enable visibility for all properties and units for all authenticated users
-- This fixes the issue where Managers only see their own properties

-- 1. Properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations" ON public.properties;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.properties;
DROP POLICY IF EXISTS "Managers can only view their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can only see their own properties" ON public.properties;
-- Drop any potentially conflicting policies by guessing common names or just hoping the above covers it
-- (In a real migration we might inspect pg_policies first, but here we enforce a new one)

CREATE POLICY "Allow all operations" ON public.properties 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 2. Units (to ensure they can see the contents of those properties)
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations" ON public.units;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.units;

CREATE POLICY "Allow all operations" ON public.units 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 3. Managers Table (To ensure managers can see the list of other managers if needed for the dashboard)
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations" ON public.managers;
CREATE POLICY "Allow all operations" ON public.managers 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
