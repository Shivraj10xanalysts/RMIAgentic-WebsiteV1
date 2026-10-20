'use client';
import { Fragment, useEffect, useState } from 'react';
import { CheckIcon, DotIcon, FlagIcon } from './Icons';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

const P: [string, string, boolean][] = [
  ['Groceries · FreshCart', '$84.20', false],
  ['Flight · SkyFare', '$412.00', false],
  ['Gift cards · unknown store', '$2,500.00', true],
  ['Gift cards · unknown store', '$2,500.00', true],
];

export default function MonitorDemo() {
  const [ref, started] = useInView<HTMLDivElement>(0.3);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) setShown(P.length);
  }, []);

  useEffect(() => {
    if (!started || prefersReducedMotion()) return;
    let t: ReturnType<typeof setTimeout>;
    const step = (i: number) => {
      if (i >= P.length) { t = setTimeout(() => { setShown(0); step(0); }, 6000); return; }
      t = setTimeout(() => { setShown(i + 1); step(i + 1); }, 1100);
    };
    setShown(0); step(0);
    return () => clearTimeout(t);
  }, [started]);

  const rows = P.slice(0, shown);
  const alerted = rows.some((r) => r[2]);

  return (
    <div className="viz bp" id="mon-demo" ref={ref} aria-label="Example: live payments, with an alert on a suspicious payment">
      <div className="lc">
        <div className="lc-h">
          <div className="lc-t">
            <span className="lc-th"><svg viewBox="0 0 24 24" fill="none" stroke="#4B3FA8" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" fill="#4B3FA8" /></svg></span>
            <b>Live payments<br />checkout concierge</b>
          </div>
          <span className={`lc-pill ${alerted ? 'bad' : 'ok blink'}`}>{alerted ? <FlagIcon /> : <DotIcon blink />}{alerted ? 'ALERTED' : 'MONITORING'}</span>
        </div>
        <p className="lc-sum">{alerted ? 'Agent builder alerted' : 'Watching every payment'}</p>
        <div className="lc-kv lc-feed">
          {rows.map((r, i) => (
            <Fragment key={i}>
              <span>{r[0]} · {r[1]}</span>
              <b className={r[2] ? 'r' : 'g'}>{r[2] ? <FlagIcon /> : <CheckIcon />}{r[2] ? 'Alerted' : 'Cleared'}</b>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
