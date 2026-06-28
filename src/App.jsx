import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight, ArrowRight, Check, AlertCircle } from "lucide-react";
import { I18N, LANGS } from "./i18n/translations.js";

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — reveal on scroll
// ─────────────────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 900ms cubic-bezier(.22,.61,.36,1) ${delay}ms, transform 900ms cubic-bezier(.22,.61,.36,1) ${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // Auto-detect browser language on mount
  const [lang, setLang] = useState("es");
  useEffect(() => {
    const browser = (navigator.language || "es").slice(0, 2);
    if (["es", "en", "de", "fr"].includes(browser)) setLang(browser);
  }, []);
  const t = I18N[lang];

  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactDone, setContactDone] = useState(false);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    tour: "",
    date: "",
    time: "",
    adults: 1,
    kids: 0,
    isPrivate: false,
    name: "",
    email: ""
  });
  const [bookingDone, setBookingDone] = useState(false);

  // Total price calculator
  const calcTotal = () => {
    if (bookingForm.isPrivate) return 120;
    return bookingForm.adults * 30 + bookingForm.kids * 15;
  };

  // Smooth scroll to section
  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (bookingForm.adults < 1) return;
    // NOTE: Aquí iría la llamada a la API real (Stripe + Resend)
    setBookingDone(true);
  };

  const resetBooking = () => {
    setBookingForm({
      tour: "",
      date: "",
      time: "",
      adults: 1,
      kids: 0,
      isPrivate: false,
      name: "",
      email: ""
    });
    setBookingDone(false);
  };

  // ───────────────────────── RENDER ─────────────────────────
  return (
    <div className="min-h-screen text-cream bg-bg-primary" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ─────────── HEADER FIJO ─────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-5 flex items-center justify-between"
        style={{
          background: "linear-gradient(180deg, rgba(15,20,25,0.85) 0%, rgba(15,20,25,0) 100%)",
          backdropFilter: "blur(6px)"
        }}
      >
        <button onClick={() => setMenuOpen(true)} className="flex items-center gap-3 group" aria-label="Abrir menú">
          <Menu className="w-5 h-5 group-hover:text-amber-200 transition-colors" strokeWidth={1.5} />
          <span className="text-[11px] tracking-[0.28em] uppercase font-medium hidden sm:inline">Menu</span>
        </button>

        <div className="serif text-base md:text-lg tracking-[0.18em] font-medium">
          TUK·TUK <span style={{ color: "#C9A961" }}>CARTAGENA</span>
        </div>

        <div className="flex items-center gap-1">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              aria-label={`Idioma ${l.label}`}
              className={`text-[11px] tracking-[0.18em] px-2 py-1 transition-colors ${
                lang === l.code ? "" : "opacity-40 hover:opacity-100"
              }`}
              style={{ color: lang === l.code ? "#C9A961" : undefined }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      {/* ─────────── MENU LATERAL ─────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-full md:w-[420px] h-full menu-slide flex flex-col px-8 md:px-12 py-10" style={{ background: "#0B0E12" }}>
            <div className="flex items-center justify-between mb-16">
              <span className="text-[11px] tracking-[0.28em] uppercase" style={{ color: "#C9A961" }}>
                {t.menu.close}
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
                <X className="w-5 h-5 hover:text-amber-200 transition-colors" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex flex-col gap-7 flex-1">
              {[
                { key: "home", id: "hero" },
                { key: "tours", id: "tours" },
                { key: "prices", id: "prices" },
                { key: "book", id: "booking" },
                { key: "about", id: "about" },
                { key: "contact", id: "contact" }
              ].map((item, i) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="text-left group flex items-baseline gap-4">
                  <span className="text-[11px] opacity-40 group-hover:opacity-100 transition-opacity">{String(i + 1).padStart(2, "0")}</span>
                  <span className="serif text-3xl md:text-4xl font-medium hover-gold transition-colors">{t.nav[item.key]}</span>
                </button>
              ))}
            </nav>

            <div className="pt-10 border-t border-cream/10">
              <div className="text-[10px] tracking-[0.28em] uppercase mb-3 opacity-50">{t.menu.lang}</div>
              <div className="flex gap-4">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className="text-sm tracking-[0.18em] transition-colors"
                    style={{ color: lang === l.code ? "#C9A961" : "rgba(248,246,241,0.5)" }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div onClick={() => setMenuOpen(false)} className="hidden md:block flex-1 bg-black/60" />
        </div>
      )}

      {/* ─────────── HERO ─────────── */}
      <section id="hero" className="relative h-screen min-h-[640px] flex flex-col justify-end overflow-hidden">
        {/* Placeholder de vídeo — sustituir por <video> real cuando llegue */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 30% 40%, #1a2f3f 0%, #0F1419 60%), linear-gradient(135deg, #0F1419 0%, #1a2530 100%)"
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(15,20,25,0) 0%, rgba(15,20,25,0.4) 60%, rgba(15,20,25,1) 100%)" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-25 select-none">
            <div className="border border-cream/30 px-6 py-3 inline-flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C9A961" }} />
              <span className="text-[10px] tracking-[0.28em] uppercase">Hero video placeholder</span>
            </div>
          </div>
          <div className="grain" />
        </div>

        <div className="relative z-10 px-6 md:px-16 pb-20 md:pb-28 max-w-7xl">
          <div className="label-eyebrow mb-5">{t.hero.eyebrow}</div>
          <h1 className="serif text-6xl md:text-8xl lg:text-9xl font-medium leading-[0.95] mb-8 max-w-5xl">
            {t.hero.title.split(" ").map((w, i, arr) => (
              <span key={i} className="inline-block">
                {i === 1 ? <em style={{ color: "#C9A961" }} className="italic">{w}</em> : w}
                {i < arr.length - 1 && " "}
              </span>
            ))}
          </h1>
          <p className="text-base md:text-xl text-cream/70 max-w-2xl mb-10 font-light leading-relaxed">{t.hero.subtitle}</p>
          <button
            onClick={() => scrollTo("booking")}
            className="group inline-flex items-center gap-4 px-8 py-4 border transition-all"
            style={{ borderColor: "#C9A961", color: "#C9A961" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#C9A961";
              e.currentTarget.style.color = "#0F1419";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#C9A961";
            }}
          >
            <span className="text-sm tracking-[0.2em] uppercase font-medium">{t.hero.cta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center scroll-bounce">
          <div className="text-[10px] tracking-[0.28em] uppercase opacity-50">{t.hero.scroll}</div>
          <div className="w-px h-10 bg-cream/30 mx-auto mt-2" />
        </div>
      </section>

      {/* ─────────── TOURS ─────────── */}
      <section id="tours" className="px-6 md:px-16 py-24 md:py-32 max-w-7xl mx-auto">
        <Reveal>
          <div className="label-eyebrow mb-4">{t.tours.eyebrow}</div>
          <h2 className="serif text-5xl md:text-7xl font-medium mb-20 max-w-3xl">{t.tours.title}</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(248,246,241,0.1)" }}>
          {t.tours.list.map((tour, idx) => (
            <Reveal key={tour.id} delay={idx * 120}>
              <article
                className="p-8 md:p-10 h-full flex flex-col group cursor-pointer transition-colors duration-500"
                style={{ background: "#0F1419" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#141A22")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0F1419")}
                onClick={() => {
                  setBookingForm((f) => ({ ...f, tour: tour.id }));
                  scrollTo("booking");
                }}
              >
                <div className="flex items-baseline justify-between mb-8">
                  <span className="serif text-5xl font-light italic opacity-25">0{idx + 1}</span>
                  <span className="text-[11px] tracking-[0.28em] uppercase" style={{ color: "#C9A961" }}>
                    {tour.duration} {t.tours.duration}
                  </span>
                </div>
                <h3 className="serif text-3xl md:text-4xl font-medium mb-2 leading-tight">{tour.name}</h3>
                <p className="text-sm italic opacity-60 mb-6 serif">{tour.tagline}</p>
                <p className="text-sm leading-relaxed text-cream/70 mb-8 flex-1">{tour.desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {tour.highlights.map((h) => (
                    <span key={h} className="text-[10px] tracking-[0.15em] uppercase px-3 py-1 border border-cream/15">
                      {h}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-auto group-hover:gap-5 transition-all" style={{ color: "#C9A961" }}>
                  <span className="text-[11px] tracking-[0.22em] uppercase">{t.tours.book}</span>
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────── PRECIOS ─────────── */}
      <section id="prices" className="px-6 md:px-16 py-24 md:py-32" style={{ background: "#0B0E12" }}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="label-eyebrow mb-4">{t.prices.eyebrow}</div>
            <h2 className="serif text-5xl md:text-7xl font-medium mb-20">{t.prices.title}</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <Reveal>
              <div>
                <div className="text-[11px] tracking-[0.28em] uppercase mb-8 opacity-60">{t.prices.perPersonTitle}</div>
                <div className="space-y-6">
                  <div className="flex items-baseline justify-between border-b border-cream/10 pb-5">
                    <span className="text-base md:text-lg">{t.prices.adult}</span>
                    <span className="serif text-3xl md:text-4xl font-medium" style={{ color: "#C9A961" }}>
                      {t.prices.adultPrice}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-cream/10 pb-5">
                    <span className="text-base md:text-lg">{t.prices.kid}</span>
                    <span className="serif text-3xl md:text-4xl font-medium" style={{ color: "#C9A961" }}>
                      {t.prices.kidPrice}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-xs opacity-60 pt-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-px" strokeWidth={1.5} />
                    <span>{t.prices.under2}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div>
                <div className="text-[11px] tracking-[0.28em] uppercase mb-8 opacity-60">{t.prices.privateTitle}</div>
                <div className="space-y-6">
                  <div className="flex items-baseline justify-between border-b border-cream/10 pb-5">
                    <span className="text-base md:text-lg">{t.prices.private4}</span>
                    <span className="serif text-3xl md:text-4xl font-medium" style={{ color: "#C9A961" }}>
                      {t.prices.private4Price}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-cream/10 pb-5 relative">
                    <div>
                      <span className="text-base md:text-lg opacity-50">{t.prices.private6}</span>
                      <div className="text-[10px] tracking-[0.22em] uppercase mt-1" style={{ color: "#C9A961" }}>
                        {t.prices.comingSoon}
                      </div>
                    </div>
                    <span className="serif text-3xl md:text-4xl font-medium opacity-30">{t.prices.private6Price}</span>
                  </div>
                  <div className="text-xs opacity-60 pt-2">{t.prices.payment}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────── BOOKING ─────────── */}
      <section id="booking" className="px-6 md:px-16 py-24 md:py-32 max-w-5xl mx-auto">
        <Reveal>
          <div className="label-eyebrow mb-4">{t.booking.eyebrow}</div>
          <h2 className="serif text-5xl md:text-7xl font-medium mb-3">{t.booking.title}</h2>
          <p className="text-base md:text-lg opacity-60 mb-16">{t.booking.subtitle}</p>
        </Reveal>

        {!bookingDone ? (
          <Reveal delay={120}>
            <form onSubmit={handleBook} className="space-y-10">
              {/* Tour */}
              <div>
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.booking.tour}</label>
                <select
                  required
                  value={bookingForm.tour}
                  onChange={(e) => setBookingForm((f) => ({ ...f, tour: e.target.value }))}
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

              {/* Fecha + Hora */}
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.booking.date}</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm((f) => ({ ...f, date: e.target.value }))}
                    className="input-base"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.booking.time}</label>
                  <select
                    required
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm((f) => ({ ...f, time: e.target.value }))}
                    className="input-base"
                  >
                    <option value=""></option>
                    <option value="morning">{t.booking.timeMorning}</option>
                    <option value="afternoon">{t.booking.timeAfternoon}</option>
                  </select>
                </div>
              </div>

              {/* Personas */}
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.booking.adults}</label>
                  <div className="flex items-center gap-6 pt-3">
                    <button
                      type="button"
                      aria-label="Quitar adulto"
                      onClick={() => setBookingForm((f) => ({ ...f, adults: Math.max(1, f.adults - 1) }))}
                      className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors"
                    >
                      −
                    </button>
                    <span className="serif text-3xl w-10 text-center">{bookingForm.adults}</span>
                    <button
                      type="button"
                      aria-label="Añadir adulto"
                      onClick={() => setBookingForm((f) => ({ ...f, adults: Math.min(8, f.adults + 1) }))}
                      className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.booking.kids}</label>
                  <div className="flex items-center gap-6 pt-3">
                    <button
                      type="button"
                      aria-label="Quitar niño"
                      onClick={() => setBookingForm((f) => ({ ...f, kids: Math.max(0, f.kids - 1) }))}
                      className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors"
                    >
                      −
                    </button>
                    <span className="serif text-3xl w-10 text-center">{bookingForm.kids}</span>
                    <button
                      type="button"
                      aria-label="Añadir niño"
                      onClick={() => setBookingForm((f) => ({ ...f, kids: Math.min(8, f.kids + 1) }))}
                      className="w-10 h-10 border border-cream/20 hover:border-amber-200/60 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Privado */}
              <label
                className="flex items-start gap-5 p-6 border cursor-pointer transition-colors"
                style={{ borderColor: bookingForm.isPrivate ? "#C9A961" : "rgba(248,246,241,0.15)" }}
              >
                <input
                  type="checkbox"
                  checked={bookingForm.isPrivate}
                  onChange={(e) => setBookingForm((f) => ({ ...f, isPrivate: e.target.checked }))}
                  className="sr-only"
                />
                <div
                  className="w-5 h-5 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors"
                  style={{
                    borderColor: bookingForm.isPrivate ? "#C9A961" : "rgba(248,246,241,0.4)",
                    background: bookingForm.isPrivate ? "#C9A961" : "transparent"
                  }}
                >
                  {bookingForm.isPrivate && <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: "#0F1419" }} />}
                </div>
                <div>
                  <div className="font-medium mb-1">{t.booking.private}</div>
                  <div className="text-xs opacity-60">{t.booking.privateDesc}</div>
                </div>
              </label>

              {/* Nombre + Email */}
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.booking.name}</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm((f) => ({ ...f, name: e.target.value }))}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.booking.email}</label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm((f) => ({ ...f, email: e.target.value }))}
                    className="input-base"
                  />
                </div>
              </div>

              {/* Total + Submit */}
              <div className="pt-10 border-t border-cream/15">
                <div className="flex items-end justify-between mb-8">
                  <span className="text-[11px] tracking-[0.28em] uppercase opacity-60">{t.booking.total}</span>
                  <span className="serif text-6xl md:text-7xl font-medium" style={{ color: "#C9A961" }}>
                    {calcTotal()} €
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full py-5 transition-all flex items-center justify-center gap-3"
                  style={{ background: "#C9A961", color: "#0F1419" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#D9B971")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#C9A961")}
                >
                  <span className="text-sm tracking-[0.22em] uppercase font-semibold">{t.booking.submit}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </button>
                <div className="text-center mt-4 text-[10px] tracking-[0.28em] uppercase opacity-50">{t.booking.paymentMethods}</div>
              </div>
            </form>
          </Reveal>
        ) : (
          <Reveal>
            <div className="text-center py-20">
              <div className="w-20 h-20 border-2 mx-auto flex items-center justify-center mb-8" style={{ borderColor: "#C9A961" }}>
                <Check className="w-10 h-10" strokeWidth={1.5} style={{ color: "#C9A961" }} />
              </div>
              <h3 className="serif text-4xl md:text-5xl font-medium mb-4">{t.booking.success}</h3>
              <p className="opacity-70 mb-10 max-w-md mx-auto">{t.booking.successDesc}</p>
              <button
                onClick={resetBooking}
                className="text-[11px] tracking-[0.28em] uppercase border-b pb-1 transition-colors hover-gold"
                style={{ borderColor: "#C9A961", color: "#C9A961" }}
              >
                {t.booking.reset}
              </button>
            </div>
          </Reveal>
        )}
      </section>

      {/* ─────────── ABOUT ─────────── */}
      <section id="about" className="px-6 md:px-16 py-24 md:py-32" style={{ background: "#0B0E12" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="label-eyebrow mb-4">{t.about.eyebrow}</div>
            <h2 className="serif text-4xl md:text-6xl font-medium mb-12 leading-tight max-w-3xl">{t.about.title}</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-lg md:text-xl leading-relaxed text-cream/70 max-w-3xl font-light">{t.about.body}</p>
          </Reveal>
        </div>
      </section>

      {/* ─────────── INFO PRÁCTICA ─────────── */}
      <section className="px-6 md:px-16 py-24 md:py-32 max-w-7xl mx-auto">
        <Reveal>
          <div className="label-eyebrow mb-4">{t.practical.eyebrow}</div>
          <h2 className="serif text-4xl md:text-6xl font-medium mb-16">{t.practical.title}</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-px" style={{ background: "rgba(248,246,241,0.1)" }}>
          {t.practical.items.map((item, idx) => (
            <Reveal key={idx} delay={idx * 80}>
              <div className="p-8 md:p-10" style={{ background: "#0F1419" }}>
                <div className="text-[11px] tracking-[0.28em] uppercase mb-3" style={{ color: "#C9A961" }}>
                  {item.label}
                </div>
                <div className="text-lg leading-relaxed">{item.value}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────── CONTACTO ─────────── */}
      <section id="contact" className="px-6 md:px-16 py-24 md:py-32" style={{ background: "#0B0E12" }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="label-eyebrow mb-4">{t.contact.eyebrow}</div>
            <h2 className="serif text-5xl md:text-7xl font-medium mb-3">{t.contact.title}</h2>
            <p className="text-base md:text-lg opacity-60 mb-16">{t.contact.subtitle}</p>
          </Reveal>
          {!contactDone ? (
            <Reveal delay={100}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // NOTE: integrar con servicio de email cuando haya backend
                  setContactDone(true);
                }}
                className="space-y-10"
              >
                <div>
                  <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.contact.name}</label>
                  <input type="text" required className="input-base" />
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.contact.email}</label>
                  <input type="email" required className="input-base" />
                </div>
                <div>
                  <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">{t.contact.message}</label>
                  <textarea required rows="4" className="input-base resize-none" />
                </div>
                <button
                  type="submit"
                  className="group inline-flex items-center gap-4 px-8 py-4 border transition-all"
                  style={{ borderColor: "#C9A961", color: "#C9A961" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#C9A961";
                    e.currentTarget.style.color = "#0F1419";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#C9A961";
                  }}
                >
                  <span className="text-sm tracking-[0.22em] uppercase">{t.contact.submit}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </button>
              </form>
            </Reveal>
          ) : (
            <Reveal>
              <div className="py-10 text-center" style={{ color: "#C9A961" }}>
                <Check className="w-8 h-8 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-lg">{t.contact.sent}</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="px-6 md:px-16 py-12 border-t border-cream/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="serif text-lg tracking-[0.18em] font-medium mb-1">
              TUK·TUK <span style={{ color: "#C9A961" }}>CARTAGENA</span>
            </div>
            <div className="text-xs opacity-50">{t.footer.tag}</div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
              {t.footer.legal}
            </a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
              {t.footer.privacy}
            </a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
              {t.footer.cookies}
            </a>
          </div>
          <div className="flex items-center gap-1">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="text-[11px] tracking-[0.18em] px-2 py-1 transition-colors"
                style={{ color: lang === l.code ? "#C9A961" : "rgba(248,246,241,0.4)" }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-cream/5 text-[10px] tracking-[0.22em] uppercase opacity-40">
          © 2025 TUK TUK Cartagena · {t.footer.rights}
        </div>
      </footer>
    </div>
  );
}
