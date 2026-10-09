import { CURRENT, FACTS, PROFILE } from '../../content/cv';
import { ContactLinks, ExternalLink, Logo, SectionHead } from './ui';

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead id="about-title" eyebrow="About" />

        <div className="about-grid">
          <article className="glass card about-card">
            <h3 className="label">Research interests</h3>
            <ul className="interests" aria-label="Research interests">
              {PROFILE.interests.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <p className="about-card__role">
              {PROFILE.role} at <strong>{PROFILE.affiliation}</strong>
            </p>
            <ul className="facts" aria-label="At a glance">
              {FACTS.map((f) => (
                <li key={f.label}>
                  <strong className="tnum">{f.value}</strong> {f.label}
                </li>
              ))}
            </ul>
            <ContactLinks />
          </article>

          <article className="glass card now-card" aria-labelledby="now-title">
            <p className="now-card__status">
              <span className="pulse-dot" aria-hidden="true" /> Currently
            </p>
            <div className="org">
              <Logo id={CURRENT.logo} size="md" />
              <div>
                <h3 className="org__name" id="now-title">
                  {CURRENT.org}
                </h3>
                <p className="org__place">
                  {CURRENT.title} · {CURRENT.place}
                </p>
              </div>
            </div>
            <dl className="meta-list">
              <div>
                <dt>Since</dt>
                <dd className="tnum">{CURRENT.since.replace(' – present', '')}</dd>
              </div>
              <div>
                <dt>Thesis</dt>
                <dd>{CURRENT.thesis}</dd>
              </div>
              <div>
                <dt>Supervisors</dt>
                <dd className="link-list">
                  {CURRENT.supervisors.map((s) => (
                    <ExternalLink key={s.name} className="text-link" href={s.url}>
                      {s.name.replace('Prof. ', '')}
                    </ExternalLink>
                  ))}
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
