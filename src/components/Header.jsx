"use client";

import { Menu } from "lucide-react";
import { LANGS } from "../i18n/translations";
import Logo from "./Logo";

export default function Header({ lang, setLang, onMenuOpen, t }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-5 flex items-center justify-between"
      style={{
        background:
          "linear-gradient(180deg, rgba(15,20,25,0.85) 0%, rgba(15,20,25,0) 100%)",
        backdropFilter: "blur(6px)",
      }}
    >
      <button
        onClick={onMenuOpen}
        className="flex items-center gap-3 group"
        aria-label="Abrir menú"
      >
        <Menu
          className="w-5 h-5 group-hover:text-amber-200 transition-colors"
          strokeWidth={1.5}
        />
        <span className="text-[11px] tracking-[0.28em] uppercase font-medium hidden sm:inline">
          Menu
        </span>
      </button>

      <div style={{ marginLeft: "clamp(16px, 6vw, 64px)" }}>
        <Logo size="sm" />
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
  );
}
