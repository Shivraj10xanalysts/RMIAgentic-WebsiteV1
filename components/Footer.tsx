import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="sf-cols">
        <div className="sf-brand"><Logo light /><p>Insurance for AI agents that move money.</p></div>
        <nav aria-label="Product"><h3>Product</h3><Link href="/#product">Insurance</Link><Link href="/#rate">Rate</Link><Link href="/#monitor">Monitor</Link></nav>
        <nav aria-label="Resources"><h3>Resources</h3><Link href="/#faq">FAQs</Link></nav>
      </div>
      <p className="sf-legal">© 2026 RMI Agentic · [Terms] · [Privacy]</p>
    </footer>
  );
}
