-- Migración: eliminar TODAS las constraints de time_slot y recrear correctamente
-- Ejecutar en Supabase → SQL Editor

-- Paso 1: Eliminar cualquier constraint CHECK sobre time_slot (nombre autogenerado o manual)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT DISTINCT cc.constraint_name
    FROM information_schema.constraint_column_usage ccu
    JOIN information_schema.table_constraints cc
      ON cc.constraint_name = ccu.constraint_name
      AND cc.table_name = ccu.table_name
    WHERE ccu.table_name = 'bookings'
      AND ccu.column_name = 'time_slot'
      AND cc.constraint_type = 'CHECK'
  ) LOOP
    EXECUTE 'ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
  END LOOP;
END $$;

-- Paso 2: Crear la constraint correcta con horas reales
ALTER TABLE bookings ADD CONSTRAINT bookings_time_slot_check
  CHECK (time_slot IN (
    '08:00','09:00','10:00','11:00','12:00','13:00',
    '14:00','15:00','16:00','17:00','18:00','19:00'
  ));

-- Paso 3: Ampliar adults hasta 12 (multi-tuktuk) si no se hizo antes
DO $$
BEGIN
  BEGIN
    ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_adults_check;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  ALTER TABLE bookings ADD CONSTRAINT bookings_adults_check
    CHECK (adults >= 1 AND adults <= 12);
END $$;
