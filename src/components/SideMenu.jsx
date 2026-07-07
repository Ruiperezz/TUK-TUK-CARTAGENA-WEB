"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { LANGS } from "../i18n/translations";

export default function SideMenu({ lang, setLang, onClose, scrollTo, t }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.home}
        className="w-full md:w-[420px] h-full menu-slide flex flex-col px-8 md:px-12 py-10"
        style={{ background: "#0B0E12" }}
      >
        <div className="flex items-center justify-between mb-16">
          <span
            className="text-[11px] tracking-[0.28em] uppercase"
            style={{ color: "#C9A961" }}
          >
            {t.menu.close}
          </span>
          <button onClick={onClose} aria-label={t.menu.close}>
            <X
              className="w-5 h-5 hover:text-amber-200 transition-colors"
              strokeWidth={1.5}
            />
          </button>
        </div>

        <nav className="flex flex-col gap-7 flex-1">
          {[
            { key: "home", id: "hero" },
            { key: "tours", id: "tours" },
            { key: "prices", id: "prices" },
            { key: "book", id: "booking" },
            { key: "about", id: "about" },
            { key: "contact", id: "contact" },
          ].map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left group flex items-baseline gap-4"
            >
              <span className="text-[11px] opacity-40 group-hover:opacity-100 transition-opacity">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="serif text-3xl md:text-4xl font-medium hover-gold transition-colors">
                {t.nav[item.key]}
              </span>
            </button>
          ))}
        </nav>

        <div className="pt-10 border-t border-cream/10">
          <div className="text-[10px] tracking-[0.28em] uppercase mb-3 opacity-50">
            {t.menu.lang}
          </div>
          <div className="flex gap-4">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                className="text-sm tracking-[0.18em] transition-colors"
                style={{
                  color:
                    lang === l.code ? "#C9A961" : "rgba(248,246,241,0.5)",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={t.menu.close}
        className="hidden md:block flex-1 bg-black/60"
      />
    </div>
  );
}
