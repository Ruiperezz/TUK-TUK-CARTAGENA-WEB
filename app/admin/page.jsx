"use client";

import { useState, useEffect, useCallback } from "react";

const TOUR_NAMES = {
  city: "Cartagena City",
  bay: "Cartagena Bay",
};

const STATUS_LABELS = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

const STATUS_COLORS = {
  pending: "#C9A961",
  confirmed: "#6BCB77",
  cancelled: "#E74C3C",
};

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const ALL_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];

function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function isPast(dateStr) {
  return dateStr < todayStr();
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [tab, setTab] = useState("bookings");

  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [availability, setAvailability] = useState([]);

  // Slot-level blocking
  const [selectedDay, setSelectedDay] = useState(null); // "YYYY-MM-DD" or null
  const [blockedSlots, setBlockedSlots] = useState([]); // time_slot strings for selectedDay
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
    if (res.ok) {
      const data = await res.json();
      setBookings(data.bookings || []);
    }
  }, [filterStatus, filterDate, authHeaders]);

  const fetchAvailability = useCallback(async () => {
    const res = await fetch(`/api/admin/availability?month=${calMonth}`, { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json();
      setAvailability(data.availability || []);
    }
  }, [calMonth, authHeaders]);

  const fetchBlockedSlots = useCallback(async (date) => {
    setSlotsLoading(true);
    const res = await fetch(`/api/admin/availability?date=${date}`, { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json();
      setBlockedSlots(data.blocked_slots || []);
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
    const res = await fetch("/api/admin/bookings", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.ok) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const toggleDay = async (dateStr) => {
    if (isPast(dateStr)) return;
    const existing = availability.find((a) => a.date === dateStr);
    const currentlyBlocked = existing?.is_available === false;
    const newValue = currentlyBlocked;
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ date: dateStr, is_available: newValue }),
    });
    fetchAvailability();
  };

  const openDaySlots = (dateStr) => {
    if (isPast(dateStr)) return;
    setSelectedDay(dateStr);
    fetchBlockedSlots(dateStr);
  };

  const closeDaySlots = () => {
    setSelectedDay(null);
    setBlockedSlots([]);
  };

  const toggleSlot = async (slot) => {
    const isBlocked = blockedSlots.includes(slot);
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ date: selectedDay, time_slot: slot, blocked: !isBlocked }),
    });
    // Optimistic update
    setBlockedSlots((prev) =>
      isBlocked ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
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
      const available = !(avail?.is_available === false);
      const past = isPast(dateStr);
      days.push({ day: d, date: dateStr, available, past });
    }
    return days;
  };

  const changeMonth = (delta) => {
    const [y, m] = calMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setCalMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    setSelectedDay(null);
    setBlockedSlots([]);
  };

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F1419", fontFamily: "'Inter', system-ui, sans-serif" }}
      >
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
              required
            />
          </div>
          {authError && (
            <div style={{ color: "#C9A961", fontSize: "13px", marginBottom: "16px" }}>
              Contraseña incorrecta
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%", padding: "14px", background: "#C9A961", color: "#0F1419",
              fontSize: "13px", letterSpacing: "0.22em", textTransform: "uppercase",
              fontWeight: 600, border: "none", cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ background: "#0F1419", minHeight: "100vh", color: "#F8F6F1", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", borderBottom: "1px solid rgba(248,246,241,0.1)", paddingBottom: "16px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", letterSpacing: "0.18em", fontWeight: 500 }}>
            TUK·TUK <span style={{ color: "#C9A961" }}>ADMIN</span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {["bookings", "availability"].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSelectedDay(null); }}
                style={{
                  padding: "8px 20px", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase",
                  background: tab === t ? "#C9A961" : "transparent",
                  color: tab === t ? "#0F1419" : "#F8F6F1",
                  border: tab === t ? "none" : "1px solid rgba(248,246,241,0.15)",
                  cursor: "pointer",
                }}
              >
                {t === "bookings" ? "Reservas" : "Disponibilidad"}
              </button>
            ))}
          </div>
        </div>

        {/* BOOKINGS TAB */}
        {tab === "bookings" && (
          <div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ background: "#0B0E12", color: "#F8F6F1", border: "1px solid rgba(248,246,241,0.15)", padding: "8px 12px", fontSize: "13px" }}
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
              </select>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{ background: "#0B0E12", color: "#F8F6F1", border: "1px solid rgba(248,246,241,0.15)", padding: "8px 12px", fontSize: "13px", colorScheme: "dark" }}
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  style={{ color: "#C9A961", fontSize: "12px", background: "none", border: "none", cursor: "pointer" }}
                >
                  Limpiar fecha
                </button>
              )}
              <button
                onClick={fetchBookings}
                style={{ color: "#C9A961", fontSize: "12px", background: "none", border: "1px solid rgba(201,169,97,0.3)", padding: "8px 16px", cursor: "pointer" }}
              >
                Actualizar
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(248,246,241,0.15)" }}>
                    {["Estado", "Tour", "Fecha", "Hora", "Personas", "Total", "Cliente", "Email", "Creada"].map((h) => (
                      <th key={h} style={{ padding: "10px 8px", textAlign: "left", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(248,246,241,0.5)", fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid rgba(248,246,241,0.06)" }}>
                      <td style={{ padding: "10px 8px" }}>
                        <span style={{ color: STATUS_COLORS[b.status], fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          {STATUS_LABELS[b.status]}
                        </span>
                      </td>
                      <td style={{ padding: "10px 8px" }}>{TOUR_NAMES[b.tour] || b.tour}</td>
                      <td style={{ padding: "10px 8px" }}>{b.date}</td>
                      <td style={{ padding: "10px 8px" }}>{b.time_slot}</td>
                      <td style={{ padding: "10px 8px" }}>{b.adults} pax</td>
                      <td style={{ padding: "10px 8px", color: "#C9A961" }}>{b.total_price} €</td>
                      <td style={{ padding: "10px 8px" }}>{b.customer_name}</td>
                      <td style={{ padding: "10px 8px", opacity: 0.6 }}>{b.customer_email}</td>
                      <td style={{ padding: "10px 8px", opacity: 0.4, fontSize: "11px" }}>
                        {new Date(b.created_at).toLocaleDateString("es-ES")}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ padding: "40px", textAlign: "center", opacity: 0.4 }}>
                        No hay reservas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AVAILABILITY TAB */}
        {tab === "availability" && (
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", alignItems: "flex-start" }}>

            {/* Calendar column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <button
                  onClick={() => changeMonth(-1)}
                  style={{ background: "none", border: "1px solid rgba(248,246,241,0.15)", color: "#F8F6F1", padding: "6px 12px", cursor: "pointer", fontSize: "14px" }}
                >
                  ←
                </button>
                <span style={{ fontSize: "16px", fontWeight: 500, minWidth: "140px", textAlign: "center" }}>
                  {new Date(calMonth + "-01").toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                </span>
                <button
                  onClick={() => changeMonth(1)}
                  style={{ background: "none", border: "1px solid rgba(248,246,241,0.15)", color: "#F8F6F1", padding: "6px 12px", cursor: "pointer", fontSize: "14px" }}
                >
                  →
                </button>
              </div>

              <div style={{ fontSize: "11px", opacity: 0.45, marginBottom: "12px", lineHeight: 1.5 }}>
                <strong style={{ opacity: 0.8 }}>Clic derecho</strong> en un día → bloquear/desbloquear el día completo.<br />
                <strong style={{ opacity: 0.8 }}>Clic</strong> en un día → gestionar horarios individuales.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", maxWidth: "420px" }}>
                {DAYS.map((d) => (
                  <div key={d} style={{ padding: "8px", textAlign: "center", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.4 }}>
                    {d}
                  </div>
                ))}
                {getCalendarDays().map((cell, i) =>
                  cell === null ? (
                    <div key={`empty-${i}`} />
                  ) : (
                    <button
                      key={cell.date}
                      onClick={() => openDaySlots(cell.date)}
                      onContextMenu={(e) => { e.preventDefault(); toggleDay(cell.date); }}
                      disabled={cell.past}
                      title={cell.past ? "Día pasado" : "Clic: horarios · Clic derecho: bloquear día"}
                      style={{
                        padding: "10px 4px",
                        textAlign: "center",
                        fontSize: "13px",
                        background: cell.past
                          ? "transparent"
                          : selectedDay === cell.date
                            ? "rgba(201,169,97,0.25)"
                            : cell.available
                              ? "rgba(107,203,119,0.10)"
                              : "rgba(231,76,60,0.15)",
                        border: cell.past
                          ? "1px solid rgba(248,246,241,0.06)"
                          : selectedDay === cell.date
                            ? "1px solid #C9A961"
                            : cell.available
                              ? "1px solid rgba(107,203,119,0.3)"
                              : "1px solid rgba(231,76,60,0.4)",
                        color: cell.past
                          ? "rgba(248,246,241,0.2)"
                          : selectedDay === cell.date
                            ? "#C9A961"
                            : cell.available
                              ? "#6BCB77"
                              : "#E74C3C",
                        cursor: cell.past ? "default" : "pointer",
                      }}
                    >
                      {cell.day}
                    </button>
                  )
                )}
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: "16px", marginTop: "16px", fontSize: "11px", opacity: 0.5 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "10px", height: "10px", background: "rgba(107,203,119,0.3)", border: "1px solid rgba(107,203,119,0.5)", display: "inline-block" }} />
                  Abierto
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "10px", height: "10px", background: "rgba(231,76,60,0.3)", border: "1px solid rgba(231,76,60,0.5)", display: "inline-block" }} />
                  Día bloqueado
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "10px", height: "10px", background: "rgba(201,169,97,0.25)", border: "1px solid #C9A961", display: "inline-block" }} />
                  Seleccionado
                </span>
              </div>
            </div>

            {/* Slots panel */}
            {selectedDay && (
              <div style={{ flex: 1, minWidth: "260px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9A961", marginBottom: "4px" }}>
                      Horarios
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 500 }}>
                      {new Date(selectedDay + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                    </div>
                  </div>
                  <button
                    onClick={closeDaySlots}
                    style={{ background: "none", border: "none", color: "rgba(248,246,241,0.4)", fontSize: "18px", cursor: "pointer", padding: "4px 8px" }}
                    aria-label="Cerrar"
                  >
                    ✕
                  </button>
                </div>

                <div style={{ fontSize: "11px", opacity: 0.45, marginBottom: "16px" }}>
                  Haz clic en un horario para bloquearlo o desbloquearlo. Los horarios bloqueados no aparecen en el formulario de reservas.
                </div>

                {slotsLoading ? (
                  <div style={{ opacity: 0.4, fontSize: "13px" }}>Cargando…</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                    {ALL_SLOTS.map((slot) => {
                      const isBlocked = blockedSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          onClick={() => toggleSlot(slot)}
                          style={{
                            padding: "10px 8px",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: 500,
                            background: isBlocked ? "rgba(231,76,60,0.15)" : "rgba(107,203,119,0.10)",
                            border: isBlocked ? "1px solid rgba(231,76,60,0.5)" : "1px solid rgba(107,203,119,0.3)",
                            color: isBlocked ? "#E74C3C" : "#6BCB77",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          title={isBlocked ? "Clic para desbloquear" : "Clic para bloquear"}
                        >
                          {slot}
                          {isBlocked && <div style={{ fontSize: "9px", letterSpacing: "0.1em", marginTop: "2px", opacity: 0.8 }}>BLOQUEADO</div>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {blockedSlots.length > 0 && (
                  <div style={{ marginTop: "16px", fontSize: "12px", color: "#C9A961", opacity: 0.7 }}>
                    {blockedSlots.length} horario{blockedSlots.length > 1 ? "s" : ""} bloqueado{blockedSlots.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            )}

            {!selectedDay && (
              <div style={{ flex: 1, minWidth: "200px", opacity: 0.3, fontSize: "13px", paddingTop: "60px" }}>
                Selecciona un día del calendario para gestionar sus horarios.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
