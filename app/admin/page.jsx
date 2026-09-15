"use client";

import { useState, useEffect, useCallback } from "react";

const TOUR_NAMES = { city: "Cartagena City", bay: "Cartagena Bay" };
const STATUS_LABELS = { pending: "Pendiente", confirmed: "Confirmada", cancelled: "Cancelada", abandoned: "Abandonada" };
const STATUS_COLORS = { pending: "#C9A961", confirmed: "#6BCB77", cancelled: "#E74C3C", abandoned: "rgba(248,246,241,0.3)" };
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const FLEET = 3;

const ALL_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];

function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function isPast(dateStr) { return dateStr < todayStr(); }

// Dots indicator: ●●○ = 2 of 3 blocked
function TukDots({ blocked, total = FLEET, size = 8 }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px", verticalAlign: "middle" }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          width: size, height: size, borderRadius: "50%",
          background: i < blocked ? "#E74C3C" : "rgba(107,203,119,0.5)",
          display: "inline-block",
        }} />
      ))}
    </span>
  );
}

// Selector: 0 1 2 3 buttons
function CountSelector({ value, max = FLEET, onChange, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {label && <span style={{ fontSize: "11px", opacity: 0.5, marginRight: "4px" }}>{label}</span>}
      {Array.from({ length: max + 1 }).map((_, n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            width: "28px", height: "28px", fontSize: "12px", fontWeight: 600,
            background: value === n ? (n === 0 ? "#6BCB77" : n === max ? "#E74C3C" : "#C9A961") : "rgba(248,246,241,0.06)",
            color: value === n ? "#0F1419" : "rgba(248,246,241,0.5)",
            border: value === n ? "none" : "1px solid rgba(248,246,241,0.12)",
            cursor: "pointer",
          }}
        >
          {n}
        </button>
      ))}
      <span style={{ fontSize: "10px", opacity: 0.4, marginLeft: "4px" }}>bloqueados</span>
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [tab, setTab] = useState("bookings");

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Availability
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [availability, setAvailability] = useState([]); // [{date, is_available, blocked_tuktuks}]

  // Selected day panel
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayBlockedCount, setDayBlockedCount] = useState(0); // 0-3, day-level
  const [slotBlocked, setSlotBlocked] = useState({}); // { "08:00": 2, ... }
  const [slotsLoading, setSlotsLoading] = useState(false);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${password}`, "Content-Type": "application/json" }),
    [password]
  );

  const fetchBookings = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (filterDate) params.set("date", filterDate);
    const res = await fetch(`/api/admin/bookings?${params}`, { headers: authHeaders() });
    if (res.ok) { const data = await res.json(); setBookings(data.bookings || []); }
  }, [filterStatus, filterDate, authHeaders]);

  const fetchAvailability = useCallback(async () => {
    const res = await fetch(`/api/admin/availability?month=${calMonth}`, { headers: authHeaders() });
    if (res.ok) { const data = await res.json(); setAvailability(data.availability || []); }
  }, [calMonth, authHeaders]);

  const fetchDayDetail = useCallback(async (date) => {
    setSlotsLoading(true);
    const res = await fetch(`/api/admin/availability?date=${date}`, { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json();
      setDayBlockedCount(data.day_blocked_tuktuks ?? 0);
      const map = {};
      for (const s of (data.blocked_slots || [])) map[s.time_slot] = s.blocked_tuktuks;
      setSlotBlocked(map);
    }
    setSlotsLoading(false);
  }, [authHeaders]);

  useEffect(() => {
    if (!authenticated) return;
    if (tab === "bookings") fetchBookings();
    else fetchAvailability();
  }, [authenticated, tab, fetchBookings, fetchAvailability]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/bookings", { headers: { Authorization: `Bearer ${password}` } });
    if (res.ok) { setAuthenticated(true); setAuthError(false); }
    else setAuthError(true);
  };

  // ── Day-level block ────────────────────────────────────────────────────────
  const setDayBlock = async (dateStr, count) => {
    if (isPast(dateStr)) return;
    if (count === 0) {
      await fetch("/api/admin/availability", {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ date: dateStr, is_available: true }),
      });
    } else {
      await fetch("/api/admin/availability", {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ date: dateStr, blocked_tuktuks: count }),
      });
    }
    setDayBlockedCount(count);
    fetchAvailability();
  };

  // ── Slot-level block ───────────────────────────────────────────────────────
  const setSlotBlock = async (slot, count) => {
    if (!selectedDay) return;
    await fetch("/api/admin/availability", {
      method: "POST", headers: authHeaders(),
      body: JSON.stringify({ date: selectedDay, time_slot: slot, blocked_tuktuks: count }),
    });
    setSlotBlocked((prev) => ({ ...prev, [slot]: count }));
  };

  const openDayPanel = (dateStr) => {
    if (isPast(dateStr)) return;
    setSelectedDay(dateStr);
    fetchDayDetail(dateStr);
  };

  const closeDayPanel = () => { setSelectedDay(null); setSlotBlocked({}); setDayBlockedCount(0); };

  const changeMonth = (delta) => {
    const [y, m] = calMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setCalMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    closeDayPanel();
  };

  const getCalendarDays = () => {
    const [year, month] = calMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= lastDay; d++) {
      const dateStr = `${calMonth}-${String(d).padStart(2, "0")}`;
      const avail = availability.find((a) => a.date === dateStr);
      const blockedCount = avail?.is_available === false ? (avail.blocked_tuktuks ?? 3) : 0;
      days.push({ day: d, date: dateStr, blockedCount, past: isPast(dateStr) });
    }
    return days;
  };

  // ── Colours for calendar cell ──────────────────────────────────────────────
  function cellStyle(cell) {
    if (cell.past) return {
      bg: "transparent", border: "1px solid rgba(248,246,241,0.06)",
      color: "rgba(248,246,241,0.2)", cursor: "default",
    };
    const selected = selectedDay === cell.date;
    if (selected) return {
      bg: "rgba(201,169,97,0.2)", border: "1px solid #C9A961",
      color: "#C9A961", cursor: "pointer",
    };
    if (cell.blockedCount === 0) return {
      bg: "rgba(107,203,119,0.08)", border: "1px solid rgba(107,203,119,0.25)",
      color: "#6BCB77", cursor: "pointer",
    };
    if (cell.blockedCount >= FLEET) return {
      bg: "rgba(231,76,60,0.13)", border: "1px solid rgba(231,76,60,0.4)",
      color: "#E74C3C", cursor: "pointer",
    };
    return {
      bg: "rgba(201,169,97,0.10)", border: "1px solid rgba(201,169,97,0.35)",
      color: "#C9A961", cursor: "pointer",
    };
  }

  // ── Colour for a slot button ───────────────────────────────────────────────
  function slotColor(blocked) {
    if (blocked === 0) return { bg: "rgba(107,203,119,0.08)", border: "1px solid rgba(107,203,119,0.25)", color: "#6BCB77" };
    if (blocked === 1) return { bg: "rgba(201,169,97,0.12)", border: "1px solid rgba(201,169,97,0.4)", color: "#C9A961" };
    if (blocked === 2) return { bg: "rgba(231,130,60,0.12)", border: "1px solid rgba(231,130,60,0.4)", color: "#E8874A" };
    return { bg: "rgba(231,76,60,0.13)", border: "1px solid rgba(231,76,60,0.4)", color: "#E74C3C" };
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F1419", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <form onSubmit={handleLogin} className="w-full max-w-sm px-6">
          <div className="text-center mb-12">
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", letterSpacing: "0.18em", fontWeight: 500, color: "#F8F6F1" }}>
              TUK·TUK <span style={{ color: "#C9A961" }}>CARTAGENA</span>
            </div>
            <div style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#C9A961", marginTop: "16px" }}>
              Panel de administración
            </div>
          </div>
          <div className="mb-6">
            <label style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(248,246,241,0.6)", display: "block", marginBottom: "8px" }}>
              Contraseña
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-base" required />
          </div>
          {authError && <div style={{ color: "#C9A961", fontSize: "13px", marginBottom: "16px" }}>Contraseña incorrecta</div>}
          <button type="submit" style={{ width: "100%", padding: "14px", background: "#C9A961", color: "#0F1419", fontSize: "13px", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, border: "none", cursor: "pointer" }}>
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // ── MAIN ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#0F1419", minHeight: "100vh", color: "#F8F6F1", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", borderBottom: "1px solid rgba(248,246,241,0.1)", paddingBottom: "16px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", letterSpacing: "0.18em", fontWeight: 500 }}>
            TUK·TUK <span style={{ color: "#C9A961" }}>ADMIN</span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {["bookings", "availability"].map((t) => (
              <button key={t} onClick={() => { setTab(t); closeDayPanel(); }}
                style={{ padding: "8px 20px", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", background: tab === t ? "#C9A961" : "transparent", color: tab === t ? "#0F1419" : "#F8F6F1", border: tab === t ? "none" : "1px solid rgba(248,246,241,0.15)", cursor: "pointer" }}>
                {t === "bookings" ? "Reservas" : "Disponibilidad"}
              </button>
            ))}
          </div>
        </div>

        {/* ── RESERVAS ─────────────────────────────────────────────────────── */}
        {tab === "bookings" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                style={{ background: "#0B0E12", color: "#F8F6F1", border: "1px solid rgba(248,246,241,0.15)", padding: "8px 12px", fontSize: "13px" }}>
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
                <option value="abandoned">Abandonada</option>
              </select>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                style={{ background: "#0B0E12", color: "#F8F6F1", border: "1px solid rgba(248,246,241,0.15)", padding: "8px 12px", fontSize: "13px", colorScheme: "dark" }} />
              {filterDate && <button onClick={() => setFilterDate("")} style={{ color: "#C9A961", fontSize: "12px", background: "none", border: "none", cursor: "pointer" }}>Limpiar</button>}
              <button onClick={fetchBookings} style={{ color: "#C9A961", fontSize: "12px", background: "none", border: "1px solid rgba(201,169,97,0.3)", padding: "8px 16px", cursor: "pointer" }}>Actualizar</button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(248,246,241,0.15)" }}>
                    {["Estado", "Tour", "Fecha", "Hora", "Personas", "Total", "Cliente", "Email", "Creada"].map((h) => (
                      <th key={h} style={{ padding: "10px 8px", textAlign: "left", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(248,246,241,0.5)", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid rgba(248,246,241,0.06)" }}>
                      <td style={{ padding: "10px 8px" }}><span style={{ color: STATUS_COLORS[b.status], fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>{STATUS_LABELS[b.status] || b.status}</span></td>
                      <td style={{ padding: "10px 8px" }}>{TOUR_NAMES[b.tour] || b.tour}</td>
                      <td style={{ padding: "10px 8px" }}>{b.date}</td>
                      <td style={{ padding: "10px 8px" }}>{b.time_slot}</td>
                      <td style={{ padding: "10px 8px" }}>{b.adults} pax</td>
                      <td style={{ padding: "10px 8px", color: "#C9A961" }}>{b.total_price} €</td>
                      <td style={{ padding: "10px 8px" }}>{b.customer_name}</td>
                      <td style={{ padding: "10px 8px", opacity: 0.6 }}>{b.customer_email}</td>
                      <td style={{ padding: "10px 8px", opacity: 0.4, fontSize: "11px" }}>{new Date(b.created_at).toLocaleDateString("es-ES")}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={9} style={{ padding: "40px", textAlign: "center", opacity: 0.4 }}>No hay reservas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DISPONIBILIDAD ────────────────────────────────────────────────── */}
        {tab === "availability" && (
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", alignItems: "flex-start" }}>

            {/* Calendar */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <button onClick={() => changeMonth(-1)} style={{ background: "none", border: "1px solid rgba(248,246,241,0.15)", color: "#F8F6F1", padding: "6px 12px", cursor: "pointer", fontSize: "14px" }}>←</button>
                <span style={{ fontSize: "16px", fontWeight: 500, minWidth: "140px", textAlign: "center" }}>
                  {new Date(calMonth + "-01").toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                </span>
                <button onClick={() => changeMonth(1)} style={{ background: "none", border: "1px solid rgba(248,246,241,0.15)", color: "#F8F6F1", padding: "6px 12px", cursor: "pointer", fontSize: "14px" }}>→</button>
              </div>

              <div style={{ fontSize: "11px", opacity: 0.4, marginBottom: "12px" }}>
                Clic en un día para gestionar sus tuk tuks disponibles.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", maxWidth: "420px" }}>
                {DAYS.map((d) => (
                  <div key={d} style={{ padding: "6px", textAlign: "center", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.35 }}>{d}</div>
                ))}
                {getCalendarDays().map((cell, i) =>
                  cell === null ? <div key={`e-${i}`} /> : (() => {
                    const cs = cellStyle(cell);
                    return (
                      <button key={cell.date} onClick={() => openDayPanel(cell.date)} disabled={cell.past} title={cell.past ? "Día pasado" : `${FLEET - cell.blockedCount} tuk tuk${FLEET - cell.blockedCount !== 1 ? "s" : ""} disponibles`}
                        style={{ padding: "8px 4px", textAlign: "center", fontSize: "13px", background: cs.bg, border: cs.border, color: cs.color, cursor: cs.cursor }}>
                        <div>{cell.day}</div>
                        {!cell.past && cell.blockedCount > 0 && (
                          <div style={{ marginTop: "3px" }}><TukDots blocked={cell.blockedCount} size={5} /></div>
                        )}
                      </button>
                    );
                  })()
                )}
              </div>

              {/* Legend */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "16px", fontSize: "11px", opacity: 0.5 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", background: "rgba(107,203,119,0.3)", border: "1px solid rgba(107,203,119,0.5)", display: "inline-block" }} />3 disponibles (libre)</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", background: "rgba(201,169,97,0.2)", border: "1px solid rgba(201,169,97,0.4)", display: "inline-block" }} />1-2 disponibles (parcial)</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", background: "rgba(231,76,60,0.2)", border: "1px solid rgba(231,76,60,0.4)", display: "inline-block" }} />0 disponibles (bloqueado)</span>
              </div>
            </div>

            {/* Day panel */}
            {selectedDay ? (
              <div style={{ flex: 1, minWidth: "300px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9A961", marginBottom: "4px" }}>Gestión de tuk tuks</div>
                    <div style={{ fontSize: "18px", fontWeight: 500 }}>
                      {new Date(selectedDay + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                    </div>
                  </div>
                  <button onClick={closeDayPanel} style={{ background: "none", border: "none", color: "rgba(248,246,241,0.4)", fontSize: "18px", cursor: "pointer", padding: "4px 8px" }} aria-label="Cerrar">✕</button>
                </div>

                {/* Day-level block */}
                <div style={{ padding: "16px", background: "#0B0E12", border: "1px solid rgba(248,246,241,0.08)", marginBottom: "24px" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.5, marginBottom: "12px" }}>
                    Bloqueo para todo el día
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.5, marginBottom: "12px", lineHeight: 1.5 }}>
                    Bloquea tuk tuks para <strong style={{ opacity: 1 }}>todos los horarios</strong> del día (p.ej. reserva privada de 1 tuk tuk todo el día).
                  </div>
                  <CountSelector value={dayBlockedCount} max={FLEET} onChange={(n) => setDayBlock(selectedDay, n)} />
                  {dayBlockedCount > 0 && (
                    <div style={{ marginTop: "10px", fontSize: "12px", color: dayBlockedCount >= FLEET ? "#E74C3C" : "#C9A961" }}>
                      {dayBlockedCount >= FLEET ? "Día completo bloqueado" : `${FLEET - dayBlockedCount} tuk tuk${FLEET - dayBlockedCount !== 1 ? "s" : ""} disponibles en todos los horarios`}
                    </div>
                  )}
                </div>

                {/* Slot-level blocks */}
                <div style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.5, marginBottom: "12px" }}>
                  Bloqueo por horario
                </div>
                <div style={{ fontSize: "12px", opacity: 0.5, marginBottom: "16px", lineHeight: 1.5 }}>
                  Indica cuántos tuk tuks bloqueas en cada horario. El total bloqueado es día + horario (máx. 3).
                </div>

                {slotsLoading ? (
                  <div style={{ opacity: 0.4, fontSize: "13px" }}>Cargando…</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {ALL_SLOTS.map((slot) => {
                      const slotCount = slotBlocked[slot] ?? 0;
                      const totalBlocked = Math.min(FLEET, dayBlockedCount + slotCount);
                      const available = Math.max(0, FLEET - totalBlocked);
                      const sc = slotColor(totalBlocked);
                      return (
                        <div key={slot} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: sc.bg, border: sc.border }}>
                          <span style={{ fontWeight: 600, fontSize: "14px", color: sc.color, minWidth: "46px" }}>{slot}</span>
                          <TukDots blocked={totalBlocked} size={9} />
                          <span style={{ fontSize: "11px", color: sc.color, minWidth: "90px" }}>
                            {available === 0 ? "Sin disponibilidad" : `${available} disponible${available !== 1 ? "s" : ""}`}
                          </span>
                          <div style={{ marginLeft: "auto" }}>
                            <CountSelector value={slotCount} max={FLEET} onChange={(n) => setSlotBlock(slot, n)} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, minWidth: "200px", opacity: 0.3, fontSize: "13px", paddingTop: "60px" }}>
                Selecciona un día del calendario para gestionar los tuk tuks disponibles.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
