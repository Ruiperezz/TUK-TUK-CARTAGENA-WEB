"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { I18N } from "../i18n/translations";
import Header from "./Header";
import SideMenu from "./SideMenu";
import Hero from "./Hero";
import Tours from "./Tours";
import Gallery from "./Gallery";
import Prices from "./Prices";
import BookingForm from "./BookingForm";
import About from "./About";
import PracticalInfo from "./PracticalInfo";
import Contact from "./Contact";
import Footer from "./Footer";
import CookieBanner from "./CookieBanner";

export default function HomePage() {
  const searchParams = useSearchParams();

  const [lang, setLang] = useState("es");
  useEffect(() => {
    const SUPPORTED = ["es", "en", "de", "fr"];
    const urlLang = searchParams.get("lang");
    if (urlLang && SUPPORTED.includes(urlLang)) {
      setLang(urlLang);
      return;
    }
    const browser = (navigator.language || "es").slice(0, 2);
    if (SUPPORTED.includes(browser)) setLang(browser);
  }, [searchParams]);
  const t = I18N[lang];

  const [menuOpen, setMenuOpen] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    tour: "",
    date: "",
    time: "",
    people: 1,
    name: "",
    email: "",
  });
  const [bookingDone, setBookingDone] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  useEffect(() => {
    if (searchParams.get("booking") === "success") {
      setBookingDone(true);
      const sessionId = searchParams.get("session_id");
      if (sessionId) {
        fetch(`/api/bookings/by-session?session_id=${encodeURIComponent(sessionId)}`)
          .then((r) => r.json())
          .then((data) => { if (data.booking) setSuccessBooking(data.booking); })
          .catch(() => {});
      }
      setTimeout(() => {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [searchParams]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const resetBooking = () => {
    setBookingForm({
      tour: "",
      date: "",
      time: "",
      people: 1,
      name: "",
      email: "",
    });
    setBookingDone(false);
    window.history.replaceState({}, "", "/");
  };

  const handleSelectTour = (tourId) => {
    setBookingForm((f) => ({ ...f, tour: tourId }));
    scrollTo("booking");
  };

  return (
    <div
      className="min-h-screen text-cream bg-bg-primary"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Header
        lang={lang}
        setLang={setLang}
        onMenuOpen={() => setMenuOpen(true)}
        t={t}
      />
      {menuOpen && (
        <SideMenu
          lang={lang}
          setLang={setLang}
          onClose={() => setMenuOpen(false)}
          scrollTo={scrollTo}
          t={t}
        />
      )}
      <Hero scrollTo={scrollTo} t={t} />
      <Tours t={t} onSelectTour={handleSelectTour} />
      <Gallery t={t} />
      <Prices t={t} />
      <BookingForm
        t={t}
        lang={lang}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        bookingDone={bookingDone}
        setBookingDone={setBookingDone}
        onReset={resetBooking}
        successBooking={successBooking}
      />
      <About t={t} />
      <PracticalInfo t={t} />
      <Contact t={t} />
      <Footer lang={lang} setLang={setLang} t={t} />
      <CookieBanner />
    </div>
  );
}
