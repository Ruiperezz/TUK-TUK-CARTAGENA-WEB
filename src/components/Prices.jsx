"use client";

import Reveal from "./Reveal";

export default function Prices({ t }) {
  return (
    <section
      id="prices"
      className="px-6 md:px-16 py-24 md:py-32"
      style={{ background: "#0B0E12" }}
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="label-eyebrow mb-4">{t.prices.eyebrow}</div>
          <h2 className="serif text-5xl md:text-7xl font-medium mb-20">
            {t.prices.title}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Tarifa principal */}
          <Reveal>
            <div>
              <div className="text-[11px] tracking-[0.28em] uppercase mb-8 opacity-60">
                {t.prices.perTuktukTitle}
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-cream/10 pb-8">
                  <div>
                    <div className="text-base md:text-lg mb-1">
                      {t.prices.perTuktuk}
                    </div>
                    <div className="text-xs opacity-50 max-w-xs leading-relaxed">
                      {t.prices.perTuktukNote}
                    </div>
                  </div>
                  <span
                    className="serif text-5xl md:text-6xl font-medium flex-shrink-0 ml-6"
                    style={{ color: "#C9A961" }}
                  >
                    {t.prices.perTuktukPrice}
                  </span>
                </div>
                <div className="text-xs opacity-60 pt-2">
                  {t.prices.payment}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Próximamente */}
          <Reveal delay={120}>
            <div>
              <div className="text-[11px] tracking-[0.28em] uppercase mb-8 opacity-60">
                {t.prices.comingSoon}
              </div>
              <div className="space-y-6">
                <div className="flex items-baseline justify-between border-b border-cream/10 pb-5 relative">
                  <div>
                    <span className="text-base md:text-lg opacity-40">
                      {t.prices.private6}
                    </span>
                    <div
                      className="text-[10px] tracking-[0.22em] uppercase mt-1"
                      style={{ color: "#C9A961" }}
                    >
                      {t.prices.comingSoon}
                    </div>
                  </div>
                  <span className="serif text-3xl md:text-4xl font-medium opacity-25">
                    {t.prices.private6Price}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
