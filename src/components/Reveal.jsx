"use client";

import { useState, useEffect, useRef } from "react";

// Un único IntersectionObserver y un único matchMedia compartidos por todos los
// <Reveal>: evita decenas de observers/listeners y de re-renders al hidratar.
const callbacks = new WeakMap();
let sharedObserver = null;

function getObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          callbacks.get(e.target)?.();
          callbacks.delete(e.target);
          sharedObserver.unobserve(e.target);
        }),
      { threshold: 0.15 }
    );
  }
  return sharedObserver;
}

let reducedMotion = false;
const reducedListeners = new Set();
let reducedQuery = null;

function subscribeReduced(listener) {
  if (!reducedQuery) {
    reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = reducedQuery.matches;
    reducedQuery.addEventListener("change", (e) => {
      reducedMotion = e.matches;
      reducedListeners.forEach((l) => l(e.matches));
    });
  }
  reducedListeners.add(listener);
  listener(reducedMotion);
  return () => reducedListeners.delete(listener);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => subscribeReduced(setReduced), []);
  return reduced;
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = getObserver();
    callbacks.set(el, () => setVisible(true));
    obs.observe(el);
    return () => {
      callbacks.delete(el);
      obs.unobserve(el);
    };
  }, []);

  return [ref, visible];
}

export default function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 900ms cubic-bezier(.22,.61,.36,1) ${delay}ms, transform 900ms cubic-bezier(.22,.61,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
