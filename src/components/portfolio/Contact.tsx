import { PROFILE } from '../../content/cv';
import { ContactLinks } from './ui';

export default function Contact() {
  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="glass card contact">
          <div>
            <p className="label">Contact</p>
            <h2 className="contact__title" id="contact-title">
              Get in touch
            </h2>
          </div>
          <ContactLinks />
        </div>
        <footer className="footer">
          <span>© 2026 {PROFILE.name}</span>
          <a href="#top">Back to top</a>
        </footer>
      </div>
    </section>
  );
}
