"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function Contact({ t }) {
  const [contactDone, setContactDone] = useState(false);

  return (
    <section
      id="contact"
      className="px-6 md:px-16 py-24 md:py-32"
      style={{ background: "#0B0E12" }}
    >
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="label-eyebrow mb-4">{t.contact.eyebrow}</div>
          <h2 className="serif text-5xl md:text-7xl font-medium mb-3">
            {t.contact.title}
          </h2>
          <p className="text-base md:text-lg opacity-60 mb-16">
            {t.contact.subtitle}
          </p>
        </Reveal>
        {!contactDone ? (
          <Reveal delay={100}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactDone(true);
              }}
              className="space-y-10"
            >
              <div>
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.contact.name}
                </label>
                <input type="text" required className="input-base" />
              </div>
              <div>
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.contact.email}
                </label>
                <input type="email" required className="input-base" />
              </div>
              <div>
                <label className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2">
                  {t.contact.message}
                </label>
                <textarea
                  required
                  rows="4"
                  className="input-base resize-none"
                />
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
                <span className="text-sm tracking-[0.22em] uppercase">
                  {t.contact.submit}
                </span>
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  strokeWidth={1.5}
                />
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
  );
}
