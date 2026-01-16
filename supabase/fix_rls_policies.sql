-- CRITICAL FIX: Temporarily disable RLS or set permissive policies for development
-- Run this in your Supabase SQL Editor to allow all operations

-- Option 1: Disable RLS entirely (NOT recommended for production)
ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.units DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.managers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Option 2: Keep RLS enabled but allow all operations (Better for development)
-- First, drop existing policies
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.properties;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.units;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.tenants;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.managers;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.payments;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.notifications;

-- Create permissive policies that allow ALL operations
CREATE POLICY "Allow all operations" ON public.properties FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.units FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.managers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies
WHERE schemaname = 'public';
