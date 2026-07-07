-- Migración: actualizar time_slot de morning/afternoon a horas exactas (08:00–19:00)
-- Ejecutar en Supabase → SQL Editor

-- 1. Eliminar la constraint antigua (morning/afternoon)
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_time_slot_check;

-- 2. Añadir la nueva constraint con horas reales
ALTER TABLE bookings ADD CONSTRAINT bookings_time_slot_check
  CHECK (time_slot IN (
    '08:00','09:00','10:00','11:00','12:00','13:00',
    '14:00','15:00','16:00','17:00','18:00','19:00'
  ));

-- 3. Ampliar el check de adults hasta 12 (multi-tuktuk)
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_adults_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_adults_check
  CHECK (adults >= 1 AND adults <= 12);
