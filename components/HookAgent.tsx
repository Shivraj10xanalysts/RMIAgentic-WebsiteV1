'use client';
import { useEffect, useRef } from 'react';

// Hero link: the agent blinks twice, rides along the underline, wobbles and greys out, then loops.
export default function HookAgent() {
  const wrap = useRef<HTMLSpanElement>(null);
  const ag = useRef<SVGSVGElement>(null);
  const tr = useRef<HTMLSpanElement>(null);
  const body = useRef<SVGGElement>(null);
  const spark = useRef<SVGPathElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const bg = useRef<SVGCircleElement>(null);

  // Smooth-scroll to the next section and briefly highlight it so the jump is obvious.
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('problem');
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#problem');
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    window.setTimeout(() => el.classList.remove('flash'), 2600);
  };

  useEffect(() => {
    const w = wrap.current, a = ag.current, t_ = tr.current, c = body.current, sp = spark.current, h = halo.current, b_ = bg.current;
    if (!w || !a || !t_ || !c || !sp || !h || !b_) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const BLINK = 0.7, GO = 1.0, WOB = 0.4, CYC = 3.6;
    let t = 0, last = performance.now(), run = true, raf = 0;
    const lerp = (x: number, y: number, k: number) => Math.round(x + (y - x) * k);

    const f = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (run) t += dt;
      const W = w.offsetWidth, k = t % CYC;
      let x = 0, wob = 0, g = 0, op = 1, hal = 0, bright = 0;
      if (k < BLINK) {
        const b = (k % 0.35) / 0.35;
        hal = 1 - b; bright = b < 0.5 ? 1 : 0;
      } else {
        const m = k - BLINK;
        let e = Math.min(1, m / GO);
        e = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
        if (m < GO) { x = e * 0.86 * W; }
        else if (m < GO + WOB) { x = 0.86 * W; wob = 1; g = (m - GO) / WOB; }
        else { x = 0.86 * W; g = 1; op = Math.max(0, 1 - (m - GO - WOB) * 1.2); }
      }
      const jy = wob ? Math.sin(t * 45) * 2.5 : 0, rot = wob ? Math.sin(t * 34) * 12 : 0;
      a.style.transform = `translate(${x.toFixed(1)}px,${jy.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
      a.style.opacity = String(op);
      const col = `rgb(${lerp(75, 176, g)},${lerp(63, 179, g)},${lerp(168, 194, g)})`;
      c.setAttribute('fill', col);
      sp.setAttribute('fill', g > 0 ? col : '#7C70FF');
      b_.setAttribute('fill', bright ? '#DCD8FA' : '#F1F0FB');
      h.setAttribute('r', (12 + (1 - hal) * 8).toFixed(1));
      h.setAttribute('opacity', (hal * 0.8).toFixed(2));
      t_.style.width = `${Math.min(x, 0.86 * W).toFixed(1)}px`;
      t_.style.background = g > 0 ? '#C9C9D6' : '#8C87C2';
      t_.style.opacity = String(op);
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    const io = new IntersectionObserver((en) => en.forEach((x) => { run = x.isIntersecting; }));
    io.observe(w);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <a className="hook" href="#problem" onClick={go}>
      <span className="hk-wrap" ref={wrap}>
        What if an agent gets it wrong?
        <span className="hk-base" aria-hidden="true" />
        <span className="hk-trail" ref={tr} aria-hidden="true" />
        <svg className="hk-ag" ref={ag} viewBox="-13 -13 26 26" aria-hidden="true">
          <circle ref={halo} r="12" fill="none" stroke="#7C70FF" strokeWidth="1.5" opacity="0" />
          <circle ref={bg} r="12" fill="#F1F0FB" stroke="#B9B4F3" strokeWidth="1" />
          <g transform="scale(.4615)">
            <g ref={body} fill="#4B3FA8"><circle cx="-3" cy="-7" r="5.4" /><path d="M-14 12C-14 4.6-8.8 1-3 1C2.8 1 8 4.6 8 12Z" /></g>
            <path ref={spark} d="M-12 -20.6Q-11.5 -16.4 -7.8 -16Q-11.5 -15.6 -12 -11.4Q-12.5 -15.6 -16.2 -16Q-12.5 -16.4 -12 -20.6Z" fill="#7C70FF" />
            <rect x="5" y="2" width="13" height="8.5" fill="#161A33" />
            <rect x="7" y="4.3" width="3.2" height="2.4" fill="#E8B83A" />
          </g>
        </svg>
      </span>
    </a>
  );
}
