import ContactForm from '@/components/ContactForm';

export const metadata = { title: 'Contact us — RMI Agentic' };

export default function Contact() {
  return (
    <section className="contact-view" id="contact" aria-labelledby="contact-title">
      <div className="cv-wrap">
        <h1 className="cv-title" id="contact-title">Contact us</h1>
        <p className="cv-sub">Tell us a little about you, and we’ll get back to you shortly.</p>
        <ContactForm />
      </div>
    </section>
  );
}
