'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const path = usePathname().replace(/\/$/, '') || '/';
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const mm = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (path !== '/') { setSection(null); return; }
      let cur: string | null = null;
      const y = window.innerHeight * 0.35;
      ['product', 'how-it-works', 'why', 'faq'].forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < y) cur = id;
      });
      setSection(cur);
    };
    const close = () => { if (mm.current) mm.current.open = false; };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onDoc = (e: MouseEvent) => { if (mm.current?.open && !mm.current.contains(e.target as Node)) close(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDoc);
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); document.removeEventListener('keydown', onKey); document.removeEventListener('click', onDoc); };
  }, [path]);

  const closeMenu = () => { if (mm.current) mm.current.open = false; };
  const onLogo = () => { if (path === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <header className={`top ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" aria-label="RMI Agentic, home" style={{ textDecoration: 'none', display: 'inline-flex', alignSelf: 'flex-start' }} onClick={onLogo}><Logo /></Link>
      <nav className="menu" aria-label="Main">
        <Link href="/#product" className={section === 'product' ? 'is-active' : ''}><i aria-hidden="true" />Product</Link>
        <Link href="/cover-cost" className={path === '/cover-cost' ? 'is-active' : ''}><i aria-hidden="true" />Cover cost</Link>
        <Link className="contact-link" href="/contact">Contact us</Link>
        <details className="mm" ref={mm}>
          <summary className="menu-toggle"><span className="mt-lines" aria-hidden="true"><i /><i /></span>Menu</summary>
          <nav className="mobile-menu" aria-label="Mobile" onClick={closeMenu}>
            <Link href="/#product">Product</Link>
            <Link href="/cover-cost">Cover cost</Link>
            <Link href="/contact" style={{ color: 'var(--frame-color)' }}>Contact us</Link>
          </nav>
        </details>
      </nav>
    </header>
  );
}
