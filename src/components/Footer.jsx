"use client";

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
          <a
            href="#"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            {t.footer.legal}
          </a>
          <a
            href="#"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            {t.footer.privacy}
          </a>
          <a
            href="#"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            {t.footer.cookies}
          </a>
        </div>
        <div className="flex items-center gap-1">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="text-[11px] tracking-[0.18em] px-2 py-1 transition-colors"
              style={{
                color:
                  lang === l.code ? "#C9A961" : "rgba(248,246,241,0.4)",
              }}
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
  );
}
