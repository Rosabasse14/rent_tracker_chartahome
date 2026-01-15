
-- 1. FIX PROPERTIES TABLE
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='type') THEN
    ALTER TABLE public.properties ADD COLUMN type text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='city') THEN
    ALTER TABLE public.properties ADD COLUMN city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='state') THEN
    ALTER TABLE public.properties ADD COLUMN state text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='zip_code') THEN
    ALTER TABLE public.properties ADD COLUMN zip_code text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='description') THEN
    ALTER TABLE public.properties ADD COLUMN description text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='image_url') THEN
    ALTER TABLE public.properties ADD COLUMN image_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='amenities') THEN
    ALTER TABLE public.properties ADD COLUMN amenities text[];
  END IF;
  -- Make manager_id nullable for setup flexibility
  ALTER TABLE public.properties ALTER COLUMN manager_id DROP NOT NULL;
END $$;

-- 2. FIX UNITS TABLE
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='type') THEN
    ALTER TABLE public.units ADD COLUMN type text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='bedrooms') THEN
    ALTER TABLE public.units ADD COLUMN bedrooms integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='bathrooms') THEN
    ALTER TABLE public.units ADD COLUMN bathrooms numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='size_sqm') THEN
    ALTER TABLE public.units ADD COLUMN size_sqm numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='floor_number') THEN
    ALTER TABLE public.units ADD COLUMN floor_number integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='deposit_amount') THEN
    ALTER TABLE public.units ADD COLUMN deposit_amount numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='maintenance_fee') THEN
    ALTER TABLE public.units ADD COLUMN maintenance_fee numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='units' AND column_name='description') THEN
    ALTER TABLE public.units ADD COLUMN description text;
  END IF;
END $$;

-- 3. FIX TENANTS TABLE
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='phone') THEN
    ALTER TABLE public.tenants ADD COLUMN phone text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='rent_due_day') THEN
    ALTER TABLE public.tenants ADD COLUMN rent_due_day integer DEFAULT 5;
  END IF;
END $$;

-- 4. FIX MANAGERS TABLE
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='managers' AND column_name='phone') THEN
    ALTER TABLE public.managers ADD COLUMN phone text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='managers' AND column_name='city') THEN
    ALTER TABLE public.managers ADD COLUMN city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='managers' AND column_name='status') THEN
    ALTER TABLE public.managers ADD COLUMN status text DEFAULT 'active';
  END IF;
END $$;

-- 5. ENSURE NOTIFICATIONS EXISTS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  unread boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. RELAX RLS FOR DEVELOPMENT (RE-APPLY)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for authenticated" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.properties;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.units;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.tenants;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.payments;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.managers;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.notifications;

CREATE POLICY "Allow all for authenticated" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON public.properties FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON public.units FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON public.tenants FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON public.managers FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON public.notifications FOR ALL USING (true);

-- 7. REFRESH REALTIME
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'payments') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'units') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.units;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'tenants') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tenants;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'managers') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.managers;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'properties') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

-- 8. RELOAD SCHEMA CACHE (Internal command for PostgREST)
NOTIFY pgrst, 'reload schema';
