"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "cookie_consent";

function getConsent() {
  if (typeof document === "undefined") return true;
  return document.cookie.split("; ").some((c) => c.startsWith(COOKIE_KEY + "="));
}

function setConsent() {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${COOKIE_KEY}=accepted; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  const accept = () => {
    setConsent();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 px-6 py-5 md:py-4"
      style={{
        background: "#0B0E12",
        borderTop: "1px solid rgba(248,246,241,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs leading-relaxed opacity-70 max-w-2xl">
          Este portal web únicamente utiliza cookies propias con finalidad técnica. No recaba ni cede datos
          de carácter personal sin su conocimiento.{" "}
          <Link
            href="/politica-cookies"
            className="underline underline-offset-2 transition-opacity hover:opacity-100"
            style={{ color: "#C9A961", opacity: 0.9 }}
          >
            Más información
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="flex-shrink-0 px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase font-medium transition-all"
          style={{ background: "#C9A961", color: "#0F1419" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#D9B971")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#C9A961")}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
