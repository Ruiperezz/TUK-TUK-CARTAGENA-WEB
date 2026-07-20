"use client";

import Link from "next/link";
import { LANGS } from "../i18n/translations";
import Logo from "./Logo";

export default function Footer({ lang, setLang, t }) {
  return (
    <footer className="px-6 md:px-16 py-12 border-t border-cream/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <Logo size="sm" className="mb-2" />
          <div className="text-xs opacity-50">{t.footer.tag}</div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
          <Link
            href="/aviso-legal"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            {t.footer.legal}
          </Link>
          <Link
            href="/politica-privacidad"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            {t.footer.privacy}
          </Link>
          <Link
            href="/politica-cookies"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            {t.footer.cookies}
          </Link>
        </div>

        <nav aria-label={t.menu?.lang || "Language"}>
          <div className="flex items-center gap-1">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-label={`Switch to ${l.label}`}
                aria-pressed={lang === l.code}
                className="text-[11px] tracking-[0.18em] px-2 py-1 transition-colors"
                style={{
                  color: lang === l.code ? "#C9A961" : "rgba(248,246,241,0.4)",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-cream/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[10px] tracking-[0.22em] uppercase opacity-40">
          © {new Date().getFullYear()} TUK TUK Cartagena · {t.footer.rights}
        </div>
        <a
          href="https://ruiperezstudio.es/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 transition-opacity"
          style={{ opacity: 0.55 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
        >
          <span
            className="text-[9px] tracking-[0.28em] uppercase"
            style={{ color: "rgba(248,246,241,0.6)" }}
          >
            Diseñado por
          </span>
          <span
            className="text-[11px] tracking-[0.22em] uppercase font-medium transition-colors"
            style={{ color: "#C9A961" }}
          >
            Ruipérez Studio
          </span>
          <span
            className="text-[9px] opacity-40 group-hover:opacity-70 transition-opacity"
            style={{ color: "#C9A961" }}
          >
            ↗
          </span>
        </a>
      </div>
    </footer>
  );
}
