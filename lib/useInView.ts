'use client';
import { useEffect, useRef, useState } from 'react';

export function useInView<T extends Element>(threshold = 0.3, once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) setInView(false);
        });
      },
      { threshold }
    );
    io.observe(el);
    // fallback for environments where the observer stays silent
    const check = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const vis = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      if (vis > 0 && vis / Math.max(1, Math.min(r.height, vh)) >= threshold) {
        setInView(true);
        if (once) io.disconnect();
      }
    };
    const t = setTimeout(check, 400);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [threshold, once]);
  return [ref, inView] as const;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
