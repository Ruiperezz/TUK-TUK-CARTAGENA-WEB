-- Tabla para bloquear horarios individuales dentro de un día
CREATE TABLE IF NOT EXISTS blocked_slots (
  date      DATE  NOT NULL,
  time_slot TEXT  NOT NULL,
  PRIMARY KEY (date, time_slot)
);

ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blocked_slots_deny_anon"
  ON blocked_slots
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
