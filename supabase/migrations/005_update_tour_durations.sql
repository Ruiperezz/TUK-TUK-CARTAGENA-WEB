-- Migration 005: Update all tour durations to 60 min (1 slot) in the atomic booking RPC
-- Keeps the exact same parameter signature as migration 004 — only changes v_tour_duration to 1.

DROP FUNCTION IF EXISTS create_booking_atomic CASCADE;

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
  PERFORM pg_advisory_xact_lock(hashtext(p_date::text));

  -- All tours are now 60 min = 1 slot
  v_tour_duration := 1;

  v_tuktuks    := CEIL(p_adults::FLOAT / 4);
  v_slot_index := array_position(v_all_slots, p_time_slot);

  IF v_slot_index IS NULL THEN
    RETURN json_build_object('error', 'Horario no válido');
  END IF;

  FOR v_i IN v_slot_index..(v_slot_index + v_tour_duration - 1) LOOP
    SELECT COALESCE(
      SUM(CEIL(COALESCE(b.adults, 1)::FLOAT / 4)::INT), 0
    )
    INTO v_busy
    FROM bookings b
    WHERE b.date = p_date
      AND b.status IN ('pending', 'confirmed')
      AND array_position(v_all_slots, b.time_slot) <= v_i
      AND array_position(v_all_slots, b.time_slot) + 1 > v_i;

    IF v_busy + v_tuktuks > v_fleet_size THEN
      RETURN json_build_object(
        'error',
        'No hay tuk tuks suficientes para este horario. Por favor elige otro.'
      );
    END IF;
  END LOOP;

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

GRANT EXECUTE ON FUNCTION create_booking_atomic(TEXT,DATE,TEXT,INT,INT,TEXT,TEXT,TEXT)
  TO anon, authenticated, service_role;
