'use client';
import { useEffect, useMemo, useState } from 'react';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

const CATS: [string, number[]][] = [
  ['Prompt injection', [2, 3, 6]], ['Checkout & orders', [1, 1, 4]], ['Tool misuse', [1, 2, 5]],
  ['System prompt leakage', [1, 2, 4]], ['Memory poisoning', [1, 1, 3]], ['Fraud & abuse', [0, 1, 2]],
];
const PER = 40;
const COL = ['#C8402E', '#EE9A7E', '#E8B04A', '#B7B3DA'];
const SC = [10, 35, 68, 93.47];

function buildSeqs() {
  return CATS.map((c, k) => {
    const seq: number[] = [];
    for (let t = 0; t < 3; t++) for (let j = 0; j < c[1][t]; j++) seq.push(t);
    while (seq.length < PER) seq.push(3);
    let x = k + 5;
    for (let i = seq.length - 1; i > 0; i--) {
      x = (x * 9301 + 49297) % 233280;
      const r = Math.floor((x / 233280) * (i + 1));
      const tt = seq[i]; seq[i] = seq[r]; seq[r] = tt;
    }
    return seq;
  });
}

export default function RateDemo() {
  const [ref, started] = useInView<HTMLDivElement>(0.3);
  const seqs = useMemo(buildSeqs, []);
  const [counts, setCounts] = useState<number[]>(CATS.map(() => 0));
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState(false);
  const [premReady, setPremReady] = useState(false);
  const [coverReady, setCoverReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) { setCounts(CATS.map(() => PER)); setDone(true); setPremReady(true); setCoverReady(true); }
  }, []);

  useEffect(() => {
    if (!started || prefersReducedMotion()) return;
    let t: ReturnType<typeof setTimeout>;
    const subs: ReturnType<typeof setTimeout>[] = [];
    let c = CATS.map(() => 0);
    let step = 0;
    const total = CATS.length * PER;
    const run = () => {
      c = CATS.map(() => 0); step = 0;
      setCounts([...c]); setActive(-1); setDone(false); setPremReady(false); setCoverReady(false);
      tick();
    };
    const tick = () => {
      const n = c.reduce((a, b) => a + b, 0);
      if (n >= total) {
        setDone(true); setActive(-1);
        subs.push(setTimeout(() => setPremReady(true), 250), setTimeout(() => setCoverReady(true), 500));
        t = setTimeout(run, 7000);
        return;
      }
      const batch = step < 18 ? 1 : 3;
      let last = -1;
      for (let b = 0; b < batch && c.reduce((a, d) => a + d, 0) < total; b++) {
        const k = step % CATS.length; step++;
        if (c[k] >= PER) continue;
        c[k]++; last = k;
      }
      setCounts([...c]); if (last >= 0) setActive(last);
      t = setTimeout(tick, step < 18 ? 300 : 90);
    };
    run();
    return () => { clearTimeout(t); subs.forEach(clearTimeout); };
  }, [started]);

  let n = 0, sum = 0, fail = 0;
  const fails = counts.map((cnt, k) => {
    let f = 0;
    for (let i = 0; i < cnt; i++) { const t = seqs[k][i]; sum += SC[t]; n++; if (t < 2) { fail++; f++; } }
    return f;
  });
  const running = n > 0 && !done;
  const score = done ? 83.3 : n ? sum / n : null;
  const markPct = score === null ? 0 : Math.max(0, Math.min(1, (score - 40) / 60)) * 100;
  const status = done ? 'Complete · 5,000 cases across 24 categories' : active >= 0 ? `Testing ${CATS[active][0].toLowerCase()}…` : 'Starting test run…';

  return (
    <div className="viz bp" id="rate-demo" ref={ref} aria-label="Example rating: test cases running and the resulting Trust Score">
      <div className="tr-wrap">
        <div className="tr-tests">
          <div className="tr-leg">
            <span><i style={{ background: '#C8402E' }} />Critical</span><span><i style={{ background: '#EE9A7E' }} />Major</span>
            <span><i style={{ background: '#E8B04A' }} />Partial</span><span><i style={{ background: '#B7B3DA' }} />Pass</span>
          </div>
          <div className="tr-cats">
            {CATS.map((c, k) => (
              <div key={c[0]} className={`tr-cat ${active === k ? 'active' : ''}`}>
                <p>{c[0]}<span>{fails[k] ? `${fails[k]} failed` : ''}</span></p>
                <div className="tr-g">
                  {seqs[k].map((t, i) => <i key={i} style={{ background: i < counts[k] ? COL[t] : undefined }} />)}
                </div>
              </div>
            ))}
          </div>
          <p className="tr-status">{status}</p>
        </div>
        <div className="tr-card" aria-live="polite">
          <div className="tr-ch"><span className="tr-mono tr-name">checkout concierge</span><span className={`tr-tier ${done ? 'gold' : ''}`}>{done ? 'GOLD' : 'TESTING'}</span></div>
          <div className="tr-big"><b>{score === null ? '–' : score.toFixed(1)}</b><span className="tr-mono">TRUST SCORE</span></div>
          <div className="tr-bars"><i style={{ background: '#D9945E' }} /><i style={{ background: '#A7AEBD' }} /><i style={{ background: '#E2B33E' }} /><span className="tr-mark" style={{ left: `calc(${markPct}% - 1.5px)` }} /></div>
          <div className="tr-blab tr-mono"><span>Bronze</span><span>Silver</span><span>Gold</span></div>
          <div className="tr-kv"><span className="tr-mono">Premium</span><b className={premReady ? '' : 'tr-wait'}>{premReady ? '$2.77 / $10k' : '–'}</b></div>
          <div className="tr-kv"><span className="tr-mono">Cover · cap</span><b className={coverReady ? '' : 'tr-wait'}>{coverReady ? 'Standard · $5,000' : '–'}</b></div>
          <div className="tr-kv"><span className="tr-mono">Error rate</span><b>{done ? '9.64%' : n ? `${((fail / n) * 100).toFixed(1)}%` : '–'}</b></div>
          <div className="tr-kv"><span className="tr-mono">Failed cases</span><b>{done ? '482 of 5,000' : n ? `${fail} of ${n}` : '–'}</b></div>
          <div className="tr-kv"><span className="tr-mono">Release gate</span><b className="tr-red">{done ? '13 blockers open' : running ? 'Checking…' : '–'}</b></div>
        </div>
      </div>
    </div>
  );
}
