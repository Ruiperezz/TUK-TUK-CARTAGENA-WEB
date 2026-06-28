"use client";

import Reveal from "./Reveal";

export default function About({ t }) {
  return (
    <section
      id="about"
      className="px-6 md:px-16 py-24 md:py-32"
      style={{ background: "#0B0E12" }}
    >
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="label-eyebrow mb-4">{t.about.eyebrow}</div>
          <h2 className="serif text-4xl md:text-6xl font-medium mb-12 leading-tight max-w-3xl">
            {t.about.title}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-lg md:text-xl leading-relaxed text-cream/70 max-w-3xl font-light">
            {t.about.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
