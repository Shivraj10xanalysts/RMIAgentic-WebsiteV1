import type { Metadata } from 'next';
import { Inter, Literata, Geist_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--f-inter', display: 'swap' });
const lit = Literata({ subsets: ['latin'], axes: ['opsz'], style: ['normal', 'italic'], variable: '--f-lit', display: 'swap' });
const geist = Geist_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--f-geist', display: 'swap' });

export const metadata: Metadata = {
  title: 'RMI Agentic — Insurance for AI agents that handle your money',
  description: 'Insurance that protects you and your customers every time your AI agent pays.',
  openGraph: { title: 'RMI Agentic — Insurance for AI agents that handle your money', description: 'Insurance that protects you and your customers every time your AI agent pays.', type: 'website' },
  icons: { icon: '/rmi-logo-dark.svg', apple: '/rmi-logo-dark.svg' },
};

export const viewport = { themeColor: '#4B3FA8' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lit.variable} ${geist.variable}`}>
      <body>
        <noscript><style>{'.reveal{opacity:1!important;transform:none!important}'}</style></noscript>
        <a className="skip" href="#main">Skip to content</a>
        <ScrollProgress />
        <div className="page">
          <Header />
          <main id="main" className="page-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
