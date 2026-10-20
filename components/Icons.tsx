const base = { viewBox: '0 0 12 12', width: '1em', height: '1em', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const CheckIcon = () => <svg {...base} className="ico"><path d="M2 6.4l2.7 2.7L10 3.4" /></svg>;
export const FlagIcon = () => <svg {...base} className="ico" strokeWidth={1.5}><path d="M3 10.5V1.8M3 2.2h6l-1.6 2L9 6.2H3" /></svg>;
export const DotIcon = ({ blink = false }: { blink?: boolean }) => (
  <svg {...base} className={`ico ${blink ? 'ico-blink' : ''}`}><circle cx="6" cy="6" r="2.6" fill="currentColor" stroke="none" /></svg>
);
