import Link from 'next/link';
import Reveal from './Reveal';
import RateDemo from './RateDemo';
import MonitorDemo from './MonitorDemo';
import { CheckIcon } from './Icons';

export default function ProductSections() {
  return (
    <section className="sec" id="product">
      <div className="fx fx-insure fx-first fx-top">
        <Reveal>
          <p className="lab lab-big"><i aria-hidden="true" />Product</p>
          <h2 className="h-sub">Insurance for when your agent gets it wrong.</h2>
          <div className="ben-list">
            <div className="ben"><b>Get paid back when an agent payment goes wrong.</b><span>Real recourse for you and your customers.</span></div>
            <div className="ben"><b>Win users who won’t let agents pay today.</b><span>25 points higher adoption, 5× higher payment values.*</span></div>
          </div>
          <p className="in-note">* Source: RMI Agentic research, May 2026.</p>
        </Reveal>
        <Reveal className="bp-col" delay={0.1}>
          <div className="viz bp" aria-label="Example insurance policy and claim">
            <div className="lc">
              <div className="lc-h">
                <div className="lc-t">
                  <span className="lc-th"><svg viewBox="0 0 28 32"><path d="M14 1.5 26 5.5V15c0 7.6-5.2 13.2-12 15.8C7.2 28.2 2 22.6 2 15V5.5Z" fill="#4B3FA8" /><path d="M9 16l3.5 3.5L19 12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <b style={{ color: 'var(--frame-color)', whiteSpace: 'nowrap' }}>Policy · checkout concierge</b>
                </div>
                <span className="lc-pill ok"><CheckIcon />COVERED</span>
              </div>
              <p className="lc-sum">$2.77 per $10,000 covered</p>
              <div className="lc-kv">
                <span>Trust Score</span><b>83.3 · Gold</b>
                <span>Cover</span><b>Standard</b>
                <span>Per-txn cap</span><b>$5,000</b>
                <span>Monitoring</span><b>Live</b>
                <span>Claim #48213</span><b className="g"><CheckIcon />Paid · liability $0</b>
              </div>
            </div>
          </div>
          <p className="figcap"><em>A policy: your Trust Score sets the price, and claims are paid, not argued.</em> <span>Illustrative policy. Premium from our V6.1 pricing model.</span></p>
        </Reveal>
      </div>

      <Reveal className="powered">
        <h3>Powered by two features: Rate and Monitor.</h3>
      </Reveal>

      <div className="fx fx-rate" id="rate">
        <Reveal>
          <p className="tag"><i aria-hidden="true" />Rate</p>
          <h3>We test and rate your agent. You pay less.</h3>
          <div className="ben"><b>Know the risks before launch.</b><span>Adversarial testing finds exactly where your agent is weak.</span></div>
          <div className="ben"><b>Lower your premium.</b><span>Fix weak spots, raise your Trust Score, pay less.</span></div>
        </Reveal>
        <Reveal className="bp-col" delay={0.1}>
          <RateDemo />
          <p className="figcap"><em>A rating run: thousands of adversarial tests become one Trust Score and a premium.</em> <span>Illustrative rating from our V6.1 rating model.</span></p>
        </Reveal>
      </div>

      <div className="fx" id="monitor">
        <Reveal>
          <p className="tag"><i aria-hidden="true" />Monitor</p>
          <h3>Your agent works 24/7. So do we.</h3>
          <div className="ben"><b>Stop the damage before it spreads.</b><span>We alert you the moment your agent behaves unusually, so you can act before one bad payment becomes a hundred.</span></div>
          <div className="ben"><b>Know when your agent’s behavior changes.</b><span>Get alerted the moment it becomes riskier than when it was rated.</span></div>
        </Reveal>
        <Reveal className="bp-col" delay={0.1}>
          <MonitorDemo />
          <p className="figcap"><em>Live monitoring: unusual spending is caught as it happens.</em> <span>Illustration only.</span></p>
        </Reveal>
      </div>
    </section>
  );
}

const Q = ({ q, children }: { q: string; children: React.ReactNode }) => (
  <details><summary>{q}<span className="plus" aria-hidden="true" /></summary><p>{children}</p></details>
);

export function FaqSection() {
  return (
    <section className="sec" id="faq">
      <Reveal as="p" className="lab lab-big"><i aria-hidden="true" />FAQs</Reveal>
      <div className="faq">
        <Reveal className="qs" delay={0.1}>
          <p className="faq-group">Coverage</p>
          <Q q="What kinds of agent mistakes are covered?">Covered errors include buying the wrong item, paying the wrong amount, duplicate payments, and purchases triggered by prompt injection. <strong>Deliberate misuse and losses outside your agent’s actions aren’t covered.</strong> Full details are in your policy.</Q>
          <Q q="What happens when our agent makes a mistake?">Your customers are reimbursed for covered agent errors, helping limit your liability. <Link href="/contact" style={{ color: 'var(--frame-color)' }}>Contact the RMI Agentic team</Link> to discuss the details.</Q>
          <p className="faq-group">Testing and your Trust Score</p>
          <Q q="How is this different from red‑teaming or the testing we already do?">Testing tells you what broke. We turn the results into a Trust Score, a premium and insurance cover, built for agents that move money.</Q>
          <Q q="How is the Trust Score calculated?">We run thousands of adversarial test cases, covering risks like prompt injection, wrong orders and excessive agency. Each failure is weighted by its severity and the amount of money at stake. The full methodology is summarized in your Trust Score report.</Q>
          <Q q="What happens to our score when we update our model or tools?">We re‑rate your agent when its model or tools change. Live monitoring alerts you if an update makes it riskier.</Q>
          <p className="faq-group">Safety and integration</p>
          <Q q="Do you ever touch real money or live payments?">No. Testing runs in your sandbox, with test credentials and simulated merchants. In production, we observe your agent’s actions but never initiate payments.</Q>
          <Q q="Does monitoring slow down our agent’s payments?">No. We analyze your agent’s traces alongside it, not in its payment path, so payments run at full speed.</Q>
          <Q q="Which frameworks and payment rails do you support?">Any framework that emits standard traces, such as LangGraph, the OpenAI Agents SDK or CrewAI. For payments, we support <strong>[Stripe, card networks’ agent programs and others]</strong>. Using something else? Talk to us. We can usually still work with you.</Q>
          <p className="faq-group">Getting started</p>
          <Q q="Our agent isn’t live yet. Can we start early?">Yes, and it’s the best time to. Weak spots are cheapest to fix before launch, and a higher score at launch means a lower premium from day one.</Q>
        </Reveal>
      </div>
    </section>
  );
}
