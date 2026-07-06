"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, ArrowRight, AlertCircle } from "lucide-react";
import Reveal from "./Reveal";

const ALL_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];

export default function BookingForm({
  t,
  lang,
  bookingForm,
  setBookingForm,
  bookingDone,
  setBookingDone,
  onReset,
}) {
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch available dates for the month (date picker hint)
  const fetchMonthAvailability = useCallback(async (dateStr) => {
    if (!dateStr) return;
    const month = dateStr.slice(0, 7);
    try {
      const res = await fetch(`/api/availability?month=${month}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableDates(data.dates || []);
      }
    } catch {}
  }, []);

  // Fetch available slots for a specific date
  const fetchDaySlots = useCallback(async (date) => {
    if (!date) return;
    setSlotsLoading(true);
    setAvailableSlots([]);
    setBookingForm((f) => ({ ...f, time: "" }));
    try {
      const res = await fetch(`/api/availability?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableSlots(data.slots || []);
      }
    } catch {}
    finally {
      setSlotsLoading(false);
    }
  }, [setBookingForm]);

  useEffect(() => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    fetchMonthAvailability(`${month}-01`);
  }, [fetchMonthAvailability]);

  const handleDateChange = (e) => {
    const val = e.target.value;
    setBookingForm((f) => ({ ...f, date: val, time: "" }));
    if (val) {
      fetchMonthAvailability(val);
      fetchDaySlots(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bookingForm.people < 1 || bookingForm.people > 4) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour: bookingForm.tour,
          date: bookingForm.date,
          time: bookingForm.time,
          people: bookingForm.people,
          name: bookingForm.name,
          email: bookingForm.email,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear reserva");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  };

  const dateIsAvailable =
    !bookingForm.date ||
    availableDates.length === 0 ||
    availableDates.includes(bookingForm.date);

  return (
    <section id="booking" className="px-6 md:px-16 py-24 md:py-32 max-w-5xl mx-auto">
      <Reveal>
        <div className="label-eyebrow mb-4">{t.booking.eyebrow}</div>
        <h2 className="serif text-5xl md:text-7xl font-medium mb-3">
          {t.booking.title}
        </h2>
        <p className="text-base md:text-lg opacity-60 mb-16">
          {t.booking.subtitle}
        </p>
      </Reveal>

      {!bookingDone ? (
        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Tour selector */}
            <div>
              <label htmlFor="booking-tour" className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                {t.booking.tour}
              </label>
              <select
                id="booking-tour"
                name="tour"
                required
                value={bookingForm.tour}
                onChange={(e) =>
                  setBookingForm((f) => ({ ...f, tour: e.target.value }))
                }
                className="input-base"
              >
                <option value="">{t.booking.tourPlaceholder}</option>
                {t.tours.list.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.name} — {tour.duration} {t.tours.duration}
                  </option>
                ))}
              </select>
            </div>

            {/* Date + Time */}
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label htmlFor="booking-date" className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.date}
                </label>
                <input
                  id="booking-date"
                  type="date"
                  name="date"
                  required
                  autoComplete="off"
                  value={bookingForm.date}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="input-base"
                  style={{ colorScheme: "dark" }}
                />
                {bookingForm.date && !dateIsAvailable && (
                  <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "#C9A961" }}>
                    <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{t.booking.dateUnavailable}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="booking-time" className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.time}
                </label>
                <select
                  id="booking-time"
                  name="time"
                  required
                  value={bookingForm.time}
                  onChange={(e) =>
                    setBookingForm((f) => ({ ...f, time: e.target.value }))
                  }
                  className="input-base"
                  disabled={!bookingForm.date || slotsLoading}
                >
                  <option value="">
                    {slotsLoading ? "..." : t.booking.timePlaceholder}
                  </option>
                  {bookingForm.date && !slotsLoading && ALL_SLOTS.map((slot) => {
                    const available = availableSlots.length === 0 || availableSlots.includes(slot);
                    return (
                      <option key={slot} value={slot} disabled={!available}>
                        {slot}{!available ? ` — ${t.booking.timeSlotFull}` : ""}
                      </option>
                    );
                  })}
                </select>
                {bookingForm.date && !slotsLoading && availableSlots.length === 0 && (
                  <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "#C9A961" }}>
                    <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{t.booking.noSlots}</span>
                  </div>
                )}
              </div>
            </div>

            {/* People counter */}
            <div>
              <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                {t.booking.people}
              </label>
              <div className="flex items-center gap-6 pt-3">
                <button
                  type="button"
                  aria-label="Quitar persona"
                  disabled={bookingForm.people <= 1}
                  onClick={() =>
                    setBookingForm((f) => ({
                      ...f,
                      people: Math.max(1, f.people - 1),
                    }))
                  }
                  className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors disabled:opacity-30"
                >
                  −
                </button>
                <span className="serif text-3xl w-10 text-center">
                  {bookingForm.people}
                </span>
                <button
                  type="button"
                  aria-label="Añadir persona"
                  disabled={bookingForm.people >= 4}
                  onClick={() =>
                    setBookingForm((f) => ({ ...f, people: Math.min(4, f.people + 1) }))
                  }
                  className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors disabled:opacity-30"
                >
                  +
                </button>
                <span className="text-xs opacity-50 ml-2">{t.booking.peopleMax}</span>
              </div>
            </div>

            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label htmlFor="booking-name" className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.name}
                </label>
                <input
                  id="booking-name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={bookingForm.name}
                  onChange={(e) =>
                    setBookingForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="input-base"
                />
              </div>
              <div>
                <label htmlFor="booking-email" className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.email}
                </label>
                <input
                  id="booking-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  value={bookingForm.email}
                  onChange={(e) =>
                    setBookingForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="input-base"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 border border-cream/15" style={{ color: "#C9A961" }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Total + Submit */}
            <div className="pt-10 border-t border-cream/15">
              <div className="flex items-end justify-between mb-8">
                <span className="text-[11px] tracking-[0.28em] uppercase opacity-60">
                  {t.booking.total}
                </span>
                <span
                  className="serif text-6xl md:text-7xl font-medium"
                  style={{ color: "#C9A961" }}
                >
                  120 €
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                style={{ background: "#C9A961", color: "#0F1419" }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = "#D9B971";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#C9A961";
                }}
              >
                <span className="text-sm tracking-[0.22em] uppercase font-semibold">
                  {loading ? "..." : t.booking.submit}
                </span>
                {!loading && <ArrowRight className="w-4 h-4" strokeWidth={2} />}
              </button>
              <div className="text-center mt-4 text-[10px] tracking-[0.28em] uppercase opacity-50">
                {t.booking.paymentMethods}
              </div>
            </div>
          </form>
        </Reveal>
      ) : (
        <Reveal>
          <div className="text-center py-20">
            <div
              className="w-20 h-20 border-2 mx-auto flex items-center justify-center mb-8"
              style={{ borderColor: "#C9A961" }}
            >
              <Check
                className="w-10 h-10"
                strokeWidth={1.5}
                style={{ color: "#C9A961" }}
              />
            </div>
            <h3 className="serif text-4xl md:text-5xl font-medium mb-4">
              {t.booking.success}
            </h3>
            <p className="opacity-70 mb-10 max-w-md mx-auto">
              {t.booking.successDesc}
            </p>
            <button
              onClick={onReset}
              className="text-[11px] tracking-[0.28em] uppercase border-b pb-1 transition-colors hover-gold"
              style={{ borderColor: "#C9A961", color: "#C9A961" }}
            >
              {t.booking.reset}
            </button>
          </div>
        </Reveal>
      )}
    </section>
  );
}
