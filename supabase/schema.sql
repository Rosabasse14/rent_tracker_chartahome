-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Links to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  role text check (role in ('SUPER_ADMIN', 'MANAGER', 'TENANT')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MANAGERS TABLE
create table if not exists public.managers (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id),
  email text not null,
  name text not null,
  phone text,
  city text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROPERTIES
create table if not exists public.properties (
  id uuid default uuid_generate_v4() primary key,
  manager_id uuid references public.profiles(id), -- Nullable initially for system consistency
  name text not null,
  address text not null,
  type text,
  city text,
  state text,
  zip_code text,
  description text,
  image_url text,
  amenities text[], -- Array of text
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- UNITS
create table if not exists public.units (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  name text not null, -- e.g. "Apt 4B"
  monthly_rent numeric not null,
  status text check (status in ('occupied', 'vacant', 'maintenance')) default 'vacant',
  type text,
  bedrooms integer,
  bathrooms numeric,
  size_sqm numeric,
  floor_number integer,
  deposit_amount numeric,
  maintenance_fee numeric,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TENANTS
create table if not exists public.tenants (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id), 
  unit_id uuid references public.units(id), 
  email text not null,
  name text not null,
  phone text,
  national_id text,
  lease_start date,
  lease_end date,
  is_active boolean default true,
  rent_due_day integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_unit_assignment unique (unit_id) 
);

-- PAYMENTS
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants(id) not null,
  unit_id uuid references public.units(id) not null,
  amount numeric not null,
  period text not null, -- e.g. "January 2026"
  status text check (status in ('pending', 'paid', 'verified', 'rejected')) default 'pending',
  proof_url text, 
  payment_method text,
  notes text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verified_at timestamp with time zone
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null, -- Can link to profiles(id)
  title text not null,
  message text not null,
  type text not null,
  unread boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES & SECURITY
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.units enable row level security;
alter table public.tenants enable row level security;
alter table public.payments enable row level security;
alter table public.managers enable row level security;
alter table public.notifications enable row level security;

-- Temporary bypass for RLS during development if not using Supabase Auth strictly
-- WARNING: In production, these should be restricted to authenticated users.
create policy "Allow all for authenticated" on public.profiles for all using (true);
create policy "Allow all for authenticated" on public.properties for all using (true);
create policy "Allow all for authenticated" on public.units for all using (true);
create policy "Allow all for authenticated" on public.tenants for all using (true);
create policy "Allow all for authenticated" on public.payments for all using (true);
create policy "Allow all for authenticated" on public.managers for all using (true);
create policy "Allow all for authenticated" on public.notifications for all using (true);

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('payment_proofs', 'payment_proofs', true)
on conflict (id) do nothing;

create policy "All access to payment proofs" on storage.objects for all using (bucket_id = 'payment_proofs');

-- REALTIME (Idempotent addition)
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
