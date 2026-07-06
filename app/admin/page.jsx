"use client";

import { useState, useEffect, useCallback } from "react";

const TOUR_NAMES = {
  city: "Cartagena City",
  bay: "Cartagena Bay",
  myway: "Cartagena My Way",
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

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${password}`, "Content-Type": "application/json" }),
    [password]
  );

  const fetchBookings = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (filterDate) params.set("date", filterDate);
    const res = await fetch(`/api/admin/bookings?${params}`, {
      headers: authHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      setBookings(data.bookings || []);
    }
  }, [filterStatus, filterDate, authHeaders]);

  const fetchAvailability = useCallback(async () => {
    const res = await fetch(`/api/admin/availability?month=${calMonth}`, {
      headers: authHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      setAvailability(data.availability || []);
    }
  }, [calMonth, authHeaders]);

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
    // Open by default: click to block (is_available=false) or unblock (is_available=true)
    const existing = availability.find((a) => a.date === dateStr);
    const currentlyBlocked = existing?.is_available === false;
    const newValue = currentlyBlocked; // if blocked → set true (unblock), if open → set false (block)
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ date: dateStr, is_available: newValue }),
    });
    fetchAvailability();
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
      // Available unless explicitly blocked (is_available === false)
      const available = !(avail?.is_available === false);
      days.push({ day: d, date: dateStr, available });
    }
    return days;
  };

  const changeMonth = (delta) => {
    const [y, m] = calMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setCalMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F1419", fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <form onSubmit={handleLogin} className="w-full max-w-sm px-6">
          <div className="text-center mb-12">
            <div
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", letterSpacing: "0.18em", fontWeight: 500, color: "#F8F6F1" }}
            >
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
              width: "100%",
              padding: "14px",
              background: "#C9A961",
              color: "#0F1419",
              fontSize: "13px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", borderBottom: "1px solid rgba(248,246,241,0.1)", paddingBottom: "16px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", letterSpacing: "0.18em", fontWeight: 500 }}>
            TUK·TUK <span style={{ color: "#C9A961" }}>ADMIN</span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setTab("bookings")}
              style={{
                padding: "8px 20px",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                background: tab === "bookings" ? "#C9A961" : "transparent",
                color: tab === "bookings" ? "#0F1419" : "#F8F6F1",
                border: tab === "bookings" ? "none" : "1px solid rgba(248,246,241,0.15)",
                cursor: "pointer",
              }}
            >
              Reservas
            </button>
            <button
              onClick={() => setTab("availability")}
              style={{
                padding: "8px 20px",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                background: tab === "availability" ? "#C9A961" : "transparent",
                color: tab === "availability" ? "#0F1419" : "#F8F6F1",
                border: tab === "availability" ? "none" : "1px solid rgba(248,246,241,0.15)",
                cursor: "pointer",
              }}
            >
              Disponibilidad
            </button>
          </div>
        </div>

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
                      <td style={{ padding: "10px 8px" }}>{TOUR_NAMES[b.tour]}</td>
                      <td style={{ padding: "10px 8px" }}>{b.date}</td>
                      <td style={{ padding: "10px 8px" }}>{b.time_slot === "morning" ? "Mañana" : "Tarde"}</td>
                      <td style={{ padding: "10px 8px" }}>
                        {b.is_private ? "Privado" : `${b.adults}A${b.kids > 0 ? `+${b.kids}N` : ""}`}
                      </td>
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

        {tab === "availability" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
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

            <div style={{ fontSize: "12px", opacity: 0.5, marginBottom: "16px" }}>
              Todos los días están abiertos por defecto. Haz clic para bloquear un día (rojo = bloqueado, sin reservas).
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", maxWidth: "500px" }}>
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
                    onClick={() => toggleDay(cell.date)}
                    style={{
                      padding: "12px 8px",
                      textAlign: "center",
                      fontSize: "14px",
                      background: cell.available ? "rgba(107,203,119,0.12)" : "rgba(231,76,60,0.15)",
                      border: cell.available ? "1px solid rgba(107,203,119,0.3)" : "1px solid rgba(231,76,60,0.4)",
                      color: cell.available ? "#6BCB77" : "#E74C3C",
                      cursor: "pointer",
                    }}
                  >
                    {cell.day}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
