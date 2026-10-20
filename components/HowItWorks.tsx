'use client';
import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import SandboxCanvas from './SandboxCanvas';
import { CheckIcon } from './Icons';
import { prefersReducedMotion, useInView } from '@/lib/useInView';

const DOCS = [
  ['PDF', 'Trust Score report', 'Score, tier and every test result'],
  ['LIST', 'Fix list', 'Release blockers, most urgent first'],
  ['QUOTE', 'Premium quote', 'Your price, based on your score'],
];

export default function HowItWorks() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [cards, setCards] = useState(0);
  const [docs, setDocs] = useState(0);
  const [badge, setBadge] = useState(false);
  const [cert, setCert] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) { setCards(3); setDocs(3); setBadge(true); setCert(true); }
  }, []);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let tm: ReturnType<typeof setTimeout>[] = [];
    const T = (f: () => void, ms: number) => tm.push(setTimeout(f, ms));
    const play = () => {
      tm.forEach(clearTimeout); tm = [];
      setCards(0); setDocs(0); setBadge(false); setCert(false);
      T(() => setCards(1), 200);
      T(() => setCards(2), 1500);
      [1, 2, 3].forEach((n, i) => T(() => setDocs(n), 2000 + i * 380));
      T(() => setCards(3), 3600);
      T(() => setBadge(true), 4000);
      T(() => setCert(true), 4500);
      T(play, 14000);
    };
    play();
    return () => tm.forEach(clearTimeout);
  }, [inView]);

  return (
    <section className="sec" id="how-it-works">
      <Reveal as="p" className="lab lab-big"><i aria-hidden="true" />How it works</Reveal>
      <Reveal as="h2">Get covered in three steps.</Reveal>
      <div className="hw-cols" ref={ref}>
        <article className={`hw-card ${cards >= 1 ? 'on' : ''}`}>
          <h3><span className="hw-num">Step 1</span>Connect your agent</h3>
          <div className="lc hw-connect" role="img" aria-label="Your agent connected to the RMI adversarial sandbox, which contains a merchant, a payment network and an identity check">
            <div className="hw-connect-h"><span className="lc-pill vi"><CheckIcon />CONNECTED</span></div>
            <SandboxCanvas />
          </div>
        </article>
        <article className={`hw-card ${cards >= 2 ? 'on' : ''}`}>
          <h3><span className="hw-num">Step 2</span>Get your report</h3>
          <div className="hw-docs">
            {DOCS.map((d, i) => (
              <div key={d[1]} className="hw-doc" style={{ opacity: docs > i ? 1 : 0, transform: `translateY(${docs > i ? i * 44 : 20}px)` }}>
                <span className="hw-ic">{d[0]}</span><b>{d[1]}</b><span>{d[2]}</span>
              </div>
            ))}
          </div>
        </article>
        <article className={`hw-card ${cards >= 3 ? 'on' : ''}`}>
          <h3><span className="hw-num">Step 3</span>Go live, insured</h3>
          <div className={`hw-badge ${badge ? 'on' : ''}`}>
            <svg width="30" height="34" viewBox="0 0 28 32" aria-hidden="true"><path d="M14 1.5 26 5.5V15c0 7.6-5.2 13.2-12 15.8C7.2 28.2 2 22.6 2 15V5.5Z" fill="#4B3FA8" /><path d="M9 16l3.5 3.5L19 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div><b>RMI Trust Score</b><span>GOLD · VERIFIED</span></div>
          </div>
          <div className={`hw-cert ${cert ? 'on' : ''}`}><b>Policy certificate</b> · Active</div>
        </article>
      </div>
    </section>
  );
}
