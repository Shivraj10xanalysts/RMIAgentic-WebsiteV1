import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_TO = 'tank@rmiagentic.com,shivraj@10xanalysts.com';

// Very small in-memory rate limit: 5 messages per 10 minutes per IP.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field. Pretend success to bots.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160);
  const role = clean(body.role, 80);
  const message = clean(body.message, 4000);

  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter your name and a valid email.' }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER } = process.env;
  const SMTP_PASS = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_FROM;
  const to = (process.env.CONTACT_TO || DEFAULT_TO).split(',').map((s) => s.trim()).filter(Boolean);

  const subject = `New contact from ${name}${company ? ` (${company})` : ''}`;
  const text = [`Name: ${name}`, `Email: ${email}`, `Company: ${company || '-'}`, `I am a: ${role || '-'}`, '', message || '(no message)'].join('\n');
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">
<tr><td><b>Name</b></td><td>${esc(name)}</td></tr>
<tr><td><b>Email</b></td><td>${esc(email)}</td></tr>
<tr><td><b>Company</b></td><td>${esc(company || '-')}</td></tr>
<tr><td><b>I am a</b></td><td>${esc(role || '-')}</td></tr>
<tr><td valign="top"><b>Message</b></td><td>${esc(message || '(no message)').replace(/\n/g, '<br>')}</td></tr></table>`;

  // No SMTP configured: in development just log the message so the form can be tested.
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[contact] SMTP not configured, message not sent:\n' + subject + '\n' + text);
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error('[contact] SMTP_HOST, SMTP_USER and SMTP_PASS must be set.');
    return NextResponse.json({ error: 'Email is not configured on the server.' }, { status: 500 });
  }

  try {
    const port = Number(SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] send failed:', err);
    return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 502 });
  }
}
