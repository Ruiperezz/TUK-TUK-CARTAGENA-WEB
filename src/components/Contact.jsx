"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, AlertCircle } from "lucide-react";
import Reveal from "./Reveal";

export default function Contact({ t }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [contactDone, setContactDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al enviar el mensaje");
        setLoading(false);
        return;
      }
      setContactDone(true);
    } catch {
      setError("Error de conexión. Por favor inténtalo de nuevo.");
      setLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-10" noValidate>
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2"
                >
                  {t.contact.name}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input-base"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2"
                >
                  {t.contact.email}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="input-base"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="text-[11px] tracking-[0.22em] uppercase opacity-60 block mb-2"
                >
                  {t.contact.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="input-base resize-none"
                />
              </div>

              {error && (
                <div
                  className="flex items-center gap-3 p-4 border border-cream/15"
                  style={{ color: "#C9A961" }}
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center gap-4 px-8 py-4 border transition-all disabled:opacity-50"
                  style={{ borderColor: "#C9A961", color: "#C9A961" }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#C9A961";
                      e.currentTarget.style.color = "#0F1419";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#C9A961";
                  }}
                >
                  <span className="text-sm tracking-[0.22em] uppercase">
                    {loading ? "…" : t.contact.submit}
                  </span>
                  {!loading && (
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  )}
                </button>
                <p className="mt-5 text-[11px] leading-relaxed opacity-40 max-w-lg">
                  <strong className="opacity-80">Protección de datos:</strong> MELLADA DPAICO S.L. (NIF B24803082)
                  tratará sus datos para gestionar su consulta, con base en el interés legítimo del responsable.
                  Puede ejercer sus derechos de acceso, rectificación, supresión y oposición en{" "}
                  <a href="mailto:reservas@tuktukcartagena.com" className="underline underline-offset-2">
                    reservas@tuktukcartagena.com
                  </a>
                  . Más información en nuestra{" "}
                  <Link href="/politica-privacidad" className="underline underline-offset-2" style={{ color: "#C9A961" }}>
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </div>
            </form>
          </Reveal>
        ) : (
          <Reveal>
            <div className="py-10 text-center" style={{ color: "#C9A961" }}>
              <Check className="w-8 h-8 mx-auto mb-4" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-lg">{t.contact.sent}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
