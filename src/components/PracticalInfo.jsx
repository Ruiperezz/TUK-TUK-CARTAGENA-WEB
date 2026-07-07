"use client";

import Reveal from "./Reveal";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d812.4!2d-0.9968!3d37.5979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6312e3b6e6b0b7%3A0x1!2sPaseo+Alfonso+XII%2C+Cartagena!5e0!3m2!1ses!2ses!4v1";

const MAP_LINK =
  "https://maps.google.com/?q=Terminal+Juan+Sebastián+El+Cano,+Paseo+Alfonso+XII,+Cartagena,+España";

export default function PracticalInfo({ t }) {
  return (
    <section className="px-6 md:px-16 py-24 md:py-32 max-w-7xl mx-auto">
      <Reveal>
        <div className="label-eyebrow mb-4">{t.practical.eyebrow}</div>
        <h2 className="serif text-4xl md:text-6xl font-medium mb-16">
          {t.practical.title}
        </h2>
      </Reveal>

      {/* Tres tarjetas en fila */}
      <Reveal delay={80}>
        <div
          className="grid md:grid-cols-3 gap-px mb-px"
          style={{ background: "rgba(248,246,241,0.1)" }}
        >
          {t.practical.items.map((item, idx) => (
            <div key={idx} className="p-8 md:p-10" style={{ background: "#0F1419" }}>
              <div
                className="text-[11px] tracking-[0.28em] uppercase mb-3"
                style={{ color: "#C9A961" }}
              >
                {item.label}
              </div>
              <div className="text-base leading-relaxed">
                {item.mapUrl ? (
                  <a
                    href={item.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors leading-snug block"
                    style={{ color: "#C9A961" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#D9B971")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#C9A961")}
                  >
                    {item.value}
                    <span className="block mt-1 text-[10px] tracking-[0.18em] uppercase opacity-60">
                      ↗ {t.practical.openMapsShort}
                    </span>
                  </a>
                ) : (
                  item.value
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Mapa real embebido */}
      <Reveal delay={160}>
        <div className="relative" style={{ background: "rgba(248,246,241,0.1)", padding: "1px" }}>
          <div style={{ background: "#0F1419" }} className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <div
                className="text-[11px] tracking-[0.28em] uppercase"
                style={{ color: "#C9A961" }}
              >
                {t.practical.items[0]?.label}
              </div>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.18em] uppercase opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
              >
                ↗ {t.practical.openMaps || "Abrir en Google Maps"}
              </a>
            </div>
            <div className="relative overflow-hidden" style={{ height: "340px" }}>
              <iframe
                title="Punto de encuentro Tuk Tuk Cartagena"
                src="https://www.google.com/maps?q=Terminal+Juan+Sebastián+El+Cano,+Paseo+Alfonso+XII+8,+Cartagena,+Murcia,+España&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0"
                style={{ filter: "grayscale(0.6) contrast(1.1) brightness(0.88)" }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
