-- Migración 004: RPC atómica para reservas + constraint 'abandoned'
-- Ejecutar en Supabase → SQL Editor

-- 1. Añadir 'abandoned' al check de status (para reservas Stripe abandonadas)
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'abandoned'));

-- 2. Índice compuesto para acelerar la consulta de flota
CREATE INDEX IF NOT EXISTS idx_bookings_date_status
  ON bookings(date, status)
  WHERE status IN ('pending', 'confirmed');

-- 3. Función atómica de creación de reserva
--    Usa pg_advisory_xact_lock por fecha: serializa reservas del mismo día
--    sin bloquear días distintos entre sí.
CREATE OR REPLACE FUNCTION create_booking_atomic(
  p_tour          TEXT,
  p_date          DATE,
  p_time_slot     TEXT,
  p_adults        INT,
  p_total_price   INT,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_lang TEXT
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_fleet_size    CONSTANT INT := 3;
  v_all_slots     TEXT[] := ARRAY[
    '08:00','09:00','10:00','11:00','12:00','13:00',
    '14:00','15:00','16:00','17:00','18:00','19:00'
  ];
  v_tour_duration INT;
  v_tuktuks       INT;
  v_slot_index    INT;
  v_busy          INT;
  v_i             INT;
  v_new_booking   bookings;
BEGIN
  -- Lock por fecha: evita doble reserva simultánea en el mismo día
  PERFORM pg_advisory_xact_lock(hashtext(p_date::text));

  -- Duración del tour en slots de 1 hora
  v_tour_duration := CASE p_tour
    WHEN 'city'  THEN 2
    WHEN 'bay'   THEN 2
    WHEN 'myway' THEN 1
    ELSE 1
  END;

  v_tuktuks    := CEIL(p_adults::FLOAT / 4);
  v_slot_index := array_position(v_all_slots, p_time_slot);

  IF v_slot_index IS NULL THEN
    RETURN json_build_object('error', 'Horario no válido');
  END IF;

  -- Verificar capacidad para cada slot que ocupa este tour
  FOR v_i IN v_slot_index..(v_slot_index + v_tour_duration - 1) LOOP
    SELECT COALESCE(
      SUM(CEIL(COALESCE(b.adults, 1)::FLOAT / 4)::INT), 0
    )
    INTO v_busy
    FROM bookings b
    WHERE b.date = p_date
      AND b.status IN ('pending', 'confirmed')
      AND array_position(v_all_slots, b.time_slot) <= v_i
      AND array_position(v_all_slots, b.time_slot) +
          CASE b.tour
            WHEN 'city'  THEN 2
            WHEN 'bay'   THEN 2
            WHEN 'myway' THEN 1
            ELSE 1
          END > v_i;

    IF v_busy + v_tuktuks > v_fleet_size THEN
      RETURN json_build_object(
        'error',
        'No hay tuk tuks suficientes para este horario. Por favor elige otro.'
      );
    END IF;
  END LOOP;

  -- Insertar dentro del mismo lock de transacción
  INSERT INTO bookings (
    tour, date, time_slot, adults, kids, is_private,
    total_price, customer_name, customer_email, customer_lang, status
  )
  VALUES (
    p_tour, p_date, p_time_slot, p_adults, 0, TRUE,
    p_total_price, p_customer_name, p_customer_email, p_customer_lang, 'pending'
  )
  RETURNING * INTO v_new_booking;

  RETURN row_to_json(v_new_booking);
END;
$$;

-- 4. Permitir que anon llame a la función (el INSERT lo hace con SECURITY DEFINER)
GRANT EXECUTE ON FUNCTION create_booking_atomic(TEXT,DATE,TEXT,INT,INT,TEXT,TEXT,TEXT)
  TO anon, authenticated, service_role;
