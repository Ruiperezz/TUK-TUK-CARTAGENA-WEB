-- TUK TUK Cartagena — Schema inicial
-- Ejecutar en Supabase SQL Editor

-- Tabla de reservas
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  tour text not null check (tour in ('city', 'bay', 'myway')),
  date date not null,
  time_slot text not null check (time_slot in ('morning', 'afternoon')),
  adults integer not null check (adults >= 1),
  kids integer not null default 0 check (kids >= 0),
  is_private boolean not null default false,
  total_price decimal(10,2) not null,
  customer_name text not null,
  customer_email text not null,
  customer_lang text not null default 'es' check (customer_lang in ('es', 'en', 'de', 'fr')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  stripe_session_id text,
  created_at timestamptz not null default now()
);

-- Tabla de disponibilidad
create table if not exists availability (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  is_available boolean not null default false,
  notes text
);

-- Indices
create index if not exists idx_bookings_date on bookings(date);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_availability_date on availability(date);

-- RLS (Row Level Security)
alter table bookings enable row level security;
alter table availability enable row level security;

-- Politica: anon puede insertar reservas
create policy "anon_insert_bookings" on bookings
  for insert to anon with check (true);

-- Politica: anon puede leer disponibilidad
create policy "anon_read_availability" on availability
  for select to anon using (true);

-- Politica: service_role tiene acceso total (para API routes del backend)
create policy "service_all_bookings" on bookings
  for all to service_role using (true) with check (true);

create policy "service_all_availability" on availability
  for all to service_role using (true) with check (true);
