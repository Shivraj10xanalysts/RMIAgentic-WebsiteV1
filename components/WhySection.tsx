'use client';
import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

const NAMES = ['Rate', 'Monitor', 'Insure', 'Calibrate'];
const LIST = [
  ['Rate', 'Testing sets your starting premium.'],
  ['Monitor', 'Live checks alert you to risky payments.'],
  ['Insure', 'Covered payments build user trust.'],
  ['Calibrate', 'Your score and premium update dynamically with real data.'],
];
const SHADES = ['#B7B3DA', '#9A94D4', '#7C74CE', '#4B3FA8'];
const cx = 170, cy = 160, r = 108, W = 7;

const ICON: Record<string, React.ReactNode> = {
  Rate: <path d="M-5 3.5 L-1.7 0 L1 2.6 L5 -2.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  Monitor: <><circle r="4.6" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle r="1.5" fill="currentColor" /></>,
  Insure: <path d="M0 -5 L4.6 -3.3 V0.4 C4.6 3.2 2.5 5 0 5.8 C-2.5 5 -4.6 3.2 -4.6 0.4 V-3.3 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  Calibrate: <><path d="M-4.2 -1.7 A4.6 4.6 0 1 1 -3.3 3.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M-5.8 -3.4 L-4.2 -1.7 L-2.2 -3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></>,
};

