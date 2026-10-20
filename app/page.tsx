import Reveal from '@/components/Reveal';
import ProductSections, { FaqSection } from '@/components/ProductSections';
import HowItWorks from '@/components/HowItWorks';
import WhySection from '@/components/WhySection';
import HookAgent from '@/components/HookAgent';

export default function Home() {
  return (
    <>
      <div className="first" id="top">
        <div className="hero">
          <div className="glass rise">
            <h1 className="rise d1">Have peace of mind while<br className="wide" /> your agents move money.</h1>
            <div className="rule rise d2" aria-hidden="true" />
            <p className="sub rise d3">Insurance that protects you and your customers<br className="wide" /> every time your AI agent pays.</p>
            <HookAgent />
          </div>
        </div>
      </div>

      <Reveal className="problem-line" id="problem">
        <p>Today, no one covers agent mistakes. <span>The loss falls on your customers.</span></p>
        <p className="enter">Until RMI Agentic.</p>
      </Reveal>

      <ProductSections />
      <HowItWorks />
      <WhySection />
      <FaqSection />
    </>
  );
}
