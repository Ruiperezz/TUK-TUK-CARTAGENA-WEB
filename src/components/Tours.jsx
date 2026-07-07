"use client";

import { ChevronRight } from "lucide-react";
import Reveal from "./Reveal";
import RouteMap from "./RouteMap";

const MAP_QUERIES = {
  city: "Casco antiguo de Cartagena, España",
  bay: "Bahía de Cartagena, España",
  myway: "Cartagena, España",
};

export default function Tours({ t, onSelectTour }) {
  return (
    <section id="tours" className="px-6 md:px-16 py-24 md:py-32 max-w-7xl mx-auto">
      <Reveal>
        <div className="label-eyebrow mb-4">{t.tours.eyebrow}</div>
        <h2 className="serif text-5xl md:text-7xl font-medium mb-20 max-w-3xl">
          {t.tours.title}
        </h2>
      </Reveal>

      <div
        className="grid md:grid-cols-3 gap-px"
        style={{ background: "rgba(248,246,241,0.1)" }}
      >
        {t.tours.list.map((tour, idx) => (
          <Reveal key={tour.id} delay={idx * 120}>
            <article
              className="p-8 md:p-10 h-full flex flex-col group cursor-pointer transition-colors duration-500"
              style={{ background: "#0F1419" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#141A22")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#0F1419")
              }
              onClick={() => onSelectTour(tour.id)}
            >
              <div className="flex items-baseline justify-between mb-8">
                <span className="serif text-5xl font-light italic opacity-25">
                  0{idx + 1}
                </span>
                <span
                  className="text-[11px] tracking-[0.28em] uppercase"
                  style={{ color: "#C9A961" }}
                >
                  {tour.duration} {t.tours.duration}
                </span>
              </div>
              <h3 className="serif text-3xl md:text-4xl font-medium mb-2 leading-tight">
                {tour.name}
              </h3>
              <p className="text-sm italic opacity-60 mb-6 serif">
                {tour.tagline}
              </p>
              <p className="text-sm leading-relaxed text-cream/70 mb-8 flex-1">
                {tour.desc}
              </p>
              {tour.id !== "myway" && (
                <>
                  <RouteMap
                    query={MAP_QUERIES[tour.id]}
                    label={tour.name}
                    caption={t.tours.mapCaption}
                  />
                  <p className="text-[11px] italic opacity-40 mb-6 leading-relaxed">
                    {t.tours.routeDisclaimer}
                  </p>
                </>
              )}
              <div className="flex flex-wrap gap-2 mb-8">
                {tour.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-[10px] tracking-[0.15em] uppercase px-3 py-1 border border-cream/15"
                  >
                    {h}
                  </span>
                ))}
              </div>
              <div
                className="flex items-center gap-3 mt-auto group-hover:gap-5 transition-all"
                style={{ color: "#C9A961" }}
              >
                <span className="text-[11px] tracking-[0.22em] uppercase">
                  {t.tours.book}
                </span>
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

    </section>
  );
}
