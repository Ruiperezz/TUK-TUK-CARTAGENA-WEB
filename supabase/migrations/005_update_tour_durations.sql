-- Migration 005: Update city and bay tour duration from 2 slots to 1 slot (60 min each)
-- All tours are now 60 minutes.

CREATE OR REPLACE FUNCTION create_booking_atomic(
  p_tour        TEXT,
  p_date        DATE,
  p_time_slot   TEXT,
  p_adults      INT,
  p_email       TEXT,
  p_tuktuks     INT,
  p_total_price NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_fleet_size   INT := 3;
  v_duration     INT;
  v_all_slots    TEXT[] := ARRAY[
    '08:00','09:00','10:00','11:00','12:00','13:00',
    '14:00','15:00','16:00','17:00','18:00','19:00'
  ];
  v_slot_index   INT;
  v_busy         INT;
  v_booking_id   UUID;
BEGIN
  -- Advisory lock per date — prevents concurrent race conditions
  PERFORM pg_advisory_xact_lock(hashtext(p_date::text));

  -- All tours are now 60 min = 1 slot
  v_duration := CASE p_tour
    WHEN 'city'  THEN 1
    WHEN 'bay'   THEN 1
    WHEN 'myway' THEN 1
    ELSE 1
  END;

  v_slot_index := array_position(v_all_slots, p_time_slot) - 1;

  IF v_slot_index < 0 THEN
    RETURN jsonb_build_object('error', 'invalid_slot');
  END IF;

  -- Count tuk-tuks already busy at each slot this booking would occupy
  FOR i IN 0..(v_duration - 1) LOOP
    SELECT COALESCE(SUM(CEIL(adults::numeric / 4)), 0)
    INTO v_busy
    FROM bookings
    WHERE date = p_date
      AND status IN ('pending', 'confirmed')
      AND (
        array_position(v_all_slots, time_slot) - 1
        + CASE tour WHEN 'city' THEN 1 WHEN 'bay' THEN 1 ELSE 1 END
      ) > (v_slot_index + i)
      AND (array_position(v_all_slots, time_slot) - 1) <= (v_slot_index + i);

    IF (v_busy + p_tuktuks) > v_fleet_size THEN
      RETURN jsonb_build_object('error', 'no_availability');
    END IF;
  END LOOP;

  -- Insert the booking
  INSERT INTO bookings (tour, date, time_slot, adults, email, tuktuks, total_price, status)
  VALUES (p_tour, p_date, p_time_slot, p_adults, p_email, p_tuktuks, p_total_price, 'pending')
  RETURNING id INTO v_booking_id;

  RETURN jsonb_build_object('booking_id', v_booking_id);
END;
$$;

GRANT EXECUTE ON FUNCTION create_booking_atomic TO anon, authenticated, service_role;
