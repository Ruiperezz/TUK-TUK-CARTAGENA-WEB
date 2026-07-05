"use client";

import Image from "next/image";
import Reveal from "./Reveal";

const PHOTOS = [
  { src: "/images/gallery-1.jpg", alt: "Tuk tuk Cartagena — vista frontal", wide: false },
  { src: "/images/gallery-2.jpg", alt: "Tuk tuk Cartagena — pasajeras en palmeras", wide: false },
  { src: "/images/gallery-3.jpg", alt: "Tuk tuk Cartagena — familias con niños", wide: false },
  { src: "/images/gallery-4.jpg", alt: "Tuk tuk Cartagena — pareja dentro del tuk tuk", wide: false },
  { src: "/images/gallery-5.jpg", alt: "Tuk tuk Cartagena — familia casco antiguo", wide: false },
  { src: "/images/gallery-6.jpg", alt: "Tuk tuk Cartagena — palmeras perfil", wide: false },
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

        {/* Desktop: 3-col masonry grid · Mobile: 2-col */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {/* Row 1 — three equal columns */}
          {PHOTOS.slice(0, 3).map((photo, i) => (
            <Reveal key={photo.src} delay={i * 80}>
              <div className="relative overflow-hidden aspect-[3/4] group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
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

          {/* Row 2 — first photo wider (col-span-2) + one regular */}
          <Reveal delay={240}>
            <div className="relative overflow-hidden col-span-2 aspect-[16/9] group">
              <Image
                src={PHOTOS[3].src}
                alt={PHOTOS[3].alt}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div
                className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: "rgba(15,20,25,0.25)" }}
              />
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="relative overflow-hidden aspect-[3/4] group">
              <Image
                src={PHOTOS[4].src}
                alt={PHOTOS[4].alt}
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

          {/* Row 3 — full width panoramic */}
          <Reveal delay={400}>
            <div className="relative overflow-hidden col-span-2 md:col-span-3 aspect-[21/9] group">
              <Image
                src={PHOTOS[5].src}
                alt={PHOTOS[5].alt}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="100vw"
              />
              <div
                className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: "rgba(15,20,25,0.25)" }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
