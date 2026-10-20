"use client";

import { useState, useEffect, useRef } from "react";

// Los mapas de Google pesan mucho en JS: solo se montan cuando están cerca del viewport.
export default function LazyIframe({ className = "", style, ...props }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (near) {
    return <iframe className={className} style={style} {...props} />;
  }
  return <div ref={ref} className={className} aria-hidden="true" />;
}
