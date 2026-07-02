"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, ArrowRight, AlertCircle, Info } from "lucide-react";
import Reveal from "./Reveal";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tracks whether the user explicitly toggled private (independent of forced logic)
  const [manualPrivate, setManualPrivate] = useState(false);

  const totalPax = bookingForm.adults + bookingForm.kids;
  const MAX_PAX = 8;

  // Exactly 4 → forced private (fills one tuk tuk)
  const forcedPrivate = totalPax === 4;
  // 5–8 → split mode: private(4) + shared(remainder)
  const splitMode = totalPax > 4 && totalPax <= MAX_PAX;
  // >8 → too large
  const tooManyPax = totalPax > MAX_PAX;

  // Sync bookingForm.isPrivate based on mode
  useEffect(() => {
    if (forcedPrivate || splitMode) {
      if (!bookingForm.isPrivate) setBookingForm((f) => ({ ...f, isPrivate: true }));
    } else if (!manualPrivate) {
      if (bookingForm.isPrivate) setBookingForm((f) => ({ ...f, isPrivate: false }));
    }
  }, [forcedPrivate, splitMode, manualPrivate, bookingForm.isPrivate, setBookingForm]);

  // Split pricing breakdown: private takes first 4 seats (adults first, then kids)
  const getSplitBreakdown = () => {
    const adultsInPrivate = Math.min(bookingForm.adults, 4);
    const kidsInPrivate = Math.min(bookingForm.kids, 4 - adultsInPrivate);
    const extraAdults = bookingForm.adults - adultsInPrivate;
    const extraKids = bookingForm.kids - kidsInPrivate;
    const sharedPrice = extraAdults * 30 + extraKids * 15;
    return { privatePrice: 120, sharedPrice, extraAdults, extraKids };
  };

  const calcTotal = () => {
    if (splitMode) {
      const { privatePrice, sharedPrice } = getSplitBreakdown();
      return privatePrice + sharedPrice;
    }
    if (bookingForm.isPrivate) return 120;
    return bookingForm.adults * 30 + bookingForm.kids * 15;
  };

  const fetchAvailability = useCallback(async (dateStr) => {
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

  useEffect(() => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    fetchAvailability(`${month}-01`);
  }, [fetchAvailability]);

  const handleDateChange = (e) => {
    const val = e.target.value;
    setBookingForm((f) => ({ ...f, date: val }));
    if (val) fetchAvailability(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bookingForm.adults < 1 || tooManyPax) return;

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
          adults: bookingForm.adults,
          kids: bookingForm.kids,
          isPrivate: bookingForm.isPrivate,
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

  const canAddAdult = bookingForm.adults < MAX_PAX && totalPax < MAX_PAX;
  const canAddKid = bookingForm.kids < MAX_PAX && totalPax < MAX_PAX;

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
            <div>
              <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                {t.booking.tour}
              </label>
              <select
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

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.date}
                </label>
                <input
                  type="date"
                  required
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
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.time}
                </label>
                <select
                  required
                  value={bookingForm.time}
                  onChange={(e) =>
                    setBookingForm((f) => ({ ...f, time: e.target.value }))
                  }
                  className="input-base"
                >
                  <option value=""></option>
                  <option value="morning">{t.booking.timeMorning}</option>
                  <option value="afternoon">{t.booking.timeAfternoon}</option>
                </select>
              </div>
            </div>

            {/* Passenger counters */}
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.adults}
                </label>
                <div className="flex items-center gap-6 pt-3">
                  <button
                    type="button"
                    aria-label="Quitar adulto"
                    onClick={() =>
                      setBookingForm((f) => ({
                        ...f,
                        adults: Math.max(1, f.adults - 1),
                      }))
                    }
                    className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors"
                  >
                    −
                  </button>
                  <span className="serif text-3xl w-10 text-center">
                    {bookingForm.adults}
                  </span>
                  <button
                    type="button"
                    aria-label="Añadir adulto"
                    disabled={!canAddAdult}
                    onClick={() =>
                      setBookingForm((f) => ({ ...f, adults: f.adults + 1 }))
                    }
                    className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.kids}
                </label>
                <div className="flex items-center gap-6 pt-3">
                  <button
                    type="button"
                    aria-label="Quitar niño"
                    onClick={() =>
                      setBookingForm((f) => ({
                        ...f,
                        kids: Math.max(0, f.kids - 1),
                      }))
                    }
                    className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors"
                  >
                    −
                  </button>
                  <span className="serif text-3xl w-10 text-center">
                    {bookingForm.kids}
                  </span>
                  <button
                    type="button"
                    aria-label="Añadir niño"
                    disabled={!canAddKid}
                    onClick={() =>
                      setBookingForm((f) => ({ ...f, kids: f.kids + 1 }))
                    }
                    className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* >8 error */}
            {tooManyPax && (
              <div className="flex items-center gap-3 p-4 border border-cream/15" style={{ color: "#C9A961" }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm">{t.booking.tooManyPax}</span>
              </div>
            )}

            {/* Split mode info panel (5–8 pax) */}
            {splitMode && (() => {
              const { privatePrice, sharedPrice, extraAdults, extraKids } = getSplitBreakdown();
              return (
                <div className="p-5 border border-cream/15 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase mb-3" style={{ color: "#C9A961" }}>
                    <Info className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    <span>{t.booking.splitInfo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">{t.booking.splitPrivate}</span>
                    <span className="font-medium">{privatePrice} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">
                      {t.booking.splitShared} ({extraAdults > 0 ? `${extraAdults} ${t.booking.adults.toLowerCase()}` : ""}{extraAdults > 0 && extraKids > 0 ? " + " : ""}{extraKids > 0 ? `${extraKids} ${t.booking.kids.toLowerCase()}` : ""})
                    </span>
                    <span className="font-medium">{sharedPrice} €</span>
                  </div>
                </div>
              );
            })()}

            {/* Private checkbox — hidden in split mode */}
            {!splitMode && (
              <label
                className={`flex items-start gap-5 p-6 border transition-colors ${
                  forcedPrivate ? "cursor-default" : "cursor-pointer"
                }`}
                style={{
                  borderColor: bookingForm.isPrivate
                    ? "#C9A961"
                    : "rgba(248,246,241,0.15)",
                }}
              >
                <input
                  type="checkbox"
                  checked={bookingForm.isPrivate}
                  disabled={forcedPrivate}
                  onChange={(e) => {
                    setManualPrivate(e.target.checked);
                  }}
                  className="sr-only"
                />
                <div
                  className="w-5 h-5 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors"
                  style={{
                    borderColor: bookingForm.isPrivate
                      ? "#C9A961"
                      : "rgba(248,246,241,0.4)",
                    background: bookingForm.isPrivate ? "#C9A961" : "transparent",
                  }}
                >
                  {bookingForm.isPrivate && (
                    <Check
                      className="w-3.5 h-3.5"
                      strokeWidth={3}
                      style={{ color: "#0F1419" }}
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium mb-1">{t.booking.private}</div>
                  <div className="text-xs opacity-60">{t.booking.privateDesc}</div>
                </div>
              </label>
            )}

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.name}
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) =>
                    setBookingForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="input-base"
                />
              </div>
              <div>
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.booking.email}
                </label>
                <input
                  type="email"
                  required
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

            <div className="pt-10 border-t border-cream/15">
              <div className="flex items-end justify-between mb-8">
                <span className="text-[11px] tracking-[0.28em] uppercase opacity-60">
                  {t.booking.total}
                </span>
                <span
                  className="serif text-6xl md:text-7xl font-medium"
                  style={{ color: "#C9A961" }}
                >
                  {calcTotal()} €
                </span>
              </div>
              <button
                type="submit"
                disabled={loading || tooManyPax}
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
