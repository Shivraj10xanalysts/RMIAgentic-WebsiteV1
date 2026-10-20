import ContactForm from '@/components/ContactForm';

export const metadata = { title: 'Contact us — RMI Agentic' };

const CALENDLY = 'https://calendly.com/tank-rmiagentic/introduction-to-rmi-agentic';

export default function Contact() {
  return (
    <section className="contact-view" id="contact" aria-labelledby="contact-title">
      <div className="cv-wrap">
        <h1 className="cv-title" id="contact-title">Contact us</h1>
        <div className="cv-choices" aria-label="How would you like to reach us?">
          <span className="cv-choice is-on" aria-current="page">Contact us</span>
          <a className="cv-choice" href={CALENDLY} target="_blank" rel="noopener noreferrer">Talk to the founders <span aria-hidden="true">↗</span></a>
        </div>
        <p className="cv-sub">Tell us a little about you, and we’ll get back to you shortly.</p>
        <ContactForm />
      </div>
    </section>
  );
}
