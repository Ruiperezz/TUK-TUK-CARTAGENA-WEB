"use client";

import Image from "next/image";
import Reveal from "./Reveal";

const SRCS = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
];

export default function Gallery({ t }) {
  return (
    <section className="px-6 md:px-16 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="label-eyebrow mb-4">{t.gallery.eyebrow}</div>
          <h2 className="serif text-5xl md:text-7xl font-medium mb-16">
            {t.gallery.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {SRCS.map((src, i) => (
            <Reveal key={src} delay={i * 80}>
              <div className="relative overflow-hidden aspect-[3/4] group">
                <Image
                  src={src}
                  alt={t.gallery.photos?.[i] ?? `Tuk tuk Cartagena ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: "rgba(15,20,25,0.25)" }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
