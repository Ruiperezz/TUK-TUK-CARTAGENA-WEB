"use client";

import { ArrowRight } from "lucide-react";

export default function Hero({ scrollTo, t }) {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[640px] flex flex-col justify-end overflow-hidden"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/video/hero.mp4"
        />
        {/* Gradient overlay — ensures text legibility at any light level in the video */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,20,25,0.35) 0%, rgba(15,20,25,0.25) 40%, rgba(15,20,25,0.75) 75%, rgba(15,20,25,0.97) 100%)",
          }}
        />
        {/* Subtle lateral vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(15,20,25,0.55) 100%)",
          }}
        />
        <div className="grain" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-16 pb-20 md:pb-28 max-w-7xl">
        <div className="label-eyebrow mb-5">{t.hero.eyebrow}</div>
        <h1 className="serif text-6xl md:text-8xl lg:text-9xl font-medium leading-[0.95] mb-8 max-w-5xl">
          {t.hero.title.split(" ").map((w, i, arr) => (
            <span key={i} className="inline-block">
              {i === 1 ? (
                <em style={{ color: "#C9A961" }} className="italic">
                  {w}
                </em>
              ) : (
                w
              )}
              {i < arr.length - 1 && " "}
            </span>
          ))}
        </h1>
        <p className="text-base md:text-xl text-cream/80 max-w-2xl mb-10 font-light leading-relaxed">
          {t.hero.subtitle}
        </p>
        <button
          onClick={() => scrollTo("booking")}
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
          <span className="text-sm tracking-[0.2em] uppercase font-medium">
            {t.hero.cta}
          </span>
          <ArrowRight
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center scroll-bounce">
        <div className="text-[10px] tracking-[0.28em] uppercase opacity-50">
          {t.hero.scroll}
        </div>
        <div className="w-px h-10 bg-cream/30 mx-auto mt-2" />
      </div>
    </section>
  );
}
