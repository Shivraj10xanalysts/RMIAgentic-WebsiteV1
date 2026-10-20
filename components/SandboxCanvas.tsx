'use client';
import { useEffect, useRef } from 'react';

type Pt = number[];
type Comp = { k: 'store' | 'card' | 'id'; u: number; v: number; h: number };

export default function SandboxCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const c2 = cv.getContext('2d');
    if (!c2) return;
    const ctx = c2;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = 360, H = 150;
    const family = getComputedStyle(document.body).fontFamily;
    let run = true, raf = 0;
    const C = '#4B3FA8', L = '#B9B4F3', F = '#F1F0FB', INK = '#161A33', MUTED = '#5B6078', BRASS = '#E8B83A', SPARK = '#7C70FF';
    const cx = 236, cy = 64;

    function size() {
      const w = cv!.clientWidth || 360;
      cv!.width = w * dpr; cv!.height = w * (H / W) * dpr;
      ctx.setTransform(cv!.width / W, 0, 0, cv!.height / H, 0, 0);
    }
    const iso = (u: number, v: number, h = 0): Pt => [cx + (u - v) * 62, cy + (u + v) * 31 - h];
    const COMP: Comp[] = [{ k: 'store', u: .16, v: .26, h: 24 }, { k: 'card', u: .55, v: .28, h: 30 }, { k: 'id', u: .34, v: .64, h: 22 }];

    function poly(p: Pt[], f?: string | null, s?: string, w = 1) {
      ctx.beginPath();
      p.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
      ctx.closePath();
      if (f) { ctx.fillStyle = f; ctx.fill(); }
      if (s) { ctx.strokeStyle = s; ctx.lineWidth = w; ctx.stroke(); }
    }
    function icon(k: Comp['k'], x: number, y: number) {
      ctx.save(); ctx.translate(x, y);
      ctx.strokeStyle = C; ctx.lineWidth = 1.3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
      if (k === 'store') { ctx.moveTo(-5, -1); ctx.lineTo(5, -1); ctx.lineTo(4, -4); ctx.lineTo(-4, -4); ctx.closePath(); ctx.stroke(); ctx.strokeRect(-4, -1, 8, 5); }
      if (k === 'card') { ctx.strokeRect(-5, -3.5, 10, 7); ctx.beginPath(); ctx.moveTo(-5, -1); ctx.lineTo(5, -1); ctx.stroke(); }
      if (k === 'id') { ctx.strokeRect(-5, -3.5, 10, 7); ctx.beginPath(); ctx.arc(-2, -.5, 1.4, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1, -1); ctx.lineTo(4, -1); ctx.moveTo(1, 1.5); ctx.lineTo(3.5, 1.5); ctx.stroke(); }
      ctx.restore();
    }
    function pillar(p: Comp) {
      const s = .1, a = iso(p.u, p.v), b = iso(p.u + s, p.v), c = iso(p.u + s, p.v + s), d = iso(p.u, p.v + s), h = p.h;
      poly([d, c, [c[0], c[1] - h], [d[0], d[1] - h]], F, C);
      poly([c, b, [b[0], b[1] - h], [c[0], c[1] - h]], '#E4E2F7', C);
      poly([[a[0], a[1] - h], [b[0], b[1] - h], [c[0], c[1] - h], [d[0], d[1] - h]], '#fff', C);
      const m = iso(p.u + s / 2, p.v + s / 2, h);
      ctx.beginPath(); ctx.arc(m[0], m[1] - 12, 9.5, 0, 6.283); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#DCDAF0'; ctx.lineWidth = 1.1; ctx.stroke();
      icon(p.k, m[0], m[1] - 12);
    }
    function chamber(front: boolean) {
      const f = [iso(0, 0), iso(1, 0), iso(1, 1), iso(0, 1)], Hc = 60;
      if (!front) {
        poly(f, '#F7F6FD', C, 1.1);
        ctx.strokeStyle = L; ctx.lineWidth = .6; ctx.globalAlpha = .5;
        for (let i = 1; i < 4; i++) {
          const a = iso(i / 4, 0), b = iso(i / 4, 1), c = iso(0, i / 4), d = iso(1, i / 4);
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = L; ctx.lineWidth = 1; ctx.beginPath();
        ctx.moveTo(f[1][0], f[1][1]); ctx.lineTo(f[1][0], f[1][1] - Hc); ctx.lineTo(f[0][0], f[0][1] - Hc); ctx.lineTo(f[3][0], f[3][1] - Hc); ctx.lineTo(f[3][0], f[3][1]);
        ctx.moveTo(f[0][0], f[0][1]); ctx.lineTo(f[0][0], f[0][1] - Hc); ctx.stroke();
      } else {
        ctx.strokeStyle = C; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath();
        ctx.moveTo(f[3][0], f[3][1] - Hc); ctx.lineTo(f[2][0], f[2][1] - Hc); ctx.lineTo(f[1][0], f[1][1] - Hc);
        [1, 2, 3].forEach((i) => { ctx.moveTo(f[i][0], f[i][1]); ctx.lineTo(f[i][0], f[i][1] - Hc); });
        ctx.stroke();
      }
    }
    function agent(x: number, y: number, pulse: number) {
      ctx.save(); ctx.translate(x, y);
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, 6.283); ctx.fillStyle = F; ctx.fill();
      ctx.strokeStyle = `rgba(124,112,255,${0.25 + 0.35 * pulse})`; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.fillStyle = C; ctx.beginPath(); ctx.arc(-3, -7, 5.4, 0, 6.283); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-14, 12); ctx.bezierCurveTo(-14, 4.6, -8.8, 1, -3, 1); ctx.bezierCurveTo(2.8, 1, 8, 4.6, 8, 12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = SPARK; const sx = -12, sy = -16;
      ctx.beginPath(); ctx.moveTo(sx, sy - 4.6); ctx.quadraticCurveTo(sx + .5, sy - .4, sx + 4.2, sy); ctx.quadraticCurveTo(sx + .5, sy + .4, sx, sy + 4.6); ctx.quadraticCurveTo(sx - .5, sy + .4, sx - 4.2, sy); ctx.quadraticCurveTo(sx - .5, sy - .4, sx, sy - 4.6); ctx.fill();
      ctx.fillStyle = INK; ctx.fillRect(5, 2, 13, 8.5); ctx.fillStyle = BRASS; ctx.fillRect(7, 4.3, 3.2, 2.4);
      ctx.restore();
    }

    const t0 = performance.now();
    function draw(t: number) {
      ctx.clearRect(0, 0, W, H); chamber(false);
      const wall = iso(0, 1), ay = wall[1] - 22, ax = 38, sx0 = ax + 30;
      ctx.strokeStyle = '#8C87C2'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(sx0, ay); ctx.lineTo(wall[0], ay); ctx.stroke();
      ctx.beginPath(); ctx.arc(wall[0], ay, 3, 0, 6.283); ctx.fillStyle = C; ctx.fill();
      if (!reduce) {
        for (let i = 0; i < 3; i++) {
          const q = (t * .55 + i / 3) % 1;
          ctx.beginPath(); ctx.arc(sx0 + (wall[0] - sx0) * q, ay, 2.6, 0, 6.283); ctx.fillStyle = `rgba(75,63,168,${0.9 - i * 0.2})`; ctx.fill();
        }
      }
      COMP.slice().sort((a, b) => a.u + a.v - (b.u + b.v)).forEach(pillar);
      chamber(true); agent(ax, ay, reduce ? .5 : (Math.sin(t * 2) + 1) / 2);
      ctx.fillStyle = MUTED; ctx.font = `500 10.5px ${family}`; ctx.textAlign = 'center';
      ctx.fillText('Your agent', ax, ay + 40); ctx.fillText('RMI adversarial sandbox', cx, H - 4);
    }
    function loop(now: number) { if (!run) return; draw((now - t0) / 1000); raf = requestAnimationFrame(loop); }
    const onResize = () => { size(); if (reduce) draw(0); };
    size();
    if (reduce) draw(0); else raf = requestAnimationFrame(loop);
    window.addEventListener('resize', onResize);
    const io = new IntersectionObserver((en) => {
      en.forEach((x) => { const was = run; run = x.isIntersecting; if (run && !was && !reduce) raf = requestAnimationFrame(loop); });
    });
    io.observe(cv);
    return () => { run = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={ref} id="hw-connect" aria-hidden="true" />;
}
