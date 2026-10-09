import { CURRENT, FACTS, PROFILE } from '../../content/cv';
import { CopyEmail, ExternalLink, Logo, SectionHead } from './ui';

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead id="about-title" eyebrow="About" />

        <div className="about-grid">
          <article className="glass about-card">
            <div className="about-card__block">
              <h3 className="label">Research interests</h3>
              <ul className="interests" aria-label="Research interests">
                {PROFILE.interests.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>

            <p className="about-card__role">
              {PROFILE.role} at <strong>{PROFILE.affiliation}</strong>
            </p>

            <div className="about-card__contact">
              <CopyEmail email={PROFILE.email} />
              <ExternalLink className="btn-glass" href={PROFILE.linkedin}>
                LinkedIn
              </ExternalLink>
            </div>
          </article>

          <article className="glass now-card" aria-labelledby="now-title">
            <p className="now-card__status">
              <span className="pulse-dot" aria-hidden="true" /> Currently
            </p>
            <div className="now-card__org">
              <Logo id={CURRENT.logo} size="lg" />
              <div>
                <h3 className="now-card__name" id="now-title">
                  {CURRENT.org}
                </h3>
                <p className="now-card__place">{CURRENT.place}</p>
              </div>
            </div>
            <dl className="meta-list">
              <div>
                <dt>Role</dt>
                <dd>
                  {CURRENT.title} <span className="muted">· {CURRENT.since}</span>
                </dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>{CURRENT.focus}</dd>
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
                      {s.name}
                    </ExternalLink>
                  ))}
                </dd>
              </div>
            </dl>
          </article>
        </div>

        <ul className="facts" aria-label="At a glance">
          {FACTS.map((f) => (
            <li key={f.label} className="glass glass--soft fact">
              <span className="fact__value">{f.value}</span>
              <span className="fact__label">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
