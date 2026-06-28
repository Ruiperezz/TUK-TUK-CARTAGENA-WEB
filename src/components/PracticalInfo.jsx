"use client";

import Reveal from "./Reveal";

export default function PracticalInfo({ t }) {
  return (
    <section className="px-6 md:px-16 py-24 md:py-32 max-w-7xl mx-auto">
      <Reveal>
        <div className="label-eyebrow mb-4">{t.practical.eyebrow}</div>
        <h2 className="serif text-4xl md:text-6xl font-medium mb-16">
          {t.practical.title}
        </h2>
      </Reveal>
      <div
        className="grid md:grid-cols-2 gap-px"
        style={{ background: "rgba(248,246,241,0.1)" }}
      >
        {t.practical.items.map((item, idx) => (
          <Reveal key={idx} delay={idx * 80}>
            <div className="p-8 md:p-10" style={{ background: "#0F1419" }}>
              <div
                className="text-[11px] tracking-[0.28em] uppercase mb-3"
                style={{ color: "#C9A961" }}
              >
                {item.label}
              </div>
              <div className="text-lg leading-relaxed">{item.value}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
