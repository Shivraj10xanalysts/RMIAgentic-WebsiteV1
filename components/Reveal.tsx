'use client';
import { createElement } from 'react';
import { useInView } from '@/lib/useInView';

type Props = { children: React.ReactNode; className?: string; delay?: number; id?: string; as?: 'div' | 'p' | 'h2' | 'section' };

export default function Reveal({ children, className = '', delay = 0, id, as = 'div' }: Props) {
  const [ref, inView] = useInView<HTMLElement>(0.05);
  return createElement(
    as,
    { ref, id, className: `reveal ${inView ? 'in' : ''} ${className}`.trim(), style: delay ? { transitionDelay: `${delay}s` } : undefined },
    children
  );
}