function pt(d: number, rad = r): [number, number] {
  const a = ((d - 90) * Math.PI) / 180;
  return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
}
function arc(a0: number, a1: number) {
  if (a1 - a0 < 0.05) a1 = a0 + 0.05;
  const p0 = pt(a0), p1 = pt(a1), l = a1 - a0 > 180 ? 1 : 0;
  return `M${p0[0].toFixed(2)} ${p0[1].toFixed(2)} A${r} ${r} 0 ${l} 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
}

export default function WhySection() {
  const [host, visible] = useInView<HTMLDivElement>(0.2, false);
  const [s, setS] = useState({ deg: 0, lap: 1, score: 83.3, prem: 2.77 });
  const [reduce, setReduce] = useState(false);
  const live = useRef(s);

  useEffect(() => {
    if (prefersReducedMotion()) { setReduce(true); setS((p) => ({ ...p, deg: 359 })); }
  }, []);

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    let raf = 0, last = 0, on = true;
    const frame = (t: number) => {
      if (!on) return;
      if (t - last > 28) {
        last = t;
        let { deg, lap, score, prem } = live.current;
        deg += 1.2;
        if (deg >= 360) {
          deg = 0;
          if (lap < 5) lap++;
          if (lap <= 4) { score = Math.min(95, score + 1.1); prem = prem * 0.94; }
        }
        live.current = { deg, lap, score, prem };
        setS(live.current);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { on = false; cancelAnimationFrame(raf); };
  }, [visible]);

  const { deg, lap, score, prem } = s;
  const n = Math.min(3, Math.floor(deg / 90));
  const run = pt(deg);

  return (
    <section className="sec" id="why">
      <Reveal as="p" className="lab lab-big"><i aria-hidden="true" />Why it works</Reveal>
      <div className="fw fw-own">
        <Reveal className="fw-text">
          <h3>The safer your agent, the lower your premium.</h3>
          <ol className="fw-list">
            {LIST.map((l, i) => <li key={l[0]} className={i === n ? 'on' : ''}><b>{l[0]}</b>{l[1]}</li>)}
          </ol>
        </Reveal>
        <Reveal className="fw-wheel" delay={0.1}>
          <div id="fw-art" ref={host} role="img" aria-label="Flywheel: Rate, Monitor, Insure and Calibrate in a loop. Each cycle the Trust Score rises and the premium falls.">
            <svg viewBox="-40 0 420 320" aria-hidden="true">
              <defs>
                <radialGradient id="fwglow"><stop offset="0" stopColor="#7C70FF" stopOpacity=".6" /><stop offset="1" stopColor="#7C70FF" stopOpacity="0" /></radialGradient>
                <filter id="fwsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0B0E14" floodOpacity=".25" /></filter>
              </defs>
              {[0, 1, 2, 3].map((i) => <path key={'t' + i} d={arc(i * 90 + 4, i * 90 + 86)} fill="none" stroke="#E6E5F1" strokeWidth={W} strokeLinecap="round" />)}
              {[0, 1, 2, 3].map((i) => {
                const a0 = i * 90 + 4, a1 = Math.min(i * 90 + 86, deg);
                return <path key={'s' + i} d={arc(a0, a1 > a0 ? a1 : a0)} fill="none" stroke={SHADES[i]} strokeWidth={W} strokeLinecap="round" style={{ opacity: deg > a0 ? 1 : 0 }} />;
              })}
              {!reduce && <><circle r="14" cx={run[0]} cy={run[1]} fill="url(#fwglow)" /><circle r="5" cx={run[0]} cy={run[1]} fill="#fff" stroke="#4B3FA8" strokeWidth="2.5" /></>}
              {NAMES.map((nm, i) => {
                const a = i * 90 + 45, p = pt(a), p1 = pt(a, r + 16), p2 = pt(a, r + 32), right = a < 180, x3 = p2[0] + (right ? 14 : -14), on = i === n;
                return (
                  <g key={nm}>
                    <g transform={`translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`}>
                      <circle r="13" fill={on ? '#4B3FA8' : '#fff'} stroke={on ? '#4B3FA8' : '#D6D3EC'} strokeWidth="1.2" />
                      <g style={{ color: on ? '#fff' : '#4B3FA8' }}>{ICON[nm]}</g>
                    </g>
                    <path d={`M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} L${x3.toFixed(1)} ${p2[1].toFixed(1)}`} fill="none" stroke="#C9C6E6" strokeWidth="1" />
                    <text x={(x3 + (right ? 4 : -4)).toFixed(1)} y={(p2[1] + 4).toFixed(1)} textAnchor={right ? 'start' : 'end'} fontSize="13" fontWeight="500" fill={on ? '#4B3FA8' : '#161A33'}>{nm}</text>
                  </g>
                );
              })}
              <image href="/rmi-logo-light.svg" x={cx - 47} y={cy - 81} width="13" height="16" />
              <text x={cx - 28} y={cy - 68} fontSize="13" fontWeight="500" letterSpacing="-0.2" fill="#161A33"><tspan fill="#5B4FE6">RMI</tspan>Agentic</text>
              <g filter="url(#fwsh)"><rect x={cx - 74} y={cy - 54} width="148" height="108" rx="16" fill="#0B0E14" /></g>
              <text x={cx} y={cy - 31} textAnchor="middle" fontFamily="var(--mono)" fontSize="10.5" letterSpacing="1.4" fill="#8A90A0">{lap > 4 ? 'CYCLE n' : `CYCLE ${lap}`}</text>
              <text x={cx - 60} y={cy - 2} fontFamily="var(--mono)" fontSize="10" fill="#8A90A0">SCORE</text>
              <text x={cx + 60} y={cy - 1} textAnchor="end" fontSize="19" fontWeight="700" fill="#E9ECF2">{score.toFixed(1)}</text>
              <text x={cx - 60} y={cy + 24} fontFamily="var(--mono)" fontSize="10" fill="#8A90A0">PREMIUM</text>
              <text x={cx + 60} y={cy + 25} textAnchor="end" fontSize="19" fontWeight="700" fill="#A9A3F0">${prem.toFixed(2)}</text>
              <text x={cx} y={cy + 43} textAnchor="middle" fontSize="10" fill="#6B7183">per $10,000 covered</text>
            </svg>
          </div>
          <p className="fw-note">Illustrative figures</p>
        </Reveal>
      </div>
    </section>
  );
}
