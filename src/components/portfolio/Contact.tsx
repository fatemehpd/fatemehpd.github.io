import { PROFILE } from '../../content/cv';
import { CopyEmail, ExternalLink } from './ui';

export default function Contact() {
  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="glass glass--strong contact">
          <p className="sec-head__eyebrow">Contact</p>
          <h2 className="contact__title" id="contact-title">
            Say <em>hello</em>
          </h2>
          <p className="contact__text">
            Email is the quickest way to reach me. I’m also on LinkedIn.
          </p>
          <div className="contact__actions">
            <CopyEmail email={PROFILE.email} />
            <ExternalLink className="btn-glass" href={PROFILE.linkedin}>
              LinkedIn
            </ExternalLink>
          </div>
        </div>
        <footer className="footer">
          <span>© 2026 {PROFILE.name}</span>
          <a href="#top">Back to top</a>
        </footer>
      </div>
    </section>
  );
}
