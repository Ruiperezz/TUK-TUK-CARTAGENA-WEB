"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { I18N } from "../i18n/translations";
import Header from "./Header";
import SideMenu from "./SideMenu";
import Hero from "./Hero";
import Tours from "./Tours";
import Prices from "./Prices";
import BookingForm from "./BookingForm";
import About from "./About";
import PracticalInfo from "./PracticalInfo";
import Contact from "./Contact";
import Footer from "./Footer";

export default function HomePage() {
  const searchParams = useSearchParams();

  const [lang, setLang] = useState("es");
  useEffect(() => {
    const browser = (navigator.language || "es").slice(0, 2);
    if (["es", "en", "de", "fr"].includes(browser)) setLang(browser);
  }, []);
  const t = I18N[lang];

  const [menuOpen, setMenuOpen] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    tour: "",
    date: "",
    time: "",
    adults: 1,
    kids: 0,
    isPrivate: false,
    name: "",
    email: "",
  });
  const [bookingDone, setBookingDone] = useState(false);

  useEffect(() => {
    if (searchParams.get("booking") === "success") {
      setBookingDone(true);
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
      adults: 1,
      kids: 0,
      isPrivate: false,
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
      <Prices t={t} />
      <BookingForm
        t={t}
        lang={lang}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        bookingDone={bookingDone}
        setBookingDone={setBookingDone}
        onReset={resetBooking}
      />
      <About t={t} />
      <PracticalInfo t={t} />
      <Contact t={t} />
      <Footer lang={lang} setLang={setLang} t={t} />
    </div>
  );
}
