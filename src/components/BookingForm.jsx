"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, ArrowRight, AlertCircle } from "lucide-react";
import Reveal from "./Reveal";

const ALL_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];

function calcTuktuks(people) {
  return Math.ceil(people / 4);
}

const TOUR_NAMES = {
  city: "Cartagena City",
  bay: "Cartagena Bay",
  myway: "Cartagena My Way",
};

function formatDate(dateStr, lang) {
  if (!dateStr) return dateStr;
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString(
      lang === "de" ? "de-DE" : lang === "fr" ? "fr-FR" : lang === "en" ? "en-GB" : "es-ES",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    );
  } catch {
    return dateStr;
  }
}

export default function BookingForm({
  t,
  lang,
  bookingForm,
  setBookingForm,
  bookingDone,
  setBookingDone,
  onReset,
  successBooking,
}) {
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [slotsApiError, setSlotsApiError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

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

  const fetchDaySlots = useCallback(async (date) => {
    if (!date) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setSlotsLoading(true);
    setSlotsLoaded(false);
    setSlotsApiError(false);
    setAvailableSlots([]);
    setBookingForm((f) => ({ ...f, time: "" }));
    try {
      const res = await fetch(`/api/availability?date=${date}`, { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        setAvailableSlots(data.slots || []);
      } else {
        setSlotsApiError(true);
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      setSlotsApiError(true);
    } finally {
      if (!controller.signal.aborted) {
        setSlotsLoading(false);
        setSlotsLoaded(true);
      }
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
    } else {
      setSlotsLoaded(false);
      setSlotsApiError(false);
      setAvailableSlots([]);
    }
  };

  const tuktuks = calcTuktuks(bookingForm.people);
  const totalPrice = tuktuks * 120;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bookingForm.people < 1 || bookingForm.people > 12) return;

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
          tuktuks,
          name: bookingForm.name,
          email: bookingForm.email,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.booking.errorGeneric);
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(t.booking.errorGeneric);
        setLoading(false);
      }
    } catch {
      setError(t.booking.errorConnection);
      setLoading(false);
    }
  };

  const dateIsAvailable =
    !bookingForm.date ||
    availableDates.length === 0 ||
    availableDates.includes(bookingForm.date);

  // Show all slots when: not yet loaded, API error, or API returned empty (fail-open)
  // Only restrict slots when the API returned a non-empty list (partial availability)
  const isSlotAvailable = (slot) =>
    !slotsLoaded || slotsApiError || availableSlots.length === 0 || availableSlots.includes(slot);

  // Warning shown when API confirmed 0 slots (fully booked or admin-blocked)
  const noSlots = slotsLoaded && !slotsApiError && availableSlots.length === 0;

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
                  <div role="alert" className="flex items-center gap-2 mt-2 text-xs" style={{ color: "#C9A961" }}>
                    <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
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
                    const available = isSlotAvailable(slot);
                    return (
                      <option key={slot} value={slot} disabled={!available}>
                        {slot}{!available ? ` — ${t.booking.timeSlotFull}` : ""}
                      </option>
                    );
                  })}
                </select>
                {noSlots && (
                  <div role="alert" className="flex items-center gap-2 mt-2 text-xs" style={{ color: "#C9A961" }}>
                    <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                    <span>{t.booking.noSlots}</span>
                  </div>
                )}
              </div>
            </div>

            {/* People counter */}
            <div>
              <fieldset>
                <legend className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.people}
                </legend>
                <div className="flex items-center gap-6 pt-3">
                  <button
                    type="button"
                    aria-label={t.booking.decreasePeople}
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
                  <span className="serif text-3xl w-10 text-center" aria-live="polite" aria-atomic="true">
                    {bookingForm.people}
                  </span>
                  <button
                    type="button"
                    aria-label={t.booking.increasePeople}
                    disabled={bookingForm.people >= 12}
                    onClick={() =>
                      setBookingForm((f) => ({ ...f, people: Math.min(12, f.people + 1) }))
                    }
                    className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors disabled:opacity-30"
                  >
                    +
                  </button>
                  <span className="text-xs opacity-50 ml-2">{t.booking.peopleMax}</span>
                </div>
              </fieldset>
              {tuktuks > 1 && (
                <div
                  className="mt-3 text-[11px] tracking-[0.18em] uppercase"
                  style={{ color: "#C9A961" }}
                >
                  {tuktuks} {t.booking.tuktuksLabel}
                </div>
              )}
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
              <div role="alert" className="flex items-center gap-3 p-4 border border-cream/15" style={{ color: "#C9A961" }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Total + Submit */}
            <div className="pt-10 border-t border-cream/15">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-[11px] tracking-[0.28em] uppercase opacity-60">
                    {t.booking.total}
                  </span>
                  {tuktuks > 1 && (
                    <div className="text-xs opacity-50 mt-1">
                      {tuktuks} × 120 €
                    </div>
                  )}
                </div>
                <span
                  className="serif text-6xl md:text-7xl font-medium"
                  style={{ color: "#C9A961" }}
                >
                  {totalPrice} €
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
                {!loading && <ArrowRight className="w-4 h-4" aria-hidden="true" strokeWidth={2} />}
              </button>
              <div className="text-center mt-4 text-[10px] tracking-[0.28em] uppercase opacity-50">
                {t.booking.paymentMethods}
              </div>
            </div>
          </form>
        </Reveal>
      ) : (
        <Reveal>
          <div className="py-16">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-14">
              <div
                className="w-16 h-16 border-2 flex items-center justify-center mb-6"
                style={{ borderColor: "#C9A961" }}
              >
                <Check className="w-8 h-8" strokeWidth={1.5} style={{ color: "#C9A961" }} />
              </div>
              <div className="label-eyebrow mb-3" style={{ color: "#C9A961" }}>
                {t.booking.successEyebrow || "Pago completado"}
              </div>
              <h3 className="serif text-4xl md:text-6xl font-medium">
                {t.booking.success}
              </h3>
            </div>

            {/* Booking detail card */}
            {successBooking ? (
              <div
                className="max-w-lg mx-auto mb-12"
                style={{ border: "1px solid rgba(201,169,97,0.25)", background: "rgba(201,169,97,0.04)" }}
              >
                <div className="p-8">
                  {/* Tour name */}
                  <div className="mb-8 pb-8" style={{ borderBottom: "1px solid rgba(248,246,241,0.1)" }}>
                    <div className="text-[10px] tracking-[0.28em] uppercase opacity-50 mb-1">
                      {t.booking.tour}
                    </div>
                    <div className="serif text-2xl font-medium">
                      {TOUR_NAMES[successBooking.tour] || successBooking.tour}
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8 pb-8" style={{ borderBottom: "1px solid rgba(248,246,241,0.1)" }}>
                    <div>
                      <div className="text-[10px] tracking-[0.28em] uppercase opacity-50 mb-1">
                        {t.booking.date}
                      </div>
                      <div className="text-sm capitalize leading-snug">
                        {formatDate(successBooking.date, lang)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-[0.28em] uppercase opacity-50 mb-1">
                        {t.booking.time}
                      </div>
                      <div className="serif text-xl">{successBooking.time_slot}</div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-[0.28em] uppercase opacity-50 mb-1">
                        {t.booking.people}
                      </div>
                      <div className="serif text-xl">{successBooking.adults}</div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-[0.28em] uppercase opacity-50 mb-1">
                        {t.booking.total}
                      </div>
                      <div className="serif text-2xl font-medium" style={{ color: "#C9A961" }}>
                        {successBooking.total_price} €
                      </div>
                    </div>
                  </div>

                  {/* Confirmation note */}
                  <p className="text-sm opacity-60 leading-relaxed">{t.booking.successDesc}</p>
                </div>
              </div>
            ) : (
              <p className="text-center opacity-60 mb-12 max-w-md mx-auto">
                {t.booking.successDesc}
              </p>
            )}

            <div className="text-center">
              <button
                onClick={onReset}
                className="text-[11px] tracking-[0.28em] uppercase border-b pb-1 transition-colors hover-gold"
                style={{ borderColor: "#C9A961", color: "#C9A961" }}
              >
                {t.booking.reset}
              </button>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
