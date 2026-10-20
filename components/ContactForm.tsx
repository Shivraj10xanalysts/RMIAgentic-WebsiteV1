'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [errs, setErrs] = useState<{ n?: boolean; e?: boolean }>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const d = new FormData(form);
    const n = String(d.get('name') || '').trim();
    const e = String(d.get('email') || '').trim();
    const bad = { n: !n, e: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) };
    setErrs(bad);
    if (bad.n || bad.e) return;

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(d.entries())),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <form className="cv-form" onSubmit={onSubmit} noValidate>
      <p className="sr-only" aria-hidden="true"><label>Leave this empty <input name="website" tabIndex={-1} autoComplete="off" /></label></p>
      <div className={`cv-f ${errs.n ? 'err' : ''}`}><label htmlFor="cv-n">Name</label><input id="cv-n" name="name" autoComplete="name" placeholder="Your name" required /></div>
      <div className={`cv-f ${errs.e ? 'err' : ''}`}><label htmlFor="cv-e">Work email</label><input id="cv-e" name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></div>
      <div className="cv-f"><label htmlFor="cv-c">Company</label><input id="cv-c" name="company" autoComplete="organization" placeholder="Company name" /></div>
      <div className="cv-f"><label htmlFor="cv-r">I am a</label>
        <select id="cv-r" name="role"><option>Agent builder</option><option>Merchant or marketplace</option><option>Investor</option><option>Insurance or payments partner</option><option>Other</option></select>
      </div>
      <div className="cv-f"><label htmlFor="cv-m">Message (optional)</label><textarea id="cv-m" name="message" placeholder="One or two lines is plenty" /></div>
      <button className="cv-btn" type="submit" disabled={status === 'sending' || status === 'sent'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
      {status === 'sent' && <p className="cv-ok" role="status">Thanks. We’ll be in touch soon.</p>}
      {status === 'error' && <p className="cv-ok" role="alert" style={{ color: '#C8402E' }}>{error} You can also email us at tank@rmiagentic.com.</p>}
    </form>
  );
}
